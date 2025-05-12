"use client";

import { Suspense, useState, type PropsWithChildren } from "react";
import {
  miniApp,
  retrieveLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";

import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorPage } from "./ErrorPage";
import { ErrorBoundary } from "./ErrorBoundary";
// import { setLocale } from '@web/core/i18n/locale';

import "./styles.css";
import { useClientOnce, useDidMount, useTelegramMock } from "../hooks";
import { init } from "../lib";
import { TonConnectUIProvider } from "@web/features/ton-connect/ui";
import { ThemeProvider } from "./ThemeProvider";
import { MiniAppBackground } from "./MiniAppBackground";
import Image from "next/image";
import { Context } from "./Context";
import { TRPCProvider } from "@web/shared/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "@server/@generated/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function RootInner({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "https://tonza.dingir.xyz/api/trpc",
        }),
      ],
    })
  );

  const isDev = true;

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = retrieveLaunchParams();
  const debug = isDev || lp.startParam === "debug";

  // Initialize the library.
  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  //   const initDataUser = useSignal(initData.user);

  // Set the user locale.
  //   useEffect(() => {
  //     if (initDataUser) setLocale(initDataUser.language_code);
  //   }, [initDataUser]);

  if(!trpcClient) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <Suspense
          fallback={
            <div className="flex flex-col gap-8 items-center justify-center h-screen text-white px-4 user-select-none">
              <div className="relative">
                <Image
                  className="h-auto max-w-[180px] user-select-none animate-pulse"
                  src="/logo.svg"
                  draggable="false"
                  alt="Tonza Logo"
                  width={180}
                  height={180}
                />
              </div>
            </div>
          }
        >
          <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <AppRoot
                appearance={isDark ? "dark" : "light"}
                platform={
                  ["macos", "ios"].includes(lp.tgWebAppPlatform)
                    ? "ios"
                    : "base"
                }
                className="h-full"
                data-vaul-drawer-wrapper=""
              >
                <MiniAppBackground />
                <Context>{children}</Context>
              </AppRoot>
            </ThemeProvider>
          </TonConnectUIProvider>
        </Suspense>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading</div>
  );
}
