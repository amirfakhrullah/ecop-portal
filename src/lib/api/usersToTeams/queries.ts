import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type UsersToTeamId, usersToTeamIdSchema, usersToTeams } from "@/lib/db/schema/usersToTeams";
import { teams } from "@/lib/db/schema/teams";

export const getUsersToTeams = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ usersToTeam: usersToTeams, team: teams }).from(usersToTeams).leftJoin(teams, eq(usersToTeams.teamId, teams.id)).where(eq(usersToTeams.userId, session?.user.id!));
  const u = rows .map((r) => ({ ...r.usersToTeam, team: r.team})); 
  return { usersToTeams: u };
};

export const getUsersToTeamById = async (id: UsersToTeamId) => {
  const { session } = await getUserAuth();
  const { id: usersToTeamId } = usersToTeamIdSchema.parse({ id });
  const [row] = await db.select({ usersToTeam: usersToTeams, team: teams }).from(usersToTeams).where(and(eq(usersToTeams.id, usersToTeamId), eq(usersToTeams.userId, session?.user.id!))).leftJoin(teams, eq(usersToTeams.teamId, teams.id));
  if (row === undefined) return {};
  const u =  { ...row.usersToTeam, team: row.team } ;
  return { usersToTeam: u };
};


