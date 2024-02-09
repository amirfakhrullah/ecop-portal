"use server";

import { revalidatePath } from "next/cache";
import {
  createClientRequest,
  deleteClientRequest,
  updateClientRequest,
} from "@/lib/api/clientRequests/mutations";
import {
  ClientRequestId,
  NewClientRequestParams,
  UpdateClientRequestParams,
  clientRequestIdSchema,
  insertClientRequestParams,
  updateClientRequestParams,
} from "@/lib/db/schema/clientRequests";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateClientRequests = () => revalidatePath("/client-requests");

export const createClientRequestAction = async (input: NewClientRequestParams) => {
  try {
    const payload = insertClientRequestParams.parse(input);
    await createClientRequest(payload);
    revalidateClientRequests();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateClientRequestAction = async (input: UpdateClientRequestParams) => {
  try {
    const payload = updateClientRequestParams.parse(input);
    await updateClientRequest(payload.id, payload);
    revalidateClientRequests();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteClientRequestAction = async (input: ClientRequestId) => {
  try {
    const payload = clientRequestIdSchema.parse({ id: input });
    await deleteClientRequest(payload.id);
    revalidateClientRequests();
  } catch (e) {
    return handleErrors(e);
  }
};