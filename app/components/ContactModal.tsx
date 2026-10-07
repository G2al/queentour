"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ContactModal.module.css";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialData = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  period: "",
  travelers: "2",
  message: "",
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeModal = useCallback(() => {
    setStep(1);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeModal, isOpen]);

  if (!isOpen) return null;

  const update = (field: keyof typeof data, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const firstStepValid = data.name.trim().length > 2 && data.phone.trim().length > 5;
  const secondStepValid = Boolean(data.destination && data.period && data.travelers);

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const whatsappMessage = [
      "Ciao Queen Tour, vorrei richiedere informazioni per un viaggio.",
      "",
      `Nome: ${data.name}`,
      `Telefono: ${data.phone}`,
      data.email ? `Email: ${data.email}` : "",
      `Destinazione: ${data.destination}`,
      `Periodo: ${data.period}`,
      `Viaggiatori: ${data.travelers}`,
      data.message ? `Richieste: ${data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/393296430362?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return createPortal(
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          className={styles.close}
          type="button"
          onClick={closeModal}
          ref={closeRef}
          aria-label="Chiudi il modulo di contatto"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className={styles.intro}>
          <span className={styles.eyebrow}>Organizza il tuo viaggio</span>
          <h2 id="contact-modal-title">Partiamo insieme.</h2>
          <p>Raccontaci cosa desideri: prepareremo la proposta più adatta a te.</p>

          <div className={styles.steps} aria-label={`Passaggio ${step} di 3`}>
            {[1, 2, 3].map((item) => (
              <span
                className={`${styles.step} ${item <= step ? styles.stepActive : ""}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <form className={styles.form} onSubmit={submitRequest}>
          {step === 1 && (
            <div className={styles.panel} key="personal-data">
              <div className={styles.panelHeading}>
                <span>Step 01</span>
                <h3>Come possiamo ricontattarti?</h3>
              </div>

              <label className={styles.field}>
                <span>Nome e cognome *</span>
                <input
                  type="text"
                  value={data.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Mario Rossi"
                  autoComplete="name"
                  required
                />
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Telefono *</span>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="329 000 0000"
                    autoComplete="tel"
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="nome@email.it"
                    autoComplete="email"
                  />
                </label>
              </div>

              <button
                className={styles.nextButton}
                type="button"
                disabled={!firstStepValid}
                onClick={() => setStep(2)}
              >
                Continua
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.panel} key="travel-data">
              <div className={styles.panelHeading}>
                <span>Step 02</span>
                <h3>Che viaggio stai immaginando?</h3>
              </div>

              <label className={styles.field}>
                <span>Destinazione *</span>
                <select
                  value={data.destination}
                  onChange={(event) => update("destination", event.target.value)}
                  required
                >
                  <option value="">Scegli una destinazione</option>
                  <option>Thailandia</option>
                  <option>New York</option>
                  <option>Sharm El Sheikh</option>
                  <option>Messico</option>
                  <option>Dubai</option>
                  <option>Maldive</option>
                  <option>Altra destinazione</option>
                </select>
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Periodo indicativo *</span>
                  <input
                    type="month"
                    value={data.period}
                    onChange={(event) => update("period", event.target.value)}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>Viaggiatori *</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={data.travelers}
                    onChange={(event) => update("travelers", event.target.value)}
                    required
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Richieste particolari</span>
                <textarea
                  value={data.message}
                  onChange={(event) => update("message", event.target.value)}
                  placeholder="Budget, aeroporto di partenza, esigenze particolari..."
                  rows={3}
                />
              </label>

              <div className={styles.actions}>
                <button className={styles.backButton} type="button" onClick={() => setStep(1)}>
                  Indietro
                </button>
                <button
                  className={styles.nextButton}
                  type="button"
                  disabled={!secondStepValid}
                  onClick={() => setStep(3)}
                >
                  Riepilogo
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M14 7l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.panel} key="summary">
              <div className={styles.panelHeading}>
                <span>Step 03</span>
                <h3>Controlla la tua richiesta.</h3>
              </div>

              <dl className={styles.summary}>
                <div>
                  <dt>Cliente</dt>
                  <dd>{data.name}</dd>
                </div>
                <div>
                  <dt>Contatto</dt>
                  <dd>{data.phone}</dd>
                </div>
                <div>
                  <dt>Destinazione</dt>
                  <dd>{data.destination}</dd>
                </div>
                <div>
                  <dt>Periodo</dt>
                  <dd>{data.period}</dd>
                </div>
                <div>
                  <dt>Viaggiatori</dt>
                  <dd>{data.travelers}</dd>
                </div>
              </dl>

              {data.message && <p className={styles.requestNote}>{data.message}</p>}

              <div className={styles.actions}>
                <button className={styles.backButton} type="button" onClick={() => setStep(2)}>
                  Modifica
                </button>
                <button className={styles.submitButton} type="submit">
                  Invia richiesta
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M14 7l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>,
    document.body,
  );
}
