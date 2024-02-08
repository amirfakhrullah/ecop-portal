import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCompanyById } from "@/lib/api/companies/queries";
import OptimisticCompany from "./OptimisticCompany";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


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
  
  const { company } = await getCompanyById(id);
  

  if (!company) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="companies" />
        <OptimisticCompany company={company}  />
      </div>
    </Suspense>
  );
};
