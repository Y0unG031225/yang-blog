import { PageShell, PostCard } from "./components";
import { posts } from "./lib/posts";
import { siteConfig } from "./site.config";
import { TypingTitle } from "./TypingTitle";

export default function Home() {
  return <PageShell><main className="blog-home">
    <section className="blog-hero">
      <div className="hero-overlay" />
      <div className="hero-title"><TypingTitle text={siteConfig.heroTitle} /></div>
    </section>
    <section className="home-feed" aria-label="Latest articles">
      <div className="post-list">{posts.map(post => <PostCard key={post.slug} post={post}/>)}</div>
    </section>
  </main></PageShell>;
}
