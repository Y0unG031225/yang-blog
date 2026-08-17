import { PageShell, PostCard } from "./components";
import { posts } from "./lib/posts";
import { ScrollToArticles } from "./ScrollToArticles";
import { siteConfig } from "./site.config";
import { TypingTitle } from "./TypingTitle";

export default function Home() {
  return (
    <PageShell>
      <main className="blog-home">
        <section
          className="blog-hero"
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/city-hero-optimized.webp')`,
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-title">
            <TypingTitle text={siteConfig.heroTitle} />
            <p>{siteConfig.shortDescription}</p>
          </div>
          <ScrollToArticles />
        </section>
        <section
          id="articles"
          className="home-feed"
          aria-label="Latest articles"
        >
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
