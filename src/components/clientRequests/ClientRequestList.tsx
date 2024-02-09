"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type ClientRequest, CompleteClientRequest } from "@/lib/db/schema/clientRequests";
import Modal from "@/components/shared/Modal";

import { useOptimisticClientRequests } from "@/app/(app)/client-requests/useOptimisticClientRequests";
import { Button } from "@/components/ui/button";
import ClientRequestForm from "./ClientRequestForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (clientRequest?: ClientRequest) => void;

export default function ClientRequestList({
  clientRequests,
   
}: {
  clientRequests: CompleteClientRequest[];
   
}) {
  const { optimisticClientRequests, addOptimisticClientRequest } = useOptimisticClientRequests(
    clientRequests,
     
  );
  const [open, setOpen] = useState(false);
  const [activeClientRequest, setActiveClientRequest] = useState<ClientRequest | null>(null);
  const openModal = (clientRequest?: ClientRequest) => {
    setOpen(true);
    clientRequest ? setActiveClientRequest(clientRequest) : setActiveClientRequest(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeClientRequest ? "Edit ClientRequest" : "Create Client Request"}
      >
        <ClientRequestForm
          clientRequest={activeClientRequest}
          addOptimistic={addOptimisticClientRequest}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticClientRequests.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticClientRequests.map((clientRequest) => (
            <ClientRequest
              clientRequest={clientRequest}
              key={clientRequest.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const ClientRequest = ({
  clientRequest,
  openModal,
}: {
  clientRequest: CompleteClientRequest;
  openModal: TOpenModal;
}) => {
  const optimistic = clientRequest.id === "optimistic";
  const deleting = clientRequest.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("client-requests")
    ? pathname
    : pathname + "/client-requests/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{clientRequest.productId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + clientRequest.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No client requests
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new client request.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Client Requests </Button>
      </div>
    </div>
  );
};
