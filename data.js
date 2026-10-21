// Camada de dados do docely. Sem Firebase configurado, roda em "modo de teste"
// guardando tudo neste navegador (localStorage), com o mesmo comportamento.
import { CONFIG } from "./config.js";
import { DEFAULT_CATALOG, mergeCatalog, clone } from "./logic.js";

export const DEMO = !CONFIG.firebase.apiKey || CONFIG.firebase.apiKey === "COLE_AQUI";
const DEMO_ADMIN = "painel@docely.app";

let emit = () => {};
const st = { user: null, profile: null, catalog: mergeCatalog(null), myOrders: [], allOrders: [], ready: false };
const errMsg = (e) => {
  const c = (e && (e.code || e.message)) || "";
  if (/wrong-password|invalid-credential|invalid-login|user-not-found/.test(c)) return "E-mail ou senha incorretos.";
  if (/email-already-in-use/.test(c)) return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (/weak-password/.test(c)) return "A senha precisa ter pelo menos 6 caracteres.";
  if (/invalid-email/.test(c)) return "Esse e-mail não parece certo.";
  if (/popup-closed|cancelled-popup/.test(c)) return "Login com Google cancelado.";
  if (/network/.test(c)) return "Sem conexão. Confira a internet e tente de novo.";
  if (/too-many-requests/.test(c)) return "Muitas tentativas. Espere um pouco e tente de novo.";
  if (/permission/.test(c)) return "Sem permissão para isso.";
  return "Algo deu errado. Tente de novo.";
};
const isAdminEmail = (email) => {
  const e = String(email || "").toLowerCase();
  return CONFIG.admins.map((x) => x.toLowerCase()).includes(e) || (DEMO && e === DEMO_ADMIN);
};

/* ======================= MODO DE TESTE ======================= */
const LS = {
  get(k, d) { try { const v = localStorage.getItem("dc_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("dc_" + k, JSON.stringify(v)); } catch {} }
};
const demo = {
  load() {
    const sess = LS.get("session", null);
    const users = LS.get("users", {});
    st.user = sess && users[sess] ? { uid: sess, email: users[sess].email, name: users[sess].name } : null;
    st.profile = st.user ? LS.get("profile_" + st.user.uid, { name: st.user.name, phone: users[sess].phone || "", email: st.user.email, addresses: [] }) : null;
    st.catalog = mergeCatalog(LS.get("catalog", null));
    const orders = LS.get("orders", []);
    st.myOrders = st.user ? orders.filter((o) => o.uid === st.user.uid) : [];
    st.allOrders = st.user && isAdminEmail(st.user.email) ? orders : [];
  },
  seed() {
    const users = LS.get("users", {});
    if (!Object.values(users).some((u) => u.email === DEMO_ADMIN)) {
      users.admin = { name: "Caio e Miri", phone: "", email: DEMO_ADMIN, pw: "docely123" }; LS.set("users", users);
    }
  },
  async init() {
    this.seed(); this.load(); st.ready = true;
    window.addEventListener("storage", (e) => { if (e.key && e.key.startsWith("dc_")) { this.load(); emit("all"); } });
  },
  findUser(email) { const users = LS.get("users", {}); return Object.entries(users).find(([, u]) => u.email === email.toLowerCase()); },
  async signIn(email, pw) {
    this.seed(); const f = this.findUser(email.trim());
    if (!f || f[1].pw !== pw) throw { code: "invalid-credential" };
    LS.set("session", f[0]); this.load(); emit("auth");
  },
  async signUp({ name, phone, email, pw }) {
    if (pw.length < 6) throw { code: "weak-password" };
    if (this.findUser(email.trim())) throw { code: "email-already-in-use" };
    const users = LS.get("users", {}); const uid = "u" + Date.now().toString(36);
    users[uid] = { name, phone, email: email.trim().toLowerCase(), pw }; LS.set("users", users);
    LS.set("profile_" + uid, { name, phone, email: email.trim().toLowerCase(), addresses: [] });
    LS.set("session", uid); this.load(); emit("auth");
  },
  async google() {
    const email = "voce.google@gmail.com"; let f = this.findUser(email);
    if (!f) { await this.signUp({ name: "Você (Google)", phone: "", email, pw: "google!" }); return; }
    LS.set("session", f[0]); this.load(); emit("auth");
  },
  async signOut() { LS.set("session", null); this.load(); emit("auth"); },
  async resetPassword() {},
  async saveProfile(p) { st.profile = { ...st.profile, ...p }; LS.set("profile_" + st.user.uid, st.profile); emit("profile"); },
  async saveCatalog(c) { LS.set("catalog", c); this.load(); emit("catalog"); },
  async createOrder(o) {
    const orders = LS.get("orders", []); const n = LS.get("counter", 0) + 1; LS.set("counter", n);
    const id = "o" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    orders.push({ ...o, id, number: n }); LS.set("orders", orders); this.load(); emit("orders"); return id;
  },
  async updateOrder(id, patch, histStatus) {
    const orders = LS.get("orders", []); const o = orders.find((x) => x.id === id); if (!o) throw { code: "not-found" };
    Object.assign(o, patch); if (histStatus) o.history = [...(o.history || []), { s: histStatus, at: Date.now() }];
    LS.set("orders", orders); this.load(); emit("orders");
  }
};

/* ======================= FIREBASE ======================= */
const V = "10.12.2";
let fb = null;
const live = {
  async init() {
    const [app, auth, fs] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
    ]);
    const a = app.initializeApp(CONFIG.firebase);
    fb = { auth, fs, A: auth.getAuth(a), D: fs.getFirestore(a), unsubs: [] };
    fs.onSnapshot(fs.doc(fb.D, "config", "catalog"), (s) => { st.catalog = mergeCatalog(s.exists() ? s.data() : null); emit("catalog"); }, () => {});
    await new Promise((res) => {
      auth.onAuthStateChanged(fb.A, async (u) => {
        fb.unsubs.forEach((f) => f()); fb.unsubs = [];
        st.user = u ? { uid: u.uid, email: u.email, name: u.displayName || "" } : null;
        st.myOrders = []; st.allOrders = []; st.profile = null;
        if (u) {
          const ref = fs.doc(fb.D, "users", u.uid);
          fb.unsubs.push(fs.onSnapshot(ref, (s) => {
            st.profile = s.exists() ? s.data() : { name: u.displayName || "", phone: "", email: u.email, addresses: [] };
            emit("profile");
          }, () => {}));
          fb.unsubs.push(fs.onSnapshot(fs.query(fs.collection(fb.D, "orders"), fs.where("uid", "==", u.uid)), (q) => {
            st.myOrders = q.docs.map((d) => ({ ...d.data(), id: d.id })); emit("orders");
          }, () => {}));
          if (isAdminEmail(u.email)) {
            fb.unsubs.push(fs.onSnapshot(fs.collection(fb.D, "orders"), (q) => {
              st.allOrders = q.docs.map((d) => ({ ...d.data(), id: d.id })); emit("orders");
            }, () => {}));
          }
        }
        st.ready = true; emit("auth"); res();
      });
    });
  },
  async signIn(email, pw) { await fb.auth.signInWithEmailAndPassword(fb.A, email.trim(), pw); },
  async signUp({ name, phone, email, pw }) {
    const c = await fb.auth.createUserWithEmailAndPassword(fb.A, email.trim(), pw);
    await fb.auth.updateProfile(c.user, { displayName: name });
    await fb.fs.setDoc(fb.fs.doc(fb.D, "users", c.user.uid), { name, phone, email: email.trim().toLowerCase(), addresses: [], createdAt: Date.now() });
    st.user = { uid: c.user.uid, email: c.user.email, name };
  },
  async google() {
    const p = new fb.auth.GoogleAuthProvider();
    const c = await fb.auth.signInWithPopup(fb.A, p);
    const ref = fb.fs.doc(fb.D, "users", c.user.uid);
    const s = await fb.fs.getDoc(ref);
    if (!s.exists()) await fb.fs.setDoc(ref, { name: c.user.displayName || "", phone: "", email: (c.user.email || "").toLowerCase(), addresses: [], createdAt: Date.now() });
  },
  async signOut() { await fb.auth.signOut(fb.A); },
  async resetPassword(email) { await fb.auth.sendPasswordResetEmail(fb.A, email.trim()); },
  async saveProfile(p) { st.profile = { ...st.profile, ...p }; await fb.fs.setDoc(fb.fs.doc(fb.D, "users", st.user.uid), p, { merge: true }); emit("profile"); },
  async saveCatalog(c) { await fb.fs.setDoc(fb.fs.doc(fb.D, "config", "catalog"), c); },
  async createOrder(o) {
    const { fs } = fb; const counter = fs.doc(fb.D, "config", "counter"); const ref = fs.doc(fs.collection(fb.D, "orders"));
    await fs.runTransaction(fb.D, async (t) => {
      const c = await t.get(counter); const n = (c.exists() ? c.data().n : 0) + 1;
      t.set(counter, { n }); t.set(ref, { ...o, number: n });
    });
    return ref.id;
  },
  async updateOrder(id, patch, histStatus) {
    const { fs } = fb; const data = { ...patch };
    if (histStatus) data.history = fs.arrayUnion({ s: histStatus, at: Date.now() });
    await fs.updateDoc(fs.doc(fb.D, "orders", id), data);
  }
};

/* ======================= API ======================= */
const impl = DEMO ? demo : live;
export const data = {
  st,
  errMsg,
  isAdmin: () => !!(st.user && isAdminEmail(st.user.email)),
  demoAdminEmail: DEMO_ADMIN,
  async init(onChange) { emit = onChange; try { await impl.init(); } catch (e) { console.error(e); st.ready = true; emit("error"); } },
  signIn: (e, p) => impl.signIn(e, p),
  signUp: (x) => impl.signUp(x),
  google: () => impl.google(),
  signOut: () => impl.signOut(),
  resetPassword: (e) => impl.resetPassword(e),
  saveProfile: (p) => impl.saveProfile(p),
  saveCatalog: (c) => impl.saveCatalog(clone(c)),
  createOrder: (o) => impl.createOrder(o),
  updateOrder: (id, p, h) => impl.updateOrder(id, p, h),
  defaultCatalog: () => clone(DEFAULT_CATALOG)
};
