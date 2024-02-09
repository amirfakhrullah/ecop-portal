import { type SupplierResponse } from "@/lib/db/schema/supplierResponses";
import { type ClientRequest } from "@/lib/db/schema/clientRequests";
import {
  type LiaisonResponse,
  type CompleteLiaisonResponse,
} from "@/lib/db/schema/liaisonResponses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (
  action: OptimisticAction<LiaisonResponse>
) => void;

export const useOptimisticLiaisonResponses = (
  liaisonResponses: CompleteLiaisonResponse[],
  supplierResponses: SupplierResponse[],
  clientRequests: ClientRequest[]
) => {
  const [optimisticLiaisonResponses, addOptimisticLiaisonResponse] =
    useOptimistic(
      liaisonResponses,
      (
        currentState: CompleteLiaisonResponse[],
        action: OptimisticAction<LiaisonResponse>
      ): CompleteLiaisonResponse[] => {
        const { data } = action;

        const optimisticSupplierResponse = supplierResponses.find(
          (supplierResponse) =>
            supplierResponse.id === data.originatingSupplierResponseId
        )!;

        const optimisticClientRequest = clientRequests.find(
          (clientRequest) => clientRequest.id === data.respondsToClientRequestId
        )!;

        const optimisticLiaisonResponse = {
          ...data,
          supplierResponse: optimisticSupplierResponse,
          clientRequest: optimisticClientRequest,
          id: "optimistic",
        };

        switch (action.action) {
          case "create":
            return currentState.length === 0
              ? [optimisticLiaisonResponse]
              : [...currentState, optimisticLiaisonResponse];
          case "update":
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticLiaisonResponse }
                : item
            );
          case "delete":
            return currentState.map((item) =>
              item.id === data.id ? { ...item, id: "delete" } : item
            );
          default:
            return currentState;
        }
      }
    );

  return { addOptimisticLiaisonResponse, optimisticLiaisonResponses };
};
