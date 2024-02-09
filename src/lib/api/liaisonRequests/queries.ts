import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type LiaisonRequestId,
  liaisonRequestIdSchema,
  liaisonRequests,
} from "@/lib/db/schema/liaisonRequests";
import { clientRequests } from "@/lib/db/schema/clientRequests";
import { companies } from "@/lib/db/schema/companies";

export const getLiaisonRequests = async () => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({
      liaisonRequest: liaisonRequests,
      clientRequest: clientRequests,
      company: companies,
    })
    .from(liaisonRequests)
    .leftJoin(
      clientRequests,
      eq(liaisonRequests.originatingClientRequestId, clientRequests.id)
    )
    .leftJoin(
      companies,
      eq(liaisonRequests.forwardedToSupplierId, companies.id)
    )
    .where(eq(liaisonRequests.fromLiaisonUserId, session.user.id));
  const l = rows.map((r) => ({
    ...r.liaisonRequest,
    clientRequest: r.clientRequest,
    company: r.company,
  }));
  return { liaisonRequests: l };
};

export const getLiaisonRequestById = async (id: LiaisonRequestId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: liaisonRequestId } = liaisonRequestIdSchema.parse({ id });
  const [row] = await db
    .select({
      liaisonRequest: liaisonRequests,
      clientRequest: clientRequests,
      company: companies,
    })
    .from(liaisonRequests)
    .where(
      and(
        eq(liaisonRequests.id, liaisonRequestId),
        eq(liaisonRequests.fromLiaisonUserId, session.user.id)
      )
    )
    .leftJoin(
      clientRequests,
      eq(liaisonRequests.fromLiaisonUserId, clientRequests.id)
    )
    .leftJoin(
      companies,
      eq(liaisonRequests.originatingClientRequestId, companies.id)
    );
  if (row === undefined) return {};
  const l = {
    ...row.liaisonRequest,
    clientRequest: row.clientRequest,
    company: row.company,
  };
  return { liaisonRequest: l };
};
