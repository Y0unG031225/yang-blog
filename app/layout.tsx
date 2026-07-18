import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: { default: "Yang's Blog", template: "%s · Yang's Blog" },
    description: "A personal technical blog about AI, deep learning, backend development and graduate research.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "Yang's Blog", description: "AI · Deep Learning · Backend", type: "website", images: [{ url: new URL("/og-blog.png", base).toString(), width: 1200, height: 630, alt: "Yang's Blog" }] },
    twitter: { card: "summary_large_image", title: "Yang's Blog", description: "AI · Deep Learning · Backend", images: [new URL("/og-blog.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
