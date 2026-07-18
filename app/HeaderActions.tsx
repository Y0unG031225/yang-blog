"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SearchPost = { slug: string; title: string; description: string; category: string; tags: string[] };
type Theme = "dark" | "light";

function ActionIcon({ name }: { name: "search" | "moon" | "sun" }) {
  return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true">{
    name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></> :
    name === "sun" ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></> :
    <path d="M20.5 15.3A9 9 0 0 1 8.7 3.5 9 9 0 1 0 20.5 15.3Z"/>
  }</svg>;
}

export function HeaderActions({ posts }: { posts: SearchPost[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    const updateHeader = () => {
      const hero = document.querySelector<HTMLElement>(".blog-hero");
      header.classList.toggle("is-solid", !hero || hero.getBoundingClientRect().bottom <= header.offsetHeight);
    };
    const frame = requestAnimationFrame(updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", updateHeader); window.removeEventListener("resize", updateHeader); };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    if (!keyword) return posts.slice(0, 6);
    return posts.filter(post => [post.title, post.description, post.category, ...post.tags].join(" ").toLocaleLowerCase("zh-CN").includes(keyword)).slice(0, 12);
  }, [posts, query]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("yang-blog-theme", next);
    setTheme(next);
  }

  const modal = mounted && open ? createPortal(
    <div className="search-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <header className="search-dialog-head"><div><span className="eyebrow">SEARCH</span><h2 id="search-title">搜索文章</h2></div><button type="button" className="search-close" aria-label="关闭搜索" onClick={() => setOpen(false)}>×</button></header>
        <label className="search-field"><ActionIcon name="search"/><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="输入标题、分类或标签…" aria-label="搜索关键词"/></label>
        <div className="search-results" aria-live="polite">
          {results.length ? results.map(post => <Link key={post.slug} className="search-result" href={`/posts/${post.slug}`} onClick={() => setOpen(false)}><span>{post.category}</span><strong>{post.title}</strong><p>{post.description}</p><small>{post.tags.map(tag => `#${tag}`).join(" ")}</small></Link>) : <p className="search-empty">没有找到相关文章，换个关键词试试。</p>}
        </div>
      </section>
    </div>, document.body) : null;

  return <div className="header-actions">
    <button type="button" className="header-action" aria-label="搜索文章" title="搜索" onClick={() => setOpen(true)}><ActionIcon name="search"/></button>
    <button type="button" className="header-action" aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"} title={theme === "dark" ? "浅色模式" : "深色模式"} onClick={toggleTheme}><ActionIcon name={theme === "dark" ? "moon" : "sun"}/></button>
    {modal}
  </div>;
}
