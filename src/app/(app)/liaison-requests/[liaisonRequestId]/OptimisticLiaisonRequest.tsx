"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/liaison-requests/useOptimisticLiaisonRequests";
import { type LiaisonRequest } from "@/lib/db/schema/liaisonRequests";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LiaisonRequestForm from "@/components/liaisonRequests/LiaisonRequestForm";
import { type ClientRequest, type ClientRequestId } from "@/lib/db/schema/clientRequests";
import { type Company, type CompanyId } from "@/lib/db/schema/companies";

export default function OptimisticLiaisonRequest({ 
  liaisonRequest,
  clientRequests,
  clientRequestId,
  companies,
  companyId 
}: { 
  liaisonRequest: LiaisonRequest; 
  
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId
  companies: Company[];
  companyId?: CompanyId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LiaisonRequest) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLiaisonRequest, setOptimisticLiaisonRequest] = useOptimistic(liaisonRequest);
  const updateLiaisonRequest: TAddOptimistic = (input) =>
    setOptimisticLiaisonRequest({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LiaisonRequestForm
          liaisonRequest={liaisonRequest}
          clientRequests={clientRequests}
        clientRequestId={clientRequestId}
        companies={companies}
        companyId={companyId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLiaisonRequest}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{liaisonRequest.fromLiaisonUserId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLiaisonRequest.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticLiaisonRequest, null, 2)}
      </pre>
    </div>
  );
}
