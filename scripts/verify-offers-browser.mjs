import assert from "node:assert/strict";

const base = process.env.TEST_FRONTEND_URL || "http://localhost:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Usare soltanto il frontend locale.");
const target = await (await fetch("http://localhost:9224/json/new?about:blank", { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
const pending = new Map();
const browserErrors = [];
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
  while (Date.now() - start < 30000) { if (await evaluate(`!!(${expression})`)) return; await new Promise((resolve) => setTimeout(resolve, 150)); }
  throw new Error(`Attesa scaduta: ${label}\n${await evaluate("document.body.innerText.slice(-3500)")}`);
}
async function go(path) { await call("Page.navigate", { url: base + path }); await wait("document.readyState === 'complete'", path); }
async function click(text) {
  const clicked = await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().startsWith(${JSON.stringify(text)}));if(!b||b.disabled)return false;b.click();return true})()`);
  assert.ok(clicked, `Pulsante non disponibile: ${text}`);
}
function pass(text) { console.log(`PASS ${text}`); }
try {
  await call("Page.enable"); await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  const products = (await (await fetch(`${base}/api/packages?per_page=100`)).json()).data;
  await go("/");
  await wait("document.querySelector('input[type=radio][value=full_package]')", "ricerca offerte homepage");
  assert.ok(await evaluate("[...document.querySelectorAll('fieldset label')].some(e=>e.textContent==='Pacchetto completo')"));
  pass("homepage: etichette e chiavi offerte dal backend");
  await go("/pacchetti?type=full_package&airport=NAP");
  await wait("document.querySelector('button[aria-label=Tipologia]') || [...document.querySelectorAll('button[role=combobox]')].some(e=>e.textContent.includes('Pacchetto completo'))", "filtri iniziali");
  await wait("[...document.querySelectorAll('button[role=combobox]')].some(e=>e.textContent.includes('Napoli (NAP)'))", "aeroporto iniziale");
  assert.ok(await evaluate("[...document.querySelectorAll('#catalogo article')].every(e=>e.textContent.includes('Pacchetto completo'))"), JSON.stringify(await evaluate("[...document.querySelectorAll('#catalogo article')].map(e=>e.innerText)")));
  await evaluate("[...document.querySelectorAll('button[role=combobox]')].find(e=>e.firstElementChild?.textContent==='Partenza da').click()");
  await evaluate("[...document.querySelectorAll('[role=option]')].find(e=>e.innerText.includes('Roma')).click()");
  await wait("[...document.querySelectorAll('button[role=combobox]')].some(e=>e.textContent.includes('Roma (FCO)'))", "filtro aeroporto interattivo");
  pass("catalogo: tipo stabile e aeroporto da URL e filtro interattivo");
  for (const key of ["hotel_only", "full_package", "excursion", "transfer"]) {
    const p = products.find(p=>p.typeKey===key);
    assert.ok(p, `Nessun prodotto locale ${key}`);
    await go(`/pacchetti/${p.slug}`);
    await wait("document.body.innerText.includes('Configura la proposta') && [...document.querySelectorAll('button')].some(e=>Object.keys(e).some(k=>k.startsWith('__reactProps')))", "configuratore idratato");
    if (key==='full_package') {
      assert.equal(await evaluate("document.querySelectorAll('input[type=date]').length"),0);
      assert.ok(await evaluate("document.body.innerText.includes('Volo incluso') && document.body.innerText.includes('Transfer incluso')"));
      await evaluate("[...document.querySelectorAll('button[role=combobox]')].find(e=>e.firstElementChild?.textContent==='Aeroporto').click()");
      assert.ok(await evaluate("document.querySelectorAll('[role=option]').length>1"));
    } else if (key==='hotel_only') {
      assert.equal(await evaluate("document.querySelectorAll('input[type=date]').length"),2);
      assert.ok(await evaluate("document.body.innerText.includes('(volo escluso)')"));
      await evaluate("[...document.querySelectorAll('button[role=combobox]')].find(e=>e.firstElementChild?.textContent==='Modalità').click()");
      await evaluate("[...document.querySelectorAll('[role=option]')].find(e=>e.innerText==='Con volo').click()");
      assert.equal(await evaluate("document.querySelectorAll('input[type=date]').length"),0);
      assert.ok(await evaluate("[...document.querySelectorAll('button[role=combobox]')].some(e=>e.firstElementChild?.textContent==='Aeroporto')"));
    } else {
      assert.equal(await evaluate("document.querySelectorAll('input[type=date]').length"),1);
      assert.ok(await evaluate("document.body.innerText.includes('Data del servizio') && !document.body.innerText.includes('Aggiungi camera')"));
      if (key==='transfer') assert.ok(await evaluate("document.body.innerText.includes('unico per il gruppo') && document.body.innerText.includes('a servizio')"));
    }
    pass(`configuratore reale ${key}`);
  }
  // Fixture nel solo browser: il catalogo locale non contiene un'offerta flight_hotel autonoma.
  const full = products.find(product=>product.typeKey==='full_package');
  const fixture = (await (await fetch(`${base}/api/travel/packages/${full.slug}`)).json()).data;
  fixture.typeKey='flight_hotel'; fixture.type='Volo + hotel'; fixture.transferIncluded=false;
  await go('/carrello');
  await evaluate(`localStorage.setItem('queentour-cart-v2',JSON.stringify({passengers:[{birth_date:'1985-03-10'}],entries:[{key:'offer-fixture',product:${JSON.stringify(fixture)},item:{package_id:${fixture.id},mode:'flight_hotel',flight_id:${fixture.flights[0].id},rooms:[{room_type_id:${fixture.hotel.roomTypes[0].id},passengers:[0]}]}}],insurance_ids:[],price_lock:false}))`);
  await go('/carrello');
  await wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='Modifica' && Object.keys(e).some(k=>k.startsWith('__reactProps')))", 'carrello fixture');
  await evaluate(`window.__realFetch=window.fetch;window.__offerFixture=${JSON.stringify(fixture)};window.fetch=(input,init)=>String(input).includes('/api/travel/packages/')?Promise.resolve(new Response(JSON.stringify({data:window.__offerFixture}),{headers:{'Content-Type':'application/json'}})):window.__realFetch(input,init)`);
  await click('Modifica');
  await wait("document.body.innerText.includes('Configura la proposta')", 'fixture volo + hotel');
  assert.equal(await evaluate("document.querySelectorAll('input[type=date]').length"),1); // Solo la nascita, mai check-in/out.
  assert.ok(await evaluate("document.body.innerText.includes('Volo incluso: scegli una partenza') && !document.body.innerText.includes('Come vuoi partire?')"));
  pass('fixture browser Volo + hotel: partenza obbligatoria senza date libere');
  await click('Chiudi');
  await evaluate('window.__offerFixture.flights=[]');
  await click('Modifica');
  await wait("document.body.innerText.includes('Nessuna partenza disponibile al momento')", 'fixture nessuna partenza');
  assert.ok(await evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent==='Salva le modifiche').disabled"));
  pass('fixture senza voli abbinati: messaggio e prenotazione disabilitata');
  await evaluate("localStorage.removeItem('queentour-cart-v2')");
  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await go('/pacchetti');
  await wait("document.body.innerText.includes('proposte trovate')", "catalogo mobile");
  assert.ok(await evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"));
  await click('Filtra i servizi');
  assert.ok(await evaluate("[...document.querySelectorAll('button[role=combobox]')].some(e=>e.firstElementChild?.textContent==='Partenza da' && e.getBoundingClientRect().width>0)"));
  pass('mobile 390px: filtri disponibili e nessun overflow');
  assert.deepEqual(browserErrors,[]);
  pass('nessuna eccezione JavaScript; nessuna pratica o email creata');
} finally {
  await call("Page.close").catch(()=>{}); socket.close();
}
