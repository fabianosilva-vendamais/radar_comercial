/* app.jsx — shell, navegação, contexto global, modais e toasts */

class RadarErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { if (this.props.onError) this.props.onError(err); }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (!this.state.err) return this.props.children;
    if (!this.props.fallbackView) return null;
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <span className="es-ic" style={{ background: "rgba(245,166,35,0.16)", color: "var(--f-boa)", borderColor: "rgba(245,166,35,0.4)" }}><Icon.alert /></span>
          <h2>Algo deu errado nesta tela</h2>
          <p>Tivemos um problema ao renderizar esta visão, mas <b>seus dados foram preservados</b> — nenhuma conta foi perdida.</p>
          <div className="es-actions">
            <button className="btn primary" onClick={() => { this.setState({ err: null }); this.props.fallbackView(); }}><Icon.radar />Voltar ao Radar</button>
          </div>
        </div>
      </div>
    );
  }
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#EA5333",
  "density": "regular"
}/*EDITMODE-END*/;

const NAV = [
  { id: "radar", icon: Icon.radar, label: "Radar diário" },
  { id: "contas", icon: Icon.buildings, label: "Contas" },
  { id: "sinais", icon: Icon.signal, label: "Sinais" },
  { id: "agentes", icon: Icon.layers, label: "Agentes" },
  { id: "importar", icon: Icon.upload, label: "Importar" },
];

function NavRail({ view, go }) {
  const activeFor = (id) => view === id || (id === "contas" && view === "empresa");
  return (
    <div className="rail">
      <div className="rail-logo"><Icon.radar style={{ width: 30, height: 30, color: "var(--accent)" }} /></div>
      {NAV.map(it => (
        <div key={it.id} className={"rail-btn" + (activeFor(it.id) ? " active" : "")} onClick={() => go(it.id)}>
          <it.icon />
          <span className="tip">{it.label}</span>
        </div>
      ))}
      <div className="rail-spacer" />
      <div className="rail-ava">{window.RADAR_DATA.vendedor.iniciais}</div>
    </div>
  );
}

function SearchBox() {
  const app = useApp();
  const [focus, setFocus] = React.useState(false);
  const q = (app.query || "").toLowerCase();
  const res = q ? app.empresas.filter(e => (e.nome + e.segmento + e.cidade).toLowerCase().includes(q)).slice(0, 6) : [];
  return (
    <div style={{ position: "relative" }}>
      <div className="search">
        <Icon.search />
        <input placeholder="Buscar conta…" value={app.query}
               onChange={(e) => app.setQuery(e.target.value)}
               onFocus={() => setFocus(true)}
               onBlur={() => setTimeout(() => setFocus(false), 150)} />
      </div>
      {focus && q && (
        <div className="search-results">
          {res.length ? res.map(e => (
            <div className="sr" key={e.id} onMouseDown={() => { app.openEmpresa(e.id); app.setQuery(""); }}>
              <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{e.iniciais}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{e.nome}</div>
                <div style={{ fontSize: 11.5, color: "var(--tx-2)" }}>{e.segmento} · {e.cidade}/{e.uf}</div>
              </div>
              <span className="score-num" style={{ fontSize: 14, color: faixaOf(e.score).cor }}>{e.score}</span>
            </div>
          )) : <div className="empty-sr">Nenhuma conta encontrada para “{app.query}”.</div>}
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const app = useApp();
  const d = window.RADAR_DATA;
  const fmt = new Date(d.hoje + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="topbar">
      <div className="brand-lockup">
        <img className="vm-logo" src="radar/assets/logo-branco.png" alt="VendaMais" />
        <span className="divider" />
        <span className="product">Radar Comercial</span>
      </div>
      <span className="pulse"><span className="dot" />Monitorando {app.empresas.length} contas</span>
      {app.persistencia && app.empresas.length > 0 && <span className="saved-pill" title="Seus dados ficam salvos neste navegador até você migrar para a nuvem"><Icon.shield />Salvo localmente</span>}
      <div className="spacer" />
      <SearchBox />
      <span className="date">{fmt}</span>
      <button className="btn primary" onClick={() => app.openModal({ type: "import", mode: "empresa" })}><Icon.plus />Importar</button>
    </div>
  );
}

/* ---------- Modais ---------- */
function SourceModal({ sinal, empresa }) {
  const app = useApp();
  const ref = signalRef(empresa, sinal);
  const url = ref.url;
  const [copied, setCopied] = React.useState(false);
  function copyQuery() {
    try { navigator.clipboard && navigator.clipboard.writeText(ref.query); } catch (_) {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
    app.pushToast("Termos de busca copiados");
  }
  return (
    <div className="overlay" onClick={(e) => { if (e.target.classList.contains("overlay")) app.closeModal(); }}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="ic" style={{ color: "var(--accent)" }}><Icon.signal /></span>
          <div>
            <h2>{sinal.titulo}</h2>
            <div className="sub">{empresa.nome} · {sinal.tipo}</div>
          </div>
          <span className="x" onClick={app.closeModal}><Icon.x /></span>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 14 }}><VerifyBadge empresa={empresa} sinal={sinal} /></div>
          <div className="src-preview">
            <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
              <div><div className="uplabel">Fonte sugerida</div><div style={{ fontSize: 13.5, marginTop: 4 }}>{sinal.fonte}</div></div>
              <div><div className="uplabel">Data</div><div style={{ fontSize: 13.5, marginTop: 4 }}>{new Date(sinal.data + "T12:00:00").toLocaleDateString("pt-BR")}</div></div>
              <div><div className="uplabel">Relevância</div><div style={{ fontSize: 13.5, marginTop: 4, color: "var(--accent)" }}>{sinal.relevancia}/100</div></div>
            </div>
            {sinal.resumo}
          </div>

          <div className="src-query">
            <div className="uplabel" style={{ marginBottom: 6 }}>Termos da busca (use em qualquer ferramenta)</div>
            <div className="src-query-box">
              <code>{ref.query}</code>
              <button className="btn sm" onClick={copyQuery}><Icon.copy />{copied ? "Copiado" : "Copiar"}</button>
            </div>
          </div>

          <div className="uplabel" style={{ margin: "16px 0 8px" }}>Abrir em</div>
          <div className="src-sources">
            {ref.alts.map((a, i) => (
              <a key={i} className="btn" href={a.url} target="_blank" rel="noopener noreferrer"><Icon.ext />{a.label}</a>
            ))}
          </div>

          <div className="ex-note" style={{ marginTop: 16 }}>
            <span className="ic"><Icon.shield /></span>
            <div>Estes sinais são <b>sugestões da IA a verificar</b>. Use os termos acima (ou os botões) para confirmar na fonte. Algumas plataformas (LinkedIn) podem pedir login; a busca no <b>Google</b> abre sem login. Quando o backend de busca for ligado, o link virá direto para a notícia/vaga confirmada.</div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={app.closeModal}>Fechar</button>
          <a className="btn primary" href={url} target="_blank" rel="noopener noreferrer"><Icon.ext />Buscar no Google</a>
        </div>
      </div>
    </div>
  );
}

function ModalHost() {
  const app = useApp();
  if (!app.modal) return null;
  if (app.modal.type === "import") return <ImportFlow initialMode={app.modal.mode} />;
  if (app.modal.type === "source") return <SourceModal sinal={app.modal.sinal} empresa={app.modal.empresa} />;
  if (app.modal.type === "scan") return <ScanModal empresaId={app.modal.empresaId} />;
  if (app.modal.type === "export") return <ExportModal scope={app.modal.scope} empresaId={app.modal.empresaId} />;
  return null;
}

function ToastHost() {
  const app = useApp();
  return (
    <div className="toast-wrap">
      {app.toasts.map(t => (
        <div className="toast" key={t.id}><span className="ic"><Icon.check /></span>{t.msg}</div>
      ))}
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = React.useState("radar");
  const [empresaId, setEmpresaId] = React.useState(null);
  const [prevView, setPrevView] = React.useState("radar");
  const [empresas, setEmpresas] = React.useState(() => RadarStore.load("empresas", (window.__RADAR_SEED && window.__RADAR_SEED.empresas) || window.RADAR_DATA.empresas));
  const [importacoes, setImportacoes] = React.useState(() => RadarStore.load("importacoes", (window.__RADAR_SEED && window.__RADAR_SEED.importacoes) || window.RADAR_DATA.importacoes));
  const [modal, setModal] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => { RadarStore.save("empresas", empresas); }, [empresas]);
  React.useEffect(() => { RadarStore.save("importacoes", importacoes); }, [importacoes]);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    const hex = t.accent.replace("#", "");
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    document.documentElement.style.setProperty("--accent-soft", `rgba(${r},${g},${b},0.14)`);
    document.documentElement.style.setProperty("--accent-line", `rgba(${r},${g},${b},0.42)`);
    document.documentElement.style.setProperty("--f-prioritaria", t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    document.body.style.fontSize = t.density === "compact" ? "14px" : t.density === "comfy" ? "16px" : "15px";
  }, [t.density]);

  function scrollTop() { const s = document.querySelector(".scroll"); if (s) s.scrollTo(0, 0); }

  const app = {
    hoje: window.RADAR_DATA.hoje,
    empresas, importacoes, query, setQuery, toasts, modal,
    openEmpresa(id) { setPrevView(v => (view === "empresa" ? prevView : view)); setEmpresaId(id); setView("empresa"); scrollTop(); },
    back() { setView(prevView || "radar"); scrollTop(); },
    setView(v) { setEmpresaId(null); setView(v); setQuery(""); scrollTop(); },
    openModal(m) { setModal(m); },
    closeModal() { setModal(null); },
    pushToast(msg) {
      const id = Date.now() + Math.random();
      setToasts(ts => [...ts, { id, msg }]);
      setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 2400);
    },
    addEmpresa(obj) {
      setEmpresas(list => {
        const i = list.findIndex(e => e.id === obj.id);
        if (i >= 0) { const cp = list.slice(); cp[i] = obj; return cp; }
        return [...list, obj];
      });
    },
    updateEmpresa(id, patch) {
      setEmpresas(list => list.map(e => e.id === id ? { ...e, ...patch } : e));
    },
    validarEmpresa(id, status) {
      setEmpresas(list => list.map(e => e.id === id ? { ...e, validacao: { ...(e.validacao || {}), status } } : e));
    },
    validarSinal(id, idx, status) {
      setEmpresas(list => list.map(e => {
        if (e.id !== id) return e;
        const sinais = e.sinais.map((s, i) => i === idx ? { ...s, validado: status } : s);
        const base = e.scoreBase != null ? e.scoreBase : e.score;
        const tmp = { ...e, sinais, scoreBase: base };
        const r = recomputeScore(tmp);
        return { ...tmp, score: r.score, scoreAjustado: r.ajustado };
      }));
    },
    removerEmpresa(id) {
      setEmpresas(list => list.filter(e => e.id !== id));
      if (empresaId === id) { setView(prevView || "radar"); setEmpresaId(null); }
    },
    removerDemos() {
      let n = 0;
      setEmpresas(list => { const f = list.filter(e => !(e.proveniencia && e.proveniencia.tipo === "demonstracao")); n = list.length - f.length; return f; });
      return n;
    },
    addImport(obj) { setImportacoes(list => [obj, ...list]); },
    limparTudo() {
      RadarStore.clear();
      setEmpresas([]); setImportacoes([]); setEmpresaId(null); setView("radar"); setQuery("");
    },
    persistencia: RadarStore.available(),
  };

  const empresa = empresas.find(e => e.id === empresaId);

  return (
    <AppCtx.Provider value={app}>
      <div className="app">
        <NavRail view={view} go={app.setView} />
        <div className="main">
          <TopBar />
          <div className="scroll">
            <RadarErrorBoundary resetKey={view + ":" + (empresaId || "")} fallbackView={() => app.setView("radar")}>
            {view === "radar" && <RadarView />}
            {view === "contas" && <ContasView />}
            {view === "sinais" && <SinaisView />}
            {view === "agentes" && <AgentesView />}
            {view === "importar" && <ImportarView />}
            {view === "empresa" && empresa && <EmpresaView empresa={empresa} onBack={app.back} />}
            </RadarErrorBoundary>
          </div>
        </div>

        <RadarErrorBoundary resetKey={(app.modal && app.modal.type) || "none"} onError={() => { try { setModal(null); } catch (_) {} }}>
          <ModalHost />
        </RadarErrorBoundary>
        <ToastHost />

        <TweaksPanel>
          <TweakSection label="Marca" />
          <TweakColor label="Cor de acento" value={t.accent}
            options={["#EA5333", "#1E4249", "#D81B27", "#2A6FDB", "#1F8A5B"]}
            onChange={(v) => setTweak("accent", v)} />
          <TweakSection label="Layout" />
          <TweakRadio label="Densidade" value={t.density}
            options={["compact", "regular", "comfy"]}
            onChange={(v) => setTweak("density", v)} />
        </TweaksPanel>
      </div>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
