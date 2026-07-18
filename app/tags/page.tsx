import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getTags, posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章标签", description: "通过标签探索 Yang's Blog 的文章。" };

export default function TagsPage() {
  const tags = getTags();
  const summaries = posts.map(({ content, ...post }) => post);
  return <PageShell><main className="collection-shell">
    <header className="collection-hero"><div><span className="eyebrow">TAGS</span><h1>文章标签</h1><p>用更细的关键词连接散落在不同主题中的想法。</p></div><strong>{tags.length}<small>个标签</small></strong></header>
    <Suspense><CollectionBrowser mode="tags" posts={summaries} categories={[]} tags={tags}/></Suspense>
  </main></PageShell>;
}
