import { varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { clientRequests } from "./clientRequests";
import { companies } from "./companies";
import { users } from "@/lib/db/schema/auth";
import { type getLiaisonRequests } from "@/lib/api/liaisonRequests/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const liaisonRequests = pgTable("liaison_requests", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fromLiaisonUserId: varchar("from_liaison_user_id", {
    length: 256,
  }).references(() => users.id, { onDelete: "no action" }),
  originatingClientRequestId: varchar("origininating_client_request_id", {
    length: 256,
  }).references(() => clientRequests.id, { onDelete: "no action" }),
  forwardedToSupplierId: varchar("forwarded_to_supplier_id", {
    length: 256,
  }).references(() => companies.id, { onDelete: "no action" }),
  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for liaisonRequests - used to validate API requests
const baseSchema = createSelectSchema(liaisonRequests).omit(timestamps);

export const insertLiaisonRequestSchema =
  createInsertSchema(liaisonRequests).omit(timestamps);
export const insertLiaisonRequestParams = baseSchema
  .extend({
    clientRequestId: z.coerce.string().min(1),
    companyId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    fromLiaisonUserId: true,
  });

export const updateLiaisonRequestSchema = baseSchema;
export const updateLiaisonRequestParams = baseSchema
  .extend({
    clientRequestId: z.coerce.string().min(1),
    companyId: z.coerce.string().min(1),
  })
  .omit({
    fromLiaisonUserId: true,
  });
export const liaisonRequestIdSchema = baseSchema.pick({ id: true });

// Types for liaisonRequests - used to type API request params and within Components
export type LiaisonRequest = typeof liaisonRequests.$inferSelect;
export type NewLiaisonRequest = z.infer<typeof insertLiaisonRequestSchema>;
export type NewLiaisonRequestParams = z.infer<
  typeof insertLiaisonRequestParams
>;
export type UpdateLiaisonRequestParams = z.infer<
  typeof updateLiaisonRequestParams
>;
export type LiaisonRequestId = z.infer<typeof liaisonRequestIdSchema>["id"];

// this type infers the return from getLiaisonRequests() - meaning it will include any joins
export type CompleteLiaisonRequest = Awaited<
  ReturnType<typeof getLiaisonRequests>
>["liaisonRequests"][number];
