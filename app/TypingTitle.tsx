"use client";

import { useEffect, useState } from "react";

export function TypingTitle({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    const characters = Array.from(text);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setVisibleText(text));
      return () => cancelAnimationFrame(frame);
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeNext = () => {
      index += 1;
      setVisibleText(characters.slice(0, index).join(""));
      if (index < characters.length) timer = setTimeout(typeNext, 52);
    };
    timer = setTimeout(typeNext, 180);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <h1 className="typing-title" aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      <i className="typing-cursor" aria-hidden="true">
        _
      </i>
    </h1>
  );
}
