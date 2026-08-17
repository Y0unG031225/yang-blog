"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    reset();
    const firstFrame = requestAnimationFrame(() => {
      reset();
      requestAnimationFrame(reset);
    });
    const timeout = window.setTimeout(reset, 120);
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
