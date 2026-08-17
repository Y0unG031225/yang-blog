import fs from "node:fs/promises";
import path from "node:path";

const out = path.join(process.cwd(), "out");

async function walk(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return (await Promise.all(entries.map(entry => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }))).flat();
  } catch {
    return [];
  }
}

const obsolete = [
  ...(await walk(path.join(out, "readers"))).filter(file => file.endsWith(".png")),
  path.join(out, "og.png"),
  path.join(out, "og-blog.png"),
  path.join(out, "city-hero-wide.webp"),
  path.join(out, "city-hero-wide.jpg"),
  path.join(out, "city-hero-wide.optimized.webp"),
  path.join(out, "og", "readers", "ddpm.png"),
  path.join(out, "og", "posts", "game-journey.png"),
  path.join(out, "og", "posts", "july-campus.png"),
  ...["ddpm-bilingual-reader", "spring-boot-review", "unet-notes"].map(slug => path.join(out, "og", "posts", `${slug}.png`)),
];

await Promise.all(obsolete.map(file => fs.rm(file, { force: true })));
console.log(`已从发布目录移除 ${obsolete.length} 个不再使用的旧图片。`);
