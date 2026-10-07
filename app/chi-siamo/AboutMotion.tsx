"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./page.module.css";

export default function AboutMotion({ children }: { children: ReactNode }) {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add(styles.revealed));
      return;
    }

    page.classList.add(styles.motionReady);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -70px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.page} ref={pageRef}>
      {children}
    </main>
  );
}
