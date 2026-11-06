"use client";

import { type RefObject, useEffect } from "react";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Marks `.reveal` / `.io` elements under `root` with `in` the first time they
// scroll into view. `rescanKey` re-runs the scan when a list re-renders.
export const useReveal = (
  root: RefObject<HTMLElement | null>,
  rescanKey?: unknown
) => {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" }
    );
    el.querySelectorAll(".reveal:not(.in), .io:not(.in)").forEach((n) =>
      io.observe(n)
    );
    return () => io.disconnect();
  }, [root, rescanKey]);
};

// A smooth scroll from the hero to a section far below drags the guest through
// every sticky card in between; a view transition cuts straight there instead.
export const jumpTo = (hash: string, beforeJump?: () => void) => {
  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return;
  const jump = () => {
    beforeJump?.();
    target.scrollIntoView({ behavior: "instant", block: "start" });
    history.replaceState(null, "", hash);
  };
  if (document.startViewTransition && !prefersReducedMotion()) {
    document.startViewTransition(jump);
  } else {
    jump();
  }
};
