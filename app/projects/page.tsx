import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components";
import { projects } from "../data";
export const metadata: Metadata = { title: "项目", description: "项目实践与阶段总结。" };
export default function ProjectsPage() { return <PageShell><main className="shell page-main"><header className="page-hero"><span className="eyebrow">PROJECT ARCHIVE</span><h1>实践与创造</h1><p>这里只展示已经实际开展、并且有内容可以说明的项目。</p></header><div className="project-list">{projects.map((p, i) => <Link href={`/projects/${p.slug}`} className={`project-row tone-${p.tone}`} key={p.slug}><span className="project-index">0{i + 1}</span><div><span className="status-chip">{p.status}</span><h2>{p.title}</h2><p>{p.description}</p><div className="tag-row">{p.stack.map(s => <span key={s}>{s}</span>)}</div></div><strong>{p.year} ↗</strong></Link>)}</div></main></PageShell>; }
