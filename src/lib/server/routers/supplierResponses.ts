import {
  getSupplierResponseById,
  getSupplierResponses,
} from "@/lib/api/supplierResponses/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  supplierResponseIdSchema,
  insertSupplierResponseParams,
  updateSupplierResponseParams,
} from "@/lib/db/schema/supplierResponses";
import {
  createSupplierResponse,
  deleteSupplierResponse,
  updateSupplierResponse,
} from "@/lib/api/supplierResponses/mutations";

export const supplierResponsesRouter = router({
  getSupplierResponses: publicProcedure.query(async () => {
    return getSupplierResponses();
  }),
  getSupplierResponseById: publicProcedure
    .input(supplierResponseIdSchema)
    .query(async ({ input }) => {
      return getSupplierResponseById(input.id);
    }),
  createSupplierResponse: publicProcedure
    .input(insertSupplierResponseParams)
    .mutation(async ({ input }) => {
      return createSupplierResponse(input);
    }),
  updateSupplierResponse: publicProcedure
    .input(updateSupplierResponseParams)
    .mutation(async ({ input }) => {
      return updateSupplierResponse(input.id, input);
    }),
  deleteSupplierResponse: publicProcedure
    .input(supplierResponseIdSchema)
    .mutation(async ({ input }) => {
      return deleteSupplierResponse(input.id);
    }),
});
