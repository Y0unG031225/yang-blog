import type { MetadataRoute } from "next";
import { posts, projects } from "./data";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://example.com"; return ["", "/posts", "/projects", "/resources", "/about"].map(path => ({ url: base + path, lastModified: new Date() })).concat(posts.map(p => ({ url: `${base}/posts/${p.slug}`, lastModified: new Date(p.date) })), projects.map(p => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date() }))); }
