"use server";

import { revalidatePath } from "next/cache";
import {
  createLiaisonResponse,
  deleteLiaisonResponse,
  updateLiaisonResponse,
} from "@/lib/api/liaisonResponses/mutations";
import {
  LiaisonResponseId,
  NewLiaisonResponseParams,
  UpdateLiaisonResponseParams,
  liaisonResponseIdSchema,
  insertLiaisonResponseParams,
  updateLiaisonResponseParams,
} from "@/lib/db/schema/liaisonResponses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLiaisonResponses = () => revalidatePath("/liaison-responses");

export const createLiaisonResponseAction = async (
  input: NewLiaisonResponseParams
) => {
  try {
    const payload = insertLiaisonResponseParams.parse(input);
    await createLiaisonResponse(payload);
    revalidateLiaisonResponses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLiaisonResponseAction = async (
  input: UpdateLiaisonResponseParams
) => {
  try {
    const payload = updateLiaisonResponseParams.parse(input);
    await updateLiaisonResponse(payload.id, payload);
    revalidateLiaisonResponses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLiaisonResponseAction = async (input: LiaisonResponseId) => {
  try {
    const payload = liaisonResponseIdSchema.parse({ id: input });
    await deleteLiaisonResponse(payload.id);
    revalidateLiaisonResponses();
  } catch (e) {
    return handleErrors(e);
  }
};
