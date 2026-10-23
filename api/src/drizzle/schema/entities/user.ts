import { datetime, int, mysqlTable, text, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'User',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 45 }).notNull(),
    email: varchar('email', { length: 45 }).notNull(),
    password: text('password').notNull(),
    github: varchar('github', { length: 15 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' }).notNull(),
    deletedAt: datetime('deleted_at', { mode: 'date' }),
  },
  (table) => [uniqueIndex('email_UNIQUE').on(table.email)],
);
