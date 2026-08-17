import type { Metadata, Viewport } from "next";
import { AppBootstrap } from "./AppBootstrap";
import { absoluteUrl, publicPath, siteRoot } from "./lib/urls";
import { siteConfig } from "./site.config";
import "highlight.js/styles/github-dark-dimmed.css";
import "katex/dist/katex.min.css";
import "./globals.css";

const themeScript = `(function(){try{var saved=localStorage.getItem('yang-blog-theme');document.documentElement.dataset.theme=saved==='dark'?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

export const viewport: Viewport = { themeColor: "#14283a" };

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteRoot()),
    title: {
      default: siteConfig.siteName,
      template: `%s · ${siteConfig.siteName}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: siteRoot(),
      types: { "application/rss+xml": absoluteUrl("/rss.xml") },
    },
    manifest: publicPath("/manifest.webmanifest"),
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Yang's Blog",
    },
    icons: {
      icon: [
        { url: publicPath("/favicon.svg"), type: "image/svg+xml" },
        {
          url: publicPath("/icons/icon-192.png"),
          sizes: "192x192",
          type: "image/png",
        },
      ],
      shortcut: publicPath("/favicon.svg"),
      apple: publicPath("/icons/apple-touch-icon.png"),
    },
    openGraph: {
      url: siteRoot(),
      siteName: siteConfig.siteName,
      locale: "zh_CN",
      title: siteConfig.siteName,
      description: siteConfig.shortDescription,
      type: "website",
      images: [
        {
          url: absoluteUrl("/og.jpg"),
          width: 1200,
          height: 630,
          alt: siteConfig.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.siteName,
      description: siteConfig.shortDescription,
      images: [absoluteUrl("/og.jpg")],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteRoot()}#website`,
        url: siteRoot(),
        name: siteConfig.siteName,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
      },
      {
        "@type": "Person",
        "@id": `${siteRoot()}#person`,
        name: siteConfig.ownerName,
        url: siteRoot(),
        sameAs: [siteConfig.contact.github].filter(Boolean),
      },
    ],
  };
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <AppBootstrap />
        {children}
      </body>
    </html>
  );
}
