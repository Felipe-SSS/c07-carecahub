import { ConflictException, NotFoundException } from '@nestjs/common';
import type { User } from '@db';
import { comparePassword, hashPassword } from '@/utils/password.js';
import { MySqlDialect } from 'drizzle-orm/mysql-core';
import type { SQL } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import type { DrizzleService } from '@/providers/drizzle/drizzle.service.js';
import { UserService } from './user.service.js';

const plainPassword = 'secure-password';

async function userFixture(overrides: Partial<User> = {}): Promise<User> {
  return {
    id: 7,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: await hashPassword(plainPassword),
    github: 'ada',
    createdAt: new Date('2026-10-23T10:00:00.000Z'),
    updatedAt: new Date('2026-10-23T10:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function createServiceFake({
  selectResults = [],
  insertIds = [{ id: 7 }],
  insertError,
  updateError,
}: {
  selectResults?: unknown[][];
  insertIds?: { id: number }[];
  insertError?: unknown;
  updateError?: unknown;
} = {}) {
  const insertedValues: Record<string, unknown>[] = [];
  const updatedValues: Record<string, unknown>[] = [];
  const selectedFields: Record<string, unknown>[] = [];
  const whereConditions: SQL[] = [];
  const updateWhereConditions: SQL[] = [];

  const db = {
    select: (fields: Record<string, unknown>) => {
      selectedFields.push(fields);

      return {
      from: () => ({
          where: async (condition: SQL) => {
            whereConditions.push(condition);

            return selectResults.shift() ?? [];
          },
      }),
      };
    },
    insert: () => ({
      values: (values: Record<string, unknown>) => {
        insertedValues.push(values);

        return {
          $returningId: async () => {
            if (insertError) {
              throw insertError;
            }

            return insertIds;
          },
        };
      },
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => {
        updatedValues.push(values);

        return {
          where: async (condition: SQL) => {
            updateWhereConditions.push(condition);

            if (updateError) {
              throw updateError;
            }
          },
        };
      },
    }),
  };

  return {
    service: new UserService({ db } as unknown as DrizzleService),
    insertedValues,
    updatedValues,
    selectedFields,
    whereConditions,
    updateWhereConditions,
  };
}

const dialect = new MySqlDialect();

function renderedSql(condition: SQL): string {
  return dialect.sqlToQuery(condition).sql;
}

describe('UserService', () => {
  it('hashes a new password and returns a public user entity', async () => {
    const user = await userFixture();
    const { service, insertedValues } = createServiceFake({
      selectResults: [[], [user]],
    });

    const created = await service.create({
      name: user.name,
      email: user.email,
      password: plainPassword,
      github: user.github,
    });

    expect(await comparePassword(plainPassword, insertedValues[0].password as string)).toBe(true);
    expect(created).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      github: user.github,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: null,
    });
    expect('password' in created).toBe(false);
  });

  it('rejects an email that belongs to a soft-deleted user', async () => {
    const deletedUser = await userFixture({ deletedAt: new Date('2026-10-23T11:00:00.000Z') });
    const { service } = createServiceFake({ selectResults: [[deletedUser]] });

    await expect(
      service.create({
        name: 'Grace Hopper',
        email: deletedUser.email,
        password: plainPassword,
        github: 'ghopper',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('translates a MySQL duplicate key into ConflictException', async () => {
    const { service } = createServiceFake({
      selectResults: [[]],
      insertError: { code: 'ER_DUP_ENTRY' },
    });

    await expect(
      service.create({
        name: 'Grace Hopper',
        email: 'grace@example.com',
        password: plainPassword,
        github: 'ghopper',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('translates a Drizzle-wrapped duplicate key during an email update', async () => {
    const storedUser = await userFixture();
    const { service } = createServiceFake({
      selectResults: [[storedUser], []],
      updateError: { cause: { errno: 1062 } },
    });

    await expect(service.update(storedUser.id, { email: 'other@example.com' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('returns only public active users from the list query', async () => {
    const user = await userFixture();
    const { service, selectedFields, whereConditions } = createServiceFake({
      selectResults: [[user]],
    });

    await expect(service.findAll()).resolves.toEqual([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        github: user.github,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      },
    ]);
    expect(selectedFields[0]).not.toHaveProperty('password');
    expect(renderedSql(whereConditions[0])).toContain('`User`.`deleted_at` is null');
  });

  it('treats an absent or soft-deleted user as not found', async () => {
    const { service, whereConditions } = createServiceFake({ selectResults: [[]] });

    await expect(service.findOne(7)).rejects.toBeInstanceOf(NotFoundException);
    expect(renderedSql(whereConditions[0])).toContain('`User`.`deleted_at` is null');
  });

  it('updates fields without rewriting an omitted password', async () => {
    const storedUser = await userFixture();
    const updatedUser = { ...storedUser, name: 'Ada King' };
    const { service, updatedValues, whereConditions } = createServiceFake({
      selectResults: [[storedUser], [updatedUser]],
    });

    const updated = await service.update(storedUser.id, { name: updatedUser.name });

    expect(updated.name).toBe(updatedUser.name);
    expect('password' in updated).toBe(false);
    expect(updatedValues[0]).not.toHaveProperty('password');
    expect(renderedSql(whereConditions[0])).toContain('`User`.`deleted_at` is null');
  });

  it('rejects an update email that belongs to a soft-deleted user', async () => {
    const storedUser = await userFixture();
    const deletedUser = await userFixture({
      id: 8,
      email: 'deleted@example.com',
      deletedAt: new Date('2026-10-23T11:00:00.000Z'),
    });
    const { service, updatedValues } = createServiceFake({
      selectResults: [[storedUser], [deletedUser]],
    });

    await expect(service.update(storedUser.id, { email: deletedUser.email })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(updatedValues).toEqual([]);
  });

  it('hashes a replacement password before updating', async () => {
    const storedUser = await userFixture();
    const { service, updatedValues } = createServiceFake({
      selectResults: [[storedUser], [storedUser]],
    });

    await service.update(storedUser.id, { password: 'another-secure-password' });

    expect(await comparePassword('another-secure-password', updatedValues[0].password as string)).toBe(
      true,
    );
  });

  it('soft deletes an active user and returns no body', async () => {
    const user = await userFixture();
    const { service, updatedValues, updateWhereConditions } = createServiceFake({
      selectResults: [[user]],
    });

    await expect(service.delete(user.id)).resolves.toBeUndefined();
    expect(updatedValues[0].deletedAt).toBeInstanceOf(Date);
    expect(renderedSql(updateWhereConditions[0])).toContain('`User`.`deleted_at` is null');
  });
});
