import { datetime, int, json, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const projects = mysqlTable('Project', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 45 }).notNull(),
  description: text('description').notNull(),
  dependencyManager: varchar('dependency_manager', { length: 15 }).notNull(),
  tecnologies: json('tecnologies').notNull(),
  repositoryType: mysqlEnum('repository_type', ['Monorepo', 'Multirepo']).notNull(),
  createdAt: datetime('created_at', { mode: 'date' }).notNull(),
  updatedAt: datetime('updated_at', { mode: 'date' }).notNull(),
  deletedAt: datetime('deleted_at', { mode: 'date' }),
});
