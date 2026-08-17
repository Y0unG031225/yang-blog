import Link from "next/link";
import { HeaderActions } from "./HeaderActions";
import { SiteNavigation } from "./SiteNavigation";
import { posts } from "./lib/posts";
import { siteConfig } from "./site.config";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" href="/">
          {siteConfig.siteName}
        </Link>
        <div className="header-controls">
          <SiteNavigation />
          <HeaderActions
            posts={posts.map(
              ({ slug, title, description, category, tags }) => ({
                slug,
                title,
                description,
                category,
                tags,
              }),
            )}
          />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="Footer navigation">
        <Link href="/projects">Projects</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/rss.xml">RSS</Link>
      </nav>
      <p>
        © {new Date().getFullYear()} {siteConfig.siteName} ·{" "}
        {siteConfig.footerText}
      </p>
    </footer>
  );
}
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader />
      <div className="page-content" id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  link,
  linkText = "View all",
}: {
  eyebrow: string;
  title: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" href={link}>
          {linkText} →
        </Link>
      )}
    </div>
  );
}

export function PostCard({
  post,
}: {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    categoryKey: string;
    tags: string[];
    read: string;
  };
}) {
  return (
    <article className="post-card">
      <h2>
        <Link href={`/posts/${post.slug}`} scroll={false}>
          {post.title}
        </Link>
      </h2>
      <p>{post.description}</p>
      <div className="post-meta">
        <span>◷ {post.date}</span>
        <Link href={`/categories?category=${post.categoryKey}`}>
          ▣ {post.category}
        </Link>
        <span>{post.tags.map((tag) => `#${tag}`).join(" ")}</span>
        <span>{post.read}</span>
      </div>
    </article>
  );
}
