/* radar-view.jsx — Tela "Radar Diário": busca + filtros (responsável e/ou categoria), paginado */

const RADAR_PAGE_SIZE = 12;

function RadarView() {
  const app = useApp();
  const onOpen = app.openEmpresa;
  const data = window.RADAR_DATA;
  const todas = app.empresas.slice().sort((a, b) => (b.score - a.score) || a.nome.localeCompare(b.nome, "pt-BR"));
  const [page, setPage] = React.useState(1);
  const [banner, setBanner] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [fResp, setFResp] = React.useState("todos");
  const [fFaixa, setFFaixa] = React.useState("todas");

  React.useEffect(() => { setPage(1); }, [q, fResp, fFaixa]);

  if (app.empresas.length === 0) {
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <span className="es-ic"><Icon.radar /></span>
          <h2>Seu Radar está vazio</h2>
          <p>Importe sua planilha de empresas para começar a monitorar. Cada conta entra com a origem registrada, pronta para você validar.</p>
          <div className="es-actions">
            <button className="btn primary" onClick={() => app.openModal({ type: "import", mode: "empresa" })}><Icon.upload />Importar planilha</button>
            <button className="btn" onClick={() => app.openModal({ type: "import", mode: "manual" })}><Icon.plus />Cadastrar manualmente</button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrior = todas.filter(e => e.score >= 81).length;
  const valeAbordar = todas.filter(e => e.score >= 61).length;
  const novos = todas.reduce((s, e) => s + e.sinais.length, 0);
  const demos = todas.filter(e => e.proveniencia && e.proveniencia.tipo === "demonstracao").length;
  const aValidar = todas.filter(e => { const st = (e.validacao && e.validacao.status) || "pendente"; return st === "pendente" && !(e.proveniencia && e.proveniencia.tipo === "demonstracao"); }).length;

  const responsaveis = Array.from(new Set(todas.map(e => e.responsavel || "Sem responsável"))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const FAIXAS = [
    { id: "todas", label: "Toda categoria" },
    { id: "prioritaria", label: "Abordagem prioritária" },
    { id: "boa", label: "Boa oportunidade" },
    { id: "monitorar", label: "Monitorar" },
    { id: "baixa", label: "Baixa prioridade" },
  ];
  const qn = q.trim().toLowerCase();
  const empresas = todas.filter(e => {
    if (qn && !(e.nome + " " + e.segmento + " " + e.cidade).toLowerCase().includes(qn)) return false;
    if (fResp !== "todos" && (e.responsavel || "Sem responsável") !== fResp) return false;
    if (fFaixa !== "todas" && faixaOf(e.score).id !== fFaixa) return false;
    return true;
  });
  const filtrando = qn || fResp !== "todos" || fFaixa !== "todas";

  const pages = Math.max(1, Math.ceil(empresas.length / RADAR_PAGE_SIZE));
  const pageSafe = Math.min(page, pages);
  const start = (pageSafe - 1) * RADAR_PAGE_SIZE;
  const slice = empresas.slice(start, start + RADAR_PAGE_SIZE);

  function goPage(p) {
    setPage(p);
    const sc = document.querySelector(".scroll");
    const anchor = document.getElementById("lista-anchor");
    if (sc && anchor) sc.scrollTo({ top: anchor.offsetTop - 80, behavior: "smooth" });
  }
  function limpar() { setQ(""); setFResp("todos"); setFFaixa("todas"); }

  const fmtDate = new Date(data.hoje + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="page fade-in">
      <div className="hero">
        <RadarSweep />
        <div style={{ zIndex: 1 }}>
          <div className="uplabel">Radar diário · {fmtDate}</div>
          <h1>Hoje, <span className="accent">{totalPrior} contas</span> merecem<br/>abordagem prioritária.</h1>
          <p>Cruzamos sinais públicos com a memória comercial de cada conta. Busque, filtre por vendedor ou categoria, e comece pelo topo.</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => app.openModal({ type: "scan", empresaId: null })}><Icon.radar />Rastrear todas agora</button>
            <button className="btn" onClick={() => app.openModal({ type: "export", scope: "radar" })}><Icon.upload />Exportar radar do dia</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="n" style={{ color: "var(--accent)" }}>{todas.length}</div><div className="l">Contas no radar</div></div>
          <div className="hero-stat"><div className="n">{novos}</div><div className="l">Sinais novos</div></div>
          <div className="hero-stat"><div className="n">{valeAbordar}</div><div className="l">Vale abordar</div></div>
        </div>
      </div>

      {banner && (demos > 0 || aValidar > 0) && (
        <div className="val-banner">
          <span className="vb-ic"><Icon.alert /></span>
          <div className="vb-txt">
            {demos > 0 && <span><b>{demos} contas são de demonstração</b> (não vieram da sua planilha).</span>}
            {demos > 0 && aValidar > 0 && " "}
            {aValidar > 0 && <span>{aValidar} contas da planilha aguardam sua validação.</span>}
            {" "}Abra a ficha de cada conta para <b>validar, marcar como incorreta ou remover</b>.
          </div>
          <button className="btn sm" onClick={() => app.setView("contas")}>Revisar em Contas</button>
          {demos > 0 && <button className="btn sm danger" onClick={() => { if (confirm("Remover as " + demos + " contas de demonstração? As 9 contas da sua planilha permanecem.")) { const n = app.removerDemos(); app.pushToast(n + " contas de demonstração removidas"); } }}><Icon.x />Remover demonstrações</button>}
          <span className="vb-x" onClick={() => setBanner(false)}><Icon.x /></span>
        </div>
      )}

      <div className="radar-filters">
        <div className="rf-search">
          <Icon.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar empresa pelo nome…" />
          {q && <span className="rf-clear" onClick={() => setQ("")}><Icon.x /></span>}
        </div>
        <select className="select-native rf-sel" value={fResp} onChange={(e) => setFResp(e.target.value)}>
          <option value="todos">Todos os responsáveis</option>
          {responsaveis.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="select-native rf-sel" value={fFaixa} onChange={(e) => setFFaixa(e.target.value)}>
          {FAIXAS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        {filtrando && <button className="btn sm ghost" onClick={limpar}><Icon.x />Limpar</button>}
      </div>

      <div className="sec-head" id="lista-anchor">
        <h2>{filtrando ? "Resultado" : "Ordem de prioridade"}</h2>
        <div className="rule" />
        <div className="count">{empresas.length} de {todas.length} contas{pages > 1 ? " · página " + pageSafe + " de " + pages : ""}</div>
      </div>

      {empresas.length === 0 ? (
        <div className="empty">Nenhuma conta encontrada com esses filtros.<br/><button className="btn sm" style={{ marginTop: 12 }} onClick={limpar}>Limpar filtros</button></div>
      ) : (
        <div className="radar-list">
          {slice.map((e, i) => {
            const rank = start + i + 1;
            return (
              <div className="row" key={e.id} onClick={() => onOpen(e.id)}>
                <div className={"rank" + (rank === 1 ? " top" : "")}>{String(rank).padStart(2, "0")}</div>
                <MiniScore score={e.score} />
                <div className="co">
                  <div className="nm">
                    <span className="avatar" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 7 }}>{e.iniciais}</span>
                    {e.nome}
                  </div>
                  <div className="meta">
                    <span>{e.segmento}</span><span className="sep">·</span>
                    <span>{e.cidade}/{e.uf}</span><span className="sep">·</span>
                    <span>{(e.responsavel && e.responsavel !== "—") ? e.responsavel : e.porte.split(" (")[0]}</span>
                  </div>
                </div>
                <div className="why">
                  <span className="lab">Sinal</span>{e.resumoSinal}
                </div>
                <FaixaBadge score={e.score} />
                <div className="chev"><Icon.chevR /></div>
              </div>
            );
          })}
        </div>
      )}

      <Pager page={pageSafe} pages={pages} onPage={goPage} />
    </div>
  );
}

window.RadarView = RadarView;
