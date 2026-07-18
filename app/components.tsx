import Link from "next/link";
import { siteConfig } from "./site.config";

const navLinks = [
  ["/", "home", "Home"],
  ["/posts", "archive", "Archives"],
  ["/posts#categories", "grid", "Categories"],
  ["/posts#tags", "tag", "Tags"],
  ["/about", "user", "About"],
] as const;

function NavIcon({ name }: { name: "home" | "archive" | "grid" | "tag" | "user" | "search" | "moon" }) {
  const paths = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7"/></>,
    archive: <><path d="M3 6h18v15H3zM2 3h20v4H2z"/><path d="M9 11h6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    tag: <path d="M20.6 13.6 12 22l-9-9V3h10zM8 8h.01"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    moon: <path d="M20.5 15.3A9 9 0 0 1 8.7 3.5 9 9 0 1 0 20.5 15.3Z"/>,
  };
  return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function SiteHeader() {
  return <header className="site-header"><div className="nav-wrap">
    <Link className="brand" href="/">{siteConfig.siteName}</Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(([href, icon, label]) => <Link key={label} href={href}><NavIcon name={icon}/>{label}</Link>)}<span className="nav-icon" title="Search"><NavIcon name="search"/></span><span className="nav-icon" title="Dark theme"><NavIcon name="moon"/></span></nav>
    <details className="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav>{navLinks.map(([href, , label]) => <Link key={label} href={href}>{label}</Link>)}</nav></details>
  </div></header>;
}

export function SiteFooter() { return <footer className="site-footer"><p>© {new Date().getFullYear()} {siteConfig.siteName} · {siteConfig.footerText}</p></footer>; }
export function PageShell({ children }: { children: React.ReactNode }) { return <><SiteHeader />{children}<SiteFooter /></>; }

export function SectionHeading({ eyebrow, title, link, linkText = "View all" }: { eyebrow: string; title: string; link?: string; linkText?: string }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{link && <Link className="text-link" href={link}>{linkText} →</Link>}</div>;
}

export function PostCard({ post }: { post: { slug: string; title: string; description: string; date: string; category: string; tags: string[]; read: string } }) {
  return <article className="post-card"><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div className="post-meta"><span>▣ {post.date}</span><span>◆ {post.category}</span><span>◇ {post.tags.map(tag => `#${tag}`).join(" ")}</span><span>◷ {post.read}</span></div></article>;
}
