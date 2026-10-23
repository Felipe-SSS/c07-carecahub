import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { users } from './user.js';

export const teachers = mysqlTable('Teacher', {
  id: int('id')
    .primaryKey()
    .references(() => users.id),
  consultationHours: varchar('consultation_hours', { length: 40 }).notNull(),
});
