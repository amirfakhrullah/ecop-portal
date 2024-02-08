import {
  text,
  varchar,
  timestamp,
  pgTable,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { type getCompanies } from "@/lib/api/companies/queries";
import { nanoid, timestamps } from "@/lib/utils";
import { relations } from "drizzle-orm";
import { usersToCompanies } from "./usersToCompanies";

export const companyType = pgEnum("company_type", [
  "CLIENT",
  "SUPPLIER",
  "LIAISON",
]);

export const companies = pgTable("companies", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  companyType: companyType("company_type").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  websiteUrl: text("website_url"),
  billingAddress: text("billing_address"),
  shippingAddress: text("shipping_address"),
  /** Domains to match. If a user has an email ending with one of the domains, they are automatically admitted */
  domains: json("domains").$type<string[]>(),
  /** Passphrase. If a user does not have a matching domain, they can enter this passphrase to be admitted */
  passphrase: text("passphrase").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyRelations = relations(companies, ({ many }) => ({
  usersToCompanies: many(usersToCompanies),
}));

// Schema for companies - used to validate API requests
const baseSchema = createSelectSchema(companies).omit(timestamps);

export const insertCompanySchema =
  createInsertSchema(companies).omit(timestamps);
export const insertCompanyParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateCompanySchema = baseSchema;
export const updateCompanyParams = baseSchema.extend({});
export const companyIdSchema = baseSchema.pick({ id: true });

// Types for companies - used to type API request params and within Components
export type Company = typeof companies.$inferSelect;
export type NewCompany = z.infer<typeof insertCompanySchema>;
export type NewCompanyParams = z.infer<typeof insertCompanyParams>;
export type UpdateCompanyParams = z.infer<typeof updateCompanyParams>;
export type CompanyId = z.infer<typeof companyIdSchema>["id"];

// this type infers the return from getCompanies() - meaning it will include any joins
export type CompleteCompany = Awaited<
  ReturnType<typeof getCompanies>
>["companies"][number];
