import { int, mysqlTable, primaryKey, tinyint, datetime, index } from 'drizzle-orm/mysql-core';
import { groups } from './group.js';
import { students } from './student.js';

export const groupMembers = mysqlTable(
  'GroupMember',
  {
    studentId: int('student_id')
      .notNull()
      .references(() => students.id),
    groupId: int('group_id')
      .notNull()
      .references(() => groups.id),
    isLeader: tinyint('is_leader').notNull().default(0),
    joinedAt: datetime('joined_at', { mode: 'date' }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.groupId] }),
    index('fk_GroupMember_Group1_idx').on(table.groupId),
  ],
);
