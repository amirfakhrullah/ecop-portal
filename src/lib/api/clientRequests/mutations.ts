import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  ClientRequestId,
  NewClientRequestParams,
  UpdateClientRequestParams,
  updateClientRequestSchema,
  insertClientRequestSchema,
  clientRequests,
  clientRequestIdSchema,
  FormValues,
} from "@/lib/db/schema/clientRequests";
import { getUserAuth } from "@/lib/auth/utils";

export const createClientRequest = async (
  clientRequest: NewClientRequestParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newClientRequest = insertClientRequestSchema.parse({
    ...clientRequest,
    fromClientUserId: session.user.id,
  });
  try {
    const [c] = await db
      .insert(clientRequests)
      .values({
        ...newClientRequest,
        fields: (newClientRequest.fields as FormValues | undefined) ?? null,
      })
      .returning();
    return { clientRequest: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateClientRequest = async (
  id: ClientRequestId,
  clientRequest: UpdateClientRequestParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: clientRequestId } = clientRequestIdSchema.parse({ id });
  const newClientRequest = updateClientRequestSchema.parse({
    ...clientRequest,
    fromClientUserId: session.user.id,
  });
  try {
    const [c] = await db
      .update(clientRequests)
      .set({ ...newClientRequest, updatedAt: new Date() })
      .where(
        and(
          eq(clientRequests.id, clientRequestId),
          eq(clientRequests.fromClientUserId, session.user.id)
        )
      )
      .returning();
    return { clientRequest: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteClientRequest = async (id: ClientRequestId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: clientRequestId } = clientRequestIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(clientRequests)
      .where(
        and(
          eq(clientRequests.id, clientRequestId),
          eq(clientRequests.fromClientUserId, session.user.id)
        )
      )
      .returning();
    return { clientRequest: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
