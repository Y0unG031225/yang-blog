import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getCategories, posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章分类", description: "按主题浏览 Yang's Blog 的文章。" };

export default function CategoriesPage() {
  const categories = getCategories();
  const summaries = posts.map(({ content, ...post }) => post);
  return <PageShell><main className="collection-shell">
    <header className="collection-hero"><div><span className="eyebrow">CATEGORIES</span><h1>文章分类</h1><p>从主题出发，快速找到同一方向的学习与记录。</p></div><strong>{categories.length}<small>个分类</small></strong></header>
    <Suspense><CollectionBrowser mode="categories" posts={summaries} categories={categories} tags={[]}/></Suspense>
  </main></PageShell>;
}
