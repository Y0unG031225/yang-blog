import type { MetadataRoute } from "next";
import { projects } from "./data";
import { posts } from "./lib/posts";
import { siteConfig } from "./site.config";
import { absoluteUrl } from "./lib/urls";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const latestPostDate = posts[0]?.date ?? siteConfig.launchedAt;
  const corePages = ["/", "/archives", "/categories", "/tags"];
  const staticPages = ["/projects", "/resources", "/about"];
  return corePages.map(path => ({ url: absoluteUrl(path), lastModified: new Date(latestPostDate) }))
    .concat(staticPages.map(path => ({ url: absoluteUrl(path), lastModified: new Date(siteConfig.launchedAt) })))
    .concat(posts.map(post => ({ url: absoluteUrl(`/posts/${post.slug}`), lastModified: new Date(post.date) })))
    .concat(projects.map(project => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: new Date(project.updated) })));
}
