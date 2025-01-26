import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from '@server/@generated/server'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/trpc", // you should update this to use env variables
    }),
  ],
});
