// Regras do docely que não dependem de tela: preços, datas, Pix, status.
import { CONFIG } from "./config.js";

export const brl = (v) => "R$ " + (Math.round((Number(v) || 0) * 100) / 100).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const clone = (o) => JSON.parse(JSON.stringify(o));
export const pad2 = (n) => String(n).padStart(2, "0");

/* ---------- catálogo padrão ---------- */
export const DEFAULT_CATALOG = {
  v: 1,
  offer: { active: true, tag: "OFERTA DA SEMANA", title: "Mousse de limão com torta de bolacha", text: "O mais pedido da casa" },
  sizes: [
    { id: "trad", name: "Tradicional", ml: 200, price: 8, cost: 2 },
    { id: "grande", name: "Grande", ml: 300, price: 12, cost: 3 }
  ],
  jellies: [
    { id: "morango", name: "Geleia de morango", price: 1.5, cost: 0.4, color: "#D93A57" },
    { id: "maracuja", name: "Geleia de maracujá", price: 1.5, cost: 0.4, color: "#E89A12" }
  ],
  extras: [
    { id: "chantilly", name: "Chantilly", price: 1.5, cost: 0.3 },
    { id: "granulado", name: "Granulado de chocolate", price: 1, cost: 0.2 },
    { id: "raspas", name: "Raspas de limão", price: 0.5, cost: 0.05 },
    { id: "bolacha", name: "Bolacha triturada extra", price: 1, cost: 0.2 },
    { id: "semBase", name: "Tirar a base de bolacha", price: 0, cost: 0 }
  ],
  mousses: [
    { id: "limao", name: "Limão com torta de bolacha", desc: "Mousse de limão sobre base de bolacha amanteigada.", active: true, rank: 1,
      look: { tile: "#FFF4C2", top: "#FFFDF6", body: "#F2E06A", base: "#C9935A" }, jellies: ["morango", "maracuja"], extras: ["chantilly", "granulado", "raspas", "bolacha", "semBase"] },
    { id: "maracuja", name: "Maracujá", desc: "Mousse aerado com calda de maracujá por cima.", active: true, rank: 2,
      look: { tile: "#FFE7B3", top: "#E89A12", body: "#F8D873", base: "#F8D873" }, jellies: ["maracuja"], extras: ["chantilly", "granulado"] },
    { id: "pave", name: "Pavê de chocolate", desc: "Camadas de creme, biscoito e chocolate.", active: true, rank: 3,
      look: { tile: "#EFE7DA", top: "#5A3324", body: "#F4EAD6", base: "#8A5A41" }, jellies: [], extras: ["chantilly", "granulado"] },
    { id: "chocolate", name: "Chocolate", desc: "Mousse de chocolate meio amargo.", active: true, rank: 0,
      look: { tile: "#F3E3D8", top: "#4A2A1C", body: "#8A5A41", base: "#8A5A41" }, jellies: ["morango"], extras: ["chantilly", "granulado"] },
    { id: "morango", name: "Morango", desc: "Mousse de morango com pedaços da fruta.", active: true, rank: 0,
      look: { tile: "#FFE1E7", top: "#D93A57", body: "#F7C3CF", base: "#F7C3CF" }, jellies: ["morango"], extras: ["chantilly", "granulado"] }
  ],
  doces: [
    { id: "brigadeiro", name: "Brigadeiro", color: "#5A3324", active: true },
    { id: "amendoim", name: "Amendoim", color: "#D9B77A", active: true },
    { id: "beijinho", name: "Beijinho com chocolate", color: "#EFE3C4", active: true },
    { id: "ninho", name: "Ninho", color: "#F4E9CF", active: true }
  ],
  boxes: [{ size: 4, price: 12, cost: 4 }, { size: 6, price: 17, cost: 6 }],
  readyBoxes: [
    { id: "classica", name: "Clássica", desc: "Brigadeiro e beijinho, a dupla que nunca falha.", size: 4, flavors: { brigadeiro: 2, beijinho: 2 }, ribbon: "dourado", active: true },
    { id: "sortida", name: "Sortida", desc: "Um de cada sabor, pra provar tudo.", size: 4, flavors: { brigadeiro: 1, amendoim: 1, beijinho: 1, ninho: 1 }, ribbon: "rosa", active: true },
    { id: "chocolatuda", name: "Chocolatuda", desc: "Seis brigadeiros pra quem é do chocolate.", size: 6, flavors: { brigadeiro: 6 }, ribbon: "dourado", active: true },
    { id: "festa", name: "Festinha", desc: "Seis docinhos variados, cara de festa.", size: 6, flavors: { brigadeiro: 2, ninho: 2, amendoim: 1, beijinho: 1 }, ribbon: "branco", active: true }
  ],
  ribbons: [{ id: "dourado", name: "Dourado", color: "#B98545" }, { id: "rosa", name: "Rosa", color: "#E79AB0" }, { id: "branco", name: "Branco", color: "#FFFFFF" }],
  party: { pricePerDoce: 1.6, costPerDoce: 0.6, moussePrice: 7, mousseCost: 2, qtys: [25, 50, 100, 200] }
};

export function mergeCatalog(c) {
  const base = clone(DEFAULT_CATALOG);
  if (!c || typeof c !== "object") return base;
  for (const k of Object.keys(base)) if (c[k] !== undefined) base[k] = c[k];
  return base;
}

/* ---------- preços ---------- */
const byId = (arr, id) => (arr || []).find((x) => x.id === id);

export function mousseUnit(cat, it) {
  const size = byId(cat.sizes, it.size) || cat.sizes[0];
  let p = size ? size.price : 0, c = size ? size.cost : 0;
  const j = byId(cat.jellies, it.jelly); if (j) { p += j.price; c += j.cost || 0; }
  for (const e of it.extras || []) { const x = byId(cat.extras, e); if (x) { p += x.price; c += x.cost || 0; } }
  return { price: p, cost: c };
}
export function boxUnit(cat, it) {
  const b = (cat.boxes || []).find((x) => x.size === it.size) || cat.boxes[0];
  return { price: b ? b.price : 0, cost: b ? b.cost || 0 : 0 };
}
export function partyUnit(cat, it) {
  const p = cat.party;
  return { price: it.total * p.pricePerDoce + (it.mousses || 0) * p.moussePrice, cost: it.total * (p.costPerDoce || 0) + (it.mousses || 0) * (p.mousseCost || 0) };
}
export function itemUnit(cat, it) {
  if (it.type === "mousse") return mousseUnit(cat, it);
  if (it.type === "box") return boxUnit(cat, it);
  if (it.type === "party") return partyUnit(cat, it);
  return { price: 0, cost: 0 };
}
export function itemTotal(cat, it) { return itemUnit(cat, it).price * (it.qty || 1); }
export function cartTotal(cat, cart) { return cart.reduce((s, it) => s + itemTotal(cat, it), 0); }
export function cartCount(cart) { return cart.reduce((s, it) => s + (it.type === "party" ? 1 : it.qty || 1), 0); }

export function itemTitle(cat, it) {
  if (it.type === "mousse") return (byId(cat.mousses, it.mousse) || {}).name || "Mousse";
  if (it.type === "box") { const r = it.ready && (cat.readyBoxes || []).find((x) => x.id === it.ready); return r ? "Caixinha " + r.name + " (" + it.size + ")" : "Caixinha com " + it.size; }
  if (it.type === "party") return "Encomenda · " + it.total + " docinhos";
  return "Item";
}
export function itemDesc(cat, it) {
  if (it.type === "mousse") {
    const parts = [(byId(cat.sizes, it.size) || {}).name];
    const j = byId(cat.jellies, it.jelly); if (j) parts.push(j.name.replace("Geleia de ", "geleia de "));
    for (const e of it.extras || []) { const x = byId(cat.extras, e); if (x) parts.push(x.name.toLowerCase()); }
    if (it.obs) parts.push("obs: " + it.obs);
    return parts.filter(Boolean).join(" · ");
  }
  if (it.type === "box") {
    const fl = Object.entries(it.flavors || {}).filter(([, n]) => n > 0).map(([id, n]) => n + "× " + ((byId(cat.doces, id) || {}).name || id));
    const r = byId(cat.ribbons, it.ribbon);
    return fl.join(", ") + (r ? " · laço " + r.name.toLowerCase() : "");
  }
  if (it.type === "party") {
    const fl = Object.entries(it.flavors || {}).filter(([, n]) => n > 0).map(([id, n]) => n + " " + ((byId(cat.doces, id) || {}).name || id).toLowerCase());
    const extra = it.mousses ? " + " + it.mousses + " mousses" : "";
    return fl.join(", ") + extra + " · " + fmtDate(parseYmd(it.date), "long") + (it.time ? " às " + it.time : "") + " · " + (it.mode === "retirar" ? "retirada" : "entrega");
  }
  return "";
}

/* ---------- datas ---------- */
const WD = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const WDS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export const ymd = (d) => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
export const parseYmd = (s) => { const [y, m, d] = String(s || "").split("-").map(Number); return new Date(y || 1970, (m || 1) - 1, d || 1); };
export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

/** Próxima entrega: pedidos até o horário limite entregam no próximo dia útil (seg–sex). */
export function deliveryDate(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  let orderDay = startOfDay(now);
  if (mins > CONFIG.cutoff.h * 60 + CONFIG.cutoff.m) orderDay = addDays(orderDay, 1);
  let dl = addDays(orderDay, 1);
  while (dl.getDay() === 0 || dl.getDay() === 6) dl = addDays(dl, 1);
  return dl;
}
export function partyLead(total) { return total >= 200 ? 4 : total >= 100 ? 3 : 2; }
export function partyMinDate(total, now = new Date()) { return addDays(startOfDay(now), partyLead(total)); }

export function fmtDate(d, style = "short", now = new Date()) {
  const diff = Math.round((startOfDay(d) - startOfDay(now)) / 86400000);
  const dm = pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1);
  if (style === "rel") {
    if (diff === 0) return "hoje";
    if (diff === 1) return "amanhã, " + WDS[d.getDay()] + " " + dm;
    return WD[d.getDay()] + ", " + dm;
  }
  if (style === "long") return WD[d.getDay()] + ", " + dm;
  return WDS[d.getDay()] + ", " + dm;
}
export function fmtTime(ms) { const d = new Date(ms); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); }
export function fmtWhen(ms, now = new Date()) {
  const d = new Date(ms); const diff = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diff === 0) return fmtTime(ms);
  if (diff === 1) return "ontem";
  return fmtDate(d, "short");
}

/* ---------- Pix (BR Code estático) ---------- */
const tlv = (id, v) => id + pad2(v.length) + v;
export const asciiUp = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().trim();
export function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
export function pixPayload({ key, name, city, amount, txid }) {
  const mai = tlv("00", "br.gov.bcb.pix") + tlv("01", key);
  const tx = (asciiUp(txid).replace(/ /g, "") || "***").slice(0, 25);
  let p = tlv("00", "01") + tlv("26", mai) + tlv("52", "0000") + tlv("53", "986");
  if (amount > 0) p += tlv("54", Number(amount).toFixed(2));
  p += tlv("58", "BR") + tlv("59", asciiUp(name).slice(0, 25) || "DOCELY") + tlv("60", asciiUp(city).slice(0, 15) || "BRASIL") + tlv("62", tlv("05", tx));
  p += "6304";
  return p + crc16(p);
}

/* ---------- status do pedido ---------- */
export const STATUS = {
  aguardando_pix: { label: "Aguardando Pix", cls: "st-gray" },
  comprovante: { label: "Aguardando confirmação", cls: "st-wait" },
  confirmado: { label: "Confirmado", cls: "st-ok" },
  separado: { label: "Separado pra você", cls: "st-ok" },
  entregue: { label: "Entregue", cls: "st-gray" },
  recusado: { label: "Pagamento não confirmado", cls: "st-red" },
  cancelado: { label: "Cancelado", cls: "st-gray" }
};
export function effStatus(o, now = Date.now()) {
  if ((o.status === "aguardando_pix" || o.status === "recusado") && o.pixExpiresAt && now > o.pixExpiresAt) return "cancelado";
  return o.status;
}
export const isActive = (o) => ["aguardando_pix", "comprovante", "confirmado", "separado", "recusado"].includes(effStatus(o));
export const isPaid = (o) => ["confirmado", "separado", "entregue"].includes(effStatus(o));
export const REJECT_REASONS = ["O Pix não caiu na nossa conta", "O valor do comprovante está diferente do pedido", "Não deu pra ler o comprovante", "Outro motivo"];

export function waLink(phone, text) { return "https://wa.me/" + String(phone).replace(/\D/g, "") + "?text=" + encodeURIComponent(text); }
export function maskPhone(v) {
  const d = String(v || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? "(" + d : "";
  if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 3) + " " + d.slice(3, 7) + "-" + d.slice(7);
}
export const phoneOk = (v) => { const d = String(v || "").replace(/\D/g, ""); return d.length === 10 || d.length === 11; };
export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
