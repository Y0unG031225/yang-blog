import type { Metadata, Viewport } from "next";
import { AppBootstrap } from "./AppBootstrap";
import { siteConfig } from "./site.config";
import "katex/dist/katex.min.css";
import "./globals.css";

const themeScript = `(function(){try{var saved=localStorage.getItem('yang-blog-theme');var theme=saved==='light'||saved==='dark'?saved:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export const viewport: Viewport = { themeColor: "#14283a" };

export function generateMetadata(): Metadata {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl);
  const asset = (pathname: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${pathname}`;
  return {
    metadataBase: base,
    title: { default: siteConfig.siteName, template: `%s · ${siteConfig.siteName}` },
    description: siteConfig.description,
    manifest: asset("/manifest.webmanifest"),
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Yang's Blog" },
    icons: { icon: [{ url: asset("/favicon.svg"), type: "image/svg+xml" }, { url: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" }], shortcut: asset("/favicon.svg"), apple: asset("/icons/apple-touch-icon.png") },
    openGraph: { title: siteConfig.siteName, description: siteConfig.shortDescription, type: "website", images: [{ url: new URL(asset("/og-blog.png"), base).toString(), width: 1200, height: 630, alt: siteConfig.siteName }] },
    twitter: { card: "summary_large_image", title: siteConfig.siteName, description: siteConfig.shortDescription, images: [new URL(asset("/og-blog.png"), base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={siteConfig.language} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><AppBootstrap/>{children}</body></html>;
}
