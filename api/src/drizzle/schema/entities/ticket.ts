import {
  datetime,
  index,
  int,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';
import { projects } from './project.js';
import { users } from './user.js';

export const tickets = mysqlTable(
  'Ticket',
  {
    id: int('id').autoincrement().primaryKey(),
    projectId: int('project_id')
      .notNull()
      .references(() => projects.id),
    assigneeId: int('assignee_id').references(() => users.id),
    creatorId: int('creator_id')
      .notNull()
      .references(() => users.id),
    title: varchar('title', { length: 45 }).notNull(),
    description: text('description'),
    dueDate: datetime('due_date', { mode: 'date' }),
    column: varchar('column', { length: 15 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' }).notNull(),
    deletedAt: datetime('deleted_at', { mode: 'date' }),
  },
  (table) => [
    uniqueIndex('id_UNIQUE').on(table.id),
    index('fk_Ticket_Project1_idx').on(table.projectId),
    index('fk_Ticket_User1_idx').on(table.creatorId),
    index('fk_Ticket_User2_idx').on(table.assigneeId),
  ],
);
