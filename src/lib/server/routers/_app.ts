import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { companiesRouter } from "./companies";

export const appRouter = router({
  computers: computersRouter,
  companies: companiesRouter,
});

export type AppRouter = typeof appRouter;
