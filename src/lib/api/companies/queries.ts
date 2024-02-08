import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  type CompanyId,
  companyIdSchema,
  companies,
} from "@/lib/db/schema/companies";
import { usersToCompanies } from "@/lib/db/schema/usersToCompanies";
import { getUserAuth } from "@/lib/auth/utils";

export const getCompanies = async () => {
  const rows = await db.select().from(companies);
  const c = rows;
  return { companies: c };
};

export const getCompanyById = async (id: CompanyId) => {
  const { id: companyId } = companyIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId));
  if (row === undefined) return {};
  const c = row;
  return { company: c };
};

export const getUserCompanies = async () => {
  const { session } = await getUserAuth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const rows = await db
    .select()
    .from(usersToCompanies)
    .leftJoin(companies, eq(companies.id, usersToCompanies.companyId))
    .where(eq(usersToCompanies.userId, session.user.id));
  const c = rows;
  return { companies: c };
};
