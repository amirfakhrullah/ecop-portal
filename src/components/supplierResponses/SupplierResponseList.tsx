"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type SupplierResponse,
  CompleteSupplierResponse,
} from "@/lib/db/schema/supplierResponses";
import Modal from "@/components/shared/Modal";
import {
  type LiaisonRequest,
  type LiaisonRequestId,
} from "@/lib/db/schema/liaisonRequests";
import { useOptimisticSupplierResponses } from "@/app/(app)/supplier-responses/useOptimisticSupplierResponses";
import { Button } from "@/components/ui/button";
import SupplierResponseForm from "./SupplierResponseForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (supplierResponse?: SupplierResponse) => void;

export default function SupplierResponseList({
  supplierResponses,
  liaisonRequests,
  liaisonRequestId,
}: {
  supplierResponses: CompleteSupplierResponse[];
  liaisonRequests: LiaisonRequest[];
  liaisonRequestId?: LiaisonRequestId;
}) {
  const { optimisticSupplierResponses, addOptimisticSupplierResponse } =
    useOptimisticSupplierResponses(supplierResponses, liaisonRequests);
  const [open, setOpen] = useState(false);
  const [activeSupplierResponse, setActiveSupplierResponse] =
    useState<SupplierResponse | null>(null);
  const openModal = (supplierResponse?: SupplierResponse) => {
    setOpen(true);
    supplierResponse
      ? setActiveSupplierResponse(supplierResponse)
      : setActiveSupplierResponse(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeSupplierResponse
            ? "Edit SupplierResponse"
            : "Create Supplier Response"
        }
      >
        <SupplierResponseForm
          supplierResponse={activeSupplierResponse}
          addOptimistic={addOptimisticSupplierResponse}
          openModal={openModal}
          closeModal={closeModal}
          liaisonRequests={liaisonRequests}
          liaisonRequestId={liaisonRequestId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticSupplierResponses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSupplierResponses.map((supplierResponse) => (
            <SupplierResponse
              supplierResponse={supplierResponse}
              key={supplierResponse.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const SupplierResponse = ({
  supplierResponse,
  openModal,
}: {
  supplierResponse: CompleteSupplierResponse;
  openModal: TOpenModal;
}) => {
  const optimistic = supplierResponse.id === "optimistic";
  const deleting = supplierResponse.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("supplier-responses")
    ? pathname
    : pathname + "/supplier-responses/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{supplierResponse.respondsToLiaisonRequestId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + supplierResponse.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No supplier responses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new supplier response.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Supplier Responses{" "}
        </Button>
      </div>
    </div>
  );
};
