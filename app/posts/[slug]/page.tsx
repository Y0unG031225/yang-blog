import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent, getMarkdownHeadings } from "../../MarkdownContent";
import { PageShell } from "../../components";
import { getPost, posts } from "../../lib/posts";

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "文章", description: post?.description };
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = getMarkdownHeadings(post.content);
  const postIndex = posts.findIndex(item => item.slug === post.slug);
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const olderPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  return <PageShell><main className="article-shell">
    <Link className="back-link" href="/posts">← 返回文章列表</Link>
    <header className="article-header">
      <div className="meta"><span>{post.category}</span><time dateTime={post.date}>{post.date}</time><span>{post.read}</span></div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div className="tag-row">{post.tags.map(tag => <Link key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
    </header>
    <div className={`article-layout ${headings.length ? "" : "without-toc"}`}>
      {headings.length > 0 && <aside className="toc"><span className="eyebrow">本页目录</span>{headings.map(heading => <a className={heading.level === 3 ? "toc-sub" : ""} key={heading.id} href={`#${heading.id}`}>{heading.text}</a>)}</aside>}
      <article className="prose"><MarkdownContent markdown={post.content}/></article>
    </div>
    <nav className="article-nav">
      {newerPost ? <Link href={`/posts/${newerPost.slug}`}>← 较新：{newerPost.title}</Link> : <span/>}
      {olderPost ? <Link href={`/posts/${olderPost.slug}`}>较早：{olderPost.title} →</Link> : <Link href="/posts">全部文章 →</Link>}
    </nav>
  </main></PageShell>;
}
