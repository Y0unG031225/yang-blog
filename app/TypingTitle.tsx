"use client";

import { useEffect, useState } from "react";

export function TypingTitle({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const characters = Array.from(text);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleText(text);
      setComplete(true);
      return;
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeNext = () => {
      index += 1;
      setVisibleText(characters.slice(0, index).join(""));
      if (index < characters.length) timer = setTimeout(typeNext, 58);
      else timer = setTimeout(() => setComplete(true), 650);
    };
    timer = setTimeout(typeNext, 360);
    return () => clearTimeout(timer);
  }, [text]);

  return <h1 className="typing-title" aria-label={text}><span aria-hidden="true">{visibleText}</span><i className={complete ? "typing-cursor done" : "typing-cursor"} aria-hidden="true" /></h1>;
}
