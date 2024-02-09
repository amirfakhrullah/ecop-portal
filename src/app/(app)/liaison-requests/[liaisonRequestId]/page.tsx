import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLiaisonRequestById } from "@/lib/api/liaisonRequests/queries";
import { getClientRequests } from "@/lib/api/clientRequests/queries";
import { getCompanies } from "@/lib/api/companies/queries";import OptimisticLiaisonRequest from "./OptimisticLiaisonRequest";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function LiaisonRequestPage({
  params,
}: {
  params: { liaisonRequestId: string };
}) {

  return (
    <main className="overflow-auto">
      <LiaisonRequest id={params.liaisonRequestId} />
    </main>
  );
}

const LiaisonRequest = async ({ id }: { id: string }) => {
  await checkAuth();

  const { liaisonRequest } = await getLiaisonRequestById(id);
  const { clientRequests } = await getClientRequests();
  const { companies } = await getCompanies();

  if (!liaisonRequest) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="liaison-requests" />
        <OptimisticLiaisonRequest liaisonRequest={liaisonRequest} clientRequests={clientRequests} companies={companies} />
      </div>
    </Suspense>
  );
};
