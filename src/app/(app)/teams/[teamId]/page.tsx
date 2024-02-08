import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTeamById, getTeamMembers } from "@/lib/api/teams/queries";
import { getCompanies, getMyCompanies } from "@/lib/api/companies/queries";
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

  const [{ team, company }, { companies: myCompanies }, teamMembers] =
    await Promise.all([getTeamById(id), getMyCompanies(), getTeamMembers(id)]);

  if (!team || !company) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="teams" />
        <OptimisticTeam
          team={team}
          company={company}
          myCompanies={myCompanies}
        />
        <h1 className="font-semibold text-2xl">Team Users</h1>
        <pre className="bg-secondary p-4 rounded-lg break-all text-wrap">
          {JSON.stringify(teamMembers, null, 2)}
        </pre>
      </div>
    </Suspense>
  );
};
