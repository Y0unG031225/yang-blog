import Link from "next/link";
import { PageShell, PostCard, SectionHeading } from "./components";
import { posts, profile, projects } from "./data";

export default function Home() {
  return <PageShell><main>
    <section className="hero shell"><div className="hero-copy"><span className="eyebrow">PERSONAL GROWTH JOURNAL · 2026</span><h1>在探索中<br/><em>成为自己。</em></h1><p className="hero-intro">{profile.intro}</p><div className="hero-actions"><Link className="button primary" href="/posts">开始阅读</Link><Link className="button ghost" href="/about">认识我 →</Link></div></div>
      <aside className="now-card"><div className="avatar-orbit"><div className="avatar">{profile.initials}</div><span className="orbit-dot one"/><span className="orbit-dot two"/></div><span className="status"><i/>当前状态 · 在读</span><h2>{profile.role}</h2><p>{profile.direction}</p><hr/><span className="eyebrow">NOW LEARNING</span><ul><li>Java 后端开发</li><li>深度学习与论文阅读</li><li>AI 应用开发</li></ul></aside>
    </section>
    <section className="manifesto"><div className="shell manifesto-grid"><span className="chapter">01</span><blockquote>“我相信成长不是一条直线，<br/>而是一系列认真生活过的证据。”</blockquote><p>这里收集学习笔记、科研思考、项目实践，也保存校园生活和游戏旅程。它不是简历，而是一座持续生长的数字花园。</p></div></section>
    <section className="section shell"><SectionHeading eyebrow="RECENT NOTES · 近期记录" title="最近写下的故事" link="/posts"/><div className="post-grid">{posts.slice(0, 3).map(post => <PostCard key={post.slug} post={post}/>)}</div></section>
    <section className="section shell"><SectionHeading eyebrow="SELECTED WORK · 实践与创造" title="正在做的项目" link="/projects"/><div className="project-feature"><div className="project-visual"><span className="mini-note n1">学习</span><span className="mini-note n2">生活</span><span className="mini-note n3">研究</span><b>GROW<br/>TH.</b></div><div className="project-copy"><span className="status-chip">{projects[0].status}</span><h3>{projects[0].title}</h3><p>{projects[0].description} 从内容结构、阅读体验到部署流程，目标都是让记录这件事足够简单、可以坚持很久。</p><div className="tag-row">{projects[0].stack.map(item => <span key={item}>{item}</span>)}</div><Link className="button primary" href="/projects/growth-journal">查看项目 →</Link></div></div></section>
  </main></PageShell>;
}
