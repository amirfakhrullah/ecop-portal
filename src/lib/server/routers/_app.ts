import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { companiesRouter } from "./companies";
import { clientRequestsRouter } from "./clientRequests";
import { liaisonRequestsRouter } from "./liaisonRequests";
import { supplierResponsesRouter } from "./supplierResponses";
import { liaisonResponsesRouter } from "./liaisonResponses";

export const appRouter = router({
  computers: computersRouter,
  companies: companiesRouter,
  clientRequests: clientRequestsRouter,
  liaisonRequests: liaisonRequestsRouter,
  supplierResponses: supplierResponsesRouter,
  liaisonResponses: liaisonResponsesRouter,
});

export type AppRouter = typeof appRouter;
