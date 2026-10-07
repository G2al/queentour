"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type FormData = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelStyle: string;
  period: string;
  travelers: string;
  budget: string;
  message: string;
  privacy: boolean;
};

const initialData: FormData = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  travelStyle: "",
  period: "",
  travelers: "2",
  budget: "",
  message: "",
  privacy: false,
};

const stepLabels = ["Tu", "Il viaggio", "I dettagli", "Riepilogo"];
const travelStyles = ["Mare e relax", "Avventura", "City break", "Luna di miele"];

export default function ContactJourney() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = <Field extends keyof FormData>(field: Field, value: FormData[Field]) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const canContinue = useMemo(() => {
    if (step === 1) {
      return data.name.trim().length >= 3 && data.email.includes("@") && data.phone.trim().length >= 6;
    }

    if (step === 2) {
      return data.destination.trim().length >= 2 && Boolean(data.travelStyle) && Boolean(data.period);
    }

    if (step === 3) return Boolean(data.travelers && data.budget);
    return data.privacy;
  }, [data, step]);

  const nextStep = () => {
    if (!canContinue) return;
    setStep((current) => Math.min(current + 1, 4));
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue || submitting) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1350);
  };

  const restart = () => {
    setData(initialData);
    setStep(1);
    setSent(false);
  };

  return (
    <section className={styles.formSection} id="richiesta" aria-labelledby="form-title">
      <div className={styles.formIntro}>
        <span className={styles.kickerLight}>Iniziamo da qui</span>
        <h2 id="form-title">Raccontaci il viaggio che hai in mente.</h2>
        <p>
          Bastano pochi dettagli. Li useremo per capire davvero cosa cerchi e costruire una proposta
          che abbia senso per te.
        </p>

        <ol className={styles.formSteps} aria-label={`Passaggio ${step} di 4`}>
          {stepLabels.map((label, index) => {
            const number = index + 1;
            return (
              <li
                className={`${number === step ? styles.currentStep : ""} ${number < step ? styles.completedStep : ""}`}
                key={label}
              >
                <span>{number < step ? "✓" : `0${number}`}</span>
                <div>
                  <small>Passaggio {number}</small>
                  <strong>{label}</strong>
                </div>
              </li>
            );
          })}
        </ol>

        <div className={styles.formPromise}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 5 6v5c0 4.6 2.8 8.2 7 10 4.2-1.8 7-5.4 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p><strong>I tuoi dati restano al sicuro.</strong> Li useremo soltanto per ricontattarti.</p>
        </div>
      </div>

      <div className={styles.formShell}>
        <div className={styles.mobileProgress} aria-hidden="true">
          <span>Step {step} di 4</span>
          <div><i style={{ width: `${step * 25}%` }} /></div>
        </div>

        {sent ? (
          <div className={styles.successState} role="status" aria-live="polite">
            <div className={styles.successMark}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-9" /></svg>
              <span />
              <span />
              <span />
            </div>
            <span className={styles.successEyebrow}>Richiesta ricevuta</span>
            <h3>Grazie, {data.name.split(" ")[0]}!</h3>
            <p>
              Il tuo viaggio ha appena mosso il primo passo. Ti ricontatteremo usando i recapiti che ci hai indicato.
            </p>
            <div className={styles.successSummary}>
              <span>Destinazione</span>
              <strong>{data.destination}</strong>
              <span>Periodo</span>
              <strong>{data.period}</strong>
            </div>
            <button type="button" onClick={restart}>Invia un’altra richiesta</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submitRequest} noValidate>
            {step === 1 && (
              <fieldset className={styles.formPanel} key="identity">
                <legend>
                  <span>Prima conosciamoci</span>
                  <strong>Come possiamo chiamarti?</strong>
                </legend>
                <label className={styles.fieldWide}>
                  <span>Nome e cognome *</span>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="Es. Giulia Romano"
                    autoComplete="name"
                    required
                  />
                </label>
                <div className={styles.fieldRow}>
                  <label>
                    <span>Email *</span>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="nome@email.it"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label>
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
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className={styles.formPanel} key="dream">
                <legend>
                  <span>Il tuo prossimo viaggio</span>
                  <strong>Dove vuoi sentirti altrove?</strong>
                </legend>
                <label className={styles.fieldWide}>
                  <span>Destinazione desiderata *</span>
                  <input
                    type="text"
                    value={data.destination}
                    onChange={(event) => update("destination", event.target.value)}
                    placeholder="Una meta precisa oppure: sorprendetemi"
                    required
                  />
                </label>
                <div className={styles.choiceGroup}>
                  <span>Che tipo di esperienza immagini? *</span>
                  <div>
                    {travelStyles.map((style) => (
                      <button
                        className={data.travelStyle === style ? styles.choiceActive : ""}
                        type="button"
                        key={style}
                        onClick={() => update("travelStyle", style)}
                        aria-pressed={data.travelStyle === style}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                <label className={styles.fieldWide}>
                  <span>Quando vorresti partire? *</span>
                  <input
                    type="month"
                    value={data.period}
                    onChange={(event) => update("period", event.target.value)}
                    required
                  />
                </label>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className={styles.formPanel} key="details">
                <legend>
                  <span>Quasi fatto</span>
                  <strong>I dettagli che fanno la differenza.</strong>
                </legend>
                <div className={styles.fieldRow}>
                  <label>
                    <span>Numero di viaggiatori *</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={data.travelers}
                      onChange={(event) => update("travelers", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span>Budget indicativo *</span>
                    <select value={data.budget} onChange={(event) => update("budget", event.target.value)} required>
                      <option value="">Seleziona una fascia</option>
                      <option>Fino a €1.500</option>
                      <option>€1.500 – €3.000</option>
                      <option>€3.000 – €5.000</option>
                      <option>Oltre €5.000</option>
                      <option>Da definire insieme</option>
                    </select>
                  </label>
                </div>
                <label className={styles.fieldWide}>
                  <span>C’è altro che dovremmo sapere?</span>
                  <textarea
                    value={data.message}
                    onChange={(event) => update("message", event.target.value)}
                    placeholder="Aeroporto di partenza, occasioni speciali, esigenze o desideri..."
                    rows={5}
                  />
                </label>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset className={styles.formPanel} key="summary">
                <legend>
                  <span>Ultimo controllo</span>
                  <strong>Il tuo viaggio, in breve.</strong>
                </legend>
                <dl className={styles.requestSummary}>
                  <div><dt>Viaggiatore</dt><dd>{data.name}</dd></div>
                  <div><dt>Contatti</dt><dd>{data.email}<br />{data.phone}</dd></div>
                  <div><dt>Destinazione</dt><dd>{data.destination}</dd></div>
                  <div><dt>Esperienza</dt><dd>{data.travelStyle}</dd></div>
                  <div><dt>Periodo</dt><dd>{data.period}</dd></div>
                  <div><dt>Persone e budget</dt><dd>{data.travelers} · {data.budget}</dd></div>
                </dl>
                {data.message && <p className={styles.summaryMessage}>“{data.message}”</p>}
                <label className={styles.privacyCheck}>
                  <input
                    type="checkbox"
                    checked={data.privacy}
                    onChange={(event) => update("privacy", event.target.checked)}
                  />
                  <span>Acconsento al trattamento dei dati per ricevere risposta alla mia richiesta. *</span>
                </label>
              </fieldset>
            )}

            <div className={styles.formActions}>
              {step > 1 && (
                <button className={styles.backButton} type="button" onClick={() => setStep((current) => current - 1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m5 5-5-5 5-5" /></svg>
                  Indietro
                </button>
              )}
              {step < 4 ? (
                <button className={styles.nextButton} type="button" onClick={nextStep} disabled={!canContinue}>
                  Continua
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
                </button>
              ) : (
                <button className={styles.submitButton} type="submit" disabled={!canContinue || submitting}>
                  {submitting ? <><i /> Invio in corso...</> : <>Invia la richiesta <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg></>}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
