import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { postViews } from "../../../../db/schema";
import { posts } from "../../../lib/posts";

export async function GET() {
  const db = await getDb();
  const rows = await db.select().from(postViews).orderBy(desc(postViews.views)).limit(6);
  const result = rows.flatMap(row => {
    const post = posts.find(item => item.slug === row.slug);
    return post ? [{ slug: post.slug, title: post.title, category: post.category, views: row.views }] : [];
  });
  return Response.json({ posts: result });
}
