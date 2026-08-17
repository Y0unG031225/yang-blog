import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDirectory = path.join(root, "public");

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }))).flat();
}

async function writeWebp(source) {
  const output = source.replace(/\.png$/i, ".webp");
  await sharp(source).webp({ quality: 90, effort: 6, smartSubsample: true }).toFile(output);
}

async function writeSocialCard(source, output, fit = "cover") {
  await sharp(source)
    .resize(1200, 630, { fit, position: "centre", background: "#14283a", withoutEnlargement: false })
    .flatten({ background: "#14283a" })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(output);
}

const readerImages = (await walk(path.join(publicDirectory, "readers"))).filter(file => file.endsWith(".png"));
await Promise.all(readerImages.map(writeWebp));

const postCardDirectory = path.join(publicDirectory, "og", "posts");
for (const slug of ["ddpm-bilingual-reader", "spring-boot-review", "unet-notes"]) {
  await writeSocialCard(path.join(postCardDirectory, `${slug}.png`), path.join(postCardDirectory, `${slug}.jpg`));
}
await writeSocialCard(
  path.join(publicDirectory, "readers", "dqn-human-level-control", "fig1_network.png"),
  path.join(postCardDirectory, "human-level-control-deep-reinforcement-learning-bilingual-reader.jpg"),
  "contain",
);
await writeSocialCard(path.join(publicDirectory, "og.png"), path.join(publicDirectory, "og.jpg"));

const hero = path.join(publicDirectory, "city-hero-wide.webp");
const heroOutput = path.join(publicDirectory, "city-hero-optimized.webp");
await sharp(hero).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 72, effort: 6, smartSubsample: true }).toFile(heroOutput);

console.log(`已优化 ${readerImages.length} 张文章图片、5 张分享图和首页背景图。`);
