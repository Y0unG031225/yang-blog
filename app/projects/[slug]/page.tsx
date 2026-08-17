import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components";
import { projects } from "../../data";
import { absoluteUrl } from "../../lib/urls";
export async function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const p = projects.find(item => item.slug === slug); return p ? { title: p.title, description: p.description, alternates: { canonical: absoluteUrl(`/projects/${p.slug}/`) }, openGraph: { title: p.title, description: p.description, url: absoluteUrl(`/projects/${p.slug}/`), images: [] }, twitter: { card: "summary", title: p.title, description: p.description, images: [] } } : { title: "项目" }; }
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const p = projects.find(item => item.slug === slug); if (!p) notFound(); return <PageShell><main className="shell project-detail"><Link className="back-link" href="/projects">← 返回项目列表</Link><header><span className="status-chip">{p.status}</span><h1>{p.title}</h1><p>{p.description}</p></header><div className="project-showcase"><div className="project-poster"><span>BUILD · REFLECT · GROW</span><b>数字花园<br/>持续生长</b><i>{p.year} / 现在</i></div><div className="project-facts"><dl><div><dt>开发时间</dt><dd>{p.period}</dd></div><div><dt>个人职责</dt><dd>{p.role}</dd></div><div><dt>技术栈</dt><dd>{p.stack.join(" / ")}</dd></div></dl><h2>项目目标</h2><p>{p.goal}</p><h2>阶段总结</h2><p>{p.summary}</p></div></div></main></PageShell>; }
