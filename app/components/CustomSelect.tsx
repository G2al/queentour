"use client";

import { CSSProperties, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CustomSelect.module.css";

type Option = { value: string; label: string };
type Props = {
  label: string;
  name?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "hero" | "filter" | "compact";
};

export default function CustomSelect({ label, name, options, value, defaultValue = "", onChange, variant = "filter" }: Props) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const typeahead = useRef({ text: "", time: 0 });
  const currentValue = value ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const selected = options[selectedIndex] ?? options[0];

  const measure = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 16;
    const above = rect.top - 16;
    const upwards = below < Math.min(240, options.length * 46 + 16) && above > below;
    const maxHeight = Math.min(300, Math.max(80, upwards ? above : below));
    const width = Math.min(Math.max(rect.width, 190), window.innerWidth - 24);
    setPosition({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      width,
      maxHeight,
      ...(upwards ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
    });
  };

  const openMenu = (index = Math.max(0, selectedIndex)) => {
    if (!options.length) return;
    measure();
    setActiveIndex(index);
    setOpen(true);
  };

  const choose = (option: Option) => {
    setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    let frame = 0;
    const reposition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        const below = window.innerHeight - rect.bottom - 16;
        const above = rect.top - 16;
        const upwards = below < Math.min(240, options.length * 46 + 16) && above > below;
        const width = Math.min(Math.max(rect.width, 190), window.innerWidth - 24);
        if (rect.bottom < 0 || rect.top > window.innerHeight) { setOpen(false); return; }
        setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width, maxHeight: Math.min(300, Math.max(80, upwards ? above : below)), ...(upwards ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }) });
      });
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const item = menu?.children[activeIndex] as HTMLElement | undefined;
    if (!menu || !item) return;
    if (item.offsetTop < menu.scrollTop) menu.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > menu.scrollTop + menu.clientHeight) menu.scrollTop = item.offsetTop + item.offsetHeight - menu.clientHeight;
  }, [open, activeIndex]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openMenu();
      else setActiveIndex((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const index = event.key === "Home" ? 0 : options.length - 1;
      if (!open) openMenu(index); else setActiveIndex(index);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open && options[activeIndex]) choose(options[activeIndex]); else openMenu();
    } else if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
    else if (event.key === "Tab") setOpen(false);
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      const text = (now - typeahead.current.time < 650 ? typeahead.current.text : "") + event.key.toLocaleLowerCase("it");
      typeahead.current = { text, time: now };
      const index = options.findIndex((option) => option.label.toLocaleLowerCase("it").startsWith(text));
      if (index >= 0) { event.preventDefault(); if (!open) openMenu(index); else setActiveIndex(index); }
    }
  };

  return <div className={`${styles.root} ${styles[variant]}`}>
    {name && <input type="hidden" name={name} value={currentValue} />}
    <button ref={triggerRef} type="button" role="combobox" aria-expanded={open} aria-controls={`${id}-options`} aria-haspopup="listbox" aria-labelledby={`${id}-label ${id}-value`} aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined} className={`${styles.trigger} ${open ? styles.open : ""}`} onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={onKeyDown} disabled={!options.length}>
      <span className={styles.label} id={`${id}-label`}>{label}</span>
      <span className={styles.value} id={`${id}-value`}>{selected?.label ?? "Nessuna opzione"}</span>
      <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
    </button>
    {open && createPortal(<div ref={menuRef} id={`${id}-options`} role="listbox" aria-label={label} className={styles.menu} style={position} onMouseDown={(event) => event.preventDefault()}>{options.map((option, index) => <div role="option" id={`${id}-option-${index}`} key={option.value} aria-selected={option.value === currentValue} className={`${styles.option} ${index === activeIndex ? styles.highlighted : ""} ${option.value === currentValue ? styles.selected : ""}`} onPointerMove={() => setActiveIndex(index)} onClick={() => choose(option)}><span>{option.label}</span>{option.value === currentValue && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}</div>)}</div>, document.body)}
  </div>;
}
