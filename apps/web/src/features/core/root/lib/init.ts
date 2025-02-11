import {
  backButton,
  viewport,
  // themeParams,
  miniApp,
  initData,
  setDebug,
  init as initSDK,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  console.log("initting twa");
  // Set @telegram-apps/sdk-react debug mode.
  setDebug(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  if (backButton.isSupported()) {
    backButton.mount();
  }

  void miniApp.mount().catch(console.warn);
  // .then(() => {
  //   miniApp.bindCssVars();
  // });
  // void themeParams.mount()
  // .then(() => {
  //   themeParams.bindCssVars();
  // });

  initData.restore();

  void viewport
    .mount()
    // .then(() => {
    //   viewport.bindCssVars();
    // })
    // .catch((e) => {
    //   console.error("Something went wrong mounting the viewport", e);
    // });

  // Define components-related CSS variables.
  // miniApp.bindCssVars();
  // themeParams.bindCssVars();

  // Add Eruda if needed.
  if (debug) {
    import("eruda")
      .then((lib) => lib.default.init({ useShadowDom: true }))
      .catch(console.error);
  }
}
