import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ClientRequestId,
  clientRequestIdSchema,
  clientRequests,
} from "@/lib/db/schema/clientRequests";

export const getClientRequests = async () => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select()
    .from(clientRequests)
    .where(eq(clientRequests.fromClientUserId, session.user.id));
  const c = rows;
  return { clientRequests: c };
};

export const getClientRequestById = async (id: ClientRequestId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: clientRequestId } = clientRequestIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(clientRequests)
    .where(
      and(
        eq(clientRequests.id, clientRequestId),
        eq(clientRequests.fromClientUserId, session.user.id)
      )
    );
  if (row === undefined) return {};
  const c = row;
  return { clientRequest: c };
};
