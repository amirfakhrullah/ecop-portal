import {
  varchar,
  boolean,
  text,
  integer,
  timestamp,
  pgTable,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getClientRequests } from "@/lib/api/clientRequests/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const importanceType = pgEnum("importance_tag", [
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export type FormValues = Record<
  string,
  string | number | Date | string[] // | FileList
>;

/**
 * A user from a client company sends a client request, with the product they want to buy.
 */
export const clientRequests = pgTable("client_requests", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fromClientUserId: varchar("from_client_user_id", { length: 256 }).references(
    () => users.id,
    { onDelete: "no action" }
  ),
  productId: varchar("product_id", { length: 256 }).notNull(), // reference to product table
  isArchived: boolean("is_archived").notNull().default(false),
  isFavorite: boolean("is_favorite").notNull().default(false),
  email: text("email"),
  counter: integer("counter").notNull(),
  fields: jsonb("fields").$type<FormValues>(),
  importanceType: importanceType("importance_type").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for clientRequests - used to validate API requests
const baseSchema = createSelectSchema(clientRequests).omit({
  ...timestamps,
  fields: true,
});
export const insertClientRequestSchema =
  createInsertSchema(clientRequests).omit(timestamps);
export const insertClientRequestParams = baseSchema
  .extend({
    isArchived: z.coerce.boolean(),
    isFavorite: z.coerce.boolean(),
    counter: z.coerce.number(),
  })
  .omit({
    id: true,
    fromClientUserId: true,
  });

export const updateClientRequestSchema = baseSchema;
export const updateClientRequestParams = baseSchema
  .extend({
    isArchived: z.coerce.boolean(),
    isFavorite: z.coerce.boolean(),
    counter: z.coerce.number(),
  })
  .omit({
    fromClientUserId: true,
  });
export const clientRequestIdSchema = baseSchema.pick({ id: true });

// Types for clientRequests - used to type API request params and within Components
export type ClientRequest = typeof clientRequests.$inferSelect;
export type NewClientRequest = z.infer<typeof insertClientRequestSchema>;
export type NewClientRequestParams = z.infer<typeof insertClientRequestParams>;
export type UpdateClientRequestParams = z.infer<
  typeof updateClientRequestParams
>;
export type ClientRequestId = z.infer<typeof clientRequestIdSchema>["id"];

// this type infers the return from getClientRequests() - meaning it will include any joins
export type CompleteClientRequest = Awaited<
  ReturnType<typeof getClientRequests>
>["clientRequests"][number];
