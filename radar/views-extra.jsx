/* views-extra.jsx — Contas, Sinais e Agentes */

/* ===================== CONTAS ===================== */
function ContasView() {
  const app = useApp();
  const [filtro, setFiltro] = React.useState("todas");
  const [origem, setOrigem] = React.useState("todas");
  const [page, setPage] = React.useState(1);
  const q = (app.query || "").toLowerCase();
  const PAGE = 15;
  React.useEffect(() => { setPage(1); }, [filtro, origem, q]);

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "prioritaria", label: "Prioritárias" },
    { id: "boa", label: "Boas" },
    { id: "monitorar", label: "Monitorar" },
  ];
  const ovBadge = (e) => e.proveniencia && e.proveniencia.tipo === "demonstracao" ? "demo" : ((e.validacao && e.validacao.status) || "pendente");
  const origens = [
    { id: "todas", label: "Toda origem", test: () => true },
    { id: "planilha", label: "Da planilha", test: (e) => e.proveniencia && e.proveniencia.tipo === "planilha" },
    { id: "manual", label: "Cadastro manual", test: (e) => e.proveniencia && (e.proveniencia.tipo === "manual" || e.proveniencia.tipo === "arquivo") },
    { id: "demo", label: "Demonstração", test: (e) => e.proveniencia && e.proveniencia.tipo === "demonstracao" },
    { id: "validar", label: "A validar", test: (e) => ovBadge(e) === "pendente" || ovBadge(e) === "demo" },
    { id: "validadas", label: "Validadas", test: (e) => ovBadge(e) === "validado" },
  ];
  let lista = app.empresas.slice().sort((a, b) => b.score - a.score);
  if (filtro !== "todas") lista = lista.filter(e => faixaOf(e.score).id === filtro);
  const ofn = origens.find(o => o.id === origem).test;
  lista = lista.filter(ofn);
  if (q) lista = lista.filter(e => (e.nome + e.segmento + e.cidade).toLowerCase().includes(q));

  function count(id) {
    return id === "todas" ? app.empresas.length : app.empresas.filter(e => faixaOf(e.score).id === id).length;
  }
  function countOrigem(o) { return app.empresas.filter(o.test).length; }

  const pages = Math.ceil(lista.length / PAGE);
  const pageSafe = Math.min(page, pages || 1);
  const slice = lista.slice((pageSafe - 1) * PAGE, pageSafe * PAGE);
  function goPage(p) { setPage(p); const sc = document.querySelector(".scroll"); if (sc) sc.scrollTo({ top: 0, behavior: "smooth" }); }

  if (app.empresas.length === 0) {
    return (
      <div className="page fade-in">
        <div className="page-head"><div><h1>Contas monitoradas</h1><div className="sub">Carteira de empresas-alvo acompanhadas pelo Radar.</div></div></div>
        <div className="empty-state">
          <span className="es-ic"><Icon.buildings /></span>
          <h2>Nenhuma conta ainda</h2>
          <p>Importe sua planilha ou cadastre empresas manualmente para começar.</p>
          <div className="es-actions">
            <button className="btn primary" onClick={() => app.openModal({ type: "import", mode: "empresa" })}><Icon.upload />Importar planilha</button>
            <button className="btn" onClick={() => app.openModal({ type: "import", mode: "manual" })}><Icon.plus />Cadastrar manualmente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Contas monitoradas</h1>
          <div className="sub">Carteira de empresas-alvo acompanhadas pelo Radar.</div>
        </div>
        <div className="actions">
          {app.empresas.some(e => e.proveniencia && e.proveniencia.tipo === "demonstracao") &&
            <button className="btn danger" onClick={() => { const d = app.empresas.filter(e => e.proveniencia && e.proveniencia.tipo === "demonstracao").length; if (confirm("Remover as " + d + " contas de demonstração? As contas reais da planilha permanecem.")) { const n = app.removerDemos(); app.pushToast(n + " contas de demonstração removidas"); } }}><Icon.x />Remover demonstrações</button>}
          <button className="btn primary" onClick={() => app.openModal({ type: "import", mode: "empresa" })}><Icon.plus />Adicionar empresa</button>
        </div>
      </div>

      <div className="chips">
        {filtros.map(f => (
          <div key={f.id} className={"chip" + (filtro === f.id ? " active" : "")} onClick={() => setFiltro(f.id)}>
            {f.label}<span className="cn">{count(f.id)}</span>
          </div>
        ))}
      </div>
      <div className="chips">
        {origens.map(o => (
          <div key={o.id} className={"chip" + (origem === o.id ? " active" : "")} onClick={() => setOrigem(o.id)}>
            {o.label}<span className="cn">{countOrigem(o)}</span>
          </div>
        ))}
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Empresa</th><th>Segmento</th><th>Local</th><th>Validação</th><th>Motivo / contexto</th><th style={{ textAlign: "right" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {slice.map(e => (
              <tr key={e.id} onClick={() => app.openEmpresa(e.id)}>
                <td>
                  <div className="co-cell">
                    <span className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{e.iniciais}</span>
                    <div><div className="nm">{e.nome}</div><div className="sub">{e.contato ? e.contato.nome : ""}</div></div>
                  </div>
                </td>
                <td style={{ color: "var(--tx-1)" }}>{e.segmento}</td>
                <td style={{ color: "var(--tx-1)" }}>{e.cidade}/{e.uf}</td>
                <td><ValidacaoBadge status={ovBadge(e)} /></td>
                <td style={{ color: "var(--tx-2)", maxWidth: 280 }}>{e.motivo}</td>
                <td style={{ textAlign: "right" }}>
                  <span className="score-num" style={{ color: faixaOf(e.score).cor }}>{e.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={pageSafe} pages={pages} onPage={goPage} />
      {lista.length === 0 && <div className="empty">Nenhuma conta encontrada.</div>}
    </div>
  );
}

/* ===================== SINAIS ===================== */
function SinaisView() {
  const app = useApp();
  const todos = [];
  app.empresas.forEach(e => e.sinais.forEach(s => todos.push({ ...s, empresa: e })));
  todos.sort((a, b) => (a.data < b.data ? 1 : -1));

  // group by date
  const grupos = {};
  todos.forEach(s => { (grupos[s.data] = grupos[s.data] || []).push(s); });
  const datas = Object.keys(grupos).sort((a, b) => (a < b ? 1 : -1));

  const fmt = (d) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Sinais detectados</h1>
          <div className="sub">Feed cronológico de tudo que o Radar externo capturou. Somente fatos.</div>
        </div>
        <div className="actions">
          <span className="pulse"><span className="dot" />{todos.length} sinais ativos</span>
        </div>
      </div>

      <div className="feed">
        {datas.map(d => (
          <React.Fragment key={d}>
            <div className="feed-day"><Icon.calendar style={{ width: 14, height: 14 }} />{fmt(d)}<span className="rule" /></div>
            {grupos[d].map((s, i) => {
              const f = faixaOf(s.empresa.score);
              return (
                <div className="feed-item" key={i} onClick={() => app.openEmpresa(s.empresa.id)}>
                  <span className="avatar" style={{ width: 44, height: 44 }}>{s.empresa.iniciais}</span>
                  <div className="ftxt">
                    <div className="ttl">{s.titulo}</div>
                    <div className="mt">
                      <span className="co">{s.empresa.nome}</span>
                      <span className="sep">·</span><span className="sig-type" style={{ padding: "2px 6px" }}>{s.tipo}</span>
                      <span className="sep">·</span><span>{s.fonte}</span>
                      <VerifyBadge empresa={s.empresa} sinal={s} compact />
                    </div>
                  </div>
                  <div className="sig-rel">
                    <span className="sig-relbar"><i style={{ width: s.relevancia + "%" }} /></span>
                    <span className="sig-relnum">{s.relevancia}</span>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ===================== AGENTES ===================== */
const AGENTES = [
  { n: 1, t: "Cadastro e enriquecimento", o: "Criar uma ficha completa da empresa monitorada", status: "Automatizável",
    entradas: ["Nome, site, CNPJ", "LinkedIn, cidade, estado", "Segmento, porte", "Contatos conhecidos"],
    resp: ["Padronizar dados", "Identificar informações faltantes", "Enriquecer dados públicos", "Organizar registros"],
    saida: "Ficha estruturada da empresa." },
  { n: 2, t: "Memória comercial", o: "Consolidar tudo o que já sabemos sobre a empresa", status: "Automatizável",
    entradas: ["CRM, propostas, e-mails", "Anotações, reuniões", "Histórico de clientes", "Arquivos e planilhas"],
    resp: ["Já foi cliente? Já recebeu proposta?", "Quem participou e qual o motivo da perda?", "Qual a dor e o principal relacionamento?", "Objeções, risco político, patrocinador"],
    saida: "Resumo executivo da conta." },
  { n: 3, t: "Radar externo", o: "Monitorar continuamente sinais externos relevantes", status: "Manual no Claude → Automação futura",
    entradas: ["Vagas (LinkedIn, Indeed, Gupy…)", "Notícias (Google News, portais)", "Sites e dados empresariais", "LinkedIn (executivos, time)"],
    resp: ["Expansão e novas filiais", "Contratações comerciais", "Investimentos e M&A", "Novos produtos e movimentos"],
    saida: "Tabela estruturada: empresa · sinal · fonte · data · link · relevância. Sem interpretação." },
  { n: 4, t: "Inteligência de intenção", o: "Interpretar os sinais e gerar contexto comercial", status: "Automatizável",
    entradas: ["Sinais do Agente 3", "Ficha + memória da conta"],
    resp: ["O que mudou e por quê", "O que isso indica", "Qual oportunidade existe", "Score de intenção 0–100"],
    saida: "Contexto comercial + score (faixas: 0–30 baixa · 31–60 monitorar · 61–80 boa · 81–100 prioritária)." },
  { n: 5, t: "Estratégia de abordagem", o: "Transformar oportunidade em ação", status: "Automatizável",
    entradas: ["Dados da empresa", "Histórico da conta", "Sinais + score"],
    resp: ["Quem e como abordar", "Qual argumento e dor conectar", "Qual solução sugerir", "Canal, mensagem, perguntas"],
    saida: "Motivo, contexto, ângulo, canal, mensagem sugerida, perguntas consultivas e próximo passo." },
  { n: 6, t: "Priorizador diário", o: "Organizar a agenda do vendedor", status: "Automatizável",
    entradas: ["Todas as contas monitoradas", "Scores do Agente 4"],
    resp: ["Gerar ranking diário", "Ordenar do maior ao menor score", "Responder: quem abordar hoje?"],
    saida: "Tabela diária: ranking · empresa · score · motivo." },
];
const ETAPAS = [
  { n: "01", t: "Cadastrar empresas", d: "Definir as contas-alvo a monitorar." },
  { n: "02", t: "Registrar histórico", d: "Anexar memória comercial de cada conta." },
  { n: "03", t: "Executar Radar externo", d: "Agente 3 captura sinais (hoje manual)." },
  { n: "04", t: "Interpretar sinais", d: "Saída vai para o Agente 4 (intenção)." },
  { n: "05", t: "Montar abordagem", d: "Agente 5 gera a estratégia." },
  { n: "06", t: "Priorizar o dia", d: "Agente 6 ordena por score." },
  { n: "07", t: "Lista priorizada", d: "Quem abordar hoje, e como." },
];

function AgentesView() {
  const [open, setOpen] = React.useState(3);
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Arquitetura de agentes</h1>
          <div className="sub">Seis agentes especializados transformam sinais e histórico em ação comercial.</div>
        </div>
      </div>

      <div className="agentes-grid">
        {AGENTES.map(a => (
          <div className={"agente" + (open === a.n ? " open" : "")} key={a.n}>
            <div className="agente-head" onClick={() => setOpen(open === a.n ? -1 : a.n)}>
              <span className="agente-num">{a.n}</span>
              <div style={{ minWidth: 0 }}>
                <div className="at">{a.t}<span className="pipe-tag">{a.status}</span></div>
                <div className="ao">{a.o}</div>
              </div>
              <span className="achev"><Icon.chevR /></span>
            </div>
            {open === a.n && (
              <div className="agente-body">
                <div className="blk"><span className="uplabel">Entradas</span><ul>{a.entradas.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="blk"><span className="uplabel">Responsabilidades</span><ul>{a.resp.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="blk full"><span className="uplabel">Saída</span><p>{a.saida}</p></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sec-head">
        <h2>Fluxo operacional</h2><div className="rule" />
        <div className="count">7 etapas</div>
      </div>
      <div className="flow">
        {ETAPAS.map(e => (
          <div className="flow-step" key={e.n}>
            <div className="fn">{e.n}</div>
            <div className="ft">{e.t}</div>
            <div className="fd">{e.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ContasView, SinaisView, AgentesView });
