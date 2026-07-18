"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type IconName = "home" | "archive" | "grid" | "tag" | "user";

const navLinks = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/posts", icon: "archive", label: "Archives" },
  { href: "/posts#categories", icon: "grid", label: "Categories" },
  { href: "/posts#tags", icon: "tag", label: "Tags" },
  { href: "/about", icon: "user", label: "About" },
] as const satisfies ReadonlyArray<{ href: string; icon: IconName; label: string }>;

function NavIcon({ name }: { name: IconName }) {
  const paths = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7"/></>,
    archive: <><path d="M3 6h18v15H3zM2 3h20v4H2z"/><path d="M9 11h6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    tag: <path d="M20.6 13.6 12 22l-9-9V3h10zM8 8h.01"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/></>,
  };
  return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function isActive(pathname: string, hash: string, search: string, href: string) {
  const params = new URLSearchParams(search);
  if (href === "/") return pathname === "/";
  if (href === "/about") return pathname === "/about";
  if (href.endsWith("#categories")) return pathname === "/posts" && (hash === "#categories" || params.has("category"));
  if (href.endsWith("#tags")) return pathname === "/posts" && (hash === "#tags" || params.has("tag"));
  if (href === "/posts") return pathname.startsWith("/posts") && !["#categories", "#tags"].includes(hash) && !params.has("category") && !params.has("tag");
  return false;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setMounted(true);
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
    setOpen(false);
  }, [pathname, searchParams, hash]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const links = (mobile = false) => navLinks.map(({ href, icon, label }) => {
    const active = isActive(pathname, hash, searchParams.toString(), href);
    return <Link
      key={label}
      href={href}
      className={active ? "active" : undefined}
      aria-current={active ? "page" : undefined}
      onClick={mobile ? () => setOpen(false) : undefined}
    ><NavIcon name={icon}/><span>{label}</span></Link>;
  });

  const drawer = mounted && open ? createPortal(
    <div className="mobile-nav-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <aside className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="移动端导航菜单">
        <div className="mobile-nav-head"><strong>Navigation</strong><button type="button" className="mobile-nav-close" aria-label="关闭导航菜单" onClick={() => setOpen(false)}>×</button></div>
        <nav aria-label="移动端主导航">{links(true)}</nav>
        <p>Explore Yang&apos;s Blog</p>
      </aside>
    </div>, document.body) : null;

  return <>
    <nav className="desktop-nav" aria-label="Main navigation">{links()}</nav>
    <button type="button" className="mobile-menu-button" aria-label="打开导航菜单" aria-expanded={open} onClick={() => setOpen(true)}>
      <span/><span/><span/>
    </button>
    {drawer}
  </>;
}
