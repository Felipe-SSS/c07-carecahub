export * from './schema/entities/index.js';
export { schema } from './schema.js';

export type User = typeof import('./schema/entities/user.js').users.$inferSelect;
export type NewUser = typeof import('./schema/entities/user.js').users.$inferInsert;
export type Project = typeof import('./schema/entities/project.js').projects.$inferSelect;
export type NewProject = typeof import('./schema/entities/project.js').projects.$inferInsert;
export type Group = typeof import('./schema/entities/group.js').groups.$inferSelect;
export type NewGroup = typeof import('./schema/entities/group.js').groups.$inferInsert;
export type Ticket = typeof import('./schema/entities/ticket.js').tickets.$inferSelect;
export type NewTicket = typeof import('./schema/entities/ticket.js').tickets.$inferInsert;
