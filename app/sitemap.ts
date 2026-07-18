import type { MetadataRoute } from "next";
import { projects } from "./data";
import { posts } from "./lib/posts";
import { siteConfig } from "./site.config";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl; const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; return ["", "/archives", "/categories", "/tags", "/projects", "/resources", "/about"].map(path => ({ url: base + prefix + path, lastModified: new Date() })).concat(posts.map(p => ({ url: `${base}${prefix}/posts/${p.slug}`, lastModified: new Date(p.date) })), projects.map(p => ({ url: `${base}${prefix}/projects/${p.slug}`, lastModified: new Date() }))); }
