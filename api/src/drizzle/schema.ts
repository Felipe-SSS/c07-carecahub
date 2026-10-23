export * from './schema/entities/index.js';

import {
  groupMembers,
  groupMembersRelations,
  groups,
  groupsRelations,
  mentors,
  mentorsRelations,
  projects,
  projectsRelations,
  repositories,
  repositoriesRelations,
  students,
  studentsRelations,
  teachers,
  teachersRelations,
  tickets,
  ticketsRelations,
  users,
  usersRelations,
} from './schema/entities/index.js';

export const schema = {
  users,
  usersRelations,
  mentors,
  mentorsRelations,
  students,
  studentsRelations,
  teachers,
  teachersRelations,
  projects,
  projectsRelations,
  groups,
  groupsRelations,
  repositories,
  repositoriesRelations,
  tickets,
  ticketsRelations,
  groupMembers,
  groupMembersRelations,
};

export default schema;
