import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLiaisonResponseById } from "@/lib/api/liaisonResponses/queries";
import { getSupplierResponses } from "@/lib/api/supplierResponses/queries";
import { getClientRequests } from "@/lib/api/clientRequests/queries";
import OptimisticLiaisonResponse from "./OptimisticLiaisonResponse";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function LiaisonResponsePage({
  params,
}: {
  params: { liaisonResponseId: string };
}) {
  return (
    <main className="overflow-auto">
      <LiaisonResponse id={params.liaisonResponseId} />
    </main>
  );
}

const LiaisonResponse = async ({ id }: { id: string }) => {
  await checkAuth();

  const { liaisonResponse } = await getLiaisonResponseById(id);
  const { supplierResponses } = await getSupplierResponses();
  const { clientRequests } = await getClientRequests();

  if (!liaisonResponse) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="liaison-responses" />
        <OptimisticLiaisonResponse
          liaisonResponse={liaisonResponse}
          supplierResponses={supplierResponses}
          clientRequests={clientRequests}
        />
      </div>
    </Suspense>
  );
};
