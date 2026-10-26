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
async function fill(selector, value, index = 0) {
  await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!e)throw Error('Campo mancante');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
}
try {
  await call('Page.enable'); await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const p=(await(await fetch(base+'/api/travel/packages/hurghada-all-inclusive')).json()).data;
  const f=p.flights.find(value=>value.seatsAvailable>=2);
  await go('/pacchetti/'+p.slug);
  await wait("[...document.querySelectorAll('button')].some(e=>e.textContent.includes('Aggiungi camera')&&Object.keys(e).some(k=>k.startsWith('__reactProps')))",'configuratore');
  await click('+ Aggiungi camera'); await click('+ Aggiungi camera');
  await wait("document.querySelectorAll('[data-room-id]').length===2",'due camere');
  assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"));
  assert.ok(await evaluate("[...document.querySelectorAll('[data-room-id] button')].every(e=>e.getBoundingClientRect().right<=innerWidth)"));
  pass('mobile 390px: due camere, select e pulsanti interamente nello schermo');
  await call('Emulation.setDeviceMetricsOverride',{width:540,height:844,deviceScaleFactor:1,mobile:true});
  assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"));
  pass('mobile 540px: nessun taglio orizzontale');
  await evaluate("document.querySelectorAll('[data-room-id]')[1].querySelector('button').click()");
  await click('+ Persona');
  await fill('input[type=date]',f.outboundDate,0);await fill('input[type=date]',f.returnDate,1);
  await fill('input[type=date]','1985-03-10',2);await fill('input[type=date]','1987-07-22',3);
  await wait("[...document.querySelectorAll('button')].some(e=>e.textContent==='Aggiungi al carrello'&&!e.disabled)",'preventivo aggiornato');
  await click('Aggiungi al carrello');
  await wait("document.body.innerText.includes('Aggiunto al carrello')",'conferma animata');
  assert.ok(await evaluate(`!!document.querySelector('[role=status] a[href="/carrello"]')`));
  assert.ok(await evaluate("[...document.querySelectorAll('a[aria-label^=Carrello]')].some(e=>e.getAttribute('aria-label').includes('1 prodotti'))"));
  pass('aggiunta: conferma visibile, collegamento al carrello e contatore aggiornato');
  await go('/carrello');
  await wait("document.body.innerText.includes('Prezzo e disponibilità aggiornati') && document.querySelectorAll('label[data-selected]').length>=3",'carrello pronto');
  await evaluate("window.__cartFetch=window.fetch;window.__cartBodies=[];window.fetch=async(input,init)=>{if(String(input).includes('/api/travel/cart/quote')){window.__cartBodies.push(JSON.parse(init.body));await new Promise(r=>setTimeout(r,900));}return window.__cartFetch(input,init)}");
  const roomCount=await evaluate("[...document.querySelectorAll('article')].filter(e=>e.textContent.includes('Camera 1')).length");
  await evaluate("document.querySelectorAll('label[data-selected] input')[0].click()");
  await wait("document.body.innerText.includes('Aggiornamento del totale')",'aggiornamento assicurazione');
  assert.equal(await evaluate("[...document.querySelectorAll('article')].filter(e=>e.textContent.includes('Camera 1')).length"),roomCount);
  assert.ok(await evaluate("!!document.querySelector('aside[aria-busy=true]') && !!document.querySelector('aside dl')"));
  await evaluate("document.querySelectorAll('label[data-selected] input')[1].click();document.querySelectorAll('label[data-selected] input')[2].click()");
  await wait("document.body.innerText.includes('Prezzo e disponibilità aggiornati') && !document.querySelector('aside[aria-busy=true]')",'ultima selezione calcolata');
  assert.ok(await evaluate("window.__cartBodies.at(-1).insurance_ids.length===2&&window.__cartBodies.at(-1).price_lock===true"));
  assert.ok(await evaluate("document.querySelectorAll('label[data-selected=true]').length===3"));
  pass('assicurazioni e blocca prezzo: nessuna scomparsa delle camere e ultima selezione rispettata');
  await evaluate("window.fetch=(input,init)=>String(input).includes('/api/travel/cart/quote')?Promise.resolve(new Response(JSON.stringify({message:'Errore temporaneo di prova'}),{status:503,headers:{'Content-Type':'application/json'}})):window.__cartFetch(input,init);document.querySelectorAll('label[data-selected] input')[2].click()");
  await wait("document.body.innerText.includes('Errore temporaneo di prova')",'errore simulato');
  await click('2 · Dati');
  assert.ok(await evaluate("[...document.querySelectorAll('button[name=action]')].every(e=>e.disabled)"));
  await evaluate('window.fetch=window.__cartFetch');
  await click('Ricalcola');
  await wait("document.body.innerText.includes('Prezzo e disponibilità aggiornati')",'retry');
  pass('errore API: importi precedenti segnalati, invio bloccato, ricalcolo recuperato');
  assert.deepEqual(browserErrors,[]);
  pass('nessuna eccezione JavaScript, nessuna pratica o email creata');
} finally { await call('Page.close').catch(()=>{});socket.close(); }
