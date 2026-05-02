import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "atc_final_clean_v2";
const ADMIN_SESSION_KEY = "atc_admin_auth_session";

// Permanent Admin Save Setup
// Supabase me project banakar ye 2 value paste karni hai.
const SUPABASE_URL = "https://syuwlzojumbmscblwxms.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nlvsc5JkmwZCU6z-3uIBwQ_hKzthji7";
const SUPABASE_TABLE = "site_content";
const SITE_ROW_ID = "main";
const SUPABASE_ENABLED = SUPABASE_URL.startsWith("https://") && !SUPABASE_ANON_KEY.includes("PASTE_");

const DEFAULT_SITE = {
  popupDelay: 30000,
  company: {
    name: "Ansh Trading Company",
    group: "Goyal Group",
    logo: "ATC",
    logoImage: "",
    tagline: "Solar | Plumbing | Pumping | Civil Construction Solutions",
    phone: "8770327415",
    whatsapp: "8770327415",
    email: "anshtradingcompanyraipur@gmail.com",
    instagram: "atc_anshtradingcompany",
    location: "Raipur, Chhattisgarh",
    mapEmbed: "https://www.google.com/maps?q=Raipur%2C%20Chhattisgarh&output=embed",
    sheetWebhook: ""
  },
  hero: {
    title: "Complete Solar, Plumbing, Pumping & Construction Solutions",
    text: "Trusted solutions for residential customers, project clients, dealerships and associate network across India.",
    bg: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1800&q=85",
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=85"
  },
  products: [
    {
      title: "Complete Solar Setup",
      icon: "☀️",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
      points: ["Rooftop solar planning", "Residential and commercial setup", "Panel, inverter and structure support", "After-sales service guidance"]
    },
    {
      title: "Complete Plumbing Solution",
      icon: "💧",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",
      points: ["Pipeline planning", "Project and home plumbing work", "Material and execution support", "Maintenance support"]
    },
    {
      title: "Complete Pumping Solution",
      icon: "🌊",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85",
      points: ["Borewell pumping setup", "Pump selection guidance", "Site-based installation support", "Reliable water flow solution"]
    }
  ],
  services: [
    {
      title: "Complete Solar Installation",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=85",
      points: ["Site survey and load planning", "Panel mounting and wiring", "Inverter setup and testing", "Service support after installation"]
    },
    {
      title: "Plumbing Work for Projects",
      icon: "🔧",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",
      points: ["Project pipeline execution", "Bathroom and water-line work", "Professional fitting support", "On-site supervision"]
    },
    {
      title: "Civil Constructions",
      icon: "🏗️",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
      points: ["Residential and commercial work", "Foundation and structure support", "Project-based civil execution", "Quality-focused finishing work"]
    }
  ],
  benefits: [
    { title: "Hold Dealership", icon: "🛡️", text: "Grow your business with structured dealership support." },
    { title: "Become an Associate", icon: "🤝", text: "Join our associate network and work on customer leads." },
    { title: "Quality Service B2C", icon: "🏆", text: "Reliable execution with strong customer support." }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=90"
  ],
  faqs: [
    { q: "Do you provide complete solar installation?", a: "Yes, we provide survey, setup, installation and support." },
    { q: "Can I become dealer or associate?", a: "Yes, you can send enquiry through WhatsApp or the enquiry form." },
    { q: "Where are you located?", a: "We are based in Raipur, Chhattisgarh." }
  ]
};

const navItems = ["home", "about", "products", "services", "benefits", "gallery", "faq", "contact"];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function digitsOnly(value) {
  return Array.from(String(value || "")).filter((ch) => "0123456789".includes(ch)).join("");
}

function whatsappUrl(site, message) {
  return "https://wa.me/91" + digitsOnly(site.company.whatsapp) + "?text=" + encodeURIComponent(message || "Hello, I want enquiry");
}

function callUrl(site) {
  return "tel:+91" + digitsOnly(site.company.phone);
}

function instagramUrl(site) {
  return "https://instagram.com/" + String(site.company.instagram || "").replace("@", "");
}

function normalizeItem(item) {
  if (Array.isArray(item.points)) return item;
  const raw = String(item.text || "");
  return { ...item, points: raw.split("|").map((x) => x.trim()).filter(Boolean) };
}

function saveSafe(site) {
  const safe = cloneData(site);
  if (String(safe.company.logoImage || "").startsWith("data:image/")) safe.company.logoImage = "";
  safe.gallery = (safe.gallery || []).map((x) => String(x || "").startsWith("data:image/") ? "" : x);
  return safe;
}

function hydrateSite(saved) {
  if (!saved) return cloneData(DEFAULT_SITE);
  return {
    ...cloneData(DEFAULT_SITE),
    ...saved,
    company: { ...cloneData(DEFAULT_SITE.company), ...(saved.company || {}) },
    hero: { ...cloneData(DEFAULT_SITE.hero), ...(saved.hero || {}) },
    products: (saved.products || DEFAULT_SITE.products).map(normalizeItem),
    services: (saved.services || DEFAULT_SITE.services).map(normalizeItem),
    benefits: saved.benefits || cloneData(DEFAULT_SITE.benefits),
    gallery: saved.gallery || cloneData(DEFAULT_SITE.gallery),
    faqs: saved.faqs || cloneData(DEFAULT_SITE.faqs)
  };
}

function loadSite() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneData(DEFAULT_SITE);
    return hydrateSite(JSON.parse(raw));
  } catch {
    return cloneData(DEFAULT_SITE);
  }
}

function supabaseHeaders(extra = {}, accessToken = "") {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: "Bearer " + (accessToken || SUPABASE_ANON_KEY),
    "Content-Type": "application/json",
    ...extra
  };
}

async function fetchPermanentSite() {
  if (!SUPABASE_ENABLED) return null;

  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${SITE_ROW_ID}&select=data`;
  const response = await fetch(url, { headers: supabaseHeaders() });

  if (!response.ok) throw new Error("Permanent data load failed");

  const rows = await response.json();
  if (!rows || !rows[0] || !rows[0].data) return null;

  const site = hydrateSite(rows[0].data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveSafe(site)));
  return site;
}

async function savePermanentSite(site, accessToken) {
  const safe = saveSafe(site);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));

  if (!SUPABASE_ENABLED) return { mode: "local" };
  if (!accessToken) throw new Error("Admin login required");

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=representation" }, accessToken),
    body: JSON.stringify({
      id: SITE_ROW_ID,
      data: safe,
      updated_at: new Date().toISOString()
    })
  });

  if (!response.ok) throw new Error("Permanent save failed");
  return { mode: "supabase" };
}

function loadAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.access_token) return null;
    return session;
  } catch {
    return null;
  }
}

async function signInAdmin(email, password) {
  if (!SUPABASE_ENABLED) {
    throw new Error("First add Supabase URL and anon key in code.");
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ email, password })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || !data.access_token) {
    throw new Error("Wrong email/password or Supabase Auth is not configured.");
  }

  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    user: data.user
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return session;
}

async function signOutAdmin(accessToken) {
  try {
    if (SUPABASE_ENABLED && accessToken) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: supabaseHeaders({}, accessToken)
      });
    }
  } catch {
    // Ignore logout API errors and clear local session anyway.
  }

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function SEO({ site }) {
  useEffect(() => {
    document.title = site.company.name + " | Solar, Plumbing, Pumping & Construction";
  }, [site.company.name]);
  return null;
}

function IconSvg({ type }) {
  const cls = "h-6 w-6";

  if (type === "whatsapp") {
    return (
      <svg className={cls} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C8.88 3 3.07 8.8 3.07 15.93c0 2.28.6 4.51 1.73 6.47L3 29l6.76-1.77a12.89 12.89 0 0 0 6.28 1.6h.01c7.16 0 12.98-5.8 12.98-12.93C29.02 8.8 23.2 3 16.04 3Zm0 23.55h-.01c-1.89 0-3.75-.5-5.37-1.47l-.38-.23-4.01 1.05 1.07-3.9-.25-.4a10.63 10.63 0 0 1-1.63-5.7c0-5.88 4.75-10.65 10.59-10.65 2.83 0 5.5 1.1 7.51 3.11a10.55 10.55 0 0 1 3.11 7.52c0 5.88-4.76 10.64-10.62 10.64Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.84-1.58-1.88-1.77-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.39-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.1 1.31 3.31c.16.21 2.26 3.46 5.48 4.85.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.11 5.18 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L9 10.69a16 16 0 0 0 4.31 4.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="instagramGradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset="0.25" stopColor="#FA7E1E" />
            <stop offset="0.5" stopColor="#D62976" />
            <stop offset="0.75" stopColor="#962FBF" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.3" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.3" />
        <circle cx="17.35" cy="6.65" r="1.25" fill="url(#instagramGradient)" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    );
  }

  return <span className="text-xl">•</span>;
}

function Loader() {
  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        <div className="text-2xl font-black">Loading...</div>
      </div>
    </div>
  );
}

function SectionTitle({ small, title, text, dark }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className={(dark ? "text-cyan-300" : "text-cyan-500") + " mb-3 text-sm font-black uppercase tracking-[.25em]"}>{small}</p>
      <h2 className={(dark ? "text-white" : "text-slate-950") + " text-3xl font-black leading-tight md:text-5xl"}>{title}</h2>
      {text ? <p className={(dark ? "text-slate-300" : "text-slate-600") + " mt-4 text-lg leading-8"}>{text}</p> : null}
    </div>
  );
}

function Header({ site }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={(scrolled ? "py-1 bg-white/95 shadow-2xl" : "py-3 bg-white/85 shadow-lg") + " fixed inset-x-0 top-0 z-50 transition-all duration-500 backdrop-blur-xl"}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#home" className="flex items-center gap-3">
          <div className="logo-wrap">
            {site.company.logoImage ? (
              <img src={site.company.logoImage} alt="logo" className="logo-core object-cover" />
            ) : (
              <div className="logo-core grid place-items-center bg-gradient-to-br from-cyan-400 via-blue-700 to-blue-950 font-black text-white">{site.company.logo}</div>
            )}
            <span className="logo-bolt">⚡</span>
          </div>
          <div>
            <p className="font-black leading-5 text-slate-950">{site.company.name}</p>
            <p className="text-xs font-bold text-blue-950">({site.company.group})</p>
          </div>
        </a>

        <nav className="hidden gap-6 lg:flex">
          {navItems.map((item) => <a key={item} href={"#" + item} className="text-sm font-black capitalize text-slate-700 hover:text-cyan-500">{item}</a>)}
        </nav>

        <div className="hidden gap-3 lg:flex">
          <a href={callUrl(site)} className="rounded-full border border-blue-950 px-5 py-2 font-black text-blue-950">Call</a>
          <a href={whatsappUrl(site, "Hello, I want enquiry")} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-5 py-2 font-black text-slate-950">WhatsApp</a>
        </div>

        <button type="button" onClick={() => setMenu(!menu)} className="rounded-xl bg-slate-100 px-4 py-2 text-2xl font-black lg:hidden">{menu ? "×" : "☰"}</button>
      </div>

      {menu ? (
        <div className="border-t bg-white p-4 lg:hidden">
          {navItems.map((item) => <a key={item} onClick={() => setMenu(false)} href={"#" + item} className="block rounded-xl px-4 py-3 font-black capitalize text-slate-700">{item}</a>)}
        </div>
      ) : null}
    </header>
  );
}

function Hero({ site }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-slate-950 pt-28 text-white">
      <style>{`
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes shine{to{background-position:-200%}}
@keyframes popupIn{0%{opacity:0;transform:translateY(40px) scale(.86)}100%{opacity:1;transform:translateY(0) scale(1)}}
.float{animation:float 4s ease-in-out infinite}
.shine{background:linear-gradient(90deg,#fff,#67e8f9,#fff);background-size:200%;-webkit-background-clip:text;color:transparent;animation:shine 3s linear infinite}
.card{transition:.45s;position:relative;overflow:hidden}
.card:hover{transform:translateY(-10px);box-shadow:0 30px 70px rgba(15,23,42,.22)}
.logo-wrap{position:relative;width:56px;height:56px;display:grid;place-items:center;border-radius:18px;isolation:isolate;background:linear-gradient(135deg,#0f172a,#0d47a1 48%,#22d3ee);box-shadow:0 10px 24px rgba(15,23,42,.22),0 0 18px rgba(34,211,238,.28)}
.logo-wrap:before{content:"";position:absolute;inset:-2px;border-radius:20px;background:linear-gradient(135deg,rgba(34,211,238,.9),rgba(250,204,21,.72),rgba(13,71,161,.9));z-index:-1;opacity:.85}
.logo-wrap:after{content:"";position:absolute;left:9px;right:9px;top:8px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);opacity:.75}
.logo-core{position:relative;z-index:2;width:48px;height:48px;border-radius:16px;box-shadow:inset 0 0 14px rgba(255,255,255,.18);overflow:hidden}
.logo-core:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 45%,rgba(34,211,238,.15));pointer-events:none}
.logo-bolt{position:absolute;right:-6px;top:-7px;z-index:4;display:grid;place-items:center;width:24px;height:24px;border-radius:999px;background:linear-gradient(135deg,#facc15,#fb923c);color:#0f172a;font-size:15px;font-weight:900;box-shadow:0 0 12px rgba(250,204,21,.55)}
`}</style>
      <img src={site.hero.bg} alt="hero" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <p className="inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300 backdrop-blur-xl">Professional Solutions</p>
          <h1 className="shine mt-7 text-5xl font-black md:text-7xl">{site.company.name}</h1>
          <p className="mt-2 text-3xl font-black text-cyan-300">({site.company.group})</p>
          <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{site.hero.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{site.hero.text}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={whatsappUrl(site, "Hello, I want free consultation")} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-300">Get Free Consultation</a>
            <a href={whatsappUrl(site, "Hello, I want enquiry for " + site.company.tagline)} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-center font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:text-blue-950">WhatsApp Enquiry</a>
          </div>
        </div>
        <div className="float rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <img src={site.hero.img} alt="solar" className="h-[430px] w-full rounded-[1.5rem] object-cover" />
        </div>
      </div>
    </section>
  );
}

function ImageSlider({ images, title, subtitle }) {
  const slides = (images || []).filter(Boolean);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 2800);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((img, index) => (
          <div key={index} className="relative min-w-full">
            <img src={img} alt={title || "slide"} className="h-[330px] w-full object-cover md:h-[430px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
            {(title || subtitle) ? (
              <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
                {subtitle ? <p className="mb-2 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-slate-950">{subtitle}</p> : null}
                {title ? <h3 className="text-2xl font-black md:text-4xl">{title}</h3> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <>
          <button type="button" onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl">‹</button>
          <button type="button" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl">›</button>
        </>
      ) : null}
    </div>
  );
}

function ProductSlider({ site, items }) {
  const slides = (items || []).filter((item) => item.image);
  if (!slides.length) return null;
  return (
    <div className="mx-auto mb-12 max-w-7xl">
      <ImageSlider images={slides.map((item) => item.image)} title="Product Solutions" subtitle="Our Work" />
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {slides.map((item) => <a key={item.title} href={whatsappUrl(site, "I want enquiry for " + item.title)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-5 py-2 font-black text-white shadow"><span className="mr-2">{item.icon}</span>{item.title}</a>)}
      </div>
    </div>
  );
}

function About({ site }) {
  const aboutImages = [site.hero.img, site.hero.bg, ...site.gallery].filter(Boolean);
  return (
    <section id="about" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <ImageSlider images={aboutImages} />
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">About Us</p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">Complete solutions under one trusted brand.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">{site.company.name} provides complete solutions in solar installation, plumbing, pumping and civil construction for B2C and project-based clients.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Professional Team", "Quality Service", "Project Support", "Fast Response"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4 font-black shadow">✓ {item}</div>)}
          </div>
          <a href={whatsappUrl(site, "Hello, I want to know more about Ansh Trading Company")} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-4 font-black text-slate-950 shadow-xl"><IconSvg type="whatsapp" /> Know More</a>
        </div>
      </div>
    </section>
  );
}

function Cards({ site, id, small, title, items, dark }) {
  return (
    <section id={id} className={(dark ? "bg-white" : "bg-slate-50") + " px-4 py-20 md:px-8"}>
      <SectionTitle small={small} title={title} />
      {id === "products" ? <ProductSlider site={site} items={items} /> : null}
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const cleanItem = normalizeItem(item);
          return (
            <div key={index} className="card overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl">
              {cleanItem.image ? <img src={cleanItem.image} alt={cleanItem.title} className="h-56 w-full object-cover" /> : null}
              <div className="p-6">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-cyan-50 text-4xl shadow-inner">{cleanItem.icon}</div>
                <h3 className="text-2xl font-black text-slate-950">{cleanItem.title}</h3>
                {id === "products" || id === "services" ? (
                  <ul className="mt-5 space-y-3">
                    {cleanItem.points.map((point, idx) => <li key={idx} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">✓</span><span>{point}</span></li>)}
                  </ul>
                ) : (
                  <p className="mt-3 leading-7 text-slate-600">{cleanItem.text}</p>
                )}
                <a href={whatsappUrl(site, "I want details for " + cleanItem.title)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-black text-slate-950"><IconSvg type="whatsapp" /> Enquire Now</a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Benefits({ site }) {
  return (
    <section id="benefits" className="bg-blue-950 px-4 py-20 text-white md:px-8">
      <SectionTitle small="Benefits" title="Grow With Ansh Trading Company" dark />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {site.benefits.map((item, index) => <div key={index} className="card rounded-[2rem] border border-white/10 bg-white/10 p-8"><div className="mb-4 text-5xl">{item.icon}</div><h3 className="text-2xl font-black">{item.title}</h3><p className="mt-4 leading-8 text-slate-200">{item.text}</p></div>)}
      </div>
    </section>
  );
}

function Enquiry({ site }) {
  const options = [...site.products.map((item) => item.title), ...site.services.map((item) => item.title), "Dealership", "Associate"];
  const [form, setForm] = useState({ name: "", mobile: "", city: "", requirement: options[0] || "", message: "" });
  const [sent, setSent] = useState(false);

  const message = useMemo(() => {
    return `Hello ${site.company.name}, I want enquiry. Name: ${form.name || "-"}, Mobile: ${form.mobile || "-"}, City: ${form.city || "-"}, Requirement: ${form.requirement}, Message: ${form.message || "-"}`;
  }, [form, site.company.name]);

  async function sendToSheet() {
    if (!site.company.sheetWebhook) return;
    try {
      await fetch(site.company.sheetWebhook, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-IN"),
          name: form.name,
          mobile: form.mobile,
          city: form.city,
          requirement: form.requirement,
          message: form.message,
          source: site.company.name
        })
      });
    } catch (error) {
      console.warn("Sheet submit failed", error);
    }
  }

  function submitForm(event) {
    event.preventDefault();
    setSent(true);
    sendToSheet();
    window.open(whatsappUrl(site, message), "_blank", "noopener,noreferrer");
    setTimeout(() => setSent(false), 3500);
  }

  return (
    <section id="enquiry" className="relative overflow-hidden bg-slate-50 px-4 py-20 md:px-8">
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">Enquiry Form</p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">Get free consultation today.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Fast WhatsApp Reply", "Site Visit Support", "Dealer / Associate Query", "Project Work Enquiry"].map((item) => <a key={item} href={whatsappUrl(site, "Hello, I want enquiry for " + item)} target="_blank" rel="noreferrer" className="rounded-2xl border border-cyan-100 bg-white p-4 font-black text-slate-800 shadow-lg">⚡ {item}</a>)}
          </div>
        </div>
        <form onSubmit={submitForm} className="card rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-950 to-cyan-500 p-5 text-white">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-100">WhatsApp Enquiry</p>
              <h3 className="mt-1 text-2xl font-black">Submit Your Enquiry</h3>
            </div>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white shadow-xl ring-4 ring-white/20"><IconSvg type="whatsapp" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <input required placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <select value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none">
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <textarea rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-4 w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-950 px-7 py-4 font-black text-white"><IconSvg type="whatsapp" /> Submit & Open WhatsApp</button>
            <a href={whatsappUrl(site, message)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-center font-black text-white"><IconSvg type="whatsapp" /> Direct WhatsApp</a>
          </div>
          {sent ? <div className="mt-5 rounded-2xl bg-green-100 p-4 font-black text-green-700">✅ WhatsApp enquiry opened.</div> : null}
        </form>
      </div>
    </section>
  );
}

function Gallery({ site }) {
  return (
    <section id="gallery" className="relative overflow-hidden bg-white px-4 py-20 md:px-8">
      <SectionTitle small="Gallery" title="Work Gallery" />
      <div className="mx-auto max-w-7xl">
        <ImageSlider images={site.gallery} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.gallery.map((img, index) => <a key={index} href={img || "#gallery"} target={img ? "_blank" : undefined} rel={img ? "noreferrer" : undefined} className="group relative overflow-hidden rounded-[1.8rem] bg-slate-100 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-2xl">{img ? <img src={img} alt={"gallery " + (index + 1)} className="h-56 w-full object-cover transition duration-700 group-hover:scale-110" /> : <div className="grid h-56 place-items-center text-sm font-black text-slate-400">Add Photo URL</div>}<div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 opacity-0 shadow-lg transition group-hover:opacity-100">View Photo {index + 1}</div></a>)}
        </div>
      </div>
    </section>
  );
}

function FAQ({ site }) {
  const [active, setActive] = useState(0);
  return (
    <section id="faq" className="bg-slate-50 px-4 py-20 md:px-8">
      <SectionTitle small="FAQ" title="Frequently Asked Questions" />
      <div className="mx-auto max-w-4xl space-y-4">
        {site.faqs.map((item, index) => <div key={index} className="rounded-2xl bg-white shadow"><button type="button" onClick={() => setActive(active === index ? -1 : index)} className="flex w-full justify-between p-5 text-left font-black">{item.q}<span>{active === index ? "−" : "+"}</span></button>{active === index ? <p className="px-5 pb-5 text-slate-600">{item.a}</p> : null}</div>)}
      </div>
    </section>
  );
}

function Contact({ site }) {
  const mapSrc = site.company.mapEmbed || "https://www.google.com/maps?q=Raipur%2C%20Chhattisgarh&output=embed";
  return (
    <section id="contact" className="bg-slate-950 px-4 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle small="Contact" title="Connect with us" dark />
          <div className="grid gap-4">
            <a href={callUrl(site)} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="phone" /> +91 {site.company.phone}</a>
            <a href={whatsappUrl(site, "Hello, I want to connect")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black text-[#25D366]"><IconSvg type="whatsapp" /> WhatsApp</a>
            <a href={"mailto:" + site.company.email} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="mail" /> {site.company.email}</a>
            <a href={instagramUrl(site)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="instagram" /> @{site.company.instagram}</a>
            <p className="rounded-2xl bg-white/10 p-5 font-black">📍 {site.company.location}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-white/10 p-3 shadow-2xl">
          <iframe title="Google Map Location" src={mapSrc} className="h-[420px] w-full rounded-[1.5rem] border-0" loading="lazy" allowFullScreen />
          <div className="p-4 text-center">
            <p className="font-black">📍 {site.company.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminLogin({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const session = await signInAdmin(email.trim(), password);
      onSuccess(session);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
        <h2 className="text-3xl font-black text-slate-950">Secure Admin Login</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">Login with your Supabase Auth admin account.</p>
        <div className="mt-6 grid gap-4">
          <input type="email" required placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
          <input type="password" required placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-red-100 p-3 font-black text-red-600">{error}</p> : null}
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={busy} className="flex-1 rounded-full bg-blue-950 px-5 py-3 font-black text-white disabled:opacity-60">{busy ? "Logging in..." : "Login"}</button>
          <button type="button" onClick={onCancel} className="rounded-full bg-slate-100 px-5 py-3 font-black text-slate-800">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Admin({ site, setSite, close, authSession, onLogout }) {
  const [tab, setTab] = useState("company");
  const [saveMsg, setSaveMsg] = useState("");

  function update(path, value) {
    const next = cloneData(site);
    let target = next;
    path.slice(0, -1).forEach((key) => { target = target[key]; });
    target[path[path.length - 1]] = value;
    setSite(next);
  }

  function updateItem(section, index, key, value) {
    const next = cloneData(site);
    next[section][index][key] = value;
    setSite(next);
  }

  async function save() {
    try {
      const result = await savePermanentSite(site, authSession?.access_token);
      if (result.mode === "supabase") {
        setSaveMsg("Saved permanently online. Changes will show for everyone.");
      } else {
        setSaveMsg("Saved in this browser only. Add Supabase URL/key for permanent online save.");
      }
    } catch {
      setSaveMsg("Permanent save failed. Check Supabase URL, anon key, table and policies.");
    }
  }

  function field(label, value, onChange) {
    return <label className="block"><span className="text-xs font-black uppercase text-slate-500">{label}</span><input value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border px-3 py-2" /></label>;
  }

  function listEditor(section) {
    return (
      <div className="grid gap-4">
        {site[section].map((item, index) => {
          const pointsText = normalizeItem(item).points.join(" | ");
          return (
            <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
              {field("title", item.title, (v) => updateItem(section, index, "title", v))}
              {field("icon", item.icon, (v) => updateItem(section, index, "icon", v))}
              {"image" in item ? field("image url", item.image, (v) => updateItem(section, index, "image", v)) : null}
              <label className="block md:col-span-2">
                <span className="text-xs font-black uppercase text-slate-500">points / text</span>
                <textarea value={pointsText} onChange={(e) => updateItem(section, index, "points", e.target.value.split("|").map((x) => x.trim()).filter(Boolean))} className="w-full rounded-xl border px-3 py-2" rows={4} />
              </label>
              <button type="button" onClick={() => { const next = cloneData(site); next[section].splice(index, 1); setSite(next); }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">Remove</button>
            </div>
          );
        })}
        <button type="button" onClick={() => { const next = cloneData(site); next[section].push({ title: "New Item", icon: "⭐", image: "", points: ["Point one", "Point two"] }); setSite(next); }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">Add New</button>
      </div>
    );
  }

  function addGalleryFiles(files) {
    Array.from(files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
