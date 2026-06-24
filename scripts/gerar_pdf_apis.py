"""Gera o PDF de APIs Pagas Pendentes usando fontes Arial do sistema macOS."""
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "docs" / "APIs Pagas Pendentes - Radar Comercial.pdf"

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
F_REG  = str(FONT_DIR / "Arial.ttf")
F_BOLD = str(FONT_DIR / "Arial Bold.ttf")
F_ITA  = str(FONT_DIR / "Arial Italic.ttf")

LARANJA     = (234, 83, 51)
VERDE_ESC   = (30, 66, 73)
CINZA       = (93, 107, 120)
BRANCO      = (255, 255, 255)
FUNDO       = (246, 247, 249)
LINHA       = (229, 233, 238)
VERDE_OK    = (31, 138, 91)
AMARELO     = (185, 119, 10)
VERMELHO    = (180, 30, 30)
AZUL_NOTA   = (30, 80, 160)
AZUL_FUNDO  = (234, 243, 255)


class PDF(FPDF):
    def header(self):
        self.set_fill_color(*VERDE_ESC)
        self.rect(0, 0, 210, 18, "F")
        self.set_text_color(*BRANCO)
        self.set_font("bold", size=11)
        self.set_xy(10, 4)
        self.cell(0, 10, "VendaMais  ·  Radar Comercial", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def footer(self):
        self.set_y(-14)
        self.set_font("regular", size=8)
        self.set_text_color(*CINZA)
        self.cell(0, 10,
            f"Página {self.page_no()}  ·  Valores aproximados — confirme nos sites oficiais  ·  Jun/2026",
            align="C")

    def _r(self, txt):
        """Garante string limpa."""
        return str(txt) if txt is not None else ""

    def titulo_principal(self, texto, subtexto=""):
        self.ln(4)
        self.set_font("bold", size=18)
        self.set_text_color(*VERDE_ESC)
        self.multi_cell(0, 9, self._r(texto), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        if subtexto:
            self.set_font("regular", size=10)
            self.set_text_color(*CINZA)
            self.cell(0, 6, self._r(subtexto), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def secao(self, numero, titulo):
        self.ln(5)
        self.set_fill_color(*FUNDO)
        self.rect(10, self.get_y(), 190, 10, "F")
        self.set_font("bold", size=11)
        self.set_text_color(*LARANJA)
        self.set_x(12)
        self.cell(12, 10, f"{numero:02d}", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_text_color(*VERDE_ESC)
        self.cell(0, 10, self._r(titulo), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def tabela_status(self, linhas):
        colunas = [80, 62, 48]
        headers = ["API", "Status", "Tipo"]
        self.set_fill_color(*VERDE_ESC)
        self.set_text_color(*BRANCO)
        self.set_font("bold", size=9)
        self.set_x(10)
        for i, h in enumerate(headers):
            self.cell(colunas[i], 8, f"  {h}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.ln()
        self.set_font("regular", size=9)
        for j, linha in enumerate(linhas):
            bg = BRANCO if j % 2 == 0 else (248, 249, 251)
            self.set_fill_color(*bg)
            self.set_text_color(*VERDE_ESC)
            self.set_x(10)
            for i, cel in enumerate(linha):
                self.cell(colunas[i], 7, f"  {self._r(cel)}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.ln()
        self.ln(3)

    def card_api(self, numero, nome, para_que, por_que, site, planos, recomendacao):
        if self.get_y() > 228:
            self.add_page()
        y0 = self.get_y()
        self.set_fill_color(*FUNDO)
        self.rect(10, y0, 190, 8, "F")
        self.set_font("bold", size=10)
        self.set_text_color(*LARANJA)
        self.set_xy(12, y0)
        self.cell(8, 8, str(numero), new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_text_color(*VERDE_ESC)
        self.cell(130, 8, self._r(nome), new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("regular", size=8)
        self.set_text_color(*CINZA)
        self.cell(0, 8, self._r(site), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self.set_x(12)
        self.set_font("bold", size=9)
        self.set_text_color(*VERDE_ESC)
        self.cell(22, 6, "Para que:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("regular", size=9)
        self.multi_cell(166, 6, self._r(para_que), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self.set_x(12)
        self.set_font("bold", size=9)
        self.cell(22, 6, "Por que:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("regular", size=9)
        self.multi_cell(166, 6, self._r(por_que), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self.ln(2)
        cols = [55, 45, 45, 45]
        self.set_fill_color(*VERDE_ESC)
        self.set_text_color(*BRANCO)
        self.set_font("bold", size=8)
        self.set_x(12)
        for h in ["Plano", "Detalhe", "USD/mes", "BRL/mes"]:
            self.cell(cols[0] if h == "Plano" else cols[1], 6, f"  {h}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.ln()
        self.set_font("regular", size=8)
        for k, p in enumerate(planos):
            bg = BRANCO if k % 2 == 0 else (248, 249, 251)
            self.set_fill_color(*bg)
            self.set_text_color(*VERDE_ESC)
            self.set_x(12)
            for i, cel in enumerate(p):
                self.cell(cols[i], 6, f"  {self._r(cel)}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.ln()

        self.ln(2)
        self.set_x(12)
        self.set_fill_color(*AZUL_FUNDO)
        self.set_font("bold", size=8)
        self.set_text_color(*AZUL_NOTA)
        self.cell(28, 5, "Recomendacao:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("regular", size=8)
        self.multi_cell(160, 5, self._r(recomendacao), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(4)

    def tabela_prioridade(self, linhas):
        colunas = [10, 55, 42, 38, 55]
        headers = ["", "API", "BRL min./mes", "USD/mes", "O que desbloqueia"]
        cores = [VERMELHO, (200, 100, 20), AMARELO, VERDE_OK, CINZA]
        self.set_fill_color(*VERDE_ESC)
        self.set_text_color(*BRANCO)
        self.set_font("bold", size=8)
        self.set_x(10)
        for i, h in enumerate(headers):
            self.cell(colunas[i], 7, f"  {h}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.ln()
        self.set_font("regular", size=8)
        for j, linha in enumerate(linhas):
            bg = BRANCO if j % 2 == 0 else (248, 249, 251)
            self.set_x(10)
            self.set_fill_color(*cores[j])
            self.cell(colunas[0], 7, "", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.set_fill_color(*bg)
            self.set_text_color(*VERDE_ESC)
            for i, cel in enumerate(linha):
                self.cell(colunas[i + 1], 7, f"  {self._r(cel)}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.ln()
        self.ln(4)

    def tabela_cenarios(self, linhas):
        colunas = [40, 92, 58]
        headers = ["Cenario", "APIs incluidas", "Custo BRL/mes"]
        self.set_fill_color(*VERDE_ESC)
        self.set_text_color(*BRANCO)
        self.set_font("bold", size=9)
        self.set_x(10)
        for i, h in enumerate(headers):
            self.cell(colunas[i], 8, f"  {h}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.ln()
        self.set_font("regular", size=9)
        for j, linha in enumerate(linhas):
            bg = BRANCO if j % 2 == 0 else (248, 249, 251)
            self.set_fill_color(*bg)
            self.set_text_color(*VERDE_ESC)
            self.set_x(10)
            for i, cel in enumerate(linha):
                self.cell(colunas[i], 8, f"  {self._r(cel)}", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.ln()
        self.ln(4)


# ── Instância e fontes ───────────────────────────────────────────────────────
pdf = PDF()
pdf.add_font("regular", style="", fname=F_REG)
pdf.add_font("bold",    style="", fname=F_BOLD)
pdf.add_font("italic",  style="", fname=F_ITA)
pdf.set_margins(10, 22, 10)
pdf.set_auto_page_break(auto=True, margin=18)
pdf.add_page()

# ── Capa / título ────────────────────────────────────────────────────────────
pdf.titulo_principal(
    "APIs Pagas — Pendentes de Contratação",
    "Radar Comercial  ·  VendaMais  ·  Jun/2026  ·  Cotação referência: US$ 1 ≈ R$ 5,70"
)

# ── 1. Situação atual ────────────────────────────────────────────────────────
pdf.secao(1, "Situação Atual das Integrações")
pdf.tabela_status([
    ["OpenAI (gpt-4o-mini)",            "[ATIVA]          ",            "Paga por uso"],
    ["GNews",                           "[ATIVA]          ",            "Freemium (100 req/dia grátis)"],
    ["BrasilAPI",                       "[ATIVA]          ",            "100% Gratuita"],
    ["CNPJá (lookup por CNPJ)",         "[ATIVA]          ",            "Freemium"],
    ["InfoJobs Brasil",                 "[AGUARDANDO]     ",            "Freemium"],
    ["SerpAPI",                         "[NAO CONTRATADA] ",            "PAGA"],
    ["Proxycurl (LinkedIn)",            "[NAO CONTRATADA] ",            "PAGA"],
    ["Apollo.io",                       "[NAO CONTRATADA] ",            "PAGA"],
    ["Clearbit",                        "[NAO CONTRATADA] ",            "PAGO"],
    ["Casa dos Dados",                  "[NAO CONTRATADA] ",            "PAGO"],
    ["CNPJá Premium (busca por nome)",  "[NAO CONTRATADA] ",            "PAGO"],
])

# ── 2. Detalhamento ──────────────────────────────────────────────────────────
pdf.secao(2, "Detalhamento das APIs Pagas")

pdf.card_api(
    1, "SerpAPI — Vagas + Notícias",
    "Agrega vagas do Google Jobs (LinkedIn, Indeed, Gupy, Catho) e notícias do Google News com alta cobertura BR.",
    "É a melhor fonte de vagas de SDR/Gerente Comercial — o sinal mais forte de expansão do time de vendas. Uma busca captura várias plataformas de uma vez.",
    "serpapi.com",
    [
        ["Free",      "100 buscas/mês",     "Grátis",      "Grátis"],
        ["Hobby",     "5.000 buscas/mês",   "US$ 50/mês",  "~R$ 285/mês"],
        ["Business",  "15.000 buscas/mês",  "US$ 130/mês", "~R$ 741/mês"],
    ],
    "Plano Hobby (R$ 285/mês). Com 67 contas × 2 buscas = ~134 req/mês — cabe folgado no plano."
)

pdf.card_api(
    2, "Proxycurl — LinkedIn (executivos, headcount)",
    "Acessa dados do LinkedIn de forma legalizada: perfis de executivos, mudanças de cargo, headcount da empresa e vagas LinkedIn.",
    "Detecta 'novo diretor comercial' — o gatilho mais valioso de reabordagem. Mudança de liderança comercial = janela de oportunidade.",
    "nubela.co/proxycurl",
    [
        ["Pay-as-you-go",  "Mín. US$ 10 (1.000 créditos)",  "US$ 0,01/crédito",  "~R$ 0,057/crédito"],
        ["Mensal",         "~3.000 créditos/mês",            "US$ 49/mês",         "~R$ 279/mês"],
        ["Avançado",       "~10.000 créditos/mês",           "US$ 149/mês",        "~R$ 849/mês"],
    ],
    "Comece pay-as-you-go. 67 contas × 1 consulta = 67 créditos = ~R$ 4/mês. Muito barato para piloto."
)

pdf.card_api(
    3, "Apollo.io — Dados B2B + Contatos + Intent Data",
    "Firmográfico completo (porte, receita estimada, tecnologias usadas), contatos com e-mail e telefone, e sinais de intenção de compra.",
    "Entrega o contato certo (nome + e-mail do decisor) sem pesquisa manual. Também indica empresas pesquisando ativamente por soluções como a sua.",
    "apollo.io",
    [
        ["Free",          "50 exports/mês",          "Grátis",      "Grátis"],
        ["Basic",         "Ilimitado (com limites)",  "US$ 49/mês",  "~R$ 279/mês"],
        ["Professional",  "Ilimitado + intent data",  "US$ 99/mês",  "~R$ 564/mês"],
    ],
    "O plano Free (50 exports) pode ser suficiente para uma primeira rodada com as 67 contas."
)

pdf.card_api(
    4, "Clearbit — Enriquecimento Firmográfico por Domínio",
    "Preenche a ficha da empresa automaticamente a partir do site/domínio: porte, setor, receita estimada, número de funcionários e tecnologias usadas.",
    "Elimina preenchimento manual para novas contas importadas da planilha. Integra direto com o pipeline de importação.",
    "clearbit.com (agora no HubSpot)",
    [
        ["Startup",  "Até 1.000 enriquecimentos",  "US$ 99/mês",   "~R$ 564/mês"],
        ["Growth",   "Até 5.000",                   "US$ 199/mês",  "~R$ 1.134/mês"],
    ],
    "Clearbit foi adquirido pelo HubSpot. Verifique disponibilidade standalone antes de contratar."
)

pdf.card_api(
    5, "Casa dos Dados — Busca por Nome/CNAE/Região (BR)",
    "Única opção nacional para buscar CNPJ a partir do nome da empresa + filtros (cidade, CNAE, porte). Cobra em reais.",
    "Sem isso, empresas importadas sem CNPJ não passam pelo BrasilAPI nem pelo CNPJá. Resolve o problema crítico das contas sem CNPJ na planilha.",
    "casadosdados.com.br",
    [
        ["Starter",   "500 consultas/mês",    "—",  "R$ 99/mês"],
        ["Pro",       "2.000 consultas/mês",  "—",  "R$ 249/mês"],
        ["Business",  "10.000 consultas/mês", "—",  "R$ 499/mês"],
    ],
    "Starter (R$ 99/mês). 67 contas × 1 resolução = 67 consultas — cabe folgado. Cobra em reais, sem variação cambial."
)

pdf.card_api(
    6, "CNPJá Premium — Busca por Nome + Monitor de Alterações",
    "Versão paga do CNPJá que permite buscar CNPJ pelo nome da empresa e receber alertas de alteração cadastral (nova filial, mudança societária, alteração de capital).",
    "Alternativa nacional ao Casa dos Dados + monitor de mudanças em tempo real. Dois problemas resolvidos com um produto.",
    "cnpja.com",
    [
        ["Startup",   "10.000 consultas/mês",  "—",  "R$ 89/mês"],
        ["Business",  "50.000 consultas/mês",  "—",  "R$ 249/mês"],
    ],
    "Startup (R$ 89/mês). Resolve nome → CNPJ E entrega alertas de alteração cadastral. Mais barato que Casa dos Dados."
)

# ── 3. Prioridade ────────────────────────────────────────────────────────────
pdf.add_page()
pdf.secao(3, "Resumo por Prioridade de Contratação")
pdf.tabela_prioridade([
    ["CNPJá Premium  ou  Casa dos Dados",  "R$ 89–99/mês",    "—",               "Resolve CNPJ de contas sem cadastro"],
    ["SerpAPI (Google Jobs + News)",        "R$ 285/mês",      "US$ 50/mês",      "Vagas reais: LinkedIn, Gupy, Indeed"],
    ["Proxycurl (LinkedIn)",                "R$ ~4/mês",       "US$ 0,01/créd.",  "Movimentação executiva"],
    ["Apollo.io",                           "Grátis (50/mês)", "Grátis",          "Contatos + firmográfico básico"],
    ["Clearbit",                            "R$ 564/mês",      "US$ 99/mês",      "Enriquecimento automático por domínio"],
])

# ── 4. Cenários ──────────────────────────────────────────────────────────────
pdf.secao(4, "Custo Estimado por Cenário (67 contas)")
pdf.tabela_cenarios([
    ["Mínimo (hoje)",    "OpenAI + GNews + BrasilAPI + CNPJá",              "~R$ 15–30/mês"],
    ["Recomendado",      "+ CNPJá Premium + SerpAPI + Proxycurl (pay-as-u)","~R$ 385–400/mês"],
    ["Intermediário",    "+ Apollo.io Basic",                               "~R$ 665–680/mês"],
    ["Completo",         "+ Clearbit Startup",                              "~R$ 1.000–1.200/mês"],
])

# ── Nota de rodapé final ─────────────────────────────────────────────────────
pdf.set_font("italic", size=8)
pdf.set_text_color(*CINZA)
pdf.set_x(12)
pdf.multi_cell(
    186, 5,
    "Valores aproximados com base nos planos publicados em jun/2026. Cotação de referência: US$ 1 = R$ 5,70. "
    "Confirme preços, limites e disponibilidade diretamente nos sites oficiais antes de contratar. "
    "Planos e preços podem mudar sem aviso prévio.",
    new_x=XPos.LMARGIN, new_y=YPos.NEXT
)

pdf.output(str(OUT))
print(f"PDF gerado com sucesso: {OUT}")
