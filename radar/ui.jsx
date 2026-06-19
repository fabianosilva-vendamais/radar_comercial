/* ui.jsx — ícones, gauge velocímetro e helpers compartilhados */

const Icon = {
  radar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>
      <path d="M12 12 L20 7"/>
    </svg>
  ),
  buildings: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="8" width="8" height="13" rx="1"/><rect x="13" y="4" width="8" height="17" rx="1"/>
      <path d="M6 12h2M6 16h2M16 8h2M16 12h2M16 16h2"/>
    </svg>
  ),
  signal: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 18 L9 11 L13 14 L20 5"/><path d="M15 5h5v5"/>
    </svg>
  ),
  brain: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5a3 3 0 0 0-5 1.5A2.5 2.5 0 0 0 5 11a2.5 2.5 0 0 0 1 4.5A3 3 0 0 0 12 18z"/>
      <path d="M12 5a3 3 0 0 1 5 1.5A2.5 2.5 0 0 1 19 11a2.5 2.5 0 0 1-1 4.5A3 3 0 0 1 12 18z"/>
      <path d="M12 5v13"/>
    </svg>
  ),
  target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 21 8 12 13 3 8z"/><path d="M3 13l9 5 9-5"/>
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>
    </svg>
  ),
  chevR: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>),
  chevL: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>),
  briefcase: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>),
  clock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
  whatsapp: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.6 2.6 0 0 0-.8 1.9 4.5 4.5 0 0 0 1 2.4 10.3 10.3 0 0 0 4 3.5c1.5.6 1.8.5 2.1.5a2.2 2.2 0 0 0 1.5-1 1.8 1.8 0 0 0 .1-1c0-.1-.2-.2-.4-.3z"/></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 5 8-5"/></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9h3v12H3zM9 9h2.9v1.6h.04c.4-.75 1.4-1.6 2.96-1.6C18 9 19 10.9 19 13.6V21h-3v-6.6c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.5-.1.8V21H9z"/></svg>),
  phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>),
  copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  ext: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>),
  history: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4M12 8v4l3 2"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>),
  file: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>),
  sheet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>),
  sparkles: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/></svg>),
  filter: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>),
  calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>),
  users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5"/></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>),
  trophy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 16h6M10 20h4M12 13v3"/></svg>),
  alert: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>),
  edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>),
};

const CHAN_ICON = { "WhatsApp": Icon.whatsapp, "E-mail": Icon.mail, "LinkedIn": Icon.linkedin, "Ligação": Icon.phone };

function faixaOf(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const fx = window.RADAR_DATA.faixas;
  return fx.find(f => s >= f.min && s <= f.max) || fx[fx.length - 1];
}

function FaixaBadge({ score }) {
  const f = faixaOf(score);
  return (
    <span className="faixa" style={{ background: f.cor + "1f", color: f.cor }}>
      <span className="fd" style={{ background: f.cor }} />{f.label}
    </span>
  );
}

/* Velocímetro semicircular 0–100. 0 = esquerda (180°), 100 = direita (0°). */
function polar(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}
function arcTop(cx, cy, r, startDeg, endDeg) {
  const s = polar(cx, cy, r, startDeg), e = polar(cx, cy, r, endDeg);
  const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}
function Gauge({ score, size = 160 }) {
  const f = faixaOf(score);
  const stroke = size * 0.075;
  const r = (size - stroke) / 2 - 2;
  const cx = size / 2, cy = size * 0.56;
  const deg = (v) => 180 - 1.8 * v;

  const segs = window.RADAR_DATA.faixas.map(fa => ({
    d: arcTop(cx, cy, r, deg(fa.min), deg(Math.min(fa.max + 1, 100))),
    cor: fa.cor,
  }));
  const nd = deg(score);
  const tip = polar(cx, cy, r - stroke * 0.5, nd);
  const tail = polar(cx, cy, size * 0.05, nd + 180);

  return (
    <div style={{ position: "relative", width: size, height: size * 0.62 }}>
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`}>
        <path d={arcTop(cx, cy, r, 180, 0)} fill="none" stroke="#1b2230" strokeWidth={stroke} strokeLinecap="round" />
        {segs.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={s.cor} strokeWidth={stroke} strokeLinecap="butt" opacity="0.92" />
        ))}
        <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} stroke={f.cor} strokeWidth={size * 0.02} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={size * 0.04} fill={f.cor} />
        <circle cx={cx} cy={cy} r={size * 0.017} fill="#07090D" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.21, textAlign: "center" }}>
        <div className="mono" style={{ fontSize: size * 0.25, fontWeight: 600, lineHeight: 1, color: f.cor }}>{score}</div>
        <div className="mono" style={{ marginTop: 5, fontSize: size * 0.058, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tx-2)" }}>Intenção</div>
      </div>
    </div>
  );
}

/* mini radial for list rows */
function MiniScore({ score }) {
  const f = faixaOf(score);
  const sz = 40, sw = 4, r = (sz - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div className="mini-score">
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#1b2230" strokeWidth={sw} />
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={f.cor} strokeWidth={sw}
                  strokeDasharray={c} strokeDashoffset={c * (1 - score/100)} strokeLinecap="round" />
        </svg>
      </div>
      <div className="val" style={{ color: f.cor }}>{score}</div>
    </div>
  );
}

/* Radar sweep decorativo (hero) */
function RadarSweep() {
  return (
    <svg className="hero-sweep" viewBox="0 0 200 200" fill="none">
      <defs>
        <radialGradient id="sweepg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.0"/>
          <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.0"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35"/>
        </radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[40, 70, 100].map((rr, i) => (
        <circle key={i} cx="100" cy="100" r={rr} stroke="var(--accent)" strokeOpacity="0.16" strokeWidth="1" />
      ))}
      <line x1="100" y1="0" x2="100" y2="200" stroke="var(--accent)" strokeOpacity="0.08" />
      <line x1="0" y1="100" x2="200" y2="100" stroke="var(--accent)" strokeOpacity="0.08" />
      <g style={{ transformOrigin: "100px 100px", animation: "sweep 4s linear infinite" }}>
        <path d="M100 100 L100 0 A100 100 0 0 1 170 30 Z" fill="url(#beam)" />
        <line x1="100" y1="100" x2="100" y2="2" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.6" />
      </g>
      {[[100,30],[150,90],[70,140]].map((b,i)=>(
        <circle key={i} cx={b[0]} cy={b[1]} r="3" fill="var(--accent)">
          <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2+i}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

const sweepKeyframes = document.createElement("style");
sweepKeyframes.textContent = "@keyframes sweep { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }";
document.head.appendChild(sweepKeyframes);

Object.assign(window, { Icon, CHAN_ICON, faixaOf, FaixaBadge, Gauge, MiniScore, RadarSweep });

/* Fonte do sinal: monta link de verificação e status de veracidade */
function sigTerms(sinal) {
  const stop = new Set(["de","da","do","das","dos","e","ou","a","o","as","os","em","na","no","para","com","por","2023","2024","2025","2026","novos","novas","nova","novo","recente","recentes","empresa","sinal"]);
  return (sinal.titulo || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stop.has(w)).slice(0, 4);
}
function gURL(base, phrase, extra) {
  const raw = ('"' + phrase + '" ' + (extra || "")).trim();
  const qs = encodeURIComponent(raw).replace(/%20/g, "+");
  if (base === "news") return "https://news.google.com/search?q=" + qs + "&hl=pt-BR&gl=BR&ceid=BR:pt-419";
  return "https://www.google.com/search?q=" + qs + "&hl=pt-BR";
}
function signalRef(empresa, sinal) {
  const nome = empresa.nome;
  const qn = encodeURIComponent(nome);
  const f = (sinal.fonte || "").toLowerCase();
  const kwArr = sigTerms(sinal);
  const kw = kwArr.join(" ");
  const phrase = ('"' + nome + '" ' + kw).trim();           // termos legíveis da busca
  const alts = [
    { label: "Google", url: gURL("web", nome, kw) },
    { label: "Google Notícias", url: gURL("news", nome, kw) },
    { label: "LinkedIn", url: "https://www.linkedin.com/search/results/all/?keywords=" + qn },
  ];
  if (f.includes("cnpj") || f.includes("dados empres")) {
    alts.unshift({ label: "Google · CNPJ", url: gURL("web", nome, "CNPJ") });
  }
  if (f.includes("vaga") || f.includes("jobs") || f.includes("linkedin jobs")) {
    alts.push({ label: "LinkedIn Vagas", url: "https://www.linkedin.com/jobs/search/?keywords=" + qn });
  }
  // Link principal: Google web (sempre abre, sem login)
  const url = (f.includes("cnpj") || f.includes("dados empres")) ? gURL("web", nome, "CNPJ") : gURL("web", nome, kw);
  const verificado = !sinal.ia && !!sinal.url && /^https?:/.test(sinal.url || "");
  return { url: (verificado && sinal.url) || url, query: phrase, alts, verificado, ia: !!sinal.ia };
}

function VerifyBadge({ empresa, sinal, compact }) {
  if (sinal.ia) return (<span className={"vbadge warn" + (compact ? " compact" : "")}><Icon.sparkles />{compact ? "IA · verificar" : "IA · a verificar"}</span>);
  const { verificado } = signalRef(empresa, sinal);
  if (verificado) return (<span className={"vbadge ok" + (compact ? " compact" : "")}><Icon.shield />{compact ? "Verificada" : "Fonte verificada"}</span>);
  return (<span className={"vbadge warn" + (compact ? " compact" : "")}><Icon.alert />{compact ? "A verificar" : "Sem fonte · a verificar"}</span>);
}

Object.assign(window, { signalRef, VerifyBadge });

/* Recálculo de score por VALIDAÇÃO de sinais.
   O peso vem da INFORMAÇÃO (tipo × relevância), não da quantidade:
   retornos decrescentes — um sinal forte confirmado domina vários fracos. */
function tipoPeso(tipo) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("investimento") || t.includes("aporte")) return 1.0;
  if (t.includes("executiv") || t.includes("lideran")) return 0.95;
  if (t.includes("crescimento")) return 0.9;
  if (t.includes("expans")) return 0.82;
  if (t.includes("produto")) return 0.72;
  if (t.includes("estrat")) return 0.5;
  if (t.includes("investigar") || t.includes("ia")) return 0.85;
  return 0.7;
}
function sinalImpacto(s) { return tipoPeso(s.tipo) * ((s.relevancia || 50) / 100) * 26; }
function recomputeScore(e) {
  const base = (e.scoreBase != null) ? e.scoreBase : e.score;
  const conf = [], disc = [];
  (e.sinais || []).forEach(s => {
    if (s.validado === "ok") conf.push(sinalImpacto(s));
    else if (s.validado === "descartado") disc.push(sinalImpacto(s));
  });
  conf.sort((a, b) => b - a); disc.sort((a, b) => b - a);
  let adj = 0;
  conf.forEach((v, i) => adj += v / (i + 1));          // retornos decrescentes
  disc.forEach((v, i) => adj -= (v / (i + 1)) * 0.9);  // descarte penaliza
  const score = Math.max(0, Math.min(100, Math.round(base + adj)));
  return { score, ajustado: conf.length > 0 || disc.length > 0, base };
}
Object.assign(window, { tipoPeso, sinalImpacto, recomputeScore });

/* Paginador (prev/next + páginas numeradas, com janela) */
function Pager({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const win = [];
  let a = Math.max(1, page - 2), b = Math.min(pages, page + 2);
  if (page <= 3) b = Math.min(pages, 5);
  if (page >= pages - 2) a = Math.max(1, pages - 4);
  for (let i = a; i <= b; i++) win.push(i);
  return (
    <div className="pager">
      <button className="pg-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}><Icon.chevL />Anterior</button>
      <div className="pg-nums">
        {a > 1 && <React.Fragment><button className="pg-num" onClick={() => onPage(1)}>1</button><span className="pg-dots">…</span></React.Fragment>}
        {win.map(i => <button key={i} className={"pg-num" + (i === page ? " active" : "")} onClick={() => onPage(i)}>{i}</button>)}
        {b < pages && <React.Fragment><span className="pg-dots">…</span><button className="pg-num" onClick={() => onPage(pages)}>{pages}</button></React.Fragment>}
      </div>
      <button className="pg-btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>Próxima<Icon.chevR /></button>
    </div>
  );
}
Object.assign(window, { Pager });

/* Proveniência + validação */
const VALIDACAO = {
  pendente:  { label: "A validar",   cor: "#F5A623" },
  validado:  { label: "Validado",    cor: "#34C759" },
  incorreto: { label: "Incorreto",   cor: "#EA5333" },
  demo:      { label: "Demonstração", cor: "#8A93A0" },
};
function provLabel(p) {
  if (!p) return "Origem não registrada";
  if (p.tipo === "planilha") return "Planilha — " + p.arquivo + (p.linha ? " (linha " + p.linha + ")" : "");
  if (p.tipo === "manual") return "Cadastro manual";
  if (p.tipo === "arquivo") return "Arquivo — " + (p.arquivo || "");
  if (p.tipo === "demonstracao") return "Dados de demonstração (não veio da sua planilha)";
  return p.tipo;
}
function ValidacaoBadge({ status, compact }) {
  const v = VALIDACAO[status] || VALIDACAO.pendente;
  const Ic = status === "validado" ? Icon.check : status === "incorreto" ? Icon.x : status === "demo" ? Icon.sparkles : Icon.alert;
  return (<span className="vlbadge" style={{ color: v.cor, background: v.cor + "22" }}><Ic />{v.label}</span>);
}
Object.assign(window, { VALIDACAO, provLabel, ValidacaoBadge });

/* Shared app context (navegação, modais, toasts, importações) */
const AppCtx = React.createContext(null);
const useApp = () => React.useContext(AppCtx);
const normName = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

/* Persistência local (localStorage) — guarda os dados entre sessões até ir para a nuvem */
const RadarStore = {
  KEY: "radar_comercial_v1",
  _has: (() => { try { const k = "__t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; } catch (_) { return false; } })(),
  load(field, fallback) {
    if (!this._has) return fallback;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return fallback;
      const obj = JSON.parse(raw);
      return (obj && field in obj) ? obj[field] : fallback;
    } catch (_) { return fallback; }
  },
  save(field, value) {
    if (!this._has) return;
    try {
      const raw = localStorage.getItem(this.KEY);
      const obj = raw ? JSON.parse(raw) : {};
      obj[field] = value;
      obj._savedAt = Date.now();
      localStorage.setItem(this.KEY, JSON.stringify(obj));
    } catch (_) { /* quota cheia ou indisponível */ }
  },
  savedAt() {
    if (!this._has) return null;
    try { const raw = localStorage.getItem(this.KEY); return raw ? (JSON.parse(raw)._savedAt || null) : null; } catch (_) { return null; }
  },
  clear() { if (this._has) { try { localStorage.removeItem(this.KEY); } catch (_) {} } },
  available() { return this._has; },
};

Object.assign(window, { AppCtx, useApp, normName, RadarStore });
