import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type LiaisonResponseId,
  liaisonResponseIdSchema,
  liaisonResponses,
} from "@/lib/db/schema/liaisonResponses";
import { supplierResponses } from "@/lib/db/schema/supplierResponses";
import { clientRequests } from "@/lib/db/schema/clientRequests";

export const getLiaisonResponses = async () => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({
      liaisonResponse: liaisonResponses,
      supplierResponse: supplierResponses,
      clientRequest: clientRequests,
    })
    .from(liaisonResponses)
    .leftJoin(
      supplierResponses,
      eq(liaisonResponses.originatingSupplierResponseId, supplierResponses.id)
    )
    .leftJoin(
      clientRequests,
      eq(liaisonResponses.respondsToClientRequestId, clientRequests.id)
    )
    .where(eq(liaisonResponses.fromLiaisonUserId, session.user.id));
  const l = rows.map((r) => ({
    ...r.liaisonResponse,
    supplierResponse: r.supplierResponse,
    clientRequest: r.clientRequest,
  }));
  return { liaisonResponses: l };
};

export const getLiaisonResponseById = async (id: LiaisonResponseId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonResponseId } = liaisonResponseIdSchema.parse({ id });
  const [row] = await db
    .select({
      liaisonResponse: liaisonResponses,
      supplierResponse: supplierResponses,
      clientRequest: clientRequests,
    })
    .from(liaisonResponses)
    .where(
      and(
        eq(liaisonResponses.id, liaisonResponseId),
        eq(liaisonResponses.fromLiaisonUserId, session.user.id)
      )
    )
    .leftJoin(
      supplierResponses,
      eq(liaisonResponses.originatingSupplierResponseId, supplierResponses.id)
    )
    .leftJoin(
      clientRequests,
      eq(liaisonResponses.respondsToClientRequestId, clientRequests.id)
    );
  if (row === undefined) return {};
  const l = {
    ...row.liaisonResponse,
    supplierResponse: row.supplierResponse,
    clientRequest: row.clientRequest,
  };
  return { liaisonResponse: l };
};
