import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TeamId, teamIdSchema, teams } from "@/lib/db/schema/teams";
import { companies } from "@/lib/db/schema/companies";

export const getTeams = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ team: teams, company: companies }).from(teams).leftJoin(companies, eq(teams.companyId, companies.id)).where(eq(teams.userId, session?.user.id!));
  const t = rows .map((r) => ({ ...r.team, company: r.company})); 
  return { teams: t };
};

export const getTeamById = async (id: TeamId) => {
  const { session } = await getUserAuth();
  const { id: teamId } = teamIdSchema.parse({ id });
  const [row] = await db.select({ team: teams, company: companies }).from(teams).where(and(eq(teams.id, teamId), eq(teams.userId, session?.user.id!))).leftJoin(companies, eq(teams.companyId, companies.id));
  if (row === undefined) return {};
  const t =  { ...row.team, company: row.company } ;
  return { team: t };
};


