import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const missing = new Set();

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function existsAsExport(pathname) {
  const target = path.join(out, pathname.replace(/^\/+/, "").replaceAll("/", path.sep));
  return fs.existsSync(target) || fs.existsSync(`${target}.html`) || fs.existsSync(path.join(target, "index.html"));
}

for (const file of walk(out).filter(filename => filename.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll("&amp;", "&");
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    let pathname;
    try { pathname = decodeURIComponent(new URL(value, "https://local.invalid").pathname); }
    catch { missing.add(`${path.relative(out, file)} → 无效地址 ${value}`); continue; }
    if (basePath && pathname.startsWith(`${basePath}/`)) pathname = pathname.slice(basePath.length);
    else if (basePath && pathname === basePath) pathname = "/";
    if (!existsAsExport(pathname)) missing.add(`${path.relative(out, file)} → ${value}`);
  }
}

if (missing.size) {
  console.error(`发布链接检查失败（${missing.size} 项）：\n${[...missing].map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log("发布链接检查通过：页面内资源与站内链接均可解析。");
