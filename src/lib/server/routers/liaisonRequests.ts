import { getLiaisonRequestById, getLiaisonRequests } from "@/lib/api/liaisonRequests/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  liaisonRequestIdSchema,
  insertLiaisonRequestParams,
  updateLiaisonRequestParams,
} from "@/lib/db/schema/liaisonRequests";
import { createLiaisonRequest, deleteLiaisonRequest, updateLiaisonRequest } from "@/lib/api/liaisonRequests/mutations";

export const liaisonRequestsRouter = router({
  getLiaisonRequests: publicProcedure.query(async () => {
    return getLiaisonRequests();
  }),
  getLiaisonRequestById: publicProcedure.input(liaisonRequestIdSchema).query(async ({ input }) => {
    return getLiaisonRequestById(input.id);
  }),
  createLiaisonRequest: publicProcedure
    .input(insertLiaisonRequestParams)
    .mutation(async ({ input }) => {
      return createLiaisonRequest(input);
    }),
  updateLiaisonRequest: publicProcedure
    .input(updateLiaisonRequestParams)
    .mutation(async ({ input }) => {
      return updateLiaisonRequest(input.id, input);
    }),
  deleteLiaisonRequest: publicProcedure
    .input(liaisonRequestIdSchema)
    .mutation(async ({ input }) => {
      return deleteLiaisonRequest(input.id);
    }),
});
