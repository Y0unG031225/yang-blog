import { TypingTitle } from "./TypingTitle";

export function SubpageHero({ title }: { title: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <section
      className="subpage-hero"
      style={{ backgroundImage: `url('${basePath}/fluid-default.jpg')` }}
      aria-label={title}
    >
      <div className="subpage-hero-overlay" />
      <div className="subpage-hero-title">
        <TypingTitle text={title} />
      </div>
    </section>
  );
}
