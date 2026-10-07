import Image from "next/image";
import styles from "./FloatingWhatsApp.module.css";

const whatsappUrl =
  "https://wa.me/393296430362?text=Ciao%20Queen%20Tour%2C%20vorrei%20ricevere%20maggiori%20informazioni.";

export default function FloatingWhatsApp() {
  return (
    <a
      className={styles.floating}
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Scrivi a Queen Tour su WhatsApp"
    >
      <span>Scrivici su WhatsApp</span>
      <Image src="/images/whatsapp.webp" alt="" width={1024} height={1024} />
    </a>
  );
}
