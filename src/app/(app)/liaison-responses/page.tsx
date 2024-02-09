import { Suspense } from "react";

import Loading from "@/app/loading";
import LiaisonResponseList from "@/components/liaisonResponses/LiaisonResponseList";
import { getLiaisonResponses } from "@/lib/api/liaisonResponses/queries";
import { getSupplierResponses } from "@/lib/api/supplierResponses/queries";
import { getClientRequests } from "@/lib/api/clientRequests/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function LiaisonResponsesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Liaison Responses</h1>
        </div>
        <LiaisonResponses />
      </div>
    </main>
  );
}

const LiaisonResponses = async () => {
  await checkAuth();

  const { liaisonResponses } = await getLiaisonResponses();
  const { supplierResponses } = await getSupplierResponses();
  const { clientRequests } = await getClientRequests();
  return (
    <Suspense fallback={<Loading />}>
      <LiaisonResponseList
        liaisonResponses={liaisonResponses}
        supplierResponses={supplierResponses}
        clientRequests={clientRequests}
      />
    </Suspense>
  );
};
