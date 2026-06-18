/* export-doc.jsx — Geração de documento Word (.doc) formatado: battlecard consultivo
   com todos os dados do cliente + plano de reabordagem (metodologia JOLT). */

function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function docDate() { return new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

const FAIXA_HEX = { prioritaria: "#EA5333", boa: "#F5A623", monitorar: "#2E6E78", baixa: "#6B7480" };
function faixaInfo(score) { const f = faixaOf(score); return { label: f.label, cor: f.cor || FAIXA_HEX[f.id] || "#6B7480" }; }

function joltFallback(e) {
  const motivo = (e.memoria && e.memoria.objecoes && e.memoria.objecoes[0]) || e.motivo || "indefinição na decisão";
  return {
    julgar: "Trate o 'não' como INDECISÃO, não como falta de interesse. Houve proposta e vários follow-ups — sinal clássico de medo de errar a escolha (não de ausência de necessidade). Confirme o real motivo da paralisia antes de empurrar valor.",
    oferecer: "Pare de oferecer opções. Faça UMA recomendação assertiva: por onde começar, em quanto tempo e por quê. Indecisão se resolve com direção, não com mais alternativas.",
    limitar: "Antecipe a dúvida que travou a decisão (" + String(motivo).toLowerCase() + ") antes que o cliente peça 'tempo para analisar'. Entregue a resposta pronta, não mais material.",
    tirarRisco: "Desarme o risco da decisão: comece por uma fase/piloto menor, com critério de sucesso claro e ponto de saída definido. Reduza o custo de um 'sim' errado."
  };
}
function joltOf(e) {
  const j = e.estrategia && e.estrategia.jolt;
  if (j && (j.julgar || j.oferecer || j.limitar || j.tirarRisco)) return j;
  return joltFallback(e);
}

/* ---------- Corpo do documento (compartilhado entre preview e .doc) ---------- */
function buildEmpresaDocBody(e) {
  const m = e.memoria || {}, est = e.estrategia || {}, intc = e.intencao || {};
  const fi = faixaInfo(e.score);
  const jolt = joltOf(e);
  const ORANGE = "#EA5333", TEAL = "#1E4249", INK = "#1f2a33", MUT = "#5d6b78", LINE = "#e2e7ec", SOFT = "#f4f6f8";
  const H = [];

  // Cabeçalho de marca
  H.push('<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:18px;"><tr>' +
    '<td style="border-bottom:3px solid ' + TEAL + ';padding:0 0 12px 0;">' +
      '<span style="font-family:Arial;font-size:20pt;font-weight:bold;color:' + TEAL + ';">Venda</span>' +
      '<span style="font-family:Arial;font-size:20pt;font-weight:bold;color:' + ORANGE + ';">Mais</span>' +
      '<span style="font-family:Arial;font-size:9pt;color:' + MUT + ';">&nbsp;&nbsp;|&nbsp;&nbsp;RADAR COMERCIAL</span>' +
    '</td>' +
    '<td align="right" style="border-bottom:3px solid ' + TEAL + ';padding:0 0 12px 0;font-family:Arial;font-size:8pt;color:' + MUT + ';">PLANO DE REABORDAGEM CONSULTIVA<br/>Gerado em ' + docDate() + '</td>' +
  '</tr></table>');

  // Título da conta + score
  H.push('<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:16px;"><tr>' +
    '<td valign="top" style="font-family:Arial;">' +
      '<div style="font-size:19pt;font-weight:bold;color:' + INK + ';">' + esc(e.nome) + '</div>' +
      '<div style="font-size:10pt;color:' + MUT + ';margin-top:3px;">' + esc(e.segmento) + ' &nbsp;·&nbsp; ' + esc(e.cidade) + '/' + esc(e.uf) + ' &nbsp;·&nbsp; ' + esc(e.porte) + '</div>' +
    '</td>' +
    '<td align="right" valign="top" width="170">' +
      '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr><td style="background:' + fi.cor + ';padding:10px 16px;border-radius:8px;font-family:Arial;text-align:center;">' +
        '<div style="font-size:24pt;font-weight:bold;color:#ffffff;line-height:1;">' + e.score + '<span style="font-size:11pt;">/100</span></div>' +
        '<div style="font-size:8pt;color:#ffffff;letter-spacing:1px;margin-top:3px;">' + esc(fi.label).toUpperCase() + '</div>' +
      '</td></tr></table>' +
    '</td>' +
  '</tr></table>');

  function sectionTitle(txt) {
    return '<div style="font-family:Arial;font-size:11pt;font-weight:bold;color:' + TEAL + ';border-bottom:1px solid ' + LINE + ';padding-bottom:5px;margin:20px 0 10px 0;">' + esc(txt) + '</div>';
  }
  function kvTable(rows) {
    let s = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:10pt;">';
    rows.forEach(r => {
      if (r[1] == null || r[1] === "" || r[1] === "—") return;
      s += '<tr>' +
        '<td valign="top" width="170" style="padding:5px 12px 5px 0;color:' + MUT + ';">' + esc(r[0]) + '</td>' +
        '<td valign="top" style="padding:5px 0;color:' + INK + ';">' + esc(r[1]) + '</td></tr>';
    });
    return s + '</table>';
  }

  // 1. Identificação
  H.push(sectionTitle("Identificação da conta"));
  H.push(kvTable([
    ["Empresa", e.nome], ["Segmento", e.segmento], ["Localização", e.cidade + "/" + e.uf],
    ["Porte", e.porte], ["Serviço foco", e.servico], ["Responsável VendaMais", e.responsavel],
    ["Site", e.site], ["CNPJ", e.cnpj], ["Status", m.status],
  ]));

  // 2. Contato
  H.push(sectionTitle("Contato e relacionamento"));
  H.push(kvTable([
    ["Contato", e.contato.nome + (e.contato.cargo && e.contato.cargo !== "—" ? " — " + e.contato.cargo : "")],
    ["E-mail", e.contato.email],
    ["Relacionamento", m.relacionamento && m.relacionamento.sentimento],
    ["Patrocinador interno", m.patrocinador],
  ]));

  // 3. Memória comercial
  H.push(sectionTitle("Memória comercial"));
  if (m.resumoExecutivo) H.push('<div style="font-family:Arial;font-size:10pt;color:' + INK + ';line-height:1.5;border-left:3px solid ' + ORANGE + ';padding:2px 0 2px 12px;margin-bottom:10px;">' + esc(m.resumoExecutivo) + '</div>');
  if (m.timeline && m.timeline.length) {
    let t = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:9.5pt;">';
    m.timeline.forEach(x => {
      t += '<tr>' +
        '<td valign="top" width="90" style="padding:4px 10px 4px 0;color:' + ORANGE + ';font-weight:bold;">' + esc(x.data) + '</td>' +
        '<td valign="top" width="80" style="padding:4px 10px 4px 0;color:' + MUT + ';">' + esc(x.tipo) + '</td>' +
        '<td valign="top" style="padding:4px 0;color:' + INK + ';">' + esc(x.texto) + '</td></tr>';
    });
    H.push(t + '</table>');
  }

  // 4. Diagnóstico de indecisão
  H.push(sectionTitle("Por que ainda não fechou — diagnóstico"));
  const diag = est.diagnosticoIndecisao || ("Proposta perdida em 2026 (" + (m.objecoes && m.objecoes[0] ? m.objecoes[0] : "motivo não confirmado") + "). Após múltiplos follow-ups sem avanço, o padrão indica INDECISÃO (medo de tomar a decisão errada), não ausência de necessidade.");
  H.push('<div style="font-family:Arial;font-size:10pt;color:' + INK + ';line-height:1.5;">' + esc(diag) + '</div>');

  // 5. O INSIGHT (destaque)
  if (est.insight) {
    H.push('<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:16px 0;"><tr>' +
      '<td style="background:#fff4f0;border:1px solid #f4c4b4;border-left:4px solid ' + ORANGE + ';padding:14px 16px;font-family:Arial;">' +
      '<div style="font-size:8pt;font-weight:bold;color:' + ORANGE + ';letter-spacing:1px;margin-bottom:5px;">O INSIGHT — O ÂNGULO QUE AINDA NÃO FOI USADO</div>' +
      '<div style="font-size:11pt;color:' + INK + ';line-height:1.5;font-weight:bold;">' + esc(est.insight) + '</div>' +
      '</td></tr></table>');
  }

  // 6. Metodologia JOLT
  H.push(sectionTitle("Plano de reabordagem — metodologia JOLT (vencer a indecisão)"));
  const blocks = [
    ["J", "Julgar a indecisão", jolt.julgar, TEAL],
    ["O", "Oferecer recomendação", jolt.oferecer, ORANGE],
    ["L", "Limitar a exploração", jolt.limitar, TEAL],
    ["T", "Tirar o risco da mesa", jolt.tirarRisco, ORANGE],
  ];
  let jt = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;">';
  blocks.forEach(b => {
    jt += '<tr>' +
      '<td valign="top" width="46" style="padding:8px;"><div style="background:' + b[3] + ';color:#fff;font-size:16pt;font-weight:bold;text-align:center;width:34px;height:34px;line-height:34px;border-radius:6px;">' + b[0] + '</div></td>' +
      '<td valign="top" style="padding:8px 8px 8px 4px;border-bottom:1px solid ' + LINE + ';">' +
        '<div style="font-size:10.5pt;font-weight:bold;color:' + INK + ';">' + esc(b[1]) + '</div>' +
        '<div style="font-size:9.5pt;color:' + INK + ';line-height:1.5;margin-top:2px;">' + esc(b[2]) + '</div>' +
      '</td></tr>';
  });
  H.push(jt + '</table>');

  // 7. Leitura de intenção
  if (intc.oQueMudou || intc.oportunidade) {
    H.push(sectionTitle("Leitura de intenção"));
    H.push(kvTable([
      ["O que mudou", intc.oQueMudou], ["Por que mudou", intc.porqueMudou],
      ["O que indica", intc.indica], ["Oportunidade", intc.oportunidade],
    ]));
  }

  // 8. Sinais com fonte
  if (e.sinais && e.sinais.length) {
    H.push(sectionTitle("Sinais a confirmar (com fonte)"));
    let st = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:9.5pt;">';
    e.sinais.forEach(s => {
      const ref = signalRef(e, s);
      st += '<tr><td style="padding:6px 0;border-bottom:1px solid ' + LINE + ';color:' + INK + ';">' +
        '<b>' + esc(s.titulo) + '</b><br/>' +
        '<span style="color:' + MUT + ';">Fonte: ' + esc(s.fonte) + ' · ' + (s.ia ? "sugerido por IA — a verificar" : "a verificar") + '</span>' +
        (ref.url ? '<br/><span style="color:' + TEAL + ';">' + esc(ref.url) + '</span>' : '') +
        '</td></tr>';
    });
    H.push(st + '</table>');
  }

  // 9. Mensagem sugerida
  if (est.mensagem) {
    H.push(sectionTitle("Mensagem sugerida" + (est.canal && est.canal !== "—" ? " — canal: " + est.canal : "")));
    H.push('<div style="background:' + SOFT + ';border:1px solid ' + LINE + ';padding:12px 14px;font-family:Arial;font-size:10pt;color:' + INK + ';line-height:1.55;">' + esc(est.mensagem).replace(/\n/g, "<br/>") + '</div>');
  }

  // 10. Perguntas consultivas
  if (est.perguntas && est.perguntas.length) {
    H.push(sectionTitle("Perguntas consultivas"));
    let q = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:10pt;">';
    est.perguntas.forEach((x, i) => {
      q += '<tr><td valign="top" width="26" style="padding:4px 8px 4px 0;color:' + ORANGE + ';font-weight:bold;">' + (i + 1) + '.</td><td style="padding:4px 0;color:' + INK + ';">' + esc(x) + '</td></tr>';
    });
    H.push(q + '</table>');
  }

  // 11. Objeções antecipadas
  if (est.objecoes && est.objecoes.length) {
    H.push(sectionTitle("Objeções antecipadas — e como responder"));
    let o = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:9.5pt;border:1px solid ' + LINE + ';">';
    o += '<tr style="background:' + TEAL + ';color:#fff;"><td style="padding:6px 10px;font-weight:bold;" width="40%">Se o cliente disser…</td><td style="padding:6px 10px;font-weight:bold;">Resposta consultiva</td></tr>';
    est.objecoes.forEach((ob, i) => {
      const oo = typeof ob === "string" ? { objecao: ob, resposta: "" } : ob;
      o += '<tr style="background:' + (i % 2 ? "#ffffff" : SOFT) + ';">' +
        '<td valign="top" style="padding:7px 10px;border-top:1px solid ' + LINE + ';color:' + INK + ';">' + esc(oo.objecao) + '</td>' +
        '<td valign="top" style="padding:7px 10px;border-top:1px solid ' + LINE + ';color:' + INK + ';">' + esc(oo.resposta) + '</td></tr>';
    });
    H.push(o + '</table>');
  }

  // 12. Próximo passo
  if (est.proximoPasso) {
    H.push('<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:18px 0 6px;"><tr>' +
      '<td style="background:' + TEAL + ';padding:12px 16px;font-family:Arial;">' +
      '<span style="font-size:8pt;color:#9fc3c9;letter-spacing:1px;">PRÓXIMO PASSO</span><br/>' +
      '<span style="font-size:11pt;color:#ffffff;font-weight:bold;">' + esc(est.proximoPasso) + '</span>' +
      '</td></tr></table>');
  }

  // Rodapé
  H.push('<div style="font-family:Arial;font-size:8pt;color:' + MUT + ';margin-top:14px;border-top:1px solid ' + LINE + ';padding-top:8px;">' +
    'Radar Comercial · VendaMais — inteligência comercial assistida por IA. Sinais marcados como "a verificar" devem ser confirmados na fonte antes da abordagem. Metodologia JOLT (The JOLT Effect) aplicada a contas em indecisão.' +
    '</div>');

  return H.join("\n");
}

function wordWrap(title, bodyHtml) {
  return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8"/><title>' + esc(title) + '</title>' +
    '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->' +
    '<style>@page{size:21cm 29.7cm;margin:1.6cm 1.8cm;} body{font-family:Arial,sans-serif;color:#1f2a33;}</style></head>' +
    '<body>' + bodyHtml + '</body></html>';
}

function buildEmpresaDocHTML(e) { return wordWrap("Plano de Reabordagem — " + e.nome, buildEmpresaDocBody(e)); }

const FAIXA_FILTROS = [
  { id: "todas", label: "Todas as categorias" },
  { id: "prioritaria", label: "Abordagem prioritária" },
  { id: "boa", label: "Boa oportunidade" },
  { id: "monitorar", label: "Monitorar" },
  { id: "baixa", label: "Baixa prioridade" },
];
function ordenarEmpresas(arr) {
  return arr.slice().sort((a, b) => (b.score - a.score) || a.nome.localeCompare(b.nome, "pt-BR"));
}
function filtrarRadar(empresas, opts) {
  opts = opts || {};
  let l = empresas.slice();
  if (opts.faixa && opts.faixa !== "todas") l = l.filter(e => faixaOf(e.score).id === opts.faixa);
  if (opts.vendedor && opts.vendedor !== "todos") l = l.filter(e => (e.responsavel || "Sem responsável") === opts.vendedor);
  return l;
}
function vendedoresDe(empresas) {
  const set = {};
  empresas.forEach(e => { const v = e.responsavel || "Sem responsável"; set[v] = (set[v] || 0) + 1; });
  return Object.keys(set).sort((a, b) => a.localeCompare(b, "pt-BR")).map(v => ({ nome: v, n: set[v] }));
}

function buildRadarDocBody(empresas, hoje, opts) {
  opts = opts || {};
  const ORANGE = "#EA5333", TEAL = "#1E4249", INK = "#1f2a33", MUT = "#5d6b78", LINE = "#e2e7ec";
  const data = new Date(hoje + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const lista = filtrarRadar(empresas, opts);
  const faixaLab = (FAIXA_FILTROS.find(f => f.id === (opts.faixa || "todas")) || FAIXA_FILTROS[0]).label;

  // agrupar por vendedor responsável
  const grupos = {};
  lista.forEach(e => { const v = e.responsavel || "Sem responsável"; (grupos[v] = grupos[v] || []).push(e); });
  const nomesVend = Object.keys(grupos).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const H = [];
  H.push('<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:14px;"><tr>' +
    '<td style="border-bottom:3px solid ' + TEAL + ';padding:0 0 10px 0;">' +
      '<span style="font-family:Arial;font-size:18pt;font-weight:bold;color:' + TEAL + ';">Venda</span><span style="font-family:Arial;font-size:18pt;font-weight:bold;color:' + ORANGE + ';">Mais</span>' +
      '<span style="font-family:Arial;font-size:9pt;color:' + MUT + ';">&nbsp;&nbsp;|&nbsp;&nbsp;RADAR DO DIA</span></td>' +
    '<td align="right" style="border-bottom:3px solid ' + TEAL + ';padding:0 0 10px 0;font-family:Arial;font-size:8pt;color:' + MUT + ';">' + esc(data) + '</td></tr></table>');
  H.push('<div style="font-family:Arial;font-size:14pt;font-weight:bold;color:' + INK + ';margin-bottom:3px;">Quem abordar — por vendedor responsável</div>');
  H.push('<div style="font-family:Arial;font-size:9pt;color:' + MUT + ';margin-bottom:14px;">Categoria: ' + esc(faixaLab) +
    (opts.vendedor && opts.vendedor !== "todos" ? ' &nbsp;·&nbsp; Vendedor: ' + esc(opts.vendedor) : '') +
    ' &nbsp;·&nbsp; ' + lista.length + ' conta(s) &nbsp;·&nbsp; ordem: maior &rarr; menor score (empate por ordem alfabética)</div>');

  if (!lista.length) {
    H.push('<div style="font-family:Arial;font-size:10pt;color:' + MUT + ';padding:12px 0;">Nenhuma conta nos filtros selecionados.</div>');
    return H.join("\n");
  }

  nomesVend.forEach(vend => {
    const arr = ordenarEmpresas(grupos[vend]);
    H.push('<div style="font-family:Arial;font-size:11pt;font-weight:bold;color:#ffffff;background:' + TEAL + ';padding:7px 12px;margin:16px 0 0 0;">' +
      esc(vend) + ' <span style="font-weight:normal;color:#9fc3c9;font-size:9pt;">· ' + arr.length + ' conta(s)</span></div>');
    let t = '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial;font-size:9.5pt;border:1px solid ' + LINE + ';">';
    t += '<tr style="background:#eef1f4;color:' + INK + ';"><td style="padding:5px 8px;font-weight:bold;" width="26">#</td><td style="padding:5px 8px;font-weight:bold;">Empresa</td><td style="padding:5px 8px;font-weight:bold;" width="46">Score</td><td style="padding:5px 8px;font-weight:bold;" width="120">Categoria</td><td style="padding:5px 8px;font-weight:bold;">Próximo passo</td></tr>';
    arr.forEach((e, i) => {
      const fi = faixaInfo(e.score);
      t += '<tr style="background:' + (i % 2 ? "#ffffff" : "#f7f9fa") + ';">' +
        '<td valign="top" style="padding:6px 8px;border-top:1px solid ' + LINE + ';color:' + MUT + ';">' + (i + 1) + '</td>' +
        '<td valign="top" style="padding:6px 8px;border-top:1px solid ' + LINE + ';color:' + INK + ';"><b>' + esc(e.nome) + '</b><br/><span style="color:' + MUT + ';">' + esc(e.segmento) + ' · ' + esc(e.cidade) + '/' + esc(e.uf) + '</span></td>' +
        '<td valign="top" style="padding:6px 8px;border-top:1px solid ' + LINE + ';color:' + fi.cor + ';font-weight:bold;">' + e.score + '</td>' +
        '<td valign="top" style="padding:6px 8px;border-top:1px solid ' + LINE + ';color:' + fi.cor + ';">' + esc(fi.label) + '</td>' +
        '<td valign="top" style="padding:6px 8px;border-top:1px solid ' + LINE + ';color:' + INK + ';">' + esc(e.estrategia && e.estrategia.proximoPasso || "") + '</td></tr>';
    });
    H.push(t + '</table>');
  });

  // Dossiês completos por empresa (todos os menus), agrupados por vendedor, 1 por página
  const PB = '<br clear="all" style="mso-special-character:line-break;page-break-before:always" />';
  H.push(PB + '<div style="font-family:Arial;font-size:13pt;font-weight:bold;color:' + TEAL + ';border-bottom:2px solid ' + TEAL + ';padding-bottom:6px;margin-bottom:4px;">Dossiês completos por empresa</div>' +
    '<div style="font-family:Arial;font-size:9pt;color:' + MUT + ';margin-bottom:6px;">Cada empresa em uma página, com dados, contato, memória, sinais e estratégia (JOLT).</div>');
  nomesVend.forEach(vend => {
    const arr = ordenarEmpresas(grupos[vend]);
    arr.forEach(e => {
      H.push(PB + '<div style="font-family:Arial;font-size:9pt;color:' + MUT + ';margin-bottom:6px;">Vendedor responsável: <b style="color:' + INK + ';">' + esc(vend) + '</b></div>');
      H.push(buildEmpresaDocBody(e));
    });
  });

  H.push(PB + '<div style="font-family:Arial;font-size:8pt;color:' + MUT + ';margin-top:14px;">Gerado pelo Radar Comercial · VendaMais em ' + docDate() + '</div>');
  return H.join("\n");
}
function buildRadarDocHTML(empresas, hoje, opts) { return wordWrap("Radar do dia — VendaMais", buildRadarDocBody(empresas, hoje, opts)); }

function downloadDoc(filename, html) {
  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

Object.assign(window, { buildEmpresaDocBody, buildEmpresaDocHTML, buildRadarDocBody, buildRadarDocHTML, downloadDoc, joltOf, joltFallback, FAIXA_FILTROS, filtrarRadar, vendedoresDe, ordenarEmpresas });
