import { relations } from 'drizzle-orm';
import { groupMembers } from './group-member.js';
import { groups } from './group.js';
import { mentors } from './mentor.js';
import { projects } from './project.js';
import { repositories } from './repository.js';
import { students } from './student.js';
import { teachers } from './teacher.js';
import { tickets } from './ticket.js';
import { users } from './user.js';

export const usersRelations = relations(users, ({ many, one }) => ({
  mentor: one(mentors),
  student: one(students),
  teacher: one(teachers),
  createdTickets: many(tickets, { relationName: 'ticketCreator' }),
  assignedTickets: many(tickets, { relationName: 'ticketAssignee' }),
}));

export const mentorsRelations = relations(mentors, ({ one }) => ({
  user: one(users, { fields: [mentors.id], references: [users.id] }),
}));

export const studentsRelations = relations(students, ({ many, one }) => ({
  user: one(users, { fields: [students.id], references: [users.id] }),
  groupMembers: many(groupMembers),
}));

export const teachersRelations = relations(teachers, ({ one }) => ({
  user: one(users, { fields: [teachers.id], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  group: one(groups),
  repositories: many(repositories),
  tickets: many(tickets),
}));

export const groupsRelations = relations(groups, ({ many, one }) => ({
  project: one(projects, { fields: [groups.projectId], references: [projects.id] }),
  groupMembers: many(groupMembers),
}));

export const repositoriesRelations = relations(repositories, ({ one }) => ({
  project: one(projects, { fields: [repositories.projectId], references: [projects.id] }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  project: one(projects, { fields: [tickets.projectId], references: [projects.id] }),
  creator: one(users, {
    fields: [tickets.creatorId],
    references: [users.id],
    relationName: 'ticketCreator',
  }),
  assignee: one(users, {
    fields: [tickets.assigneeId],
    references: [users.id],
    relationName: 'ticketAssignee',
  }),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  student: one(students, { fields: [groupMembers.studentId], references: [students.id] }),
  group: one(groups, { fields: [groupMembers.groupId], references: [groups.id] }),
}));
