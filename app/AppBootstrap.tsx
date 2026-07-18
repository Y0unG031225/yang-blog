"use client";

import { useEffect } from "react";

export function AppBootstrap() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sw.js`).catch(() => undefined);
  }, []);
  return null;
}
