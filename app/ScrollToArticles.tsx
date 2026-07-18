"use client";

export function ScrollToArticles() {
  return <button className="scroll-cue" type="button" aria-label="滚动到文章列表" onClick={() => document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" })}><span /></button>;
}
