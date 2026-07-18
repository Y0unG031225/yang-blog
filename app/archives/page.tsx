import type { Metadata } from "next";
import { CollectionPostRow } from "../CollectionPostRow";
import { PopularPosts } from "../PopularPosts";
import { PageShell } from "../components";
import { posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章归档", description: "按时间浏览 Yang's Blog 的全部文章。" };

export default function ArchivesPage() {
  const years = Array.from(new Set(posts.map(post => post.date.slice(0, 4))));
  return <PageShell><main className="collection-shell">
    <header className="collection-hero"><div><span className="eyebrow">ARCHIVES</span><h1>文章归档</h1><p>沿着时间整理所有思考、学习笔记和生活记录。</p></div><strong>{posts.length}<small>篇文章</small></strong></header>
    <PopularPosts/>
    <div className="archive-timeline">{years.map(year => {
      const yearPosts = posts.filter(post => post.date.startsWith(year));
      return <section className="archive-year" key={year}><header><h2>{year}</h2><span>{yearPosts.length} 篇</span></header><div>{yearPosts.map(post => <CollectionPostRow key={post.slug} post={post}/>)}</div></section>;
    })}</div>
  </main></PageShell>;
}
