import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type SupplierResponseId,
  supplierResponseIdSchema,
  supplierResponses,
} from "@/lib/db/schema/supplierResponses";
import { liaisonRequests } from "@/lib/db/schema/liaisonRequests";

export const getSupplierResponses = async () => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select({
      supplierResponse: supplierResponses,
      liaisonRequest: liaisonRequests,
    })
    .from(supplierResponses)
    .leftJoin(
      liaisonRequests,
      eq(supplierResponses.respondsToLiaisonRequestId, liaisonRequests.id)
    )
    .where(eq(supplierResponses.fromSupplierUserId, session.user.id));
  const s = rows.map((r) => ({
    ...r.supplierResponse,
    liaisonRequest: r.liaisonRequest,
  }));
  return { supplierResponses: s };
};

export const getSupplierResponseById = async (id: SupplierResponseId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: supplierResponseId } = supplierResponseIdSchema.parse({ id });
  const [row] = await db
    .select({
      supplierResponse: supplierResponses,
      liaisonRequest: liaisonRequests,
    })
    .from(supplierResponses)
    .where(
      and(
        eq(supplierResponses.id, supplierResponseId),
        eq(supplierResponses.fromSupplierUserId, session?.user.id!)
      )
    )
    .leftJoin(
      liaisonRequests,
      eq(supplierResponses.respondsToLiaisonRequestId, liaisonRequests.id)
    );
  if (row === undefined) return {};
  const s = { ...row.supplierResponse, liaisonRequest: row.liaisonRequest };
  return { supplierResponse: s };
};
