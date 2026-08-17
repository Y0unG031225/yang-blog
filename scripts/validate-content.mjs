import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const postsDirectory = path.join(root, "content", "posts");
const requiredFields = ["title", "description", "date", "category", "categoryKey", "tags", "draft"];
const errors = [];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;
  return Object.fromEntries(match[1].split(/\r?\n/).flatMap(line => {
    const separator = line.indexOf(":");
    if (separator < 0) return [];
    return [[line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, "")]];
  }));
}

function publicFileExists(urlPath) {
  const pathname = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  return fs.existsSync(path.join(root, "public", pathname.replace(/^\/+/, "")));
}

for (const filename of fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"))) {
  const file = path.join(postsDirectory, filename);
  const raw = fs.readFileSync(file, "utf8");
  const data = parseFrontmatter(raw);
  if (!data) {
    errors.push(`${filename}: 缺少 frontmatter`);
    continue;
  }
  for (const field of requiredFields) if (!data[field]) errors.push(`${filename}: 缺少字段 ${field}`);
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push(`${filename}: date 必须使用 YYYY-MM-DD`);
  const published = data.draft === "false";
  if (published && !data.socialImage) errors.push(`${filename}: 已发布文章缺少 socialImage`);
  if (published && data.socialImage && !publicFileExists(data.socialImage)) errors.push(`${filename}: 分享图不存在 ${data.socialImage}`);

  for (const match of raw.matchAll(/!?\[[^\]]*\]\((\/[^)]+)\)/g)) {
    if (!publicFileExists(match[1])) errors.push(`${filename}: 本地资源不存在 ${match[1]}`);
  }
}

if (errors.length) {
  console.error(`内容检查失败（${errors.length} 项）：\n${errors.map(error => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("内容检查通过：文章字段、分享图和本地资源均有效。");
