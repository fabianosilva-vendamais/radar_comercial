/* Radar Comercial — dados (VendaMais)
   Base real: importada de "Propostas perdidas em 2026.xlsx".
   Cada conta é uma proposta perdida em 2026 que o Radar volta a monitorar,
   cruzando a memória comercial (histórico real) com sinais externos novos
   para indicar o momento de reabordar. */

window.RADAR_DATA = {
  hoje: "2026-06-04",
  vendedor: { nome: "Equipe Comercial", empresa: "VendaMais", iniciais: "VM" },

  faixas: [
    { id: "prioritaria", min: 81, max: 100, label: "Abordagem prioritária", cor: "#EA5333" },
    { id: "boa",         min: 61, max: 80,  label: "Boa oportunidade",      cor: "#F5A623" },
    { id: "monitorar",   min: 31, max: 60,  label: "Monitorar",             cor: "#4F9DB0" },
    { id: "baixa",       min: 0,  max: 30,  label: "Baixa prioridade",      cor: "#6B7480" },
  ],

  importacoes: [],

  empresas: [
    {
      id: "ourofino",
      nome: "Águas Ouro Fino",
      iniciais: "OF",
      segmento: "Indústria de bebidas (água mineral)",
      porte: "Média (≈ 120 func.)",
      cidade: "Campo Largo", uf: "PR",
      site: "aguasourofino.com.br",
      cnpj: "—",
      contato: { nome: "João Henrique", cargo: "Financeiro / Decisor: Diretor Brian", email: "joao.fracaro@aguasourofino.com.br" },
      responsavel: "Eryclys Freire",
      servico: "Aceleração Comercial (Consultoria)",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 89,
      resumoSinal: "Novo Gerente Nacional (ex-Ambev) sob pressão por resultado no 2º semestre",
      motivo: "Proposta de 80–250k engavetada por verba; dor de execução continua aguda",
      novidade: "Pressão da diretoria por virada comercial",
      sinais: [
        { tipo: "Movimentação executiva", titulo: "Gerente Nacional de Vendas recém-chegado ainda sem impacto", fonte: "LinkedIn", data: "2026-05-29", relevancia: 88, resumo: "Gestor vindo da Ambev assumiu em out/2025; diretoria cobra resultado da nova liderança." },
        { tipo: "Movimentações estratégicas", titulo: "Grupo Condor reforça metas de expansão no Sul", fonte: "Portal setorial", data: "2026-05-20", relevancia: 74, resumo: "Holding pressiona crescimento em PR/SC/RS — território com potencial ainda não capturado." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · reabordável",
        resumoExecutivo: "A Ouro Fino (Grupo Condor) recebeu proposta de consultoria de aceleração comercial (potencial 80–250k). O diagnóstico apontou que o problema não é método — KPIs, RFM e app de vendas já existem — mas execução e liderança comercial. A proposta não avançou: a diretoria reconheceu a urgência, porém o conselho não liberou verba. A dor permanece intacta.",
        timeline: [
          { data: "Fev 2026", tipo: "Diagnóstico", texto: "Diagnóstico comercial profundo: dependência do time interno, baixa execução externa, cultura de justificativas." },
          { data: "Mar 2026", tipo: "Proposta", texto: "Proposta de Aceleração Comercial em 3 fases (Diagnóstico → Reestruturação → Aceleração)." },
          { data: "Abr 2026", tipo: "Follow-up", texto: "Follow agressivo por e-mail ao João: 'avançar agora, adiar e perder faturamento, ou aceitar o nível atual'." },
          { data: "Mai 2026", tipo: "Perda", texto: "Tudo indica que o problema é budget, não aceitação. Conselho não aprovou o investimento." },
        ],
        relacionamento: { nome: "João Henrique", cargo: "Financeiro (ponte) · Diretor Brian decide", sentimento: "Aberto, sem verba no momento" },
        dor: "Baixa execução do time externo, dependência do diretor e cultura de justificativas",
        objecoes: ["Conselho não liberou budget", "Decisão concentrada no diretor"],
        risco: "Decisão refém do conselho; gerente nacional ainda se provando",
        patrocinador: "Diretor Brian (alto senso de urgência por resultado)",
      },
      intencao: {
        oQueMudou: "O 2º semestre se aproxima com o novo Gerente Nacional ainda sem entregar resultado.",
        porqueMudou: "A pressão por performance e a chegada da baixa estação (inverno) elevam a urgência.",
        indica: "Janela para reabrir a consultoria ancorando em execução e liderança, não em método.",
        oportunidade: "Reposicionar como projeto de execução comercial — começar pela Fase 1 (diagnóstico pago) para reduzir a barreira de budget.",
      },
      estrategia: {
        motivoAlerta: "Dor de execução continua aguda e a liderança nova está sob cobrança — momento de retomar com escopo enxuto.",
        contexto: "Perdemos por verba, não por mérito. O diretor Brian tem urgência. Reduzir a entrada via Fase 1 destrava a decisão.",
        angulo: "'Ouro Fino não precisa de mais estratégia, precisa de execução comercial.' Entrar por um diagnóstico executivo de menor ticket que abre o projeto maior.",
        canal: "Ligação",
        canaisAlt: ["Ligação", "WhatsApp", "E-mail"],
        mensagem: "Brian, tudo bem? Voltando ao nosso papo de março. Aquele cenário que mapeamos — time externo abaixo do potencial e dependência do interno — não se resolveu sozinho, e com o inverno chegando a pressão aumenta. Tenho uma forma de começarmos menor, por um diagnóstico executivo, sem travar no budget do projeto inteiro. Vale 20 min essa semana pra eu te mostrar?",
        perguntas: [
          "O novo Gerente Nacional já mudou o ritmo de execução do time externo?",
          "O que mudou na decisão do conselho desde março?",
          "Faz sentido começarmos por uma fase menor para destravar o orçamento?",
        ],
        proximoPasso: "Ligar para o Brian propondo o diagnóstico executivo (Fase 1) como porta de entrada de menor ticket.",
      },
    },

    {
      id: "stefanini",
      nome: "Stefanini Brasil",
      iniciais: "ST",
      segmento: "Tecnologia / Consultoria de TI",
      porte: "Grande (≈ 130 comerciais BR+LatAm)",
      cidade: "Jaguariúna", uf: "SP",
      site: "stefanini.com",
      cnpj: "—",
      contato: { nome: "Fabiane Araujo", cargo: "Especialista em Treinamento", email: "faaraujo@stefanini.com" },
      responsavel: "Rafael Bortoloso",
      servico: "Vendas Consultivas — mudança de mindset (IA)",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 86,
      resumoSinal: "Pediu para retomar em setembro — a janela está chegando",
      motivo: "Proposta bem aderente, adiada para o 2º semestre por mudanças internas",
      novidade: "Aproxima-se a data combinada de retomada",
      sinais: [
        { tipo: "Movimentações estratégicas", titulo: "Stefanini intensifica go-to-market de soluções de IA na LatAm", fonte: "Google News", data: "2026-05-31", relevancia: 84, resumo: "Empresa acelera posicionamento de IA — exatamente a frente para a qual o time precisa de venda consultiva." },
        { tipo: "Crescimento comercial", titulo: "Vagas de pré-vendas/IA abertas no Brasil", fonte: "LinkedIn Jobs", data: "2026-05-24", relevancia: 70, resumo: "Reforço de time comercial técnico para a estratégia de IA." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · retomada agendada",
        resumoExecutivo: "A Stefanini está migrando do modelo tradicional (body shop) para venda de soluções de IA. A proposta de Vendas Consultivas (BR + LatAm, ~132 profissionais) foi muito bem avaliada internamente. Por mudanças internas, adiaram para o 2º semestre. Fabiane pediu contato em setembro — ou ela mesma retomaria. A aderência já está validada.",
        timeline: [
          { data: "Mar 2026", tipo: "Proposta", texto: "Proposta de mudança de mindset + venda consultiva de IA, com pesquisa diagnóstica para personalização." },
          { data: "Abr 2026", tipo: "Reunião", texto: "Apresentação à liderança. 'Gostaram muito', foi para análise de detalhes." },
          { data: "Mai 2026", tipo: "Adiamento", texto: "Mudanças internas adiaram o treinamento para o 2º semestre. Retomar em setembro." },
        ],
        relacionamento: { nome: "Fabiane Araujo", cargo: "Especialista em Treinamento", sentimento: "Muito favorável (pediu retomada)" },
        dor: "Time volta ao modelo tradicional (body shop) quando o cliente resiste — trava a venda de IA",
        objecoes: ["Mudanças internas", "Timing — preferiram 2º semestre"],
        risco: "Baixo — aderência validada, só faltou timing",
        patrocinador: "Fabiane Araujo (treinamento)",
      },
      intencao: {
        oQueMudou: "O 2º semestre chegou e a Stefanini está acelerando publicamente sua frente de IA.",
        porqueMudou: "A pressão de mercado por vender IA torna a capacitação consultiva mais urgente agora.",
        indica: "Momento ideal de cumprir o combinado de setembro — antes que ela retome com outro fornecedor.",
        oportunidade: "Retomar a proposta já validada, atualizada com a expansão de IA na LatAm.",
      },
      estrategia: {
        motivoAlerta: "Retomada combinada para o 2º semestre + sinal público de aceleração de IA. Aderência já validada.",
        contexto: "Não foi perda de mérito, foi timing. A Fabiane é patrocinadora e pediu para retomarmos. A janela é agora.",
        angulo: "Antecipar a retomada com gancho no movimento de IA na LatAm: 'o mercado não esperou setembro, o time precisa estar pronto'.",
        canal: "E-mail",
        canaisAlt: ["E-mail", "LinkedIn", "Ligação"],
        mensagem: "Oi, Fabiane! Tudo bem? Como combinamos, estou te procurando para o 2º semestre. Vi que a Stefanini está acelerando o go-to-market de IA na LatAm — é exatamente a frente em que o time precisa estar mais consultivo. Nossa proposta segue válida e posso atualizá-la com esse contexto. Vale retomarmos uma conversa nas próximas semanas?",
        perguntas: [
          "As mudanças internas já se estabilizaram para destravar o projeto?",
          "A meta de vender IA na LatAm já tem prazo definido?",
          "Faz sentido começarmos pela pesquisa diagnóstica enquanto fechamos as datas?",
        ],
        proximoPasso: "Enviar e-mail à Fabiane retomando a proposta com o gancho da expansão de IA. Agendar reunião de atualização.",
      },
    },

    {
      id: "ifood",
      nome: "iFood",
      iniciais: "iF",
      segmento: "Tecnologia / Marketplace",
      porte: "Enterprise (≈ 1.000 comerciais)",
      cidade: "Osasco", uf: "SP",
      site: "ifood.com.br",
      cnpj: "—",
      contato: { nome: "Rafael Ribeiro", cargo: "—", email: "henrique.rafael@ifood.com.br" },
      responsavel: "Mayron Félix",
      servico: "Palestra de Convenção (Karen e Caetano)",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 83,
      resumoSinal: "Ciclo de nova convenção começa a ser planejado",
      motivo: "Convenção de maio passou sem retorno; relacionamento esfriou mas a conta é estratégica",
      novidade: "Planejamento do próximo ciclo comercial",
      sinais: [
        { tipo: "Crescimento comercial", titulo: "iFood abre vagas de liderança comercial (Farmers/Hunters)", fonte: "LinkedIn Jobs", data: "2026-05-27", relevancia: 80, resumo: "Reforço da operação comercial de ~1.000 profissionais; ciclo de capacitação tende a ser revisitado." },
        { tipo: "Movimentações estratégicas", titulo: "Forte aposta em dados e IA na execução comercial", fonte: "Google News", data: "2026-05-15", relevancia: 68, resumo: "Discurso público sobre transformar dados em decisão — dor mapeada na proposta." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · conta estratégica",
        resumoExecutivo: "Operação comercial robusta (~800 Farmers + 200 Hunters). A proposta de palestra (Karen e Caetano) para a convenção anual de maio não teve retorno — provavelmente escolheram fornecedor pela proximidade do evento. A dor central permanece: transformar dados e IA em conversas que geram decisão. Conta estratégica para nutrir até o próximo ciclo.",
        timeline: [
          { data: "Mar 2026", tipo: "Proposta", texto: "Proposta de palestra para convenção, focada em execução consultiva e leitura de dados." },
          { data: "Abr 2026", tipo: "Follow-up", texto: "Tentativas em todos os canais sem retorno." },
          { data: "Mai 2026", tipo: "Perda", texto: "Convenção aconteceu; sem retorno. Dedução: fornecedor já escolhido para o evento." },
        ],
        relacionamento: { nome: "Rafael Ribeiro", cargo: "Contato comercial", sentimento: "Frio (sem retorno)" },
        dor: "Transformar dados/IA em conversas que geram decisão; evoluir o time para perfil consultivo",
        objecoes: ["Timing do evento (decisão em cima da hora)"],
        risco: "Relacionamento frio; ciclo anual longo",
        patrocinador: "A reconquistar",
      },
      intencao: {
        oQueMudou: "iFood reforça liderança comercial e reabre planejamento do ciclo.",
        porqueMudou: "Novo ciclo comercial e contratações sinalizam revisão de capacitação.",
        indica: "Hora de nutrir a conta com conteúdo de valor para entrar cedo no próximo planejamento.",
        oportunidade: "Posicionar trilha consultiva 'de dados à decisão' antes da próxima convenção.",
      },
      estrategia: {
        motivoAlerta: "Conta estratégica reaquecendo: contratações de liderança e novo ciclo de planejamento.",
        contexto: "Perdemos por timing do evento. Agora é construir relacionamento cedo, sem pressão de data.",
        angulo: "Entrar com conteúdo (não com proposta) sobre 'transformar dados em decisão' — a dor que eles mesmos declararam.",
        canal: "LinkedIn",
        canaisAlt: ["LinkedIn", "E-mail"],
        mensagem: "Oi, Rafael! Acompanhei o movimento de vocês em dados e IA na operação comercial. Preparei um material curto sobre como times de alta performance transformam dado em conversa que gera decisão — lembrei da nossa conversa sobre a convenção. Posso te enviar? Sem compromisso, só pra somar no planejamento do próximo ciclo.",
        perguntas: [
          "Como está o planejamento do próximo ciclo de capacitação comercial?",
          "A leitura de dados em campo virou prioridade depois da última convenção?",
        ],
        proximoPasso: "Conectar com o Rafael no LinkedIn e enviar material de valor (nurturing), sem proposta.",
      },
    },

    {
      id: "ailos",
      nome: "Cooperativa AILOS",
      iniciais: "AL",
      segmento: "Cooperativa de crédito (sistema)",
      porte: "Grande (14 coops · ≈ 460 líderes)",
      cidade: "Blumenau", uf: "SC",
      site: "ailos.coop.br",
      cnpj: "—",
      contato: { nome: "Gabriela Lavrati", cargo: "—", email: "gabriela.lavrati@ailos.coop.br" },
      responsavel: "Rafael Bortoloso",
      servico: "Workshop de Liderança (convenção sistêmica)",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 78,
      resumoSinal: "Relacionamento mantido; gostaram do portfólio (Sicredi/Vendópolis)",
      motivo: "Perdeu para consultoria de treinamento vivencial, mas a porta segue aberta",
      novidade: "Revisão estratégica com visão 2030 em andamento",
      sinais: [
        { tipo: "Movimentações estratégicas", titulo: "AILOS conduz revisão estratégica com visão 2030 (foco comercial)", fonte: "Release", data: "2026-05-18", relevancia: 76, resumo: "Sistema reforça o pilar comercial e a performance das lideranças nas 14 cooperativas." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · relacionamento ativo",
        resumoExecutivo: "Sistema cooperativo (14 coops, ~460 líderes) em revisão estratégica até 2030, com foco no pilar comercial. A proposta de workshop de liderança para a 1ª convenção sistêmica foi muito elogiada, mas fecharam com consultoria de treinamento vivencial (mais fit com a demanda). Gostaram do nosso portfólio (Central Sicredi, Vendópolis). Relacionamento sendo nutrido de perto.",
        timeline: [
          { data: "Fev 2026", tipo: "Proposta", texto: "Workshop de liderança de alta performance para 460 líderes na 1ª convenção sistêmica." },
          { data: "Mar 2026", tipo: "Reunião", texto: "Apresentação e alinhamento; plano de sustentação pós-evento (ação + live em 30 dias)." },
          { data: "Abr 2026", tipo: "Perda", texto: "Fecharam com consultoria de treinamento vivencial. Pediram e gostaram do nosso portfólio." },
        ],
        relacionamento: { nome: "Gabriela Lavrati", cargo: "Liderança de projeto", sentimento: "Favorável — relacionamento mantido" },
        dor: "Falta de padronização sobre o que é 'alta performance'; rituais e gestão de resultados das lideranças",
        objecoes: ["Treinamento vivencial não é nosso core", "Fit com a demanda do evento"],
        risco: "Concorrente entrou; mas há abertura para próximas frentes",
        patrocinador: "Gabriela Lavrati",
      },
      intencao: {
        oQueMudou: "Revisão estratégica até 2030 mantém o pilar comercial em alta no sistema.",
        porqueMudou: "Depois da convenção, surgem frentes de continuidade (gestão de performance, rituais).",
        indica: "Espaço para entrar na fase de sustentação/consistência — onde somos fortes.",
        oportunidade: "Oferecer a trilha de consistência de gestão comercial pós-convenção (rituais, acompanhamento).",
      },
      estrategia: {
        motivoAlerta: "Relacionamento ativo + visão 2030 com foco comercial. O vivencial cobriu o evento, não a continuidade.",
        contexto: "Gostaram do portfólio e mantemos contato. A frente de consistência/gestão é complementar ao que contrataram.",
        angulo: "Posicionar como a fase seguinte: 'depois da virada de chave do evento, como sustentar a alta performance no dia a dia das 14 coops'.",
        canal: "WhatsApp",
        canaisAlt: ["WhatsApp", "E-mail"],
        mensagem: "Oi, Gabriela! Acompanhando a jornada de vocês rumo a 2030. Geralmente o desafio depois de uma convenção como a de vocês é sustentar a alta performance no dia a dia — rituais, acompanhamento e consistência das lideranças. É justamente onde somos fortes (como no projeto da Central do Sicredi). Posso te mostrar como seria essa fase de continuidade?",
        perguntas: [
          "Como está a sustentação da convenção no dia a dia das cooperativas?",
          "Os rituais de gestão das lideranças já estão padronizados nas 14 coops?",
        ],
        proximoPasso: "Mensagem à Gabriela posicionando a fase de continuidade (sustentação pós-convenção).",
      },
    },

    {
      id: "bellacor",
      nome: "Bellacor Linhas e Fios",
      iniciais: "BC",
      segmento: "Indústria têxtil (linhas de costura)",
      porte: "Média (≈ R$ 2 mi/mês)",
      cidade: "Brusque", uf: "SC",
      site: "linhasbellacor.com.br",
      cnpj: "—",
      contato: { nome: "André Souza", cargo: "Gestão", email: "andre@linhasbellacor.com.br" },
      responsavel: "Rafael Bortoloso",
      servico: "Diagnóstico Comercial",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 75,
      resumoSinal: "Capacidade ociosa de +40% sem novo investimento — crescimento travado no comercial",
      motivo: "Proposta de diagnóstico sem resposta; sem prazo crítico, mas dor estrutural clara",
      novidade: "Pressão interna por crescimento",
      sinais: [
        { tipo: "Expansão", titulo: "Setor têxtil de SC aquecido; Bellacor com folga produtiva", fonte: "Portal setorial", data: "2026-05-12", relevancia: 66, resumo: "Empresa pode crescer ~40% sem investimento — gargalo é estrutura comercial, não produção." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · reabordável",
        resumoExecutivo: "Indústria de linhas de costura (R$1,8–2 mi/mês, baixa sazonalidade). Produto de alta recorrência, mas vira 2ª/3ª prioridade na carteira dos ~20 representantes. Tem capacidade para crescer ~40% sem novo investimento — o gargalo é comercial: falta de processo, sem acompanhamento de carteira/inatividade, base 3x maior que os ~300 clientes ativos/mês. Proposta de diagnóstico comercial enviada; follow-ups sem resposta.",
        timeline: [
          { data: "Mar 2026", tipo: "Proposta", texto: "Proposta de diagnóstico comercial (raio-x da operação)." },
          { data: "Abr 2026", tipo: "Follow-up", texto: "Ofereci um 'Raio-X Comercial' de 10 min como gancho. Sem retorno." },
          { data: "Mai 2026", tipo: "Follow-up", texto: "Último follow mais duro oferecendo Diagnóstico Executivo. Sem avanço." },
        ],
        relacionamento: { nome: "André Souza", cargo: "Gestão comercial", sentimento: "Morno (sem resposta recente)" },
        dor: "Sem processo comercial; carteira sem acompanhamento; representantes priorizam outros produtos",
        objecoes: ["Sem prazo/evento que force a decisão"],
        risco: "Decisão sem urgência; precisa de um gatilho",
        patrocinador: "André Souza",
      },
      intencao: {
        oQueMudou: "O setor têxtil aquece enquanto a Bellacor mantém capacidade ociosa.",
        porqueMudou: "Quanto mais o mercado cresce, mais cara fica a capacidade parada por gargalo comercial.",
        indica: "Bom momento para reativar com um gancho de oportunidade (mercado aquecido = custo de não vender).",
        oportunidade: "Reabrir o diagnóstico ancorando no 'custo da capacidade ociosa' enquanto o mercado cresce.",
      },
      estrategia: {
        motivoAlerta: "Dor estrutural clara + mercado aquecido. Falta o gatilho — podemos criar com o ângulo de custo de oportunidade.",
        contexto: "Sem evento que force a decisão, o diagnóstico travou. Mercado aquecido é o gatilho que faltava.",
        angulo: "'Vocês podem crescer 40% sem investir em produção — só falta destravar o comercial. Com o mercado aquecido, cada mês parado custa caro.'",
        canal: "WhatsApp",
        canaisAlt: ["WhatsApp", "E-mail"],
        mensagem: "André, tudo bem? Lembra do nosso papo sobre crescer sem precisar investir em produção? Com o setor têxtil aquecido agora, a capacidade ociosa de vocês virou custo de oportunidade real. O diagnóstico que te propus mostra exatamente onde destravar a carteira e os representantes. Topa 15 min essa semana pra eu te mostrar o que mudaria?",
        perguntas: [
          "Os ~300 clientes ativos/mês cresceram desde nossa conversa?",
          "Os representantes seguem priorizando outros produtos na carteira?",
          "Existe meta de crescimento para este semestre?",
        ],
        proximoPasso: "Reabrir com o André via WhatsApp usando o gancho do mercado aquecido + custo da capacidade ociosa.",
      },
    },

    {
      id: "medal",
      nome: "Grupo Medal",
      iniciais: "GM",
      segmento: "Indústria (peças hidráulicas)",
      porte: "Pequena-média (10 vendedores)",
      cidade: "Luzerna", uf: "SC",
      site: "medal.com.br",
      cnpj: "—",
      contato: { nome: "Tiago Dalla Lana", cargo: "Gestão", email: "tiago@medal.com.br" },
      responsavel: "Rafael Bortoloso",
      servico: "Vendas Consultivas de Alta Performance",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 69,
      resumoSinal: "Consultor interno (Alexandre) defende a capacitação por dentro",
      motivo: "Travou em budget — acharam que o treino viria de graça pela consultoria ativa",
      novidade: "Patrocinador interno ativo",
      sinais: [
        { tipo: "Crescimento comercial", titulo: "Consultoria ativa de outro fornecedor pede reforço técnico do time", fonte: "Relacionamento", data: "2026-05-10", relevancia: 64, resumo: "Alexandre (consultor que atua na conta) levantou a necessidade de equipe mais técnica em vendas consultivas." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · reabordável",
        resumoExecutivo: "Referência em peças hidráulicas, 10 vendedores internos. O consultor Alexandre (de outra frente) levantou a necessidade de tornar o time mais técnico em vendas consultivas. Proposta enviada, mas o Tiago travou: entendeu que todo o investimento já foi para a consultoria ativa e não enxergou verba para o treinamento. Há patrocinador interno (Alexandre) fortalecendo por dentro.",
        timeline: [
          { data: "Mar 2026", tipo: "Proposta", texto: "Vendas Consultivas de Alta Performance — equipe mais técnica e consultiva." },
          { data: "Abr 2026", tipo: "Follow-up", texto: "Alexandre (consultor) reforça internamente; chances apontadas como boas." },
          { data: "Mai 2026", tipo: "Perda", texto: "Tiago: investimento já comprometido com a consultoria; sem verba para o treinamento." },
        ],
        relacionamento: { nome: "Tiago Dalla Lana", cargo: "Decisor · Alexandre (consultor) é o sponsor", sentimento: "Neutro; sponsor favorável" },
        dor: "Time pouco técnico em vendas consultivas",
        objecoes: ["Verba já alocada na consultoria ativa", "Percepção de que o treino seria 'de graça'"],
        risco: "Confusão de escopo/verba com a consultoria existente",
        patrocinador: "Alexandre (consultor interno na conta)",
      },
      intencao: {
        oQueMudou: "O sponsor interno (Alexandre) segue defendendo a capacitação técnica.",
        porqueMudou: "A necessidade técnica não foi resolvida pela consultoria ativa.",
        indica: "Reabrir separando claramente o escopo do treinamento do escopo da consultoria.",
        oportunidade: "Pacote enxuto de vendas consultivas, com escopo e verba destacados da consultoria atual.",
      },
      estrategia: {
        motivoAlerta: "Sponsor interno ativo + dor técnica não resolvida. A perda foi confusão de escopo/verba.",
        contexto: "O Tiago achou que estava incluso. Precisamos separar o valor do treinamento e mostrar ROI próprio.",
        angulo: "Acionar o Alexandre para co-construir um escopo enxuto e levar ao Tiago com verba e ROI separados da consultoria.",
        canal: "Ligação",
        canaisAlt: ["Ligação", "WhatsApp"],
        mensagem: "Oi, Alexandre! Vamos retomar a capacitação técnica do time do Tiago? Acho que faltou separar bem o escopo do treinamento do trabalho de consultoria. Posso montar um pacote enxuto, com ROI próprio, pra você levar ao Tiago sem aquela confusão de verba. Topa a gente alinhar rápido?",
        perguntas: [
          "O time evoluiu em técnica consultiva desde nossa proposta?",
          "Faz sentido um escopo menor, com verba separada da consultoria?",
        ],
        proximoPasso: "Ligar para o Alexandre e co-construir um escopo enxuto, com verba destacada, para levar ao Tiago.",
      },
    },

    {
      id: "sicredi-integracao",
      nome: "Sicredi Integração RS/SC",
      iniciais: "SI",
      segmento: "Cooperativa de crédito",
      porte: "Média (≈ 20 assessores)",
      cidade: "Passo Fundo", uf: "RS",
      site: "sicredi.com.br",
      cnpj: "—",
      contato: { nome: "Contato a remapear", cargo: "Cheila (saiu da coop)", email: "—" },
      responsavel: "Rafael Bortoloso",
      servico: "Programa de Assessores e Power Cooperativismo",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 63,
      resumoSinal: "Pediu contato no 2º semestre — mas o sponsor saiu da cooperativa",
      motivo: "Viu mais fit com consultoria de liderança; relacionamento perdeu o ponto focal",
      novidade: "Janela de 2º semestre se aproxima",
      sinais: [
        { tipo: "Movimentação executiva", titulo: "Troca na área de desenvolvimento (sponsor anterior saiu)", fonte: "LinkedIn", data: "2026-05-08", relevancia: 60, resumo: "Cheila deixou a cooperativa; é preciso remapear o novo responsável pelo desenvolvimento dos assessores." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · remapear contato",
        resumoExecutivo: "Cooperativa em integração, ~20 assessores (também multiplicadores). Programa estruturado de 6–8 meses (2–3 módulos), com interesse em 4DX/FranklinCovey. Principal desafio: inadimplência consumindo a energia do time. Naquele momento viram mais fit com consultoria de liderança e pediram contato no 2º semestre. Atenção: a sponsor (Cheila) saiu da coop — é preciso remapear o novo ponto focal.",
        timeline: [
          { data: "Fev 2026", tipo: "Proposta", texto: "Programa de assessores (6–8 meses) + Power Cooperativismo." },
          { data: "Mar 2026", tipo: "Análise", texto: "Diretoria avaliando; também olhando outras consultorias." },
          { data: "Abr 2026", tipo: "Perda", texto: "Mais conexão com consultoria de liderança. Pediram contato no 2º semestre." },
        ],
        relacionamento: { nome: "Cheila Cadore", cargo: "Saiu da cooperativa", sentimento: "Favorável, porém indisponível" },
        dor: "Inadimplência drenando o foco; time sem ritmo de execução estratégica",
        objecoes: ["Mais fit com liderança naquele momento", "Timing — 2º semestre"],
        risco: "Sponsor saiu — relacionamento sem ponto focal",
        patrocinador: "A remapear (novo responsável por desenvolvimento)",
      },
      intencao: {
        oQueMudou: "Aproxima-se o 2º semestre combinado, mas a interlocutora saiu da cooperativa.",
        porqueMudou: "A janela acordada chega; a troca de pessoa exige reabertura de relacionamento.",
        indica: "Primeiro remapear o novo responsável, depois retomar com a proposta ajustada.",
        oportunidade: "Reentrar via novo ponto focal, conectando assessores + execução (4DX) à dor de inadimplência.",
      },
      estrategia: {
        motivoAlerta: "Janela de 2º semestre + necessidade de remapear o contato após a saída da Cheila.",
        contexto: "Combinamos retomar agora, mas perdemos o ponto focal. Prioridade é descobrir quem assumiu o desenvolvimento.",
        angulo: "Reabrir pela dor de inadimplência + execução (4DX), encontrando o novo responsável no LinkedIn.",
        canal: "LinkedIn",
        canaisAlt: ["LinkedIn", "E-mail"],
        mensagem: "Olá! Conversávamos com a cooperativa sobre o desenvolvimento dos assessores e ficou de retomarmos no 2º semestre. Como a Cheila seguiu outro caminho, queria me apresentar a quem hoje cuida desse desenvolvimento. Temos um programa que conecta execução (estilo 4DX) à redução de inadimplência. Posso te enviar um resumo de uma página?",
        perguntas: [
          "Quem assumiu o desenvolvimento dos assessores após a saída da Cheila?",
          "A inadimplência segue como principal prioridade do time?",
        ],
        proximoPasso: "Remapear o novo responsável no LinkedIn e reabrir relacionamento antes de reapresentar a proposta.",
      },
    },

    {
      id: "caixa-vida",
      nome: "CAIXA Vida e Previdência",
      iniciais: "CX",
      segmento: "Previdência privada",
      porte: "Grande (51–100 na equipe foco)",
      cidade: "São Paulo", uf: "SP",
      site: "caixavidaeprevidencia.com.br",
      cnpj: "—",
      contato: { nome: "Jhonatas Mariano Santos", cargo: "Analista de Treinamento", email: "jhonatas.santos@caixavidaeprevidencia.com.br" },
      responsavel: "Mayron Félix",
      servico: "Programa de Multiplicadores",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 56,
      resumoSinal: "Fechou com especialista no nicho; sem novo gatilho relevante",
      motivo: "Preferiram consultoria especializada em atendentes Caixa",
      novidade: "—",
      sinais: [
        { tipo: "Movimentações estratégicas", titulo: "Sem novo sinal relevante no período", fonte: "—", data: "2026-05-01", relevancia: 35, resumo: "Conta em observação; o concorrente especializado ocupa o espaço no momento." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · em observação",
        resumoExecutivo: "Treinamento dos correspondentes/atendentes Caixa (lotéricas). Proposta de programa de multiplicadores para a liderança. Perderam para uma consultoria que só atua dentro de bancos/agências e já tem experiência com atendentes Caixa. Dor real (equipe com pouca técnica e abordagem ativa), mas o concorrente tem forte especialização no nicho. Manter em observação.",
        timeline: [
          { data: "Fev 2026", tipo: "Proposta", texto: "Programa de multiplicadores para a liderança aplicar aos consultores." },
          { data: "Mar 2026", tipo: "Análise", texto: "Jhonatas analisando com a diretoria; retorno prometido." },
          { data: "Abr 2026", tipo: "Perda", texto: "Fecharam com consultoria especializada em atendentes Caixa." },
        ],
        relacionamento: { nome: "Jhonatas Mariano Santos", cargo: "Analista de Treinamento", sentimento: "Cordial; optou pelo especialista" },
        dor: "Correspondentes com pouca técnica de vendas e baixa abordagem ativa",
        objecoes: ["Concorrente especializado no nicho Caixa"],
        risco: "Concorrente entrincheirado no segmento",
        patrocinador: "Jhonatas (analista) — sem poder de virar a decisão agora",
      },
      intencao: {
        oQueMudou: "Nada relevante no período.",
        porqueMudou: "Concorrente especializado recém-contratado ocupa o espaço.",
        indica: "Baixa prioridade agora; reavaliar quando o contrato do concorrente amadurecer.",
        oportunidade: "Nutrir o Jhonatas e aguardar avaliação de resultados do concorrente (renovação).",
      },
      estrategia: {
        motivoAlerta: "Sem gatilho novo; concorrente especializado recém-entrou.",
        contexto: "Decisão recente e específica do nicho. Melhor nutrir e monitorar a janela de renovação.",
        angulo: "Manter relacionamento cordial com o Jhonatas e observar resultados do concorrente.",
        canal: "LinkedIn",
        canaisAlt: ["LinkedIn"],
        mensagem: "Oi, Jhonatas! Tudo certo? Sigo à disposição por aqui. Quando fizer sentido avaliar resultados ou novas frentes de capacitação dos correspondentes, é só me chamar. Vou continuar acompanhando o trabalho de vocês.",
        perguntas: [],
        proximoPasso: "Adicionar o Jhonatas ao nurturing e revisar em ~90 dias (janela de avaliação do concorrente).",
      },
    },

    {
      id: "leagel",
      nome: "Leagel",
      iniciais: "LG",
      segmento: "Indústria alimentícia",
      porte: "Média",
      cidade: "Sete Lagoas", uf: "MG",
      site: "leagel.com.br",
      cnpj: "—",
      contato: { nome: "Mariana Nunes", cargo: "Gerente de Marketing", email: "mariana.nunes@iff.com" },
      responsavel: "Mayron Félix",
      servico: "Palestra (Leandro Biscola)",
      origem: "Importado · Propostas perdidas 2026.xlsx",
      score: 42,
      resumoSinal: "Sem budget básico para fechar; sem novo gatilho",
      motivo: "Não havia verba para a palestra",
      novidade: "—",
      sinais: [
        { tipo: "Movimentações estratégicas", titulo: "Sem sinal de liberação de verba", fonte: "—", data: "2026-04-28", relevancia: 30, resumo: "Conta de baixa prioridade até surgir orçamento ou novo evento." },
      ],
      memoria: {
        jaCliente: false, jaProposta: true, status: "Proposta perdida 2026 · em observação",
        resumoExecutivo: "Indústria alimentícia. Proposta de palestra (Leandro Biscola) via marketing. Perdida por ausência de budget básico para fechar. Sem evento/gatilho à vista. Baixa prioridade até surgir orçamento ou nova data.",
        timeline: [
          { data: "Mar 2026", tipo: "Proposta", texto: "Proposta de palestra via área de marketing." },
          { data: "Abr 2026", tipo: "Perda", texto: "Sem budget básico para fechar." },
        ],
        relacionamento: { nome: "Mariana Nunes", cargo: "Gerente de Marketing", sentimento: "Cordial; sem verba" },
        dor: "—",
        objecoes: ["Sem orçamento disponível"],
        risco: "Baixa prioridade sem orçamento",
        patrocinador: "Mariana (marketing) — sem verba no momento",
      },
      intencao: {
        oQueMudou: "Nada relevante no período.",
        porqueMudou: "Sem orçamento ou evento que justifique a palestra.",
        indica: "Baixa prioridade; reavaliar perto de datas de convenção/evento.",
        oportunidade: "Aguardar ciclo de planejamento de eventos (orçamento de marketing).",
      },
      estrategia: {
        motivoAlerta: "Sem gatilho e sem verba.",
        contexto: "Nenhuma ação de venda recomendada hoje. Manter em nurturing leve.",
        angulo: "Aguardar novo ciclo de eventos/orçamento.",
        canal: "—",
        canaisAlt: [],
        mensagem: "",
        perguntas: [],
        proximoPasso: "Manter em monitoramento e reabordar próximo ao planejamento de eventos do próximo ciclo.",
      },
    },
  ],
};

/* ===== Volume importado da planilha (propostas perdidas 2026) =====
   Contas adicionais para o Radar operar em escala (70+). Estrutura completa,
   memória/estratégia enxutas; o que pontua é o sinal externo + a perda. */
(function gerarVolume() { return; /* desativado: o Radar inicia vazio */
  const NOMES = [
    "Transportadora Ágil", "Frigorífico Vale Verde", "Supermercados Líder", "Construtora Pilar",
    "Têxtil Aurora", "Metalúrgica Forte", "AgroPlan Insumos", "Laticínios Campo Bom",
    "Calçados Passo Firme", "Plásticos União", "Rede BemEstar Farmácias", "Hospital Santa Clara",
    "Faculdade Horizonte", "Cooperativa AgroSul", "Distribuidora Norte", "Logística Expressa",
    "Química Real", "Móveis Conforto", "Cerâmica Bela Arte", "Embalagens Nova",
    "Autopeças Veloz", "Energia Sustentável", "Telecom Conecta", "Banco Regional Sul",
    "Seguros Confiança Mais", "Imobiliária Cidade", "Rede Hoteleira Costa", "Restaurantes Sabor & Cia",
    "Varejo Popular", "Mercado Livre de Bairro", "Cosméticos Beleza Pura", "Bebidas Tropical",
    "Gráfica Impacto", "Vidraçaria Cristal", "Tintas Cor Viva", "Madeireira Pinhão",
    "Pescados Mar Azul", "Avícola Dourada", "Suinocultura Premium", "Sementes Boa Safra",
    "Fertilizantes Terra", "Máquinas Agrícolas TR", "Equipamentos Médicos Vita", "Software Gestão Pro",
    "Consultoria RH Integra", "Engenharia Estrutural M&P", "Mineração Serra Azul", "Siderúrgica Aço Norte",
    "Petroquímica Litoral", "Cooperativa Crédito Vale", "Indústria Alimentar Sabor", "Distribuidora Farma Plus",
    "Atacadão do Campo", "Rede Ótica Visão", "Clínica OdontoVida", "Academia MoveFit",
    "Construtora Alicerce", "Transporte Rodoviário Sul", "Têxtil Fio de Ouro", "Móveis Planejados Lar",
    "Refrigeração Polar", "Solar Energia Limpa", "AgroTech Campo Digital", "Laboratório BioVida",
    "Comércio de Aços União", "Indústria de Papel Celulose Verde", "Rede de Postos Caminho",
    "Distribuidora de Bebidas Norte", "Cooperativa Leite Bom Pasto", "Fábrica de Embalagens Flex",
  ];
  const SEG = ["Indústria", "Distribuição", "Varejo", "Serviços", "Cooperativa de crédito", "Logística", "Agronegócio", "Saúde", "Educação", "Construção civil", "Tecnologia", "Indústria de alimentos"];
  const CID = [["São Paulo","SP"],["Campinas","SP"],["Curitiba","PR"],["Londrina","PR"],["Porto Alegre","RS"],["Caxias do Sul","RS"],["Florianópolis","SC"],["Joinville","SC"],["Belo Horizonte","MG"],["Uberlândia","MG"],["Goiânia","GO"],["Cuiabá","MT"],["Salvador","BA"],["Recife","PE"],["Fortaleza","CE"],["Rio de Janeiro","RJ"],["Vitória","ES"],["Maringá","PR"],["Blumenau","SC"],["Ribeirão Preto","SP"]];
  const MOTIVOS = ["Sem budget no momento", "Proposta adiada", "Fechou com concorrente", "Mudança de prioridades", "Falta de retorno", "Decisão postergada para o próximo ciclo"];
  const SINAIS = [
    { tipo: "Crescimento comercial", titulo: "Vagas comerciais abertas (SDR/Vendedor)", fonte: "LinkedIn Jobs", resumo: "Abertura de vagas na área comercial indica estruturação/expansão do time." },
    { tipo: "Movimentação executiva", titulo: "Nova liderança comercial anunciada", fonte: "LinkedIn", resumo: "Troca na liderança comercial costuma abrir janela de capacitação." },
    { tipo: "Expansão", titulo: "Nova filial registrada", fonte: "Dados empresariais (CNPJ)", resumo: "Alteração cadastral aponta abertura de novo estabelecimento." },
    { tipo: "Investimento", titulo: "Aporte/expansão anunciada", fonte: "Google News", resumo: "Movimento de investimento direcionado a crescimento." },
    { tipo: "Novos produtos", titulo: "Lançamento de novo produto", fonte: "Site da empresa", resumo: "Nova oferta exige requalificação do discurso de vendas." },
  ];
  const ini = (n) => { const w = n.replace(/[^A-Za-zÀ-ú ]/g,"").trim().split(/\s+/); return ((w[0][0]||"") + (w[1]?w[1][0]:(w[0][1]||""))).toUpperCase(); };
  const slug = (n) => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");

  const arr = window.RADAR_DATA.empresas;
  NOMES.forEach((nome, i) => {
    const score = ((i * 37 + 17) % 78) + 13; // 13..90 determinístico
    const seg = SEG[i % SEG.length];
    const [cidade, uf] = CID[i % CID.length];
    const motivo = MOTIVOS[i % MOTIVOS.length];
    const temSinal = score >= 45;
    const s = SINAIS[i % SINAIS.length];
    const dia = String((i % 27) + 1).padStart(2, "0");
    arr.push({
      id: "g" + i, nome, iniciais: ini(nome), segmento: seg, porte: ["Pequena","Média","Grande"][i % 3] + " (≈ " + (80 + (i % 9) * 110) + " func.)",
      cidade, uf, site: slug(nome) + ".com.br", cnpj: "—",
      contato: { nome: "Contato comercial", cargo: "Gestor comercial", email: "comercial@" + slug(nome) + ".com.br" },
      responsavel: ["Mayron Félix","Rafael Bortoloso","Eryclys Freire"][i % 3], servico: "Treinamento comercial",
      origem: "Dados de demonstração (volume)", ultimoRastreio: null,
      proveniencia: { tipo: "demonstracao", nota: "Conta de exemplo gerada para simular volume — NÃO veio da sua planilha" },
      validacao: { status: "demo" },
      score, resumoSinal: temSinal ? s.titulo : "Sem sinal novo no período",
      motivo: "Proposta perdida 2026 — " + motivo, novidade: "—",
      sinais: temSinal ? [{ tipo: s.tipo, titulo: s.titulo, fonte: s.fonte, data: "2026-05-" + dia, relevancia: score, resumo: s.resumo }] : [],
      memoria: {
        jaCliente: i % 5 === 0, jaProposta: true, status: "Demonstração · a validar",
        resumoExecutivo: "⚠️ Conta de DEMONSTRAÇÃO, gerada para simular o volume de 70+ contas. Não veio da sua planilha — valide ou remova. (Cenário fictício: " + seg.toLowerCase() + " em " + cidade + "/" + uf + ".)",
        timeline: [
          { data: "2026", tipo: "Proposta", texto: "Proposta enviada em 2026." },
          { data: "2026", tipo: "Perda", texto: "Não avançou: " + motivo.toLowerCase() + "." },
        ],
        relacionamento: { nome: "Contato comercial", cargo: "Gestor comercial", sentimento: i % 3 === 0 ? "Favorável" : "Neutro" },
        dor: "A mapear — provável necessidade de estruturação/capacitação comercial",
        objecoes: [motivo], risco: "Reavaliar com novo sinal", patrocinador: "A identificar",
      },
      intencao: {
        oQueMudou: temSinal ? s.titulo + "." : "Sem mudança relevante no período.",
        porqueMudou: temSinal ? "Sinal capturado pelo Radar externo." : "—",
        indica: temSinal ? "Possível reaquecimento da conta." : "Baixa prioridade no momento.",
        oportunidade: temSinal ? "Reabordar conectando a perda de 2026 ao novo sinal." : "Manter monitorando.",
      },
      estrategia: {
        motivoAlerta: temSinal ? "Sinal recente + proposta perdida em 2026." : "Sem gatilho novo.",
        contexto: "Conta importada; reavaliar abordagem conforme evolução dos sinais.",
        angulo: temSinal ? "Retomar contato ancorando no motivo da perda e no novo sinal." : "Aguardar próximo sinal.",
        canal: score >= 61 ? "LinkedIn" : (score >= 31 ? "E-mail" : "—"),
        canaisAlt: score >= 31 ? ["LinkedIn", "E-mail", "WhatsApp"] : [],
        mensagem: temSinal ? "Olá! Retomando nosso contato de 2026 sobre " + seg.toLowerCase() + ". Vi um movimento recente na " + nome + " que pode reabrir essa pauta. Podemos conversar 15 minutos?" : "",
        perguntas: temSinal ? ["O que mudou no time comercial desde nossa última conversa?", "Faz sentido retomarmos agora?"] : [],
        proximoPasso: temSinal ? "Reabordar via " + (score >= 61 ? "LinkedIn" : "e-mail") + " conectando a perda de 2026 ao novo sinal." : "Manter em monitoramento até o próximo sinal.",
      },
    });
  });
})();

/* Setup: as 9 contas reais viram a SEMENTE que a planilha traz ao importar.
   O Radar inicia VAZIO para o usuário importar a planilha do zero. */
(function seedSetup() {
  const seed = window.RADAR_DATA.empresas;
  seed.forEach((e, i) => {
    e.proveniencia = { tipo: "planilha", arquivo: "Propostas perdidas em 2026.xlsx", linha: i + 2, nota: "Extraída diretamente da sua planilha" };
    e.validacao = { status: "pendente" };
  });
  window.RADAR_DATA.seedPlanilha = seed;
  window.RADAR_DATA.empresas = [];
})();

