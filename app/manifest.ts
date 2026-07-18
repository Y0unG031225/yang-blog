import type { MetadataRoute } from "next";
import { siteConfig } from "./site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: "Yang's Blog",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#121823",
    theme_color: "#14283a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
