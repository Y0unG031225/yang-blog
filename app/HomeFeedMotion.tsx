"use client";

import { useEffect, useRef, type ReactNode } from "react";

type HomeFeedMotionProps = {
  children: ReactNode;
};

export function HomeFeedMotion({ children }: HomeFeedMotionProps) {
  const feedRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const feed = feedRef.current;
    const hero = document.querySelector<HTMLElement>(".blog-hero");

    if (!feed || !hero) return;

    let frame = 0;

    const updateLift = () => {
      frame = 0;

      const scrolledFromHeroTop = Math.max(
        0,
        -hero.getBoundingClientRect().top,
      );
      const revealDistance = Math.max(160, window.innerHeight * 0.22);
      const progress = Math.min(1, scrolledFromHeroTop / revealDistance);
      const maxLift = Math.min(32, Math.max(16, window.innerWidth * 0.02));

      feed.style.setProperty(
        "--home-feed-lift",
        `${(progress * maxLift).toFixed(2)}px`,
      );
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateLift);
    };

    updateLift();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={feedRef}
      id="articles"
      className="home-feed"
      aria-label="Latest articles"
    >
      {children}
    </section>
  );
}
