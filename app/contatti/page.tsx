import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import ContactJourney from "./ContactJourney";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contatti | Queen Tour",
  description:
    "Contatta Queen Tour per hotel, trasferimenti ed escursioni Solo Land a Hurghada e sul Mar Rosso.",
};

const whatsappUrl =
  "https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20ricevere%20una%20proposta%20Solo%20Land%20per%20Hurghada.";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="contact-title">
          <Image src="/images/egypt-hurghada-hero.png" alt="" fill priority sizes="96vw" aria-hidden="true" />
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Parliamo del tuo Egitto</span>
            <h1 id="contact-title">Hurghada è vicina. Iniziamo da una <em>domanda.</em></h1>
            <p>
              Hai già il volo o stai ancora scegliendo le date? Dicci cosa ti serve a terra:
              prepareremo una proposta chiara per hotel, transfer ed escursioni.
            </p>
            <div className={styles.heroActions}>
              <a href="#richiesta">Inizia la richiesta <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">Scrivici su WhatsApp</a>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardTop}>
              <span className={styles.onlineDot} />
              <small>Queen Tour · Aversa</small>
              <span>QT</span>
            </div>
            <p>“Non una risposta generica. Uno specialista che conosce davvero Hurghada.”</p>
            <div className={styles.heroCardBottom}>
              <div className={styles.avatarGroup} aria-hidden="true"><span>Q</span><span>T</span><span>+</span></div>
              <span><strong>Parli con noi</strong>Dall’arrivo in Egitto al rientro</span>
            </div>
          </div>

          <div className={styles.heroTicker} aria-hidden="true">
            <span>HOTEL</span><i />
            <span>TRANSFER</span><i />
            <span>ESCURSIONI</span><i />
            <span>HURGHADA</span>
          </div>
        </section>

        <section className={styles.quickContacts} aria-label="Contatti rapidi">
          <a href="tel:+393296430362">
            <span className={styles.contactIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 10 8l-2 2.3c1.2 2.5 3.1 4.4 5.7 5.7l2.3-2 4.2 2.8-.8 3.2c-.2.8-.9 1.3-1.7 1.3A15 15 0 0 1 2.7 6.3c0-.8.5-1.5 1.3-1.7l3.2-.8Z" /></svg></span>
            <span><small>Chiamaci</small><strong>+39 329 643 0362</strong></span>
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className={styles.contactIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 19.7l1.2-4.1A8 8 0 1 1 20 11.5Z" /><path d="M8.4 7.8c.4 2.9 2.1 4.7 5 5.8" /></svg></span>
            <span><small>WhatsApp</small><strong>Scrivici ora</strong></span>
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=Via+Roma+Aversa+CE" target="_blank" rel="noreferrer">
            <span className={styles.contactIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg></span>
            <span><small>Vieni a trovarci</small><strong>Via Roma, Aversa (CE)</strong></span>
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
          </a>
        </section>

        <ContactJourney />

        <section className={styles.mapSection} aria-labelledby="map-title">
          <div className={styles.mapHeading}>
            <div>
              <span className={styles.eyebrow}>La nostra casa</span>
              <h2 id="map-title">Passa a trovarci.<br />Partiamo da Aversa.</h2>
            </div>
            <div className={styles.mapCopy}>
              <p>Ci trovi in Via Roma, nel cuore di Aversa. Vieni a raccontarci il tuo prossimo viaggio di persona.</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Via+Roma+Aversa+CE" target="_blank" rel="noreferrer">
                Ottieni indicazioni
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
              </a>
            </div>
          </div>
          <div className={styles.mapFrame}>
            <iframe
              src="https://www.google.com/maps?q=Via%20Roma%2C%20Aversa%2C%20CE&output=embed"
              title="Queen Tour, Via Roma ad Aversa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className={styles.mapBadge}>
              <span>QT</span>
              <p><strong>Queen Tour</strong>Via Roma · Aversa</p>
            </div>
          </div>
        </section>

        <section className={styles.finalStrip}>
          <div><span>Hai già il volo?</span><h2>Costruiamo tutto ciò che ti aspetta a terra.</h2></div>
          <Link href="/pacchetti">Esplora Hurghada <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg></Link>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
