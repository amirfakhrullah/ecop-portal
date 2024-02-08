import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  CompanyId,
  NewCompanyParams,
  UpdateCompanyParams,
  updateCompanySchema,
  insertCompanySchema,
  companies,
  companyIdSchema,
} from "@/lib/db/schema/companies";
import { usersToCompanies } from "@/lib/db/schema/usersToCompanies";
import { getUserAuth } from "@/lib/auth/utils";

export const createCompany = async (company: NewCompanyParams) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const newCompany = insertCompanySchema.parse(company);
    const [c] = await db
      .insert(companies)
      .values({
        ...newCompany,
        // assert domains type (was defaulting to Json)
        domains: newCompany.domains as string[],
      })
      .returning();
    // add to usersToCompanies
    await db.insert(usersToCompanies).values({
      companyId: c.id,
      userId: session.user.id,
    });
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCompany = async (
  id: CompanyId,
  company: UpdateCompanyParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: companyId } = companyIdSchema.parse({ id });
  const updatedCompany = updateCompanySchema.parse(company);

  try {
    const [{ foundCompany }] = await db
      .select({ foundCompany: companies })
      .from(usersToCompanies)
      .leftJoin(companies, eq(companies.id, usersToCompanies.companyId))
      .where(
        and(
          eq(usersToCompanies.companyId, companyId),
          eq(usersToCompanies.userId, session.user.id)
        )
      );

    if (!foundCompany) {
      throw new Error("User does not belong to the company");
    }

    const [c] = await db
      .update(companies)
      .set({
        ...updatedCompany,
        // assert domains type (was defaulting to Json)
        domains: updatedCompany.domains as string[],
        updatedAt: new Date(),
      })
      .where(eq(companies.id, foundCompany.id))
      .returning();
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCompany = async (id: CompanyId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: companyId } = companyIdSchema.parse({ id });
  try {
    const [{ foundCompany }] = await db
      .select({ foundCompany: companies })
      .from(usersToCompanies)
      .leftJoin(companies, eq(companies.id, usersToCompanies.companyId))
      .where(
        and(
          eq(usersToCompanies.companyId, companyId),
          eq(usersToCompanies.userId, session.user.id)
        )
      );

    if (!foundCompany) {
      throw new Error("User does not belong to the company");
    }

    const [c] = await db
      .delete(companies)
      .where(eq(companies.id, foundCompany.id))
      .returning();
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
