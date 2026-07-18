"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PopularPost = { slug: string; title: string; category: string; views: number };

export function PopularPosts() {
  const [items, setItems] = useState<PopularPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/views/popular")
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setItems(Array.isArray(data.posts) ? data.posts : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);
  return <section className="popular-posts"><header><div><span className="eyebrow">POPULAR</span><h2>热门文章</h2></div><small>按阅读量排序</small></header>
    {items.length ? <ol>{items.map((post, index) => <li key={post.slug}><b>{String(index + 1).padStart(2, "0")}</b><div><Link href={`/posts/${post.slug}`}>{post.title}</Link><small>{post.category}</small></div><span>{post.views} 阅读</span></li>)}</ol> : <p>{loaded ? "阅读数据会从第一次访问开始积累。" : "正在读取文章热度…"}</p>}
  </section>;
}
