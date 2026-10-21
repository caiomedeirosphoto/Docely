// Guarda os arquivos do app pra abrir rápido e funcionar com internet fraca.
const CACHE = "docely-v2";
const FILES = ["./", "index.html", "styles.css?v=2", "app.js?v=2", "guide.js", "logic.js", "data.js", "config.js", "vendor/qrcode.js", "img/caixinha.jpg",
  "fonts/bricolage-grotesque-latin-800-normal.woff2", "fonts/bricolage-grotesque-latin-600-normal.woff2", "fonts/inter-latin-400-normal.woff2",
  "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/inter-latin-700-normal.woff2", "fonts/inter-latin-800-normal.woff2",
  "icons/icon-192.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // rede primeiro (pra sempre pegar a versão nova), cache se estiver sem internet
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});
// Toque no aviso: abre (ou traz pra frente) o app na tela certa
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "#/", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ("focus" in c) { c.navigate ? c.navigate(url).catch(() => {}) : null; return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
