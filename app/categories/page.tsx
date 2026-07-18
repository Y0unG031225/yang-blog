import type { Metadata } from "next";
import Link from "next/link";
import { CollectionPostRow } from "../CollectionPostRow";
import { PageShell } from "../components";
import { getCategories, posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章分类", description: "按主题浏览 Yang's Blog 的文章。" };

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = getCategories();
  const selected = categories.find(([key]) => key === category);
  const filtered = selected ? posts.filter(post => post.categoryKey === selected[0]) : posts;
  return <PageShell><main className="collection-shell">
    <header className="collection-hero"><div><span className="eyebrow">CATEGORIES</span><h1>文章分类</h1><p>从主题出发，快速找到同一方向的学习与记录。</p></div><strong>{categories.length}<small>个分类</small></strong></header>
    <nav className="taxonomy-grid" aria-label="文章分类">{categories.map(([key, label]) => {
      const categoryPosts = posts.filter(post => post.categoryKey === key);
      return <Link className={selected?.[0] === key ? "active" : ""} key={key} href={`/categories?category=${key}`}><span>{label.slice(0, 1)}</span><div><strong>{label}</strong><small>{categoryPosts.length} 篇文章</small></div><b>→</b></Link>;
    })}</nav>
    <section className="collection-results"><header><div><span className="eyebrow">{selected ? "SELECTED CATEGORY" : "ALL POSTS"}</span><h2>{selected?.[1] ?? "全部分类"}</h2></div>{selected && <Link href="/categories">查看全部</Link>}</header><div>{filtered.map(post => <CollectionPostRow compact key={post.slug} post={post}/>)}</div></section>
  </main></PageShell>;
}
