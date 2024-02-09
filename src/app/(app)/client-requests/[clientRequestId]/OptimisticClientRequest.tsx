"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/client-requests/useOptimisticClientRequests";
import { type ClientRequest } from "@/lib/db/schema/clientRequests";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ClientRequestForm from "@/components/clientRequests/ClientRequestForm";


export default function OptimisticClientRequest({ 
  clientRequest,
   
}: { 
  clientRequest: ClientRequest; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: ClientRequest) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticClientRequest, setOptimisticClientRequest] = useOptimistic(clientRequest);
  const updateClientRequest: TAddOptimistic = (input) =>
    setOptimisticClientRequest({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ClientRequestForm
          clientRequest={clientRequest}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateClientRequest}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{clientRequest.productId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticClientRequest.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticClientRequest, null, 2)}
      </pre>
    </div>
  );
}
