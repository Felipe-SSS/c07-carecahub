import { char, int, mysqlTable, uniqueIndex } from 'drizzle-orm/mysql-core';
import { users } from './user.js';

export const students = mysqlTable(
  'Student',
  {
    id: int('id')
      .primaryKey()
      .references(() => users.id),
    registration: int('registration').notNull(),
    classroom: char('classroom', { length: 1 }).notNull(),
  },
  (table) => [uniqueIndex('registration_UNIQUE').on(table.registration)],
);
