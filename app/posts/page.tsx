import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PostCard } from "../components";
import { getCategories, getTags, posts } from "../lib/posts";

export const metadata: Metadata = { title: "文章", description: "学习、研究、日常与游戏记录。" };

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const query = await searchParams;
  const filtered = posts.filter(p => (!query.category || p.categoryKey === query.category) && (!query.tag || p.tags.includes(query.tag)));
  const categories = getCategories();
  const tags = getTags();
  return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">NOTES & STORIES</span><h1>文章与记录</h1><p>把正在学习的、认真思考的、偶然感受到的，都放进时间里。</p></header>
    <div id="categories" className="filter-bar" aria-label="文章分类"><Link className={!query.category ? "active" : ""} href="/posts">全部</Link>{categories.map(([key, label]) => <Link className={query.category === key ? "active" : ""} key={key} href={`/posts?category=${key}`}>{label}</Link>)}</div>
    <div id="tags" className="tag-cloud" aria-label="文章标签">{tags.map(tag => <Link className={query.tag === tag ? "active" : ""} key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
    {query.tag && <p className="filter-result">标签：#{query.tag} <Link href="/posts">清除筛选</Link></p>}
    <div className="post-grid archive-grid">{filtered.length ? filtered.map(post => <PostCard key={post.slug} post={post}/>) : <p className="empty-posts">暂时没有符合条件的文章。</p>}</div>
  </main></PageShell>;
}
