import { CONFIG } from "./config.js";
import { data, DEMO } from "./data.js";
import {
  brl, esc, clone, pad2, itemUnit, itemTotal, cartTotal, cartCount, itemTitle, itemDesc, deliveryDate, partyLead, partyMinDate,
  fmtDate, fmtWhen, ymd, parseYmd, pixPayload, STATUS, effStatus, isActive, isPaid, REJECT_REASONS, waLink, maskPhone, phoneOk, emailOk, startOfDay
} from "./logic.js";

/* ============ ícones ============ */
const P = {
  back: '<path d="M15 6l-6 6 6 6"/>', chev: '<path d="M9 6l6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  bag: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>', home: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>', receipt: '<path d="M6 4h12v16l-3-2-3 2-3-2-3 2z"/><path d="M9 9h6M9 13h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  wa: '<path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a3 3 0 0 1-2-2l1-1-1-2z"/>',
  cup: '<path d="M4 9h16l-1.6 9.2A2 2 0 0 1 16.4 20H7.6a2 2 0 0 1-2-1.8z"/><path d="M4 13h16"/><path d="M8 9c0-2 1.8-3.5 4-3.5S16 7 16 9"/>',
  candy: '<circle cx="12" cy="11" r="5"/><path d="M6.5 14.5 8 20h8l1.5-5.5"/><path d="M10 9.5h.01M13.5 8.5h.01M12 12h.01"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M3 9h18M12 9v11"/><path d="M12 9c-1.5-3-5-3.5-5-1.5S10 9 12 9c2 0 5-.5 5-1.5S13.5 6 12 9z"/>',
  party: '<path d="M4 20 9 7l8 8z"/><path d="M14 4v2M19 9h2M17.5 5.5 19 4M7.5 14.5 11 18"/>', star: '<path d="m12 4 2.4 5 5.6.8-4 3.9.9 5.5L12 16.6 7.1 19.2l.9-5.5-4-3.9 5.6-.8z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4M12 17h.01"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  out: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10"/>', panel: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 10v10"/>',
  tag: '<path d="M20 12l-8 8-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>', alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  hour: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
};
const I = (n, s = 20, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
const FIRE = (s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1-3.8 2.3-5 .2 1.6 1 2.8 2.2 3.2C11 8.8 11.2 5.3 12 2z"/></svg>`;
const GOOGLE = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.2H2.1a11 11 0 0 0 0 9.6z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.2L5.7 10c.9-2.7 3.4-4.6 6.3-4.6z"/></svg>';

/* ============ estado ============ */
const app = document.getElementById("app");
const cat = () => data.st.catalog;
const user = () => data.st.user;
const prof = () => data.st.profile || {};
const LSget = (k, d) => { try { const v = localStorage.getItem("dc_" + k); return v ? JSON.parse(v) : d; } catch { return d; } };
const LSset = (k, v) => { try { localStorage.setItem("dc_" + k, JSON.stringify(v)); } catch {} };
let cart = LSget("cart", []);
const saveCart = () => LSset("cart", cart);
const V = {}; // estado temporário das telas
let route = { path: [], q: new URLSearchParams() }, routeKey = "", timer = null, busy = false;

const byId = (arr, id) => (arr || []).find((x) => x.id === id);
const activeMousses = () => cat().mousses.filter((m) => m.active !== false);
const go = (h) => { if (location.hash === h) render(); else location.hash = h; };
function toast(msg, kind = "") {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = document.createElement("div"); t.className = "toast " + kind; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}
const orderNo = (o) => "nº " + String(o.number || 0).padStart(4, "0");

/* ============ pedaços de tela ============ */
function pot(look, w = 56, h = 42, opts = {}) {
  const l = look || {};
  const r = Math.round(h / 2);
  return `<div class="pot ${opts.cls || ""}" style="width:${w}px;height:${h}px;border-radius:${Math.round(w / 10)}px ${Math.round(w / 10)}px ${r}px ${r}px">
    <div style="height:${Math.round(h * 0.24)}px;background:${l.top}"></div><div style="flex:1;background:${l.body}"></div><div style="height:${Math.round(h * 0.24)}px;background:${l.base}"></div></div>`;
}
function bar(title, back = "#/", right = "") {
  return `<header class="bar"><a href="${back}" class="back" data-a="back" data-to="${back}" aria-label="Voltar">${I("back", 22, 2.4)}</a><h1>${esc(title)}</h1><div style="display:flex;justify-content:flex-end">${right}</div></header>`;
}
function nav(active) {
  const hasActive = data.st.myOrders.some(isActive);
  const it = (h, k, ic, lb) => `<a href="${h}" ${active === k ? 'aria-current="page"' : ""} class="press"><span class="dotw">${I(ic, 23, active === k ? 2.2 : 1.8)}${k === "pedidos" && hasActive ? '<span class="dot"></span>' : ""}</span>${lb}</a>`;
  return `<nav class="nav" aria-label="Navegação">${it("#/", "inicio", "home", "Início")}${it("#/cardapio", "cardapio", "book", "Cardápio")}${it("#/pedidos", "pedidos", "receipt", "Pedidos")}${it("#/conta", "conta", "user", "Conta")}</nav>`;
}
function bagbar(noNav) {
  if (!cart.length) return "";
  return `<a href="#/sacola" class="bagbar press ${noNav ? "no-nav" : ""}"><span class="n">${cartCount(cart)}</span><span class="t">Ver sacola</span><span class="v">${brl(cartTotal(cat(), cart))}</span></a>`;
}
function deliveryLine() {
  const d = deliveryDate();
  return fmtDate(d, "rel");
}
function notifs() {
  const out = [];
  const msg = {
    confirmado: ["check", "ok", "Pagamento aprovado", (o) => `Pedido ${orderNo(o)} confirmado. Você recebe ${fmtDate(parseYmd(o.deliveryDate), "rel")}.`],
    separado: ["bag", "brand", "Seu pedido está separado", (o) => `Pedido ${orderNo(o)} guardadinho pra entrega.`],
    entregue: ["check", "ok", "Pedido entregue", () => "Bom apetite!"],
    recusado: ["alert", "red", "Pagamento não confirmado", (o) => (o.rejectReason || "Confira o Pix") + ". Toque pra resolver."],
    cancelado: ["x", "gray", "Pedido cancelado", (o) => `Pedido ${orderNo(o)} foi cancelado.`]
  };
  for (const o of data.st.myOrders) for (const h of o.history || []) {
    const m = msg[h.s]; if (!m) continue;
    out.push({ at: h.at, ic: m[0], kind: m[1], title: m[2], text: m[3](o), href: h.s === "aguardando_pix" || h.s === "recusado" ? "#/pix/" + o.id : "#/pedido/" + o.id });
  }
  return out.sort((a, b) => b.at - a.at).slice(0, 40);
}
const unreadCount = () => { const seen = LSget("seen_" + (user() ? user().uid : "x"), 0); return notifs().filter((n) => n.at > seen).length; };

/* ============ telas de quem compra ============ */
const VIEWS = {};

VIEWS.inicio = () => {
  const c = cat(); const active = [...data.st.myOrders].filter(isActive).sort((a, b) => b.createdAt - a.createdAt)[0];
  const top = activeMousses().filter((m) => m.rank > 0).sort((a, b) => a.rank - b.rank).slice(0, 6);
  const un = unreadCount();
  let pill = "";
  if (active) {
    const s = effStatus(active); const paid = isPaid(active);
    const txt = paid ? (s === "separado" ? "Separado · você recebe " : "Confirmado · você recebe ") + fmtDate(parseYmd(active.deliveryDate), "rel").split(",")[0]
      : s === "comprovante" ? "Conferindo seu pagamento" : s === "recusado" ? "Pagamento não confirmado" : "Falta pagar o Pix";
    pill = `<a href="${paid || s === "comprovante" ? "#/pedido/" + active.id : "#/pix/" + active.id}" class="order-pill press ${paid ? "" : "wait"}" aria-label="Acompanhar pedido ${orderNo(active)}">
      <span class="ic">${I(paid ? "check" : s === "recusado" ? "alert" : "clock", 20, 2.4)}</span>
      <span style="flex:1;min-width:0"><small>Pedido ${orderNo(active)}${paid ? " · confirmado" : ""}</small><strong>${esc(txt)}</strong></span>
      <span class="go">${I("chev", 16, 2.6)}</span></a>`;
  }
  return `<main class="screen with-nav">
  <div class="home-top">
    <div class="row between" style="min-height:44px"><div class="logo" aria-label="docely">docely<i>.</i></div>
      <a href="#/notificacoes" class="icon-btn press" aria-label="Notificações${un ? ", " + un + " novas" : ""}">${I("bell", 21, 1.9)}${un ? `<span class="badge">${un}</span>` : ""}</a></div>
    <div class="hint">${I("clock", 14, 2.4)}<span>Peça até <b>${CONFIG.cutoff.h}h${pad2(CONFIG.cutoff.m)}</b> e receba <b>no próximo dia útil</b></span></div>
    <a href="#/cardapio?busca=1" class="search press" aria-label="Buscar no cardápio">${I("search", 18)}<span style="flex:1">Buscar mousse, brigadeiro, caixinha…</span></a>
    ${pill}
  </div>
  <div class="banners" role="list">
    ${c.offer && c.offer.active ? `<a role="listitem" href="#/mousse/${(top[0] || activeMousses()[0] || {}).id || ""}" class="banner press"><span class="tag">${FIRE()}${esc(c.offer.tag || "OFERTA")}</span><h3>${esc(c.offer.title)}</h3><p>${esc(c.offer.text || "")}</p><span class="art"></span><span class="potw">${pot((top[0] || activeMousses()[0] || {}).look, 78, 60)}</span></a>` : ""}
    <a role="listitem" href="#/encomenda" class="banner alt press"><span class="tag">ENCOMENDAS</span><h3>Docinhos pra sua festa</h3><p>De ${c.party.qtys[0]} a ${c.party.qtys[c.party.qtys.length - 1]} unidades</p><span class="art"></span></a>
    <a role="listitem" href="#/caixinha" class="banner press" style="background:#8E1A3C"><span class="tag">PRESENTE</span><h3>Caixinha com laço</h3><p>Você escolhe os sabores</p><span class="art"></span></a>
  </div>
  ${top.length ? `<section class="sec"><h2 class="sec-h">Mais pedidos <span style="color:var(--brand);display:flex">${FIRE(18)}</span></h2><div class="hscroll">
    ${top.map((m, i) => `<a href="#/mousse/${m.id}" class="top-card press"><div class="img" style="background:${m.look.tile}"><span class="rank">#${i + 1}</span>${pot(m.look, 76, 56)}<span class="plus">${I("plus", 16, 2.8)}</span></div><div class="nm">${esc(m.name)}</div><div class="price">${brl(c.sizes[0].price)}</div></a>`).join("")}
  </div></section>` : ""}
  <a href="#/cardapio" class="btn-ghost-full press">Ver o cardápio completo ${I("chev", 16, 2.4)}</a>
  </main>${bagbar()}${nav("inicio")}`;
};

VIEWS.cardapio = () => {
  const c = cat(); V.cat = V.cat || { tab: "mousse", q: "" };
  const s = V.cat; const q = s.q.trim().toLowerCase();
  const tabs = [["mousse", "Mousses", "cup", "#FFF4C2", "#8A6A00"], ["doce", "Docinhos", "candy", "#FBE6DC", "#8A3A12"], ["caixa", "Caixinhas", "gift", "#FFE3EA", "#A3133D"], ["festa", "Festas", "party", "#F6EFC4", "#8E1A3C"]];
  const ms = activeMousses().filter((m) => !q || (m.name + " " + m.desc).toLowerCase().includes(q));
  const ds = c.doces.filter((d) => d.active !== false && (!q || d.name.toLowerCase().includes(q)));
  const show = (k) => (q ? true : s.tab === k);
  const mList = ms.map((m) => `<a href="#/mousse/${m.id}" class="list-item press"><span class="tx"><span class="nm">${esc(m.name)}</span><span class="ds">${esc(m.desc)}</span><span class="price" style="margin-top:2px">a partir de ${brl(c.sizes[0].price)}</span></span><span class="thumb" style="background:${m.look.tile}">${pot(m.look)}</span></a>`).join("");
  const boxes = `<a href="#/caixinha" class="press" style="margin:0 16px 8px;border-radius:20px;overflow:hidden;border:1px solid var(--line);display:flex;flex-direction:column;background:#fff"><img src="img/caixinha.jpg" alt="Caixinha com docinhos e laço" style="width:100%;height:170px;object-fit:cover"><span style="padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px"><span><b style="display:block;font-size:16px">Caixinha com ${c.boxes.map((b) => b.size).join(" ou ")}</b><span class="muted" style="font-size:13px">Você escolhe os sabores · com laço</span></span><span class="price">a partir de ${brl(Math.min(...c.boxes.map((b) => b.price)))}</span></span></a>`;
  const dList = ds.map((d) => `<a href="#/caixinha" class="list-item press"><span class="tx"><span class="nm">${esc(d.name)}</span><span class="ds">Na caixinha ou na encomenda</span></span><span class="thumb" style="width:72px;height:72px;background:var(--soft);align-items:center;padding:0"><span class="circ" style="width:40px;height:40px;background:${d.color}"></span></span></a>`).join("");
  const festa = `<div style="padding:0 16px" class="stack"><div class="grid2">${c.party.qtys.map((n) => `<a href="#/encomenda?q=${n}" class="card press" style="display:flex;flex-direction:column;gap:2px"><b class="font-d" style="font-size:30px;color:var(--brand)">${n}</b><span style="font-size:13px;font-weight:600">docinhos</span><span class="muted" style="font-size:12px">${partyLead(n) === 2 ? "a partir de 2 dias" : "a partir de " + partyLead(n) + " dias"}</span></a>`).join("")}</div>
    <a href="#/encomenda" class="btn press">Montar encomenda</a></div>`;
  const nothing = q && !ms.length && !ds.length;
  return `<main class="screen with-nav">
  <div class="home-top"><div class="row" style="min-height:44px"><h1 class="logo" style="margin:0">Cardápio</h1></div>
    <label class="search">${I("search", 18)}<input id="busca" data-bind="cat.q" data-live="1" type="search" placeholder="Buscar mousse, brigadeiro, caixinha…" value="${esc(s.q)}" aria-label="Buscar"></label></div>
  ${q ? "" : `<div class="cats" role="group" aria-label="Categorias">${tabs.map(([k, l, ic, bg, fg]) => `<button class="cat press" data-a="cattab" data-k="${k}" aria-pressed="${s.tab === k}"><span class="tile" style="background:${bg};color:${fg}">${I(ic, 30, 1.8)}</span>${l}</button>`).join("")}</div>`}
  <div id="cat-results">
  ${nothing ? `<div class="empty"><b>Nada encontrado</b>Tente outro nome, tipo "limão" ou "brigadeiro".</div>` : ""}
  ${show("mousse") && ms.length ? `<section class="sec"><h2 class="sec-h">Mousses</h2>${mList}</section>` : ""}
  ${(show("doce") || show("caixa")) && (!q || ds.length) ? `<section class="sec">${!q && s.tab === "caixa" ? "" : `<h2 class="sec-h">${s.tab === "caixa" && !q ? "" : "Docinhos"}</h2>`}${!q ? boxes : ""}${s.tab === "doce" || q ? `<h2 class="sec-h" style="margin-top:8px">Sabores de docinho</h2>${dList}` : ""}</section>` : ""}
  ${show("festa") && !q ? `<section class="sec"><h2 class="sec-h">Encomendas para festa</h2>${festa}</section>` : ""}
  </div></main>${bagbar()}${nav("cardapio")}`;
};

VIEWS.mousse = () => {
  const c = cat(); const id = route.path[1]; const m = byId(c.mousses, id);
  if (!m) return notFound();
  const editIdx = route.q.has("edit") ? Number(route.q.get("edit")) : -1;
  const key = "m_" + id + "_" + editIdx;
  if (!V[key]) {
    const ex = editIdx >= 0 && cart[editIdx] && cart[editIdx].type === "mousse" ? cart[editIdx] : null;
    V[key] = ex ? clone(ex) : { type: "mousse", mousse: id, size: c.sizes[0].id, jelly: "", extras: [], obs: "", qty: 1 };
  }
  const s = V[key]; V.cur = key;
  const sz = byId(c.sizes, s.size) || c.sizes[0];
  const scale = c.sizes.indexOf(sz);
  const pw = 140 + scale * 30, ph = 108 + scale * 26;
  const jellies = c.jellies.filter((j) => (m.jellies || []).includes(j.id));
  const extras = c.extras.filter((e) => (m.extras || []).includes(e.id));
  const unit = itemUnit(c, s).price;
  const jel = byId(c.jellies, s.jelly);
  const opt = (a, val, on, label, price, sq, base) => `<button class="opt press" role="${sq ? "checkbox" : "radio"}" aria-checked="${on}" data-a="${a}" data-v="${val}"><span class="tx"><b>${esc(label)}</b><span class="${base ? "base" : ""}">${price}</span></span><span class="mark ${sq ? "sq" : ""}">${I("check", 13, 3.4)}</span></button>`;
  const potHtml = `<div class="pot bigpot" style="width:${pw}px;height:${ph}px;border-radius:12px 12px ${ph / 2}px ${ph / 2}px;background:rgba(255,255,255,.6);box-shadow:0 0 0 4px rgba(255,255,255,.95),0 16px 30px rgba(0,0,0,.12)">
    <div style="height:8px"></div>
    ${s.extras.includes("granulado") ? `<div style="height:10px;background-color:${s.extras.includes("chantilly") ? "#FFFDF6" : m.look.body};background-image:radial-gradient(circle,#4A2A1C 1.6px,transparent 2px);background-size:9px 7px"></div>` : ""}
    ${s.extras.includes("chantilly") ? '<div style="height:18px;background:#FFFDF6;border-radius:0 0 6px 6px"></div>' : ""}
    ${jel ? `<div style="height:16px;background:${jel.color}"></div>` : `<div style="height:12px;background:${m.look.top}"></div>`}
    <div style="flex:1;background:${m.look.body}"></div>
    ${s.extras.includes("semBase") ? "" : `<div style="height:${Math.round(ph * 0.22)}px;background-color:${m.look.base};background-image:radial-gradient(circle,rgba(0,0,0,.15) 1.5px,transparent 2px);background-size:8px 8px"></div>`}
  </div>`;
  return `<main class="screen with-bar">
  <div class="hero" style="background:${m.look.tile}">
    <a href="#/cardapio" data-a="back" data-to="#/cardapio" class="float" aria-label="Voltar">${I("back", 20, 2.2)}</a>
    ${m.rank === 1 ? `<span class="chip">${FIRE()}MAIS PEDIDO</span>` : ""}
    ${m.photo ? `<img src="${esc(m.photo)}" alt="">` : potHtml}
  </div>
  <div class="p-head"><h1>${esc(m.name)}</h1><p>${esc(m.desc)}</p><div class="price" style="font-size:17px;margin-top:2px">a partir de ${brl(c.sizes[0].price)}</div></div>
  <section class="grp"><div class="grp-h"><div><h2>Escolha o tamanho</h2><small>Escolha 1 opção</small></div><span class="tag req">OBRIGATÓRIO</span></div>
    <div role="radiogroup" aria-label="Tamanho">${c.sizes.map((z) => opt("msize", z.id, s.size === z.id, z.name + (z.ml ? " · " + z.ml + " ml" : ""), brl(z.price), false, true)).join("")}</div></section>
  ${jellies.length ? `<section class="grp"><div class="grp-h"><div><h2>Geleia por cima</h2><small>Escolha até 1</small></div><span class="tag">OPCIONAL</span></div>
    <div role="radiogroup" aria-label="Geleia">${opt("mjelly", "", !s.jelly, "Sem geleia", "sem custo", false)}${jellies.map((j) => opt("mjelly", j.id, s.jelly === j.id, j.name, "+ " + brl(j.price), false)).join("")}</div></section>` : ""}
  ${extras.length ? `<section class="grp"><div class="grp-h"><div><h2>Acrescentar ou tirar</h2><small>${s.extras.length} selecionado${s.extras.length === 1 ? "" : "s"}</small></div><span class="tag">OPCIONAL</span></div>
    <div>${extras.map((e) => opt("mextra", e.id, s.extras.includes(e.id), e.name, e.price ? "+ " + brl(e.price) : "sem custo", true)).join("")}</div></section>` : ""}
  <section class="pad stack"><label class="field" for="obs" style="font-size:15px;color:var(--ink);font-weight:800">Alguma observação?</label>
    <textarea id="obs" class="input" rows="2" maxlength="140" data-bind="${key}.obs" placeholder="Ex.: sem colher, menos doce…">${esc(s.obs)}</textarea></section>
  </main>
  <div class="actionbar">
    <div class="qty"><button data-a="mqty" data-d="-1" aria-label="Diminuir quantidade" ${s.qty <= 1 ? "disabled" : ""}>${I("minus", 18, 2.6)}</button><span aria-live="polite">${s.qty}</span><button data-a="mqty" data-d="1" aria-label="Aumentar quantidade">${I("plus", 18, 2.6)}</button></div>
    <button class="btn split press" data-a="madd"><span>${editIdx >= 0 ? "Salvar" : "Adicionar"}</span><span>${brl(unit * s.qty)}</span></button>
  </div>`;
};

VIEWS.caixinha = () => {
  const c = cat(); const editIdx = route.q.has("edit") ? Number(route.q.get("edit")) : -1;
  const key = "box_" + editIdx;
  if (!V[key]) { const ex = editIdx >= 0 && cart[editIdx] && cart[editIdx].type === "box" ? cart[editIdx] : null; V[key] = ex ? clone(ex) : { type: "box", size: c.boxes[0].size, flavors: {}, ribbon: c.ribbons[0].id, qty: 1 }; }
  const s = V[key]; V.cur = key;
  const used = Object.values(s.flavors).reduce((a, b) => a + b, 0); const full = used >= s.size; const left = s.size - used;
  const price = itemUnit(c, s).price * s.qty;
  return `<main class="screen with-bar">
  <div class="hero photo"><a href="#/cardapio" data-a="back" data-to="#/cardapio" class="float" aria-label="Voltar">${I("back", 20, 2.2)}</a><img src="img/caixinha.jpg" alt="Caixinha com docinhos e laço"></div>
  <div class="p-head"><h1>Caixinha de docinhos</h1><p>Você escolhe os sabores. Vai fechadinha e com laço, pronta pra presentear.</p></div>
  <section class="grp"><div class="grp-h"><div><h2>Tamanho da caixinha</h2><small>Escolha 1 opção</small></div><span class="tag req">OBRIGATÓRIO</span></div>
    <div role="radiogroup">${c.boxes.map((b) => `<button class="opt press" role="radio" aria-checked="${s.size === b.size}" data-a="bsize" data-v="${b.size}"><span class="tx"><b>Caixinha com ${b.size}</b><span class="base">${brl(b.price)}</span></span><span class="mark">${I("check", 13, 3.4)}</span></button>`).join("")}</div></section>
  <section class="grp"><div class="grp-h"><div><h2>Escolha os sabores</h2><small>${used} de ${s.size} escolhidos</small></div><span class="tag ${full ? "ok" : "req"}">${full ? "PRONTO" : "OBRIGATÓRIO"}</span></div>
    <div class="progress"><span style="width:${Math.min(100, (used / s.size) * 100)}%;background:var(--brand)"></span></div>
    ${c.doces.filter((d) => d.active !== false).map((d) => { const n = s.flavors[d.id] || 0; return `<div class="counter-row"><span class="circ" style="background:${d.color}"></span><span style="flex:1;font-weight:600;font-size:14px">${esc(d.name)}</span>
      ${n ? `<button class="round-btn press" data-a="bflav" data-id="${d.id}" data-d="-1" aria-label="Tirar ${esc(d.name)}">${I("minus", 18, 2.6)}</button><span style="width:22px;text-align:center;font-weight:800">${n}</span>` : ""}
      <button class="round-btn press" data-a="bflav" data-id="${d.id}" data-d="1" aria-label="Adicionar ${esc(d.name)}" ${full ? "disabled" : ""}>${I("plus", 18, 2.6)}</button></div>`; }).join("")}</section>
  <section class="grp"><div class="grp-h"><div><h2>Cor do laço</h2><small>Escolha 1 opção</small></div><span class="tag">OPCIONAL</span></div>
    <div class="chips pad">${c.ribbons.map((r) => `<button class="chip-btn press" aria-pressed="${s.ribbon === r.id}" data-a="bribbon" data-v="${r.id}"><span style="width:14px;height:14px;border-radius:4px;background:${r.color};box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)"></span>${esc(r.name)}</button>`).join("")}</div></section>
  </main>
  <div class="actionbar">
    <div class="qty"><button data-a="bqty" data-d="-1" aria-label="Diminuir quantidade" ${s.qty <= 1 ? "disabled" : ""}>${I("minus", 18, 2.6)}</button><span>${s.qty}</span><button data-a="bqty" data-d="1" aria-label="Aumentar quantidade">${I("plus", 18, 2.6)}</button></div>
    <button class="btn split press ${full ? "" : "off"}" data-a="badd" ${full ? "" : 'aria-disabled="true"'}><span>${full ? (editIdx >= 0 ? "Salvar" : "Adicionar") : "Escolha mais " + left}</span><span>${full ? brl(price) : used + "/" + s.size}</span></button>
  </div>`;
};

VIEWS.encomenda = () => {
  const c = cat(); const editIdx = route.q.has("edit") ? Number(route.q.get("edit")) : -1; const key = "party_" + editIdx;
  if (!V[key]) {
    const ex = editIdx >= 0 && cart[editIdx] && cart[editIdx].type === "party" ? cart[editIdx] : null;
    const q0 = Number(route.q.get("q")) || c.party.qtys[1] || c.party.qtys[0];
    V[key] = ex ? clone(ex) : { type: "party", total: q0, flavors: {}, mousses: 0, date: ymd(partyMinDate(q0)), time: "15:00", mode: "entregar", obs: "", qty: 1 };
  }
  const s = V[key]; V.cur = key;
  const docs = c.doces.filter((d) => d.active !== false);
  const used = docs.reduce((a, d) => a + (s.flavors[d.id] || 0), 0); const rest = s.total - used; const ok = rest === 0;
  const min = ymd(partyMinDate(s.total)); const dateOk = s.date >= min;
  const lead = partyLead(s.total);
  const price = itemUnit(c, s).price;
  return `<main class="screen with-bar" style="padding-bottom:150px">
  ${bar("Encomenda para festa", "#/cardapio")}
  <section class="pad stack"><h2 style="margin:0;font-size:16px;font-weight:800">Quantos docinhos?</h2>
    <div class="qgrid">${c.party.qtys.map((n) => `<button class="qbtn press" aria-pressed="${s.total === n}" data-a="ptotal" data-v="${n}"><b>${n}</b><small>${partyLead(n) === 2 ? "48h" : partyLead(n) + "+ dias"}</small></button>`).join("")}</div>
    <div class="note">${I("clock", 18, 2.2)}<span><b>Prazo para ${s.total} docinhos:</b> a partir de ${lead === 2 ? "2 dias (48h)" : lead + " dias"}. ${brl(c.party.pricePerDoce)} cada.</span></div></section>
  <section class="grp"><div class="grp-h"><div><h2>Divida entre os sabores</h2><small>De 5 em 5</small></div><span class="tag ${ok ? "ok" : "req"}" style="${ok ? "" : "background:var(--brand)"}">${ok ? "TUDO DIVIDIDO" : rest > 0 ? "FALTAM " + rest : "PASSOU " + -rest}</span></div>
    <div class="progress" style="height:6px">${docs.map((d) => `<span style="width:${((s.flavors[d.id] || 0) / s.total) * 100}%;background:${d.color}"></span>`).join("")}</div>
    ${docs.map((d) => { const n = s.flavors[d.id] || 0; return `<div class="counter-row"><span class="circ" style="background:${d.color}"></span><span style="flex:1;font-weight:600;font-size:14px">${esc(d.name)}</span>
      <button class="round-btn press" data-a="pflav" data-id="${d.id}" data-d="-5" aria-label="Menos ${esc(d.name)}" ${n ? "" : "disabled"}>${I("minus", 18, 2.6)}</button><span style="width:30px;text-align:center;font-weight:800">${n}</span>
      <button class="round-btn press" data-a="pflav" data-id="${d.id}" data-d="5" aria-label="Mais ${esc(d.name)}" ${rest >= 5 ? "" : "disabled"}>${I("plus", 18, 2.6)}</button></div>`; }).join("")}</section>
  <section class="grp"><div class="grp-h"><div><h2>Quer mousses também?</h2><small>${brl(c.party.moussePrice)} cada · sabores combinados depois</small></div><span class="tag">OPCIONAL</span></div>
    <div class="counter-row"><span style="flex:1;font-weight:600;font-size:14px">Potinhos de mousse</span>
      <button class="round-btn press" data-a="pmousse" data-d="-5" aria-label="Menos mousses" ${s.mousses ? "" : "disabled"}>${I("minus", 18, 2.6)}</button><span style="width:30px;text-align:center;font-weight:800">${s.mousses}</span>
      <button class="round-btn press" data-a="pmousse" data-d="5" aria-label="Mais mousses">${I("plus", 18, 2.6)}</button></div></section>
  <section class="pad stack"><h2 style="margin:0;font-size:16px;font-weight:800">Quando é a festa?</h2>
    <div class="grid2"><label class="field">Data<input class="input ${dateOk ? "" : "err"}" type="date" min="${min}" value="${esc(s.date)}" data-bind="${key}.date" data-rerender="1"></label>
      <label class="field">Horário<input class="input" type="time" value="${esc(s.time)}" data-bind="${key}.time"></label></div>
    ${dateOk ? "" : `<div class="err-msg">Pra ${s.total} docinhos, a data mais próxima é ${fmtDate(parseYmd(min), "long")}.</div>`}
    <div class="grid2">${[["entregar", "Entregar no local"], ["retirar", "Vou retirar"]].map(([k, l]) => `<button class="qbtn press" style="height:50px;font-weight:700;font-size:14px" aria-pressed="${s.mode === k}" data-a="pmode" data-v="${k}">${l}</button>`).join("")}</div>
    <label class="field">Observação (opcional)<textarea class="input" rows="2" maxlength="200" data-bind="${key}.obs" placeholder="Ex.: tema da festa, cores das forminhas…">${esc(s.obs)}</textarea></label>
  </section></main>
  <div class="actionbar col">
    <div class="row between" style="font-size:13px;color:var(--muted)"><span>${s.total} docinhos${s.mousses ? " + " + s.mousses + " mousses" : ""}</span><span style="font-weight:700;color:var(--butter-ink)">${fmtDate(parseYmd(s.date), "short")}</span></div>
    <button class="btn split press ${ok && dateOk ? "" : "off"}" data-a="padd"><span>${!ok ? "Divida todos os docinhos" : !dateOk ? "Escolha outra data" : editIdx >= 0 ? "Salvar encomenda" : "Adicionar à sacola"}</span><span>${ok && dateOk ? brl(price) : ""}</span></button>
  </div>`;
};

VIEWS.sacola = () => {
  const c = cat();
  if (!cart.length) return `<main class="screen">${bar("Sacola", "#/")}<div class="empty" style="padding-top:80px"><div style="width:72px;height:72px;border-radius:50%;background:var(--brand-soft);color:var(--brand);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">${I("bag", 30, 1.9)}</div><b>Sua sacola está vazia</b>Que tal um mousse pra adoçar o dia?<div style="margin-top:20px"><a href="#/cardapio" class="btn press" style="display:inline-flex;width:auto;padding:0 28px">Ver cardápio</a></div></div></main>`;
  const total = cartTotal(c, cart); const hasParty = cart.find((i) => i.type === "party");
  const others = activeMousses().filter((m) => !cart.some((i) => i.mousse === m.id)).slice(0, 4);
  const when = hasParty ? fmtDate(parseYmd(hasParty.date), "long") : deliveryLine();
  return `<main class="screen" style="padding-bottom:120px">
  ${bar("Sacola", "#/", `<button class="act" data-a="clearcart">Limpar</button>`)}
  <div class="row pad" style="padding-bottom:6px"><div style="width:48px;height:48px;border-radius:14px;background:#1C1715;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Bricolage,Inter,sans-serif;font-weight:800;font-size:24px;letter-spacing:-.05em">d<span style="color:#E14D6F">.</span></div>
    <div style="flex:1"><div style="font-weight:800;font-size:16px">docely</div><a href="#/cardapio" class="link" style="min-height:24px">Adicionar mais itens</a></div></div>
  <div style="padding:6px 16px;font-size:13px;font-weight:800;color:var(--muted);letter-spacing:.04em">ITENS ADICIONADOS</div>
  ${cart.map((it, i) => { const m = it.type === "mousse" ? byId(c.mousses, it.mousse) : null; const look = m ? m.look : null;
    const edit = it.type === "mousse" ? `#/mousse/${it.mousse}?edit=${i}` : it.type === "box" ? `#/caixinha?edit=${i}` : `#/encomenda?edit=${i}`;
    return `<div class="row" style="align-items:flex-start;padding:14px 16px;border-bottom:1px solid var(--line)">
      <div class="thumb" style="width:64px;height:64px;border-radius:14px;padding-bottom:9px;background:${look ? look.tile : it.type === "box" ? "#FFE3EA" : "#F6EFC4"}">${look ? pot(look, 38, 28) : `<span style="align-self:center;color:var(--brand);margin-bottom:-9px">${I(it.type === "box" ? "gift" : "party", 26, 1.8)}</span>`}</div>
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
        <b style="font-size:14px">${esc(itemTitle(c, it))}</b><span class="muted" style="font-size:12px;line-height:1.35">${esc(itemDesc(c, it))}</span>
        <div class="row between" style="margin-top:4px"><span class="price">${brl(itemTotal(c, it))}</span>
          <div class="row" style="gap:8px"><a href="${edit}" class="link">Editar</a>
          ${it.type === "party" ? `<button class="mini-qty press" data-a="cqty" data-i="${i}" data-d="-1" aria-label="Remover" style="width:38px;height:36px;justify-content:center;color:var(--brand)">${I("trash", 16, 2.2)}</button>` :
          `<div class="mini-qty"><button data-a="cqty" data-i="${i}" data-d="-1" aria-label="${it.qty === 1 ? "Remover" : "Menos"}">${I(it.qty === 1 ? "trash" : "minus", 16, it.qty === 1 ? 2.2 : 2.6)}</button><span>${it.qty}</span><button data-a="cqty" data-i="${i}" data-d="1" aria-label="Mais">${I("plus", 16, 2.6)}</button></div>`}</div></div></div></div>`; }).join("")}
  ${others.length ? `<section style="padding:18px 0 6px"><h2 class="sec-h" style="font-size:16px;font-family:Inter,sans-serif">Peça também <span style="color:var(--brand);display:flex">${FIRE(15)}</span></h2><div class="hscroll" style="gap:10px">
    ${others.map((m) => `<a href="#/mousse/${m.id}" class="card press" style="flex:0 0 136px;padding:8px;display:flex;flex-direction:column;gap:6px"><span style="height:76px;border-radius:12px;background:${m.look.tile};display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px">${pot(m.look, 46, 34)}</span><span style="font-size:13px;font-weight:600;line-height:1.25;min-height:32px">${esc(m.name)}</span><span class="row between"><span class="price" style="font-size:14px">${brl(c.sizes[0].price)}</span><span style="width:30px;height:30px;border-radius:10px;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center">${I("plus", 14, 2.8)}</span></span></a>`).join("")}
  </div></section>` : ""}
  <section class="pad stack" style="padding-top:10px"><h2 style="margin:0;font-size:16px;font-weight:800">Resumo de valores</h2>
    <div class="sum-row muted"><span>Subtotal</span><span>${brl(total)}</span></div>
    <div class="sum-row muted"><span>Entrega</span><span style="color:var(--green);font-weight:700">Grátis</span></div>
    <div class="sum-row muted"><span>${hasParty ? "Data da encomenda" : "Você recebe"}</span><span style="color:var(--ink);font-weight:700">${esc(when)}</span></div>
    <div class="sum-row total"><span>Total</span><span>${brl(total)}</span></div></section>
  </main>
  <div class="actionbar"><div style="display:flex;flex-direction:column"><span class="muted" style="font-size:12px">Total</span><span style="font-size:17px;font-weight:800">${brl(total)} <span class="muted" style="font-size:12px;font-weight:600">/ ${cartCount(cart)} ${cartCount(cart) === 1 ? "item" : "itens"}</span></span></div>
    <button class="btn press" style="flex:1" data-a="tocheckout">Continuar</button></div>`;
};

function authSheet() {
  V.auth = V.auth || { tab: "login", name: "", phone: "", email: "", pw: "", err: "" };
  const s = V.auth; const next = route.q.get("next") || "";
  return `<div class="sheet-bg" data-a="closeauth"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Entrar ou criar conta">
    <div class="grab"></div>
    <div><h2>${next === "checkout" ? "Falta pouco!" : "Entre na sua conta"}</h2><p class="muted" style="margin:6px 0 0;font-size:14px">${next === "checkout" ? "Entre pra fechar seu pedido. Sua sacola continua salva." : "Pra acompanhar seus pedidos e salvar seus endereços."}</p></div>
    <button class="gbtn press" data-a="google">${GOOGLE} Continuar com Google</button>
    <div class="divider">ou com e-mail</div>
    <div class="seg" role="tablist">${[["login", "Já tenho conta"], ["new", "Criar conta"]].map(([k, l]) => `<button role="tab" aria-selected="${s.tab === k}" data-a="authtab" data-k="${k}">${l}</button>`).join("")}</div>
    <form class="stack" data-form="auth" novalidate>
      ${s.tab === "new" ? `<label class="field">Seu nome<input class="input soft" data-bind="auth.name" autocomplete="name" value="${esc(s.name)}" placeholder="Como a gente te chama"></label>
      <label class="field">WhatsApp<input class="input soft" data-bind="auth.phone" data-mask="phone" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(s.phone)}" placeholder="(48) 9 0000-0000"></label>` : ""}
      <label class="field">E-mail<input class="input soft" data-bind="auth.email" type="email" autocomplete="email" inputmode="email" value="${esc(s.email)}" placeholder="voce@email.com"></label>
      <label class="field">Senha<input class="input soft" data-bind="auth.pw" type="password" autocomplete="${s.tab === "new" ? "new-password" : "current-password"}" value="${esc(s.pw)}" placeholder="${s.tab === "new" ? "Mínimo 6 caracteres" : "••••••••"}"></label>
      ${s.err ? `<div class="err-msg" role="alert">${esc(s.err)}</div>` : ""}
      ${s.tab === "login" ? `<button type="button" class="link" style="align-self:flex-end" data-a="forgot">Esqueci a senha</button>` : `<p class="muted" style="margin:0;font-size:12px">O WhatsApp é só pra avisar do seu pedido. Nada de spam.</p>`}
      <button type="submit" class="btn press">${s.tab === "login" ? "Entrar" : "Criar conta"}${next === "checkout" ? " e continuar" : ""}</button>
      ${DEMO ? `<p class="muted" style="margin:0;font-size:11px;text-align:center">Modo de teste · painel: ${data.demoAdminEmail} / docely123</p>` : ""}
    </form>
  </div>`;
}

VIEWS.checkout = () => {
  const c = cat();
  if (!cart.length) { setTimeout(() => go("#/sacola")); return ""; }
  if (!user()) { setTimeout(() => go("#/entrar?next=checkout")); return ""; }
  const p = prof(); const addrs = p.addresses || [];
  V.ck = V.ck || { addr: addrs.length ? 0 : -1, cep: "", street: "", num: "", hood: "", comp: "", label: "Trabalho", save: true, phone: p.phone || "", err: "" };
  const s = V.ck; if (s.addr >= addrs.length) s.addr = addrs.length ? 0 : -1;
  const hasParty = cart.find((i) => i.type === "party"); const pickup = hasParty && cart.every((i) => i.type === "party" && i.mode === "retirar");
  const total = cartTotal(c, cart); const when = hasParty ? fmtDate(parseYmd(hasParty.date), "long") : fmtDate(deliveryDate(), "rel");
  const needPhone = !phoneOk(p.phone);
  return `<main class="screen" style="background:var(--soft);padding-bottom:120px">
  ${bar("Fechar pedido", "#/sacola")}
  <section class="panel" style="margin-top:0"><div class="row"><div class="avatar" style="width:44px;height:44px;font-size:16px">${esc(initials(p.name || user().name))}</div><div style="flex:1;min-width:0"><b>${esc(p.name || user().name || "Você")}</b><div class="muted" style="font-size:12px">${needPhone ? "Falta seu WhatsApp" : "Avisos no WhatsApp " + esc(p.phone)}</div></div></div>
    ${needPhone ? `<label class="field">Seu WhatsApp (pra avisar do pedido)<input class="input soft ${s.err === "phone" ? "err" : ""}" data-bind="ck.phone" data-mask="phone" type="tel" inputmode="numeric" value="${esc(s.phone)}" placeholder="(48) 9 0000-0000"></label>` : ""}</section>
  ${pickup ? `<section class="panel"><h2>Retirada</h2><div class="note green">${I("pin", 18, 2)}<span>Você escolheu <b>retirar</b> a encomenda. A gente combina o local pelo WhatsApp.</span></div></section>` : `
  <section class="panel"><h2>Entregar em</h2>
    <div class="chips" style="flex-wrap:nowrap;overflow-x:auto">${addrs.map((a, i) => `<button class="chip-btn press" style="flex:0 0 auto" aria-pressed="${s.addr === i}" data-a="ckaddr" data-v="${i}">${esc(a.label)}</button>`).join("")}<button class="chip-btn press" style="flex:0 0 auto" aria-pressed="${s.addr === -1}" data-a="ckaddr" data-v="-1">+ Novo endereço</button></div>
    ${s.addr >= 0 ? `<div class="sel-card on">${I("pin", 20, 2)}<span style="flex:1;font-size:14px;line-height:1.4"><b>${esc(addrs[s.addr].label)}</b><br><span class="muted">${esc(addrLine(addrs[s.addr]))}</span></span></div>` : `
    <div class="stack">
      <div class="grid3"><label class="field">CEP<input class="input soft" data-bind="ck.cep" data-mask="cep" inputmode="numeric" value="${esc(s.cep)}" placeholder="88000-000"></label><label class="field">Número<input class="input soft ${s.err === "num" ? "err" : ""}" data-bind="ck.num" inputmode="numeric" value="${esc(s.num)}"></label></div>
      <label class="field">Rua<input class="input soft ${s.err === "street" ? "err" : ""}" id="ck-street" data-bind="ck.street" value="${esc(s.street)}" placeholder="Preenche sozinho pelo CEP"></label>
      <label class="field">Bairro e cidade<input class="input soft" id="ck-hood" data-bind="ck.hood" value="${esc(s.hood)}"></label>
      <label class="field">Complemento / referência<input class="input soft" data-bind="ck.comp" value="${esc(s.comp)}" placeholder="Ex.: empresa X, recepção, 2º andar"></label>
      <div class="chips">${["Trabalho", "Casa", "Outro"].map((l) => `<button class="chip-btn press" aria-pressed="${s.label === l}" data-a="cklabel" data-v="${l}">${l}</button>`).join("")}</div>
    </div>`}
    <div class="note">${I("clock", 18, 2.2)}<span>${hasParty ? `<b>Encomenda para ${esc(when)}</b>${hasParty.time ? " às " + esc(hasParty.time) : ""}.` : `<b>Você recebe ${esc(when)}</b>, em mãos no seu endereço.<br><span style="font-size:12px;opacity:.85">Pedidos até ${CONFIG.cutoff.h}h${pad2(CONFIG.cutoff.m)}. De sexta a domingo, a entrega fica pra segunda.</span>`}</span></div>
  </section>`}
  <section class="panel"><h2>Pagamento</h2>
    <div class="sel-card on" style="align-items:center"><span style="width:40px;height:40px;border-radius:12px;background:#fff;color:var(--brand);display:flex;align-items:center;justify-content:center;border:1px solid #F3D3DC">${I("tag", 20)}</span><span style="flex:1"><b>Pix</b><div class="muted" style="font-size:12px">Código válido por ${CONFIG.pixHours}h</div></span><span class="mark" style="background:var(--brand);border-color:var(--brand)">${I("check", 13, 3.4)}</span></div></section>
  <section class="panel"><h2>Seu pedido</h2>
    ${cart.map((it) => `<div class="sum-row"><span><b>${it.type === "party" ? "" : it.qty + "× "}</b>${esc(itemTitle(c, it))}</span><span>${brl(itemTotal(c, it))}</span></div>`).join("")}
    <div style="height:1px;background:var(--line)"></div>
    <div class="sum-row muted"><span>Entrega</span><span style="color:var(--green);font-weight:700">Grátis</span></div>
    <div class="sum-row total"><span>Total</span><span>${brl(total)}</span></div></section>
  ${s.err && !["phone", "num", "street"].includes(s.err) ? `<div class="pad"><div class="err-msg" role="alert">${esc(s.err)}</div></div>` : ""}
  </main>
  <div class="actionbar"><button class="btn split press" data-a="placeorder"><span>Fazer pedido e gerar Pix</span><span>${brl(total)}</span></button></div>`;
};
const initials = (n) => String(n || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?";
const addrLine = (a) => [a.street && a.street + (a.num ? ", " + a.num : ""), a.comp, a.hood].filter(Boolean).join(" · ");

function findOrder(id) { return data.st.myOrders.find((o) => o.id === id) || data.st.allOrders.find((o) => o.id === id); }

VIEWS.pix = () => {
  const o = findOrder(route.path[1]);
  if (!o) return data.st.ready ? notFound("Pedido não encontrado") : loading();
  const s = effStatus(o);
  if (["confirmado", "separado", "entregue"].includes(s) && !V["seenok_" + o.id]) return confirmedView(o);
  if (["confirmado", "separado", "entregue"].includes(s)) { setTimeout(() => go("#/pedido/" + o.id)); return ""; }
  if (s === "cancelado") return `<main class="screen">${bar("Pedido " + orderNo(o), "#/pedidos")}<div class="center pad" style="padding-top:48px"><div class="big-ic" style="background:var(--soft);color:var(--muted)">${I("x", 34, 2.4)}</div><h1>Pedido cancelado</h1><p>${o.status === "cancelado" ? "Esse pedido foi cancelado." : `O Pix não foi confirmado em ${CONFIG.pixHours}h, então o pedido foi cancelado.`}</p><a href="#/cardapio" class="btn press" style="margin-top:12px">Fazer um novo pedido</a></div></main>`;
  if (s === "comprovante") return `<main class="screen" style="padding-bottom:30px">${bar("Pedido " + orderNo(o), "#/pedidos")}
    <div class="center pad" style="padding-top:36px"><div class="big-ic" style="background:#FFF4C2;color:#8A6A00">${I("hour", 34, 2)}</div><h1>Aguardando confirmação</h1><p>Assim que a gente conferir seu comprovante, o pedido ${orderNo(o)} aparece aqui como confirmado.</p></div>
    <div class="pad"><div class="card">${timeline(o)}</div></div>
    <div class="pad stack"><a class="btn-o wa press" href="${waProof(o)}" target="_blank" rel="noopener">${I("wa", 18)} Abrir o WhatsApp de novo</a><a href="#/" class="btn press">Voltar ao início</a></div></main>`;
  const showPix = s === "aguardando_pix" || V["retry_" + o.id];
  if (s === "recusado" && !showPix) return `<main class="screen" style="padding-bottom:30px">${bar("Pedido " + orderNo(o), "#/pedidos")}
    <div class="center pad" style="padding-top:36px"><div class="big-ic" style="background:var(--danger-soft);color:var(--danger)">${I("alert", 34, 2.4)}</div><h1>Não conseguimos confirmar seu pagamento</h1><p>Calma, seu pedido ${orderNo(o)} continua guardado. É só resolver o Pix dentro do prazo.</p></div>
    <div class="pad stack"><div class="card"><div style="font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.04em">MOTIVO</div><div style="font-weight:700;margin-top:4px">${esc(o.rejectReason || "Pagamento não identificado")}</div><div class="muted" style="font-size:13px;margin-top:2px">Valor do pedido: ${brl(o.total)}</div></div>
    <div class="note">${I("clock", 18, 2.2)}<span>O pedido é cancelado sozinho se o Pix não for confirmado em <b data-countdown="${o.pixExpiresAt}">${countdown(o.pixExpiresAt)}</b>.</span></div>
    <button class="btn press" data-a="retrypix" data-id="${o.id}">Ver o Pix e tentar de novo</button>
    <a class="btn-o wa press" href="${waLink(CONFIG.whatsapp, "Oi! Tive um problema com o Pix do pedido " + orderNo(o) + ".")}" target="_blank" rel="noopener">Falar com a gente no WhatsApp</a>
    <button class="link" style="align-self:center" data-a="cancelorder" data-id="${o.id}">Cancelar pedido</button></div></main>`;
  const payload = pixPayload({ key: CONFIG.pixKey, name: CONFIG.pixName, city: CONFIG.pixCity, amount: o.total, txid: "DOCELY" + String(o.number).padStart(4, "0") });
  return `<main class="screen" style="background:var(--soft);padding-bottom:30px">${bar("Pagar com Pix", "#/pedidos")}
  <div class="pad stack">
    <div class="pix-box"><div class="muted" style="font-size:13px;font-weight:600">Pedido ${orderNo(o)}</div><div class="font-d" style="font-size:34px;font-weight:800;margin-top:-6px">${brl(o.total)}</div>
      <div class="note" style="padding:6px 12px;border-radius:99px;font-weight:700">${I("clock", 14, 2.4)} Vence em <span data-countdown="${o.pixExpiresAt}">${countdown(o.pixExpiresAt)}</span></div>
      <div class="qr" role="img" aria-label="QR Code do Pix">${qrSvg(payload)}</div>
      <button class="btn press" data-a="copypix" data-p="${esc(payload)}">${I("copy", 18, 2.2)} <span>Copiar código Pix</span></button>
      <details style="width:100%;font-size:12px;color:var(--muted)"><summary style="cursor:pointer;min-height:32px">Ver o código</summary><div style="word-break:break-all;font-family:ui-monospace,monospace;margin-top:6px;user-select:all">${esc(payload)}</div></details>
    </div>
    <div class="card stack" style="font-size:14px">
      <div class="row"><span class="avatar" style="width:24px;height:24px;font-size:12px;background:var(--ink)">1</span>Copie o código e pague no app do seu banco</div>
      <div class="row"><span class="avatar" style="width:24px;height:24px;font-size:12px;background:var(--ink)">2</span>Toque no botão verde e mande o comprovante</div></div>
    <a class="btn wa press" href="${waProof(o)}" target="_blank" rel="noopener" data-a="sentproof" data-id="${o.id}">${I("wa", 20)} Já paguei, enviar comprovante</a>
  </div></main>`;
};
function waProof(o) { return waLink(CONFIG.whatsapp, `Oi! Segue o comprovante do Pix do pedido ${orderNo(o)} (${brl(o.total)}) - ${o.customer && o.customer.name ? o.customer.name : ""}`); }
function countdown(at) {
  const ms = Math.max(0, at - Date.now()); const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000); const s = Math.floor((ms % 60000) / 1000);
  return h + "h " + pad2(m) + "min " + pad2(s) + "s";
}
function qrSvg(text) {
  try { const q = window.qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
  catch (e) { return '<p class="muted" style="font-size:12px">QR indisponível. Use o código.</p>'; }
}
function confirmedView(o) {
  V["seenok_" + o.id] = true;
  return `<main class="screen" style="padding-bottom:30px">
  <div style="background:var(--green);color:#fff;padding:calc(44px + var(--safe-t)) 20px 26px" class="center"><div class="big-ic" style="background:#fff;color:var(--green);width:72px;height:72px">${I("check", 36, 2.8)}</div>
    <h1>Pedido confirmado!</h1><p style="color:#fff;opacity:.95">Pedido ${orderNo(o)} · você recebe <b>${esc(fmtDate(parseYmd(o.deliveryDate), "rel"))}</b>.<br>Em mãos, ${o.address && o.address.pickup ? "na retirada" : "no seu endereço"}.</p></div>
  <div class="pad stack"><div class="card">${timeline(o)}</div><a href="#/pedido/${o.id}" class="btn press">Acompanhar pedido</a><a href="#/" class="btn-o press">Voltar ao início</a></div></main>`;
}
function timeline(o) {
  const s = effStatus(o); const paid = isPaid(o);
  const at = (st) => { const h = (o.history || []).filter((x) => x.s === st).pop(); return h ? fmtDate(new Date(h.at), "short") + " · " + fmtWhen(h.at).replace(/^(\d)/, "$1") : ""; };
  const steps = paid ? [
    ["Pedido confirmado", at("confirmado") || "Pix aprovado", "confirmado"],
    ["Separado pra você", s === "confirmado" ? "a gente separa o seu" : at("separado") || "guardadinho pra entrega", "separado"],
    ["Entregue", "Bom apetite!", "entregue"]
  ] : [
    ["Pedido feito", at("aguardando_pix"), "aguardando_pix"],
    ["Comprovante enviado", s === "comprovante" ? "pelo WhatsApp" : "falta enviar", "comprovante"],
    ["Pagamento aprovado", s === "comprovante" ? "normalmente leva poucos minutos" : "", "confirmado"]
  ];
  const order = paid ? ["confirmado", "separado", "entregue"] : ["aguardando_pix", "comprovante", "confirmado"];
  const cur = Math.max(0, order.indexOf(s));
  return steps.map(([l, sub, k], i) => { const done = i < cur || (i === cur && (s === "entregue" || paid)); const now = i === cur && !done;
    return `<div class="tl-step ${done ? "done" : ""} ${now ? "now" : ""}"><div class="rail"><span class="pt">${done ? I("check", 12, 3.4) : ""}</span>${i < steps.length - 1 ? '<span class="ln"></span>' : ""}</div><div style="padding-bottom:12px"><b>${esc(l)}</b><small>${esc(sub)}</small></div></div>`; }).join("");
}

VIEWS.pedido = () => {
  const o = findOrder(route.path[1]);
  if (!o) return data.st.ready ? notFound("Pedido não encontrado") : loading();
  const s = effStatus(o); const c = cat();
  if (!isPaid(o) && s !== "cancelado") { setTimeout(() => go("#/pix/" + o.id)); return ""; }
  const step = { confirmado: 0, separado: 1, entregue: 2 }[s];
  const titles = { confirmado: ["Pedido confirmado", "A gente já separa o seu"], separado: ["Separado!", "Pronto pra ir até você"], entregue: ["Entregue!", "Bom apetite!"], cancelado: ["Cancelado", "Esse pedido foi cancelado"] }[s];
  return `<main class="screen" style="background:var(--soft);padding-bottom:110px">${bar("Meu pedido", "#/pedidos")}
  <section class="panel" style="margin-top:0;gap:14px">
    <div class="row between" style="align-items:flex-start"><div><div class="muted" style="font-size:13px;font-weight:600">Pedido ${orderNo(o)}</div><div class="font-d" style="font-size:26px;font-weight:800">${titles[0]}</div><div class="muted" style="font-size:14px">${titles[1]}</div></div>
      ${s !== "cancelado" ? `<div style="text-align:right"><div class="muted" style="font-size:12px">${s === "entregue" ? "Entregue em" : "Você recebe"}</div><div style="font-weight:800">${esc(fmtDate(parseYmd(o.deliveryDate), "short"))}</div></div>` : ""}</div>
    ${s !== "cancelado" ? `<div class="bars3">${[0, 1, 2].map((i) => `<span class="${i <= step ? "on" : ""}"></span>`).join("")}</div><div>${timeline(o)}</div>` : ""}
  </section>
  <section class="panel"><h2>Itens</h2>${(o.items || []).map((it) => `<div><div class="sum-row"><span><b>${it.type === "party" ? "" : it.qty + "× "}</b>${esc(itemTitle(c, it))}</span><span>${brl(it.price * (it.qty || 1))}</span></div><div class="muted" style="font-size:12px">${esc(itemDesc(c, it))}</div></div>`).join("")}
    <div style="height:1px;background:var(--line)"></div><div class="sum-row total"><span>Total pago no Pix</span><span>${brl(o.total)}</span></div></section>
  ${o.address ? `<section class="panel"><div class="row" style="align-items:flex-start">${I("pin", 20, 2)}<span style="font-size:14px;line-height:1.4">${o.address.pickup ? "<b>Retirada</b><br><span class='muted'>Local combinado pelo WhatsApp</span>" : `<b>${esc(o.address.label)}</b><br><span class="muted">${esc(addrLine(o.address))}</span>`}</span></div></section>` : ""}
  </main>
  <div class="actionbar"><a class="btn-o wa press" style="flex:1;height:52px" href="${waLink(CONFIG.whatsapp, "Oi! Sobre o pedido " + orderNo(o) + "…")}" target="_blank" rel="noopener">Falar no WhatsApp</a><button class="btn press" style="flex:1;height:52px" data-a="reorder" data-id="${o.id}">Pedir de novo</button></div>`;
};

VIEWS.pedidos = () => {
  V.ped = V.ped || { tab: "ped" };
  if (!user()) return `<main class="screen with-nav"><h1 class="page-title">Pedidos</h1><div class="empty"><b>Entre pra ver seus pedidos</b>Seus pedidos e encomendas aparecem aqui.<div style="margin-top:18px"><a href="#/entrar?next=pedidos" class="btn press" style="display:inline-flex;width:auto;padding:0 28px">Entrar ou criar conta</a></div></div></main>${bagbar()}${nav("pedidos")}`;
  const all = [...data.st.myOrders].sort((a, b) => b.createdAt - a.createdAt);
  const party = all.filter((o) => o.kind === "party"); const normal = all.filter((o) => o.kind !== "party");
  const act = normal.filter(isActive); const old = normal.filter((o) => !isActive(o));
  const card = (o) => { const s = effStatus(o); const st = STATUS[s]; const href = isPaid(o) ? "#/pedido/" + o.id : s === "cancelado" ? "#/pedido/" + o.id : "#/pix/" + o.id;
    return `<a href="${href}" class="card press" style="display:flex;flex-direction:column;gap:8px;${isActive(o) ? "border:1.5px solid var(--brand)" : ""}">
      <div class="row between"><span class="muted" style="font-size:13px;font-weight:600">${orderNo(o)} · ${fmtDate(new Date(o.createdAt), "short")}</span><span class="status ${st.cls}">${st.label}</span></div>
      <div style="font-size:14px;font-weight:600;line-height:1.35">${esc((o.items || []).map((i) => (i.type === "party" ? "" : i.qty + "× ") + itemTitle(cat(), i)).join(" · "))}</div>
      ${isPaid(o) && s !== "entregue" ? `<div class="bars3">${[0, 1, 2].map((i) => `<span class="${i <= { confirmado: 0, separado: 1 }[s] ? "on" : ""}"></span>`).join("")}</div>` : ""}
      <div class="row between"><span class="price">${brl(o.total)}</span>${isActive(o) ? `<span style="font-weight:800;color:var(--brand);font-size:14px">${isPaid(o) ? "Acompanhar ›" : s === "comprovante" ? "Ver status ›" : "Pagar Pix ›"}</span>` : `<button class="btn-o brand press" style="width:auto;height:36px;padding:0 14px;font-size:13px" data-a="reorder" data-id="${o.id}">Pedir de novo</button>`}</div></a>`; };
  return `<main class="screen with-nav"><h1 class="page-title">Pedidos</h1>
  <div class="pad stack" style="padding-top:6px">
    <div class="seg" role="tablist">${[["ped", "Pedidos"], ["enc", "Encomendas"]].map(([k, l]) => `<button role="tab" aria-selected="${V.ped.tab === k}" data-a="pedtab" data-k="${k}">${l}</button>`).join("")}</div>
    ${V.ped.tab === "ped" ? `
      ${act.length ? `<div style="font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.05em">EM ANDAMENTO</div>${act.map(card).join("")}` : ""}
      ${old.length ? `<div style="font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.05em;margin-top:4px">ANTERIORES</div>${old.map(card).join("")}` : ""}
      ${!normal.length ? `<div class="empty"><b>Nenhum pedido ainda</b>Quando você pedir, ele aparece aqui pra acompanhar.<div style="margin-top:18px"><a href="#/cardapio" class="btn press" style="display:inline-flex;width:auto;padding:0 28px">Ver cardápio</a></div></div>` : ""}`
    : `<a href="#/encomenda" class="btn press">${I("plus", 18, 2.6)} Nova encomenda para festa</a>
      ${party.length ? `<div style="font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.05em;margin-top:4px">MINHAS ENCOMENDAS</div>${party.map((o) => { const it = (o.items || []).find((i) => i.type === "party") || {}; const d = parseYmd(o.deliveryDate); const s = effStatus(o); const st = STATUS[s];
        return `<a href="${isPaid(o) || s === "cancelado" ? "#/pedido/" + o.id : "#/pix/" + o.id}" class="card press row" style="align-items:stretch"><div style="width:52px;border-radius:12px;background:var(--brand-soft);color:var(--brand-d);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;padding:6px 0"><span style="font-size:11px;font-weight:800">${["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][d.getMonth()]}</span><span class="font-d" style="font-size:22px;font-weight:800;line-height:1">${pad2(d.getDate())}</span></div>
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px"><div class="row between" style="gap:8px"><b>${orderNo(o)}</b><span class="status ${st.cls}">${st.label}</span></div><div class="muted" style="font-size:13px">${it.total || ""} docinhos${it.mousses ? " + " + it.mousses + " mousses" : ""} · ${brl(o.total)}</div></div></a>`; }).join("")}` : `<div class="empty"><b>Nenhuma encomenda</b>Faça a encomenda de docinhos pra sua festa.</div>`}`}
  </div></main>${bagbar()}${nav("pedidos")}`;
};

VIEWS.conta = () => {
  if (!user()) return `<main class="screen with-nav"><h1 class="page-title">Conta</h1><div class="pad stack"><div class="card center" style="padding:24px"><div class="avatar" style="background:var(--soft);color:var(--muted)">${I("user", 26, 1.9)}</div><b style="font-size:17px">Entre na sua conta</b><p style="font-size:14px">Pra acompanhar pedidos e salvar seus endereços.</p><a href="#/entrar?next=conta" class="btn press">Entrar ou criar conta</a></div>
    <button class="menu-item press" style="border-radius:14px" data-a="help"><span class="mi">${I("help", 18)}</span><span class="tx"><b>Falar com a gente</b><small>Pelo WhatsApp</small></span></button></div></main>${bagbar()}${nav("conta")}`;
  const p = prof(); const active = data.st.myOrders.filter(isActive).sort((a, b) => b.createdAt - a.createdAt)[0];
  const item = (a, ic, l, sm, href) => `${href ? `<a href="${href}"` : `<button data-a="${a}"`} class="menu-item press"><span class="mi">${I(ic, 18)}</span><span class="tx"><b>${l}</b>${sm ? `<small>${sm}</small>` : ""}</span><span style="color:#CDBFB4">${I("chev", 18, 2.2)}</span>${href ? "</a>" : "</button>"}`;
  return `<main class="screen with-nav" style="background:var(--soft)"><h1 class="page-title" style="background:var(--bg)">Conta</h1>
  <section style="background:#fff;padding:18px 16px" class="row"><div class="avatar">${esc(initials(p.name || user().name))}</div><div style="flex:1;min-width:0"><b style="font-size:18px">${esc(p.name || user().name || "Você")}</b><div class="muted" style="font-size:13px;overflow:hidden;text-overflow:ellipsis">${esc(user().email || "")}${p.phone ? " · " + esc(p.phone) : ""}</div></div><a href="#/dados" class="link">Editar</a></section>
  ${active ? `<a href="${isPaid(active) ? "#/pedido/" : "#/pix/"}${active.id}" class="card press row" style="margin:10px 16px 0;border:1.5px solid var(--brand)"><span style="width:10px;height:10px;border-radius:50%;background:${isPaid(active) ? "var(--green)" : "#E2A31B"}"></span><span style="flex:1"><small class="muted" style="font-weight:700;font-size:11px;letter-spacing:.04em">PEDIDO EM ANDAMENTO</small><b style="display:block;font-size:14px">${orderNo(active)} · ${STATUS[effStatus(active)].label.toLowerCase()}</b></span><span style="color:var(--brand)">${I("chev", 18, 2.2)}</span></a>` : ""}
  <div class="menu-sec"><h3>PEDIDOS</h3>${item("", "receipt", "Meus pedidos", "Acompanhar e pedir de novo", "#/pedidos")}${item("", "bell", "Notificações", "Atualizações dos seus pedidos", "#/notificacoes")}</div>
  <div class="menu-sec"><h3>CONTA</h3>${item("", "pin", "Meus endereços", (p.addresses || []).map((a) => a.label).join(", ") || "Nenhum salvo", "#/enderecos")}${item("", "user", "Dados da conta", "Nome e WhatsApp", "#/dados")}${data.isAdmin() ? item("", "panel", "Painel de pedidos", "Só pra vocês", "#/painel") : ""}</div>
  <div class="menu-sec"><h3>AJUDA</h3>${item("help", "help", "Falar com a gente", "Pelo WhatsApp")}${item("", "info", "Termos e privacidade", "", "#/termos")}</div>
  <div class="pad"><button class="btn-o press" style="color:var(--brand)" data-a="logout">${I("out", 18)} Sair da conta</button><p class="muted" style="text-align:center;font-size:12px;margin:12px 0 0">docely · versão 1.0${DEMO ? " · modo de teste" : ""}</p></div>
  </main>${bagbar()}${nav("conta")}`;
};

VIEWS.dados = () => {
  if (!user()) { setTimeout(() => go("#/entrar?next=dados")); return ""; }
  const p = prof(); V.dados = V.dados || { name: p.name || user().name || "", phone: p.phone || "", err: "" };
  const s = V.dados;
  return `<main class="screen" style="padding-bottom:110px">${bar("Dados da conta", "#/conta")}
  <form class="pad stack" data-form="dados" novalidate>
    <label class="field">Nome<input class="input" data-bind="dados.name" value="${esc(s.name)}" autocomplete="name"></label>
    <label class="field">WhatsApp<input class="input" data-bind="dados.phone" data-mask="phone" type="tel" inputmode="numeric" value="${esc(s.phone)}" placeholder="(48) 9 0000-0000"></label>
    <label class="field">E-mail<input class="input" value="${esc(user().email || "")}" disabled style="opacity:.7"></label>
    ${s.err ? `<div class="err-msg" role="alert">${esc(s.err)}</div>` : ""}
    <button type="submit" class="btn press">Salvar</button></form></main>`;
};

VIEWS.enderecos = () => {
  if (!user()) { setTimeout(() => go("#/entrar?next=enderecos")); return ""; }
  const list = prof().addresses || [];
  return `<main class="screen" style="padding-bottom:40px">${bar("Meus endereços", "#/conta")}
  <div class="pad stack">${list.length ? list.map((a, i) => `<div class="card row" style="align-items:flex-start">${I("pin", 20, 2)}<span style="flex:1;font-size:14px;line-height:1.4"><b>${esc(a.label)}</b><br><span class="muted">${esc(addrLine(a))}</span></span><button class="round-btn press" data-a="deladdr" data-i="${i}" aria-label="Apagar endereço ${esc(a.label)}">${I("trash", 18, 2.2)}</button></div>`).join("") : `<div class="empty"><b>Nenhum endereço salvo</b>Você salva um endereço na hora de fechar o pedido.</div>`}</div></main>`;
};

VIEWS.notificacoes = () => {
  const list = notifs(); const seen = LSget("seen_" + (user() ? user().uid : "x"), 0);
  const K = { ok: ["#E3F2EA", "#2F7D4F"], brand: ["#F8E4EA", "#B4234D"], wait: ["#F6EFC4", "#5C4E3F"], red: ["#FFE4DC", "#C2410C"], gray: ["#F1E9E2", "#6E5D54"] };
  return `<main class="screen" style="padding-bottom:40px">${bar("Notificações", "#/", list.some((n) => n.at > seen) ? `<button class="act" data-a="readall">Ler todas</button>` : "")}
  ${!user() ? `<div class="empty"><b>Entre pra ver suas notificações</b>As atualizações dos seus pedidos aparecem aqui.</div>` : !list.length ? `<div class="empty" style="padding-top:60px"><b>Tudo calmo por aqui</b>Quando seu pedido andar, a gente avisa aqui.</div>` :
  list.map((n) => `<a href="${n.href}" class="notif press ${n.at > seen ? "unread" : ""}"><span class="ni" style="background:${K[n.kind][0]};color:${K[n.kind][1]}">${I(n.ic, 20, 2.2)}</span><span class="tx"><span class="row between" style="gap:8px;align-items:flex-start"><b>${esc(n.title)}</b><time>${fmtWhen(n.at)}</time></span><p>${esc(n.text)}</p></span>${n.at > seen ? '<span class="udot"></span>' : ""}</a>`).join("")}</main>`;
};

VIEWS.termos = () => `<main class="screen">${bar("Termos e privacidade", "#/conta")}<div class="pad stack" style="font-size:14px;line-height:1.55;color:var(--muted)">
  <p><b style="color:var(--ink)">O que a gente guarda:</b> seu nome, e-mail, WhatsApp, endereços que você salvar e o histórico dos seus pedidos. Isso serve só pra preparar e entregar seus pedidos e falar com você sobre eles.</p>
  <p><b style="color:var(--ink)">Pagamento:</b> o Pix é feito direto do seu banco para a nossa conta. A gente não vê nem guarda dados do seu banco.</p>
  <p><b style="color:var(--ink)">Prazos:</b> pedidos feitos até ${CONFIG.cutoff.h}h${pad2(CONFIG.cutoff.m)} de segunda a quinta são entregues no próximo dia útil; de sexta a domingo, na segunda. O Pix vale por ${CONFIG.pixHours}h; depois disso o pedido é cancelado.</p>
  <p><b style="color:var(--ink)">Seus dados:</b> quer apagar sua conta ou seus dados? Fale com a gente pelo WhatsApp que a gente resolve.</p></div></main>`;

function notFound(t = "Página não encontrada") { return `<main class="screen">${bar(t, "#/")}<div class="empty" style="padding-top:60px"><b>${esc(t)}</b>Volte ao início e tente de novo.<div style="margin-top:18px"><a href="#/" class="btn press" style="display:inline-flex;width:auto;padding:0 28px">Ir ao início</a></div></div></main>`; }
function loading() { return `<main class="screen"><div class="empty" style="padding-top:120px"><div class="spin" style="border-color:var(--line);border-top-color:var(--brand);margin:0 auto"></div></div></main>`; }

/* ============ PAINEL ============ */
function aNav(active) {
  const it = (h, k, ic, l) => `<a href="${h}" ${active === k ? 'aria-current="page"' : ""}>${I(ic, 20, 1.9)}${l}</a>`;
  return `<nav class="a-nav" aria-label="Painel">${it("#/painel", "ped", "receipt", "Pedidos")}${it("#/painel/producao", "prod", "bag", "Produção")}${it("#/painel/precos", "precos", "tag", "Preços")}${it("#/", "sair", "out", "Sair do painel")}</nav>`;
}
function guardAdmin() {
  if (!user()) { setTimeout(() => go("#/entrar?next=painel")); return false; }
  if (!data.isAdmin()) { setTimeout(() => { toast("Essa área é só pra equipe."); go("#/"); }); return false; }
  return true;
}
const custLine = (o) => esc((o.customer && o.customer.name) || "Cliente");
VIEWS.painel = () => {
  if (!guardAdmin()) return "";
  const sub = route.path[1] || "";
  if (sub === "producao") return adminProd();
  if (sub === "precos") return adminPrecos();
  V.adm = V.adm || { tab: "ativos" };
  const c = cat(); const all = [...data.st.allOrders].sort((a, b) => b.createdAt - a.createdAt);
  const today = startOfDay(new Date()).getTime();
  const todays = all.filter((o) => o.createdAt >= today);
  const paidToday = todays.filter(isPaid);
  const sold = paidToday.reduce((s, o) => s + o.total, 0); const cost = paidToday.reduce((s, o) => s + (o.cost || 0), 0);
  const groups = { ativos: all.filter((o) => isActive(o) && o.kind !== "party"), enc: all.filter((o) => o.kind === "party" && isActive(o)), fim: all.filter((o) => !isActive(o)) };
  const pend = all.filter((o) => effStatus(o) === "comprovante").length;
  const list = groups[V.adm.tab];
  const card = (o) => {
    const s = effStatus(o); const pill = { aguardando_pix: ["p-gray", "Aguardando Pix"], comprovante: ["p-wait", "Aguardando confirmação"], confirmado: ["p-ok", "Pix confirmado"], separado: ["p-ok", "Separado"], entregue: ["p-gray", "Entregue"], recusado: ["p-red", "Recusado"], cancelado: ["p-gray", o.status === "cancelado" ? "Cancelado" : "Pix expirou"] }[s];
    const btns = {
      aguardando_pix: `<a class="a-btn acc" style="display:flex;align-items:center;justify-content:center" href="${waLink(phoneDigits(o), "Oi " + (o.customer.name || "") + "! Vi seu pedido " + orderNo(o) + " no docely 😊")}" target="_blank" rel="noopener">Chamar no WhatsApp</a><button class="a-btn gray" data-a="adm" data-op="cancel" data-id="${o.id}">Cancelar pedido</button>`,
      comprovante: `<button class="a-btn" data-a="adm" data-op="approve" data-id="${o.id}">Aprovar pagamento</button><button class="a-btn red" data-a="adm" data-op="reject" data-id="${o.id}">Recusar</button>`,
      confirmado: `<button class="a-btn" data-a="adm" data-op="separado" data-id="${o.id}">Marcar como separado</button>`,
      separado: `<button class="a-btn" data-a="adm" data-op="entregue" data-id="${o.id}">Marcar como entregue</button>`,
      entregue: `<button class="a-btn gray" disabled>Entregue</button>`,
      recusado: `<button class="a-btn gray" data-a="adm" data-op="undo" data-id="${o.id}">Desfazer recusa</button>`,
      cancelado: ""
    }[s];
    return `<div class="a-card">
      <div class="a-row" style="justify-content:space-between"><b style="font-size:15px">${custLine(o)} <span class="a-muted" style="font-weight:500;font-size:13px">${orderNo(o)}</span></b><b>${brl(o.total)}</b></div>
      <div><span class="pill ${pill[0]}">${pill[1]}</span></div>
      <div class="a-items">${esc((o.items || []).map((i) => (i.type === "party" ? "" : i.qty + "× ") + itemTitle(c, i) + " (" + itemDesc(c, i) + ")").join(" · "))}</div>
      <div class="a-row" style="justify-content:space-between;align-items:flex-start"><span class="a-sm" style="flex:1;min-width:0">${o.address && o.address.pickup ? "Retirada" : esc(o.address ? o.address.label + " · " + addrLine(o.address) : "")}<br>Entrega: ${esc(fmtDate(parseYmd(o.deliveryDate), "short"))}${o.party && o.party.time ? " às " + esc(o.party.time) : ""}${s === "recusado" && o.rejectReason ? "<br>Motivo: " + esc(o.rejectReason) : ""}</span></div>
      ${btns ? `<div style="display:flex;flex-direction:column;gap:8px">${btns}</div>` : ""}</div>`;
  };
  return `<div class="adm"><div class="a-top"><div><small>PAINEL · DOCELY</small><h1>${esc(fmtDate(new Date(), "long").replace(/^./, (x) => x.toUpperCase()))}</h1></div>${pend ? `<span class="pill p-wait">${pend} pra aprovar</span>` : ""}</div>
  <div class="a-body">
    <div class="kpis"><div class="kpi"><small>Pedidos hoje</small><b>${todays.length}</b></div><div class="kpi"><small>Vendido hoje</small><b>${brl(sold).replace(",00", "")}</b></div><div class="kpi"><small>Lucro est.</small><b>${brl(sold - cost).replace(",00", "")}</b></div></div>
    <div class="seg" role="tablist" style="grid-template-columns:repeat(3,1fr)">${[["ativos", "Ativos (" + groups.ativos.length + ")"], ["enc", "Encomendas (" + groups.enc.length + ")"], ["fim", "Concluídos"]].map(([k, l]) => `<button role="tab" aria-selected="${V.adm.tab === k}" data-a="admtab" data-k="${k}">${l}</button>`).join("")}</div>
    ${list.length ? list.map(card).join("") : `<div class="a-card" style="align-items:center;text-align:center;padding:28px"><b>Nada por aqui</b><span class="a-sm">Quando entrar um pedido, ele aparece nesta lista na hora.</span></div>`}
  </div>${aNav("ped")}</div>`;
};
const phoneDigits = (o) => { const d = String((o.customer && o.customer.phone) || "").replace(/\D/g, ""); return d ? (d.startsWith("55") ? d : "55" + d) : CONFIG.whatsapp; };

function adminProd() {
  const c = cat(); V.prod = V.prod || { done: {} };
  const orders = data.st.allOrders.filter((o) => ["confirmado"].includes(effStatus(o)));
  const byDay = {};
  for (const o of orders) { (byDay[o.deliveryDate] = byDay[o.deliveryDate] || []).push(o); }
  const days = Object.keys(byDay).sort();
  const block = (day) => {
    const os = byDay[day]; const mous = {}, extras = {}, doces = {}; let boxes = 0;
    for (const o of os) for (const it of o.items || []) {
      if (it.type === "mousse") { const k = it.mousse + "|" + it.size; mous[k] = (mous[k] || 0) + it.qty; for (const e of it.extras || []) extras[e] = (extras[e] || 0) + it.qty; if (it.jelly) extras["j:" + it.jelly] = (extras["j:" + it.jelly] || 0) + it.qty; }
      if (it.type === "box") { boxes += it.qty; for (const [d, n] of Object.entries(it.flavors || {})) doces[d] = (doces[d] || 0) + n * it.qty; }
      if (it.type === "party") { for (const [d, n] of Object.entries(it.flavors || {})) doces[d] = (doces[d] || 0) + n; if (it.mousses) mous["festa|trad"] = (mous["festa|trad"] || 0) + it.mousses; }
    }
    const mRows = Object.entries(mous).map(([k, n]) => { const [mid, sz] = k.split("|"); const nm = mid === "festa" ? "Mousses de encomenda (sabor a combinar)" : (byId(c.mousses, mid) || {}).name || mid; const id = day + k; const on = !!V.prod.done[id];
      return `<button class="a-card a-row" style="flex-direction:row;text-align:left;opacity:${on ? .5 : 1}" data-a="proddone" data-k="${esc(id)}" aria-pressed="${on}"><span class="check ${on ? "on" : ""}">${on ? I("check", 13, 3.4) : ""}</span><span style="flex:1"><b style="font-size:15px">${esc(nm)}</b><span class="a-sm" style="display:block">${esc(mid === "festa" ? "" : (byId(c.sizes, sz) || {}).name || "")}</span></span><b class="font-d" style="font-size:24px">${n}</b></button>`; }).join("");
    const chip = (l, n) => `<div class="a-card a-row" style="flex-direction:row;justify-content:space-between;padding:12px"><span style="font-size:13px">${esc(l)}</span><b>${n}</b></div>`;
    const eRows = Object.entries(extras).map(([k, n]) => chip(k.startsWith("j:") ? (byId(c.jellies, k.slice(2)) || {}).name || k : (byId(c.extras, k) || {}).name || k, n)).join("");
    const dRows = Object.entries(doces).map(([k, n]) => chip((byId(c.doces, k) || {}).name || k, n)).join("");
    return `<h2 class="a-h">ENTREGA ${esc(fmtDate(parseYmd(day), "long").toUpperCase())} · ${os.length} PEDIDO${os.length > 1 ? "S" : ""}</h2>
      ${mRows ? `<div class="stack" style="gap:8px">${mRows}</div>` : ""}
      ${eRows ? `<h2 class="a-h">COBERTURAS E EXTRAS</h2><div class="grid2">${eRows}</div>` : ""}
      ${dRows ? `<h2 class="a-h">DOCINHOS${boxes ? " · " + boxes + " CAIXINHA" + (boxes > 1 ? "S" : "") : ""}</h2><div class="grid2">${dRows}</div>` : ""}`;
  };
  return `<div class="adm"><div class="a-top"><div><small>PEDIDOS CONFIRMADOS, AINDA NÃO SEPARADOS</small><h1>Produção</h1></div></div>
  <div class="a-body">${days.length ? days.map(block).join("") : `<div class="a-card" style="align-items:center;text-align:center;padding:28px"><b>Nada pra separar</b><span class="a-sm">Os pedidos com Pix aprovado aparecem aqui, somados por dia de entrega.</span></div>`}</div>${aNav("prod")}</div>`;
}

function adminPrecos() {
  V.pr = V.pr || { c: clone(cat()), dirty: false, open: "" };
  const c = V.pr.c;
  const money = (path, v) => `<input class="a-input" inputmode="decimal" data-bind="pr.c.${path}" data-num="1" value="${String(v).replace(".", ",")}" aria-label="valor">`;
  const row = (label, pricePath, price, costPath, cost) => `<div class="a-row" style="padding:6px 0"><span style="flex:1.3;font-size:14px">${esc(label)}</span><span style="flex:1"><span class="a-sm">preço</span>${money(pricePath, price)}</span>${costPath ? `<span style="flex:1"><span class="a-sm">custo</span>${money(costPath, cost)}</span>` : ""}</div>`;
  return `<div class="adm"><div class="a-top"><div><small>CARDÁPIO</small><h1>Preços e sabores</h1></div></div>
  <div class="a-body" style="padding-bottom:180px">
    <h2 class="a-h">TAMANHOS DO MOUSSE</h2><div class="a-card">${c.sizes.map((z, i) => row(z.name + " (" + z.ml + " ml)", `sizes.${i}.price`, z.price, `sizes.${i}.cost`, z.cost) + `<div class="a-sm" style="margin-top:-2px">Lucro por unidade: ${brl(z.price - z.cost)}</div>`).join("")}</div>
    <h2 class="a-h">SABORES DE MOUSSE</h2><div class="a-card">${c.mousses.map((m, i) => `<div class="a-row" style="padding:6px 0"><span style="width:14px;height:14px;border-radius:4px;background:${m.look.body};flex-shrink:0"></span><span style="flex:1;font-size:14px">${esc(m.name)}${m.rank ? ` <span class="a-sm">· #${m.rank} mais pedido</span>` : ""}</span><button class="toggle" role="switch" aria-label="Mostrar ${esc(m.name)} no cardápio" aria-checked="${m.active !== false}" data-a="prtoggle" data-path="mousses.${i}.active"></button></div>`).join("")}
      <div class="a-sm">Desligue um sabor pra ele sumir do cardápio (ex.: acabou o ingrediente).</div></div>
    <h2 class="a-h">GELEIAS E ADICIONAIS</h2><div class="a-card">${c.jellies.map((j, i) => row(j.name, `jellies.${i}.price`, j.price, `jellies.${i}.cost`, j.cost)).join("")}${c.extras.filter((e) => e.id !== "semBase").map((e) => { const i = c.extras.indexOf(e); return row(e.name, `extras.${i}.price`, e.price, `extras.${i}.cost`, e.cost); }).join("")}</div>
    <h2 class="a-h">CAIXINHAS</h2><div class="a-card">${c.boxes.map((b, i) => row("Caixinha com " + b.size, `boxes.${i}.price`, b.price, `boxes.${i}.cost`, b.cost)).join("")}</div>
    <h2 class="a-h">SABORES DE DOCINHO</h2><div class="a-card">${c.doces.map((d, i) => `<div class="a-row" style="padding:6px 0"><span class="circ" style="width:18px;height:18px;background:${d.color}"></span><span style="flex:1;font-size:14px">${esc(d.name)}</span><button class="toggle" role="switch" aria-label="Mostrar ${esc(d.name)}" aria-checked="${d.active !== false}" data-a="prtoggle" data-path="doces.${i}.active"></button></div>`).join("")}</div>
    <h2 class="a-h">ENCOMENDAS</h2><div class="a-card">${row("Cada docinho", "party.pricePerDoce", c.party.pricePerDoce, "party.costPerDoce", c.party.costPerDoce)}${row("Cada mousse", "party.moussePrice", c.party.moussePrice, "party.mousseCost", c.party.mousseCost)}</div>
    <h2 class="a-h">BANNER DE DESTAQUE</h2><div class="a-card"><div class="a-row"><span style="flex:1;font-size:14px">Mostrar no início</span><button class="toggle" role="switch" aria-label="Mostrar banner" aria-checked="${!!c.offer.active}" data-a="prtoggle" data-path="offer.active"></button></div>
      <label class="a-sm">Etiqueta<input class="a-input" data-bind="pr.c.offer.tag" value="${esc(c.offer.tag)}" maxlength="24"></label><label class="a-sm">Título<input class="a-input" data-bind="pr.c.offer.title" value="${esc(c.offer.title)}" maxlength="48"></label><label class="a-sm">Texto<input class="a-input" data-bind="pr.c.offer.text" value="${esc(c.offer.text)}" maxlength="48"></label></div>
  </div>
  <div style="position:fixed;left:50%;transform:translateX(-50%);bottom:calc(76px + var(--safe-b));width:min(456px,calc(100% - 24px));z-index:21"><button class="btn press" data-a="prsave" style="${V.pr.dirty ? "" : "display:none"}">Salvar alterações</button></div>
  ${aNav("precos")}</div>`;
}

function rejectSheet() {
  const id = V.rejecting; if (!id) return "";
  V.rej = V.rej || { reason: REJECT_REASONS[0], other: "" };
  return `<div class="adm" style="min-height:0;background:none"><div class="sheet-bg" data-a="closereject"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Recusar pagamento"><div class="grab" style="background:#52525B"></div><h2 style="font-size:21px">Por que recusar?</h2><p class="a-sm" style="margin:-6px 0 0">O motivo aparece pro cliente, que pode tentar o Pix de novo.</p>
    <div class="reasons">${REJECT_REASONS.map((r) => `<button class="a-card a-row" style="flex-direction:row;text-align:left;border:1.5px solid ${V.rej.reason === r ? "var(--a-acc)" : "transparent"}" data-a="rejreason" data-v="${esc(r)}" aria-pressed="${V.rej.reason === r}"><span class="check ${V.rej.reason === r ? "on" : ""}" style="border-radius:50%">${V.rej.reason === r ? I("check", 13, 3.4) : ""}</span><span style="font-size:14px">${esc(r)}</span></button>`).join("")}</div>
    ${V.rej.reason === "Outro motivo" ? `<input class="a-input" data-bind="rej.other" placeholder="Escreva o motivo" maxlength="80" value="${esc(V.rej.other)}">` : ""}
    <button class="a-btn red" style="background:#4A2228;border:none" data-a="adm" data-op="rejectgo" data-id="${id}">Recusar pagamento</button>
    <button class="a-btn gray" data-a="closereject">Voltar</button></div></div>`;
}

/* ============ render ============ */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, ""); const [p, qs] = h.split("?");
  return { path: (p || "").split("/").filter(Boolean), q: new URLSearchParams(qs || "") };
}
function render() {
  route = parseRoute(); const k = location.hash; const same = k === routeKey; routeKey = k;
  const name = route.path[0] || "inicio";
  const y = same ? window.scrollY : 0;
  let html;
  if (!data.st.ready) html = loading();
  else if (name === "entrar") {
    if (user()) { setTimeout(() => go(nextHash())); html = loading(); }
    else { const nx = route.q.get("next"); const under = nx === "checkout" ? VIEWS.sacola() : (["conta", "pedidos"].includes(nx) ? VIEWS[nx] : VIEWS.inicio)(); html = under + authSheet(); }
  } else {
    const v = VIEWS[name]; html = v ? v() : notFound();
  }
  app.classList.toggle("dark", name === "painel");
  app.classList.toggle("anim", !same);
  document.body.style.background = name === "painel" ? "#161618" : "";
  app.innerHTML = html + (DEMO ? '<div class="demo-flag">MODO DE TESTE</div>' : "") + (name === "painel" ? rejectSheet() : "");
  if (same) window.scrollTo(0, y); else window.scrollTo(0, 0);
  if (!same && name !== "entrar") { const f = app.querySelector("h1"); if (f) { f.setAttribute("tabindex", "-1"); } }
  if (name === "cardapio" && route.q.get("busca") && !same) { const b = document.getElementById("busca"); if (b) b.focus(); }
  setupTimer();
}
function nextHash() { const n = route.q.get("next") || ""; return n === "checkout" ? "#/checkout" : n ? "#/" + n : "#/"; }
function setupTimer() {
  clearInterval(timer);
  const els = app.querySelectorAll("[data-countdown]"); if (!els.length) return;
  timer = setInterval(() => {
    let expired = false;
    els.forEach((el) => { const at = Number(el.dataset.countdown); el.textContent = countdown(at); if (Date.now() > at) expired = true; });
    if (expired) { clearInterval(timer); render(); }
  }, 1000);
}

/* ============ ações ============ */
function setPath(obj, path, val) { const ks = path.split("."); let o = obj; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = val; }
function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj); }
const back = (to) => { if (history.length > 1 && sessionStorage.getItem("dc_nav") === "1") history.back(); else go(to || "#/"); };

const ACT = {
  back: (el, e) => { e.preventDefault(); back(el.dataset.to); },
  cattab: (el) => { V.cat.tab = el.dataset.k; render(); },
  msize: (el) => { V[V.cur].size = el.dataset.v; render(); },
  mjelly: (el) => { V[V.cur].jelly = el.dataset.v; render(); },
  mextra: (el) => { const s = V[V.cur]; const id = el.dataset.v; s.extras = s.extras.includes(id) ? s.extras.filter((x) => x !== id) : [...s.extras, id]; render(); },
  mqty: (el) => { const s = V[V.cur]; s.qty = Math.max(1, Math.min(30, s.qty + Number(el.dataset.d))); render(); },
  madd: () => addToCart(V.cur, "Adicionado à sacola"),
  bsize: (el) => { const s = V[V.cur]; s.size = Number(el.dataset.v); let used = 0; for (const k of Object.keys(s.flavors)) { const n = Math.min(s.flavors[k], s.size - used); s.flavors[k] = n; used += n; } render(); },
  bflav: (el) => { const s = V[V.cur]; const id = el.dataset.id; const used = Object.values(s.flavors).reduce((a, b) => a + b, 0); const d = Number(el.dataset.d); if (d > 0 && used >= s.size) return; s.flavors[id] = Math.max(0, (s.flavors[id] || 0) + d); render(); },
  bribbon: (el) => { V[V.cur].ribbon = el.dataset.v; render(); },
  bqty: (el) => { const s = V[V.cur]; s.qty = Math.max(1, Math.min(20, s.qty + Number(el.dataset.d))); render(); },
  badd: () => { const s = V[V.cur]; const used = Object.values(s.flavors).reduce((a, b) => a + b, 0); if (used < s.size) { toast("Escolha mais " + (s.size - used) + " sabor" + (s.size - used > 1 ? "es" : "")); return; } addToCart(V.cur, "Caixinha na sacola"); },
  ptotal: (el) => { const s = V[V.cur]; s.total = Number(el.dataset.v); s.flavors = {}; const min = ymd(partyMinDate(s.total)); if (s.date < min) s.date = min; render(); },
  pflav: (el) => { const s = V[V.cur]; const used = Object.values(s.flavors).reduce((a, b) => a + b, 0); const d = Number(el.dataset.d); if (d > 0 && used + d > s.total) return; s.flavors[el.dataset.id] = Math.max(0, (s.flavors[el.dataset.id] || 0) + d); render(); },
  pmousse: (el) => { const s = V[V.cur]; s.mousses = Math.max(0, Math.min(500, s.mousses + Number(el.dataset.d))); render(); },
  pmode: (el) => { V[V.cur].mode = el.dataset.v; render(); },
  padd: () => { const s = V[V.cur]; const used = Object.values(s.flavors).reduce((a, b) => a + b, 0);
    if (used !== s.total) { toast("Divida os " + s.total + " docinhos entre os sabores"); return; }
    if (s.date < ymd(partyMinDate(s.total))) { toast("Escolha uma data a partir de " + fmtDate(partyMinDate(s.total), "short")); return; }
    const other = cart.findIndex((i) => i.type === "party"); const editIdx = route.q.has("edit") ? Number(route.q.get("edit")) : -1;
    if (other >= 0 && other !== editIdx) { toast("Já tem uma encomenda na sacola. Finalize ela primeiro."); return; }
    addToCart(V.cur, "Encomenda na sacola"); },
  cqty: (el) => { const i = Number(el.dataset.i); const it = cart[i]; if (!it) return; const d = Number(el.dataset.d);
    if (it.type === "party" || (it.qty || 1) + d <= 0) { cart.splice(i, 1); toast("Item removido"); } else it.qty = Math.min(30, it.qty + d);
    saveCart(); render(); },
  clearcart: () => { if (!confirmInline("clear")) return; cart = []; saveCart(); render(); },
  tocheckout: () => { if (cart.some((i) => i.type === "party") && cart.some((i) => i.type !== "party")) toast("A encomenda e os outros itens vão juntos na data da festa."); go(user() ? "#/checkout" : "#/entrar?next=checkout"); },
  closeauth: () => { V.auth = null; const n = route.q.get("next"); go(n === "checkout" ? "#/sacola" : n && VIEWS[n] && n !== "painel" ? "#/" + n : "#/"); },
  authtab: (el) => { V.auth.tab = el.dataset.k; V.auth.err = ""; render(); },
  google: async () => { try { await data.google(); V.auth = null; } catch (e) { V.auth.err = data.errMsg(e); render(); } },
  forgot: async () => { const em = V.auth.email; if (!emailOk(em)) { V.auth.err = "Digite seu e-mail acima pra receber o link."; render(); return; }
    try { await data.resetPassword(em); toast("Enviamos um link pro seu e-mail", "ok"); } catch (e) { V.auth.err = data.errMsg(e); render(); } },
  ckaddr: (el) => { V.ck.addr = Number(el.dataset.v); V.ck.err = ""; render(); },
  cklabel: (el) => { V.ck.label = el.dataset.v; render(); },
  placeorder: () => placeOrder(),
  copypix: async (el) => { const p = el.dataset.p; let ok = false;
    try { await navigator.clipboard.writeText(p); ok = true; } catch { try { const t = document.createElement("textarea"); t.value = p; document.body.appendChild(t); t.select(); ok = document.execCommand("copy"); t.remove(); } catch {} }
    if (ok) { el.querySelector("span").textContent = "Código copiado!"; el.style.background = "var(--green)"; toast("Código Pix copiado. Agora é só colar no banco.", "ok"); } else toast("Não deu pra copiar. Toque em “Ver o código”."); },
  sentproof: (el) => { const id = el.dataset.id; V["retry_" + id] = false; data.updateOrder(id, { status: "comprovante", proofAt: Date.now() }, "comprovante").catch(() => toast("Sem conexão. Tente de novo.", "bad")); },
  retrypix: (el) => { V["retry_" + el.dataset.id] = true; render(); },
  cancelorder: async (el) => { if (!confirmInline("cancel" + el.dataset.id, "Toque de novo pra cancelar")) return; await data.updateOrder(el.dataset.id, { status: "cancelado" }, "cancelado"); toast("Pedido cancelado"); go("#/pedidos"); },
  reorder: (el, e) => { e.preventDefault(); e.stopPropagation(); const o = findOrder(el.dataset.id); if (!o) return; let n = 0;
    for (const it of o.items || []) { if (it.type === "party") continue; const x = clone(it); delete x.price; delete x.cost; if (x.type === "mousse" && !(byId(cat().mousses, x.mousse) || {}).active) continue; cart.push(x); n++; }
    saveCart(); if (n) { toast("Itens na sacola", "ok"); go("#/sacola"); } else toast("Esses itens não estão disponíveis agora."); },
  pedtab: (el) => { V.ped.tab = el.dataset.k; render(); },
  help: () => window.open(waLink(CONFIG.whatsapp, "Oi! Preciso de ajuda com o docely."), "_blank", "noopener"),
  logout: async () => { await data.signOut(); V.ck = null; V.dados = null; toast("Você saiu da conta"); go("#/"); },
  deladdr: async (el) => { const list = [...(prof().addresses || [])]; list.splice(Number(el.dataset.i), 1); await data.saveProfile({ addresses: list }); toast("Endereço apagado"); },
  readall: () => { LSset("seen_" + (user() ? user().uid : "x"), Date.now()); render(); },
  admtab: (el) => { V.adm.tab = el.dataset.k; render(); },
  adm: async (el) => {
    const id = el.dataset.id; const op = el.dataset.op;
    if (op === "reject") { V.rejecting = id; V.rej = null; render(); return; }
    if (op === "cancel" && !confirmInline("acancel" + id, "Toque de novo pra cancelar")) return;
    const map = { approve: [{ status: "confirmado", rejectReason: "" }, "confirmado", "Pagamento aprovado"], separado: [{ status: "separado" }, "separado", "Marcado como separado"], entregue: [{ status: "entregue" }, "entregue", "Marcado como entregue"], undo: [{ status: "comprovante", rejectReason: "" }, "comprovante", "Recusa desfeita"], cancel: [{ status: "cancelado" }, "cancelado", "Pedido cancelado"] };
    if (op === "rejectgo") { const r = V.rej.reason === "Outro motivo" ? (V.rej.other.trim() || "Outro motivo") : V.rej.reason;
      map.rejectgo = [{ status: "recusado", rejectReason: r, pixExpiresAt: Math.max(findOrder(id).pixExpiresAt || 0, Date.now() + 12 * 3600000) }, "recusado", "Pagamento recusado"]; V.rejecting = null; }
    const m = map[op]; if (!m) return;
    try { el.disabled = true; await data.updateOrder(id, m[0], m[1]); toast(m[2], "ok"); } catch (e) { toast(data.errMsg(e), "bad"); el.disabled = false; }
    render();
  },
  closereject: () => { V.rejecting = null; render(); },
  rejreason: (el) => { V.rej.reason = el.dataset.v; render(); },
  proddone: (el) => { const k = el.dataset.k; V.prod.done[k] = !V.prod.done[k]; render(); },
  prtoggle: (el) => { const p = el.dataset.path; setPath(V.pr.c, p, !(getPath(V.pr.c, p) !== false && getPath(V.pr.c, p) !== undefined ? getPath(V.pr.c, p) : false)); V.pr.dirty = true; render(); },
  prsave: async () => { if (!V.pr.dirty) return; try { await data.saveCatalog(V.pr.c); V.pr.dirty = false; toast("Cardápio atualizado", "ok"); render(); } catch (e) { toast(data.errMsg(e), "bad"); } }
};
let confirmKey = "", confirmT = 0;
function confirmInline(k, msg = "Toque de novo pra confirmar") { if (confirmKey === k && Date.now() - confirmT < 3000) { confirmKey = ""; return true; } confirmKey = k; confirmT = Date.now(); toast(msg); return false; }

function addToCart(key, msg) {
  const s = clone(V[key]); const editIdx = route.q.has("edit") ? Number(route.q.get("edit")) : -1;
  if (editIdx >= 0 && cart[editIdx]) cart[editIdx] = s; else {
    const same = s.type !== "party" ? cart.findIndex((i) => JSON.stringify({ ...i, qty: 0 }) === JSON.stringify({ ...s, qty: 0 })) : -1;
    if (same >= 0) cart[same].qty = Math.min(30, cart[same].qty + s.qty); else cart.push(s);
  }
  saveCart(); delete V[key]; toast(editIdx >= 0 ? "Item atualizado" : msg, "ok");
  if (editIdx >= 0) go("#/sacola"); else back("#/cardapio");
}

async function placeOrder() {
  if (busy) return; const c = cat(); const s = V.ck; const p = prof(); s.err = "";
  const hasParty = cart.find((i) => i.type === "party"); const pickup = hasParty && cart.every((i) => i.type === "party" && i.mode === "retirar");
  const phone = phoneOk(p.phone) ? p.phone : s.phone;
  if (!phoneOk(phone)) { s.err = "phone"; render(); toast("Coloque seu WhatsApp com DDD"); return; }
  let address = null;
  if (pickup) address = { pickup: true, label: "Retirada" };
  else if (s.addr >= 0) address = (p.addresses || [])[s.addr];
  else {
    if (!s.street.trim()) { s.err = "street"; render(); toast("Falta a rua"); return; }
    if (!s.num.trim()) { s.err = "num"; render(); toast("Falta o número"); return; }
    address = { label: s.label, cep: s.cep, street: s.street.trim(), num: s.num.trim(), hood: s.hood.trim(), comp: s.comp.trim() };
  }
  if (hasParty && hasParty.date < ymd(partyMinDate(hasParty.total))) { s.err = "A data da encomenda ficou muito perto. Volte e escolha outra."; render(); return; }
  const items = cart.map((it) => { const u = itemUnit(c, it); return { ...clone(it), price: Math.round(u.price * 100) / 100, cost: Math.round(u.cost * 100) / 100 }; });
  const total = Math.round(items.reduce((a, i) => a + i.price * (i.qty || 1), 0) * 100) / 100;
  const cost = Math.round(items.reduce((a, i) => a + i.cost * (i.qty || 1), 0) * 100) / 100;
  const now = Date.now();
  const order = { uid: user().uid, customer: { name: p.name || user().name || "", phone, email: user().email || "" }, items, total, cost, address,
    kind: hasParty ? "party" : "normal", party: hasParty ? { date: hasParty.date, time: hasParty.time, mode: hasParty.mode, obs: hasParty.obs || "" } : null,
    deliveryDate: hasParty ? hasParty.date : ymd(deliveryDate()), status: "aguardando_pix", createdAt: now, pixExpiresAt: now + CONFIG.pixHours * 3600000,
    history: [{ s: "aguardando_pix", at: now }] };
  busy = true; const btn = app.querySelector('[data-a="placeorder"]'); if (btn) btn.innerHTML = '<span class="spin"></span>';
  try {
    const patch = {};
    if (!phoneOk(p.phone)) patch.phone = phone;
    if (!pickup && s.addr < 0 && s.save !== false) { const list = [...(p.addresses || [])].filter((a) => a.label !== address.label); list.unshift(address); patch.addresses = list.slice(0, 6); }
    if (Object.keys(patch).length) await data.saveProfile(patch);
    const id = await data.createOrder(order);
    cart = []; saveCart(); V.ck = null; busy = false; go("#/pix/" + id);
  } catch (e) { busy = false; console.error(e); s.err = data.errMsg(e); render(); }
}

async function submitForm(form) {
  const f = form.dataset.form;
  if (f === "auth") {
    const s = V.auth; s.err = "";
    if (s.tab === "new") {
      if (s.name.trim().length < 2) s.err = "Coloque seu nome.";
      else if (!phoneOk(s.phone)) s.err = "Coloque seu WhatsApp com DDD.";
    }
    if (!s.err && !emailOk(s.email)) s.err = "Esse e-mail não parece certo.";
    if (!s.err && s.pw.length < 6) s.err = s.tab === "new" ? "A senha precisa ter pelo menos 6 caracteres." : "Digite sua senha.";
    if (s.err) { render(); return; }
    const btn = form.querySelector('[type="submit"]'); btn.innerHTML = '<span class="spin"></span>'; btn.disabled = true;
    try { if (s.tab === "new") await data.signUp({ name: s.name.trim(), phone: s.phone, email: s.email, pw: s.pw }); else await data.signIn(s.email, s.pw); V.auth = null; toast("Bem-vindo(a)!", "ok"); go(nextHash()); }
    catch (e) { s.err = data.errMsg(e); render(); }
  }
  if (f === "dados") {
    const s = V.dados; s.err = "";
    if (s.name.trim().length < 2) s.err = "Coloque seu nome."; else if (s.phone && !phoneOk(s.phone)) s.err = "WhatsApp incompleto.";
    if (s.err) { render(); return; }
    await data.saveProfile({ name: s.name.trim(), phone: s.phone }); V.dados = null; toast("Dados salvos", "ok"); go("#/conta");
  }
}

/* ============ eventos ============ */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-a]"); if (!el || !app.contains(el) && !el.closest(".sheet")) return;
  const fn = ACT[el.dataset.a]; if (!fn) return;
  if (el.tagName === "BUTTON" && el.closest("a")) { e.preventDefault(); }
  if (el.dataset.a !== "sentproof") { if (el.tagName === "A") e.preventDefault(); }
  fn(el, e);
});
document.addEventListener("submit", (e) => { const f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault(); submitForm(f); });
document.addEventListener("input", (e) => {
  const el = e.target; const b = el.dataset && el.dataset.bind; if (!b) return;
  if (el.dataset.mask === "phone") { const pos = el.value.length; el.value = maskPhone(el.value); if (pos === el.value.length) {} }
  if (el.dataset.mask === "cep") { const d = el.value.replace(/\D/g, "").slice(0, 8); el.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d; if (d.length === 8) lookupCep(d); }
  let val = el.value;
  if (el.dataset.num) { val = Number(String(val).replace(/\./g, "").replace(",", ".")); if (isNaN(val) || val < 0) return; }
  const [root, ...rest] = b.split(".");
  if (V[root] == null) return;
  setPath(V[root], rest.join("."), val);
  if (root === "pr") { if (!V.pr.dirty) { V.pr.dirty = true; const sb = app.querySelector('[data-a="prsave"]'); if (sb) sb.style.display = ""; } }
  if (el.dataset.live) { const pos = el.selectionStart; render(); const n = document.getElementById(el.id); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch {} } }
});
document.addEventListener("change", (e) => { const el = e.target; if (el.dataset && el.dataset.rerender) render(); });
async function lookupCep(cep) {
  try {
    const r = await fetch("https://viacep.com.br/ws/" + cep + "/json/"); const j = await r.json(); if (j.erro || !V.ck) return;
    V.ck.street = j.logradouro || V.ck.street; V.ck.hood = [j.bairro, j.localidade].filter(Boolean).join(", ") || V.ck.hood;
    const st = document.getElementById("ck-street"), hd = document.getElementById("ck-hood");
    if (st) st.value = V.ck.street; if (hd) hd.value = V.ck.hood;
  } catch {}
}
window.addEventListener("hashchange", () => { sessionStorage.setItem("dc_nav", "1"); V.rejecting = null; render(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (V.rejecting) { V.rejecting = null; render(); } else if ((route.path[0] || "") === "entrar") ACT.closeauth(); } });

/* ============ início ============ */
let lastUid = null;
data.init((kind) => {
  const u = user(); const uid = u ? u.uid : null;
  if (uid !== lastUid) { lastUid = uid; V.ck = null; V.dados = null; V.pr = null; }
  if (kind === "catalog" && V.pr && !V.pr.dirty) V.pr = null;
  // não redesenha enquanto a pessoa digita
  const a = document.activeElement; if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && kind !== "auth") return;
  render();
}).then(render);
render();

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
