import {
  varchar,
  boolean,
  text,
  timestamp,
  pgTable,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { liaisonRequests } from "./liaisonRequests";
import { users } from "@/lib/db/schema/auth";
import { type getSupplierResponses } from "@/lib/api/supplierResponses/queries";

import { nanoid, timestamps } from "@/lib/utils";

/**
 * The supplier's representative responds to a liaison's request.
 * Additional metadata is added to the response, such as whether the supplier approves and the supplier's price.
 */
export const supplierResponses = pgTable("supplier_responses", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  respondsToLiaisonRequestId: varchar("responds_to_liaison_request_id", {
    length: 256,
  }).references(() => liaisonRequests.id, { onDelete: "no action" }),
  fromSupplierUserId: varchar("from_supplier_user_id", {
    length: 256,
  }).references(() => users.id, { onDelete: "no action" }),
  // Additional metadata
  isApproved: boolean("is_approved"),
  price: text("price"),
  unitCost: numeric("unit_cost"),
  printPlateCost: numeric("print_plate_cost"),
  dieCost: numeric("die_cost"),
  otherSetupCost: numeric("other_setup_cost"),
  deliveryCost: numeric("delivery_cost"),
  tax: numeric("tax"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for supplierResponses - used to validate API requests
const baseSchema = createSelectSchema(supplierResponses).omit(timestamps);

export const insertSupplierResponseSchema =
  createInsertSchema(supplierResponses).omit(timestamps);
export const insertSupplierResponseParams = baseSchema
  .extend({
    liaisonRequestId: z.coerce.string().min(1),
    isApproved: z.coerce.boolean(),
  })
  .omit({
    id: true,
    fromSupplierUserId: true,
  });

export const updateSupplierResponseSchema = baseSchema;
export const updateSupplierResponseParams = baseSchema
  .extend({
    liaisonRequestId: z.coerce.string().min(1),
    isApproved: z.coerce.boolean(),
    unitCost: z.coerce.number(),
    printPlateCost: z.coerce.number(),
    dieCost: z.coerce.number(),
    otherSetupCost: z.coerce.number(),
    deliveryCost: z.coerce.number(),
    tax: z.coerce.number(),
  })
  .omit({
    fromSupplierUserId: true,
  });
export const supplierResponseIdSchema = baseSchema.pick({ id: true });

// Types for supplierResponses - used to type API request params and within Components
export type SupplierResponse = typeof supplierResponses.$inferSelect;
export type NewSupplierResponse = z.infer<typeof insertSupplierResponseSchema>;
export type NewSupplierResponseParams = z.infer<
  typeof insertSupplierResponseParams
>;
export type UpdateSupplierResponseParams = z.infer<
  typeof updateSupplierResponseParams
>;
export type SupplierResponseId = z.infer<typeof supplierResponseIdSchema>["id"];

// this type infers the return from getSupplierResponses() - meaning it will include any joins
export type CompleteSupplierResponse = Awaited<
  ReturnType<typeof getSupplierResponses>
>["supplierResponses"][number];
