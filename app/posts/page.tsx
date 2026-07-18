import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PostCard } from "../components";
import { posts } from "../data";

export const metadata: Metadata = { title: "文章", description: "学习、研究、日常与游戏记录。" };

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const query = await searchParams;
  const filtered = posts.filter(p => (!query.category || p.categoryKey === query.category) && (!query.tag || p.tags.includes(query.tag)));
  const categories = [["", "全部"], ["study", "学习记录"], ["graduate", "研究生生活"], ["life", "日常记录"], ["games", "游戏记录"]];
  return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">NOTES & STORIES</span><h1>文章与记录</h1><p>把正在学习的、认真思考的、偶然感受到的，都放进时间里。</p></header>
    <div className="filter-bar" aria-label="文章分类">{categories.map(([key, label]) => <Link className={query.category === key || (!query.category && !key) ? "active" : ""} key={key} href={key ? `/posts?category=${key}` : "/posts"}>{label}</Link>)}</div>
    {query.tag && <p className="filter-result">标签：#{query.tag} <Link href="/posts">清除筛选</Link></p>}
    <div className="post-grid archive-grid">{filtered.map(post => <PostCard key={post.slug} post={post}/>)}</div>
  </main></PageShell>;
}
