import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "atc_heavy_lightning_v1";
const ADMIN_EMAIL = "admin@anshtradingcompany.com";
const ADMIN_PASSWORD = "ATC@12345";

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
      points: [
        "Rooftop solar planning",
        "Residential and commercial setup",
        "Panel, inverter and structure support",
        "After-sales service guidance"
      ]
    },
    {
      title: "Complete Plumbing Solution",
      icon: "💧",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",
      points: [
        "Pipeline planning",
        "Project and home plumbing work",
        "Material and execution support",
        "Maintenance support"
      ]
    },
    {
      title: "Complete Pumping Solution",
      icon: "🌊",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85",
      points: [
        "Borewell pumping setup",
        "Pump selection guidance",
        "Site-based installation support",
        "Reliable water flow solution"
      ]
    }
  ],
  services: [
    {
      title: "Complete Solar Installation",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=85",
      points: [
        "Site survey and load planning",
        "Panel mounting and wiring",
        "Inverter setup and testing",
        "Service support after installation"
      ]
    },
    {
      title: "Plumbing Work for Projects",
      icon: "🔧",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=85",
      points: [
        "Project pipeline execution",
        "Bathroom and water-line work",
        "Professional fitting support",
        "On-site supervision"
      ]
    },
    {
      title: "Civil Constructions",
      icon: "🏗️",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
      points: [
        "Residential and commercial work",
        "Foundation and structure support",
        "Project-based civil execution",
        "Quality-focused finishing work"
      ]
    }
  ],
  benefits: [
    {
      title: "Hold Dealership",
      icon: "🛡️",
      text: "Grow your business with structured dealership support."
    },
    {
      title: "Become an Associate",
      icon: "🤝",
      text: "Join our associate network and work on customer leads."
    },
    {
      title: "Quality Service B2C",
      icon: "🏆",
      text: "Reliable execution with strong customer support."
    }
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
    {
      q: "Do you provide complete solar installation?",
      a: "Yes, we provide survey, setup, installation and support."
    },
    {
      q: "Can I become dealer or associate?",
      a: "Yes, you can send enquiry through WhatsApp or the enquiry form."
    },
    {
      q: "Where are you located?",
      a: "We are based in Raipur, Chhattisgarh."
    }
  ]
};

const navItems = [
  "home",
  "about",
  "products",
  "services",
  "benefits",
  "gallery",
  "faq",
  "contact"
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function digitsOnly(value) {
  return Array.from(String(value || ""))
    .filter((ch) => "0123456789".includes(ch))
    .join("");
}

function whatsappUrl(site, message) {
  return (
    "https://wa.me/91" +
    digitsOnly(site.company.whatsapp) +
    "?text=" +
    encodeURIComponent(message || "Hello, I want enquiry")
  );
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
  return {
    ...item,
    points: raw
      .split("|")
      .map((x) => x.trim())
      .filter(Boolean)
  };
}

function saveSafe(site) {
  const safe = cloneData(site);
  if (String(safe.company.logoImage || "").startsWith("data:image/")) {
    safe.company.logoImage = "";
  }
  safe.gallery = (safe.gallery || []).map((x) =>
    String(x || "").startsWith("data:image/") ? "" : x
  );
  return safe;
}

function loadSite() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneData(DEFAULT_SITE);
    const saved = JSON.parse(raw);

    return {
      ...cloneData(DEFAULT_SITE),
      ...saved,
      company: {
        ...cloneData(DEFAULT_SITE.company),
        ...(saved.company || {})
      },
      hero: {
        ...cloneData(DEFAULT_SITE.hero),
        ...(saved.hero || {})
      },
      products: (saved.products || DEFAULT_SITE.products).map(normalizeItem),
      services: (saved.services || DEFAULT_SITE.services).map(normalizeItem),
      benefits: saved.benefits || cloneData(DEFAULT_SITE.benefits),
      gallery: saved.gallery || cloneData(DEFAULT_SITE.gallery),
      faqs: saved.faqs || cloneData(DEFAULT_SITE.faqs)
    };
  } catch {
    return cloneData(DEFAULT_SITE);
  }
}

function SEO({ site }) {
  useEffect(() => {
    document.title = site.company.name + " | Solar, Plumbing, Pumping & Construction";
  }, [site.company.name]);

  return null;
}

function GlobalStyles() {
  return (
    <style>{`
      @keyframes float {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-18px); }
      }

      @keyframes shine {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }

      @keyframes popupIn {
        0% { opacity: 0; transform: translateY(45px) scale(.88); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes logoPulse {
        0%,100% {
          transform: scale(1);
          filter: drop-shadow(0 0 8px rgba(34,211,238,.55));
        }
        50% {
          transform: scale(1.08);
          filter:
            drop-shadow(0 0 22px rgba(34,211,238,.95))
            drop-shadow(0 0 32px rgba(250,204,21,.7));
        }
      }

      @keyframes lightningRotate {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }

      @keyframes lightningSweep {
        0% { left: -90%; opacity: 0; }
        18% { opacity: 1; }
        55% { left: 120%; opacity: .95; }
        100% { left: 120%; opacity: 0; }
      }

      @keyframes boltFlash {
        0%,100% {
          opacity: .78;
          transform: translate(0,0) scale(1) rotate(-12deg);
        }
        50% {
          opacity: 1;
          transform: translate(2px,-2px) scale(1.2) rotate(8deg);
        }
      }

      @keyframes electricBorder {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes heroGlow {
        0%,100% { opacity: .45; transform: scale(1); }
        50% { opacity: .8; transform: scale(1.08); }
      }

      @keyframes particleFloat {
        0% { transform: translateY(0) translateX(0); opacity: .2; }
        50% { opacity: .8; }
        100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
      }

      .float {
        animation: float 4s ease-in-out infinite;
      }

      .shine {
        background: linear-gradient(90deg, #ffffff, #67e8f9, #facc15, #ffffff);
        background-size: 250%;
        -webkit-background-clip: text;
        color: transparent;
        animation: shine 3s linear infinite;
      }

      .card {
        transition: .45s;
        position: relative;
        overflow: hidden;
      }

      .card:before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent, rgba(34,211,238,.16), transparent);
        transform: translateX(-120%);
        transition: .65s;
      }

      .card:hover:before {
        transform: translateX(120%);
      }

      .card:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 70px rgba(15,23,42,.22);
      }

      .logo-wrap {
        position: relative;
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        isolation: isolate;
        animation: logoPulse 2.2s ease-in-out infinite;
      }

      .logo-wrap:before {
        content: "";
        position: absolute;
        inset: -5px;
        border-radius: 24px;
        background: conic-gradient(from 90deg, #22d3ee, #0f172a, #facc15, #22d3ee);
        z-index: -2;
        animation: lightningRotate 3.6s linear infinite;
      }

      .logo-wrap:after {
        content: "";
        position: absolute;
        top: -20%;
        bottom: -20%;
        left: -90%;
        width: 42%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.98), rgba(34,211,238,.85), transparent);
        transform: skewX(-22deg);
        animation: lightningSweep 2.4s ease-in-out infinite;
        z-index: 3;
        pointer-events: none;
      }

      .logo-core {
        position: relative;
        z-index: 2;
        width: 50px;
        height: 50px;
        border-radius: 18px;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.25),
          0 12px 30px rgba(15,23,42,.35);
      }

      .logo-bolt {
        position: absolute;
        right: -8px;
        top: -9px;
        z-index: 4;
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        border-radius: 999px;
        background: linear-gradient(135deg,#facc15,#fb923c);
        color: #0f172a;
        font-size: 17px;
        font-weight: 900;
        box-shadow: 0 0 18px rgba(250,204,21,.9);
        animation: boltFlash 1.15s ease-in-out infinite;
      }

      .electric-panel {
        position: relative;
        isolation: isolate;
      }

      .electric-panel:before {
        content: "";
        position: absolute;
        inset: -2px;
        z-index: -1;
        border-radius: 2.1rem;
        background: linear-gradient(120deg, #22d3ee, #1d4ed8, #facc15, #22d3ee);
        background-size: 300% 300%;
        animation: electricBorder 4s ease infinite;
        opacity: .85;
      }

      .hero-glow {
        animation: heroGlow 4s ease-in-out infinite;
      }

      .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: #67e8f9;
        box-shadow: 0 0 18px #22d3ee;
        animation: particleFloat 7s linear infinite;
      }
    `}</style>
  );
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
      <p className={(dark ? "text-cyan-300" : "text-cyan-500") + " mb-3 text-sm font-black uppercase tracking-[.25em]"}>
        {small}
      </p>
      <h2 className={(dark ? "text-white" : "text-slate-950") + " text-3xl font-black leading-tight md:text-5xl"}>
        {title}
      </h2>
      {text ? (
        <p className={(dark ? "text-slate-300" : "text-slate-600") + " mt-4 text-lg leading-8"}>
          {text}
        </p>
      ) : null}
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
              <div className="logo-core grid place-items-center bg-gradient-to-br from-cyan-400 via-blue-700 to-blue-950 font-black text-white">
                {site.company.logo}
              </div>
            )}
            <span className="logo-bolt">⚡</span>
          </div>

          <div>
            <p className="font-black leading-5 text-slate-950">{site.company.name}</p>
            <p className="text-xs font-bold text-blue-950">({site.company.group})</p>
          </div>
        </a>

        <nav className="hidden gap-6 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={"#" + item} className="text-sm font-black capitalize text-slate-700 hover:text-cyan-500">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden gap-3 lg:flex">
          <a href={callUrl(site)} className="rounded-full border border-blue-950 px-5 py-2 font-black text-blue-950">
            Call
          </a>
          <a href={whatsappUrl(site, "Hello, I want enquiry")} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-5 py-2 font-black text-slate-950">
            WhatsApp
          </a>
        </div>

        <button type="button" onClick={() => setMenu(!menu)} className="rounded-xl bg-slate-100 px-4 py-2 text-2xl font-black lg:hidden">
          {menu ? "×" : "☰"}
        </button>
      </div>

      {menu ? (
        <div className="border-t bg-white p-4 lg:hidden">
          {navItems.map((item) => (
            <a key={item} onClick={() => setMenu(false)} href={"#" + item} className="block rounded-xl px-4 py-3 font-black capitalize text-slate-700">
              {item}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function Hero({ site }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-slate-950 pt-28 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img src={site.hero.bg} alt="hero" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950" />
        <div className="hero-glow absolute -left-24 top-28 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="hero-glow absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <span className="particle left-[12%] top-[75%]" />
        <span className="particle left-[28%] top-[65%]" style={{ animationDelay: "1.4s" }} />
        <span className="particle left-[70%] top-[78%]" style={{ animationDelay: "2.2s" }} />
        <span className="particle left-[86%] top-[58%]" style={{ animationDelay: "3.1s" }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <p className="inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300 backdrop-blur-xl">
            Professional Solutions
          </p>
          <h1 className="shine mt-7 text-5xl font-black md:text-7xl">
            {site.company.name}
          </h1>
          <p className="mt-2 text-3xl font-black text-cyan-300">
            ({site.company.group})
          </p>
          <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            {site.hero.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {site.hero.text}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={whatsappUrl(site, "Hello, I want free consultation")} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-300">
              Get Free Consultation
            </a>
            <a href={whatsappUrl(site, "Hello, I want enquiry for " + site.company.tagline)} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-center font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:text-blue-950">
              WhatsApp Enquiry
            </a>
          </div>
        </div>

        <div className="electric-panel float rounded-[2rem] bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
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
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2800);
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
            {title || subtitle ? (
              <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
                {subtitle ? (
                  <p className="mb-2 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-slate-950">
                    {subtitle}
                  </p>
                ) : null}
                {title ? <h3 className="text-2xl font-black md:text-4xl">{title}</h3> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <button type="button" onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl">
            ‹
          </button>
          <button type="button" onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl">
            ›
          </button>
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
        {slides.map((item) => (
          <a key={item.title} href={whatsappUrl(site, "I want enquiry for " + item.title)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-5 py-2 font-black text-white shadow">
            <span className="mr-2">{item.icon}</span>
            {item.title}
          </a>
        ))}
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
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">
            About Us
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            Complete solutions under one trusted brand.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {site.company.name} provides complete solutions in solar installation, plumbing, pumping and civil construction for B2C and project-based clients.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Professional Team", "Quality Service", "Project Support", "Fast Response"].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 font-black shadow">
                ✓ {item}
              </div>
            ))}
          </div>

          <a href={whatsappUrl(site, "Hello, I want to know more about Ansh Trading Company")} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-4 font-black text-slate-950 shadow-xl">
            <IconSvg type="whatsapp" /> Know More
          </a>
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
              {cleanItem.image ? (
                <img src={cleanItem.image} alt={cleanItem.title} className="h-56 w-full object-cover" />
              ) : null}

              <div className="p-6">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-cyan-50 text-4xl shadow-inner">
                  {cleanItem.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-950">
                  {cleanItem.title}
                </h3>

                {id === "products" || id === "services" ? (
                  <ul className="mt-5 space-y-3">
                    {cleanItem.points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">
                          ✓
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 leading-7 text-slate-600">
                    {cleanItem.text}
                  </p>
                )}

                <a href={whatsappUrl(site, "I want details for " + cleanItem.title)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-black text-slate-950">
                  <IconSvg type="whatsapp" /> Enquire Now
                </a>
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
        {site.benefits.map((item, index) => (
          <div key={index} className="card rounded-[2rem] border border-white/10 bg-white/10 p-8">
            <div className="mb-4 text-5xl">{item.icon}</div>
            <h3 className="text-2xl font-black">{item.title}</h3>
            <p className="mt-4 leading-8 text-slate-200">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Enquiry({ site }) {
  const options = [
    ...site.products.map((item) => item.title),
    ...site.services.map((item) => item.title),
    "Dealership",
    "Associate"
  ];

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    city: "",
    requirement: options[0] || "",
    message: ""
  });

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
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">
            Enquiry Form
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            Get free consultation today.
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Fast WhatsApp Reply", "Site Visit Support", "Dealer / Associate Query", "Project Work Enquiry"].map((item) => (
              <a key={item} href={whatsappUrl(site, "Hello, I want enquiry for " + item)} target="_blank" rel="noreferrer" className="rounded-2xl border border-cyan-100 bg-white p-4 font-black text-slate-800 shadow-lg">
                ⚡ {item}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={submitForm} className="card rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-950 to-cyan-500 p-5 text-white">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-100">
                WhatsApp Enquiry
              </p>
              <h3 className="mt-1 text-2xl font-black">
                Submit Your Enquiry
              </h3>
            </div>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white shadow-xl ring-4 ring-white/20">
              <IconSvg type="whatsapp" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <input required placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
            <select value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none">
              {options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <textarea rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-4 w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-950 px-7 py-4 font-black text-white">
              <IconSvg type="whatsapp" /> Submit & Open WhatsApp
            </button>
            <a href={whatsappUrl(site, message)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-center font-black text-white">
              <IconSvg type="whatsapp" /> Direct WhatsApp
            </a>
          </div>

          {sent ? (
            <div className="mt-5 rounded-2xl bg-green-100 p-4 font-black text-green-700">
              ✅ WhatsApp enquiry opened.
            </div>
          ) : null}
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
          {site.gallery.map((img, index) => (
            <a key={index} href={img || "#gallery"} target={img ? "_blank" : undefined} rel={img ? "noreferrer" : undefined} className="group relative overflow-hidden rounded-[1.8rem] bg-slate-100 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-2xl">
              {img ? (
                <img src={img} alt={"gallery " + (index + 1)} className="h-56 w-full object-cover transition duration-700 group-hover:scale-110" />
              ) : (
                <div className="grid h-56 place-items-center text-sm font-black text-slate-400">
                  Add Photo URL
                </div>
              )}
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 opacity-0 shadow-lg transition group-hover:opacity-100">
                View Photo {index + 1}
              </div>
            </a>
          ))}
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
        {site.faqs.map((item, index) => (
          <div key={index} className="rounded-2xl bg-white shadow">
            <button type="button" onClick={() => setActive(active === index ? -1 : index)} className="flex w-full justify-between p-5 text-left font-black">
              {item.q}
              <span>{active === index ? "−" : "+"}</span>
            </button>

            {active === index ? (
              <p className="px-5 pb-5 text-slate-600">
                {item.a}
              </p>
            ) : null}
          </div>
        ))}
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
            <a href={callUrl(site)} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black">
              <IconSvg type="phone" /> +91 {site.company.phone}
            </a>
            <a href={whatsappUrl(site, "Hello, I want to connect")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black text-[#25D366]">
              <IconSvg type="whatsapp" /> WhatsApp
            </a>
            <a href={"mailto:" + site.company.email} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black">
              <IconSvg type="mail" /> {site.company.email}
            </a>
            <a href={instagramUrl(site)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black">
              <IconSvg type="instagram" /> @{site.company.instagram}
            </a>
            <p className="rounded-2xl bg-white/10 p-5 font-black">
              📍 {site.company.location}
            </p>
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

  function submit(event) {
    event.preventDefault();

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("atc_admin_login", "yes");
      setError("");
      onSuccess();
    } else {
      setError("Wrong email or password.");
    }
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
        <h2 className="text-3xl font-black text-slate-950">
          Admin Login
        </h2>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Enter authorized credentials to continue.
        </p>

        <div className="mt-6 grid gap-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none" />
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-100 p-3 font-black text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 rounded-full bg-blue-950 px-5 py-3 font-black text-white">
            Login
          </button>
          <button type="button" onClick={onCancel} className="rounded-full bg-slate-100 px-5 py-3 font-black text-slate-800">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Admin({ site, setSite, close }) {
  const [tab, setTab] = useState("company");
  const [saveMsg, setSaveMsg] = useState("");

  function update(path, value) {
    const next = cloneData(site);
    let target = next;

    path.slice(0, -1).forEach((key) => {
      target = target[key];
    });

    target[path[path.length - 1]] = value;
    setSite(next);
  }

  function updateItem(section, index, key, value) {
    const next = cloneData(site);
    next[section][index][key] = value;
    setSite(next);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveSafe(site)));
      setSaveMsg("Saved successfully.");
    } catch {
      setSaveMsg("Save failed. Use image URL for large photos.");
    }
  }

  function field(label, value, onChange) {
    return (
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500">
          {label}
        </span>
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
      </label>
    );
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
                <span className="text-xs font-black uppercase text-slate-500">
                  points / text
                </span>
                <textarea value={pointsText} onChange={(e) => updateItem(section, index, "points", e.target.value.split("|").map((x) => x.trim()).filter(Boolean))} className="w-full rounded-xl border px-3 py-2" rows={4} />
              </label>

              <button type="button" onClick={() => {
                const next = cloneData(site);
                next[section].splice(index, 1);
                setSite(next);
              }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">
                Remove
              </button>
            </div>
          );
        })}

        <button type="button" onClick={() => {
          const next = cloneData(site);
          next[section].push({
            title: "New Item",
            icon: "⭐",
            image: "",
            points: ["Point one", "Point two"]
          });
          setSite(next);
        }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">
          Add New
        </button>
      </div>
    );
  }

  function addGalleryFiles(files) {
    Array.from(files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const next = cloneData(site);
        next.gallery.push(String(reader.result || ""));
        setSite(next);
        setSaveMsg("Gallery preview added. Use image URL for permanent storage.");
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col rounded-[2rem] bg-white shadow-2xl">
        <div className="flex justify-between border-b p-4">
          <div>
            <h2 className="text-2xl font-black">Admin Panel</h2>
            <p className="text-xs font-bold text-slate-500">
              Website content management
            </p>
          </div>
          <button type="button" onClick={close} className="rounded-xl bg-slate-900 px-4 py-2 font-black text-white">
            Close
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b p-3">
          {["company", "hero", "products", "services", "benefits", "gallery", "faqs"].map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={(tab === item ? "bg-cyan-400" : "bg-slate-100") + " rounded-full px-4 py-2 font-black capitalize"}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "company" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {field("company name", site.company.name, (v) => update(["company", "name"], v))}
              {field("group", site.company.group, (v) => update(["company", "group"], v))}
              {field("logo text", site.company.logo, (v) => update(["company", "logo"], v))}
              {field("logo image url", site.company.logoImage, (v) => update(["company", "logoImage"], v))}
              {field("tagline", site.company.tagline, (v) => update(["company", "tagline"], v))}
              {field("phone", site.company.phone, (v) => update(["company", "phone"], v))}
              {field("whatsapp", site.company.whatsapp, (v) => update(["company", "whatsapp"], v))}
              {field("email", site.company.email, (v) => update(["company", "email"], v))}
              {field("instagram", site.company.instagram, (v) => update(["company", "instagram"], v))}
              {field("location", site.company.location, (v) => update(["company", "location"], v))}
              {field("map embed url", site.company.mapEmbed, (v) => update(["company", "mapEmbed"], v))}
              {field("google sheet webhook url", site.company.sheetWebhook, (v) => update(["company", "sheetWebhook"], v))}
              {field("popup delay", String(site.popupDelay), (v) => update(["popupDelay"], Number(v)))}
            </div>
          ) : null}

          {tab === "hero" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {field("title", site.hero.title, (v) => update(["hero", "title"], v))}
              {field("text", site.hero.text, (v) => update(["hero", "text"], v))}
              {field("background image url", site.hero.bg, (v) => update(["hero", "bg"], v))}
              {field("side image url", site.hero.img, (v) => update(["hero", "img"], v))}
            </div>
          ) : null}

          {["products", "services", "benefits"].includes(tab) ? listEditor(tab) : null}

          {tab === "gallery" ? (
            <div className="grid gap-4">
              <div className="rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-5">
                <p className="text-xl font-black">Upload Gallery Photos</p>
                <input type="file" accept="image/*" multiple onChange={(e) => addGalleryFiles(e.target.files)} className="mt-4" />
              </div>

              {site.gallery.map((img, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[180px_1fr]">
                  <div>
                    {img ? (
                      <img src={img} alt={"gallery " + index} className="h-28 w-full rounded-2xl object-cover" />
                    ) : (
                      <div className="grid h-28 place-items-center rounded-2xl bg-white text-sm font-black text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    {field("image url " + (index + 1), img, (v) => {
                      const next = cloneData(site);
                      next.gallery[index] = v;
                      setSite(next);
                    })}
                    <button type="button" onClick={() => {
                      const next = cloneData(site);
                      next.gallery.splice(index, 1);
                      setSite(next);
                    }} className="mt-3 rounded-xl bg-red-500 px-4 py-2 font-black text-white">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => {
                const next = cloneData(site);
                next.gallery.push("");
                setSite(next);
              }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">
                Add Image URL
              </button>
            </div>
          ) : null}

          {tab === "faqs" ? (
            <div className="grid gap-4">
              {site.faqs.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-4">
                  {field("question", item.q, (v) => {
                    const next = cloneData(site);
                    next.faqs[index].q = v;
                    setSite(next);
                  })}
                  {field("answer", item.a, (v) => {
                    const next = cloneData(site);
                    next.faqs[index].a = v;
                    setSite(next);
                  })}
                  <button type="button" onClick={() => {
                    const next = cloneData(site);
                    next.faqs.splice(index, 1);
                    setSite(next);
                  }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">
                    Remove FAQ
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => {
                const next = cloneData(site);
                next.faqs.push({
                  q: "New question",
                  a: "New answer"
                });
                setSite(next);
              }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">
                Add FAQ
              </button>
            </div>
          ) : null}
        </div>

        <div className="border-t p-4">
          <p className="mb-2 text-sm font-black text-cyan-700">{saveMsg}</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => {
              setSite(cloneData(DEFAULT_SITE));
              setSaveMsg("Reset done. Click Save to store reset data.");
            }} className="rounded-full bg-red-500 px-5 py-3 font-black text-white">
              Reset
            </button>
            <button type="button" onClick={save} className="rounded-full bg-blue-950 px-5 py-3 font-black text-white">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Popup({ site }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), Number(site.popupDelay) || 30000);
    return () => clearTimeout(timer);
  }, [site.popupDelay]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-w-lg overflow-hidden rounded-[2.4rem] border border-white/20 bg-white shadow-2xl" style={{ animation: "popupIn .55s cubic-bezier(.2,.9,.2,1) both" }}>
        <button type="button" onClick={() => setShow(false)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-xl font-black text-slate-950 shadow-lg">
          ×
        </button>

        <div className="relative bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-700 p-8 text-white">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-100 backdrop-blur-xl">
            Consultation
          </p>
          <h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
            Need Solar, Plumbing or Pumping Solution?
          </h3>
          <p className="mt-3 leading-7 text-slate-200">
            Send your enquiry and connect with our team.
          </p>
        </div>

        <div className="p-7">
          <a href={whatsappUrl(site, "Hello, I want consultation from Ansh Trading Company. Please share details.")} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-center font-black text-white">
            <IconSvg type="whatsapp" /> WhatsApp Enquiry Now
          </a>
          <button type="button" onClick={() => setShow(false)} className="mt-3 w-full rounded-full border border-slate-200 px-6 py-3 font-black text-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Floating({ site }) {
  const items = [
    {
      label: "WhatsApp",
      type: "whatsapp",
      href: whatsappUrl(site, "Hello, I want enquiry"),
      bg: "bg-[#25D366] text-white"
    },
    {
      label: "Call",
      type: "phone",
      href: callUrl(site),
      bg: "bg-cyan-400 text-slate-950"
    },
    {
      label: "Instagram",
      type: "instagram",
      href: instagramUrl(site),
      bg: "bg-white text-slate-950"
    },
    {
      label: "Email",
      type: "mail",
      href: "mailto:" + site.company.email,
      bg: "bg-white text-slate-950"
    }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[70] grid gap-3">
      {items.map((item) => (
        <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} title={item.label} className={item.bg + " grid h-14 w-14 place-items-center rounded-full shadow-2xl transition hover:-translate-y-1 hover:scale-110"}>
          <IconSvg type={item.type} />
        </a>
      ))}
    </div>
  );
}

export default function App() {
  const [site, setSite] = useState(() => loadSite());
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const syncAdminHash = () => setAdmin(window.location.hash === "#admin");
    syncAdminHash();
    window.addEventListener("hashchange", syncAdminHash);
    return () => window.removeEventListener("hashchange", syncAdminHash);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SEO site={site} />
      <GlobalStyles />
      {loading ? <Loader /> : null}

      <Header site={site} />
      <Hero site={site} />
      <About site={site} />
      <Cards site={site} id="products" small="Products" title="Our Product Solutions" items={site.products} />
      <Cards site={site} id="services" small="Services" title="Professional Services" items={site.services} dark />
      <Benefits site={site} />
      <Enquiry site={site} />
      <Gallery site={site} />
      <FAQ site={site} />
      <Contact site={site} />
      <Floating site={site} />
      <Popup site={site} />

      {admin ? (
        sessionStorage.getItem("atc_admin_login") === "yes" ? (
          <Admin site={site} setSite={setSite} close={() => { window.location.hash = ""; setAdmin(false); }} />
        ) : (
          <AdminLogin onSuccess={() => setAdmin(true)} onCancel={() => { window.location.hash = ""; setAdmin(false); }} />
        )
      ) : null}
    </div>
  );
}
