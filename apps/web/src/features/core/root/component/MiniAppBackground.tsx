import { miniApp, setMiniAppBackgroundColor, setMiniAppHeaderColor } from "@telegram-apps/sdk-react";
import { getComputedHSL } from "@web/shared/color";
import { useEffect, useState } from "react";

export function MiniAppBackground() {
  const isAvailable = setMiniAppBackgroundColor.isAvailable();
  const isMounted = miniApp.isMounted();
  const [backgroundColor, setBackgroundColor] = useState<string | null>(
    getComputedHSL("--background")
  );

  useEffect(() => {
    if (isMounted && isAvailable) {
      setMiniAppBackgroundColor(backgroundColor as `#${string}`);
      setMiniAppHeaderColor(backgroundColor as `#${string}`);
    }
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
