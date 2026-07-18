import type { Metadata } from "next";
import { CollectionPostRow } from "../CollectionPostRow";
import { PageShell } from "../components";
import { posts } from "../lib/posts";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = { title: "文章归档", description: "按时间浏览 Yang's Blog 的全部文章。" };

export default function ArchivesPage() {
  const years = Array.from(new Set(posts.map(post => post.date.slice(0, 4))));
  return <PageShell>
    <SubpageHero title="Archives"/>
    <main className="collection-shell subpage-content">
      <div className="archive-timeline">{years.map(year => {
        const yearPosts = posts.filter(post => post.date.startsWith(year));
        return <section className="archive-year" key={year}><header><h2>{year}</h2><span>{yearPosts.length} 篇</span></header><div>{yearPosts.map(post => <CollectionPostRow key={post.slug} post={post}/>)}</div></section>;
      })}</div>
    </main>
  </PageShell>;
}
