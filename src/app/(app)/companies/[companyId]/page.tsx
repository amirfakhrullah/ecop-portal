import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCompanyById, getCompanyUsers } from "@/lib/api/companies/queries";
import OptimisticCompany from "./OptimisticCompany";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getTeamsByCompanyId } from "@/lib/api/teams/queries";

export const revalidate = 0;

export default async function CompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  return (
    <main className="overflow-auto">
      <Company id={params.companyId} />
    </main>
  );
}

const Company = async ({ id }: { id: string }) => {
  const [{ company }, teams, companyUsers] = await Promise.all([
    getCompanyById(id),
    getTeamsByCompanyId(id),
    getCompanyUsers(id),
  ]);
  if (!company) notFound();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="companies" />
        <OptimisticCompany company={company} />
        <h1 className="font-semibold text-2xl">List of company teams</h1>
        <pre className="bg-secondary p-4 rounded-lg break-all text-wrap">
          {JSON.stringify(teams, null, 2)}
        </pre>
        <h1 className="font-semibold text-2xl">List of company users</h1>
        <pre className="bg-secondary p-4 rounded-lg break-all text-wrap">
          {JSON.stringify(companyUsers, null, 2)}
        </pre>
      </div>
    </Suspense>
  );
};
