/* empresa-view.jsx — Ficha da empresa: memória comercial, sinais, intenção e estratégia */

function EmpresaView({ empresa, onBack }) {
  const app = useApp();
  const [tab, setTab] = React.useState("dados");
  const e = empresa;
  const m = e.memoria, intc = e.intencao, est = e.estrategia;
  const temSinais = e.sinais.length > 0;
  const temEstrategia = est.mensagem || (est.perguntas && est.perguntas.length);

  React.useEffect(() => { setTab("dados"); }, [e.id]);

  return (
    <div className="page fade-in">
      <div className="back-btn" onClick={onBack}><Icon.chevL /> Voltar</div>

      <div className="detail-head">
        <span className="avatar">{e.iniciais}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1>{e.nome}</h1>
          <div className="detail-meta">
            <span className="mi"><Icon.briefcase />{e.segmento}</span>
            <span className="mi"><Icon.pin />{e.cidade}/{e.uf}</span>
            <span className="mi"><Icon.buildings />{e.porte}</span>
            <span className="mi"><Icon.globe />{e.site}</span>
          </div>
          <div className="detail-actions">
            <FaixaBadge score={e.score} />
            {e.scoreAjustado && <span className="vbadge ok" title="A nota foi recalculada a partir dos sinais que você validou/descartou"><Icon.check />Nota ajustada por validação</span>}
            <span className="last-scan"><Icon.clock />{e.ultimoRastreio ? "Rastreado " + e.ultimoRastreio : "Sem rastreio manual ainda"}</span>
            <div style={{ flex: 1 }} />
            <button className="btn sm" onClick={() => app.openModal({ type: "scan", empresaId: e.id })}><Icon.radar />Rastrear agora</button>
            <button className="btn sm primary" onClick={() => app.openModal({ type: "export", scope: "empresa", empresaId: e.id })}><Icon.upload />Exportar</button>
          </div>
        </div>
        <div className="score-card">
          <Gauge score={e.score} size={150} />
        </div>
      </div>

      <div className="tabs">
        <div className={"tab" + (tab === "dados" ? " active" : "")} onClick={() => setTab("dados")}>
          Dados &amp; contato
        </div>
        <div className={"tab" + (tab === "memoria" ? " active" : "")} onClick={() => setTab("memoria")}>
          Memória comercial
        </div>
        <div className={"tab" + (tab === "sinais" ? " active" : "")} onClick={() => setTab("sinais")}>
          Sinais &amp; Intenção <span className="badge">{e.sinais.length}</span>
        </div>
        <div className={"tab" + (tab === "estrategia" ? " active" : "")} onClick={() => setTab("estrategia")}>
          Estratégia de abordagem
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === "dados" && <DadosTab e={e} m={m} />}
        {tab === "memoria" && <MemoriaTab e={e} m={m} />}
        {tab === "sinais" && <SinaisTab e={e} intc={intc} temSinais={temSinais} />}
        {tab === "estrategia" && <EstrategiaTab est={est} temEstrategia={temEstrategia} empresa={e} />}
      </div>
    </div>
  );
}

/* ---------- Dados & contato (elo = empresa) — editável ---------- */
function DRow({ label, value, editing, onChange, mono, placeholder, list }) {
  return (
    <div className="data-row">
      <div className="dk">{label}</div>
      <div className="dv">
        {editing
          ? <input className={"edit-inp" + (mono ? " mono" : "")} value={value == null ? "" : value} placeholder={placeholder || ""} list={list} onChange={e => onChange(e.target.value)} />
          : <span className={mono ? "mono" : ""}>{(value == null || value === "") ? "—" : value}</span>}
      </div>
    </div>
  );
}

function DadosTab({ e, m }) {
  const app = useApp();
  const prov = e.proveniencia || {};
  const status = (e.validacao && e.validacao.status) || "pendente";
  const isDemo = prov.tipo === "demonstracao";
  const [editing, setEditing] = React.useState(false);
  const [d, setD] = React.useState({});
  const vendedores = React.useMemo(() => Array.from(new Set(app.empresas.map(x => x.responsavel).filter(v => v && v !== "—"))), [app.empresas]);

  function start() {
    setD({
      nome: e.nome, segmento: e.segmento, porte: e.porte, cidade: e.cidade, uf: e.uf,
      site: e.site, linkedin: e.linkedin || "", cnpj: e.cnpj, servico: e.servico, responsavel: e.responsavel,
      cNome: e.contato.nome, cCargo: e.contato.cargo, cEmail: e.contato.email,
      sentimento: m.relacionamento ? m.relacionamento.sentimento : "", patrocinador: m.patrocinador || "",
    });
    setEditing(true);
  }
  function set(k) { return v => setD(prev => ({ ...prev, [k]: v })); }
  function save() {
    app.updateEmpresa(e.id, {
      nome: d.nome || e.nome, segmento: d.segmento, porte: d.porte, cidade: d.cidade, uf: (d.uf || "").toUpperCase(),
      site: d.site, linkedin: d.linkedin, cnpj: d.cnpj, servico: d.servico, responsavel: d.responsavel || "—",
      iniciais: (d.nome || e.nome).trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || e.iniciais,
      contato: { ...e.contato, nome: d.cNome || "—", cargo: d.cCargo || "—", email: d.cEmail || "—" },
      memoria: { ...m, patrocinador: d.patrocinador, relacionamento: { ...(m.relacionamento || {}), nome: d.cNome || (m.relacionamento && m.relacionamento.nome), sentimento: d.sentimento } },
    });
    setEditing(false);
    app.pushToast("Dados atualizados");
  }

  return (
    <React.Fragment>
      <div className={"prov-panel" + (isDemo ? " demo" : status === "validado" ? " ok" : status === "incorreto" ? " bad" : "")}>
        <div className="prov-main">
          <span className="prov-ic">{isDemo ? <Icon.alert /> : <Icon.shield />}</span>
          <div>
            <div className="prov-title">Proveniência <ValidacaoBadge status={isDemo ? "demo" : status} /></div>
            <div className="prov-sub">{provLabel(prov)}{prov.nota ? " · " + prov.nota : ""}</div>
          </div>
        </div>
        <div className="prov-actions">
          {status !== "validado" && <button className="btn sm" onClick={() => { app.validarEmpresa(e.id, "validado"); app.pushToast(e.nome + " validada"); }}><Icon.check />Validar conta</button>}
          {status === "validado" && <button className="btn sm" onClick={() => { app.validarEmpresa(e.id, "pendente"); app.pushToast("Validação removida"); }}>Revalidar</button>}
          {status !== "incorreto" && <button className="btn sm" onClick={() => { app.validarEmpresa(e.id, "incorreto"); app.pushToast("Marcada como incorreta"); }}><Icon.alert />Marcar incorreta</button>}
          <button className="btn sm danger" onClick={() => { if (confirm("Remover " + e.nome + " do Radar?")) { app.removerEmpresa(e.id); app.pushToast(e.nome + " removida"); } }}><Icon.x />Remover</button>
        </div>
      </div>

      <div className="edit-bar">
        {editing
          ? <React.Fragment><button className="btn sm" onClick={() => setEditing(false)}>Cancelar</button><button className="btn sm primary" onClick={save}><Icon.check />Salvar alterações</button></React.Fragment>
          : <button className="btn sm" onClick={start}><Icon.edit />Editar dados &amp; contato</button>}
      </div>

      <datalist id="vendedores-dl">{vendedores.map(v => <option key={v} value={v} />)}</datalist>

    <div className="detail-grid">
      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.buildings /></span><h3>Dados da empresa</h3></div>
          <div className="panel-body">
            <div className="data-list">
              <DRow label="Razão / nome" value={editing ? d.nome : e.nome} editing={editing} onChange={set("nome")} />
              <DRow label="Segmento" value={editing ? d.segmento : e.segmento} editing={editing} onChange={set("segmento")} />
              <DRow label="Porte" value={editing ? d.porte : e.porte} editing={editing} onChange={set("porte")} />
              <DRow label="Cidade" value={editing ? d.cidade : e.cidade} editing={editing} onChange={set("cidade")} />
              <DRow label="UF" value={editing ? d.uf : e.uf} editing={editing} onChange={set("uf")} />
              <DRow label="Site" value={editing ? d.site : e.site} editing={editing} onChange={set("site")} placeholder="empresa.com.br" />
              <DRow label="LinkedIn" value={editing ? d.linkedin : (e.linkedin || "")} editing={editing} onChange={set("linkedin")} placeholder="linkedin.com/company/…" />
              <DRow label="CNPJ" value={editing ? d.cnpj : e.cnpj} editing={editing} onChange={set("cnpj")} mono />
              <DRow label="Serviço foco" value={editing ? d.servico : e.servico} editing={editing} onChange={set("servico")} />
              <DRow label="Responsável VendaMais" value={editing ? d.responsavel : e.responsavel} editing={editing} onChange={set("responsavel")} list="vendedores-dl" placeholder="Nome do vendedor" />
              <div className="data-row"><div className="dk">Origem do cadastro</div><div className="dv" style={{ color: "var(--tx-2)" }}>{e.origem || "—"}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.user /></span><h3>Dados do contato</h3></div>
          <div className="panel-body">
            <div className="contact-card">
              <span className="contact-ava">{((editing ? d.cNome : e.contato.nome) || "?").slice(0,1)}</span>
              <div>
                <div className="cc-nome">{editing ? (d.cNome || "—") : e.contato.nome}</div>
                <div className="cc-cargo">{editing ? (d.cCargo || "—") : e.contato.cargo}</div>
              </div>
            </div>
            <div className="data-list" style={{ marginTop: 14 }}>
              <DRow label="Nome do contato" value={editing ? d.cNome : e.contato.nome} editing={editing} onChange={set("cNome")} />
              <DRow label="Cargo" value={editing ? d.cCargo : e.contato.cargo} editing={editing} onChange={set("cCargo")} />
              <DRow label="E-mail" value={editing ? d.cEmail : e.contato.email} editing={editing} onChange={set("cEmail")} />
              <DRow label="Relacionamento" value={editing ? d.sentimento : (m.relacionamento ? m.relacionamento.sentimento : "")} editing={editing} onChange={set("sentimento")} />
              <DRow label="Patrocinador interno" value={editing ? d.patrocinador : m.patrocinador} editing={editing} onChange={set("patrocinador")} />
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.target /></span><h3>Status no Radar</h3></div>
          <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="mono" style={{ fontSize: 34, fontWeight: 600, color: faixaOf(e.score).cor }}>{e.score}</div>
            <div style={{ flex: 1 }}>
              <FaixaBadge score={e.score} />
              <div style={{ fontSize: 12.5, color: "var(--tx-1)", marginTop: 8 }}>{e.resumoSinal}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}

/* ---------- Memória comercial ---------- */
function MemoriaTab({ e, m }) {
  return (
    <div className="detail-grid">
      <div className="col">
        <div className="panel">
          <div className="panel-head">
            <span className="ic"><Icon.brain /></span>
            <h3>Resumo executivo da conta</h3>
            <span className="tag faixa" style={{ background: "var(--bg-3)", color: "var(--tx-1)" }}>{m.status}</span>
          </div>
          <div className="panel-body">
            <div className="memo-summary">{m.resumoExecutivo}</div>
            <div className="memo-kpis">
              <div className="memo-kpi"><div className="k">Já foi cliente?</div><div className="v">{m.jaCliente ? "Sim" : "Não"}</div></div>
              <div className="memo-kpi"><div className="k">Já recebeu proposta?</div><div className="v">{m.jaProposta ? "Sim" : "Não"}</div></div>
              <div className="memo-kpi"><div className="k">Principal relacionamento</div><div className="v">{m.relacionamento.nome}{m.relacionamento.cargo !== "—" ? ` — ${m.relacionamento.cargo}` : ""}</div></div>
              <div className="memo-kpi"><div className="k">Sentimento</div><div className="v">{m.relacionamento.sentimento}</div></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.doc /></span><h3>Perguntas-chave da conta</h3></div>
          <div className="panel-body">
            <div className="qa">
              <QA q="Qual era a dor?" a={m.dor} />
              <QA q="Motivo da perda" a={m.objecoes.length ? m.objecoes[0] : "—"} />
              <QA q="Objeções conhecidas" a={m.objecoes.length ? m.objecoes.join(" · ") : "Nenhuma registrada"} />
              <QA q="Risco político" a={m.risco} />
              <QA q="Patrocinador interno" a={m.patrocinador} />
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.history /></span><h3>Linha do tempo</h3></div>
          <div className="panel-body">
            {m.timeline.length ? (
              <div className="tl">
                {m.timeline.map((t, i) => (
                  <div className={"tl-item " + (t.tipo === "Sinal" ? "sinal" : t.tipo === "Perda" ? "perda" : "")} key={i}>
                    <span className="nub" />
                    <div><span className="when">{t.data}</span><span className="ty">{t.tipo}</span></div>
                    <div className="tx">{t.texto}</div>
                  </div>
                ))}
              </div>
            ) : <div className="empty">Sem histórico registrado.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function QA({ q, a }) {
  return (<div className="qa-item"><div className="q">{q}</div><div className="a">{a}</div></div>);
}

/* ---------- Sinais & Intenção ---------- */
function SinaisTab({ e, intc, temSinais }) {
  const app = useApp();
  const [open, setOpen] = React.useState(0);
  return (
    <div className="detail-grid">
      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.signal /></span><h3>Sinais detectados</h3>
            <span className="tag mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--tx-2)" }}>Somente fatos · sem interpretação</span>
          </div>
          <div className="panel-body">
            {temSinais ? (
              <div className="sig">
                {e.sinais.map((s, i) => (
                  <div className={"sig-item" + (open === i ? " open" : "") + (s.validado === "descartado" ? " discarded" : "")} key={i} onClick={() => setOpen(open === i ? -1 : i)}>
                    <div className="sig-top">
                      <span className="sig-type">{s.tipo}</span>
                      <span className="sig-title">{s.titulo}</span>
                      <span className="sig-rel">
                        <span className="sig-relbar"><i style={{ width: s.relevancia + "%" }} /></span>
                        <span className="sig-relnum">{s.relevancia}</span>
                      </span>
                    </div>
                    <div className="sig-foot">
                      <span className="src">{s.fonte}</span>
                      <span>{new Date(s.data + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                      {s.validado === "ok" ? <span className="vlbadge" style={{ color: "#34C759", background: "#34C75922", marginLeft: "auto" }}><Icon.check />Validado</span>
                        : s.validado === "descartado" ? <span className="vlbadge" style={{ color: "#EA5333", background: "#EA533322", marginLeft: "auto" }}><Icon.x />Descartado</span>
                        : <VerifyBadge empresa={e} sinal={s} compact />}
                    </div>
                    {open === i && (
                      <div className="sig-expand">
                        {s.resumo}
                        <div className="sig-verify">
                          <VerifyBadge empresa={e} sinal={s} />
                          <div className="lk" onClick={(ev) => { ev.stopPropagation(); app.openModal({ type: "source", sinal: s, empresa: e }); }}><Icon.ext /> Ver fonte e verificar</div>
                          <div style={{ flex: 1 }} />
                          <button className="btn sm" onClick={(ev) => { ev.stopPropagation(); const ns = s.validado === "ok" ? null : "ok"; const sinais = e.sinais.map((x, j) => j === i ? { ...x, validado: ns } : x); const r = recomputeScore({ ...e, sinais, scoreBase: e.scoreBase != null ? e.scoreBase : e.score }); app.validarSinal(e.id, i, ns); app.pushToast(ns ? ("Sinal validado · nota " + e.score + " → " + r.score + " (" + faixaOf(r.score).label + ")") : "Validação removida · nota " + r.score); }}><Icon.check />Validar</button>
                          <button className="btn sm danger" onClick={(ev) => { ev.stopPropagation(); const ns = s.validado === "descartado" ? null : "descartado"; const sinais = e.sinais.map((x, j) => j === i ? { ...x, validado: ns } : x); const r = recomputeScore({ ...e, sinais, scoreBase: e.scoreBase != null ? e.scoreBase : e.score }); app.validarSinal(e.id, i, ns); app.pushToast(ns ? ("Sinal descartado · nota " + e.score + " → " + r.score + " (" + faixaOf(r.score).label + ")") : "Sinal restaurado · nota " + r.score); }}><Icon.x />Descartar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : <div className="empty">Nenhum sinal relevante detectado no período.</div>}
          </div>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.brain /></span><h3>Inteligência de intenção</h3></div>
          <div className="panel-body">
            <div className="intent-grid">
              <div className="intent-row"><div className="k">O que mudou</div><div className="v">{intc.oQueMudou}</div></div>
              <div className="intent-row"><div className="k">Por que mudou</div><div className="v">{intc.porqueMudou}</div></div>
              <div className="intent-row"><div className="k">O que indica</div><div className="v">{intc.indica}</div></div>
              <div className="intent-row hl"><div className="k">Oportunidade</div><div className="v">{intc.oportunidade}</div></div>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.target /></span><h3>Score de intenção</h3></div>
          <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Gauge score={e.score} size={150} />
            <div style={{ flex: 1 }}>
              <FaixaBadge score={e.score} />
              <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--tx-1)", lineHeight: 1.55 }}>
                {e.scoreAjustado
                  ? "Nota recalculada a partir dos sinais que você validou/descartou — o peso vem da informação (tipo × relevância), não da quantidade. Confirmar um sinal forte sobe a nota; descartar derruba — e a empresa pode mudar de categoria."
                  : "Nota combinando intensidade dos sinais e contexto da conta. Valide ou descarte os sinais para refinar — a nota e a categoria reagem ao que você confirmar."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Estratégia de abordagem ---------- */
function EstrategiaTab({ est, temEstrategia, empresa }) {
  const app = useApp();
  const [copied, setCopied] = React.useState(false);
  const [feito, setFeito] = React.useState(false);
  if (!temEstrategia) {
    return <div className="panel"><div className="empty">Sem ação recomendada hoje.<br/>{est.proximoPasso}</div></div>;
  }
  function copy() {
    try { navigator.clipboard && navigator.clipboard.writeText(est.mensagem); } catch (_) {}
    setCopied(true); setTimeout(() => setCopied(false), 1600);
    app.pushToast("Mensagem copiada");
  }
  return (
    <div className="detail-grid">
      <div className="col">
        {est.insight && (
          <div className="insight-card">
            <div className="ic-lab"><Icon.sparkles />O insight — o ângulo que ainda não foi usado</div>
            <div className="ic-tx">{est.insight}</div>
          </div>
        )}
        {est.jolt && (
          <div className="panel">
            <div className="panel-head"><span className="ic"><Icon.target /></span><h3>Plano JOLT — vencer a indecisão</h3>
              <span className="tag mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--tx-2)" }}>p/ propostas perdidas</span>
            </div>
            <div className="panel-body">
              {est.diagnosticoIndecisao && <div className="field"><span className="uplabel">Diagnóstico da indecisão</span><div className="body">{est.diagnosticoIndecisao}</div></div>}
              <div className="jolt-grid">
                {[["J", "Julgar a indecisão", est.jolt.julgar], ["O", "Oferecer recomendação", est.jolt.oferecer], ["L", "Limitar a exploração", est.jolt.limitar], ["T", "Tirar o risco da mesa", est.jolt.tirarRisco]].map((b, i) => (
                  <div className="jolt-row" key={i}>
                    <span className={"jolt-let " + (i % 2 ? "o" : "t")}>{b[0]}</span>
                    <div><div className="jl-t">{b[1]}</div><div className="jl-d">{b[2]}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.bolt /></span><h3>Por que abordar agora</h3></div>
          <div className="panel-body">
            <div className="field"><span className="uplabel">Motivo do alerta</span><div className="body">{est.motivoAlerta}</div></div>
            <div className="field"><span className="uplabel">Contexto</span><div className="body">{est.contexto}</div></div>
            <div className="field"><span className="uplabel">Melhor ângulo de abordagem</span><div className="body">{est.angulo}</div></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.mail /></span><h3>Mensagem sugerida</h3>
            <button className="btn sm" style={{ marginLeft: "auto" }} onClick={() => app.openModal({ type: "export", scope: "empresa", empresaId: empresa.id })}><Icon.file />Exportar Word</button>
          </div>
          <div className="panel-body">
            <div className="appr-msg">
              <span className="copy" onClick={copy}><Icon.copy />{copied ? "Copiado" : "Copiar"}</span>
              {est.mensagem}
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.target /></span><h3>Canal recomendado</h3></div>
          <div className="panel-body">
            <div className="channels">
              {est.canaisAlt.map((c, i) => {
                const IcC = CHAN_ICON[c];
                const primary = c === est.canal;
                return (
                  <span key={i} className={"chan clickable" + (primary ? " primary" : "")}
                        onClick={() => app.pushToast("Abrindo abordagem por " + c)}>
                    {IcC && <IcC />}{c}{primary && <span className="star">★</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><span className="ic"><Icon.doc /></span><h3>Perguntas consultivas</h3></div>
          <div className="panel-body">
            <ul className="qlist" style={{ padding: 0, margin: 0 }}>
              {est.perguntas.map((q, i) => (
                <li key={i}><span className="qn">{String(i + 1).padStart(2, "0")}</span>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {est.objecoes && est.objecoes.length > 0 && (
          <div className="panel">
            <div className="panel-head"><span className="ic"><Icon.shield /></span><h3>Objeções antecipadas</h3></div>
            <div className="panel-body">
              <div className="obj-list">
                {est.objecoes.map((ob, i) => {
                  const oo = typeof ob === "string" ? { objecao: ob, resposta: "" } : ob;
                  return (
                    <div className="obj-item" key={i}>
                      <div className="obj-q">“{oo.objecao}”</div>
                      {oo.resposta && <div className="obj-a">{oo.resposta}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="next-step">
          <span className="ic"><Icon.arrow /></span>
          <div style={{ flex: 1 }}><div className="t">Próximo passo</div><div className="x">{est.proximoPasso}</div>
            <button className={"btn sm" + (feito ? "" : " primary")} style={{ marginTop: 12 }}
                    onClick={() => { setFeito(true); app.pushToast(feito ? "Reaberto" : "Marcado como conclu\u00eddo"); }}>
              {feito ? <React.Fragment><Icon.check />Concluído</React.Fragment> : "Marcar como conclu\u00eddo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.EmpresaView = EmpresaView;
