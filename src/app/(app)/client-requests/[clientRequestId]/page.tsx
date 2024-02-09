import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getClientRequestById } from "@/lib/api/clientRequests/queries";
import OptimisticClientRequest from "./OptimisticClientRequest";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ClientRequestPage({
  params,
}: {
  params: { clientRequestId: string };
}) {

  return (
    <main className="overflow-auto">
      <ClientRequest id={params.clientRequestId} />
    </main>
  );
}

const ClientRequest = async ({ id }: { id: string }) => {
  await checkAuth();

  const { clientRequest } = await getClientRequestById(id);
  

  if (!clientRequest) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="client-requests" />
        <OptimisticClientRequest clientRequest={clientRequest}  />
      </div>
    </Suspense>
  );
};
