import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { postViews } from "../../../../db/schema";
import { getPost } from "../../../lib/posts";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPost(slug)) return Response.json({ error: "Article not found" }, { status: 404 });
  const db = await getDb();
  const [row] = await db.select().from(postViews).where(eq(postViews.slug, slug)).limit(1);
  return Response.json({ slug, views: row?.views ?? 0 });
}

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPost(slug)) return Response.json({ error: "Article not found" }, { status: 404 });
  const db = await getDb();
  const [row] = await db.insert(postViews).values({ slug, views: 1 }).onConflictDoUpdate({
    target: postViews.slug,
    set: { views: sql`${postViews.views} + 1`, updatedAt: sql`CURRENT_TIMESTAMP` },
  }).returning();
  return Response.json({ slug, views: row.views });
}
