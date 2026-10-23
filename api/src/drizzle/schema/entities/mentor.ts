import { int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { users } from './user.js';

export const mentors = mysqlTable(
  'Mentor',
  {
    id: int('id')
      .primaryKey()
      .references(() => users.id),
    registration: int('registration').notNull(),
    consultationHours: varchar('consultation_hours', { length: 40 }).notNull(),
  },
  (table) => [uniqueIndex('registration_UNIQUE').on(table.registration)],
);
