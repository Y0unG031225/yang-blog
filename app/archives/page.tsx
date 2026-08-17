import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components";
import { posts } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = {
  title: "Archives",
  description: "Browse all posts on Yang's Blog by year.",
};

export default function ArchivesPage() {
  const years = Array.from(new Set(posts.map((post) => post.date.slice(0, 4))));
  return (
    <PageShell>
      <SubpageHero title="Archives" />
      <main className="collection-shell subpage-content">
        <section className="fluid-card archive-card">
          <p className="collection-total">{posts.length} posts in total</p>
          <div className="archive-timeline">
            {years.map((year) => {
              const yearPosts = posts.filter((post) =>
                post.date.startsWith(year),
              );
              return (
                <section className="archive-year" key={year}>
                  <h2>{year}</h2>
                  <div>
                    {yearPosts.map((post) => (
                      <article className="archive-entry" key={post.slug}>
                        <time dateTime={post.date}>{post.date.slice(5)}</time>
                        <Link href={`/posts/${post.slug}`} scroll={false}>
                          {post.title}
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
