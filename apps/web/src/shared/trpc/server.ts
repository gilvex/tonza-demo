import { AppRouter } from "@server/@generated/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_API_DOMAIN!,
    }),
  ],
});