import Link from "next/link";

const navLinks = [
  ["/", "⌂", "Home"],
  ["/posts", "▣", "Archives"],
  ["/posts", "◆", "Categories"],
  ["/posts", "◇", "Tags"],
  ["/about", "♟", "About"],
];

export function SiteHeader() {
  return <header className="site-header"><div className="nav-wrap">
    <Link className="brand" href="/">Yang&apos;s Blog</Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(([href, icon, label]) => <Link key={label} href={href}><span aria-hidden="true">{icon}</span>{label}</Link>)}<span className="nav-icon" title="Search">⌕</span><span className="nav-icon" title="Dark theme">◒</span></nav>
    <details className="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav>{navLinks.map(([href, , label]) => <Link key={label} href={href}>{label}</Link>)}</nav></details>
  </div></header>;
}

export function SiteFooter() { return <footer className="site-footer"><p>© 2026 Yang&apos;s Blog · Built for learning, research and code.</p></footer>; }
export function PageShell({ children }: { children: React.ReactNode }) { return <><SiteHeader />{children}<SiteFooter /></>; }

export function SectionHeading({ eyebrow, title, link, linkText = "View all" }: { eyebrow: string; title: string; link?: string; linkText?: string }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{link && <Link className="text-link" href={link}>{linkText} →</Link>}</div>;
}

export function PostCard({ post }: { post: { slug: string; title: string; description: string; date: string; category: string; tags: string[]; tone: string; read: string } }) {
  return <article className="post-card"><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div className="post-meta"><span>▣ {post.date}</span><span>◆ {post.category}</span><span>◇ {post.tags.map(tag => `#${tag}`).join(" ")}</span><span>◷ {post.read}</span></div></article>;
}
