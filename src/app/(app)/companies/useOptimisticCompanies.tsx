import { type Company, type CompleteCompany } from "@/lib/db/schema/companies";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Company>) => void;

export const useOptimisticCompanies = (companies: CompleteCompany[]) => {
  const [optimisticCompanies, addOptimisticCompany] = useOptimistic(
    companies,
    (
      currentState: CompleteCompany[],
      action: OptimisticAction<Company>
    ): CompleteCompany[] => {
      const { data } = action;

      const optimisticCompany = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCompany]
            : [...currentState, optimisticCompany];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCompany } : item
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

  return { addOptimisticCompany, optimisticCompanies };
};
