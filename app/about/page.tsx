import type { Metadata } from "next";
import { PageShell } from "../components";
import { siteConfig } from "../site.config";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = { title: "关于我", description: siteConfig.intro };

export default function AboutPage() {
  const contactLinks = [
    siteConfig.contact.email && { label: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}`, external: false },
    siteConfig.contact.github.startsWith("http") && { label: "GitHub", href: siteConfig.contact.github, external: true },
    siteConfig.contact.bilibili.startsWith("http") && { label: "Bilibili", href: siteConfig.contact.bilibili, external: true },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return <PageShell>
    <SubpageHero title="About"/>
    <main className="shell page-main about-page subpage-content">
      <header className="page-hero about-hero">
        <div>{siteConfig.avatar && <img className="profile-avatar" src={siteConfig.avatar} alt={`${siteConfig.ownerName}的头像`}/>}<span className="eyebrow">ABOUT ME</span><h1>你好，我是<br/>{siteConfig.ownerName}。</h1><small>{siteConfig.role} · {siteConfig.direction}</small></div>
        <p>{siteConfig.aboutIntro}</p>
      </header>
      <div className="about-grid">
        <section><span className="chapter">01</span><h2>现在的我</h2><p>{siteConfig.currentFocus}</p></section>
        <section><span className="chapter">02</span><h2>教育与方向</h2><div className="timeline">{siteConfig.education.map(item => <div key={item.period}><time>{item.period}</time><h3>{item.title}</h3><p>{item.detail}</p></div>)}</div></section>
        <section><span className="chapter">03</span><h2>兴趣坐标</h2><div className="interest-list">{siteConfig.interests.map(interest => <span key={interest}>{interest}</span>)}</div></section>
        <section><span className="chapter">04</span><h2>接下来</h2><p>{siteConfig.nextGoal}</p></section>
      </div>
      <aside className="contact-card"><span className="eyebrow">SAY HELLO</span><h2>欢迎交流学习与项目想法。</h2>{contactLinks.length ? <div className="contact-links">{contactLinks.map(link => <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>{link.label}</a>)}</div> : <p>联系方式暂未公开，可以在个人信息配置中随时添加。</p>}</aside>
    </main>
  </PageShell>;
}
