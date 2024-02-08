import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTeamById } from "@/lib/api/teams/queries";
import { getCompanies } from "@/lib/api/companies/queries";
import OptimisticTeam from "./OptimisticTeam";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  return (
    <main className="overflow-auto">
      <Team id={params.teamId} />
    </main>
  );
}

const Team = async ({ id }: { id: string }) => {
  await checkAuth();

  const [{ team, company }, { companies: allCompanies }] = await Promise.all([
    getTeamById(id),
    getCompanies(),
  ]);
  if (!team || !company) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="teams" />
        <OptimisticTeam
          team={team}
          company={company}
          allCompanies={allCompanies}
        />
      </div>
    </Suspense>
  );
};
