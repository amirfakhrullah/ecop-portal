import { type LiaisonRequest } from "@/lib/db/schema/liaisonRequests";
import {
  type SupplierResponse,
  type CompleteSupplierResponse,
} from "@/lib/db/schema/supplierResponses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (
  action: OptimisticAction<SupplierResponse>
) => void;

export const useOptimisticSupplierResponses = (
  supplierResponses: CompleteSupplierResponse[],
  liaisonRequests: LiaisonRequest[]
) => {
  const [optimisticSupplierResponses, addOptimisticSupplierResponse] =
    useOptimistic(
      supplierResponses,
      (
        currentState: CompleteSupplierResponse[],
        action: OptimisticAction<SupplierResponse>
      ): CompleteSupplierResponse[] => {
        const { data } = action;

        const optimisticLiaisonRequest = liaisonRequests.find(
          (liaisonRequest) => liaisonRequest.id === data.respondsToLiaisonRequestId
        )!;

        const optimisticSupplierResponse = {
          ...data,
          liaisonRequest: optimisticLiaisonRequest,
          id: "optimistic",
        };

        switch (action.action) {
          case "create":
            return currentState.length === 0
              ? [optimisticSupplierResponse]
              : [...currentState, optimisticSupplierResponse];
          case "update":
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticSupplierResponse }
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

  return { addOptimisticSupplierResponse, optimisticSupplierResponses };
};
