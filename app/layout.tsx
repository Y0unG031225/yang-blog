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
    title: { default: "成长手记", template: "%s · 成长手记" },
    description: "记录学习、研究、项目和日常生活的个人成长网站。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "成长手记", description: "在探索中，成为自己。", type: "website", images: [{ url: new URL("/og.png", base).toString(), width: 1200, height: 630, alt: "成长手记" }] },
    twitter: { card: "summary_large_image", title: "成长手记", description: "在探索中，成为自己。", images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
