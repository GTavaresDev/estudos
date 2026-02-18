const PHASES = [
  { id: "warm-up", name: "Warm-up", desc: "Ativação de vocabulário e confiança." },
  { id: "opinion", name: "Opinion & Argument", desc: "Defender ponto de vista de forma prática." },
  { id: "deep-dive", name: "Deep Dive", desc: "Explorar situações reais com mais profundidade." },
  { id: "listening", name: "Long Listening", desc: "Escuta ativa e follow-up natural." },
  { id: "wrap-up", name: "Wrap-up", desc: "Síntese, reflexão e próximos passos." }
];

const LEVELS = {
  beginner: { label: "Beginner", minTime: 30, maxTime: 60, complexity: "simple" },
  intermediate: { label: "Intermediate", minTime: 45, maxTime: 90, complexity: "moderate" },
  advanced: { label: "Advanced", minTime: 60, maxTime: 120, complexity: "complex" }
};


const LEVEL_TEMPLATES = {
  beginner: {
    "warm-up": [
      { text: "What simple words do you know about {{topic}}?", hint: "Diga 3 palavras e uma frase curta para cada.", tag: "speaking", time: 35, grammarFocus: "simple-present", usefulExpressions: ["I usually...", "I like...", "In my routine..."] },
      { text: "When did you first hear about {{topic}}?", hint: "Use passado simples em frases curtas.", tag: "speaking", time: 40, grammarFocus: "past-simple", usefulExpressions: ["I first heard about it when...", "At that time...", "It was..."] }
    ],
    "opinion": [
      { text: "Do you like {{topic}}? Why?", hint: "Use because para justificar.", tag: "speaking", time: 45, grammarFocus: "because-clauses", usefulExpressions: ["I think...", "Because...", "For me..."] },
      { text: "What is one good and one bad thing about {{topic}}?", hint: "Estrutura: One good thing is... / One bad thing is...", tag: "extended", time: 50, grammarFocus: "comparatives", usefulExpressions: ["One good thing is...", "One bad thing is...", "In my opinion..."] }
    ],
    "deep-dive": [
      { text: "How does {{topic}} help people in daily life?", hint: "Dê exemplos simples.", tag: "extended", time: 55, grammarFocus: "simple-present", usefulExpressions: ["For example...", "People can...", "This helps because..."] },
      { text: "If you had one change in {{topic}}, what would it be?", hint: "Use: I would...", tag: "extended", time: 60, grammarFocus: "first-conditional", usefulExpressions: ["I would change...", "This would...", "It could..."] }
    ],
    "listening": [
      { text: "Ask your partner to explain {{topic}} for one minute. Then summarize.", hint: "Resumo com 2-3 frases.", tag: "listening", time: 60, grammarFocus: "reported-ideas", usefulExpressions: ["You said that...", "I understood that...", "So basically..."] },
      { text: "Ask your partner about a personal experience with {{topic}}.", hint: "Faça duas perguntas de follow-up.", tag: "listening", time: 60, grammarFocus: "question-forms", usefulExpressions: ["Can you explain more?", "What happened next?", "How did you feel?"] }
    ],
    "wrap-up": [
      { text: "What was the most useful thing you learned about {{topic}}?", hint: "Frase curta e clara.", tag: "speaking", time: 40, grammarFocus: "past-simple", usefulExpressions: ["The most useful thing was...", "I learned that...", "Now I can..."] },
      { text: "What do you want to practice next about {{topic}}?", hint: "Pense em próximo passo real.", tag: "speaking", time: 40, grammarFocus: "future-plan", usefulExpressions: ["Next time I want to...", "I need to improve...", "My goal is..."] }
    ]
  },
  intermediate: {
    "warm-up": [
      { text: "What comes to your mind when people mention {{topic}}?", hint: "Conecte ideias por 45+ segundos.", tag: "speaking", time: 50, grammarFocus: "linkers", usefulExpressions: ["The first thing that comes to mind is...", "Besides that...", "Another point is..."] },
      { text: "How has your perspective on {{topic}} changed over time?", hint: "Compare passado e presente.", tag: "speaking", time: 60, grammarFocus: "present-perfect", usefulExpressions: ["I used to...", "Nowadays...", "Over time..."] }
    ],
    "opinion": [
      { text: "Do the benefits of {{topic}} outweigh the drawbacks?", hint: "Organize argumentos em duas partes.", tag: "extended", time: 70, grammarFocus: "argument-structure", usefulExpressions: ["On the one hand...", "On the other hand...", "Overall..."] },
      { text: "What is a common misconception about {{topic}}?", hint: "Mostre contraste entre mito e realidade.", tag: "extended", time: 75, grammarFocus: "contrast", usefulExpressions: ["Many people assume...", "In reality...", "What actually happens is..."] }
    ],
    "deep-dive": [
      { text: "How does {{topic}} influence behavior in your city or workplace?", hint: "Use exemplos concretos e resultados.", tag: "extended", time: 80, grammarFocus: "cause-effect", usefulExpressions: ["A clear example is...", "This leads to...", "As a result..."] },
      { text: "If {{topic}} disappeared tomorrow, what would change first?", hint: "Raciocínio em cadeia.", tag: "extended", time: 85, grammarFocus: "second-conditional", usefulExpressions: ["If it disappeared...", "The immediate impact would be...", "Then..."] }
    ],
    "listening": [
      { text: "Ask your partner for a 90-second opinion on {{topic}} and summarize key points.", hint: "Resumo + reação crítica.", tag: "listening", time: 90, grammarFocus: "summary", usefulExpressions: ["Your main point was...", "I agree because...", "I would challenge..."] },
      { text: "Ask your partner to defend the opposite view on {{topic}}.", hint: "Pratique devil's advocate.", tag: "listening", time: 90, grammarFocus: "debate-language", usefulExpressions: ["I see your point, however...", "Could we consider...", "From another angle..."] }
    ],
    "wrap-up": [
      { text: "What argument was strongest today and why?", hint: "Foque em lógica e evidência.", tag: "speaking", time: 60, grammarFocus: "reasoning", usefulExpressions: ["The strongest argument was...", "It stood out because...", "Evidence included..."] },
      { text: "What speaking skill do you want to improve next?", hint: "Defina ação clara.", tag: "speaking", time: 55, grammarFocus: "goal-setting", usefulExpressions: ["I still struggle with...", "My next step is...", "I'll practice by..."] }
    ]
  },
  advanced: {
    "warm-up": [
      { text: "Frame {{topic}} as a societal challenge in under 60 seconds.", hint: "Síntese sofisticada com precisão.", tag: "extended", time: 65, grammarFocus: "concise-framing", usefulExpressions: ["At its core...", "The challenge lies in...", "What complicates it is..."] },
      { text: "Which assumptions shape public discourse around {{topic}}?", hint: "Questione premissas.", tag: "extended", time: 75, grammarFocus: "critical-thinking", usefulExpressions: ["The dominant assumption is...", "This narrative ignores...", "A more nuanced view is..."] }
    ],
    "opinion": [
      { text: "To what extent should policy regulate {{topic}}?", hint: "Balanceie liberdade e responsabilidade.", tag: "extended", time: 90, grammarFocus: "hedging", usefulExpressions: ["To some extent...", "A balanced policy would...", "Regulation is justified when..."] },
      { text: "Defend and then challenge your own position on {{topic}}.", hint: "Argumentação bidirecional.", tag: "extended", time: 95, grammarFocus: "counterargument", usefulExpressions: ["My initial stance is...", "That said...", "A serious objection is..."] }
    ],
    "deep-dive": [
      { text: "Analyze long-term consequences of {{topic}} across work, culture, and education.", hint: "Estruture por domínios.", tag: "extended", time: 110, grammarFocus: "multi-domain-analysis", usefulExpressions: ["In the workplace...", "Culturally speaking...", "In educational terms..."] },
      { text: "What trade-offs are unavoidable when scaling {{topic}} globally?", hint: "Pense em eficiência, ética e acesso.", tag: "extended", time: 120, grammarFocus: "trade-off-language", usefulExpressions: ["A key trade-off is...", "Scaling creates...", "The cost of this approach is..."] }
    ],
    "listening": [
      { text: "Ask for a two-minute mini-lecture on {{topic}} and interrogate the logic.", hint: "Resumo crítico + perguntas de precisão.", tag: "listening", time: 120, grammarFocus: "critical-listening", usefulExpressions: ["Your claim relies on...", "What evidence supports...", "How would you respond to..."] },
      { text: "Run a structured debate: your partner argues for regulation, you against (then switch).", hint: "Troca de posição para flexibilidade verbal.", tag: "listening", time: 120, grammarFocus: "debate-register", usefulExpressions: ["Let me challenge that...", "A stronger case would require...", "I concede that..., yet..."] }
    ],
    "wrap-up": [
      { text: "Which idea from today deserves deeper investigation and why?", hint: "Apresente recorte específico.", tag: "speaking", time: 70, grammarFocus: "research-language", usefulExpressions: ["The most fertile idea is...", "It matters because...", "A next question would be..."] },
      { text: "What linguistic choices made your argument more persuasive today?", hint: "Meta-análise de performance.", tag: "speaking", time: 70, grammarFocus: "metacognition", usefulExpressions: ["What worked well was...", "I noticed that...", "Next time I'll refine..."] }
    ]
  }
};

const FILL_BLANK_TEMPLATES = {
  beginner: [
    { sentence: "I usually ___ about {{topic}} with my friends.", answers: ["talk", "chat"] },
    { sentence: "Yesterday I ___ something new about {{topic}}.", answers: ["learned", "found out"] }
  ],
  intermediate: [
    { sentence: "{{topic}} has ___ the way people communicate.", answers: ["changed", "transformed"] },
    { sentence: "If I had more time, I would ___ {{topic}} in depth.", answers: ["explore", "study"] }
  ],
  advanced: [
    { sentence: "Public opinion on {{topic}} is often ___ by media framing.", answers: ["shaped", "influenced"] },
    { sentence: "Any policy on {{topic}} must ___ competing priorities.", answers: ["balance", "reconcile"] }
  ]
};
