import {
  backButton,
  viewport,
  closingBehavior,
  miniApp,
  initData,
  setDebug,
  init as initSDK,
  swipeBehavior,
  miniAppReady,
  expandViewport,
} from "@telegram-apps/sdk-react";

export function init(debug: boolean): void {
  setDebug(debug);

  initSDK();

  if (backButton.isSupported()) {
    backButton.mount();
    backButton.hide();
  }

  void miniApp.mount().catch(console.warn);

  initData.restore();

  void viewport.mount();
  void closingBehavior.mount();
  void closingBehavior.enableConfirmation();
  void swipeBehavior.mount()
  void swipeBehavior.disableVertical();
  void miniAppReady();
  void expandViewport();

  if (debug) {
    import("eruda")
      .then((lib) => lib.default.init({ useShadowDom: true }))
      .catch(console.error);
  }
}
