import { varchar, timestamp, pgTable, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { supplierResponses } from "./supplierResponses";
import { clientRequests } from "./clientRequests";
import { users } from "@/lib/db/schema/auth";
import { type getLiaisonResponses } from "@/lib/api/liaisonResponses/queries";

import { nanoid, timestamps } from "@/lib/utils";

/**
 * The liaison takes a supplier's response and responds to a client's request.
 * Additional metadata is added to the response, such as the liaison's margin.
 */
export const liaisonResponses = pgTable("liaison_responses", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  originatingSupplierResponseId: varchar("originating_supplier_response_id", {
    length: 256,
  }).references(() => supplierResponses.id, { onDelete: "no action" }),
  respondsToClientRequestId: varchar("responds_to_client_request_id", {
    length: 256,
  }).references(() => clientRequests.id, { onDelete: "no action" }),
  fromLiaisonUserId: varchar("from_liaison_user_id", {
    length: 256,
  }).references(() => users.id, { onDelete: "no action" }),
  // Additional metadata
  margin: numeric("margin", { precision: 12, scale: 2 }),
  unitCost: numeric("unit_cost"),
  printPlateCost: numeric("print_plate_cost"),
  dieCost: numeric("die_cost"),
  otherSetupCost: numeric("other_setup_cost"),
  deliveryCost: numeric("delivery_cost"),
  tax: numeric("tax"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for liaisonResponses - used to validate API requests
const baseSchema = createSelectSchema(liaisonResponses).omit(timestamps);

export const insertLiaisonResponseSchema =
  createInsertSchema(liaisonResponses).omit(timestamps);
export const insertLiaisonResponseParams = baseSchema
  .extend({
    supplierResponseId: z.coerce.string().min(1),
    clientRequestId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    fromLiaisonUserId: true,
  });

export const updateLiaisonResponseSchema = baseSchema;
export const updateLiaisonResponseParams = baseSchema
  .extend({
    supplierResponseId: z.coerce.string().min(1),
    clientRequestId: z.coerce.string().min(1),
    margin: z.coerce.number(),
    unitCost: z.coerce.number(),
    printPlateCost: z.coerce.number(),
    dieCost: z.coerce.number(),
    otherSetupCost: z.coerce.number(),
    deliveryCost: z.coerce.number(),
    tax: z.coerce.number(),
  })
  .omit({
    fromLiaisonUserId: true,
  });
export const liaisonResponseIdSchema = baseSchema.pick({ id: true });

// Types for liaisonResponses - used to type API request params and within Components
export type LiaisonResponse = typeof liaisonResponses.$inferSelect;
export type NewLiaisonResponse = z.infer<typeof insertLiaisonResponseSchema>;
export type NewLiaisonResponseParams = z.infer<
  typeof insertLiaisonResponseParams
>;
export type UpdateLiaisonResponseParams = z.infer<
  typeof updateLiaisonResponseParams
>;
export type LiaisonResponseId = z.infer<typeof liaisonResponseIdSchema>["id"];

// this type infers the return from getLiaisonResponses() - meaning it will include any joins
export type CompleteLiaisonResponse = Awaited<
  ReturnType<typeof getLiaisonResponses>
>["liaisonResponses"][number];
