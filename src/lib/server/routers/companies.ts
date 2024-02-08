import { getCompanyById, getCompanies } from "@/lib/api/companies/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  companyIdSchema,
  insertCompanyParams,
  updateCompanyParams,
} from "@/lib/db/schema/companies";
import { createCompany, deleteCompany, updateCompany } from "@/lib/api/companies/mutations";

export const companiesRouter = router({
  getCompanies: publicProcedure.query(async () => {
    return getCompanies();
  }),
  getCompanyById: publicProcedure.input(companyIdSchema).query(async ({ input }) => {
    return getCompanyById(input.id);
  }),
  createCompany: publicProcedure
    .input(insertCompanyParams)
    .mutation(async ({ input }) => {
      return createCompany(input);
    }),
  updateCompany: publicProcedure
    .input(updateCompanyParams)
    .mutation(async ({ input }) => {
      return updateCompany(input.id, input);
    }),
  deleteCompany: publicProcedure
    .input(companyIdSchema)
    .mutation(async ({ input }) => {
      return deleteCompany(input.id);
    }),
});
