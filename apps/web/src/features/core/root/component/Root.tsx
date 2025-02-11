"use client";

import { type PropsWithChildren } from "react";
import {
  miniApp,
  retrieveLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";

import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorPage } from "./ErrorPage";
import { ErrorBoundary } from "./ErrorBoundary";
// import { setLocale } from '@/core/i18n/locale';

import "./styles.css";
import { useClientOnce, useDidMount, useTelegramMock } from "../hooks";
import { init } from "../lib";
import { TonConnectUIProvider } from "@web/features/ton-connect/ui";
import { ThemeProvider } from "./ThemeProvider";
import { MiniAppBackground } from "./MiniAppBackground";

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === "development";

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

  return (
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
            ["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"
          }
          className="h-full"
        >
          <MiniAppBackground />
          {children}
        </AppRoot>
      </ThemeProvider>
    </TonConnectUIProvider>
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
