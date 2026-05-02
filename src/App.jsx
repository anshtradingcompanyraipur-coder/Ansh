import React, { useEffect, useMemo, useState } from "react";

/*
  ANSH TRADING COMPANY WEBSITE
  Fix for QuotaExceededError:
  - Uploaded base64 logo is NOT saved into localStorage.
  - Use Logo Image URL for permanent logo.
  - File upload works for live preview only.
*/

const STORAGE_KEY = "atc_site_v2";

const DEFAULT = {
  popupDelay: 35000,
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
    text: "Premium corporate website for B2C customers, project clients, dealers and associates with WhatsApp lead capture and dynamic admin editing.",
    bg: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1800&q=80",
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80"
  },
  products: [
    { title: "Complete Solar Setup", icon: "☀️", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80", text: "Complete solar setup for homes, offices and commercial sites." },
    { title: "Complete Plumbing Solution", icon: "💧", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80", text: "Professional plumbing solution for projects and homes." },
    { title: "Complete Pumping Solution", icon: "🌊", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80", text: "Reliable pumping solution for borewell, water and sites." }
  ],
  services: [
    { title: "Complete Solar Installation", icon: "⚡", text: "End-to-end solar installation with survey, planning and support." },
    { title: "Plumbing Work for Projects", icon: "🔧", text: "Plumbing work support for construction and infrastructure projects." },
    { title: "Civil Constructions", icon: "🏗️", text: "Civil construction support for residential and commercial work." }
  ],
  benefits: [
    { title: "Hold Dealership", icon: "🛡️", text: "Grow your business with dealership opportunity." },
    { title: "Become an Associate", icon: "🤝", text: "Join associate network and work on leads." },
    { title: "Quality Service B2C", icon: "🏆", text: "Reliable execution and after-sales service." }
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
    { q: "Can I become dealer or associate?", a: "Yes, send enquiry through form or WhatsApp." },
    { q: "Where are you located?", a: "Raipur, Chhattisgarh." }
  ]
};

const nav = ["home", "about", "products", "services", "benefits", "gallery", "faq", "contact"];
const copy = (x) => JSON.parse(JSON.stringify(x));
const isDataUrl = (v) => typeof v === "string" && v.startsWith("data:image/");
const siteForStorage = (site) => {
  const safe = copy(site);
  if (isDataUrl(safe.company.logoImage)) safe.company.logoImage = "";
  if (Array.isArray(safe.gallery)) safe.gallery = safe.gallery.map((x) => isDataUrl(x) ? "" : x);
  if (Array.isArray(safe.products)) safe.products = safe.products.map((x) => ({ ...x, image: isDataUrl(x.image) ? "" : x.image }));
  return safe;
};
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return copy(DEFAULT);
    const saved = JSON.parse(raw);
    return {
      ...copy(DEFAULT),
      ...saved,
      company: { ...copy(DEFAULT.company), ...(saved.company || {}) },
      hero: { ...copy(DEFAULT.hero), ...(saved.hero || {}) },
      products: saved.products || copy(DEFAULT.products),
      services: saved.services || copy(DEFAULT.services),
      benefits: saved.benefits || copy(DEFAULT.benefits),
      gallery: saved.gallery || copy(DEFAULT.gallery),
      faqs: saved.faqs || copy(DEFAULT.faqs)
    };
  } catch (e) {
    return copy(DEFAULT);
  }
};
const wa = (site, msg) => "https://wa.me/91" + site.company.whatsapp + "?text=" + encodeURIComponent(msg);
const tel = (site) => "tel:+91" + site.company.phone;
const insta = (site) => "https://instagram.com/" + site.company.instagram;

function runTests() {
  try {
    const s = copy(DEFAULT);
    s.company.logoImage = "data:image/png;base64," + "a".repeat(10000);
    console.assert(siteForStorage(s).company.logoImage === "", "Large uploaded logo should not be stored");
    s.company.logoImage = "https://example.com/logo.png";
    console.assert(siteForStorage(s).company.logoImage.includes("https://"), "Logo URL should be stored");
    console.assert(wa(DEFAULT, "hello").includes("wa.me/91"), "WhatsApp link should be valid");
  } catch (e) {
    console.warn("ATC tests failed", e);
  }
}

function SEO({ site }) {
  useEffect(() => {
    document.title = site.company.name + " | Solar, Plumbing, Pumping & Construction";
    const meta = [
      ["description", site.company.name + " provides solar installation, plumbing, pumping and civil construction solutions in " + site.company.location],
      ["keywords", "solar installation Raipur, plumbing work, pumping solution, civil construction, Ansh Trading Company"]
    ];
    meta.forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
    if (site.company.logoImage) {
      let icon = document.querySelector("link[rel='icon']");
      if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
      }
      icon.href = site.company.logoImage;
    }
  }, [site]);
  return null;
}

function Loader() {
  return <div className="fixed inset-0 z-[200] grid place-items-center bg-slate-950 text-white"><div className="text-center"><div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"/><h2 className="text-2xl font-black">Loading ATC...</h2></div></div>;
}

function Title({ small, title, text, dark }) {
  return <div className="mx-auto mb-10 max-w-3xl text-center"><p className={(dark ? "text-cyan-300" : "text-cyan-500") + " mb-3 text-sm font-black uppercase tracking-[.25em]"}>{small}</p><h2 className={(dark ? "text-white" : "text-slate-950") + " text-3xl font-black md:text-5xl"}>{title}</h2>{text && <p className={(dark ? "text-slate-300" : "text-slate-600") + " mt-4 text-lg leading-8"}>{text}</p>}</div>;
}

function Header({ site, openAdmin }) {
  const [menu, setMenu] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  function logoClick(e) {
    e.preventDefault();
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) { setClicks(0); openAdmin(); }
    setTimeout(() => setClicks(0), 2500);
  }
  return <header className={(scrolled ? "py-1 bg-white/95 shadow-2xl" : "py-3 bg-white/80 shadow-lg") + " fixed inset-x-0 top-0 z-50 transition-all duration-500 backdrop-blur-xl"}><div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8"><a href="#home" onClick={logoClick} className="flex items-center gap-3">{site.company.logoImage ? <img src={site.company.logoImage} alt="logo" className="h-12 w-12 rounded-2xl object-cover"/> : <div className="grid h-12 w-12 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-950 font-black text-white">{site.company.logo}</div>}<div><p className="font-black leading-5 text-slate-950">{site.company.name}</p><p className="text-xs font-bold text-blue-950">({site.company.group})</p></div></a><nav className="hidden gap-6 lg:flex">{nav.map((x) => <a key={x} href={"#" + x} className="text-sm font-black capitalize text-slate-700 hover:text-cyan-500">{x}</a>)}</nav><div className="hidden gap-3 lg:flex"><a href={tel(site)} className="rounded-full border border-blue-950 px-5 py-2 font-black text-blue-950">Call</a><a href={wa(site,"Hello, I want enquiry")} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-5 py-2 font-black text-slate-950">WhatsApp</a></div><button onClick={() => setMenu(!menu)} className="rounded-xl bg-slate-100 px-4 py-2 text-2xl font-black lg:hidden">{menu ? "×" : "☰"}</button></div>{menu && <div className="border-t bg-white p-4 lg:hidden">{nav.map((x) => <a key={x} onClick={() => setMenu(false)} href={"#" + x} className="block rounded-xl px-4 py-3 font-black capitalize text-slate-700">{x}</a>)}</div>}</header>;
}

function Hero({ site }) {
  return <section id="home" className="relative min-h-screen overflow-hidden bg-slate-950 pt-28 text-white"><style>{`
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes shine{to{background-position:-200%}}
@keyframes fadeUp{from{opacity:0;transform:translateY(35px)}to{opacity:1;transform:translateY(0)}}
@keyframes blob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-30px) scale(1.1)}66%{transform:translate(-20px,20px) scale(.95)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 rgba(34,211,238,0)}50%{box-shadow:0 0 45px rgba(34,211,238,.45)}}
@keyframes clickPop{0%{transform:translate(-50%,-50%) scale(.2);opacity:.9}70%{opacity:.45}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
@keyframes popupIn{0%{opacity:0;transform:translateY(40px) scale(.86) rotateX(12deg)}100%{opacity:1;transform:translateY(0) scale(1) rotateX(0)}}
@keyframes popupGlow{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:.95}}
@keyframes slideBadge{0%{transform:translateX(-18px);opacity:0}100%{transform:translateX(0);opacity:1}}
@keyframes softBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.float{animation:float 4s ease-in-out infinite}.shine{background:linear-gradient(90deg,#fff,#67e8f9,#fff);background-size:200%;-webkit-background-clip:text;color:transparent;animation:shine 3s linear infinite}.card{transition:.45s;position:relative;overflow:hidden}.card:hover{transform:translateY(-14px) scale(1.025);box-shadow:0 30px 70px rgba(15,23,42,.22)}.fadeup{animation:fadeUp .9s ease both}.blob{animation:blob 8s ease-in-out infinite}.glow{animation:glow 2.8s ease-in-out infinite}.click-ripple{position:fixed;width:70px;height:70px;border-radius:9999px;pointer-events:none;z-index:9999;background:radial-gradient(circle,rgba(34,211,238,.55),rgba(37,99,235,.22),transparent 70%);animation:clickPop .7s ease-out forwards;mix-blend-mode:screen}a,button,.card,img{cursor:pointer}a:hover,button:hover{filter:drop-shadow(0 0 14px rgba(34,211,238,.45))}
`}</style><img src={site.hero.bg} alt="hero" className="absolute inset-0 h-full w-full object-cover opacity-30"/><div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950"/><div className="blob absolute left-10 top-28 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"/><div className="blob absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"/><div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-8 lg:grid-cols-2"><div className="fadeup"><p className="inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300 backdrop-blur-xl">Corporate + Lead Generation</p><h1 className="shine mt-7 text-5xl font-black md:text-7xl">{site.company.name}</h1><p className="mt-2 text-3xl font-black text-cyan-300">({site.company.group})</p><h2 className="mt-6 text-2xl font-black md:text-4xl">{site.hero.title}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{site.hero.text}</p><div className="mt-8 flex flex-col gap-4 sm:flex-row"><a href={wa(site,"Hello, I want free consultation for solar / plumbing / pumping solution")} target="_blank" rel="noreferrer" className="glow rounded-full bg-cyan-400 px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-300">Get Free Consultation</a><a href={wa(site,"Hello, I want enquiry for "+site.company.tagline)} target="_blank" rel="noreferrer" className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-center font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:text-blue-950">WhatsApp Enquiry</a></div></div><div className="float rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"><img src={site.hero.img} alt="solar" className="h-[430px] w-full rounded-[1.5rem] object-cover"/></div></div></section>;
}

function ProductPhotoSlider({ site, items }) {
  const slides = (items || []).filter((x) => x.image);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="mx-auto mb-12 max-w-7xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((item, index) => (
            <div key={index} className="relative min-w-full">
              <img src={item.image} alt={item.title} className="h-[260px] w-full object-cover md:h-[430px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white md:p-9">
                <p className="mb-3 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-slate-950 shadow-xl">
                  Product Showcase
                </p>
                <h3 className="text-3xl font-black md:text-5xl">{item.title}</h3>
                <p className="mt-3 max-w-xl text-sm font-bold leading-7 text-slate-200 md:text-base">
                  {item.text || "Premium product solution by Ansh Trading Company."}
                </p>
                <a
                  href={wa(site, "I want enquiry for " + item.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-500"
                >
                  <IconSvg type="whatsapp" /> Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl transition hover:scale-110 hover:bg-cyan-400"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl transition hover:scale-110 hover:bg-cyan-400"
            >
              ›
            </button>
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={(current === index ? "w-9 bg-cyan-400" : "w-3 bg-white/80") + " h-3 rounded-full shadow-lg transition-all"}
                  aria-label={"Go to slide " + (index + 1)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Cards({ site, id, small, title, items, dark }) {
  const bulletData = {
    products: {
      "Complete Solar Setup": [
        "Rooftop solar planning and setup",
        "Residential and commercial installation",
        "Panel, inverter and structure support",
        "After-sales service and guidance"
      ],
      "Complete Plumbing Solution": [
        "Complete pipeline planning",
        "Project and home plumbing work",
        "Material and execution support",
        "Leakage and maintenance support"
      ],
      "Complete Pumping Solution": [
        "Borewell and water pumping setup",
        "Pump selection guidance",
        "Site-based installation support",
        "Reliable water flow solution"
      ]
    },
    services: {
      "Complete Solar Installation": [
        "Site survey and load planning",
        "Panel mounting and wiring",
        "Inverter setup and testing",
        "Service support after installation"
      ],
      "Plumbing Work for Projects": [
        "Project pipeline execution",
        "Bathroom and water-line work",
        "Professional fitting support",
        "On-site supervision support"
      ],
      "Civil Constructions": [
        "Residential and commercial work",
        "Foundation and structure support",
        "Project-based civil execution",
        "Quality-focused finishing work"
      ]
    }
  };

  const getBullets = (it) => {
    if (bulletData[id] && bulletData[id][it.title]) return bulletData[id][it.title];
    if (!it.text) return [];
    return String(it.text)
      .split(String.fromCharCode(10))
      .flatMap((x) => x.split("."))
      .map((x) => x.trim())
      .filter(Boolean);
  };

  return (
    <section id={id} className={(dark ? "bg-white" : "bg-slate-50") + " fadeup px-4 py-20 md:px-8"}>
      <Title small={small} title={title} />

      {id === "products" && <ProductPhotoSlider site={site} items={items} />}

      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="card overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl">
            {it.image && <img src={it.image} alt={it.title} className="h-56 w-full object-cover" />}
            <div className="p-6">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-cyan-50 text-4xl shadow-inner">
                {it.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-950">{it.title}</h3>

              {["products", "services"].includes(id) ? (
                <ul className="mt-5 space-y-3">
                  {getBullets(it).map((b, idx) => (
                    <li key={idx} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 leading-7 text-slate-600">{it.text}</p>
              )}

              <a
                href={wa(site, "I want details for " + it.title)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                <IconSvg type="whatsapp" /> Enquire Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimpleImageSlider({ images, title, subtitle }) {
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

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((img, index) => (
          <div key={index} className="relative min-w-full">
            <img src={img} alt={title || "slide"} className="h-[330px] w-full object-cover md:h-[430px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
            {(title || subtitle) && (
              <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
                {subtitle && (
                  <p className="mb-2 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-slate-950">
                    {subtitle}
                  </p>
                )}
                {title && <h3 className="text-2xl font-black md:text-4xl">{title}</h3>}
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl transition hover:scale-110 hover:bg-cyan-400"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-3xl font-black text-slate-950 shadow-xl transition hover:scale-110 hover:bg-cyan-400"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={(current === index ? "w-9 bg-cyan-400" : "w-3 bg-white/80") + " h-3 rounded-full shadow-lg transition-all"}
                aria-label={"Go to image " + (index + 1)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function About({ site }) {
  const aboutImages = [site.hero.img, site.hero.bg, ...site.gallery].filter(Boolean);

  return (
    <section id="about" className="fadeup bg-white px-4 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <SimpleImageSlider images={aboutImages} />

        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">About Us</p>
          <h2 className="text-3xl font-black md:text-5xl">Complete solutions under one trusted brand.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {site.company.name} provides complete solutions in solar installation, plumbing, pumping and civil construction for B2C and project-based clients.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Professional Team", "Quality Service", "Project Support", "Fast Response"].map((x) => (
              <div key={x} className="rounded-2xl bg-slate-50 p-4 font-black shadow">✓ {x}</div>
            ))}
          </div>

          <a
            href={wa(site, "Hello, I want to know more about Ansh Trading Company")}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-300"
          >
            <IconSvg type="whatsapp" /> Know More
          </a>
        </div>
      </div>
    </section>
  );
}

function Benefits({ site }) {
  return (
    <section id="benefits" className="fadeup bg-blue-950 px-4 py-20 text-white md:px-8">
      <Title small="Benefits" title="Grow With Ansh Trading Company" dark />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {site.benefits.map((it, i) => (
          <div key={i} className="card rounded-[2rem] border border-white/10 bg-white/10 p-8">
            <div className="mb-4 text-5xl">{it.icon}</div>
            <h3 className="text-2xl font-black">{it.title}</h3>
            <p className="mt-4 leading-8 text-slate-200">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Enquiry({ site }) {
  const opts = [...site.products.map((x) => x.title), ...site.services.map((x) => x.title), "Dealership", "Associate"];
  const [f,setF] = useState({name:"",mobile:"",city:"",req:opts[0] || "",msg:""});
  const [ok,setOk] = useState(false);
  const msg = useMemo(() => `Hello ${site.company.name}, I want enquiry. Name: ${f.name || "-"}, Mobile: ${f.mobile || "-"}, City: ${f.city || "-"}, Requirement: ${f.req}, Message: ${f.msg || "-"}`, [f, site.company.name]);
  const sendToSheet = async () => {
    if (!site.company.sheetWebhook) return;
    try {
      await fetch(site.company.sheetWebhook, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-IN"),
          name: f.name,
          mobile: f.mobile,
          city: f.city,
          requirement: f.req,
          message: f.msg,
          source: site.company.name
        })
      });
    } catch (e) {
      console.warn("Google Sheet submit failed", e);
    }
  };
  const openWhatsApp = () => {
    setOk(true);
    sendToSheet();
    window.open(wa(site,msg), "_blank", "noopener,noreferrer");
    setTimeout(() => setOk(false), 3500);
  };
  return <section id="enquiry" className="fadeup relative overflow-hidden bg-slate-50 px-4 py-20 md:px-8"><div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl"/><div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"/><div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"><div><p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-cyan-500">Enquiry Form</p><h2 className="text-3xl font-black md:text-5xl">Get free consultation today.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Form submit करते ही WhatsApp पर auto-filled enquiry message खुल जाएगा।</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Fast WhatsApp Reply","Site Visit Support","Dealer / Associate Query","Project Work Enquiry"].map((x,i)=><a key={x} href={wa(site,"Hello, I want enquiry for "+x)} target="_blank" rel="noreferrer" style={{animationDelay:(i*120)+"ms"}} className="rounded-2xl border border-cyan-100 bg-white p-4 font-black text-slate-800 shadow-lg transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50">⚡ {x}</a>)}</div></div><form onSubmit={(e) => { e.preventDefault(); openWhatsApp(); }} className="card rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8"><div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-950 to-cyan-500 p-5 text-white"><div><p className="text-sm font-black uppercase tracking-[.2em] text-cyan-100">Quick Lead Capture</p><h3 className="mt-1 text-2xl font-black">Send enquiry on WhatsApp</h3></div><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white shadow-xl ring-4 ring-white/20"><IconSvg type="whatsapp"/></div></div><div className="grid gap-4 sm:grid-cols-2"><input required placeholder="Name" value={f.name} onChange={(e) => setF({...f,name:e.target.value})} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"/><input required placeholder="Mobile" value={f.mobile} onChange={(e) => setF({...f,mobile:e.target.value})} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"/><input required placeholder="City" value={f.city} onChange={(e) => setF({...f,city:e.target.value})} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"/><select value={f.req} onChange={(e) => setF({...f,req:e.target.value})} className="rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100">{opts.map((o) => <option key={o}>{o}</option>)}</select></div><textarea rows={5} placeholder="Message" value={f.msg} onChange={(e) => setF({...f,msg:e.target.value})} className="mt-4 w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"/><div className="mt-5 flex flex-col gap-3 sm:flex-row"><button className="glow inline-flex items-center justify-center gap-2 rounded-full bg-blue-950 px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-slate-900"><IconSvg type="whatsapp"/> Submit & Open WhatsApp</button><a href={wa(site,msg)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-center font-black text-white transition hover:-translate-y-1 hover:bg-green-500"><IconSvg type="whatsapp"/> Direct WhatsApp</a></div>{ok && <div className="mt-5 rounded-2xl bg-green-100 p-4 font-black text-green-700">✅ WhatsApp enquiry opened. Message check करके send दबा देना.</div>}</form></div></section>;
}

function Gallery({ site }) {
  return (
    <section id="gallery" className="relative overflow-hidden bg-white px-4 py-20 md:px-8">
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative">
        <Title small="Gallery" title="Work Gallery" text="Premium work photos with auto-slide showcase and HD thumbnail view." />
        <div className="mx-auto max-w-7xl">
          <SimpleImageSlider images={site.gallery} title="Our Premium Work Gallery" subtitle="Recent Work" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.gallery.map((g, i) => (
              <a
                key={i}
                href={g || "#gallery"}
                target={g ? "_blank" : undefined}
                rel={g ? "noreferrer" : undefined}
                className="group relative overflow-hidden rounded-[1.8rem] bg-slate-100 shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-2xl"
              >
                {g ? (
                  <img
                    src={g}
                    alt={"gallery " + (i + 1)}
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-56 place-items-center text-sm font-black text-slate-400">Add Photo URL</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 opacity-0 shadow-lg transition group-hover:opacity-100">
                  View Photo {i + 1}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ site }) {
  const [a, setA] = useState(0);
  return (
    <section id="faq" className="bg-slate-50 px-4 py-20 md:px-8">
      <Title small="FAQ" title="Frequently Asked Questions" />
      <div className="mx-auto max-w-4xl space-y-4">
        {site.faqs.map((f, i) => (
          <div key={i} className="rounded-2xl bg-white shadow">
            <button
              type="button"
              onClick={() => setA(a === i ? -1 : i)}
              className="flex w-full justify-between p-5 text-left font-black"
            >
              {f.q}
              <span>{a === i ? "−" : "+"}</span>
            </button>
            {a === i && <p className="px-5 pb-5 text-slate-600">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ site }) {
  const mapSrc = site.company.mapEmbed || ("https://www.google.com/maps?q=" + encodeURIComponent(site.company.location || "Raipur, Chhattisgarh") + "&output=embed");

  return (
    <section id="contact" className="bg-slate-950 px-4 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <Title small="Contact" title="Connect with us" dark />
          <div className="grid gap-4">
            <a href={tel(site)} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="phone" /> +91 {site.company.phone}</a>
            <a href={wa(site, "Hello, I want to connect")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black text-[#25D366]"><IconSvg type="whatsapp" /> WhatsApp</a>
            <a href={"mailto:" + site.company.email} className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="mail" /> {site.company.email}</a>
            <a href={insta(site)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 font-black"><IconSvg type="instagram" /> @{site.company.instagram}</a>
            <p className="rounded-2xl bg-white/10 p-5 font-black">📍 {site.company.location}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-white/10 p-3 shadow-2xl">
          <iframe
            title="Google Map Location"
            src={mapSrc}
            className="h-[420px] w-full rounded-[1.5rem] border-0"
            loading="lazy"
            allowFullScreen
          />
          <div className="p-4 text-center">
            <p className="font-black">📍 {site.company.location}</p>
            <a
              href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(site.company.location || "Raipur, Chhattisgarh")}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full bg-cyan-400 px-5 py-2 font-black text-slate-950"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Admin({ site, setSite, close }) {
  const [tab, setTab] = useState("company");
  const [saveMsg, setSaveMsg] = useState("");

  function uploadLogo(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const n = copy(site);
      n.company.logoImage = reader.result;
      setSite(n);
      setSaveMsg("Logo preview set. Permanent save ke liye Logo Image URL paste karo.");
    };
    reader.readAsDataURL(file);
  }

  const upd = (path, val) => {
    const n = copy(site);
    let o = n;
    path.slice(0, -1).forEach((k) => (o = o[k]));
    o[path[path.length - 1]] = val;
    setSite(n);
  };

  const itemUpd = (sec, i, k, v) => {
    const n = copy(site);
    n[sec][i][k] = v;
    setSite(n);
  };

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteForStorage(site)));
      setSaveMsg("Saved successfully.");
    } catch (e) {
      setSaveMsg("Save failed. Large uploaded images ki jagah image URL use karo.");
    }
  };

  const addGalleryFiles = (files) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const n = copy(site);
        n.gallery.push(String(reader.result || ""));
        setSite(n);
        setSaveMsg("Gallery photos preview mein add ho gayi. Permanent save ke liye image URL use karo.");
      };
      reader.readAsDataURL(file);
    });
  };

  const replaceGalleryFile = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const n = copy(site);
      n.gallery[index] = String(reader.result || "");
      setSite(n);
      setSaveMsg("Gallery photo preview replace ho gayi. Permanent save ke liye image URL use karo.");
    };
    reader.readAsDataURL(file);
  };

  const field = (label, val, on) => (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <input value={val || ""} onChange={(e) => on(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
    </label>
  );

  const list = (sec) => (
    <div className="grid gap-4">
      {site[sec].map((it, i) => (
        <div key={i} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
          {field("title", it.title, (v) => itemUpd(sec, i, "title", v))}
          {field("icon", it.icon, (v) => itemUpd(sec, i, "icon", v))}
          {"image" in it && field("image url", it.image, (v) => itemUpd(sec, i, "image", v))}
          <textarea value={it.text || ""} onChange={(e) => itemUpd(sec, i, "text", e.target.value)} className="rounded-xl border px-3 py-2 md:col-span-2" />
          <button type="button" onClick={() => { const n = copy(site); n[sec].splice(i, 1); setSite(n); }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => { const n = copy(site); n[sec].push({ title: "New Item", icon: "⭐", image: "", text: "Details here" }); setSite(n); }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">Add New</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col rounded-[2rem] bg-white shadow-2xl">
        <div className="flex justify-between border-b p-4">
          <div>
            <h2 className="text-2xl font-black">Hidden Admin Panel</h2>
            <p className="text-xs font-bold text-slate-500">Shortcut: Ctrl + Shift + Alt + A, or logo 5 clicks</p>
          </div>
          <button type="button" onClick={close} className="rounded-xl bg-slate-900 px-4 py-2 font-black text-white">Close</button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b p-3">
          {["company", "hero", "products", "services", "benefits", "gallery", "faqs"].map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setTab(x)}
              className={(tab === x ? "bg-cyan-400" : "bg-slate-100") + " rounded-full px-4 py-2 font-black capitalize"}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "company" && (
            <div className="grid gap-4 md:grid-cols-2">
              {field("company name", site.company.name, (v) => upd(["company", "name"], v))}
              {field("group", site.company.group, (v) => upd(["company", "group"], v))}
              {field("short logo text", site.company.logo, (v) => upd(["company", "logo"], v))}
              {field("logo image url", site.company.logoImage, (v) => upd(["company", "logoImage"], v))}
              {field("tagline", site.company.tagline, (v) => upd(["company", "tagline"], v))}
              {field("phone", site.company.phone, (v) => upd(["company", "phone"], v))}
              {field("whatsapp", site.company.whatsapp, (v) => upd(["company", "whatsapp"], v))}
              {field("email", site.company.email, (v) => upd(["company", "email"], v))}
              {field("instagram", site.company.instagram, (v) => upd(["company", "instagram"], v))}
              {field("location", site.company.location, (v) => upd(["company", "location"], v))}
              {field("google sheet webhook url", site.company.sheetWebhook, (v) => upd(["company", "sheetWebhook"], v))}

              <div className="rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-5 md:col-span-2">
                <p className="text-lg font-black text-slate-950">Google Map Location</p>
                <p className="mt-1 text-sm font-bold text-slate-600">Location डालो और Generate दबाओ। चाहो तो Google Maps embed URL direct paste कर सकते हो।</p>
                {field("map embed url", site.company.mapEmbed, (v) => upd(["company", "mapEmbed"], v))}
                <button
                  type="button"
                  onClick={() => upd(["company", "mapEmbed"], "https://www.google.com/maps?q=" + encodeURIComponent(site.company.location || "Raipur, Chhattisgarh") + "&output=embed")}
                  className="mt-3 rounded-full bg-blue-950 px-5 py-3 font-black text-white"
                >
                  Generate Map From Location
                </button>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-5 text-center md:col-span-2">
                <p className="font-black text-slate-950">Logo Upload</p>
                <p className="mt-1 text-sm font-bold text-slate-500">Upload preview only. Permanent save ke liye Logo Image URL paste karo.</p>
                <input type="file" accept="image/*" onChange={(e) => uploadLogo(e.target.files && e.target.files[0])} className="mt-4" />
                {site.company.logoImage ? <img src={site.company.logoImage} alt="logo preview" className="mx-auto mt-4 h-20 w-20 rounded-2xl object-cover shadow-xl" /> : null}
              </div>

              {field("popupDelay", String(site.popupDelay), (v) => upd(["popupDelay"], Number(v)))}
            </div>
          )}

          {tab === "hero" && (
            <div className="grid gap-4 md:grid-cols-2">
              {field("title", site.hero.title, (v) => upd(["hero", "title"], v))}
              {field("text", site.hero.text, (v) => upd(["hero", "text"], v))}
              {field("background image url", site.hero.bg, (v) => upd(["hero", "bg"], v))}
              {field("side image url", site.hero.img, (v) => upd(["hero", "img"], v))}
            </div>
          )}

          {["products", "services", "benefits"].includes(tab) && list(tab)}

          {tab === "gallery" && (
            <div className="grid gap-5">
              <div className="rounded-3xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-5 text-center shadow-inner">
                <p className="text-xl font-black text-slate-950">Upload More Work Gallery Photos</p>
                <p className="mt-1 text-sm font-bold text-slate-500">Multiple photos select कर सकते हो। Permanent save के लिए direct image URL best रहेगा।</p>
                <input type="file" accept="image/*" multiple onChange={(e) => addGalleryFiles(e.target.files)} className="mt-4 rounded-xl bg-white p-3 font-bold shadow" />
              </div>

              {site.gallery.map((g, i) => (
                <div key={i} className="grid gap-3 rounded-2xl bg-slate-50 p-4 shadow md:grid-cols-[220px_1fr] md:items-start">
                  <div>
                    {g ? (
                      <img src={g} alt={"gallery preview " + (i + 1)} className="h-44 w-full rounded-2xl object-cover shadow md:h-36" />
                    ) : (
                      <div className="grid h-44 place-items-center rounded-2xl bg-white text-sm font-black text-slate-400 md:h-36">No Image</div>
                    )}
                    <label className="mt-3 block rounded-2xl border-2 border-dashed border-cyan-300 bg-white p-3 text-center text-xs font-black text-slate-700">
                      Replace / Upload
                      <input type="file" accept="image/*" onChange={(e) => replaceGalleryFile(i, e.target.files && e.target.files[0])} className="mt-2 w-full text-xs" />
                    </label>
                  </div>

                  <div className="grid gap-3">
                    {field("image url " + (i + 1), g, (v) => {
                      const n = copy(site);
                      n.gallery[i] = v;
                      setSite(n);
                    })}
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => { const n = copy(site); n.gallery.splice(i + 1, 0, ""); setSite(n); }} className="rounded-xl bg-cyan-400 px-4 py-2 font-black text-slate-950">Add Below</button>
                      <button type="button" onClick={() => { const n = copy(site); n.gallery.splice(i, 1); setSite(n); }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">Remove Photo</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => { const n = copy(site); n.gallery.push(""); setSite(n); }} className="rounded-full bg-cyan-400 px-5 py-3 font-black text-slate-950">Add Blank Image URL</button>
                <button
                  type="button"
                  onClick={() => {
                    const n = copy(site);
                    n.gallery = [
                      ...n.gallery,
                      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=90",
                      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=90",
                      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=90"
                    ];
                    setSite(n);
                    setSaveMsg("Sample HD gallery photos add ho gayi.");
                  }}
                  className="rounded-full bg-blue-950 px-5 py-3 font-black text-white"
                >
                  Add Sample HD Photos
                </button>
              </div>
            </div>
          )}

          {tab === "faqs" && (
            <div className="grid gap-4">
              {site.faqs.map((f, i) => (
                <div key={i} className="grid gap-3 rounded-2xl bg-slate-50 p-4">
                  {field("question", f.q, (v) => { const n = copy(site); n.faqs[i].q = v; setSite(n); })}
                  {field("answer", f.a, (v) => { const n = copy(site); n.faqs[i].a = v; setSite(n); })}
                  <button type="button" onClick={() => { const n = copy(site); n.faqs.splice(i, 1); setSite(n); }} className="rounded-xl bg-red-500 px-4 py-2 font-black text-white">Remove FAQ</button>
                </div>
              ))}
              <button type="button" onClick={() => { const n = copy(site); n.faqs.push({ q: "New question", a: "New answer" }); setSite(n); }} className="rounded-full bg-cyan-400 px-5 py-3 font-black">Add FAQ</button>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <p className="mb-2 text-sm font-black text-cyan-700">{saveMsg}</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setSite(copy(DEFAULT)); setSaveMsg("Reset done. Click Save to store reset data."); }} className="rounded-full bg-red-500 px-5 py-3 font-black text-white">Reset</button>
            <button type="button" onClick={save} className="rounded-full bg-blue-950 px-5 py-3 font-black text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Popup({ site }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), Number(site.popupDelay) || 35000);
    return () => clearTimeout(t);
  }, [site.popupDelay]);

  if (!show) return null;

  const popupMsg = "Hello, I want consultation from Ansh Trading Company. Please share details.";
  const quick = ["Solar Installation", "Dealership", "Associate", "Project Work"];

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-w-lg overflow-hidden rounded-[2.4rem] border border-white/20 bg-white shadow-[0_40px_120px_rgba(34,211,238,.35)]" style={{ animation: "popupIn .55s cubic-bezier(.2,.9,.2,1) both" }}>
        <button type="button" onClick={() => setShow(false)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-xl font-black text-slate-950 shadow-lg transition hover:rotate-90 hover:bg-slate-950 hover:text-white">×</button>
        <div className="relative bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-700 p-8 text-white">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-100 backdrop-blur-xl">Limited Consultation</p>
          <h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">Need Solar, Plumbing or Pumping Solution?</h3>
          <p className="mt-3 leading-7 text-slate-200">Ek click mein WhatsApp enquiry bhejo aur team se quick response lo.</p>
        </div>
        <div className="p-7">
          <div className="grid grid-cols-2 gap-3">
            {quick.map((q, i) => (
              <a key={q} href={wa(site, "Hello, I want enquiry for " + q)} target="_blank" rel="noreferrer" style={{ animation: `slideBadge .45s ease both ${i * 90}ms` }} className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-black text-slate-800 shadow transition hover:-translate-y-1 hover:bg-cyan-50 hover:text-blue-950">{q}</a>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <a href={wa(site, popupMsg)} target="_blank" rel="noreferrer" className="glow inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-center font-black text-white transition hover:-translate-y-1 hover:bg-green-500"><IconSvg type="whatsapp" /> WhatsApp Enquiry Now</a>
            <button type="button" onClick={() => setShow(false)} className="rounded-full border border-slate-200 px-6 py-3 font-black text-slate-700 transition hover:bg-slate-950 hover:text-white">Maybe Later</button>
          </div>
        </div>
      </div>
    </div>
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

  if (type === "instagram") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
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

  if (type === "message") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-5A8 8 0 1 1 21 12Z" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.11 5.18 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L9 10.69a16 16 0 0 0 4.31 4.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }

  return <span className="text-xl">•</span>;
}

function Floating({ site }) {
  const items = [
    { label: "WhatsApp", type: "whatsapp", href: wa(site, "Hello, I want enquiry"), bg: "bg-[#25D366] text-white" },
    { label: "Call", type: "phone", href: tel(site), bg: "bg-cyan-400 text-slate-950" },
    { label: "Instagram", type: "instagram", href: insta(site), bg: "bg-white text-slate-950" },
    { label: "Email", type: "mail", href: "mailto:" + site.company.email, bg: "bg-white text-slate-950" }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[70] grid gap-3">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target={it.href.startsWith("http") ? "_blank" : undefined}
          rel={it.href.startsWith("http") ? "noreferrer" : undefined}
          title={it.label}
          className={(it.bg || "bg-cyan-400 text-slate-950") + " grid h-14 w-14 place-items-center rounded-full shadow-2xl transition hover:-translate-y-1 hover:scale-110"}
        >
          <IconSvg type={it.type} />
        </a>
      ))}
    </div>
  );
}

export default function App() {
  const [site, setSite] = useState(() => load());
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && String(e.key).toLowerCase() === "a") setAdmin(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      const dot = document.createElement("span");
      dot.className = "click-ripple";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 750);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SEO site={site} />
      {loading && <Loader />}
      <Header site={site} openAdmin={() => setAdmin(true)} />
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
      {admin && <Admin site={site} setSite={setSite} close={() => setAdmin(false)} />}
    </div>
  );
}
