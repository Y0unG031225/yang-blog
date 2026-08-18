import type { MetadataRoute } from "next";
import { siteConfig } from "./site.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: siteConfig.siteName,
    short_name: "Yang's Blog",
    description: siteConfig.description,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#121823",
    theme_color: "#14283a",
    icons: [
      {
        src: `${basePath}/touxiang.png?v=2`,
        sizes: "690x690",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/touxiang.png?v=2`,
        sizes: "690x690",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
