import {
  varchar,
  boolean,
  timestamp,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { teams } from "./teams";
import { users } from "@/lib/db/schema/auth";
import { type getUsersToTeams } from "@/lib/api/usersToTeams/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { relations } from "drizzle-orm";

/**
 * teamsToUsers represents a many-to-many relationship between teams and users.
 */
export const usersToTeams = pgTable(
  "users_to_teams",
  {
    id: varchar("id", { length: 191 }).$defaultFn(() => nanoid()),
    teamId: varchar("team_id", { length: 256 })
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
    /** Indicates if the user is an admin of the team */
    isAdmin: boolean("is_admin").notNull().default(false),
    userId: varchar("user_id", { length: 256 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (usersToTeam) => ({
    pk: primaryKey({
      columns: [usersToTeam.userId, usersToTeam.teamId],
    }),
  })
);

export const usersToTeamsRelations = relations(usersToTeams, ({ one }) => ({
  team: one(teams, {
    fields: [usersToTeams.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [usersToTeams.userId],
    references: [users.id],
  }),
}));

// Schema for usersToTeams - used to validate API requests
const baseSchema = createSelectSchema(usersToTeams).omit(timestamps);

export const insertUsersToTeamSchema =
  createInsertSchema(usersToTeams).omit(timestamps);
export const insertUsersToTeamParams = baseSchema
  .extend({
    teamId: z.coerce.string().min(1),
    isAdmin: z.coerce.boolean(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateUsersToTeamSchema = baseSchema;
export const updateUsersToTeamParams = baseSchema
  .extend({
    teamId: z.coerce.string().min(1),
    isAdmin: z.coerce.boolean(),
  })
  .omit({
    userId: true,
  });
export const usersToTeamIdSchema = baseSchema.pick({ id: true });

// Types for usersToTeams - used to type API request params and within Components
export type UsersToTeam = typeof usersToTeams.$inferSelect;
export type NewUsersToTeam = z.infer<typeof insertUsersToTeamSchema>;
export type NewUsersToTeamParams = z.infer<typeof insertUsersToTeamParams>;
export type UpdateUsersToTeamParams = z.infer<typeof updateUsersToTeamParams>;
export type UsersToTeamId = z.infer<typeof usersToTeamIdSchema>["id"];

// this type infers the return from getUsersToTeams() - meaning it will include any joins
export type CompleteUsersToTeam = Awaited<
  ReturnType<typeof getUsersToTeams>
>["usersToTeams"][number];
