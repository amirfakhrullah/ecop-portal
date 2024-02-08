import { Suspense } from "react";

import Loading from "@/app/loading";
import CompanyList from "@/components/companies/CompanyList";
import { getCompanies } from "@/lib/api/companies/queries";


export const revalidate = 0;

export default async function CompaniesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Companies</h1>
        </div>
        <Companies />
      </div>
    </main>
  );
}

const Companies = async () => {
  
  const { companies } = await getCompanies();
  
  return (
    <Suspense fallback={<Loading />}>
      <CompanyList companies={companies}  />
    </Suspense>
  );
};
