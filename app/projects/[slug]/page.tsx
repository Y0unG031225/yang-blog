import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components";
import { projects } from "../../data";
export async function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const p = projects.find(item => item.slug === slug); if (!p) notFound(); return <PageShell><main className="shell project-detail"><Link className="back-link" href="/projects">← 返回项目列表</Link><header><span className="status-chip">{p.status}</span><h1>{p.title}</h1><p>{p.description}</p></header><div className="project-showcase"><div className="project-poster"><span>BUILD · REFLECT · GROW</span><b>数字花园<br/>持续生长</b><i>2026 / 现在</i></div><div className="project-facts"><dl><div><dt>开发时间</dt><dd>2026.07 — 至今</dd></div><div><dt>个人职责</dt><dd>策划、设计、开发与内容维护</dd></div><div><dt>技术栈</dt><dd>{p.stack.join(" / ")}</dd></div></dl><h2>项目目标</h2><p>为学习、研究与生活建立一个长期、清晰、完全由自己掌控的记录空间。内容使用本地文件维护，发布流程保持简单。</p><h2>阶段总结</h2><p>第一版先把阅读与记录体验做好，不引入数据库、登录和复杂后台。让网站真正服务于内容，而不是变成另一项需要照顾的工程。</p></div></div></main></PageShell>; }
