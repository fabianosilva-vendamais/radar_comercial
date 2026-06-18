/* xlsx-parse.js — leitura REAL de planilha (XLSX/CSV) no navegador.
   Sem dependências: descompacta o XLSX (zip) e lê sharedStrings + sheet.
   Expõe: window.parseSpreadsheet(file) e window.buildEmpresasFromSheet(headers, rows, fileName) */
(function () {
  async function inflateRaw(bytes) {
    const ds = new DecompressionStream("deflate-raw");
    const stream = new Response(new Blob([bytes])).body.pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  function readZip(buf) {
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    let eocd = -1;
    for (let i = buf.length - 22; i >= 0; i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
    if (eocd < 0) throw new Error("Arquivo não é um XLSX válido");
    const cdOffset = dv.getUint32(eocd + 16, true), cdCount = dv.getUint16(eocd + 10, true);
    let p = cdOffset; const entries = {};
    for (let i = 0; i < cdCount; i++) {
      const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lho = dv.getUint32(p + 42, true);
      const nm = new TextDecoder().decode(buf.slice(p + 46, p + 46 + nl));
      entries[nm] = { lho }; p += 46 + nl + el + cl;
    }
    return { dv, entries, buf };
  }
  async function entryBytes(zip, name) {
    const e = zip.entries[name]; if (!e) return null;
    const dv = zip.dv, lp = e.lho;
    const nl = dv.getUint16(lp + 26, true), el = dv.getUint16(lp + 28, true), method = dv.getUint16(lp + 8, true), cs = dv.getUint32(lp + 18, true);
    const ds = lp + 30 + nl + el; const raw = zip.buf.slice(ds, ds + cs);
    return method === 0 ? raw : await inflateRaw(raw);
  }
  function dx(s) { return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d)); }
  function parseShared(xml) {
    if (!xml) return [];
    const out = []; const re = /<si>([\s\S]*?)<\/si>/g; let m;
    while (m = re.exec(xml)) { const ts = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => dx(x[1])); out.push(ts.join("")); }
    return out;
  }
  function colToNum(ref) { const c = ref.match(/[A-Z]+/)[0]; let n = 0; for (const ch of c) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; }
  function parseSheet(xml, shared) {
    const rows = []; const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g; let rm;
    while (rm = rowRe.exec(xml)) {
      const cells = {};
      const cre = /<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g; let cm;
      while (cm = cre.exec(rm[1])) {
        const ref = cm[1], attrs = cm[2] || "", inner = cm[3] || "";
        const ci = colToNum(ref);
        const tM = attrs.match(/t="([^"]+)"/); const t = tM ? tM[1] : "";
        let val = "";
        if (t === "s") { const v = inner.match(/<v>([\s\S]*?)<\/v>/); if (v) val = shared[+v[1]] || ""; }
        else if (t === "inlineStr" || t === "str") { const is = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => dx(x[1])); val = is.length ? is.join("") : (inner.match(/<v>([\s\S]*?)<\/v>/) ? dx(inner.match(/<v>([\s\S]*?)<\/v>/)[1]) : ""); }
        else { const v = inner.match(/<v>([\s\S]*?)<\/v>/); if (v) val = dx(v[1]); }
        cells[ci] = val;
      }
      rows.push(cells);
    }
    return rows;
  }
  function parseCsvLine(l) {
    const out = []; let cur = "", q = false;
    for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '"') { if (q && l[i + 1] === '"') { cur += '"'; i++; } else q = !q; } else if ((ch === "," || ch === ";") && !q) { out.push(cur); cur = ""; } else cur += ch; }
    out.push(cur); return out;
  }
  async function parseSpreadsheet(file) {
    const name = (file.name || "").toLowerCase();
    const ab = await file.arrayBuffer();
    if (name.endsWith(".csv") || name.endsWith(".txt")) {
      const text = new TextDecoder().decode(new Uint8Array(ab));
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (!lines.length) return { headers: [], rows: [] };
      const headers = parseCsvLine(lines[0]).map(h => h.trim());
      const rows = lines.slice(1).map(l => { const a = parseCsvLine(l); const o = {}; headers.forEach((h, i) => o[i] = (a[i] || "").trim()); return o; });
      return { headers, rows };
    }
    const buf = new Uint8Array(ab);
    const zip = readZip(buf);
    const shared = parseShared(new TextDecoder().decode((await entryBytes(zip, "xl/sharedStrings.xml")) || new Uint8Array()));
    let sheetName = "xl/worksheets/sheet1.xml";
    if (!zip.entries[sheetName]) sheetName = Object.keys(zip.entries).find(n => /xl\/worksheets\/.*\.xml$/.test(n));
    const sheetXml = new TextDecoder().decode(await entryBytes(zip, sheetName));
    const grid = parseSheet(sheetXml, shared);
    if (!grid.length) return { headers: [], rows: [] };
    const maxCol = Math.max(0, ...grid.map(r => Math.max(0, ...Object.keys(r).map(Number))));
    const headers = []; for (let c = 0; c <= maxCol; c++) headers[c] = (grid[0][c] || "").trim();
    const rows = grid.slice(1).map(r => { const o = {}; for (let c = 0; c <= maxCol; c++) o[c] = r[c] || ""; return o; })
      .filter(r => Object.values(r).some(v => v && String(v).trim()));
    return { headers, rows };
  }

  /* ---- Mapeamento flexível das colunas → contas ---- */
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  function findCol(headers, ...keys) {
    for (let i = 0; i < headers.length; i++) { const h = norm(headers[i]); if (h && keys.some(k => h.includes(k))) return i; }
    return -1;
  }
  function ini(nome) {
    const w = (nome || "").replace(/[^A-Za-zÀ-ú ]/g, "").trim().split(/\s+/).filter(Boolean);
    if (!w.length) return "??";
    return ((w[0][0] || "") + (w[1] ? w[1][0] : (w[0][1] || ""))).toUpperCase();
  }
  const normId = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  function scoreFromMotivo(motivo, i) {
    const m = norm(motivo);
    let base = 40;
    if (/adia|posterg|2 semestre|segundo semestre|proximo ciclo|analise|orcament|budget|verba|aprov/.test(m)) base = 58;
    if (/sem budget|sem verba|sem orcament/.test(m)) base = 46;
    if (/prioridad|retorno/.test(m)) base = 36;
    if (/concorrent|outra proposta|fechou com|outro fornecedor/.test(m)) base = 26;
    return Math.max(8, Math.min(72, base + ((i * 7) % 9) - 4));
  }
  function buildEmpresasFromSheet(headers, rows, fileName) {
    const col = {
      empresa: findCol(headers, "empresa: nome", "empresa:nome", "empresa"),
      negocio: findCol(headers, "nome do negocio", "negocio"),
      resp: findCol(headers, "responsavel"),
      email: findCol(headers, "e-mail do contato", "email do contato", "e-mail", "email"),
      tel: findCol(headers, "telefone"),
      pNome: findCol(headers, "primeiro nome", "contato: primeiro"),
      sNome: findCol(headers, "sobrenome"),
      cargo: findCol(headers, "cargo"),
      industria: findCol(headers, "industria", "indústria", "segmento"),
      cidade: findCol(headers, "cidade"),
      estado: findCol(headers, "estado", "uf"),
      equipe: findCol(headers, "quantas pessoas", "equipe comercial"),
      servico: findCol(headers, "nome do servico oferecido", "servico oferecido", "serviço oferecido"),
      contexto: findCol(headers, "como funciona o negocio"),
      estrutura: findCol(headers, "como e a estrutura comercial", "estrutura comercial atual"),
      objetivo: findCol(headers, "por que o cliente nos procurou"),
      desafio: findCol(headers, "principal desafio"),
      prazo: findCol(headers, "prazo, evento ou pressao", "prazo", "evento ou pressao"),
      motivo: findCol(headers, "motivo de perda") ,
      motivoDesc: findCol(headers, "motivo de perda (descricao", "motivo de perda (descrição"),
    };
    // motivo: prefer the plain "motivo de perda" (not the descrição)
    let motivoCol = -1, motivoDescCol = -1;
    headers.forEach((h, i) => { const n = norm(h); if (n.includes("motivo de perda")) { if (n.includes("descri")) motivoDescCol = i; else motivoCol = i; } });
    if (motivoCol >= 0) col.motivo = motivoCol;
    if (motivoDescCol >= 0) col.motivoDesc = motivoDescCol;
    // follow-up description columns (timeline)
    const followCols = [];
    headers.forEach((h, i) => { const n = norm(h); if (/descricao.*follow|descricao.*negociac|descricao follow/.test(n)) followCols.push(i); });

    const get = (r, i) => (i >= 0 && r[i] != null ? String(r[i]).trim() : "");
    const out = []; const seen = new Set();
    rows.forEach((r, idx) => {
      const nome = get(r, col.empresa) || get(r, col.negocio);
      if (!nome) return;
      const id = "xls_" + (normId(nome) || idx);
      if (seen.has(id)) return; seen.add(id);
      const email = get(r, col.email);
      const cNome = [get(r, col.pNome), get(r, col.sNome)].filter(Boolean).join(" ") || (email ? email.split("@")[0] : "—");
      const cargo = get(r, col.cargo) || "—";
      const cidade = get(r, col.cidade) || "—";
      const uf = (get(r, col.estado) || "").toUpperCase();
      const segmento = get(r, col.industria) || "—";
      const servico = get(r, col.servico) || get(r, col.negocio) || "—";
      const resp = get(r, col.resp) || "—";
      const motivo = get(r, col.motivo) || "Não informado";
      const motivoDesc = get(r, col.motivoDesc);
      const contexto = get(r, col.contexto);
      const desafio = get(r, col.desafio);
      const prazo = get(r, col.prazo);
      const equipe = get(r, col.equipe);
      const dominio = email && /@/.test(email) && !/(gmail|hotmail|outlook|yahoo|bol|uol)/i.test(email) ? email.split("@")[1] : "";
      const score = scoreFromMotivo(motivo + " " + motivoDesc, idx);

      const timeline = [{ data: "2026", tipo: "Proposta", texto: "Proposta enviada em 2026" + (servico !== "—" ? " — " + servico + "." : ".") }];
      followCols.forEach(ci => { const v = get(r, ci); if (v) timeline.push({ data: "2026", tipo: "Follow-up", texto: v.length > 220 ? v.slice(0, 217) + "…" : v }); });
      timeline.push({ data: "2026", tipo: "Perda", texto: "Perda — " + motivo + (motivoDesc ? ": " + motivoDesc : "") });

      out.push({
        id, nome, iniciais: ini(nome), segmento,
        porte: equipe ? "Equipe comercial: " + equipe : "—",
        cidade, uf, site: dominio || "—", cnpj: "—",
        contato: { nome: cNome, cargo, email: email || "—" },
        responsavel: resp, servico,
        origem: "Importado · " + fileName, ultimoRastreio: null,
        proveniencia: { tipo: "planilha", arquivo: fileName, linha: idx + 2, nota: "Lida diretamente da sua planilha" },
        validacao: { status: "pendente" },
        score, resumoSinal: "Sem sinal externo ainda — proposta perdida (rode o Radar externo)",
        motivo: "Proposta perdida 2026 — " + motivo, novidade: "—",
        sinais: [],
        memoria: {
          jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · reabordável",
          resumoExecutivo: ("Proposta perdida em 2026. Motivo: " + motivo + (motivoDesc ? " — " + motivoDesc : "") + ". " + (contexto ? contexto.slice(0, 260) : "")).trim(),
          timeline,
          relacionamento: { nome: cNome, cargo, sentimento: "A requalificar" },
          dor: desafio || "A mapear a partir do histórico",
          objecoes: [motivo].filter(x => x && x !== "Não informado"),
          risco: prazo ? "Janela/prazo: " + prazo.slice(0, 120) : "Reavaliar com novo sinal",
          patrocinador: cNome !== "—" ? cNome : "A identificar",
        },
        intencao: {
          oQueMudou: "Conta importada da planilha; ainda sem sinal externo capturado.",
          porqueMudou: "—",
          indica: "Reabordável: já houve proposta. O score sobe quando o Radar externo capturar um sinal.",
          oportunidade: "Reconectar a perda de 2026 (" + motivo.toLowerCase() + ") a um novo gatilho de mercado.",
        },
        estrategia: {
          motivoAlerta: "Proposta perdida em 2026 (" + motivo + ") — reabordável.",
          contexto: (contexto ? contexto.slice(0, 200) : "Histórico importado da planilha.") + (prazo ? " Prazo/evento: " + prazo.slice(0, 120) : ""),
          angulo: "Retomar conectando o motivo da perda à dor atual. " + (desafio ? "Desafio mapeado: " + desafio.slice(0, 140) : ""),
          canal: score >= 55 ? "LinkedIn" : "E-mail",
          canaisAlt: ["LinkedIn", "E-mail", "WhatsApp"],
          mensagem: "Olá" + (cNome && cNome !== "—" ? ", " + cNome.split(" ")[0] : "") + "! Retomando nossa conversa de 2026 sobre " + (servico !== "—" ? servico.toLowerCase() : "o projeto comercial") + ". Faz sentido reavaliarmos agora? Tenho uma leitura nova que pode ajudar.",
          perguntas: ["O que mudou no time comercial desde nossa última conversa?", "O motivo que travou em 2026 (" + motivo.toLowerCase() + ") ainda se aplica?"],
          proximoPasso: "Rodar o Radar externo (Rastrear agora) para capturar sinais e priorizar a reabordagem.",
        },
      });
    });
    return out;
  }

  window.parseSpreadsheet = parseSpreadsheet;
  window.buildEmpresasFromSheet = buildEmpresasFromSheet;
})();
