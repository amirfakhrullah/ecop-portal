"use server";

import { revalidatePath } from "next/cache";
import {
  createTeam,
  deleteTeam,
  updateTeam,
} from "@/lib/api/teams/mutations";
import {
  TeamId,
  NewTeamParams,
  UpdateTeamParams,
  teamIdSchema,
  insertTeamParams,
  updateTeamParams,
} from "@/lib/db/schema/teams";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTeams = () => revalidatePath("/teams");

export const createTeamAction = async (input: NewTeamParams) => {
  try {
    const payload = insertTeamParams.parse(input);
    await createTeam(payload);
    revalidateTeams();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTeamAction = async (input: UpdateTeamParams) => {
  try {
    const payload = updateTeamParams.parse(input);
    await updateTeam(payload.id, payload);
    revalidateTeams();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTeamAction = async (input: TeamId) => {
  try {
    const payload = teamIdSchema.parse({ id: input });
    await deleteTeam(payload.id);
    revalidateTeams();
  } catch (e) {
    return handleErrors(e);
  }
};