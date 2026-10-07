"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { TravelPackage } from "@/app/data/travelPackages";
import styles from "./page.module.css";

type ItineraryItem = TravelPackage["itinerary"][number];

export default function ItinerarySteps({ items }: { items: ItineraryItem[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasStarted(true);
        observer.disconnect();
      },
      { threshold: 0.32 },
    );

    observer.observe(timeline);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted || items.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const firstStepTimer = window.setTimeout(() => setActiveStep(0), 0);
      return () => window.clearTimeout(firstStepTimer);
    }

    const timers = items.map((_, index) =>
      window.setTimeout(() => setActiveStep(index), 280 + index * 1650),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [hasStarted, items]);

  return (
    <div
      className={`${styles.timeline} ${hasStarted ? styles.timelineStarted : ""}`}
      ref={timelineRef}
    >
      {items.map((item, index) => {
        const isActive = activeStep === index;
        const isCompleted = activeStep !== null && index < activeStep;

        return (
          <article
            className={`${styles.timelineStep} ${isActive ? styles.timelineStepActive : ""} ${isCompleted ? styles.timelineStepCompleted : ""}`}
            key={item.day}
            style={{ "--step-index": index } as CSSProperties}
          >
            <button
              className={styles.timelineButton}
              type="button"
              onClick={() => setActiveStep(index)}
              aria-expanded={isActive}
            >
              <span className={styles.timelineMarker}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.timelineLabel}>{item.day}</span>
              <strong>{item.title}</strong>
              <span className={styles.timelineArrow} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m8 10 4 4 4-4" /></svg>
              </span>
            </button>
            <div className={styles.timelinePanel} aria-hidden={!isActive}>
              <div><p>{item.description}</p></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
