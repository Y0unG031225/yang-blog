import type { Metadata } from "next";
import Link from "next/link";
import { CollectionPostRow } from "../CollectionPostRow";
import { PageShell } from "../components";
import { getTags, posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章标签", description: "通过标签探索 Yang's Blog 的文章。" };

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const tags = getTags();
  const selected = tags.includes(tag ?? "") ? tag : undefined;
  const filtered = selected ? posts.filter(post => post.tags.includes(selected)) : posts;
  return <PageShell><main className="collection-shell">
    <header className="collection-hero"><div><span className="eyebrow">TAGS</span><h1>文章标签</h1><p>用更细的关键词连接散落在不同主题中的想法。</p></div><strong>{tags.length}<small>个标签</small></strong></header>
    <nav className="tag-index" aria-label="文章标签">{tags.map(item => {
      const count = posts.filter(post => post.tags.includes(item)).length;
      return <Link className={selected === item ? "active" : ""} key={item} href={`/tags?tag=${encodeURIComponent(item)}`}><span>#</span>{item}<small>{count}</small></Link>;
    })}</nav>
    <section className="collection-results"><header><div><span className="eyebrow">{selected ? "SELECTED TAG" : "ALL POSTS"}</span><h2>{selected ? `#${selected}` : "全部标签"}</h2></div>{selected && <Link href="/tags">查看全部</Link>}</header><div>{filtered.map(post => <CollectionPostRow compact key={post.slug} post={post}/>)}</div></section>
  </main></PageShell>;
}
