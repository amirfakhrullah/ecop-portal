import {
  varchar,
  boolean,
  timestamp,
  pgTable,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { companies } from "./companies";
import { users } from "@/lib/db/schema/auth";
import { type getUsersToCompanies } from "@/lib/api/usersToCompanies/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { relations } from "drizzle-orm";

/**
 * A user belongs to a company that is either a client, supplier, or liaison.
 *
 * Permissions:
 * - A user can be an admin, which gives them ability to add and modify users in their company
 * - A user can have full access (omniprescent), which gives them ability to see and modify all client_requests, liaison_requests, supplier_responses, and liaison_responses that belong to their company
 * - If a user does not have full access, they can only see and modify client_requests, liaison_requests, supplier_responses, and liaison_responses that are assigned to them
 *
 * */
export const usersToCompanies = pgTable(
  "users_to_companies",
  {
    id: varchar("id", { length: 191 }).$defaultFn(() => nanoid()),
    companyId: varchar("company_id", { length: 256 })
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    userId: varchar("user_id", { length: 256 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    isApproved: boolean("is_approved").notNull().default(false),
    isAdmin: boolean("is_admin").notNull().default(false),
    isOmnipresent: boolean("is_omnipresent").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (usersToCompanies) => {
    return {
      pk: primaryKey({
        columns: [usersToCompanies.userId, usersToCompanies.companyId],
      }),
    };
  }
);

export const usersToCompaniesRelations = relations(
  usersToCompanies,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToCompanies.userId],
      references: [users.id],
    }),
    company: one(companies, {
      fields: [usersToCompanies.companyId],
      references: [companies.id],
    }),
  }),
);

// Schema for usersToCompanies - used to validate API requests
const baseSchema = createSelectSchema(usersToCompanies).omit(timestamps);

export const insertUsersToCompanySchema =
  createInsertSchema(usersToCompanies).omit(timestamps);
export const insertUsersToCompanyParams = baseSchema
  .extend({
    companyId: z.coerce.string().min(1),
    isApproved: z.coerce.boolean(),
    isAdmin: z.coerce.boolean(),
    isOmnipresent: z.coerce.boolean(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateUsersToCompanySchema = baseSchema;
export const updateUsersToCompanyParams = baseSchema
  .extend({
    companyId: z.coerce.string().min(1),
    isApproved: z.coerce.boolean(),
    isAdmin: z.coerce.boolean(),
    isOmnipresent: z.coerce.boolean(),
  })
  .omit({
    userId: true,
  });
export const usersToCompanyIdSchema = baseSchema.pick({ id: true });

// Types for usersToCompanies - used to type API request params and within Components
export type UsersToCompany = typeof usersToCompanies.$inferSelect;
export type NewUsersToCompany = z.infer<typeof insertUsersToCompanySchema>;
export type NewUsersToCompanyParams = z.infer<
  typeof insertUsersToCompanyParams
>;
export type UpdateUsersToCompanyParams = z.infer<
  typeof updateUsersToCompanyParams
>;
export type UsersToCompanyId = z.infer<typeof usersToCompanyIdSchema>["id"];

// this type infers the return from getUsersToCompanies() - meaning it will include any joins
export type CompleteUsersToCompany = Awaited<
  ReturnType<typeof getUsersToCompanies>
>["usersToCompanies"][number];
