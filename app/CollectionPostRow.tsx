import Link from "next/link";
import type { BlogPost } from "./lib/posts";

export function CollectionPostRow({ post, compact = false }: { post: Omit<BlogPost, "content">; compact?: boolean }) {
  return <article className={`collection-post ${compact ? "compact" : ""}`}>
    <time dateTime={post.date}>{post.date.slice(5).replace("-", ".")}</time>
    <div>
      <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
      {!compact && <p>{post.description}</p>}
      <div className="collection-post-meta"><Link href={`/categories?category=${post.categoryKey}`}>{post.category}</Link>{post.tags.slice(0, 3).map(tag => <Link key={tag} href={`/tags?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}<span>{post.read}</span></div>
    </div>
  </article>;
}
