"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import ContactModal from "./ContactModal";
import styles from "./Header.module.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Pacchetti", href: "/pacchetti" },
  { label: "Chi siamo", href: "/#chi-siamo" },
  { label: "Contatti", href: "/#contatti" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const openContactModal = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(true);
  }, []);

  const closeContactModal = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
        <Link className={styles.logoLink} href="/" aria-label="Queen Tour - Home">
          <Image
            className={styles.logo}
            src="/images/logo-qeentour-primary.png"
            alt="Queen Tour"
            width={1858}
            height={568}
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navigazione principale">
          {navigation.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : item.href === "/pacchetti" && pathname.startsWith("/pacchetti");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className={styles.contactButton}
          type="button"
          onClick={openContactModal}
          aria-label="Apri il modulo di contatto Queen Tour"
        >
          <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
            <path d="M8 9h8M8 13h5" />
          </svg>
          <span>Contattaci</span>
        </button>

        <div className={styles.mobileMenu}>
          <button
            className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
            id="mobile-navigation"
            aria-label="Navigazione mobile"
            aria-hidden={!menuOpen}
          >
            {navigation.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : item.href === "/pacchetti" && pathname.startsWith("/pacchetti");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              className={styles.mobileContact}
              type="button"
              onClick={openContactModal}
              tabIndex={menuOpen ? 0 : -1}
            >
              <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <span>Contattaci</span>
            </button>
          </nav>
        </div>
        </div>
      </header>
      <ContactModal isOpen={contactOpen} onClose={closeContactModal} />
    </>
  );
}
