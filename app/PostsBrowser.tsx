"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "./lib/posts";

type SummaryPost = Omit<BlogPost, "content">;

function StaticPostCard({ post }: { post: SummaryPost }) {
  return <article className="post-card"><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div className="post-meta"><span>■ {post.date}</span><span>● {post.category}</span><span>● {post.tags.map(item => `#${item}`).join(" ")}</span><span>● {post.read}</span></div></article>;
}

export function PostsBrowser({ posts, categories, tags }: { posts: SummaryPost[]; categories: [string, string][]; tags: string[] }) {
  const query = useSearchParams();
  const category = query.get("category") ?? "";
  const tag = query.get("tag") ?? "";
  const filtered = posts.filter(post => (!category || post.categoryKey === category) && (!tag || post.tags.includes(tag)));
  return <>
    <div id="categories" className="filter-bar" aria-label="文章分类"><Link className={!category ? "active" : ""} href="/posts">全部</Link>{categories.map(([key, label]) => <Link className={category === key ? "active" : ""} key={key} href={`/posts?category=${key}`}>{label}</Link>)}</div>
    <div id="tags" className="tag-cloud" aria-label="文章标签">{tags.map(item => <Link className={tag === item ? "active" : ""} key={item} href={`/posts?tag=${encodeURIComponent(item)}`}>#{item}</Link>)}</div>
    {tag && <p className="filter-result">标签：{tag} <Link href="/posts">清除筛选</Link></p>}
    <div className="post-grid archive-grid">{filtered.length ? filtered.map(post => <StaticPostCard key={post.slug} post={post}/>) : <p className="empty-posts">暂时没有符合条件的文章。</p>}</div>
  </>;
}
