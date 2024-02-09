import {
  getLiaisonResponseById,
  getLiaisonResponses,
} from "@/lib/api/liaisonResponses/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  liaisonResponseIdSchema,
  insertLiaisonResponseParams,
  updateLiaisonResponseParams,
} from "@/lib/db/schema/liaisonResponses";
import {
  createLiaisonResponse,
  deleteLiaisonResponse,
  updateLiaisonResponse,
} from "@/lib/api/liaisonResponses/mutations";

export const liaisonResponsesRouter = router({
  getLiaisonResponses: publicProcedure.query(async () => {
    return getLiaisonResponses();
  }),
  getLiaisonResponseById: publicProcedure
    .input(liaisonResponseIdSchema)
    .query(async ({ input }) => {
      return getLiaisonResponseById(input.id);
    }),
  createLiaisonResponse: publicProcedure
    .input(insertLiaisonResponseParams)
    .mutation(async ({ input }) => {
      return createLiaisonResponse(input);
    }),
  updateLiaisonResponse: publicProcedure
    .input(updateLiaisonResponseParams)
    .mutation(async ({ input }) => {
      return updateLiaisonResponse(input.id, input);
    }),
  deleteLiaisonResponse: publicProcedure
    .input(liaisonResponseIdSchema)
    .mutation(async ({ input }) => {
      return deleteLiaisonResponse(input.id);
    }),
});
