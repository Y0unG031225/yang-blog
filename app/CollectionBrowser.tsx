"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CollectionPostRow } from "./CollectionPostRow";
import type { BlogPost } from "./lib/posts";

type SummaryPost = Omit<BlogPost, "content">;

export function CollectionBrowser({ mode, posts, categories, tags }: {
  mode: "categories" | "tags";
  posts: SummaryPost[];
  categories: [string, string][];
  tags: string[];
}) {
  const query = useSearchParams();
  const category = query.get("category") ?? "";
  const tag = query.get("tag") ?? "";
  const selectedCategory = categories.find(([key]) => key === category);
  const selectedTag = tags.includes(tag) ? tag : "";
  const filtered = mode === "categories"
    ? (selectedCategory ? posts.filter(post => post.categoryKey === selectedCategory[0]) : posts)
    : (selectedTag ? posts.filter(post => post.tags.includes(selectedTag)) : posts);

  return <>
    {mode === "categories" ? <nav className="taxonomy-grid" aria-label="文章分类">{categories.map(([key, label]) => {
      const count = posts.filter(post => post.categoryKey === key).length;
      return <Link className={selectedCategory?.[0] === key ? "active" : ""} key={key} href={`/categories?category=${key}`}><span>{label.slice(0, 1)}</span><div><strong>{label}</strong><small>{count} 篇文章</small></div><b>→</b></Link>;
    })}</nav> : <nav className="tag-index" aria-label="文章标签">{tags.map(item => {
      const count = posts.filter(post => post.tags.includes(item)).length;
      return <Link className={selectedTag === item ? "active" : ""} key={item} href={`/tags?tag=${encodeURIComponent(item)}`}><span>#</span>{item}<small>{count}</small></Link>;
    })}</nav>}
    <section className="collection-results"><header><div><span className="eyebrow">{selectedCategory || selectedTag ? "SELECTED" : "ALL POSTS"}</span><h2>{selectedCategory?.[1] ?? (selectedTag ? `#${selectedTag}` : mode === "categories" ? "全部分类" : "全部标签")}</h2></div>{(selectedCategory || selectedTag) && <Link href={mode === "categories" ? "/categories" : "/tags"}>查看全部</Link>}</header><div>{filtered.map(post => <CollectionPostRow compact key={post.slug} post={post}/>)}</div></section>
  </>;
}
