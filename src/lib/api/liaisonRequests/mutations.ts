import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  LiaisonRequestId,
  NewLiaisonRequestParams,
  UpdateLiaisonRequestParams,
  updateLiaisonRequestSchema,
  insertLiaisonRequestSchema,
  liaisonRequests,
  liaisonRequestIdSchema,
} from "@/lib/db/schema/liaisonRequests";
import { getUserAuth } from "@/lib/auth/utils";

export const createLiaisonRequest = async (
  liaisonRequest: NewLiaisonRequestParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newLiaisonRequest = insertLiaisonRequestSchema.parse({
    ...liaisonRequest,
    fromLiaisonUserId: session.user.id,
  });
  try {
    const [l] = await db
      .insert(liaisonRequests)
      .values(newLiaisonRequest)
      .returning();
    return { liaisonRequest: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLiaisonRequest = async (
  id: LiaisonRequestId,
  liaisonRequest: UpdateLiaisonRequestParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonRequestId } = liaisonRequestIdSchema.parse({ id });
  const newLiaisonRequest = updateLiaisonRequestSchema.parse({
    ...liaisonRequest,
    fromLiaisonUserId: session.user.id,
  });
  try {
    const [l] = await db
      .update(liaisonRequests)
      .set({ ...newLiaisonRequest, updatedAt: new Date() })
      .where(
        and(
          eq(liaisonRequests.id, liaisonRequestId),
          eq(liaisonRequests.fromLiaisonUserId, session.user.id)
        )
      )
      .returning();
    return { liaisonRequest: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLiaisonRequest = async (id: LiaisonRequestId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonRequestId } = liaisonRequestIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(liaisonRequests)
      .where(
        and(
          eq(liaisonRequests.id, liaisonRequestId),
          eq(liaisonRequests.fromLiaisonUserId, session.user.id)
        )
      )
      .returning();
    return { liaisonRequest: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
