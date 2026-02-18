# English Coach Studio

Aplicacao web para ensino pratico de ingles, com foco em conversacao real, exercicios guiados e apoio para aulas.

## Ideia do Projeto

O projeto foi desenhado para simular uma mini plataforma de aula:

- trilhas por nivel (`Beginner`, `Intermediate`, `Advanced`)
- topicos reais (trabalho, viagem, saude, tecnologia etc.)
- fases de aula (warm-up, argumentacao, aprofundamento, listening, wrap-up)
- exercicios de preenchimento, grammar focus, role-play e feedback em tela
- modo claro/escuro, design system e responsividade mobile

## Estrutura de Pastas

```text
estudos/
  index.html
  src/
    index.html
  README.md
  data/
    topics.js
    questions.js
    vocabulary.js
    expressions.js
  styles/
    main.css
  js/
    app.js
```

## Arquivos e Responsabilidades

- `src/index.html`
  - layout base da pagina (estrutura sem CSS/JS inline)
  - injeta os scripts na ordem correta
- `index.html`
  - arquivo de entrada para deploy em raiz
  - redireciona automaticamente para `src/index.html`
- `styles/main.css`
  - design system (tokens), glass mode, componentes, tema claro/escuro e responsividade
- `data/topics.js`
  - catalogo de categorias e topicos, incluindo role-play
- `data/questions.js`
  - fases, niveis e templates de perguntas/exercicios por nivel
- `data/vocabulary.js`
  - indice de vocabulario/pronuncia por topico + helper `getTopicVocabularyResources()`
- `data/expressions.js`
  - indice de expressoes por foco gramatical + helper `getExpressionsByGrammar()`
- `js/app.js`
  - estado da aplicacao, renderizacao dos cards, eventos, timer, progresso, exportacao e persistencia local

## Ordem de Carregamento (Importante)

No `src/index.html`, os scripts sao carregados nesta sequencia:

1. `data/topics.js`
2. `data/questions.js`
3. `data/vocabulary.js`
4. `data/expressions.js`
5. `js/app.js`

Isso garante que o `app.js` encontre todos os dados e helpers globais.

## Regras Pedagogicas da Aplicacao

- **Niveis**
  - `Beginner`: linguagem simples, tempos menores
  - `Intermediate`: argumentacao e comparacao
  - `Advanced`: analise critica e debate
- **Fases**
  - `Warm-up`
  - `Opinion & Argument`
  - `Deep Dive`
  - `Long Listening`
  - `Wrap-up`
- **Pratica real**
  - perguntas contextualizadas com topico
  - role-play para simulacao de situacoes reais
  - vocabulary + pronunciation por topico
- **Correcao**
  - feedback inline (sem `alert`) com frase esperada e opcoes aceitas/sinonimos

## Design System (Resumo)

- tokens de tema: cores, bordas, sombras, raios, blur
- tema escuro e claro por variaveis CSS
- superfices glass (`backdrop-filter`) para sidebar/cards/modal
- componentes reutilizaveis: `btn`, `card`, `dash-card`, `check-feedback`
- breakpoints mobile em `980px`, `760px`, `520px`

## Persistencia e Dados Locais

Usa `localStorage` para:

- progresso de questoes marcadas
- favoritos
- notas
- historico de timer
- tema selecionado (claro/escuro)

Chaves principais:

- `englishCoachStateV1`
- `englishCoachTheme`

## Como Rodar

Como e um projeto estatico, basta abrir `src/index.html` no navegador.

Sugestao (servidor local simples):

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000/src/index.html`.

## Como Evoluir Conteudo

- novo topico/categoria: editar `data/topics.js`
- novas perguntas por nivel/fase: editar `data/questions.js`
- novos vocabularios e pronuncia: editar `data/vocabulary.js` (ou base em `topics.js`)
- novas expressoes de apoio: editar `data/expressions.js`

## Convencoes de Codigo

- manter nomes de ids estaveis para nao quebrar handlers do `app.js`
- evitar acoplamento de regra de negocio no HTML
- usar os helpers de dados (`getTopicVocabularyResources`, `getExpressionsByGrammar`) ao expandir
- manter mensagens de feedback no card (UX) em vez de popup bloqueante

## Proximos Passos Recomendados

- modularizar `js/app.js` em arquivos menores por dominio (`render`, `state`, `timer`, `events`)
- adicionar testes de UI (Playwright) para fluxos criticos
- adicionar internacionalizacao (pt/en) e trilhas por objetivo (viagem, entrevista, reuniao)

