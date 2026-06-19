/* import-flow.jsx — Anexar arquivos + cadastro manual.
   Elo = empresa: se o nome já existir, ATUALIZA a conta (não duplica). */

const NEW_EMPRESA_TEMPLATES = [
  {
    nome: "Metalúrgica Sulmaq", iniciais: "SM", segmento: "Indústria metalúrgica",
    porte: "Média (≈ 240 func.)", cidade: "Caxias do Sul", uf: "RS", site: "sulmaq.com.br",
    contato: { nome: "Ricardo Bento", cargo: "Diretor Comercial", email: "ricardo@sulmaq.com.br" },
    faltantes: ["CNPJ", "LinkedIn da empresa", "Faturamento estimado"],
    segmentoDor: "estruturação de processo comercial e padronização da equipe externa",
  },
  {
    nome: "Distribuidora NordPharma", iniciais: "NP", segmento: "Distribuição farmacêutica",
    porte: "Grande (≈ 900 func.)", cidade: "Recife", uf: "PE", site: "nordpharma.com.br",
    contato: { nome: "Aline Carvalho", cargo: "Gerente de RH/DHO", email: "aline@nordpharma.com.br" },
    faltantes: ["Porte exato", "Nome do decisor comercial"],
    segmentoDor: "capacitação de representantes e gestão de carteira",
  },
  {
    nome: "Comercial União", iniciais: "CU", segmento: "Comércio atacadista",
    porte: "—", cidade: "—", uf: "", site: "",
    contato: { nome: "—", cargo: "—", email: "—" },
    faltantes: ["Site", "LinkedIn", "CNPJ", "Cidade/UF"],
    segmentoDor: "estruturação do processo comercial", ambiguo: true,
  },
];

function iniciaisDe(nome) {
  const w = (nome || "").trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "??";
  return ((w[0][0] || "") + (w[1] ? w[1][0] : (w[0][1] || ""))).toUpperCase();
}

/* Desambiguação: empresa sem referência clara ou nome comum precisa de site/LinkedIn */
const NOMES_COMUNS = ["comercial", "industria", "distribuidora", "transportes", "servicos", "grupo", "uniao", "brasil", "alfa", "central", "global", "nacional", "primma", "prime", "real"];
function checkAmbiguidade(nome, site, linkedin, email) {
  const temRef = (site && site.trim()) || (linkedin && linkedin.trim()) ||
    (email && /@/.test(email) && !/(gmail|hotmail|outlook|yahoo|bol|uol)/i.test(email));
  if (temRef) return null; // resolvido por referência
  if (!nome || !nome.trim()) return null;
  const tokens = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/);
  const generico = tokens.some(t => NOMES_COMUNS.includes(t)) || normName(nome).length <= 6;
  if (generico) return {
    tipo: "multiplas",
    motivo: `Encontramos mais de uma empresa chamada “${nome}”. Para o Radar monitorar a correta, adicione o site ou o LinkedIn.`,
    candidatos: [`${nome} Ltda — São Paulo/SP`, `${nome} Comércio — Curitiba/PR`, `${nome} Indústria — Recife/PE`],
  };
  return {
    tipo: "sem_ref",
    motivo: `Não conseguimos identificar “${nome}” com segurança. Adicione uma referência (site ou LinkedIn) para evitar monitorar a empresa errada.`,
    candidatos: null,
  };
}

function RefAlert({ info, site, linkedin, onSite, onLinkedin, withInputs }) {
  return (
    <div className="ref-alert">
      <div className="ra-head"><span className="ic"><Icon.alert /></span><span className="t">{info.tipo === "multiplas" ? "Empresa ambígua" : "Referência necessária"}</span></div>
      <div className="ra-desc">{info.motivo}</div>
      {info.candidatos && (
        <div className="ra-cands">
          {info.candidatos.map((c, i) => <div className="ra-cand" key={i}><span className="num">{i + 1}</span>{c}</div>)}
        </div>
      )}
      {withInputs && (
        <div className="form-grid">
          <div className="ff span2"><label>Site da empresa</label><input value={site} onChange={(e) => onSite(e.target.value)} placeholder="empresa.com.br" /></div>
          <div className="ff span2"><label>LinkedIn da empresa</label><input value={linkedin} onChange={(e) => onLinkedin(e.target.value)} placeholder="linkedin.com/company/…" /></div>
        </div>
      )}
    </div>
  );
}

/* Cria ou atualiza uma conta pelo nome. Retorna { atualizada, id }. */
function upsertEmpresaPorNome(app, dados, fonte) {
  const existente = app.empresas.find(e => normName(e.nome) === normName(dados.nome));
  if (existente) {
    const merged = {
      ...existente,
      segmento: dados.segmento || existente.segmento,
      porte: dados.porte || existente.porte,
      cidade: dados.cidade || existente.cidade,
      uf: dados.uf || existente.uf,
      site: dados.site || existente.site,
      linkedin: dados.linkedin || existente.linkedin,
      contato: { ...existente.contato, ...(dados.contato || {}) },
      origem: existente.origem + " · atualizado",
      memoria: {
        ...existente.memoria,
        timeline: [{ data: "Hoje", tipo: "Atualização", texto: "Dados da conta atualizados via " + fonte + "." }, ...existente.memoria.timeline],
      },
    };
    app.addEmpresa(merged);
    return { atualizada: true, id: existente.id };
  }
  const id = "imp_" + Date.now();
  const nova = {
    id, nome: dados.nome, iniciais: dados.iniciais || iniciaisDe(dados.nome),
    segmento: dados.segmento || "—", porte: dados.porte || "—",
    cidade: dados.cidade || "—", uf: dados.uf || "", site: dados.site || "—", cnpj: dados.cnpj || "—", linkedin: dados.linkedin || "—",
    contato: dados.contato || { nome: "—", cargo: "—", email: "—" },
    responsavel: dados.responsavel || "—", servico: dados.servico || "—",
    origem: "Cadastrado · " + fonte, ultimoRastreio: null,
    proveniencia: { tipo: fonte === "cadastro manual" ? "manual" : "arquivo", arquivo: fonte === "cadastro manual" ? null : fonte, nota: "Adicionada por você" },
    validacao: { status: "pendente" },
    score: 34, resumoSinal: "Conta recém-cadastrada — aguardando primeiros sinais",
    motivo: "Cadastrada sem histórico ainda; rode o Radar externo para pontuar.", novidade: "—",
    sinais: [],
    memoria: {
      jaCliente: false, jaProposta: false, status: "Conta nova · monitorando",
      resumoExecutivo: "Conta cadastrada via " + fonte + ". Ficha estruturada pelo Agente 1. " + (dados.faltantes && dados.faltantes.length ? dados.faltantes.length + " campos faltantes identificados para enriquecimento." : "Pronta para receber histórico e sinais."),
      timeline: [{ data: "Hoje", tipo: "Cadastro", texto: "Empresa cadastrada via " + fonte + " e adicionada ao Radar." }],
      relacionamento: { nome: dados.contato ? dados.contato.nome : "—", cargo: dados.contato ? dados.contato.cargo : "—", sentimento: "Sem histórico" },
      dor: dados.segmentoDor ? "A mapear — " + dados.segmentoDor : "A mapear", objecoes: [], risco: "Sem relacionamento ainda", patrocinador: "A identificar",
    },
    intencao: { oQueMudou: "Conta recém-adicionada.", porqueMudou: "—", indica: "Aguardando primeiro sinal externo para pontuar.", oportunidade: "Executar o Radar externo (Agente 3) para capturar sinais." },
    estrategia: { motivoAlerta: "Conta nova sem sinais.", contexto: "Aguardar primeiro gatilho.", angulo: "—", canal: "—", canaisAlt: [], mensagem: "", perguntas: [], proximoPasso: "Rodar o Radar externo para esta conta e mapear o decisor comercial." },
  };
  app.addEmpresa(nova);
  return { atualizada: false, id };
}

function ImportFlow({ initialMode = "empresa" }) {
  const app = useApp();
  const [mode, setMode] = React.useState(initialMode);
  const [step, setStep] = React.useState("upload"); // upload | ingest | preview
  const [file, setFile] = React.useState(null);
  const [drag, setDrag] = React.useState(false);
  const [alvoId, setAlvoId] = React.useState(app.empresas[0]?.id || "");
  const [istep, setIstep] = React.useState(0);
  const [form, setForm] = React.useState({ nome: "", segmento: "", cidade: "", uf: "", porte: "", cNome: "", cCargo: "", cEmail: "", servico: "", site: "", linkedin: "" });
  const [amb, setAmb] = React.useState(null);
  const [fileRef, setFileRef] = React.useState({ site: "", linkedin: "" });
  const [fileObj, setFileObj] = React.useState(null);
  const [parsed, setParsed] = React.useState(null);
  const [parseErr, setParseErr] = React.useState(null);
  const inputRef = React.useRef(null);
  const tmpl = React.useRef(NEW_EMPRESA_TEMPLATES[Math.floor(Math.random() * NEW_EMPRESA_TEMPLATES.length)]).current;

  const ingestSteps = mode === "empresa"
    ? ["Lendo o arquivo", "Extraindo dados da empresa", "Identificando campos faltantes", "Enriquecendo informações públicas", "Estruturando ficha da conta"]
    : ["Lendo o arquivo", "Mapeando contatos e datas", "Consolidando histórico de relacionamento", "Atualizando memória comercial", "Recalculando score de intenção"];

  function pickFile(f) { if (!f) return; setFile({ name: f.name, size: f.size }); setFileObj(f); setParsed(null); setParseErr(null); setStep("ingest"); setIstep(0); }
  function onDrop(e) { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files && e.dataTransfer.files[0]); }

  React.useEffect(() => {
    if (step !== "ingest") return;
    if (istep >= ingestSteps.length) {
      if (mode === "empresa" && fileObj && parsed === null && !parseErr) {
        (async () => {
          try {
            const { headers, rows } = await window.parseSpreadsheet(fileObj);
            const emp = window.buildEmpresasFromSheet(headers, rows, fileObj.name);
            if (!emp.length) { setParseErr("Não encontramos empresas na planilha. Verifique se há uma coluna com o nome da empresa."); }
            else setParsed(emp);
          } catch (err) { setParseErr("Não consegui ler este arquivo (" + (err.message || "formato inválido") + "). Use XLSX ou CSV."); }
          setStep("preview");
        })();
        return;
      }
      const t = setTimeout(() => setStep("preview"), 450); return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIstep(istep + 1), 620);
    return () => clearTimeout(t);
  }, [step, istep]);

  const alvo = app.empresas.find(e => e.id === alvoId);
  const matchExistente = app.empresas.find(e => normName(e.nome) === normName(tmpl.nome));
  const fileAmb = tmpl.ambiguo ? checkAmbiguidade(tmpl.nome, fileRef.site, fileRef.linkedin, "") : null;
  const seed = window.RADAR_DATA.seedPlanilha || [];
  const jaImportadas = seed.filter(s => app.empresas.some(e => e.id === s.id)).length;

  function confirmEmpresa() {
    const lista = parsed || [];
    let novas = 0;
    lista.forEach(s => { if (!app.empresas.some(e => e.id === s.id)) novas++; app.addEmpresa(JSON.parse(JSON.stringify(s))); });
    app.addImport({ id: "imp_" + Date.now(), arquivo: file.name, tipo: "Planilha de empresas", data: app.hoje, registros: lista.length, status: "Processado" });
    app.closeModal();
    app.pushToast(novas < lista.length ? "Planilha sincronizada (" + lista.length + " contas)" : lista.length + " empresas importadas da planilha");
    app.setView("contas");
  }

  function confirmEmpresaOld() {
    const dados = { ...tmpl, site: fileRef.site || tmpl.site || "—", linkedin: fileRef.linkedin || "" };
    const r = upsertEmpresaPorNome(app, dados, file.name);
    app.addImport({ id: "imp_" + Date.now(), arquivo: file.name, tipo: r.atualizada ? "Atualização · " + tmpl.nome : "Empresa para monitorar", data: app.hoje, registros: 1, status: "Processado" });
    app.closeModal();
    app.pushToast(r.atualizada ? tmpl.nome + " atualizada" : tmpl.nome + " adicionada ao Radar");
    app.openEmpresa(r.id);
  }

  function confirmHistorico() {
    const novos = [{ data: "Hoje", tipo: "Importado", texto: "Histórico anexado de " + file.name + " — follow-ups e contexto consolidados na memória." }];
    app.addEmpresa({ ...alvo, memoria: { ...alvo.memoria, timeline: [...novos, ...alvo.memoria.timeline] } });
    app.addImport({ id: "imp_" + Date.now(), arquivo: file.name, tipo: "Histórico · " + alvo.nome, data: app.hoje, registros: 1, status: "Processado" });
    app.closeModal();
    app.pushToast("Memória de " + alvo.nome + " atualizada");
    app.openEmpresa(alvo.id);
  }

  function confirmManual() {
    if (!form.nome.trim()) { app.pushToast("Informe o nome da empresa"); return; }
    const existe = app.empresas.find(e => normName(e.nome) === normName(form.nome));
    const reason = existe ? null : checkAmbiguidade(form.nome, form.site, form.linkedin, form.cEmail);
    if (reason) { setAmb(reason); return; }
    setAmb(null);
    const dados = {
      nome: form.nome.trim(), segmento: form.segmento, porte: form.porte, cidade: form.cidade, uf: form.uf.toUpperCase(),
      site: form.site, linkedin: form.linkedin, servico: form.servico,
      contato: { nome: form.cNome || "—", cargo: form.cCargo || "—", email: form.cEmail || "—" },
    };
    const r = upsertEmpresaPorNome(app, dados, "cadastro manual");
    app.closeModal();
    app.pushToast(r.atualizada ? form.nome + " atualizada" : form.nome + " adicionada ao Radar");
    app.openEmpresa(r.id);
  }

  const upd = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (amb) setAmb(null); };

  return (
    <div className="overlay" onClick={(e) => { if (e.target.classList.contains("overlay")) app.closeModal(); }}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="ic" style={{ color: "var(--accent)" }}><Icon.upload /></span>
          <div>
            <h2>Adicionar empresa</h2>
            <div className="sub">Anexe arquivos ou cadastre manualmente. Se a empresa já existir, os dados são atualizados — nunca duplicados.</div>
          </div>
          <span className="x" onClick={app.closeModal}><Icon.x /></span>
        </div>

        <div className="modal-body">
          {step === "upload" && (
            <React.Fragment>
              <div className="mode-toggle three">
                <div className={"mode-card" + (mode === "empresa" ? " active" : "")} onClick={() => setMode("empresa")}>
                  <div className="ic"><Icon.buildings /></div>
                  <div className="t">Anexar lista/ficha</div>
                  <div className="d">A IA cria a ficha e identifica o que falta.</div>
                </div>
                <div className={"mode-card" + (mode === "manual" ? " active" : "")} onClick={() => setMode("manual")}>
                  <div className="ic"><Icon.plus /></div>
                  <div className="t">Cadastro manual</div>
                  <div className="d">Preencha os dados da empresa e do contato.</div>
                </div>
                <div className={"mode-card" + (mode === "historico" ? " active" : "")} onClick={() => setMode("historico")}>
                  <div className="ic"><Icon.history /></div>
                  <div className="t">Anexar histórico</div>
                  <div className="d">CRM, propostas e e-mails na memória da conta.</div>
                </div>
              </div>

              {mode === "manual" ? (
                <div className="form-grid">
                  <div className="ff span2"><label>Nome da empresa *</label><input value={form.nome} onChange={upd("nome")} placeholder="Ex.: Indústria Alfa" /></div>
                  <div className="ff span2"><label>Segmento</label><input value={form.segmento} onChange={upd("segmento")} placeholder="Ex.: Indústria de alimentos" /></div>
                  <div className="ff"><label>Cidade</label><input value={form.cidade} onChange={upd("cidade")} placeholder="Cidade" /></div>
                  <div className="ff"><label>UF</label><input value={form.uf} onChange={upd("uf")} maxLength={2} placeholder="UF" /></div>
                  <div className="ff span2"><label>Porte</label><input value={form.porte} onChange={upd("porte")} placeholder="Ex.: Média (≈ 300 func.)" /></div>
                  <div className="ff"><label>Contato — nome</label><input value={form.cNome} onChange={upd("cNome")} placeholder="Nome" /></div>
                  <div className="ff"><label>Contato — cargo</label><input value={form.cCargo} onChange={upd("cCargo")} placeholder="Cargo" /></div>
                  <div className="ff span2"><label>Contato — e-mail</label><input value={form.cEmail} onChange={upd("cEmail")} placeholder="email@empresa.com.br" /></div>
                  <div className="ff"><label>Site da empresa</label><input value={form.site} onChange={upd("site")} placeholder="empresa.com.br" /></div>
                  <div className="ff"><label>LinkedIn</label><input value={form.linkedin} onChange={upd("linkedin")} placeholder="linkedin.com/company/…" /></div>
                  <div className="ff span2"><label>Serviço / contexto de interesse</label><input value={form.servico} onChange={upd("servico")} placeholder="Ex.: Treinamento comercial" /></div>
                  {app.empresas.find(e => normName(e.nome) === normName(form.nome)) && form.nome && (
                    <div className="ex-note span2" style={{ margin: "4px 0 0" }}><span className="ic"><Icon.sparkles /></span><div>Já existe uma conta <b>{form.nome}</b> no Radar. Os dados serão <b>atualizados</b>, sem duplicar.</div></div>
                  )}
                  {amb && <div className="span2"><RefAlert info={amb} /></div>}
                </div>
              ) : (
                <React.Fragment>
                  {mode === "historico" && (
                    app.empresas.length === 0 ? (
                      <div className="ex-note" style={{ marginBottom: 0 }}><span className="ic"><Icon.alert /></span><div>Você ainda não tem contas no Radar. Importe a planilha ou cadastre uma empresa antes de anexar histórico.</div></div>
                    ) : (
                    <div className="field" style={{ marginBottom: 18 }}>
                      <span className="uplabel" style={{ display: "block", marginBottom: 7 }}>Vincular à conta</span>
                      <select className="select-native" value={alvoId} onChange={(e) => setAlvoId(e.target.value)}>
                        {app.empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                      </select>
                    </div>
                    )
                  )}
                  {!(mode === "historico" && app.empresas.length === 0) &&
                  <div className={"dropzone" + (drag ? " drag" : "")}
                       onClick={() => inputRef.current.click()}
                       onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                       onDragLeave={() => setDrag(false)} onDrop={onDrop}>
                    <div className="dz-ic"><Icon.upload /></div>
                    <div className="dz-t">Arraste um arquivo ou clique para selecionar</div>
                    <div className="dz-d">Não se prenda às colunas — pode variar a cada exportação.<br/>A IA lê o que estiver disponível.</div>
                    <div className="dz-formats">XLSX · CSV · PDF · DOCX · TXT · imagem</div>
                    <input ref={inputRef} type="file" style={{ display: "none" }} onChange={(e) => pickFile(e.target.files[0])} />
                  </div>}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {step === "ingest" && (
            <div className="ingest">
              <div className="ingest-file">
                <span className="fi"><Icon.sheet /></span>
                <div>
                  <div className="fn">{file.name}</div>
                  <div className="fm">{(file.size / 1024).toFixed(0)} KB · {mode === "empresa" ? "Cadastro de empresas" : "Histórico → " + (alvo ? alvo.nome : "")}</div>
                </div>
                <span className="spinner" style={{ marginLeft: "auto" }} />
              </div>
              {ingestSteps.map((s, i) => {
                const state = i < istep ? "done" : i === istep ? "active" : "wait";
                return (
                  <div key={i} className={"istep " + state}>
                    <span className="ico">{state === "done" ? <Icon.check /> : state === "active" ? <span className="spinner" style={{ width: 12, height: 12 }} /> : <span style={{ width: 5, height: 5, borderRadius: 9, background: "currentColor" }} />}</span>
                    <span className="lb">{s}</span>
                  </div>
                );
              })}
            </div>
          )}

          {step === "preview" && mode === "empresa" && (
            <React.Fragment>
              {parseErr ? (
                <div className="ref-alert"><div className="ra-head"><span className="ic"><Icon.alert /></span><span className="t">Não foi possível ler a planilha</span></div><div className="ra-desc">{parseErr}</div></div>
              ) : (
              <React.Fragment>
              <div className="uplabel" style={{ marginBottom: 10 }}>Empresas lidas da planilha</div>
              <div className="ex-note" style={{ marginTop: 0, marginBottom: 14 }}>
                <span className="ic"><Icon.sparkles /></span>
                <div><b>{(parsed || []).length} empresas</b> lidas de <b>{file.name}</b>. A origem de cada uma é registrada como <b>“Planilha”</b> (proveniência rastreável). Ainda sem sinais externos — rode o <b>Radar externo</b> depois para pontuar.</div>
              </div>
              <div className="extracted" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                {(parsed || []).map(s => (
                  <div className="ex-row" key={s.id}>
                    <div className="ek" style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="avatar" style={{ width: 24, height: 24, fontSize: 9, borderRadius: 6 }}>{s.iniciais}</span>{s.nome}</div>
                    <div className="ev">{s.segmento}{s.cidade !== "—" ? " · " + s.cidade + "/" + s.uf : ""}</div>
                  </div>
                ))}
              </div>
              </React.Fragment>
              )}
            </React.Fragment>
          )}

          {step === "preview" && mode === "historico" && (
            <React.Fragment>
              <div className="uplabel" style={{ marginBottom: 10 }}>Memória consolidada pelo Agente 2 · {alvo.nome}</div>
              <div className="extracted">
                <div className="ex-row"><div className="ek">Registros lidos</div><div className="ev">12 follow-ups, 1 proposta, 3 anotações</div></div>
                <div className="ex-row"><div className="ek">Já foi cliente?</div><div className="ev">{alvo.memoria.jaCliente ? "Sim" : "Não"}</div></div>
                <div className="ex-row"><div className="ek">Motivo de perda</div><div className="ev tag">{alvo.memoria.objecoes[0] || "—"}</div></div>
                <div className="ex-row"><div className="ek">Relacionamento</div><div className="ev">{alvo.memoria.relacionamento.nome}</div></div>
                <div className="ex-row"><div className="ek">Novos eventos</div><div className="ev">+1 entrada na linha do tempo</div></div>
              </div>
              <div className="ex-note">
                <span className="ic"><Icon.sparkles /></span>
                <div>Histórico anexado e consolidado na memória de <b>{alvo.nome}</b>. O resumo executivo e o score serão recalculados com o novo contexto.</div>
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="modal-foot">
          {step === "preview" ? (
            <React.Fragment>
              <button className="btn ghost" onClick={() => { setStep("upload"); setFile(null); setFileObj(null); setParsed(null); setParseErr(null); setFileRef({ site: "", linkedin: "" }); }}>Voltar</button>
              {!(mode === "empresa" && (parseErr || !(parsed && parsed.length))) &&
                <button className="btn primary" onClick={mode === "empresa" ? confirmEmpresa : confirmHistorico}>
                  <Icon.check />{mode === "empresa" ? "Importar " + (parsed ? parsed.length : 0) + " empresas" : "Confirmar atualização"}
                </button>}
            </React.Fragment>
          ) : mode === "manual" ? (
            <React.Fragment>
              <button className="btn ghost" onClick={app.closeModal}>Cancelar</button>
              <button className="btn primary" onClick={confirmManual}><Icon.plus />Cadastrar empresa</button>
            </React.Fragment>
          ) : (
            <button className="btn ghost" onClick={app.closeModal}>Cancelar</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Importar hub view ---------- */
function ImportarView() {
  const app = useApp();
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Adicionar e importar</h1>
          <div className="sub">Alimente o Radar a qualquer momento — por arquivo ou cadastro manual. O elo é sempre a empresa: contas existentes são atualizadas, não duplicadas.</div>
        </div>
        {app.empresas.length > 0 && (
          <div className="actions">
            <button className="btn danger" onClick={() => { if (confirm("Apagar TODOS os dados salvos neste navegador? As " + app.empresas.length + " contas e o histórico serão removidos. Isso não pode ser desfeito.")) { app.limparTudo(); app.pushToast("Dados locais apagados"); } }}><Icon.x />Limpar todos os dados</button>
          </div>
        )}
      </div>

      {app.persistencia ? (
        <div className="ex-note" style={{ marginBottom: 22 }}>
          <span className="ic"><Icon.shield /></span>
          <div><b>Seus dados ficam salvos neste navegador.</b> Tudo que você importar, cadastrar, rastrear ou validar permanece aqui mesmo se você fechar a aba ou recarregar — até migrarmos para a nuvem. (Salvo apenas neste computador/navegador; não sincroniza entre dispositivos ainda.)</div>
        </div>
      ) : (
        <div className="ex-note" style={{ marginBottom: 22, background: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.4)" }}>
          <span className="ic"><Icon.alert /></span>
          <div>Este navegador está com o armazenamento local bloqueado (ex.: aba anônima), então os dados <b>não serão salvos</b> ao recarregar.</div>
        </div>
      )}

      <div className="mode-toggle three" style={{ maxWidth: 980 }}>
        <div className="mode-card" onClick={() => app.openModal({ type: "import", mode: "empresa" })}>
          <div className="ic"><Icon.buildings /></div>
          <div className="t">Anexar lista de empresas</div>
          <div className="d">Suba uma lista ou ficha. O Agente 1 padroniza, identifica o que falta e cria a ficha.</div>
          <div className="btn primary sm" style={{ marginTop: 14 }}><Icon.upload />Anexar arquivo</div>
        </div>
        <div className="mode-card" onClick={() => app.openModal({ type: "import", mode: "manual" })}>
          <div className="ic"><Icon.plus /></div>
          <div className="t">Cadastro manual</div>
          <div className="d">Adicione uma empresa preenchendo os dados da conta e do contato.</div>
          <div className="btn primary sm" style={{ marginTop: 14 }}><Icon.plus />Cadastrar</div>
        </div>
        <div className="mode-card" onClick={() => app.openModal({ type: "import", mode: "historico" })}>
          <div className="ic"><Icon.history /></div>
          <div className="t">Anexar histórico</div>
          <div className="d">CRM, propostas, e-mails. O Agente 2 consolida na memória comercial da conta.</div>
          <div className="btn primary sm" style={{ marginTop: 14 }}><Icon.upload />Anexar arquivo</div>
        </div>
      </div>

      <div className="sec-head">
        <h2>Importações recentes</h2>
        <div className="rule" />
        <div className="count">{app.importacoes.length} arquivo(s)</div>
      </div>
      <div className="imp-list">
        {app.importacoes.map(im => (
          <div className="imp-item" key={im.id}>
            <span className="fi"><Icon.sheet /></span>
            <div>
              <div className="nm">{im.arquivo}</div>
              <div className="mt">{im.tipo} · {new Date(im.data + "T12:00:00").toLocaleDateString("pt-BR")}</div>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--tx-2)" }}>{im.registros} registro(s)</div>
            <div className="badge-ok"><Icon.check />{im.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ImportFlow = ImportFlow;
window.ImportarView = ImportarView;
