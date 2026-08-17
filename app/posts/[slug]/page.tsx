import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReadingTools } from "../../ArticleReadingTools";
import { MarkdownContent, getMarkdownHeadings } from "../../MarkdownContent";
import { PostShareActions } from "../../PostShareActions";
import { PageShell } from "../../components";
import { getPost, posts } from "../../lib/posts";
import { absoluteUrl } from "../../lib/urls";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章" };
  const image = post.socialImage ? absoluteUrl(post.socialImage) : undefined;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absoluteUrl(`/posts/${post.slug}/`) },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/posts/${post.slug}/`),
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: image ? [image] : [],
    },
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = getMarkdownHeadings(post.content);
  const postIndex = posts.findIndex((item) => item.slug === post.slug);
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const olderPost =
    postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "zh-CN",
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}/`),
    author: { "@type": "Person", name: "Yang" },
    ...(post.socialImage ? { image: absoluteUrl(post.socialImage) } : {}),
  };

  return (
    <PageShell>
      <main className="article-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Link className="back-link" href="/archives">
          ← 返回文章归档
        </Link>
        <header className="article-header">
          <div className="meta">
            <span>{post.category}</span>
            <time dateTime={post.date}>{post.date}</time>
            <span>{post.read}</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <div className="tag-row">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags?tag=${encodeURIComponent(tag)}`}>
                #{tag}
              </Link>
            ))}
          </div>
        </header>
        <PostShareActions title={post.title} description={post.description} />
        <div
          className={`article-reading-layout${headings.length ? "" : " no-toc"}`}
        >
          <ArticleReadingTools headings={headings} />
          <div className="article-layout">
            <article className="prose">
              <MarkdownContent markdown={post.content} />
            </article>
          </div>
        </div>
        <nav className="article-nav">
          {newerPost ? (
            <Link
              className="article-nav-card previous"
              href={`/posts/${newerPost.slug}`}
            >
              <small>上一篇 · 较新</small>
              <strong>
                <span>←</span>
                {newerPost.title}
              </strong>
            </Link>
          ) : (
            <Link className="article-nav-card archive" href="/archives">
              <small>已经是最新一篇</small>
              <strong>
                <span>←</span>返回文章归档
              </strong>
            </Link>
          )}
          {olderPost ? (
            <Link
              className="article-nav-card next"
              href={`/posts/${olderPost.slug}`}
            >
              <small>下一篇 · 较早</small>
              <strong>
                {olderPost.title}
                <span>→</span>
              </strong>
            </Link>
          ) : (
            <Link className="article-nav-card archive next" href="/archives">
              <small>已经读到最后</small>
              <strong>
                查看文章归档<span>→</span>
              </strong>
            </Link>
          )}
        </nav>
      </main>
    </PageShell>
  );
}
