import { type Company } from "@/lib/db/schema/companies";
import { type Team, type CompleteTeam } from "@/lib/db/schema/teams";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Team>) => void;

export const useOptimisticTeams = (
  teams: CompleteTeam[],
  companies: Company[]
) => {
  const [optimisticTeams, addOptimisticTeam] = useOptimistic(
    teams,
    (
      currentState: CompleteTeam[],
      action: OptimisticAction<Team>,
    ): CompleteTeam[] => {
      const { data } = action;

      const optimisticCompany = companies.find(
        (company) => company.id === data.companyId,
      )!;

      const optimisticTeam = {
        ...data,
        company: optimisticCompany,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticTeam]
            : [...currentState, optimisticTeam];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticTeam } : item,
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

  return { addOptimisticTeam, optimisticTeams };
};
