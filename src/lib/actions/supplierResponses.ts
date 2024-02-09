"use server";

import { revalidatePath } from "next/cache";
import {
  createSupplierResponse,
  deleteSupplierResponse,
  updateSupplierResponse,
} from "@/lib/api/supplierResponses/mutations";
import {
  SupplierResponseId,
  NewSupplierResponseParams,
  UpdateSupplierResponseParams,
  supplierResponseIdSchema,
  insertSupplierResponseParams,
  updateSupplierResponseParams,
} from "@/lib/db/schema/supplierResponses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateSupplierResponses = () => revalidatePath("/supplier-responses");

export const createSupplierResponseAction = async (input: NewSupplierResponseParams) => {
  try {
    const payload = insertSupplierResponseParams.parse(input);
    await createSupplierResponse(payload);
    revalidateSupplierResponses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSupplierResponseAction = async (input: UpdateSupplierResponseParams) => {
  try {
    const payload = updateSupplierResponseParams.parse(input);
    await updateSupplierResponse(payload.id, payload);
    revalidateSupplierResponses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteSupplierResponseAction = async (input: SupplierResponseId) => {
  try {
    const payload = supplierResponseIdSchema.parse({ id: input });
    await deleteSupplierResponse(payload.id);
    revalidateSupplierResponses();
  } catch (e) {
    return handleErrors(e);
  }
};