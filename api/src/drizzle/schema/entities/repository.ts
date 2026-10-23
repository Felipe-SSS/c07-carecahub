import { datetime, index, int, mysqlTable, tinyint, varchar } from 'drizzle-orm/mysql-core';
import { projects } from './project.js';

export const repositories = mysqlTable(
  'Repository',
  {
    id: int('id').autoincrement().primaryKey(),
    projectId: int('project_id')
      .notNull()
      .references(() => projects.id),
    githubUrl: varchar('github_url', { length: 50 }).notNull(),
    includedInOrganization: tinyint('included_in_organization').notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' }).notNull(),
    deletedAt: datetime('deleted_at', { mode: 'date' }),
  },
  (table) => [index('fk_Repository_Project1_idx').on(table.projectId)],
);
