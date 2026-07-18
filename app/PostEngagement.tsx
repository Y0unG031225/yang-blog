"use client";

import { useEffect, useState } from "react";

export function PostEngagement({ slug, title, description }: { slug: string; title: string; description: string }) {
  const [views, setViews] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
    const key = `yang-blog-viewed:${slug}`;
    let method = "POST";
    try { method = sessionStorage.getItem(key) ? "GET" : "POST"; } catch { method = "POST"; }
    fetch(`/api/views/${encodeURIComponent(slug)}`, { method })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => {
        setViews(Number(data.views) || 0);
        if (method === "POST") { try { sessionStorage.setItem(key, "1"); } catch {} }
      })
      .catch(() => setViews(null));
  }, [slug]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function shareUrl(service: "weibo" | "x") {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} · Yang's Blog`);
    const target = service === "weibo" ? `https://service.weibo.com/share/share.php?url=${url}&title=${text}` : `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(target, "_blank", "noopener,noreferrer,width=760,height=560");
  }

  return <section className="post-engagement" aria-label="文章分享与统计">
    <div className="post-view-count"><span aria-hidden="true">◉</span><strong>{views === null ? "—" : views.toLocaleString("zh-CN")}</strong><small>次阅读</small></div>
    <div className="share-actions">
      <button type="button" onClick={copyLink}>{copied ? "已复制" : "复制链接"}</button>
      <button type="button" onClick={() => shareUrl("weibo")}>微博</button>
      <button type="button" onClick={() => shareUrl("x")}>X</button>
      {canShare && <button type="button" onClick={() => navigator.share({ title, text: description, url: window.location.href }).catch(() => undefined)}>更多分享</button>}
    </div>
  </section>;
}
