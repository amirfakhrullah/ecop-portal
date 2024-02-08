import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TeamId, teamIdSchema, teams } from "@/lib/db/schema/teams";
import { CompanyId, companies } from "@/lib/db/schema/companies";
import { usersToTeams } from "@/lib/db/schema/usersToTeams";

export const getTeams = async () => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const rows = await db
    .select({
      teams: teams,
      company: companies,
    })
    .from(usersToTeams)
    .leftJoin(teams, eq(teams.id, usersToTeams.teamId))
    .leftJoin(companies, eq(companies.id, teams.companyId))
    .where(eq(usersToTeams.userId, session.user.id));
  return rows;
};

export const getTeamById = async (id: TeamId) => {
  const { session } = await getUserAuth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: teamId } = teamIdSchema.parse({ id });
  const [row] = await db
    .select({ team: teams, company: companies })
    .from(usersToTeams)
    .leftJoin(teams, eq(teams.id, usersToTeams.teamId))
    .leftJoin(companies, eq(companies.id, teams.companyId))
    .where(
      and(
        eq(usersToTeams.teamId, teamId),
        eq(usersToTeams.userId, session.user.id)
      )
    );
  if (row === undefined) return {};
  return { team: row.team, company: row.company };
};

export const getTeamsByCompanyId = async (companyId: CompanyId) => {};
