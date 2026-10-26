import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const base = process.env.TEST_FRONTEND_URL || "http://localhost:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Usare soltanto il frontend locale.");
const target = await (await fetch("http://localhost:9224/json/new?about:blank", { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
const pending = new Map();
const browserErrors = [];
const run = `FRONTEND-BROWSER-${Date.now()}`;
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const request = pending.get(message.id); if (!request) return; pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error))); else request.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
};
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); } }, 30000).unref();
});
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function wait(expression, label) {
  const start = Date.now();
  while (Date.now() - start < 30000) { if (await evaluate(expression)) return; await new Promise((resolve) => setTimeout(resolve, 150)); }
  throw new Error(`Attesa scaduta: ${label}\n${await evaluate("document.body.innerText.slice(-3500)")}`);
}
async function go(path) { await call("Page.navigate", { url: base + path }); await wait("document.readyState === 'complete'", path); }
async function click(text) {
  const clicked = await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().startsWith(${JSON.stringify(text)}));if(!b||b.disabled)return false;b.click();return true})()`);
  assert.ok(clicked, `Pulsante non disponibile: ${text}`);
}
async function fill(selector, value, index = 0) {
  await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!e)throw Error('Campo mancante');const proto=e instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
}
async function choosePerson(index, label) {
  await evaluate(`(()=>{const buttons=[...document.querySelectorAll('button[role=combobox]')].filter(e=>e.textContent.includes('Viaggiatore'));buttons[${index}].click()})()`);
  await evaluate(`(()=>{const option=[...document.querySelectorAll('[role=option]')].find(e=>e.textContent.startsWith(${JSON.stringify(label)}));if(!option)throw Error('Opzione mancante');option.click()})()`);
}
function pass(text) { console.log(`PASS ${text}`); }
try {
  await call("Page.enable"); await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await go("/carrello");
  await evaluate("localStorage.removeItem('queentour-cart-v2')");
  await call("Page.reload");
  await wait("document.body.innerText.includes('Il tuo viaggio inizia qui.')", "carrello vuoto");
  const product = (await (await fetch(`${base}/api/travel/packages/hurghada-all-inclusive`)).json()).data;
  const flight = product.flights.find((value) => value.seatsAvailable >= 2);
  await go("/pacchetti/hurghada-all-inclusive");
  await wait("[...document.querySelectorAll('button')].some(e=>e.textContent.includes('Aggiungi camera')&&Object.keys(e).some(k=>k.startsWith('__reactProps')))", "configuratore idratato");
  await click("+ Aggiungi camera");
  await click("+ Persona");
  await fill('input[type="date"]', flight.outboundDate, 0);
  await fill('input[type="date"]', flight.returnDate, 1);
  await fill('input[type="date"]', "1985-03-10", 2);
  await fill('input[type="date"]', "1987-07-22", 3);
  await wait("document.body.innerText.includes('Totale indicativo')", "preventivo soggiorno");
  await click("Aggiungi al carrello");
  await wait("JSON.parse(localStorage.getItem('queentour-cart-v2')).entries.length===1", "salvataggio soggiorno");
  pass("configuratore soggiorno: date, camera, due adulti, preventivo e aggiunta");
  await go("/pacchetti/orange-bay-in-barca");
  await wait("[...document.querySelectorAll('button')].some(e=>e.textContent.includes('Aggiungi persona')&&Object.keys(e).some(k=>k.startsWith('__reactProps')))", "configuratore escursione");
  await click("+ Aggiungi persona"); await click("+ Aggiungi persona");
  await fill('input[type="date"]', flight.outboundDate, 0);
  await choosePerson(0, "Viaggiatore 1"); await choosePerson(1, "Viaggiatore 2");
  await wait("document.body.innerText.includes('Totale indicativo')", "preventivo escursione");
  await click("Aggiungi al carrello");
  await wait("JSON.parse(localStorage.getItem('queentour-cart-v2')).entries.length===2", "salvataggio escursione");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('queentour-cart-v2')).passengers.length"), 2);
  pass("riuso esplicito dei viaggiatori per escursione, nessun duplicato");
  await go("/carrello");
  await wait("document.body.innerText.includes('Acconto alla conferma')", "totali carrello");
  assert.ok(await evaluate("document.body.innerText.includes('Orange Bay') && document.body.innerText.includes('Hurghada All Inclusive')"));
  await call("Page.reload"); await wait("document.body.innerText.includes('Acconto alla conferma')", "persistenza dopo refresh");
  pass("carrello multiprodotto e persistenza dopo ricarica");
  await click("Continua con i dati");
  await wait("document.body.innerText.includes('Il referente della pratica')", "checkout");
  assert.ok(await evaluate("[...document.querySelectorAll('a')].some(e=>e.href.includes('/condizioni/'))"));
  assert.ok(await evaluate("[...document.querySelectorAll('button')].some(e=>e.textContent.includes('per 6 ore'))"));
  pass("checkout: anagrafiche, condizioni e durata opzione da settings");
  await evaluate(`(()=>{window.__realQuoteFetch=window.fetch;window.fetch=async(...args)=>{const response=await window.__realQuoteFetch(...args);if(typeof args[0]==='string'&&args[0].includes('/cart/quote')&&response.ok){const result=await response.clone().json();result.data.available=false;result.data.availabilityProblems={'items.0.rooms.0':'Camera di prova non disponibile'};return new Response(JSON.stringify(result),{status:200,headers:{'Content-Type':'application/json'}})}return response}})()`);
  await fill('#booking-checkout input[type="date"]', "1985-03-11", 0);
  await wait("document.body.innerText.includes('Camera di prova non disponibile')", "indisponibilità simulata");
  assert.ok(await evaluate("[...document.querySelectorAll('button')].filter(e=>e.name==='action'&&e.value!=='quote').every(e=>e.disabled)"));
  assert.ok(await evaluate("!document.querySelector('button[name=action][value=quote]').disabled"));
  await evaluate("window.fetch=window.__realQuoteFetch");
  await fill('#booking-checkout input[type="date"]', "1985-03-10", 0);
  await wait("!document.body.innerText.includes('Camera di prova non disponibile') && !document.querySelector('button[name=action][value=option]').disabled", "ripristino preventivo reale");
  pass("indisponibilità simulata: preventivo consentito, opzione e conferma bloccate");
  await fill('#booking-checkout > section:first-of-type input', "Frontend", 0);
  await fill('#booking-checkout > section:first-of-type input', "Browser", 1);
  await fill('#booking-checkout > section:first-of-type input', "frontend-browser@example.test", 2);
  await fill('#booking-checkout > section:first-of-type input', "+390000000000", 3);
  await evaluate(`(()=>{const e=document.querySelector('#booking-checkout textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(run)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await click("Richiedi preventivo");
  await wait("location.pathname.startsWith('/pratica/') && document.body.innerText.includes('Conserva il tuo link personale')", "creazione preventivo dal checkout");
  assert.equal(await evaluate("JSON.parse(localStorage.getItem('queentour-cart-v2')).entries.length"), 0);
  assert.ok(await evaluate("document.querySelector('input[aria-label=\"Link personale della pratica\"]').value.includes('token=')"));
  pass("checkout reale → pagina pratica, link personale e carrello svuotato");
  await click("Annulla pratica"); await click("Sì, annulla la pratica");
  await wait("document.body.innerText.includes('Annullata')", "annullamento pratica dal browser");
  pass("annullamento con conferma esplicita dal browser");
  await go("/area-agenzie/accedi");
  await wait("document.querySelector('input[name=email]') && Object.keys(document.querySelector('input[name=email]')).some(k=>k.startsWith('__reactProps'))", "login idratato");
  await fill('input[name=email]', "agenzia@tourflow.test"); await fill('input[name=password]', "password"); await click("Accedi all’area agenzie");
  await wait("location.pathname==='/pacchetti' && document.body.innerText.includes('Vedi la tua fee')", "prezzi agenzia");
  await go("/area-agenzie/pratiche"); await wait("document.body.innerText.includes('Le mie pratiche')", "elenco pratiche");
  await go("/area-agenzie/profilo"); await wait("document.body.innerText.includes('Fee riservata alla tua agenzia')", "profilo fee");
  assert.ok(await evaluate("[...document.querySelectorAll('input[readonly]')].some(e=>e.value.includes('%'))"));
  pass("browser agenzia: login, fee riservata, pratiche e profilo sola lettura");
  await evaluate("fetch('/api/auth/logout',{method:'POST'})");
  // Carrello dimostrativo per la verifica del layout mobile, senza creare pratiche.
  await evaluate(`localStorage.setItem('queentour-cart-v2',JSON.stringify({passengers:[{birth_date:'1985-03-10'},{birth_date:'1987-07-22'}],entries:[{key:'layout-check',product:${JSON.stringify(product)},item:{package_id:${product.id},mode:'hotel_only',check_in:${JSON.stringify(flight.outboundDate)},check_out:${JSON.stringify(flight.returnDate)},rooms:[{room_type_id:${product.hotel.roomTypes[0].id},passengers:[0,1]}]}}],insurance_ids:[],price_lock:false}))`);
  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await go("/carrello"); await wait("document.body.innerText.includes('Acconto alla conferma')", "carrello mobile");
  assert.ok(await evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Overflow orizzontale mobile");
  assert.ok(await evaluate("[...document.querySelectorAll('a[aria-label^=\"Carrello\"]')].some(e=>e.getBoundingClientRect().width>0)"));
  const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const screenshotPath = join(tmpdir(), "queentour-cart-mobile.png"); writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
  pass(`mobile 390px: carrello visibile senza overflow; screenshot ${screenshotPath}`);
  assert.deepEqual(browserErrors, [], `Eccezioni browser: ${browserErrors.join("\n")}`);
  pass("nessuna eccezione JavaScript nel browser");
} finally {
  execFileSync("php", ["artisan", "tinker", String.raw`--execute=App\Models\Booking::where('notes', '${run}')->delete();`], { cwd: process.env.TEST_BACKEND_PATH || "C:/Users/giomm/Desktop/project/tourflow", stdio: "pipe" });
  console.log("CLEANUP pratiche di questa verifica browser eliminate.");
  await call("Page.close").catch(() => {}); socket.close();
}
