import type { Metadata } from "next";
import { PageShell } from "../components";
import { resources } from "../data";
export const metadata: Metadata = { title: "资源", description: "公开的学习资料与文件下载。" };
export default function ResourcesPage() { return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">OPEN RESOURCES</span><h1>公开资源</h1><p>分享可以自由公开的模板、清单和学习资料。下载前请尊重原始版权与使用范围。</p></header><div className="resource-list">{resources.map((r, i) => <article className="resource-row" key={r.title}><span className="file-type">{r.type}</span><div><span className="eyebrow">{r.category}</span><h2>{r.title}</h2><p>{r.description}</p><small>{r.size} · 更新于 {r.updated}</small></div><a className="button ghost" href={i === 0 ? "/downloads/study/paper-reading-template.md" : "#"} download={i === 0}>下载 ↓</a></article>)}</div><div className="notice"><b>公开说明</b><p>当前为示例资源。正式发布前，请仅上传你拥有传播权且不包含隐私信息的文件。</p></div></main></PageShell>; }
