import { getClientRequestById, getClientRequests } from "@/lib/api/clientRequests/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  clientRequestIdSchema,
  insertClientRequestParams,
  updateClientRequestParams,
} from "@/lib/db/schema/clientRequests";
import { createClientRequest, deleteClientRequest, updateClientRequest } from "@/lib/api/clientRequests/mutations";

export const clientRequestsRouter = router({
  getClientRequests: publicProcedure.query(async () => {
    return getClientRequests();
  }),
  getClientRequestById: publicProcedure.input(clientRequestIdSchema).query(async ({ input }) => {
    return getClientRequestById(input.id);
  }),
  createClientRequest: publicProcedure
    .input(insertClientRequestParams)
    .mutation(async ({ input }) => {
      return createClientRequest(input);
    }),
  updateClientRequest: publicProcedure
    .input(updateClientRequestParams)
    .mutation(async ({ input }) => {
      return updateClientRequest(input.id, input);
    }),
  deleteClientRequest: publicProcedure
    .input(clientRequestIdSchema)
    .mutation(async ({ input }) => {
      return deleteClientRequest(input.id);
    }),
});
