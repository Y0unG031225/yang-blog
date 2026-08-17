import { posts } from "../lib/posts";
import { absoluteUrl, siteRoot } from "../lib/urls";
import { siteConfig } from "../site.config";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] ?? character);
}

export function GET() {
  const items = posts.map(post => `<item><title>${escapeXml(post.title)}</title><link>${absoluteUrl(`/posts/${post.slug}/`)}</link><guid>${absoluteUrl(`/posts/${post.slug}/`)}</guid><pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate><description>${escapeXml(post.description)}</description>${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join("")}</item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.siteName)}</title><link>${siteRoot()}</link><description>${escapeXml(siteConfig.description)}</description><language>${siteConfig.language}</language><lastBuildDate>${new Date(`${posts[0]?.date ?? siteConfig.launchedAt}T00:00:00+08:00`).toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
