import type { MetadataRoute } from "next";
import { projects } from "./data";
import { posts } from "./lib/posts";
import { siteConfig } from "./site.config";
export default function sitemap(): MetadataRoute.Sitemap { const base = siteConfig.siteUrl; return ["", "/posts", "/projects", "/resources", "/about"].map(path => ({ url: base + path, lastModified: new Date() })).concat(posts.map(p => ({ url: `${base}/posts/${p.slug}`, lastModified: new Date(p.date) })), projects.map(p => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date() }))); }
