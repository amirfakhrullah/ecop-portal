import { Suspense } from "react";

import Loading from "@/app/loading";
import ClientRequestList from "@/components/clientRequests/ClientRequestList";
import { getClientRequests } from "@/lib/api/clientRequests/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ClientRequestsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Client Requests</h1>
        </div>
        <ClientRequests />
      </div>
    </main>
  );
}

const ClientRequests = async () => {
  await checkAuth();

  const { clientRequests } = await getClientRequests();
  
  return (
    <Suspense fallback={<Loading />}>
      <ClientRequestList clientRequests={clientRequests}  />
    </Suspense>
  );
};
