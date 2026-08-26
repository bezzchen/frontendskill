"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function IntroFade({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = animate(ref.current, {
      opacity: { from: 0, to: 1 },
      translateY: { from: 12, to: 0 },
      duration: 500,
      ease: "outQuad",
    });
    return () => animation.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
