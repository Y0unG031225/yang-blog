"use client";

import { useState } from "react";
import { useMounted } from "./useMounted";

export function PostShareActions({ title, description }: { title: string; description: string }) {
  const [copied, setCopied] = useState(false);
  const mounted = useMounted();
  const canShare = mounted && typeof navigator.share === "function";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function shareUrl(service: "weibo" | "x") {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} · Yang's Blog`);
    const target = service === "weibo"
      ? `https://service.weibo.com/share/share.php?url=${url}&title=${text}`
      : `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(target, "_blank", "noopener,noreferrer,width=760,height=560");
  }

  return <section className="post-engagement share-only" aria-label="文章分享">
    <span className="share-label">分享这篇文章</span>
    <div className="share-actions">
      <button type="button" onClick={copyLink}>{copied ? "已复制" : "复制链接"}</button>
      <button type="button" onClick={() => shareUrl("weibo")}>微博</button>
      <button type="button" onClick={() => shareUrl("x")}>X</button>
      {canShare && <button type="button" onClick={() => navigator.share({ title, text: description, url: window.location.href }).catch(() => undefined)}>更多分享</button>}
    </div>
  </section>;
}
