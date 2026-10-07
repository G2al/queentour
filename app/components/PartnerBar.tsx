import Image from "next/image";
import styles from "./PartnerBar.module.css";

const partners = [
  { name: "Airbnb", src: "/images/airbnb.svg", width: 320, height: 100 },
  { name: "Booking.com", src: "/images/booking.svg", width: 500, height: 83 },
  { name: "Trivago", src: "/images/trivago.svg", width: 80, height: 24 },
  { name: "Expedia", src: "/images/expedia.svg", width: 1017, height: 288 },
];

export default function PartnerBar() {
  return (
    <section className={styles.bar} aria-label="Social e partner Queen Tour">
      <div className={styles.followBox}>
        <span className={styles.followLabel}>Seguici</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 10 4 4 4-4" />
        </svg>

        <span className={styles.separator} />

        <button className={styles.socialButton} type="button" aria-label="Queen Tour su X">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.3 2H22l-8.1 9.2L23.4 22H16l-5.8-7.6L3.6 22H0l8.5-9.7L-.6 2H7l5.2 6.9L18.3 2Zm-1.3 18.1h2L5.9 3.8H3.8L17 20.1Z" />
          </svg>
        </button>
        <button
          className={`${styles.socialButton} ${styles.facebook}`}
          type="button"
          aria-label="Queen Tour su Facebook"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 8.5V6.8c0-.8.5-1 1-1h2.8V2.1L14.6 2C11.3 2 10 4 10 6.5v2H7v4h3V22h4v-9.5h3.3l.5-4H14Z" />
          </svg>
        </button>
        <button className={styles.socialButton} type="button" aria-label="Queen Tour su Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className={styles.socialFill} />
          </svg>
        </button>
        <button className={styles.socialButton} type="button" aria-label="Queen Tour su TikTok">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.8 3c.4 2.3 1.7 3.7 4.2 3.9v3.2a8.5 8.5 0 0 1-4.2-1.3v6.4a6.2 6.2 0 1 1-5.3-6.1v3.2a3 3 0 1 0 2.1 2.9V3h3.2Z" />
          </svg>
        </button>
      </div>

      <div className={styles.partners}>
        <div className={styles.partnerTrack}>
          {[0, 1, 2].map((copyIndex) => (
            <div
              className={styles.partnerGroup}
              aria-hidden={copyIndex === 0 ? undefined : true}
              key={copyIndex}
            >
              {partners.map((partner) => (
                <div className={styles.partner} key={`${copyIndex}-${partner.name}`}>
                  <Image
                    src={partner.src}
                    alt={copyIndex === 0 ? partner.name : ""}
                    width={partner.width}
                    height={partner.height}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
