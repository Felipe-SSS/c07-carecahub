import { schema } from '@db';
import * as schemaModule from './schema.js';

describe('Drizzle schema', () => {
  it('exports every table from the CarecaHub MySQL schema', () => {
    expect(schema).toMatchObject({
      users: expect.any(Object),
      mentors: expect.any(Object),
      students: expect.any(Object),
      teachers: expect.any(Object),
      projects: expect.any(Object),
      groups: expect.any(Object),
      repositories: expect.any(Object),
      tickets: expect.any(Object),
      groupMembers: expect.any(Object),
    });

    expect(schema.groupMembers).toMatchObject({
      studentId: expect.any(Object),
      groupId: expect.any(Object),
    });
    expect(schema.projects.repositoryType.enumValues).toEqual([
      'Monorepo',
      'Multirepo',
    ]);
    expect(schema.tickets.assigneeId).toEqual(
      expect.objectContaining({ notNull: false }),
    );
  });

  it('exports tables directly for Drizzle Kit', () => {
    expect(schemaModule.users).toBe(schema.users);
    expect(schemaModule.groupMembers).toBe(schema.groupMembers);
  });
});
