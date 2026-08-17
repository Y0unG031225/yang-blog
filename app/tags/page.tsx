import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getPostSummaries, getTags } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = { title: "文章标签", description: "通过标签探索 Yang's Blog 的文章。" };

export default function TagsPage() {
  const tags = getTags();
  const summaries = getPostSummaries();
  return <PageShell>
    <SubpageHero title="文章标签"/>
    <main className="collection-shell subpage-content">
      <Suspense><CollectionBrowser mode="tags" posts={summaries} categories={[]} tags={tags}/></Suspense>
    </main>
  </PageShell>;
}
