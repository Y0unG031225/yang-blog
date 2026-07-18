import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../components";
import { getCategories, getTags, posts } from "../lib/posts";
import { PostsBrowser } from "../PostsBrowser";

export const metadata: Metadata = { title: "文章", description: "学习、研究、日常与游戏记录。" };

export default function PostsPage() {
  const summaries = posts.map(({ content, ...post }) => post);
  return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">NOTES & STORIES</span><h1>文章与记录</h1><p>把正在学习的、认真思考的、偶然感受到的，都放进时间里。</p></header>
    <Suspense><PostsBrowser posts={summaries} categories={getCategories()} tags={getTags()}/></Suspense>
  </main></PageShell>;
}
