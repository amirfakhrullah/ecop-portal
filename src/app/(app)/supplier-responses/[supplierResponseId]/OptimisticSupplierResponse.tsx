"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/supplier-responses/useOptimisticSupplierResponses";
import { type SupplierResponse } from "@/lib/db/schema/supplierResponses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import SupplierResponseForm from "@/components/supplierResponses/SupplierResponseForm";
import {
  type LiaisonRequest,
  type LiaisonRequestId,
} from "@/lib/db/schema/liaisonRequests";

export default function OptimisticSupplierResponse({
  supplierResponse,
  liaisonRequests,
  liaisonRequestId,
}: {
  supplierResponse: SupplierResponse;

  liaisonRequests: LiaisonRequest[];
  liaisonRequestId?: LiaisonRequestId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: SupplierResponse) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticSupplierResponse, setOptimisticSupplierResponse] =
    useOptimistic(supplierResponse);
  const updateSupplierResponse: TAddOptimistic = (input) =>
    setOptimisticSupplierResponse({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <SupplierResponseForm
          supplierResponse={supplierResponse}
          liaisonRequests={liaisonRequests}
          liaisonRequestId={liaisonRequestId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSupplierResponse}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">
          {supplierResponse.respondsToLiaisonRequestId}
        </h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticSupplierResponse.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticSupplierResponse, null, 2)}
      </pre>
    </div>
  );
}
