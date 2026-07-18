import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteConfig } from "./site.config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: { default: siteConfig.siteName, template: `%s · ${siteConfig.siteName}` },
    description: siteConfig.description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: siteConfig.siteName, description: siteConfig.shortDescription, type: "website", images: [{ url: new URL("/og-blog.png", base).toString(), width: 1200, height: 630, alt: siteConfig.siteName }] },
    twitter: { card: "summary_large_image", title: siteConfig.siteName, description: siteConfig.shortDescription, images: [new URL("/og-blog.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={siteConfig.language}><body>{children}</body></html>;
}
