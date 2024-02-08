import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  TeamId,
  NewTeamParams,
  UpdateTeamParams,
  updateTeamSchema,
  insertTeamSchema,
  teams,
  teamIdSchema,
} from "@/lib/db/schema/teams";
import { getUserAuth } from "@/lib/auth/utils";
import { usersToTeams } from "@/lib/db/schema/usersToTeams";

export const createTeam = async (team: NewTeamParams) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newTeam = insertTeamSchema.parse(team);
  try {
    const [team] = await db.insert(teams).values(newTeam).returning();
    const [userTeam] = await db
      .insert(usersToTeams)
      .values({
        teamId: team.id,
        userId: session.user.id,
      })
      .returning();
    return { team, userTeam };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTeam = async (id: TeamId, team: UpdateTeamParams) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: teamId } = teamIdSchema.parse({ id });
  const updatedTeam = updateTeamSchema.parse(team);
  try {
    const [{ foundTeam }] = await db
      .select({ foundTeam: teams })
      .from(usersToTeams)
      .leftJoin(teams, eq(teams.id, usersToTeams.teamId))
      .where(
        and(
          eq(usersToTeams.teamId, teamId),
          eq(usersToTeams.userId, session.user.id)
        )
      );

    if (!foundTeam) {
      throw new Error("User does not belong to the team");
    }

    const [t] = await db
      .update(teams)
      .set({ ...updatedTeam, updatedAt: new Date() })
      .where(eq(teams.id, foundTeam.id))
      .returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTeam = async (id: TeamId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: teamId } = teamIdSchema.parse({ id });
  try {
    const [{ foundTeam }] = await db
      .select({ foundTeam: teams })
      .from(usersToTeams)
      .leftJoin(teams, eq(teams.id, usersToTeams.teamId))
      .where(
        and(
          eq(usersToTeams.teamId, teamId),
          eq(usersToTeams.userId, session.user.id)
        )
      );

    if (!foundTeam) {
      throw new Error("User does not belong to the team");
    }

    const [t] = await db
      .delete(teams)
      .where(eq(teams.id, foundTeam.id))
      .returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
