"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Team, CompleteTeam } from "@/lib/db/schema/teams";
import Modal from "@/components/shared/Modal";
import { type Company, type CompanyId } from "@/lib/db/schema/companies";
import { useOptimisticTeams } from "@/app/(app)/teams/useOptimisticTeams";
import { Button } from "@/components/ui/button";
import TeamForm from "./TeamForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (team?: Team) => void;

export default function TeamList({
  teams,
  companies,
  companyId 
}: {
  teams: CompleteTeam[];
  companies: Company[];
  companyId?: CompanyId 
}) {
  const { optimisticTeams, addOptimisticTeam } = useOptimisticTeams(
    teams,
    companies 
  );
  const [open, setOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const openModal = (team?: Team) => {
    setOpen(true);
    team ? setActiveTeam(team) : setActiveTeam(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeTeam ? "Edit Team" : "Create Team"}
      >
        <TeamForm
          team={activeTeam}
          addOptimistic={addOptimisticTeam}
          openModal={openModal}
          closeModal={closeModal}
          companies={companies}
        companyId={companyId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticTeams.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticTeams.map((team) => (
            <Team
              team={team}
              key={team.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Team = ({
  team,
  openModal,
}: {
  team: CompleteTeam;
  openModal: TOpenModal;
}) => {
  const optimistic = team.id === "optimistic";
  const deleting = team.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("teams")
    ? pathname
    : pathname + "/teams/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{team.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + team.id }>
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
        No teams
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new team.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Teams </Button>
      </div>
    </div>
  );
};
