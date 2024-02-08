import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  CompanyId,
  NewCompanyParams,
  UpdateCompanyParams,
  updateCompanySchema,
  insertCompanySchema,
  companies,
  companyIdSchema,
} from "@/lib/db/schema/companies";

export const createCompany = async (company: NewCompanyParams) => {
  const newCompany = insertCompanySchema.parse(company);
  try {
    const [c] = await db.insert(companies).values(newCompany).returning();
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
  const { id: companyId } = companyIdSchema.parse({ id });
  const newCompany = updateCompanySchema.parse(company);
  try {
    const [c] = await db
      .update(companies)
      .set({ ...newCompany, updatedAt: new Date() })
      .where(eq(companies.id, companyId!))
      .returning();
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCompany = async (id: CompanyId) => {
  const { id: companyId } = companyIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(companies)
      .where(eq(companies.id, companyId!))
      .returning();
    return { company: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
