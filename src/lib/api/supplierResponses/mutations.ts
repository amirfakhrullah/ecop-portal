import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  SupplierResponseId,
  NewSupplierResponseParams,
  UpdateSupplierResponseParams,
  updateSupplierResponseSchema,
  insertSupplierResponseSchema,
  supplierResponses,
  supplierResponseIdSchema,
} from "@/lib/db/schema/supplierResponses";
import { getUserAuth } from "@/lib/auth/utils";

export const createSupplierResponse = async (
  supplierResponse: NewSupplierResponseParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newSupplierResponse = insertSupplierResponseSchema.parse({
    ...supplierResponse,
    fromSupplierUserId: session.user.id,
  });
  try {
    const [s] = await db
      .insert(supplierResponses)
      .values(newSupplierResponse)
      .returning();
    return { supplierResponse: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSupplierResponse = async (
  id: SupplierResponseId,
  supplierResponse: UpdateSupplierResponseParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: supplierResponseId } = supplierResponseIdSchema.parse({ id });
  const newSupplierResponse = updateSupplierResponseSchema.parse({
    ...supplierResponse,
    fromSupplierUserId: session.user.id,
  });
  try {
    const [s] = await db
      .update(supplierResponses)
      .set({ ...newSupplierResponse, updatedAt: new Date() })
      .where(
        and(
          eq(supplierResponses.id, supplierResponseId),
          eq(supplierResponses.fromSupplierUserId, session.user.id)
        )
      )
      .returning();
    return { supplierResponse: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSupplierResponse = async (id: SupplierResponseId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: supplierResponseId } = supplierResponseIdSchema.parse({ id });
  try {
    const [s] = await db
      .delete(supplierResponses)
      .where(
        and(
          eq(supplierResponses.id, supplierResponseId),
          eq(supplierResponses.fromSupplierUserId, session.user.id)
        )
      )
      .returning();
    return { supplierResponse: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
