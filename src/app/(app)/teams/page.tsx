import { Suspense } from "react";

import Loading from "@/app/loading";
import TeamList from "@/components/teams/TeamList";
import { getTeams } from "@/lib/api/teams/queries";
import { getCompanies } from "@/lib/api/companies/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function TeamsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Teams</h1>
        </div>
        <Teams />
      </div>
    </main>
  );
}

const Teams = async () => {
  await checkAuth();

  const [data, { companies }] = await Promise.all([getTeams(), getCompanies()]);
  return (
    <Suspense fallback={<Loading />}>
      <TeamList
        teams={data.map(({ teams }) => teams!).flat()}
        companies={companies}
      />
    </Suspense>
  );
};
