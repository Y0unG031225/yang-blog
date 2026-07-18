import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the personal blog homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Yang(?:&apos;|&#x27;|')s Blog/);
  assert.match(html, /读懂 U-Net/);
  assert.match(html, /aria-label="搜索文章"/);
  assert.match(html, /yang-blog-theme/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-current="page"/);
  assert.doesNotMatch(html, /id="latest"/);
  assert.doesNotMatch(html, /sites-skeleton|Building your site/);
});

test("builds archive, taxonomy and Markdown article routes", async () => {
  const [archiveResponse, categoriesResponse, tagsResponse, articleResponse] = await Promise.all([render("/archives"), render("/categories"), render("/tags"), render("/posts/unet-notes")]);
  assert.equal(archiveResponse.status, 200);
  assert.equal(categoriesResponse.status, 200);
  assert.equal(tagsResponse.status, 200);
  assert.equal(articleResponse.status, 200);
  const [archive, categories, tags, article] = await Promise.all([archiveResponse.text(), categoriesResponse.text(), tagsResponse.text(), articleResponse.text()]);
  assert.match(archive, /文章归档/);
  assert.match(archive, /Spring Boot/);
  assert.match(categories, /文章分类/);
  assert.match(categories, /个分类/);
  assert.match(tags, /文章标签/);
  assert.match(tags, /个标签/);
  assert.match(article, /跳跃连接解决了什么/);
  assert.match(article, /本页目录/);
  assert.match(article, /aria-label="文章阅读进度"/);
  assert.match(article, /article-nav-card/);
});

test("keeps publishable posts as Markdown with frontmatter", async () => {
  const postsDirectory = new URL("../content/posts/", import.meta.url);
  const files = (await readdir(postsDirectory)).filter(file => file.endsWith(".md"));
  assert.equal(files.length, 4);
  for (const file of files) {
    const markdown = await readFile(new URL(file, postsDirectory), "utf8");
    assert.match(markdown, /^---\n/);
    assert.match(markdown, /\ntitle:\s*.+/);
    assert.match(markdown, /\ndate:\s*\d{4}-\d{2}-\d{2}/);
    assert.match(markdown, /\ntags:\s*\[[^\]]+\]/);
    assert.match(markdown, /\n---\n[\s\S]+/);
  }
});
