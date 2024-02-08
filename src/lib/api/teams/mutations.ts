import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  TeamId, 
  NewTeamParams,
  UpdateTeamParams, 
  updateTeamSchema,
  insertTeamSchema, 
  teams,
  teamIdSchema 
} from "@/lib/db/schema/teams";
import { getUserAuth } from "@/lib/auth/utils";

export const createTeam = async (team: NewTeamParams) => {
  const { session } = await getUserAuth();
  const newTeam = insertTeamSchema.parse({ ...team, userId: session?.user.id! });
  try {
    const [t] =  await db.insert(teams).values(newTeam).returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTeam = async (id: TeamId, team: UpdateTeamParams) => {
  const { session } = await getUserAuth();
  const { id: teamId } = teamIdSchema.parse({ id });
  const newTeam = updateTeamSchema.parse({ ...team, userId: session?.user.id! });
  try {
    const [t] =  await db
     .update(teams)
     .set({...newTeam, updatedAt: new Date() })
     .where(and(eq(teams.id, teamId!), eq(teams.userId, session?.user.id!)))
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
  const { id: teamId } = teamIdSchema.parse({ id });
  try {
    const [t] =  await db.delete(teams).where(and(eq(teams.id, teamId!), eq(teams.userId, session?.user.id!)))
    .returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

