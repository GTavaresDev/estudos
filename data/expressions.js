const EXPRESSIONS_BY_GRAMMAR = (() => {
  const map = {};
  Object.values(LEVEL_TEMPLATES).forEach((levelConfig) => {
    Object.values(levelConfig).forEach((phaseTemplates) => {
      phaseTemplates.forEach((tpl) => {
        if (!tpl.grammarFocus) return;
        if (!map[tpl.grammarFocus]) map[tpl.grammarFocus] = new Set();
        (tpl.usefulExpressions || []).forEach((expr) => map[tpl.grammarFocus].add(expr));
      });
    });
  });
  return Object.fromEntries(Object.entries(map).map(([k, setVal]) => [k, Array.from(setVal)]));
})();

function getExpressionsByGrammar(grammarFocus) {
  return EXPRESSIONS_BY_GRAMMAR[grammarFocus] || [];
}
