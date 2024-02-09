
import { type ClientRequest, type CompleteClientRequest } from "@/lib/db/schema/clientRequests";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<ClientRequest>) => void;

export const useOptimisticClientRequests = (
  clientRequests: CompleteClientRequest[],
  
) => {
  const [optimisticClientRequests, addOptimisticClientRequest] = useOptimistic(
    clientRequests,
    (
      currentState: CompleteClientRequest[],
      action: OptimisticAction<ClientRequest>,
    ): CompleteClientRequest[] => {
      const { data } = action;

      

      const optimisticClientRequest = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticClientRequest]
            : [...currentState, optimisticClientRequest];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticClientRequest } : item,
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

  return { addOptimisticClientRequest, optimisticClientRequests };
};
