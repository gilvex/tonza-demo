import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from '@server/@generated/server'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://tonzaminesdemoserver.loca.lt/trpc", // you should update this to use env variables
    }),
  ],
});
