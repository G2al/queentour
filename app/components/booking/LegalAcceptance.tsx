"use client";
import Link from "next/link";
import type { LegalPage } from "@/lib/booking-types";
import styles from "./booking.module.css";

export default function LegalAcceptance({ pages, accepted, onChange }: { pages: LegalPage[]; accepted: string[]; onChange: (values: string[]) => void }) {
  return <div><h3>Condizioni di viaggio</h3>{pages.filter((page) => page.requiresAcceptance).map((page) => { const key = `${page.id}:${page.updatedAt}`; return <label className={styles.check} key={key}><input type="checkbox" checked={accepted.includes(key)} onChange={(event) => onChange(event.target.checked ? [...accepted, key] : accepted.filter((value) => value !== key))} /><span>Ho letto e accetto <Link href={`/condizioni/${page.slug}`} target="_blank">{page.title}</Link>.</span></label>; })}<p className={styles.muted}>L’accettazione è necessaria per bloccare in opzione o confermare.</p></div>;
}
