import { datetime, index, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { projects } from './project.js';

export const groups = mysqlTable(
  'Group',
  {
    id: int('id').autoincrement().primaryKey(),
    friendlyId: varchar('friendlyId', { length: 30 }).notNull(),
    projectId: int('project_id').references(() => projects.id),
    createdAt: datetime('created_at', { mode: 'date' }).notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' }).notNull(),
    deletedAt: datetime('deleted_at', { mode: 'date' }),
  },
  (table) => [
    index('fk_Group_Project1_idx').on(table.projectId),
    uniqueIndex('project_id_UNIQUE').on(table.projectId),
  ],
);
