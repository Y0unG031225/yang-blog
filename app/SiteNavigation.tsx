"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "./useMounted";

type IconName = "home" | "archive" | "grid" | "tag" | "user";

const navLinks = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/archives", icon: "archive", label: "Archives" },
  { href: "/categories", icon: "grid", label: "Categories" },
  { href: "/tags", icon: "tag", label: "Tags" },
  { href: "/about", icon: "user", label: "About" },
] as const satisfies ReadonlyArray<{
  href: string;
  icon: IconName;
  label: string;
}>;

function NavIcon({ name }: { name: IconName }) {
  const paths = {
    home: (
      <>
        <path d="M3 10.8 12 3l9 7.8" />
        <path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7" />
      </>
    ),
    archive: (
      <>
        <path d="M3 6h18v15H3zM2 3h20v4H2z" />
        <path d="M9 11h6" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    tag: <path d="M20.6 13.6 12 22l-9-9V3h10zM8 8h.01" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </>
    ),
  };
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/about") return pathname === "/about";
  if (href === "/categories") return pathname === "/categories";
  if (href === "/tags") return pathname === "/tags";
  if (href === "/archives")
    return pathname === "/archives" || pathname.startsWith("/posts");
  return false;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const panelRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus(),
    );
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [
        ...panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  const links = (mobile = false) =>
    navLinks.map(({ href, icon, label }) => {
      const active = isActive(pathname, href);
      return (
        <Link
          key={label}
          href={href}
          className={active ? "active" : undefined}
          aria-current={active ? "page" : undefined}
          onClick={mobile ? () => setOpen(false) : undefined}
        >
          <NavIcon name={icon} />
          <span>{label}</span>
        </Link>
      );
    });

  const drawer =
    mounted && open
      ? createPortal(
          <div
            className="mobile-nav-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <aside
              ref={panelRef}
              className="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="移动端导航菜单"
            >
              <div className="mobile-nav-head">
                <strong>Navigation</strong>
                <button
                  type="button"
                  className="mobile-nav-close"
                  aria-label="关闭导航菜单"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>
              <nav aria-label="移动端主导航">{links(true)}</nav>
              <p>探索 Yang&apos;s Blog</p>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <nav className="desktop-nav" aria-label="主导航">
        {links()}
      </nav>
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-button"
        aria-label="打开导航菜单"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>
      {drawer}
    </>
  );
}
