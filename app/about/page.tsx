/* The optional user-provided avatar is served as a static export asset. */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { PageShell } from "../components";
import { siteConfig } from "../site.config";
import { SubpageHero } from "../SubpageHero";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.intro,
};

export default function AboutPage() {
  return (
    <PageShell>
      <SubpageHero title="About" />
      <main className="collection-shell subpage-content about-shell">
        <section className="fluid-card about-card">
          <div className="about-avatar" aria-hidden={!siteConfig.avatar}>
            {siteConfig.avatar ? (
              <img
                src={siteConfig.avatar}
                alt={`${siteConfig.ownerName}的头像`}
              />
            ) : (
              <span>{siteConfig.initials}</span>
            )}
          </div>
          <header className="about-profile">
            <h1>{siteConfig.ownerName}</h1>
            <p>
              {siteConfig.role} · {siteConfig.direction}
            </p>
            <nav aria-label="Contact links">
              <a
                href={siteConfig.contact.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a href={`mailto:${siteConfig.contact.email}`}>Email</a>
            </nav>
          </header>
          <article className="about-content">
            <section>
              <h2>👋 Introduction</h2>
              <p>{siteConfig.aboutIntro}</p>
              <p>{siteConfig.intro}</p>
            </section>
            <section>
              <h2>🔭 Current Focus</h2>
              <p>{siteConfig.currentFocus}</p>
            </section>
            <section>
              <h2>📖 Education</h2>
              <div className="about-timeline">
                {siteConfig.education.map((item) => (
                  <div key={item.period}>
                    <time>{item.period}</time>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2>✨ Interests</h2>
              <ul>
                {siteConfig.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>🚀 Next</h2>
              <p>{siteConfig.nextGoal}</p>
            </section>
            <section>
              <h2>📞 Contact</h2>
              <p>
                Email:{" "}
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                GitHub:{" "}
                <a
                  href={siteConfig.contact.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  Y0unG031225
                </a>
              </p>
            </section>
          </article>
        </section>
      </main>
    </PageShell>
  );
}
