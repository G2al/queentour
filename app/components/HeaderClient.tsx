"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ContactModal from "./ContactModal";
import styles from "./Header.module.css";
import CartLink from "./booking/CartLink";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Egitto", href: "/pacchetti" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Contatti", href: "/contatti" },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function HeaderClient({ agencyName, clearInvalidSession }: { agencyName: string | null; clearInvalidSession: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const openContactModal = useCallback(() => { setMenuOpen(false); setContactOpen(true); }, []);

  useEffect(() => {
    if (!clearInvalidSession) return;
    fetch("/api/auth/logout", { method: "POST" }).finally(() => router.refresh());
  }, [clearInvalidSession, router]);

  useEffect(() => {
    const refresh = () => router.refresh();
    window.addEventListener("agency-session-expired", refresh);
    return () => window.removeEventListener("agency-session-expired", refresh);
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { setMenuOpen(false); router.push("/"); router.refresh(); setLoggingOut(false); }
  };

  const mainLinks = navigation.map((item) => {
    const active = isActiveRoute(pathname, item.href);
    return <Link key={item.label} href={item.href} className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`} aria-current={active ? "page" : undefined}>{item.label}</Link>;
  });

  return <>
    <header className={styles.header}><div className={styles.inner}>
      <Link className={styles.logoLink} href="/" aria-label="Queen Tour - Home"><Image className={styles.logo} src="/images/logo-queentour-new.png" alt="Queen Tour" width={2172} height={724} sizes="(max-width: 850px) 205px, 265px" priority /></Link>
      <nav className={styles.desktopNav} aria-label="Navigazione principale">{mainLinks}</nav>
      <div className={styles.headerActions}>
        <CartLink />
        {agencyName ? <div className={styles.agencyMenu}><Link href="/area-agenzie/profilo" className={styles.agencyLink}><span>{agencyName}</span><small>Profilo agenzia</small></Link><button type="button" onClick={logout} disabled={loggingOut} aria-label="Esci dall'area agenzie"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></svg></button></div> : <Link className={styles.areaLink} href="/area-agenzie/accedi">Area agenzie</Link>}
        {agencyName && <Link href="/area-agenzie/pratiche" className={styles.areaLink}>Le mie pratiche</Link>}
        <button className={styles.contactButton} type="button" onClick={openContactModal} aria-label="Apri il modulo di contatto Queen Tour"><svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /><path d="M8 9h8M8 13h5" /></svg><span>Contattaci</span></button>
      </div>
      <div className={styles.mobileMenu}>
        <CartLink />
        <button className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation"><span /><span /><span /></button>
        <nav className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`} id="mobile-navigation" aria-label="Navigazione mobile" aria-hidden={!menuOpen}>
          {navigation.map((item) => { const active = isActiveRoute(pathname, item.href); return <Link key={item.label} href={item.href} className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ""}`} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} aria-current={active ? "page" : undefined}>{item.label}</Link>; })}
          {agencyName && <Link href="/area-agenzie/pratiche" className={styles.mobileLink} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>Le mie pratiche</Link>}
          {agencyName ? <><Link href="/area-agenzie/profilo" className={styles.mobileAgency} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}><strong>{agencyName}</strong><span>Gestisci il profilo</span></Link><button className={styles.mobileLogout} type="button" onClick={logout} disabled={loggingOut} tabIndex={menuOpen ? 0 : -1}>Esci dall’area agenzie</button></> : <Link href="/area-agenzie/accedi" className={styles.mobileArea} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Area agenzie</Link>}
          <button className={styles.mobileContact} type="button" onClick={openContactModal} tabIndex={menuOpen ? 0 : -1}><svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /><path d="M8 9h8M8 13h5" /></svg><span>Contattaci</span></button>
        </nav>
      </div>
    </div></header>
    <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
  </>;
}
