import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { companiesRouter } from "./companies";
import { clientRequestsRouter } from "./clientRequests";
import { liaisonRequestsRouter } from "./liaisonRequests";

export const appRouter = router({
  computers: computersRouter,
  companies: companiesRouter,
  clientRequests: clientRequestsRouter,
  liaisonRequests: liaisonRequestsRouter,
});

export type AppRouter = typeof appRouter;
