import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getCategories, getPostSummaries } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Yang's Blog by category.",
};

export default function CategoriesPage() {
  const categories = getCategories();
  const summaries = getPostSummaries();
  return (
    <PageShell>
      <SubpageHero title="Categories" />
      <main className="collection-shell subpage-content">
        <Suspense>
          <CollectionBrowser
            mode="categories"
            posts={summaries}
            categories={categories}
            tags={[]}
          />
        </Suspense>
      </main>
    </PageShell>
  );
}
