/* actions.jsx — Rastreamento (Agente 3 manual) + Exportação para vendedores */

function nowStamp() {
  return new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/* ============ Rastrear agora (Agente 3) — painel de rastreamento ============ */

/* Sugestões locais (sem fatos inventados) caso a IA não esteja disponível */
function localSuggestions(e) {
  const motivo = (e.memoria && e.memoria.objecoes && e.memoria.objecoes[0]) || e.motivo || "indefinição";
  return {
    score: e.score, scoreRationale: "Score mantido (IA indisponível neste ambiente).",
    intencao: e.intencao,
    estrategia: Object.assign({}, e.estrategia, {
      insight: "Reabra tratando a perda como INDECISÃO, não como 'sem interesse': depois de tantos follow-ups, o que trava não é o preço, é o medo de errar a decisão. Mude o eixo de 'me convença' para 'eu te ajudo a decidir com segurança'.",
      diagnosticoIndecisao: "Proposta perdida (" + motivo + ") com múltiplos follow-ups sem avanço: padrão de indecisão por risco percebido, não de ausência de necessidade.",
      mensagem: e.contato && e.contato.nome && e.contato.nome !== "—" ? (e.contato.nome.split(" ")[0] + ", parei de te mandar follow-up porque insistir na mesma proposta não muda nada — e acho que o problema nunca foi a proposta, foi o risco de mexer no time agora e não dar certo. Tenho uma leitura diferente do que trava o comercial de vocês. Que tal um diagnóstico curto, de poucos dias, com um critério claro de sucesso? Se não fizer sentido, você decide com dado na mão e sem compromisso. Topa eu te mostrar como seria?") : "Parei de insistir na mesma proposta — ela nunca foi o problema. O que trava costuma ser o risco de mexer no time agora. Proponho um diagnóstico curto, de poucos dias, com critério de sucesso definido: você decide com dado na mão, sem compromisso.",
      jolt: joltFallback(e),
      objecoes: [
        { objecao: "Já analisamos e não era o momento.", resposta: "Faz sentido. O que mudou é que não estou aqui pra reabrir a mesma proposta — trago uma forma menor de começar, com resultado medível em poucas semanas e sem comprometer o orçamento todo." },
        { objecao: "Não temos budget agora.", resposta: "Entendo. Por isso a recomendação não é o projeto inteiro: é uma primeira fase enxuta que se paga no próprio resultado. Posso te mostrar o ponto de partida de menor risco?" },
      ],
    }),
    investigar: [
      { titulo: "Vagas comerciais abertas", fonte: "LinkedIn Jobs", query: e.nome + " vagas comercial vendas" },
      { titulo: "Notícias recentes da empresa", fonte: "Google News", query: e.nome + " " + (e.cidade || "") },
      { titulo: "Troca de liderança / contratações", fonte: "LinkedIn", query: e.nome + " diretor comercial gerente comercial" },
      { titulo: "Novas filiais / alterações cadastrais", fonte: "Dados empresariais (CNPJ)", query: e.nome + " CNPJ filial" },
    ],
  };
}

/* Agente 3/4/5 com IA real (Claude). Não inventa fatos: devolve análise + buscas a confirmar. */
async function runAgent3IA(e) {
  if (!(window.claude && typeof window.claude.complete === "function")) {
    return { data: localSuggestions(e), viaIA: false };
  }
  const motivo = (e.memoria && e.memoria.objecoes && e.memoria.objecoes[0]) || e.motivo || "";
  const dor = (e.memoria && e.memoria.dor) || "";
  const hist = (e.memoria && e.memoria.timeline || []).map(t => t.data + " " + t.tipo + ": " + t.texto).join(" | ");
  const prompt = "Você é o Estrategista de Vendas Consultivas da VendaMais (consultoria e treinamento comercial). " +
    "Seu público são VENDEDORES SÊNIORES e CÉTICOS, que já fizeram muitos follow-ups e acham que 'já tentaram de tudo'. " +
    "As contas são PROPOSTAS PERDIDAS de alto valor (muitos milhares de reais). " +
    "Seu trabalho é fazer o vendedor pensar 'isso eu não tinha pensado'. NADA de óbvio ou genérico.\n\n" +
    "PREMISSA CENTRAL: depois de tantos follow-ups, a perda raramente é falta de interesse — é INDECISÃO (medo de tomar a decisão errada / aversão à omissão). " +
    "Aplique a metodologia JOLT (The JOLT Effect, p/ indecisão): J=Julgar o tipo/nível de indecisão; O=Oferecer uma recomendação assertiva (não mais opções); L=Limitar a exploração (antecipar dúvidas, evitar 'vou analisar'); T=Tirar o risco da mesa (piloto/fase, garantia, critério de sucesso).\n\n" +
    "REGRAS: (1) NÃO invente fatos/eventos como confirmados — você não acessa a web ao vivo; em 'investigar' liste 3-4 BUSCAS reais. " +
    "(2) 'insight' deve ser um REENQUADRAMENTO não-óbvio, específico desta conta, que muda o jogo. " +
    "(3) PROIBIDO placeholder: nunca escreva 'R$ XXX', '[nome]', 'XX%' ou números inventados. Se não souber um número, fale qualitativamente ('parte relevante da carteira'). " +
    "(4) A MENSAGEM é o entregável mais importante e hoje está fraca/genérica — capriche. Ela deve: (a) abrir com um REENQUADRAMENTO/tese que o cliente provavelmente não ouviu de outro fornecedor (não 'retomando nosso contato'); (b) nomear a tensão real do negócio dele, não a sua solução; (c) trazer a recomendação assertiva do JOLT (um caminho, não opções) e TIRAR O RISCO (ex.: um diagnóstico curto, uma fase pequena, um critério de sucesso) para vencer a indecisão; (d) terminar com um próximo passo de baixo atrito e específico (não um 'vale 15 min?' solto). 3 a 5 frases, tom de consultor sênior que entende do negócio, sem jargão de vendedor, sem bajulação. Escreva como uma pessoa fala.\n\n" +
    "CONTA:\nNome: " + e.nome + "\nSegmento: " + e.segmento + "\nCidade/UF: " + e.cidade + "/" + e.uf +
    "\nServiço ofertado: " + e.servico + "\nMotivo declarado da perda: " + motivo + "\nDor/contexto: " + dor +
    "\nHistórico/follow-ups: " + hist + "\nContato: " + e.contato.nome + " (" + e.contato.cargo + ")\n\n" +
    "Responda APENAS um JSON válido (sem markdown):\n" +
    '{"score": <0-100>, "scoreRationale": "<1 frase>", "intencao": {"oQueMudou":"","porqueMudou":"","indica":"","oportunidade":""}, ' +
    '"estrategia": {"insight":"<reenquadramento que faz o vendedor dizer: isso eu não tinha pensado>", "diagnosticoIndecisao":"<por que REALMENTE travou, além do motivo declarado>", ' +
    '"jolt": {"julgar":"","oferecer":"","limitar":"","tirarRisco":""}, ' +
    '"angulo":"", "canal":"LinkedIn", "mensagem":"<3-5 frases: reenquadramento + tensão do negócio + recomendação assertiva que tira o risco + próximo passo específico. SEM placeholders, SEM números inventados>", "perguntas":["<pergunta de negócio que faz o cliente refletir, não de qualificação óbvia>","",""], ' +
    '"objecoes":[{"objecao":"<o que um cético diria>","resposta":"<resposta consultiva>"},{"objecao":"","resposta":""}], "proximoPasso":""}, ' +
    '"investigar": [{"titulo":"","fonte":"LinkedIn Jobs","query":""}]}';
  try {
    const txt = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
    const a = txt.indexOf("{"), b = txt.lastIndexOf("}");
    if (a < 0 || b < 0) throw new Error("resposta inválida");
    const data = JSON.parse(txt.slice(a, b + 1));
    if (data.estrategia && typeof data.estrategia.mensagem === "string") {
      // remove placeholders residuais
      data.estrategia.mensagem = data.estrategia.mensagem
        .replace(/R\$\s*X+/gi, "uma fatia relevante do faturamento")
        .replace(/\bX{2,}%?/g, "parte relevante")
        .replace(/\[[^\]]*\]/g, "").replace(/\s{2,}/g, " ").trim();
    }
    if (!data.investigar || !data.investigar.length) data.investigar = localSuggestions(e).investigar;
    return { data, viaIA: true };
  } catch (_) {
    return { data: localSuggestions(e), viaIA: false };
  }
}

function ScanMeter({ pct, done }) {
  const size = 168, sw = 12, r = (size - sw) / 2 - 2, c = 2 * Math.PI * r;
  const col = done ? "#34C759" : "var(--accent)";
  return (
    <div className="scan-meter">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="scanbeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[r, r * 0.66, r * 0.33].map((rr, i) => (
          <circle key={i} cx={size / 2} cy={size / 2} r={rr} fill="none" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="1" />
        ))}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1b2230" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .5s ease, stroke .3s" }} />
        {!done && (
          <g style={{ transformOrigin: "50% 50%", animation: "sweep 1.6s linear infinite" }}>
            <path d={`M ${size / 2} ${size / 2} L ${size / 2} ${size / 2 - r} A ${r} ${r} 0 0 1 ${size / 2 + r * 0.7} ${size / 2 - r * 0.7} Z`} fill="url(#scanbeam)" />
          </g>
        )}
        <text x="50%" y="49%" textAnchor="middle" className="mono" style={{ fontSize: 34, fontWeight: 600, fill: col }}>{pct}%</text>
        <text x="50%" y="61%" textAnchor="middle" className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", fill: "var(--tx-2)" }}>{done ? "CONCLUÍDO" : "RASTREANDO"}</text>
      </svg>
    </div>
  );
}

function ScanModal({ empresaId }) {
  const app = useApp();
  const alvos = empresaId ? app.empresas.filter(e => e.id === empresaId) : app.empresas;
  const fontes = [
    { nome: "Vagas", det: "LinkedIn, Indeed, Gupy, Catho", ic: Icon.briefcase },
    { nome: "Notícias", det: "Google News e portais setoriais", ic: Icon.signal },
    { nome: "LinkedIn", det: "Executivos e contratações", ic: Icon.linkedin },
    { nome: "Dados empresariais", det: "CNPJ, filiais, capital social", ic: Icon.buildings },
    { nome: "Sites e releases", det: "Novos produtos e mudanças", ic: Icon.globe },
  ];
  const total = alvos.length;
  const [proc, setProc] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [sugeridos, setSugeridos] = React.useState(0);
  const [viaIA, setViaIA] = React.useState(0);
  const [erros, setErros] = React.useState(0);
  const [ultima, setUltima] = React.useState("");
  const cancel = React.useRef(false);
  const started = React.useRef(false);

  const pct = done ? 100 : total ? Math.min(99, Math.round(((proc + 0.4) / total) * 100)) : 0;

  // animação das fontes (visual)
  React.useEffect(() => {
    if (done) return;
    const t = setInterval(() => setActive(a => (a + 1) % fontes.length), 430);
    return () => clearInterval(t);
  }, [done]);

  // processamento real (IA por conta)
  React.useEffect(() => {
    if (started.current) return; started.current = true;
    (async () => {
      let sug = 0, ia = 0, err = 0;
      for (let i = 0; i < alvos.length; i++) {
        if (cancel.current) break;
        try {
          const r = await runAgent3IA(alvos[i]);
          if (r.viaIA) ia++;
          const d = r.data;
          const sinais = (d.investigar || []).slice(0, 5).map(x => ({
            tipo: "A investigar (IA)", titulo: x.titulo || "Sinal a confirmar",
            fonte: x.fonte || "Google News", data: window.RADAR_DATA.hoje,
            relevancia: Math.max(20, Math.min(95, d.score || 50)),
            resumo: "Sugestão do Agente 3 (IA): rode esta busca para confirmar o sinal na fonte original.",
            ia: true, query: x.query || (alvos[i].nome + " " + (x.titulo || "")),
          }));
          sug += sinais.length;
          const sc = Number(d.score);
          const okScore = Number.isFinite(sc) ? Math.max(0, Math.min(100, Math.round(sc))) : alvos[i].score;
          const est = d.estrategia || {};
          app.addEmpresa({
            ...alvos[i],
            score: okScore, scoreBase: okScore, scoreAjustado: false,
            iaScore: true, scoreRationale: d.scoreRationale || "",
            resumoSinal: (d.investigar && d.investigar[0] && d.investigar[0].titulo) || alvos[i].resumoSinal,
            sinais,
            intencao: (d.intencao && typeof d.intencao === "object") ? d.intencao : alvos[i].intencao,
            estrategia: {
              ...alvos[i].estrategia, ...est,
              perguntas: Array.isArray(est.perguntas) ? est.perguntas : alvos[i].estrategia.perguntas,
              canaisAlt: (alvos[i].estrategia.canaisAlt && alvos[i].estrategia.canaisAlt.length) ? alvos[i].estrategia.canaisAlt : ["LinkedIn", "E-mail", "WhatsApp"],
            },
            ultimoRastreio: nowStamp(),
          });
          setUltima(alvos[i].nome);
        } catch (e) { err++; }
        if (!cancel.current) { setProc(i + 1); setSugeridos(sug); setViaIA(ia); setErros(err); }
      }
      if (!cancel.current) setDone(true);
    })();
    return () => { cancel.current = true; };
  }, []);

  return (
    <div className="overlay" onClick={(e) => { if (e.target.classList.contains("overlay") && done) app.closeModal(); }}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="ic" style={{ color: "var(--accent)" }}><Icon.radar /></span>
          <div>
            <h2>{done ? "Rastreio concluído" : "Rastreando com IA"}</h2>
            <div className="sub">{empresaId ? alvos[0]?.nome : total + " contas"} · Agente 3 → Inteligência (IA)</div>
          </div>
          {done && <span className="x" onClick={app.closeModal}><Icon.x /></span>}
        </div>
        <div className="modal-body">
          <div className="scan-hero">
            <ScanMeter pct={pct} done={done} />
            <div className="scan-stats">
              <div className="ss"><div className="ss-n" style={{ color: "var(--accent)" }}>{proc}/{total}</div><div className="ss-l">Contas analisadas</div></div>
              <div className="ss"><div className="ss-n">{sugeridos}</div><div className="ss-l">Sinais a confirmar</div></div>
              <div className="ss"><div className="ss-n">{viaIA}</div><div className="ss-l">Via IA (Claude)</div></div>
            </div>
          </div>

          {!done && ultima && <div className="scan-now mono">Analisando: <b>{ultima}</b></div>}

          <div className="scan-sources">
            {fontes.map((s, i) => {
              const state = done ? "done" : i === active ? "active" : "wait";
              const Ic = s.ic;
              return (
                <div key={i} className={"scan-src " + state}>
                  <span className="src-ic"><Ic /></span>
                  <div className="src-tx"><div className="src-n">{s.nome}</div><div className="src-d">{s.det}</div></div>
                  <span className="src-status">
                    {state === "done" ? <span className="src-ok"><Icon.check />consultado</span>
                      : state === "active" ? <span className="src-scan"><span className="spinner" style={{ width: 12, height: 12 }} />varrendo…</span>
                      : <span className="src-wait">na fila</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="ex-note" style={{ marginTop: 16 }}>
            <span className="ic"><Icon.sparkles /></span>
            {done
              ? <div><b>Inteligência gerada para {proc} conta{proc > 1 ? "s" : ""}</b> ({viaIA} via IA Claude{erros ? ", " + erros + " com falha" : ""}). Os sinais entram como <b>“A investigar”</b> com a busca pronta — abra cada um e confirme na fonte antes de abordar. <i>Nada é apresentado como fato confirmado.</i></div>
              : <div>A IA analisa cada conta e devolve a leitura comercial + as <b>buscas a fazer</b> para confirmar sinais reais. Varredura ao vivo da web exige backend com APIs de busca (não roda 100% no navegador), então aqui os sinais vêm como <b>“a verificar”</b>.</div>}
          </div>
        </div>
        <div className="modal-foot">
          {done ? (
            <React.Fragment>
              {empresaId && <button className="btn ghost" onClick={() => { app.closeModal(); app.openModal({ type: "export", scope: "empresa", empresaId }); }}><Icon.upload />Exportar abordagem</button>}
              <button className="btn primary" onClick={app.closeModal}><Icon.check />Concluir</button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span className="mono" style={{ fontSize: 12, color: "var(--tx-2)", marginRight: "auto" }}>Consultando inteligência…</span>
              <button className="btn ghost" onClick={() => { cancel.current = true; setDone(true); }}>Parar</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Exportar (briefing para vendedores) ============ */
function faixaLabel(score) { return faixaOf(score).label; }

function buildEmpresaBriefing(e) {
  const est = e.estrategia, m = e.memoria;
  const L = [];
  L.push("RADAR COMERCIAL · VendaMais");
  L.push("================================");
  L.push(`CONTA: ${e.nome}`);
  L.push(`Score: ${e.score}/100 — ${faixaLabel(e.score)}`);
  L.push(`Segmento: ${e.segmento}  |  Local: ${e.cidade}/${e.uf}  |  Porte: ${e.porte}`);
  L.push(`Status: ${m.status}`);
  if (e.servico && e.servico !== "—") L.push(`Serviço foco: ${e.servico}`);
  L.push("");
  L.push("CONTATO");
  L.push(`${e.contato.nome}${e.contato.cargo && e.contato.cargo !== "—" ? " — " + e.contato.cargo : ""}`);
  if (e.contato.email && e.contato.email !== "—") L.push(`E-mail: ${e.contato.email}`);
  L.push(`Relacionamento: ${m.relacionamento.sentimento}`);
  L.push("");
  L.push("POR QUE ABORDAR AGORA");
  L.push(`Sinal: ${e.resumoSinal}`);
  if (est.diagnosticoIndecisao) L.push(`Diagnóstico (indecisão): ${est.diagnosticoIndecisao}`);
  if (est.motivoAlerta) L.push(`Motivo: ${est.motivoAlerta}`);
  if (est.contexto) L.push(`Contexto: ${est.contexto}`);
  if (est.angulo && est.angulo !== "—") L.push(`Ângulo: ${est.angulo}`);
  L.push("");
  if (est.insight) {
    L.push("O INSIGHT (o ângulo que ainda não foi usado)");
    L.push(est.insight);
    L.push("");
  }
  const jolt = (typeof joltOf === "function") ? joltOf(e) : (est.jolt || null);
  if (jolt) {
    L.push("PLANO JOLT — vencer a indecisão");
    L.push(`J · Julgar a indecisão: ${jolt.julgar || ""}`);
    L.push(`O · Oferecer recomendação: ${jolt.oferecer || ""}`);
    L.push(`L · Limitar a exploração: ${jolt.limitar || ""}`);
    L.push(`T · Tirar o risco da mesa: ${jolt.tirarRisco || ""}`);
    L.push("");
  }
  if (e.sinais && e.sinais.length) {
    L.push("SINAIS DETECTADOS (com fonte para conferir)");
    e.sinais.forEach(s => {
      const ref = signalRef(e, s);
      L.push(`- ${s.titulo}`);
      L.push(`  Fonte: ${s.fonte} (${new Date(s.data + "T12:00:00").toLocaleDateString("pt-BR")}) · ${ref.verificado ? "VERIFICADA" : "A VERIFICAR"}`);
      if (ref.url) L.push(`  Link: ${ref.url}`);
    });
    L.push("");
  }
  if (est.mensagem) {
    L.push(`ABORDAGEM — Canal recomendado: ${est.canal}`);
    L.push("Mensagem sugerida:");
    L.push(est.mensagem);
    L.push("");
  }
  if (est.perguntas && est.perguntas.length) {
    L.push("PERGUNTAS CONSULTIVAS");
    est.perguntas.forEach((q, i) => L.push(`${i + 1}. ${q}`));
    L.push("");
  }
  if (est.objecoes && est.objecoes.length) {
    L.push("OBJEÇÕES ANTECIPADAS");
    est.objecoes.forEach(ob => {
      const oo = typeof ob === "string" ? { objecao: ob, resposta: "" } : ob;
      L.push(`- Se disser: "${oo.objecao}"`);
      if (oo.resposta) L.push(`  Responda: ${oo.resposta}`);
    });
    L.push("");
  }
  L.push(`PRÓXIMO PASSO: ${est.proximoPasso}`);
  L.push("");
  L.push(`— Gerado pelo Radar Comercial em ${nowStamp()}`);
  return L.join("\n");
}

function buildRadarBriefing(empresas, hoje, opts) {
  opts = opts || {};
  const lista = (typeof filtrarRadar === "function") ? filtrarRadar(empresas, opts) : empresas.slice();
  const data = new Date(hoje + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const L = [];
  L.push("RADAR COMERCIAL · VendaMais");
  L.push(`Quem abordar — ${data}`);
  if (opts.vendedor && opts.vendedor !== "todos") L.push(`Vendedor: ${opts.vendedor}`);
  L.push("================================");
  L.push("");
  // agrupar por vendedor
  const grupos = {};
  lista.forEach(e => { const v = e.responsavel || "Sem responsável"; (grupos[v] = grupos[v] || []).push(e); });
  Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR")).forEach(vend => {
    const arr = grupos[vend].slice().sort((a, b) => (b.score - a.score) || a.nome.localeCompare(b.nome, "pt-BR"));
    L.push(`▸ ${vend.toUpperCase()} (${arr.length})`);
    arr.forEach((e, i) => {
      L.push(`${String(i + 1).padStart(2, "0")}. ${e.nome}  —  ${e.score}/100 (${faixaLabel(e.score)})`);
      L.push(`    ${e.segmento} · ${e.cidade}/${e.uf}`);
      L.push(`    Próximo passo: ${e.estrategia.proximoPasso}`);
    });
    L.push("");
  });
  L.push(`Total: ${lista.length} conta(s)`);
  L.push(`— Gerado pelo Radar Comercial em ${nowStamp()}`);
  return L.join("\n");
}

function downloadTxt(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ExportModal({ scope, empresaId }) {
  const app = useApp();
  const empresa = empresaId ? app.empresas.find(e => e.id === empresaId) : null;
  const [copied, setCopied] = React.useState(false);
  const [gerando, setGerando] = React.useState(false);
  const [faixa, setFaixa] = React.useState("todas");
  const [vendedor, setVendedor] = React.useState("todos");

  const vendList = React.useMemo(() => (typeof vendedoresDe === "function" ? vendedoresDe(app.empresas) : []), [app.empresas]);
  const radarOpts = { faixa, vendedor };
  const filtrados = scope === "radar" && typeof filtrarRadar === "function" ? filtrarRadar(app.empresas, radarOpts) : app.empresas;

  const previewHtml = scope === "empresa" ? buildEmpresaDocBody(empresa) : buildRadarDocBody(app.empresas, app.hoje, radarOpts);
  const temJolt = scope === "empresa" && empresa && empresa.estrategia && empresa.estrategia.jolt;

  function baixarWord() {
    if (scope === "empresa") downloadDoc("plano-reabordagem-" + normName(empresa.nome) + ".doc", buildEmpresaDocHTML(empresa));
    else {
      const sufV = vendedor !== "todos" ? "-" + normName(vendedor) : "";
      const sufF = faixa !== "todas" ? "-" + faixa : "";
      downloadDoc("radar-do-dia-" + app.hoje + sufV + sufF + ".doc", buildRadarDocHTML(app.empresas, app.hoje, radarOpts));
    }
    app.pushToast("Documento Word gerado");
  }
  function copyTxt() {
    const text = scope === "empresa" ? buildEmpresaBriefing(empresa) : buildRadarBriefing(app.empresas, app.hoje, radarOpts);
    try { navigator.clipboard && navigator.clipboard.writeText(text); } catch (_) {}
    setCopied(true); setTimeout(() => setCopied(false), 1600);
    app.pushToast("Texto copiado");
  }
  async function aprofundar() {
    if (!empresa) return;
    setGerando(true);
    try {
      const r = await runAgent3IA(empresa);
      const d = r.data, est = d.estrategia || {};
      app.addEmpresa({
        ...empresa,
        score: Number.isFinite(Number(d.score)) ? Math.max(0, Math.min(100, Math.round(Number(d.score)))) : empresa.score,
        scoreBase: Number.isFinite(Number(d.score)) ? Math.max(0, Math.min(100, Math.round(Number(d.score)))) : (empresa.scoreBase != null ? empresa.scoreBase : empresa.score),
        scoreAjustado: false,
        iaScore: true,
        intencao: (d.intencao && typeof d.intencao === "object") ? d.intencao : empresa.intencao,
        estrategia: { ...empresa.estrategia, ...est,
          perguntas: Array.isArray(est.perguntas) ? est.perguntas : empresa.estrategia.perguntas,
          objecoes: Array.isArray(est.objecoes) ? est.objecoes : empresa.estrategia.objecoes,
          canaisAlt: (empresa.estrategia.canaisAlt && empresa.estrategia.canaisAlt.length) ? empresa.estrategia.canaisAlt : ["LinkedIn", "E-mail", "WhatsApp"] },
        ultimoRastreio: nowStamp(),
      });
      app.pushToast(r.viaIA ? "Plano JOLT gerado com IA" : "Plano gerado (IA indisponível — base local)");
    } catch (_) { app.pushToast("Não foi possível gerar agora"); }
    setGerando(false);
  }

  return (
    <div className="overlay" onClick={(e) => { if (e.target.classList.contains("overlay")) app.closeModal(); }}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="ic" style={{ color: "var(--accent)" }}><Icon.file /></span>
          <div>
            <h2>{scope === "empresa" ? "Exportar plano do cliente" : "Exportar radar do dia"}</h2>
            <div className="sub">{scope === "empresa" ? empresa.nome + " · documento Word formatado" : "Ranking priorizado · documento Word"}</div>
          </div>
          <span className="x" onClick={app.closeModal}><Icon.x /></span>
        </div>
        <div className="modal-body">
          {scope === "radar" && (
            <div className="export-filters">
              <div className="ef-field">
                <span className="uplabel">Categoria</span>
                <select className="select-native" value={faixa} onChange={(e) => setFaixa(e.target.value)}>
                  {FAIXA_FILTROS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
              <div className="ef-field">
                <span className="uplabel">Vendedor responsável</span>
                <select className="select-native" value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
                  <option value="todos">Todos os vendedores</option>
                  {vendList.map(v => <option key={v.nome} value={v.nome}>{v.nome} ({v.n})</option>)}
                </select>
              </div>
              <div className="ef-count"><b>{filtrados.length}</b> conta(s) · agrupado por vendedor, score maior → menor</div>
            </div>
          )}
          {scope === "empresa" && (
            <div className={"jolt-cta" + (temJolt ? " ready" : "")}>
              <span className="ic">{temJolt ? <Icon.check /> : <Icon.sparkles />}</span>
              <div className="jc-tx">
                {temJolt
                  ? <span><b>Plano JOLT incluído.</b> O documento traz o insight de reenquadramento, o plano JOLT e as objeções antecipadas.</span>
                  : <span><b>Aprofunde antes de exportar.</b> Gere o plano consultivo com IA (metodologia JOLT p/ indecisão) — insight, recomendação assertiva e objeções para vendedor sênior.</span>}
              </div>
              <button className="btn sm primary" onClick={aprofundar} disabled={gerando}>
                {gerando ? <React.Fragment><span className="spinner" style={{ width: 12, height: 12 }} />Gerando…</React.Fragment> : <React.Fragment><Icon.sparkles />{temJolt ? "Atualizar com IA" : "Aprofundar com IA"}</React.Fragment>}
              </button>
            </div>
          )}
          <div className="doc-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={copyTxt}><Icon.copy />{copied ? "Copiado!" : "Copiar texto"}</button>
          <button className="btn primary" onClick={baixarWord}><Icon.file />Baixar Word (.doc)</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScanModal, ExportModal, buildEmpresaBriefing, buildRadarBriefing, downloadTxt });
