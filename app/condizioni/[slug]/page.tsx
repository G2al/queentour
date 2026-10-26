import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ApiError, apiRequest } from "@/lib/api";
import { getAgencyToken } from "@/lib/session";
import type { LegalPage } from "@/lib/booking-types";
import { italianDate } from "@/lib/format";
import styles from "@/app/components/booking/booking.module.css";
export const metadata: Metadata = { title: "Condizioni di viaggio | Queen Tour" };
export default async function Page({ params }: PageProps<"/condizioni/[slug]">) {
  const { slug } = await params;
  let page: LegalPage;
  try { page = (await apiRequest<{ data: LegalPage }>(`/legal-pages/${encodeURIComponent(slug)}`, { token: await getAgencyToken(), cache: "no-store" })).data; }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  const content = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:"><style>body{font:16px/1.8 Arial,sans-serif;color:#294656;padding:18px;margin:0}h1,h2,h3{line-height:1.25;color:#18334d}a{color:#075e94}table{border-collapse:collapse;max-width:100%}td,th{border:1px solid #dae8f0;padding:8px}img{max-width:100%}</style></head><body>${page.content}</body></html>`;
  return <><Header /><main className={styles.page}><section className={styles.hero}><h1>{page.title}</h1><p>Aggiornato il {italianDate(page.updatedAt)}</p></section><section className={styles.panel}><iframe title={page.title} sandbox="" srcDoc={content} style={{ width: "100%", height: "70vh", border: 0 }} /></section></main><Footer /></>;
}
