import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionBrowser } from "../CollectionBrowser";
import { PageShell } from "../components";
import { getPostSummaries, getTags } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = {
  title: "Tags",
  description: "Explore posts on Yang's Blog by tag.",
};

export default function TagsPage() {
  const tags = getTags();
  const summaries = getPostSummaries();
  return (
    <PageShell>
      <SubpageHero title="Tags" />
      <main className="collection-shell subpage-content">
        <Suspense>
          <CollectionBrowser
            mode="tags"
            posts={summaries}
            categories={[]}
            tags={tags}
          />
        </Suspense>
      </main>
    </PageShell>
  );
}
