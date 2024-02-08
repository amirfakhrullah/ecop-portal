"use server";

import { revalidatePath } from "next/cache";
import {
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/lib/api/companies/mutations";
import {
  CompanyId,
  NewCompanyParams,
  UpdateCompanyParams,
  companyIdSchema,
  insertCompanyParams,
  updateCompanyParams,
} from "@/lib/db/schema/companies";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCompanies = () => revalidatePath("/companies");

export const createCompanyAction = async (input: NewCompanyParams) => {
  try {
    const payload = insertCompanyParams.parse(input);
    await createCompany(payload);
    revalidateCompanies();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCompanyAction = async (input: UpdateCompanyParams) => {
  try {
    const payload = updateCompanyParams.parse(input);
    await updateCompany(payload.id, payload);
    revalidateCompanies();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCompanyAction = async (input: CompanyId) => {
  try {
    const payload = companyIdSchema.parse({ id: input });
    await deleteCompany(payload.id);
    revalidateCompanies();
  } catch (e) {
    return handleErrors(e);
  }
};