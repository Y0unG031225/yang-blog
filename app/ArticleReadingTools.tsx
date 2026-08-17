"use client";

/* The lightbox preserves the already-rendered article image source. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MarkdownHeading } from "./MarkdownContent";
import { useMounted } from "./useMounted";

type PreviewImage = { src: string; alt: string } | null;
type TocHeading = MarkdownHeading & { children: TocHeading[] };

function createHeadingTree(headings: MarkdownHeading[]) {
  const roots: TocHeading[] = [];
  const parents: Record<string, string | undefined> = {};
  const stack: TocHeading[] = [];

  headings.forEach((heading) => {
    const node: TocHeading = { ...heading, children: [] };
    while (stack.length && stack.at(-1)!.level >= node.level) stack.pop();
    const parent = stack.at(-1);
    if (parent) {
      parent.children.push(node);
      parents[node.id] = parent.id;
    } else {
      roots.push(node);
    }
    stack.push(node);
  });

  return { roots, parents };
}

export function ArticleReadingTools({
  headings,
}: {
  headings: MarkdownHeading[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [preview, setPreview] = useState<PreviewImage>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(
    () =>
      new Set(
        headings
          .filter(
            (heading, index) =>
              heading.id !== headings[0]?.id &&
              (headings[index + 1]?.level ?? 0) > heading.level,
          )
          .map((heading) => heading.id),
      ),
  );
  const mounted = useMounted();
  const headingTree = useMemo(() => createHeadingTree(headings), [headings]);
  const frame = useRef<number | null>(null);
  const activeIdRef = useRef(activeId);
  const tocRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".prose");
    const shell = document.querySelector<HTMLElement>(".article-shell");
    if (!article || !shell) return;

    const update = () => {
      frame.current = null;
      const start = shell.getBoundingClientRect().top + window.scrollY;
      const end =
        shell.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight;
      const ratio = end <= start ? 1 : (window.scrollY - start) / (end - start);
      setProgress(Math.max(0, Math.min(1, ratio)));
      setShowTop(window.scrollY > Math.max(520, start + 180));

      const headingElements = headings
        .map((heading) => document.getElementById(heading.id))
        .filter((element): element is HTMLElement => Boolean(element));
      if (headingElements.length) {
        const marker = Math.min(190, window.innerHeight * 0.25);
        const current =
          [...headingElements]
            .reverse()
            .find((element) => element.getBoundingClientRect().top <= marker) ??
          headingElements[0];
        if (activeIdRef.current !== current.id) {
          activeIdRef.current = current.id;
          setActiveId(current.id);
        }
      }
    };
    const scheduleUpdate = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const copyButtons: HTMLButtonElement[] = [];
    article.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code || pre.querySelector(".code-copy")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = "复制代码";
      button.setAttribute("aria-label", "复制代码块内容");
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          button.textContent = "已复制";
        } catch {
          button.textContent = "复制失败";
        }
        window.setTimeout(() => {
          button.textContent = "复制代码";
        }, 1600);
      });
      pre.appendChild(button);
      copyButtons.push(button);
    });

    const openImage = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (
        event instanceof KeyboardEvent &&
        event.key !== "Enter" &&
        event.key !== " "
      )
        return;
      if (event instanceof KeyboardEvent) event.preventDefault();
      previewTrigger.current = target;
      setPreview({ src: target.currentSrc || target.src, alt: target.alt });
    };
    const articleImages = [
      ...article.querySelectorAll<HTMLImageElement>("img"),
    ];
    articleImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute(
        "aria-label",
        image.alt ? `查看大图：${image.alt}` : "查看文章大图",
      );
    });
    article.addEventListener("click", openImage);
    article.addEventListener("keydown", openImage);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      article.removeEventListener("click", openImage);
      article.removeEventListener("keydown", openImage);
      articleImages.forEach((image) => {
        image.removeAttribute("tabindex");
        image.removeAttribute("role");
        image.removeAttribute("aria-label");
      });
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      copyButtons.forEach((button) => button.remove());
    };
  }, [headings]);

  useEffect(() => {
    const toc = tocRef.current;
    if (!toc || toc.scrollHeight <= toc.clientHeight) return;

    const activeButton = toc.querySelector<HTMLButtonElement>(
      `button[data-heading-id="${CSS.escape(activeId)}"]`,
    );
    if (!activeButton) return;

    const padding = 20;
    const visibleTop = toc.scrollTop + padding;
    const visibleBottom = toc.scrollTop + toc.clientHeight - padding;
    const buttonTop = activeButton.offsetTop;
    const buttonBottom = buttonTop + activeButton.offsetHeight;

    if (buttonTop < visibleTop) {
      toc.scrollTo({
        top: Math.max(0, buttonTop - padding),
        behavior: "smooth",
      });
    } else if (buttonBottom > visibleBottom) {
      toc.scrollTo({
        top: buttonBottom - toc.clientHeight + padding,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", close);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
      previewTrigger.current?.focus();
    };
  }, [preview]);

  function goToHeading(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#${id}`,
    );
    activeIdRef.current = id;
    setActiveId(id);
  }

  function toggleHeading(id: string) {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderHeadings(nodes: TocHeading[]) {
    return (
      <ul className="toc-list">
        {nodes.map((heading) => {
          const hasChildren = heading.children.length > 0;
          const collapsed = collapsedIds.has(heading.id);
          return (
            <li className={`toc-level-${heading.level}`} key={heading.id}>
              <div className="toc-row">
                {hasChildren ? (
                  <button
                    type="button"
                    className="toc-toggle"
                    aria-label={`${collapsed ? "展开" : "收起"}“${heading.text}”的子目录`}
                    aria-expanded={!collapsed}
                    onClick={() => toggleHeading(heading.id)}
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                ) : (
                  <span className="toc-toggle-spacer" aria-hidden="true" />
                )}
                <button
                  type="button"
                  data-heading-id={heading.id}
                  aria-current={
                    activeId === heading.id ? "location" : undefined
                  }
                  className={`toc-heading${activeId === heading.id ? " active" : ""}`}
                  onClick={() => goToHeading(heading.id)}
                >
                  {heading.text}
                </button>
              </div>
              {hasChildren && !collapsed && renderHeadings(heading.children)}
            </li>
          );
        })}
      </ul>
    );
  }

  const lightbox =
    mounted && preview
      ? createPortal(
          <div
            className="image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="文章图片预览"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPreview(null);
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="image-lightbox-close"
              aria-label="关闭图片预览"
              onClick={() => setPreview(null)}
            >
              ×
            </button>
            <figure>
              <img src={preview.src} alt={preview.alt} />
              {preview.alt && <figcaption>{preview.alt}</figcaption>}
            </figure>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="reading-progress"
        aria-label="文章阅读进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        role="progressbar"
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      {headings.length > 0 && (
        <aside ref={tocRef} className="toc" aria-label="文章目录">
          <span className="eyebrow">本页目录</span>
          {renderHeadings(headingTree.roots)}
        </aside>
      )}
      <button
        type="button"
        className={`back-to-top ${showTop ? "visible" : ""}`}
        aria-label="返回页面顶部"
        title="返回顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span>↑</span>
        <small>TOP</small>
      </button>
      {lightbox}
    </>
  );
}
