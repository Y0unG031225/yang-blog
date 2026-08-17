"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CollectionPostRow } from "./CollectionPostRow";
import type { BlogPostSummary } from "./lib/posts";

export function CollectionBrowser({
  mode,
  posts,
  categories,
  tags,
}: {
  mode: "categories" | "tags";
  posts: BlogPostSummary[];
  categories: [string, string][];
  tags: string[];
}) {
  const query = useSearchParams();
  const selectedTag = query.get("tag") ?? "";

  if (mode === "categories") {
    return (
      <section className="fluid-card category-list" aria-label="Categories">
        {categories.map(([key, label], index) => {
          const categoryPosts = posts.filter(
            (post) => post.categoryKey === key,
          );
          return (
            <details key={key} open={index === 0}>
              <summary>
                <span>{label}</span>
                <small>{categoryPosts.length}</small>
              </summary>
              <div className="category-post-list">
                {categoryPosts.map((post) => (
                  <CollectionPostRow compact key={post.slug} post={post} />
                ))}
              </div>
            </details>
          );
        })}
      </section>
    );
  }

  const tagCounts = tags.map((tag) => ({
    tag,
    count: posts.filter((post) => post.tags.includes(tag)).length,
  }));
  const maxCount = Math.max(1, ...tagCounts.map(({ count }) => count));
  const selectedPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : [];

  return (
    <>
      <section className="fluid-card tag-cloud-card">
        <nav className="tag-cloud" aria-label="Tags">
          {tagCounts.map(({ tag, count }) => {
            const scale = 0.86 + (count / maxCount) * 0.72;
            return (
              <Link
                key={tag}
                className={selectedTag === tag ? "active" : ""}
                href={`/tags?tag=${encodeURIComponent(tag)}`}
                style={{ "--tag-scale": scale } as CSSProperties}
              >
                {tag}
              </Link>
            );
          })}
        </nav>
      </section>
      {selectedTag && (
        <section className="fluid-card tag-results">
          <header>
            <h2>#{selectedTag}</h2>
            <Link href="/tags">All tags</Link>
          </header>
          {selectedPosts.map((post) => (
            <CollectionPostRow compact key={post.slug} post={post} />
          ))}
        </section>
      )}
    </>
  );
}
