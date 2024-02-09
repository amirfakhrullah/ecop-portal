import { Suspense } from "react";

import Loading from "@/app/loading";
import LiaisonRequestList from "@/components/liaisonRequests/LiaisonRequestList";
import { getLiaisonRequests } from "@/lib/api/liaisonRequests/queries";
import { getClientRequests } from "@/lib/api/clientRequests/queries";
import { getCompanies } from "@/lib/api/companies/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function LiaisonRequestsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Liaison Requests</h1>
        </div>
        <LiaisonRequests />
      </div>
    </main>
  );
}

const LiaisonRequests = async () => {
  await checkAuth();

  const { liaisonRequests } = await getLiaisonRequests();
  const { clientRequests } = await getClientRequests();
  const { companies } = await getCompanies();
  return (
    <Suspense fallback={<Loading />}>
      <LiaisonRequestList liaisonRequests={liaisonRequests} clientRequests={clientRequests} companies={companies} />
    </Suspense>
  );
};
