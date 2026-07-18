import Link from "next/link";
import { PageShell, PostCard } from "./components";
import { posts } from "./data";

export default function Home() {
  return <PageShell><main className="blog-home">
    <section className="blog-hero"><div className="hero-overlay"/><div className="hero-title"><span>PERSONAL TECH BLOG</span><h1>What is AI? What is Deep Learning?<br/>What is LLM?</h1><p>Notes on artificial intelligence, backend development and graduate research.</p></div><a className="scroll-cue" href="#latest" aria-label="Scroll to latest posts">⌄</a></section>
    <section id="latest" className="home-feed"><div className="feed-heading"><div><span>LATEST POSTS</span><h2>Recent Articles</h2></div><Link href="/posts">View archives →</Link></div>
      <div className="post-list">{posts.map(post => <PostCard key={post.slug} post={post}/>)}</div>
    </section>
  </main></PageShell>;
}
