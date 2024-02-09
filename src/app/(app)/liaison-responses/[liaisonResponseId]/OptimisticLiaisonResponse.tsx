"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/liaison-responses/useOptimisticLiaisonResponses";
import { type LiaisonResponse } from "@/lib/db/schema/liaisonResponses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LiaisonResponseForm from "@/components/liaisonResponses/LiaisonResponseForm";
import {
  type SupplierResponse,
  type SupplierResponseId,
} from "@/lib/db/schema/supplierResponses";
import {
  type ClientRequest,
  type ClientRequestId,
} from "@/lib/db/schema/clientRequests";

export default function OptimisticLiaisonResponse({
  liaisonResponse,
  supplierResponses,
  supplierResponseId,
  clientRequests,
  clientRequestId,
}: {
  liaisonResponse: LiaisonResponse;

  supplierResponses: SupplierResponse[];
  supplierResponseId?: SupplierResponseId;
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LiaisonResponse) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLiaisonResponse, setOptimisticLiaisonResponse] =
    useOptimistic(liaisonResponse);
  const updateLiaisonResponse: TAddOptimistic = (input) =>
    setOptimisticLiaisonResponse({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LiaisonResponseForm
          liaisonResponse={liaisonResponse}
          supplierResponses={supplierResponses}
          supplierResponseId={supplierResponseId}
          clientRequests={clientRequests}
          clientRequestId={clientRequestId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLiaisonResponse}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {liaisonResponse.originatingSupplierResponseId}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLiaisonResponse.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticLiaisonResponse, null, 2)}
      </pre>
    </div>
  );
}
