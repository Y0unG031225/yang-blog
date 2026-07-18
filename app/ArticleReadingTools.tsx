"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MarkdownHeading } from "./MarkdownContent";

type PreviewImage = { src: string; alt: string } | null;

export function ArticleReadingTools({ headings }: { headings: MarkdownHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [preview, setPreview] = useState<PreviewImage>(null);
  const [mounted, setMounted] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const article = document.querySelector<HTMLElement>(".prose");
    const shell = document.querySelector<HTMLElement>(".article-shell");
    if (!article || !shell) return;

    const update = () => {
      frame.current = null;
      const start = shell.getBoundingClientRect().top + window.scrollY;
      const end = shell.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const ratio = end <= start ? 1 : (window.scrollY - start) / (end - start);
      setProgress(Math.max(0, Math.min(1, ratio)));
      setShowTop(window.scrollY > Math.max(520, start + 180));

      const headingElements = headings
        .map(heading => document.getElementById(heading.id))
        .filter((element): element is HTMLElement => Boolean(element));
      if (headingElements.length) {
        const marker = Math.min(190, window.innerHeight * .25);
        const current = [...headingElements].reverse().find(element => element.getBoundingClientRect().top <= marker) ?? headingElements[0];
        setActiveId(current.id);
      }
    };
    const scheduleUpdate = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const copyButtons: HTMLButtonElement[] = [];
    article.querySelectorAll<HTMLPreElement>("pre").forEach(pre => {
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
        window.setTimeout(() => { button.textContent = "复制代码"; }, 1600);
      });
      pre.appendChild(button);
      copyButtons.push(button);
    });

    const openImage = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      setPreview({ src: target.currentSrc || target.src, alt: target.alt });
    };
    article.addEventListener("click", openImage);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      article.removeEventListener("click", openImage);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      copyButtons.forEach(button => button.remove());
    };
  }, [headings]);

  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [preview]);

  function goToHeading(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
    setActiveId(id);
  }

  const lightbox = mounted && preview ? createPortal(
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="文章图片预览" onMouseDown={event => { if (event.target === event.currentTarget) setPreview(null); }}>
      <button type="button" className="image-lightbox-close" aria-label="关闭图片预览" onClick={() => setPreview(null)}>×</button>
      <figure><img src={preview.src} alt={preview.alt}/>{preview.alt && <figcaption>{preview.alt}</figcaption>}</figure>
    </div>, document.body) : null;

  return <>
    <div className="reading-progress" aria-label="文章阅读进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} role="progressbar"><span style={{ transform: `scaleX(${progress})` }}/></div>
    {headings.length > 0 && <aside className="toc"><span className="eyebrow">本页目录</span>{headings.map(heading => <button type="button" className={`${heading.level === 3 ? "toc-sub " : ""}${activeId === heading.id ? "active" : ""}`} key={heading.id} onClick={() => goToHeading(heading.id)}>{heading.text}</button>)}</aside>}
    <button type="button" className={`back-to-top ${showTop ? "visible" : ""}`} aria-label="返回页面顶部" title="返回顶部" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span>↑</span><small>TOP</small></button>
    {lightbox}
  </>;
}
