import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  categoryKey: string;
  tags: string[];
  tone: string;
  read: string;
  socialImage?: string;
  draft: boolean;
  content: string;
};

export type BlogPostSummary = Omit<BlogPost, "content">;

type Frontmatter = Record<string, string | string[] | boolean>;

const postsDirectory = path.join(process.cwd(), "content", "posts");
const markdownFiles = Object.fromEntries(
  fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith(".md"))
    .map(file => [path.join(postsDirectory, file), fs.readFileSync(path.join(postsDirectory, file), "utf8")]),
);

function cleanValue(value: string) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1).split(",").map(item => cleanValue(item)).filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = cleanValue(value);
    }
  }
  return { data, content: match[2].trim() };
}

function requiredString(data: Frontmatter, key: string, file: string) {
  const value = data[key];
  if (typeof value !== "string" || !value) throw new Error(`${file} 缺少 frontmatter 字段：${key}`);
  return value;
}

function estimateReadTime(content: string) {
  const chineseCharacters = (content.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = (content.replace(/[\u3400-\u9fff]/g, " ").match(/[A-Za-z0-9]+/g) ?? []).length;
  return `${Math.max(1, Math.ceil(chineseCharacters / 400 + latinWords / 200))} 分钟`;
}

function toPost(file: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  const slug = path.basename(file, ".md");
  return {
    slug,
    title: requiredString(data, "title", file),
    description: requiredString(data, "description", file),
    date: requiredString(data, "date", file),
    category: requiredString(data, "category", file),
    categoryKey: requiredString(data, "categoryKey", file),
    tags: Array.isArray(data.tags) ? data.tags : [],
    tone: typeof data.tone === "string" ? data.tone : "blue",
    read: typeof data.read === "string" ? data.read : estimateReadTime(content),
    socialImage: typeof data.socialImage === "string" ? data.socialImage : undefined,
    draft: data.draft === true,
    content,
  };
}

export const posts = Object.entries(markdownFiles)
  .map(([file, raw]) => toPost(file, raw))
  .filter(post => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return posts.find(post => post.slug === slug);
}

export function getPostSummaries(): BlogPostSummary[] {
  return posts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    categoryKey: post.categoryKey,
    tags: post.tags,
    tone: post.tone,
    read: post.read,
    socialImage: post.socialImage,
    draft: post.draft,
  }));
}

export function getCategories() {
  return Array.from(new Map(posts.map(post => [post.categoryKey, post.category])).entries());
}

export function getTags() {
  return Array.from(new Set(posts.flatMap(post => post.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}
