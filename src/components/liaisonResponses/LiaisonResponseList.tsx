"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type LiaisonResponse,
  CompleteLiaisonResponse,
} from "@/lib/db/schema/liaisonResponses";
import Modal from "@/components/shared/Modal";
import {
  type SupplierResponse,
  type SupplierResponseId,
} from "@/lib/db/schema/supplierResponses";
import {
  type ClientRequest,
  type ClientRequestId,
} from "@/lib/db/schema/clientRequests";
import { useOptimisticLiaisonResponses } from "@/app/(app)/liaison-responses/useOptimisticLiaisonResponses";
import { Button } from "@/components/ui/button";
import LiaisonResponseForm from "./LiaisonResponseForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (liaisonResponse?: LiaisonResponse) => void;

export default function LiaisonResponseList({
  liaisonResponses,
  supplierResponses,
  supplierResponseId,
  clientRequests,
  clientRequestId,
}: {
  liaisonResponses: CompleteLiaisonResponse[];
  supplierResponses: SupplierResponse[];
  supplierResponseId?: SupplierResponseId;
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId;
}) {
  const { optimisticLiaisonResponses, addOptimisticLiaisonResponse } =
    useOptimisticLiaisonResponses(
      liaisonResponses,
      supplierResponses,
      clientRequests
    );
  const [open, setOpen] = useState(false);
  const [activeLiaisonResponse, setActiveLiaisonResponse] =
    useState<LiaisonResponse | null>(null);
  const openModal = (liaisonResponse?: LiaisonResponse) => {
    setOpen(true);
    liaisonResponse
      ? setActiveLiaisonResponse(liaisonResponse)
      : setActiveLiaisonResponse(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeLiaisonResponse
            ? "Edit LiaisonResponse"
            : "Create Liaison Response"
        }
      >
        <LiaisonResponseForm
          liaisonResponse={activeLiaisonResponse}
          addOptimistic={addOptimisticLiaisonResponse}
          openModal={openModal}
          closeModal={closeModal}
          supplierResponses={supplierResponses}
          supplierResponseId={supplierResponseId}
          clientRequests={clientRequests}
          clientRequestId={clientRequestId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLiaisonResponses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLiaisonResponses.map((liaisonResponse) => (
            <LiaisonResponse
              liaisonResponse={liaisonResponse}
              key={liaisonResponse.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LiaisonResponse = ({
  liaisonResponse,
  openModal,
}: {
  liaisonResponse: CompleteLiaisonResponse;
  openModal: TOpenModal;
}) => {
  const optimistic = liaisonResponse.id === "optimistic";
  const deleting = liaisonResponse.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("liaison-responses")
    ? pathname
    : pathname + "/liaison-responses/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{liaisonResponse.originatingSupplierResponseId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + liaisonResponse.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No liaison responses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new liaison response.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Liaison Responses{" "}
        </Button>
      </div>
    </div>
  );
};
