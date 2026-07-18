import { PageShell, PostCard } from "./components";
import { posts } from "./data";
import { TypingTitle } from "./TypingTitle";

const heroTitle = "What is AI? What is Deep Learning? What is LLM?";

export default function Home() {
  return <PageShell><main className="blog-home">
    <section className="blog-hero">
      <div className="hero-overlay" />
      <div className="hero-title"><TypingTitle text={heroTitle} /></div>
      <a className="scroll-cue" href="#latest" aria-label="Scroll to latest posts"><span /></a>
    </section>
    <section id="latest" className="home-feed" aria-label="Latest articles">
      <div className="post-list">{posts.map(post => <PostCard key={post.slug} post={post}/>)}</div>
    </section>
  </main></PageShell>;
}
