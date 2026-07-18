# Yang's Blog

一个使用 Next.js 与 Markdown 构建的纯静态个人博客，可免费部署到 GitHub Pages。

## 本地使用

```bash
npm install
npm run dev
```

生成可发布的静态网站：

```bash
npm run build
```

构建结果位于 `out/`。项目不再使用阅读量、热门文章、API、Cloudflare Workers 或 D1 数据库。

## 发布文章

在 `content/posts/` 新建或编辑 Markdown 文件，提交到 GitHub 的 `main` 分支后，GitHub Actions 会自动构建并发布网站。

## GitHub Pages

仓库已包含 `.github/workflows/deploy-pages.yml`。首次发布时，在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**，之后每次推送都会自动更新。
