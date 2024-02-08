import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type UsersToCompanyId, usersToCompanyIdSchema, usersToCompanies } from "@/lib/db/schema/usersToCompanies";
import { companies } from "@/lib/db/schema/companies";

export const getUsersToCompanies = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ usersToCompany: usersToCompanies, company: companies }).from(usersToCompanies).leftJoin(companies, eq(usersToCompanies.companyId, companies.id)).where(eq(usersToCompanies.userId, session?.user.id!));
  const u = rows .map((r) => ({ ...r.usersToCompany, company: r.company})); 
  return { usersToCompanies: u };
};

export const getUsersToCompanyById = async (id: UsersToCompanyId) => {
  const { session } = await getUserAuth();
  const { id: usersToCompanyId } = usersToCompanyIdSchema.parse({ id });
  const [row] = await db.select({ usersToCompany: usersToCompanies, company: companies }).from(usersToCompanies).where(and(eq(usersToCompanies.id, usersToCompanyId), eq(usersToCompanies.userId, session?.user.id!))).leftJoin(companies, eq(usersToCompanies.companyId, companies.id));
  if (row === undefined) return {};
  const u =  { ...row.usersToCompany, company: row.company } ;
  return { usersToCompany: u };
};


