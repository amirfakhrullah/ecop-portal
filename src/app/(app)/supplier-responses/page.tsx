import { Suspense } from "react";

import Loading from "@/app/loading";
import SupplierResponseList from "@/components/supplierResponses/SupplierResponseList";
import { getSupplierResponses } from "@/lib/api/supplierResponses/queries";
import { getLiaisonRequests } from "@/lib/api/liaisonRequests/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function SupplierResponsesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Supplier Responses</h1>
        </div>
        <SupplierResponses />
      </div>
    </main>
  );
}

const SupplierResponses = async () => {
  await checkAuth();

  const { supplierResponses } = await getSupplierResponses();
  const { liaisonRequests } = await getLiaisonRequests();
  return (
    <Suspense fallback={<Loading />}>
      <SupplierResponseList
        supplierResponses={supplierResponses}
        liaisonRequests={liaisonRequests}
      />
    </Suspense>
  );
};
