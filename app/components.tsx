import Link from "next/link";
import { profile } from "./data";

export function SiteHeader() {
  const links = [["/", "首页"], ["/posts", "文章"], ["/projects", "项目"], ["/resources", "资源"], ["/about", "关于我"]];
  return <header className="site-header"><div className="shell nav-wrap">
    <Link className="brand" href="/"><span className="brand-mark">拾</span><span>成长手记<small>GROWTH NOTES</small></span></Link>
    <nav className="desktop-nav" aria-label="主导航">{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
    <details className="mobile-nav"><summary aria-label="打开导航">菜单</summary><nav>{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav></details>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-grid"><div><span className="eyebrow">KEEP GROWING</span><h2>慢慢记录，持续生长。</h2></div><div className="footer-links"><Link href="/posts">文章归档</Link><Link href="/about">关于与联系</Link><span>© 2026 {profile.name}</span></div></div></footer>;
}

export function PageShell({ children }: { children: React.ReactNode }) { return <><SiteHeader />{children}<SiteFooter /></>; }

export function SectionHeading({ eyebrow, title, link, linkText = "查看全部" }: { eyebrow: string; title: string; link?: string; linkText?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{link && <Link className="text-link" href={link}>{linkText} <span>↗</span></Link>}</div>;
}

export function PostCard({ post }: { post: { slug: string; title: string; description: string; date: string; category: string; tags: string[]; tone: string; read: string } }) {
  return <article className={`post-card tone-${post.tone}`}><div className="card-art" aria-hidden="true"><span>{post.category.slice(0, 1)}</span></div><div className="card-body"><div className="meta"><span>{post.category}</span><time>{post.date}</time><span>{post.read}</span></div><h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><div className="tag-row">{post.tags.map(tag => <span key={tag}>#{tag}</span>)}</div></div></article>;
}
