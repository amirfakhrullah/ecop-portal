import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  UsersToCompanyId, 
  NewUsersToCompanyParams,
  UpdateUsersToCompanyParams, 
  updateUsersToCompanySchema,
  insertUsersToCompanySchema, 
  usersToCompanies,
  usersToCompanyIdSchema 
} from "@/lib/db/schema/usersToCompanies";
import { getUserAuth } from "@/lib/auth/utils";

export const createUsersToCompany = async (usersToCompany: NewUsersToCompanyParams) => {
  const { session } = await getUserAuth();
  const newUsersToCompany = insertUsersToCompanySchema.parse({ ...usersToCompany, userId: session?.user.id! });
  try {
    const [u] =  await db.insert(usersToCompanies).values(newUsersToCompany).returning();
    return { usersToCompany: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateUsersToCompany = async (id: UsersToCompanyId, usersToCompany: UpdateUsersToCompanyParams) => {
  const { session } = await getUserAuth();
  const { id: usersToCompanyId } = usersToCompanyIdSchema.parse({ id });
  const newUsersToCompany = updateUsersToCompanySchema.parse({ ...usersToCompany, userId: session?.user.id! });
  try {
    const [u] =  await db
     .update(usersToCompanies)
     .set({...newUsersToCompany, updatedAt: new Date() })
     .where(and(eq(usersToCompanies.id, usersToCompanyId!), eq(usersToCompanies.userId, session?.user.id!)))
     .returning();
    return { usersToCompany: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteUsersToCompany = async (id: UsersToCompanyId) => {
  const { session } = await getUserAuth();
  const { id: usersToCompanyId } = usersToCompanyIdSchema.parse({ id });
  try {
    const [u] =  await db.delete(usersToCompanies).where(and(eq(usersToCompanies.id, usersToCompanyId!), eq(usersToCompanies.userId, session?.user.id!)))
    .returning();
    return { usersToCompany: u };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

