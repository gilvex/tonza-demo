import {
  miniApp,
  setMiniAppBackgroundColor,
  setMiniAppHeaderColor,
} from "@telegram-apps/sdk-react";
import { getComputedHSL } from "@web/shared/color";
import { useEffect, useState } from "react";

export function MiniAppBackground() {
  const isAvailable = setMiniAppBackgroundColor.isAvailable();
  const isMounted = miniApp.isMounted();
  const [backgroundColor, setBackgroundColor] = useState<string | null>(
    getComputedHSL("--background")
  );

  useEffect(() => {
    const setBg = (async (retryCount: number) => {
      if(retryCount > 10) return;

      if (!isMounted || !isAvailable) {
        await miniApp.mount().catch(console.warn);
      }

      try {
        setMiniAppBackgroundColor(backgroundColor as `#${string}`);
        setMiniAppHeaderColor(backgroundColor as `#${string}`);
      } catch {
        setTimeout(() => setBg(retryCount+1), 200);
      }
    });

    void setBg(0);
  }, [isMounted, isAvailable, backgroundColor]);

  useEffect(() => {
    const updateColor = () => {
      const newColor = getComputedHSL("--background");
      if (newColor !== backgroundColor) {
        setBackgroundColor(newColor);
      }
    };

    const observer = new MutationObserver(updateColor);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Initial color update
    updateColor();

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [backgroundColor]);

  return null;
}
