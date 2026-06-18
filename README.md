# Radar Comercial 🎯

Plataforma estratégica de análise e monitoramento comercial para a VendaMais. Sistema completo para gestão de empresas, propostas, contas e indicadores de desempenho.

## 🚀 Características

- **Análise de Radar Comercial**: Visualização interativa de dados comerciais
- **Gestão de Empresas**: Cadastro e análise detalhada de prospectos
- **Importação/Exportação**: Suporte para importação e exportação de dados em XLSX
- **Relatórios**: Geração de relatórios em Word (DOCX)
- **Dashboard Responsivo**: Interface adaptável para desktop e mobile
- **Sinais Comerciais**: Monitoramento de sinais e indicadores em tempo real
- **Filtros Avançados**: Múltiplos filtros para análise segmentada

## 📁 Estrutura do Projeto

```
radar-comercial/
├── radar/                    # Componentes React principais
│   ├── app.jsx              # Aplicação principal
│   ├── actions.jsx          # Actions e lógica de negócio
│   ├── data.js              # Gerenciamento de dados
│   ├── radar-view.jsx       # Visualização do radar
│   ├── empresa-view.jsx     # View de empresas/prospectos
│   ├── import-flow.jsx      # Fluxo de importação
│   ├── export-doc.jsx       # Exportação de documentos
│   ├── tweaks-panel.jsx     # Painel de ajustes
│   ├── ui.jsx               # Componentes UI comuns
│   ├── views-extra.jsx      # Views adicionais
│   ├── styles.css           # Estilos globais
│   ├── xlsx-parse.js        # Parser para arquivos XLSX
│   ├── seed-data.js         # Dados iniciais
│   └── assets/              # Logos e imagens
├── docs/                     # Documentação técnica
├── screenshots/              # Screenshots do aplicativo
├── uploads/                  # Arquivos enviados
└── README.md                # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para UI
- **JSX** - Extensão de sintaxe para React
- **XLSX** - Manipulação de arquivos Excel
- **HTML/CSS** - Estrutura e estilos

## 📋 Funcionalidades Principais

### Radar Comercial
- Visualização interativa de dados em formato de radar
- Filtros dinâmicos por diferentes critérios
- Análise de segmentos prioritários

### Gestão de Empresas
- Cadastro de prospectos e empresas
- Análise detalhada por empresa
- Histórico de interações

### Importação de Dados
- Suporte para arquivos XLSX
- Validação automática de dados
- Mapeamento de colunas

### Exportação
- Geração de relatórios em Word (DOCX)
- Exportação de dados filtrados
- Múltiplos formatos de saída

## 🎨 Interface

A aplicação oferece várias visualizações:
- **Radar View**: Visualização em radar com métricas
- **Empresa View**: Detalhes de cada prospecto
- **Sinais Feed**: Feed de sinais comerciais
- **Contas**: Gestão de contas
- **Agentes**: Análise por agente comercial

## 📱 Responsividade

A interface é totalmente responsiva, funcionando em:
- Desktop (resolução completa)
- Tablet (layouts adaptativos)
- Mobile (visualização otimizada)

## 🔄 Fluxo de Dados

1. **Importação**: Carregamento de dados via XLSX
2. **Processamento**: Tratamento e validação dos dados
3. **Armazenamento**: Persistência em estado da aplicação
4. **Visualização**: Exibição em diferentes formatos (radar, tabelas, gráficos)
5. **Exportação**: Geração de relatórios em diferentes formatos

## 📊 Dados Suportados

- **Empresas**: Razão social, CNPJ, segmento, região
- **Propostas**: Valor, status, data, responsável
- **Contas**: Dados de contas e relacionamentos
- **Sinais**: Indicadores e eventos comerciais
- **Agentes**: Informações de equipe comercial

## 🚦 Estados da Aplicação

- ✅ Validação de dados
- 📊 Contas validadas
- 🎯 Estratégia comercial
- 📈 Dados de desempenho
- 🔔 Sinais em tempo real

## 📚 Documentação

Consulte a documentação técnica em `docs/` para:
- Handoff técnico de APIs
- Especificações de integração
- Fluxos de dados detalhados

## 🎯 Marca e Identidade

Veja em `Identidade da marca VendaMais.md` para:
- Guia de marca
- Paleta de cores
- Diretrizes de design

## 📋 Segmentos Prioritários

Informações sobre segmentos de mercado em `Segmentos prioritários.md`

## 📝 Portfólio Estratégico

Estratégia de portfólio em `Portfólio estratégico VendaMais.md`

## 📞 Suporte

Para dúvidas técnicas, consulte a documentação em `docs/` ou entre em contato com a equipe técnica.

---

**VendaMais** - Plataforma Estratégica de Vendas e Análise Comercial
