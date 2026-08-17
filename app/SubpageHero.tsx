export function SubpageHero({ title }: { title: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <section
      className="subpage-hero"
      style={{ backgroundImage: `url('${basePath}/city-hero-wide.webp')` }}
      aria-label={title}
    >
      <div className="subpage-hero-overlay" />
      <div className="subpage-hero-title">
        <h1>{title}</h1>
      </div>
    </section>
  );
}
