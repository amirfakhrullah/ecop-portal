"use server";

import { revalidatePath } from "next/cache";
import {
  createLiaisonRequest,
  deleteLiaisonRequest,
  updateLiaisonRequest,
} from "@/lib/api/liaisonRequests/mutations";
import {
  LiaisonRequestId,
  NewLiaisonRequestParams,
  UpdateLiaisonRequestParams,
  liaisonRequestIdSchema,
  insertLiaisonRequestParams,
  updateLiaisonRequestParams,
} from "@/lib/db/schema/liaisonRequests";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLiaisonRequests = () => revalidatePath("/liaison-requests");

export const createLiaisonRequestAction = async (input: NewLiaisonRequestParams) => {
  try {
    const payload = insertLiaisonRequestParams.parse(input);
    await createLiaisonRequest(payload);
    revalidateLiaisonRequests();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLiaisonRequestAction = async (input: UpdateLiaisonRequestParams) => {
  try {
    const payload = updateLiaisonRequestParams.parse(input);
    await updateLiaisonRequest(payload.id, payload);
    revalidateLiaisonRequests();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLiaisonRequestAction = async (input: LiaisonRequestId) => {
  try {
    const payload = liaisonRequestIdSchema.parse({ id: input });
    await deleteLiaisonRequest(payload.id);
    revalidateLiaisonRequests();
  } catch (e) {
    return handleErrors(e);
  }
};