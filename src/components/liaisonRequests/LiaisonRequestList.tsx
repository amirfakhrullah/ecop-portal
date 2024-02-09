"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type LiaisonRequest,
  CompleteLiaisonRequest,
} from "@/lib/db/schema/liaisonRequests";
import Modal from "@/components/shared/Modal";
import {
  type ClientRequest,
  type ClientRequestId,
} from "@/lib/db/schema/clientRequests";
import { type Company, type CompanyId } from "@/lib/db/schema/companies";
import { useOptimisticLiaisonRequests } from "@/app/(app)/liaison-requests/useOptimisticLiaisonRequests";
import { Button } from "@/components/ui/button";
import LiaisonRequestForm from "./LiaisonRequestForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (liaisonRequest?: LiaisonRequest) => void;

export default function LiaisonRequestList({
  liaisonRequests,
  clientRequests,
  clientRequestId,
  companies,
  companyId,
}: {
  liaisonRequests: CompleteLiaisonRequest[];
  clientRequests: ClientRequest[];
  clientRequestId?: ClientRequestId;
  companies: Company[];
  companyId?: CompanyId;
}) {
  const { optimisticLiaisonRequests, addOptimisticLiaisonRequest } =
    useOptimisticLiaisonRequests(liaisonRequests, clientRequests, companies);
  const [open, setOpen] = useState(false);
  const [activeLiaisonRequest, setActiveLiaisonRequest] =
    useState<LiaisonRequest | null>(null);
  const openModal = (liaisonRequest?: LiaisonRequest) => {
    setOpen(true);
    liaisonRequest
      ? setActiveLiaisonRequest(liaisonRequest)
      : setActiveLiaisonRequest(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeLiaisonRequest
            ? "Edit LiaisonRequest"
            : "Create Liaison Request"
        }
      >
        <LiaisonRequestForm
          liaisonRequest={activeLiaisonRequest}
          addOptimistic={addOptimisticLiaisonRequest}
          openModal={openModal}
          closeModal={closeModal}
          clientRequests={clientRequests}
          clientRequestId={clientRequestId}
          companies={companies}
          companyId={companyId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLiaisonRequests.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLiaisonRequests.map((liaisonRequest) => (
            <LiaisonRequest
              liaisonRequest={liaisonRequest}
              key={liaisonRequest.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LiaisonRequest = ({
  liaisonRequest,
  openModal,
}: {
  liaisonRequest: CompleteLiaisonRequest;
  openModal: TOpenModal;
}) => {
  const optimistic = liaisonRequest.id === "optimistic";
  const deleting = liaisonRequest.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("liaison-requests")
    ? pathname
    : pathname + "/liaison-requests/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{liaisonRequest.originatingClientRequestId}</div>
    </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + liaisonRequest.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No liaison requests
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new liaison request.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Liaison Requests{" "}
        </Button>
      </div>
    </div>
  );
};
