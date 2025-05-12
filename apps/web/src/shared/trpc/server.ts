import { AppRouter } from "@server/@generated/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://tonza.dingir.xyz/api/trpc",
    }),
  ],
});