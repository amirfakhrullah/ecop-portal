import { type ClientRequest } from "@/lib/db/schema/clientRequests";
import { type Company } from "@/lib/db/schema/companies";
import { type LiaisonRequest, type CompleteLiaisonRequest } from "@/lib/db/schema/liaisonRequests";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<LiaisonRequest>) => void;

export const useOptimisticLiaisonRequests = (
  liaisonRequests: CompleteLiaisonRequest[],
  clientRequests: ClientRequest[],
  companies: Company[]
) => {
  const [optimisticLiaisonRequests, addOptimisticLiaisonRequest] = useOptimistic(
    liaisonRequests,
    (
      currentState: CompleteLiaisonRequest[],
      action: OptimisticAction<LiaisonRequest>,
    ): CompleteLiaisonRequest[] => {
      const { data } = action;

      const optimisticClientRequest = clientRequests.find(
        (clientRequest) => clientRequest.id === data.originatingClientRequestId,
      )!;

      const optimisticCompany = companies.find(
        (company) => company.id === data.forwardedToSupplierId,
      )!;

      const optimisticLiaisonRequest = {
        ...data,
        clientRequest: optimisticClientRequest,
       company: optimisticCompany,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLiaisonRequest]
            : [...currentState, optimisticLiaisonRequest];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLiaisonRequest } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticLiaisonRequest, optimisticLiaisonRequests };
};
