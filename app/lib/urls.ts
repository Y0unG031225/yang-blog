import { siteConfig } from "../site.config";

function normalizePath(pathname: string) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function publicPath(pathname: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${normalizePath(pathname)}`;
}

export function absoluteUrl(pathname = "/") {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl).replace(/\/$/, "");
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? siteConfig.basePath;
  return `${origin}${basePath}${normalizePath(pathname)}`;
}

export function siteRoot() {
  return absoluteUrl("/");
}
