// Guia de boas-vindas: aparece na primeira vez que a pessoa abre o app.
// Telas que passam com o dedo. A última pede pra ativar os avisos e instalar o app.
const KEY = "dc_guide_v1";
let installEvt = null; // o Android/Chrome entrega esse evento quando dá pra instalar
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; refreshEnd(); });
window.addEventListener("appinstalled", () => { installEvt = null; refreshEnd(); });

const ua = navigator.userAgent || "";
export const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
export const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
export const seenGuide = () => { try { return !!localStorage.getItem(KEY); } catch { return true; } };
const markSeen = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch {} };

let H = null; // { I, pot, looks }
let root = null, idx = 0, help = "";
export function initGuide(helpers) { H = helpers; }

const ic = (n, s = 20, w = 2) => H.I(n, s, w);
const SHARE = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';

function slides() {
  const L = H.looks();
  return [
    `<div class="gd-art gd-hero"><div class="gd-pots">${L.slice(0, 3).map((l, i) => `<span style="--d:${i * 90}ms">${H.pot(l, i === 1 ? 74 : 58, i === 1 ? 56 : 44)}</span>`).join("")}</div></div>
     <div class="gd-txt gd-center"><div class="logo gd-logo">docely<i>.</i></div><h2>O seu doce, do seu jeito!</h2>
     <p>Mousses, caixinhas de docinhos e encomendas pra festa, em poucos toques. Veja rapidinho como funciona.</p></div>`,

    `<div class="gd-txt"><span class="gd-step">1 · ESCOLHA</span><h2>Monte do seu jeito</h2><p>Tudo fica no <b>Cardápio</b>. Escolha, ajuste e coloque na sacola.</p></div>
     <div class="gd-list">
       ${row("cup", "Mousse", "Sabor, tamanho, geleia e adicionais. Dá pra tirar o que não quiser.")}
       ${row("candy", "Caixinha de docinhos", "Monte com os sabores que quiser ou escolha uma pronta.")}
       ${row("party", "Encomenda de festa", "De 25 a 200 docinhos, pra data da sua festa.")}
     </div>`,

    `<div class="gd-txt"><span class="gd-step">2 · PAGUE</span><h2>Pague com Pix</h2><p>Sem cartão e sem cadastro chato. O Pix vai direto pra gente.</p></div>
     <ol class="gd-steps">
       <li><span><b>Copie o código</b> ou leia o QR no app do seu banco.</span></li>
       <li><span>Toque em <b>“Já paguei”</b> e mande o comprovante no nosso WhatsApp.</span></li>
       <li><span>A gente confere e <b>confirma seu pedido</b>.</span></li>
     </ol>
     <p class="gd-note">${ic("clock", 16)} O Pix vale por 24 horas.</p>`,

    `<div class="gd-txt"><span class="gd-step">3 · RECEBA</span><h2>Chega no dia seguinte</h2><p>A entrega é em mãos, sem taxa.</p></div>
     <div class="gd-card gd-big"><span class="gd-ic">${ic("clock", 22)}</span><span><b>Pediu até 22h30?</b><small>Recebe no próximo dia útil.</small></span></div>
     <div class="gd-list">
       ${row("hour", "Sexta, sábado e domingo", "Os pedidos desses dias são entregues na segunda.")}
       ${row("party", "Festas", "Você escolhe a data. Peça com 2 a 4 dias de antecedência.")}
     </div>`,

    `<div class="gd-txt"><span class="gd-step">4 · ACOMPANHE</span><h2>Tudo na aba Pedidos</h2><p>Veja em que pé está o seu pedido e peça de novo com um toque.</p></div>
     <div class="gd-card gd-track">
       ${tl("Pedido confirmado", "Pagamento aprovado", "done")}
       ${tl("Separado pra você", "Pronto pra entrega", "now")}
       ${tl("Entregue", "Bom apetite!", "")}
     </div>
     <p class="gd-note">${ic("bell", 16)} O sininho no início mostra as novidades.</p>`,

    `<div class="gd-txt"><span class="gd-step">QUASE LÁ</span><h2>Deixe tudo pronto</h2><p>Dois toques e o docely fica do seu lado.</p></div>
     <div class="gd-acts" id="gd-end">${endCards()}</div>`
  ];
}
function row(icn, t, s) { return `<div class="gd-row"><span class="gd-ic">${ic(icn, 20)}</span><span><b>${t}</b><small>${s}</small></span></div>`; }
function tl(t, s, st) { return `<div class="gd-tl ${st}"><span class="gd-b">${st === "done" ? ic("check", 13, 3) : ""}</span><span><b>${t}</b><small>${s}</small></span></div>`; }

function notifState() {
  if (!("Notification" in window)) return isIOS && !isStandalone() ? "ios-install" : "none";
  return Notification.permission; // default | granted | denied
}
function endCards() {
  const n = notifState(); const inst = isStandalone() ? "done" : installEvt ? "prompt" : isIOS ? "ios" : "manual";
  const nBtn = n === "granted" ? `<span class="gd-ok">${ic("check", 15, 3)} Ativado</span>`
    : n === "default" ? `<button class="gd-btn" data-g="notif">Ativar</button>`
    : "";
  const nSub = n === "granted" ? "Você vai saber na hora quando o pedido andar."
    : n === "denied" ? "Estão bloqueados. Libere nas configurações do navegador."
    : n === "ios-install" ? "No iPhone, os avisos funcionam depois de instalar o app."
    : n === "none" ? "Seu navegador não tem avisos. Acompanhe pela aba Pedidos."
    : "A gente avisa quando o pedido for confirmado e separado.";
  const iBtn = inst === "done" ? `<span class="gd-ok">${ic("check", 15, 3)} Instalado</span>` : `<button class="gd-btn" data-g="install">Instalar</button>`;
  const iHelp = help === "ios" ? `<div class="gd-help"><b>No iPhone:</b><ol><li>Toque em <span class="gd-k">${SHARE} Compartilhar</span> na barra do Safari.</li><li>Escolha <span class="gd-k">Adicionar à Tela de Início</span>.</li><li>Toque em <b>Adicionar</b>. Pronto!</li></ol></div>`
    : help === "manual" ? `<div class="gd-help"><b>No seu navegador:</b><ol><li>Abra o menu <span class="gd-k">⋮</span> (os três pontinhos).</li><li>Toque em <span class="gd-k">Instalar app</span> ou <span class="gd-k">Adicionar à tela inicial</span>.</li></ol></div>` : "";
  return `<div class="gd-card gd-act"><span class="gd-ic">${ic("bell", 21)}</span><span class="gd-at"><b>Ativar avisos</b><small>${nSub}</small></span>${nBtn}</div>
    <div class="gd-card gd-act"><span class="gd-ic gd-app"><b>d<i>.</i></b></span><span class="gd-at"><b>Instalar o app</b><small>Fica na tela do celular e abre rapidinho.</small></span>${iBtn}</div>${iHelp}`;
}
function refreshEnd() { const e = root && root.querySelector("#gd-end"); if (e) e.innerHTML = endCards(); }

export function openGuide(opts = {}) {
  if (root) return;
  const list = slides(); help = "";
  idx = opts.start === "end" ? list.length - 1 : 0;
  root = document.createElement("div");
  root.className = "gd"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Como usar o docely");
  root.innerHTML = `<div class="gd-top"><span class="gd-count" aria-live="polite"></span><button class="gd-skip" data-g="skip">Pular</button></div>
    <div class="gd-track-x" tabindex="-1">${list.map((s, i) => `<section class="gd-slide" aria-roledescription="tela" aria-label="${i + 1} de ${list.length}"><div class="gd-in">${s}</div></section>`).join("")}</div>
    <div class="gd-foot"><div class="gd-dots">${list.map((_, i) => `<button data-g="dot" data-i="${i}" aria-label="Ir para a tela ${i + 1}"></button>`).join("")}</div>
    <button class="btn gd-next" data-g="next"></button></div>`;
  document.body.appendChild(root); document.body.classList.add("gd-open");
  const tr = root.querySelector(".gd-track-x");
  tr.scrollLeft = idx * tr.clientWidth; update();
  let t = 0;
  tr.addEventListener("scroll", () => { cancelAnimationFrame(t); t = requestAnimationFrame(() => { const i = Math.round(tr.scrollLeft / tr.clientWidth); if (i !== idx) { idx = i; update(); } }); }, { passive: true });
  root.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  root.tabIndex = -1; root.focus({ preventScroll: true });
}
function onKey(e) { if (!root) return; if (e.key === "ArrowRight") goTo(idx + 1); else if (e.key === "ArrowLeft") goTo(idx - 1); else if (e.key === "Escape") { e.stopImmediatePropagation(); close(); } }
function total() { return root.querySelectorAll(".gd-slide").length; }
function goTo(i) { const tr = root.querySelector(".gd-track-x"); i = Math.max(0, Math.min(total() - 1, i)); tr.scrollTo({ left: i * tr.clientWidth, behavior: "smooth" }); idx = i; update(); }
function update() {
  const n = total(); const last = idx === n - 1;
  root.querySelectorAll(".gd-dots button").forEach((b, i) => b.classList.toggle("on", i === idx));
  root.querySelector(".gd-next").textContent = last ? "Começar a pedir" : idx === 0 ? "Vamos lá" : "Próximo";
  root.querySelector(".gd-skip").style.visibility = last ? "hidden" : "visible";
  root.querySelector(".gd-count").textContent = `${idx + 1} de ${n}`;
  root.querySelectorAll(".gd-slide").forEach((s, i) => { s.classList.toggle("cur", i === idx); s.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
}
async function onClick(e) {
  const b = e.target.closest("[data-g]"); if (!b) return;
  const g = b.dataset.g;
  if (g === "next") { if (idx === total() - 1) close(); else goTo(idx + 1); }
  else if (g === "skip") goTo(total() - 1);
  else if (g === "dot") goTo(Number(b.dataset.i));
  else if (g === "notif") {
    try { await Notification.requestPermission(); } catch {}
    if (Notification.permission === "granted") showLocal("Avisos ativados", "A gente te avisa quando seu pedido andar.", "#/pedidos");
    refreshEnd();
  } else if (g === "install") {
    if (installEvt) { const ev = installEvt; installEvt = null; try { ev.prompt(); await ev.userChoice; } catch {} refreshEnd(); }
    else { help = help ? "" : isIOS ? "ios" : "manual"; refreshEnd(); }
  }
}
export function close() {
  if (!root) return;
  markSeen(); document.removeEventListener("keydown", onKey); root.classList.add("out"); document.body.classList.remove("gd-open");
  const r = root; root = null; setTimeout(() => r.remove(), 260);
}

// Aviso no celular (funciona com o app aberto ou em segundo plano)
export async function showLocal(title, body, url) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const opt = { body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: url || "#/" }, tag: url || "docely" };
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) { await reg.showNotification(title, opt); return; }
    const n = new Notification(title, opt); n.onclick = () => { window.focus(); location.hash = url || "#/"; n.close(); };
  } catch {}
}
