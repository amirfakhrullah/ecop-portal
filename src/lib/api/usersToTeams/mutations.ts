import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  UsersToTeamId, 
  NewUsersToTeamParams,
  UpdateUsersToTeamParams, 
  updateUsersToTeamSchema,
  insertUsersToTeamSchema, 
  usersToTeams,
  usersToTeamIdSchema 
} from "@/lib/db/schema/usersToTeams";
import { getUserAuth } from "@/lib/auth/utils";

export const createUsersToTeam = async (usersToTeam: NewUsersToTeamParams) => {
  const { session } = await getUserAuth();
  const newUsersToTeam = insertUsersToTeamSchema.parse({ ...usersToTeam, userId: session?.user.id! });
  try {
    const [u] =  await db.insert(usersToTeams).values(newUsersToTeam).returning();
    return { usersToTeam: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateUsersToTeam = async (id: UsersToTeamId, usersToTeam: UpdateUsersToTeamParams) => {
  const { session } = await getUserAuth();
  const { id: usersToTeamId } = usersToTeamIdSchema.parse({ id });
  const newUsersToTeam = updateUsersToTeamSchema.parse({ ...usersToTeam, userId: session?.user.id! });
  try {
    const [u] =  await db
     .update(usersToTeams)
     .set({...newUsersToTeam, updatedAt: new Date() })
     .where(and(eq(usersToTeams.id, usersToTeamId!), eq(usersToTeams.userId, session?.user.id!)))
     .returning();
    return { usersToTeam: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteUsersToTeam = async (id: UsersToTeamId) => {
  const { session } = await getUserAuth();
  const { id: usersToTeamId } = usersToTeamIdSchema.parse({ id });
  try {
    const [u] =  await db.delete(usersToTeams).where(and(eq(usersToTeams.id, usersToTeamId!), eq(usersToTeams.userId, session?.user.id!)))
    .returning();
    return { usersToTeam: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

