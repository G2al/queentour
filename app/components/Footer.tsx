import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const whatsappUrl =
  "https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20ricevere%20maggiori%20informazioni.";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contatti">
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink} aria-label="Queen Tour - Home">
            <Image
              className={styles.logo}
              src="/images/logo-qeentour-primary.png"
              alt="Queen Tour"
              width={1858}
              height={568}
            />
          </Link>
          <p>
            Il tuo viaggio, la nostra passione.<br />
            Esperienze su misura da Aversa al mondo.
          </p>

          <div className={styles.socials} aria-label="Social Queen Tour">
            <span aria-label="X" role="img">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 4 14 16M19 4 5 20" />
              </svg>
            </span>
            <span className={styles.facebook} aria-label="Facebook" role="img">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />
              </svg>
            </span>
            <span aria-label="Instagram" role="img">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle className={styles.dot} cx="17.2" cy="6.9" r="1" />
              </svg>
            </span>
            <span aria-label="TikTok" role="img">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 4v10.5a4 4 0 1 1-3-3.9M14 4c.5 3 2.2 4.7 5 5" />
              </svg>
            </span>
          </div>
        </div>

        <nav className={styles.column} aria-label="Azienda">
          <h2>Azienda</h2>
          <Link href="/chi-siamo">Chi siamo</Link>
          <Link href="/pacchetti">Pacchetti</Link>
          <Link href="/#recensioni">Recensioni</Link>
          <Link href="/contatti">Contatti</Link>
        </nav>

        <nav className={styles.column} aria-label="Risorse">
          <h2>Risorse</h2>
          <Link href="/chi-siamo#metodo">Viaggi su misura</Link>
          <Link href="/chi-siamo#valori">Assistenza dedicata</Link>
          <Link href="/pacchetti">Destinazioni</Link>
          <Link href="/#come-funziona">Come prenotare</Link>
        </nav>

        <div className={styles.column}>
          <h2>Link utili</h2>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">Assistenza WhatsApp</a>
          <a href="tel:+393296430362">+39 329 643 0362</a>
          <span>Termini e condizioni</span>
          <span>Privacy policy</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Queen Tour. Tutti i diritti riservati.</p>
        <span>Via Roma, Aversa (CE)</span>
      </div>
    </footer>
  );
}
