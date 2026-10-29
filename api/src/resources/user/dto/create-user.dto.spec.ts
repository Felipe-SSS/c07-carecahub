import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { UserEntity } from '../entities/user.entity.js';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';

const validUserInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'secure-password',
  github: 'ada',
};

describe('user DTOs and public entity', () => {
  it('accepts a valid user creation payload', async () => {
    const dto = Object.assign(new CreateUserDto(), validUserInput);

    await expect(validate(dto)).resolves.toEqual([]);
  });

  it('rejects missing, malformed and overlength creation fields', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      name: '',
      email: 'not-an-email',
      password: 'short',
      github: 'g'.repeat(16),
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['name', 'email', 'password', 'github']),
    );
  });

  it('accepts an empty user update payload', async () => {
    await expect(validate(new UpdateUserDto())).resolves.toEqual([]);
  });

  it.each(['name', 'email', 'password', 'github'])('rejects explicit null for update field %s', async (field) => {
    const dto = Object.assign(new UpdateUserDto(), { [field]: null });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain(field);
  });

  it('maps a selected user without exposing its password hash', () => {
    const entity = new UserEntity({
      id: 7,
      ...validUserInput,
      password: '$2b$10$yRQJjPXXHggjs31E3NQmY.3Rnwi8FM3cS2T5Q6WlH0fJjG6lH9Jle',
      createdAt: new Date('2026-10-23T10:00:00.000Z'),
      updatedAt: new Date('2026-10-23T10:00:00.000Z'),
      deletedAt: null,
    });

    expect(entity).toEqual({
      id: 7,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      github: 'ada',
      createdAt: new Date('2026-10-23T10:00:00.000Z'),
      updatedAt: new Date('2026-10-23T10:00:00.000Z'),
      deletedAt: null,
    });
    expect('password' in entity).toBe(false);
  });
});
