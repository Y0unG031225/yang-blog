import type { Metadata } from "next";
import { PageShell } from "../components";
import { resources } from "../data";
import { publicPath } from "../lib/urls";
export const metadata: Metadata = { title: "资源", description: "公开的学习资料与文件下载。" };
export default function ResourcesPage() { return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">OPEN RESOURCES</span><h1>公开资源</h1><p>这里仅提供已经整理完成、可以正常下载的学习资料。</p></header><div className="resource-list">{resources.map(r => <article className="resource-row" key={r.title}><span className="file-type">{r.type}</span><div><span className="eyebrow">{r.category}</span><h2>{r.title}</h2><p>{r.description}</p><small>{r.size} · 更新于 {r.updated}</small></div><a className="button ghost" href={publicPath(r.href)} download>下载 ↓</a></article>)}</div><div className="notice"><b>使用说明</b><p>资料仅供学习交流；涉及原论文、图片与数据时，请遵守对应来源的版权与引用要求。</p></div></main></PageShell>; }
