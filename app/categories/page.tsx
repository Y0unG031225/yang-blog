import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getCategories, getPostSummaries } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = { title: "文章分类", description: "按主题浏览 Yang's Blog 的文章。" };

export default function CategoriesPage() {
  const categories = getCategories();
  const summaries = getPostSummaries();
  return <PageShell>
    <SubpageHero title="文章分类"/>
    <main className="collection-shell subpage-content">
      <Suspense><CollectionBrowser mode="categories" posts={summaries} categories={categories} tags={[]}/></Suspense>
    </main>
  </PageShell>;
}
