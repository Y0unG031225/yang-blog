import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReadingTools } from "../../ArticleReadingTools";
import { MarkdownContent, getMarkdownHeadings } from "../../MarkdownContent";
import { PostShareActions } from "../../PostShareActions";
import { TypingTitle } from "../../TypingTitle";
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
      <header
        className="post-hero"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fluid-default.jpg')`,
        }}
      >
        <div className="post-hero-overlay" />
        <div className="post-hero-content">
          <Link className="post-back-link" href="/archives" scroll={false}>
            ← Archives
          </Link>
          <TypingTitle text={post.title} />
          <p>{post.description}</p>
          <div className="post-hero-meta">
            <time dateTime={post.date}>{post.date}</time>
            <span>{post.category}</span>
            <span>{post.read}</span>
          </div>
        </div>
      </header>
      <main className="article-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <div
          className={`article-reading-layout${headings.length ? "" : " no-toc"}`}
        >
          <div className="article-side-spacer" aria-hidden="true" />
          <div className="article-layout">
            <p className="post-updated">Last updated on {post.date}</p>
            <article className="prose">
              <MarkdownContent markdown={post.content} />
            </article>
            <div className="post-taxonomy">
              <Link href={`/categories?category=${post.categoryKey}`}>
                {post.category}
              </Link>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags?tag=${encodeURIComponent(tag)}`}>
                  #{tag}
                </Link>
              ))}
            </div>
            <aside className="license-box">
              <strong>{post.title}</strong>
              <span>
                © {new Date(post.date).getFullYear()} Yang · CC BY-NC-SA 4.0
              </span>
            </aside>
            <PostShareActions
              title={post.title}
              description={post.description}
            />
            <nav className="article-nav">
              {newerPost ? (
                <Link
                  className="article-nav-card previous"
                  href={`/posts/${newerPost.slug}`}
                  scroll={false}
                >
                  <small>Previous</small>
                  <strong>← {newerPost.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {olderPost ? (
                <Link
                  className="article-nav-card next"
                  href={`/posts/${olderPost.slug}`}
                  scroll={false}
                >
                  <small>Next</small>
                  <strong>{olderPost.title} →</strong>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
          <ArticleReadingTools headings={headings} />
        </div>
      </main>
    </PageShell>
  );
}
