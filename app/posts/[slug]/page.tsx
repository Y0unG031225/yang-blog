import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReadingTools } from "../../ArticleReadingTools";
import { MarkdownContent, getMarkdownHeadings } from "../../MarkdownContent";
import { PostEngagement } from "../../PostEngagement";
import { PageShell } from "../../components";
import { getPost, posts } from "../../lib/posts";

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章" };
  const image = `/og/posts/${post.slug}.png`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, tags: post.tags, images: [{ url: image, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  };
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
    <Link className="back-link" href="/archives">← 返回文章归档</Link>
    <header className="article-header">
      <div className="meta"><span>{post.category}</span><time dateTime={post.date}>{post.date}</time><span>{post.read}</span></div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div className="tag-row">{post.tags.map(tag => <Link key={tag} href={`/tags?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
    </header>
    <PostEngagement slug={post.slug} title={post.title} description={post.description}/>
    <div className={`article-layout ${headings.length ? "" : "without-toc"}`}>
      <ArticleReadingTools headings={headings}/>
      <article className="prose"><MarkdownContent markdown={post.content}/></article>
    </div>
    <nav className="article-nav">
      {newerPost ? <Link className="article-nav-card previous" href={`/posts/${newerPost.slug}`}><small>上一篇 · 较新</small><strong><span>←</span>{newerPost.title}</strong></Link> : <Link className="article-nav-card archive" href="/archives"><small>已经是最新一篇</small><strong><span>←</span>返回文章归档</strong></Link>}
      {olderPost ? <Link className="article-nav-card next" href={`/posts/${olderPost.slug}`}><small>下一篇 · 较早</small><strong>{olderPost.title}<span>→</span></strong></Link> : <Link className="article-nav-card archive next" href="/archives"><small>已经读到最后</small><strong>查看文章归档<span>→</span></strong></Link>}
    </nav>
  </main></PageShell>;
}
