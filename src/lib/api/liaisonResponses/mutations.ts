import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  LiaisonResponseId,
  NewLiaisonResponseParams,
  UpdateLiaisonResponseParams,
  updateLiaisonResponseSchema,
  insertLiaisonResponseSchema,
  liaisonResponses,
  liaisonResponseIdSchema,
} from "@/lib/db/schema/liaisonResponses";
import { getUserAuth } from "@/lib/auth/utils";

export const createLiaisonResponse = async (
  liaisonResponse: NewLiaisonResponseParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newLiaisonResponse = insertLiaisonResponseSchema.parse({
    ...liaisonResponse,
    fromLiaisonUserId: session.user.id,
  });
  try {
    const [l] = await db
      .insert(liaisonResponses)
      .values(newLiaisonResponse)
      .returning();
    return { liaisonResponse: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLiaisonResponse = async (
  id: LiaisonResponseId,
  liaisonResponse: UpdateLiaisonResponseParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonResponseId } = liaisonResponseIdSchema.parse({ id });
  const newLiaisonResponse = updateLiaisonResponseSchema.parse({
    ...liaisonResponse,
    fromLiaisonUserId: session.user.id,
  });
  try {
    const [l] = await db
      .update(liaisonResponses)
      .set({ ...newLiaisonResponse, updatedAt: new Date() })
      .where(
        and(
          eq(liaisonResponses.id, liaisonResponseId!),
          eq(liaisonResponses.fromLiaisonUserId, session.user.id)
        )
      )
      .returning();
    return { liaisonResponse: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLiaisonResponse = async (id: LiaisonResponseId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonResponseId } = liaisonResponseIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(liaisonResponses)
      .where(
        and(
          eq(liaisonResponses.id, liaisonResponseId),
          eq(liaisonResponses.fromLiaisonUserId, session.user.id)
        )
      )
      .returning();
    return { liaisonResponse: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
