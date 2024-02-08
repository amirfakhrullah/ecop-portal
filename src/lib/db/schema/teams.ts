import { text, varchar, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { companies } from "./companies";
import { type getTeams } from "@/lib/api/teams/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { relations } from "drizzle-orm";
import { usersToTeams } from "./usersToTeams";

export const teamRoleType = pgEnum("team_role_type", [
  "CLIENT",
  "OPS",
  "SALES",
  "ADMIN",
]);

/**
 * teams table represents a collection or group within the system.
 */
export const teams = pgTable("teams", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  companyId: varchar("company_id", { length: 256 })
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  roleType: teamRoleType("role_type").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  usersToTeams: many(usersToTeams),
  // teamsToTeams: many(teamsToTeams),
  // teamsToTeams1: many(teamsToTeams),
  // teamsToTeams2: many(teamsToTeams),
}));

// Schema for teams - used to validate API requests
const baseSchema = createSelectSchema(teams).omit(timestamps);

export const insertTeamSchema = createInsertSchema(teams).omit(timestamps);
export const insertTeamParams = baseSchema
  .extend({
    companyId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateTeamSchema = baseSchema;
export const updateTeamParams = baseSchema.extend({
  companyId: z.coerce.string().min(1),
});
export const teamIdSchema = baseSchema.pick({ id: true });

// Types for teams - used to type API request params and within Components
export type Team = typeof teams.$inferSelect;
export type NewTeam = z.infer<typeof insertTeamSchema>;
export type NewTeamParams = z.infer<typeof insertTeamParams>;
export type UpdateTeamParams = z.infer<typeof updateTeamParams>;
export type TeamId = z.infer<typeof teamIdSchema>["id"];

// this type infers the return from getTeams() - meaning it will include any joins
export type CompleteTeam = Exclude<
  Awaited<ReturnType<typeof getTeams>>[number]["teams"],
  null
>;
