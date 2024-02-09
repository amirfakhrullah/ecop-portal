import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSupplierResponseById } from "@/lib/api/supplierResponses/queries";
import { getLiaisonRequests } from "@/lib/api/liaisonRequests/queries";import OptimisticSupplierResponse from "./OptimisticSupplierResponse";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function SupplierResponsePage({
  params,
}: {
  params: { supplierResponseId: string };
}) {

  return (
    <main className="overflow-auto">
      <SupplierResponse id={params.supplierResponseId} />
    </main>
  );
}

const SupplierResponse = async ({ id }: { id: string }) => {
  await checkAuth();

  const { supplierResponse } = await getSupplierResponseById(id);
  const { liaisonRequests } = await getLiaisonRequests();

  if (!supplierResponse) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="supplier-responses" />
        <OptimisticSupplierResponse supplierResponse={supplierResponse} liaisonRequests={liaisonRequests} />
      </div>
    </Suspense>
  );
};
