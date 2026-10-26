"use client";

import { useEffect } from "react";

export default function OceanInteractions() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active: HTMLElement | null = null;
    let frame = 0;
    const ripples = new Set<HTMLElement>();
    const reset = () => {
      active?.style.setProperty("--ocean-angle", "0deg");
      active?.style.setProperty("--ocean-glow", "0");
      active = null;
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !finePointer.matches || event.pointerType === "touch") return;
      const card = (event.target as Element).closest<HTMLElement>("[data-ocean-card]");
      cancelAnimationFrame(frame);
      if (card !== active) reset();
      if (!card) return;
      active = card;
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        card.style.setProperty("--ocean-axis-x", String(-y));
        card.style.setProperty("--ocean-axis-y", String(x));
        card.style.setProperty("--ocean-angle", `${Math.hypot(x, y) * 5}deg`);
        card.style.setProperty("--ocean-x", `${(x + .5) * 100}%`);
        card.style.setProperty("--ocean-y", `${(y + .5) * 100}%`);
        card.style.setProperty("--ocean-glow", "1");
      });
    };
    const click = (event: MouseEvent) => {
      if (motion.matches || event.detail === 0 || !(event.target as Element).closest("button, a")) return;
      const ripple = document.createElement("span");
      ripple.className = "oceanRipple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      ripples.add(ripple);
      ripple.addEventListener("animationend", () => { ripple.remove(); ripples.delete(ripple); }, { once: true });
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    document.addEventListener("click", click);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(frame);
      reset();
      ripples.forEach((ripple) => ripple.remove());
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
      document.removeEventListener("click", click);
      window.removeEventListener("blur", reset);
    };
  }, []);
  return null;
}
