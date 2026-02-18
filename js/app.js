let predefinedQuestions = [];
let currentPhase = 0;
let currentLevel = "beginner";
let currentMode = "lesson";
let selectedCategory = TOPIC_CATALOG[0].id;
let selectedTopicId = TOPIC_CATALOG[0].topics[0].id;
let topicLabel = TOPIC_CATALOG[0].topics[0].label;
let answered = {};
let favorites = {};
let notesStore = {};
let timerHistory = [];
let activeQuestionId = "";
let randomOnly = false;
let timerState = { interval: null, remaining: 0, total: 0, paused: false, question: "" };
const phaseProgressTotals = {};
let currentTheme = "dark";

function getTopicById(categoryId, topicId) {
  const category = TOPIC_CATALOG.find((c) => c.id === categoryId);
  if (!category) return null;
  return category.topics.find((t) => t.id === topicId) || null;
}

function normalizeTime(level, baseTime) {
  const cfg = LEVELS[level];
  return Math.max(cfg.minTime, Math.min(cfg.maxTime, baseTime));
}

function buildPredefinedQuestions() {
  const result = [];
  Object.keys(LEVEL_TEMPLATES).forEach((levelKey) => {
    TOPIC_CATALOG.forEach((category) => {
      category.topics.forEach((topic) => {
        PHASES.forEach((phase) => {
          const templates = LEVEL_TEMPLATES[levelKey][phase.id];
          templates.forEach((tpl, idx) => {
            const qId = `${levelKey}-${category.id}-${topic.id}-${phase.id}-${idx}`;
            result.push({
              id: qId,
              level: levelKey,
              phase: phase.id,
              category: category.id,
              topic: topic.id,
              text: tpl.text,
              hint: tpl.hint,
              tag: tpl.tag,
              time: normalizeTime(levelKey, tpl.time),
              usefulExpressions: (tpl.usefulExpressions && tpl.usefulExpressions.length)
                ? tpl.usefulExpressions
                : getExpressionsByGrammar(tpl.grammarFocus),
              grammarFocus: tpl.grammarFocus
            });
          });
        });
      });
    });
  });
  return result;
}

function saveState() {
  const payload = { answered, favorites, notesStore, timerHistory, phaseProgressTotals };
  localStorage.setItem("englishCoachStateV1", JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem("englishCoachStateV1");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    answered = parsed.answered || {};
    favorites = parsed.favorites || {};
    notesStore = parsed.notesStore || {};
    timerHistory = parsed.timerHistory || [];
    Object.assign(phaseProgressTotals, parsed.phaseProgressTotals || {});
  } catch (err) {
    console.warn("Estado local inválido:", err);
  }
}

function updateCategoryOptions() {
  const sel = document.getElementById("categorySelect");
  sel.innerHTML = TOPIC_CATALOG.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");
  sel.value = selectedCategory;
}

function updateTopicOptions() {
  const cat = TOPIC_CATALOG.find((c) => c.id === selectedCategory) || TOPIC_CATALOG[0];
  const sel = document.getElementById("topicSelect");
  sel.innerHTML = cat.topics.map((t) => `<option value="${t.id}">${t.label} — ${t.description}</option>`).join("");
  if (!cat.topics.some((t) => t.id === selectedTopicId)) selectedTopicId = cat.topics[0].id;
  sel.value = selectedTopicId;
}

function updatePhaseList() {
  const list = document.getElementById("phaseList");
  const topicKey = getTopicKey();
  list.innerHTML = PHASES.map((phase, i) => {
    const qs = getFilteredQuestions(phase.id);
    const done = qs.length > 0 && qs.every((q) => answered[`${topicKey}|${q.id}`]);
    const cls = `${i === currentPhase ? "active" : ""} ${done ? "done" : ""}`.trim();
    return `<div class="phase-item ${cls}" data-phase-idx="${i}"><span class="phase-dot"></span>${phase.name}</div>`;
  }).join("");
  list.querySelectorAll(".phase-item").forEach((el) => {
    el.addEventListener("click", () => goToPhase(Number(el.dataset.phaseIdx)));
  });
}

function getTopicKey() {
  return `${currentLevel}|${selectedCategory}|${selectedTopicId}|${topicLabel}`;
}

function getEffectiveTopicLabel() {
  const custom = document.getElementById("customTopicInput").value.trim();
  if (custom) return custom;
  const topic = getTopicById(selectedCategory, selectedTopicId);
  return topic ? topic.label : "general topic";
}

function getFilteredQuestions(phaseId) {
  const all = predefinedQuestions.filter((q) =>
    q.level === currentLevel &&
    q.category === selectedCategory &&
    q.topic === selectedTopicId &&
    q.phase === phaseId
  );
  return all;
}

function buildFillBlank(level, topic) {
  return FILL_BLANK_TEMPLATES[level].map((ex, idx) => ({
    id: `${level}-${selectedCategory}-${selectedTopicId}-fill-${idx}`,
    sentence: ex.sentence.replace(/{{topic}}/g, topic),
    answers: ex.answers
  }));
}

function renderDashboard(currentPhaseQuestions) {
  const topicKey = getTopicKey();
  const totalForTopic = PHASES.reduce((sum, p) => sum + getFilteredQuestions(p.id).length, 0);
  const doneForTopic = Object.keys(answered).filter((k) => k.startsWith(topicKey + "|") && answered[k]).length;
  const completion = totalForTopic ? Math.round((doneForTopic / totalForTopic) * 100) : 0;
  const timerTotal = timerHistory.reduce((acc, t) => acc + t.duration, 0);
  const favCount = Object.keys(favorites).filter((k) => favorites[k]).length;
  const phaseDone = currentPhaseQuestions.filter((q) => answered[`${topicKey}|${q.id}`]).length;
  return `
    <section class="dashboard">
      <article class="dash-card">
        <div class="dash-label">Nível</div>
        <div class="dash-value">${LEVELS[currentLevel].label}</div>
        <div class="dash-sub">${LEVELS[currentLevel].complexity}</div>
      </article>
      <article class="dash-card">
        <div class="dash-label">Progresso do tópico</div>
        <div class="dash-value">${completion}%</div>
        <div class="bar-track"><div class="bar-fill" style="width:${completion}%"></div></div>
      </article>
      <article class="dash-card">
        <div class="dash-label">Fase atual</div>
        <div class="dash-value">${phaseDone}/${currentPhaseQuestions.length || 0}</div>
        <div class="dash-sub">${PHASES[currentPhase].name}</div>
      </article>
      <article class="dash-card">
        <div class="dash-label">Tempo praticado</div>
        <div class="dash-value">${Math.round(timerTotal / 60)}m</div>
        <div class="dash-sub">Favoritas: ${favCount}</div>
      </article>
    </section>
  `;
}

function renderQuestionCard(q, idx) {
  const topicKey = getTopicKey();
  const done = !!answered[`${topicKey}|${q.id}`];
  const fav = !!favorites[q.id];
  const renderedText = q.text.replace(/{{topic}}/g, `<span class="blank-topic">${topicLabel}</span>`);
  const expressions = q.usefulExpressions.map((e) => `<li>${e}</li>`).join("");
  const noteVal = notesStore[q.id] || "";
  const showHint = currentMode !== "practice";
  const grammar = buildGrammarExercise(q);
  const topicData = getTopicById(selectedCategory, selectedTopicId);
  const rolePlay = topicData ? topicData.rolePlays[idx % topicData.rolePlays.length] : "";
  const fillEx = buildFillBlank(currentLevel, topicLabel)[idx % 2];

  return `
    <article class="card question-card ${done ? "answered" : ""}" id="q-${q.id}">
      <div class="q-meta">
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap">
          <span class="q-tag ${q.tag}">${q.tag}</span>
          <span class="badge level-${currentLevel}">${LEVELS[currentLevel].label}</span>
          <span class="badge">${q.phase}</span>
        </div>
        <span class="small">#${idx + 1}</span>
      </div>
      <p class="q-text">${renderedText}</p>
      ${showHint ? `<p class="q-hint">${q.hint}</p>` : ""}

      <div class="stack">
        <section class="card" style="padding:0.7rem">
          <p class="mini-title">Grammar focus</p>
          <p class="small">${q.grammarFocus}</p>
          <p style="margin-top:0.4rem;font-size:0.78rem">${grammar.prompt}</p>
          <div class="answer-check-row">
            <input class="topic-input answer-input" type="text" id="grammar-${q.id}" placeholder="Digite sua resposta">
            <button class="btn btn-green btn-icon-check js-check-grammar" type="button" aria-label="Verificar resposta do grammar focus" title="Verificar" data-question-id="${q.id}" data-answer="${escapeHtmlAttr(serializeAnswers(grammar.answers))}" data-sentence="${escapeHtmlAttr(grammar.prompt)}" onclick="checkGrammarFromButton(this)">🔍</button>
          </div>
          <div id="grammar-feedback-${q.id}" class="check-feedback" aria-live="polite"></div>
        </section>

        <section class="card" style="padding:0.7rem">
          <p class="mini-title">Fill in the blank</p>
          <p style="font-size:0.8rem">${fillEx.sentence}</p>
          <div class="answer-check-row">
            <input class="topic-input answer-input" type="text" id="fill-${q.id}" placeholder="Palavra faltando">
            <button class="btn btn-green btn-icon-check js-check-fill" type="button" aria-label="Verificar resposta do fill in the blank" title="Verificar" data-question-id="${q.id}" data-answer="${escapeHtmlAttr(serializeAnswers(fillEx.answers))}" data-sentence="${escapeHtmlAttr(fillEx.sentence)}" onclick="checkFillFromButton(this)">🔍</button>
          </div>
          <div id="fill-feedback-${q.id}" class="check-feedback" aria-live="polite"></div>
        </section>
      </div>

      <div class="split" style="margin-top:0.8rem">
        <div class="stack">
          <section class="card" style="padding:0.7rem">
            <p class="mini-title">Useful expressions</p>
            <ul class="list">${expressions}</ul>
          </section>

          <section class="card" style="padding:0.7rem">
            <p class="mini-title">Role-play scenario</p>
            <p style="font-size:0.8rem;line-height:1.5">${rolePlay}</p>
          </section>
        </div>

        <div class="stack">
          <section class="card" style="padding:0.7rem">
            <p class="mini-title">Notas e feedback</p>
            <textarea class="textarea" rows="5" id="note-${q.id}" placeholder="Anote correções, vocabulário novo e feedback">${noteVal}</textarea>
            <div class="btn-row" style="margin-top:0.4rem">
              <button class="btn btn-green" type="button" onclick="saveNote('${q.id}')">Salvar nota</button>
              <button class="btn ${fav ? "btn-danger" : "btn-blue"}" type="button" onclick="toggleFavorite('${q.id}')">${fav ? "Remover favorito" : "Favoritar"}</button>
            </div>
          </section>
        </div>
      </div>

      <div class="btn-row" style="margin-top:0.6rem">
        <button class="btn" type="button" onclick="startTimer(${q.time}, '${escapeSingle(q.text.replace(/{{topic}}/g, topicLabel))}', '${q.id}')">Iniciar timer ${q.time}s</button>
        <button class="btn btn-green" type="button" onclick="markDone('${q.id}')">${done ? "Marcada" : "Marcar concluída"}</button>
        ${done ? `<button class="btn btn-danger" type="button" onclick="unmarkDone('${q.id}')">Desmarcar</button>` : ""}
      </div>
    </article>
  `;
}

function renderVocabularyPanel() {
  const topic = getTopicById(selectedCategory, selectedTopicId);
  if (!topic) return "";
  const resources = getTopicVocabularyResources(selectedTopicId);
  const rows = resources.vocabulary.map((v) => `
    <li>
      <strong>${v.word}</strong> — ${v.meaning}<br>
      <span class="small">${v.example}</span>
      <button class="btn" style="margin-top:0.25rem" type="button" onclick="speak('${escapeSingle(v.word)}')">Pronunciar</button>
    </li>
  `).join("");
  const tips = resources.pronunciationTips.map((t) => `<li>${t}</li>`).join("");
  return `
    <section class="card">
      <p class="mini-title">Vocabulary builder</p>
      <ul class="list">${rows}</ul>
      <p class="mini-title" style="margin-top:0.8rem">Dicas de pronúncia</p>
      <ul class="list">${tips}</ul>
    </section>
  `;
}

function renderHistoryPanel() {
  const rows = timerHistory.slice(-5).reverse().map((h) => `<div>${h.topic} • ${h.duration}s • ${h.when}</div>`).join("");
  return `
    <section class="card">
      <p class="mini-title">Histórico de timer</p>
      <div class="history-list">${rows || "<div>Sem histórico ainda.</div>"}</div>
    </section>
  `;
}

function renderPhase(idx) {
  currentPhase = idx;
  const phase = PHASES[idx];
  const qs = getFilteredQuestions(phase.id);
  const main = document.getElementById("mainArea");
  const dataset = currentMode === "practice" || randomOnly ? [qs[Math.floor(Math.random() * qs.length)]].filter(Boolean) : qs;

  if (!dataset.length) {
    main.innerHTML = `
      ${renderDashboard(qs)}
      <section class="card"><p>Não há questões para este filtro. Escolha outro tópico/categoria.</p></section>
    `;
    updatePhaseList();
    return;
  }

  const questionHTML = dataset.map((q, i) => renderQuestionCard(q, i)).join("");
  const sidePanels = `
    <section class="stack">
      ${renderVocabularyPanel()}
      ${renderHistoryPanel()}
      <section class="card">
        <p class="mini-title">Resumo da fase</p>
        <p class="small">Modo: ${currentMode}. Tema: ${topicLabel}. Categoria: ${TOPIC_CATALOG.find((c) => c.id === selectedCategory).label}.</p>
      </section>
    </section>
  `;

  main.innerHTML = `
    ${renderDashboard(qs)}
    <section class="phase-header">
      <p class="phase-number">Fase ${idx + 1} de ${PHASES.length}</p>
      <h2 class="phase-name">${phase.name}</h2>
      <p class="phase-desc">${phase.desc}</p>
    </section>
    <section class="split">
      <div class="stack">${questionHTML}</div>
      ${sidePanels}
    </section>
    <div class="btn-row">
      ${idx > 0 ? `<button class="btn" type="button" onclick="goToPhase(${idx - 1})">Fase anterior</button>` : ""}
      ${idx < PHASES.length - 1 ? `<button class="btn btn-blue" type="button" onclick="goToPhase(${idx + 1})">Próxima fase</button>` : ""}
    </div>
  `;
  updatePhaseList();
  main.scrollTo({ top: 0, behavior: "smooth" });
}

function goToPhase(idx) {
  if (idx < 0 || idx >= PHASES.length) return;
  renderPhase(idx);
}

function generateLesson() {
  currentLevel = document.getElementById("levelSelect").value;
  currentMode = document.getElementById("modeSelect").value;
  selectedCategory = document.getElementById("categorySelect").value;
  selectedTopicId = document.getElementById("topicSelect").value;
  topicLabel = getEffectiveTopicLabel();
  randomOnly = false;
  renderPhase(0);
}

function randomLesson() {
  currentLevel = document.getElementById("levelSelect").value;
  currentMode = "practice";
  document.getElementById("modeSelect").value = "practice";
  selectedCategory = document.getElementById("categorySelect").value;
  selectedTopicId = document.getElementById("topicSelect").value;
  topicLabel = getEffectiveTopicLabel();
  randomOnly = true;
  const randomPhase = Math.floor(Math.random() * PHASES.length);
  renderPhase(randomPhase);
}

function markDone(questionId) {
  const key = `${getTopicKey()}|${questionId}`;
  answered[key] = true;
  phaseProgressTotals[questionId] = (phaseProgressTotals[questionId] || 0) + 1;
  saveState();
  renderPhase(currentPhase);
}

function unmarkDone(questionId) {
  const key = `${getTopicKey()}|${questionId}`;
  delete answered[key];
  saveState();
  renderPhase(currentPhase);
}

function toggleFavorite(questionId) {
  favorites[questionId] = !favorites[questionId];
  saveState();
  renderPhase(currentPhase);
}

function saveNote(questionId) {
  const field = document.getElementById(`note-${questionId}`);
  if (!field) return;
  notesStore[questionId] = field.value;
  saveState();
}

function buildGrammarExercise(q) {
  const map = {
    "simple-present": { prompt: `Complete: "I usually ____ ${topicLabel} every week."`, answers: ["practice", "study"] },
    "past-simple": { prompt: `Complete: "Last year, I ____ more about ${topicLabel}."`, answers: ["learned", "studied"] },
    "first-conditional": { prompt: `Complete: "If I have time, I ____ ${topicLabel} more."`, answers: ["will study", "will practice"] },
    "present-perfect": { prompt: `Complete: "I ____ interested in ${topicLabel} for years."`, answers: ["have been"] },
    "second-conditional": { prompt: `Complete: "If ${topicLabel} disappeared, people ____ affected."`, answers: ["would be"] },
    "trade-off-language": { prompt: `Complete: "A key trade-off ____ efficiency and fairness."`, answers: ["is between", "exists between"] }
  };
  return map[q.grammarFocus] || { prompt: `Complete: "This topic ____ important in real life."`, answers: ["is"] };
}

function normalizeAnswer(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function serializeAnswers(answers) {
  return (answers || []).join("||");
}

function deserializeAnswers(raw) {
  return String(raw || "")
    .split("||")
    .map((x) => x.trim())
    .filter(Boolean);
}

function fillSentence(sentence, answer) {
  return String(sentence || "").replace("___", answer).replace("____", answer);
}

function writeCheckFeedback(type, questionId, ok, optionsText, phraseText) {
  const el = document.getElementById(`${type}-feedback-${questionId}`);
  if (!el) return;
  const header = ok ? "Correto!" : "Ainda não.";
  const label = type === "grammar" ? "Frase exemplo" : "Frase completa";
  el.classList.remove("success", "error");
  el.classList.add(ok ? "success" : "error");
  el.style.display = "block";
  el.textContent = `${header}\nOpções aceitas: ${optionsText}\n${label}: ${phraseText}`;
}

function checkFill(questionId, answers, sentence) {
  const accepted = Array.isArray(answers) ? answers : [answers];
  const val = normalizeAnswer(document.getElementById(`fill-${questionId}`).value || "");
  const normalizedAccepted = accepted.map(normalizeAnswer);
  const ok = normalizedAccepted.includes(val);
  const optionsText = accepted.join(" | ");
  const phraseText = fillSentence(sentence, accepted[0] || "");
  writeCheckFeedback("fill", questionId, ok, optionsText, phraseText);
}

function checkGrammar(questionId, answers, sentence) {
  const accepted = Array.isArray(answers) ? answers : [answers];
  const val = normalizeAnswer(document.getElementById(`grammar-${questionId}`).value || "");
  const normalizedAccepted = accepted.map(normalizeAnswer);
  const ok = normalizedAccepted.includes(val);
  const optionsText = accepted.join(" | ");
  const phraseText = fillSentence(sentence, accepted[0] || "");
  writeCheckFeedback("grammar", questionId, ok, optionsText, phraseText);
}

function checkGrammarFromButton(btn) {
  const qid = btn.dataset.questionId;
  const answers = deserializeAnswers(decodeHtmlAttr(btn.dataset.answer || ""));
  const sentence = decodeHtmlAttr(btn.dataset.sentence || "");
  checkGrammar(qid, answers, sentence);
}

function checkFillFromButton(btn) {
  const qid = btn.dataset.questionId;
  const answers = deserializeAnswers(decodeHtmlAttr(btn.dataset.answer || ""));
  const sentence = decodeHtmlAttr(btn.dataset.sentence || "");
  checkFill(qid, answers, sentence);
}

function startTimer(seconds, question, qId) {
  closeTimer();
  timerState.remaining = seconds;
  timerState.total = seconds;
  timerState.paused = false;
  timerState.question = question.replace(/<[^>]+>/g, "");
  activeQuestionId = qId;
  document.getElementById("timerNum").textContent = timerState.remaining;
  document.getElementById("timerQ").textContent = timerState.question;
  document.getElementById("timerOverlay").classList.add("active");
  tickTimer();
  timerState.interval = setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (timerState.paused) return;
  timerState.remaining -= 1;
  const timerNum = document.getElementById("timerNum");
  if (timerState.remaining <= 0) {
    timerNum.textContent = "✓";
    timerNum.style.color = "var(--green)";
    pushTimerHistory(timerState.total);
    clearInterval(timerState.interval);
    timerState.interval = null;
    return;
  }
  timerNum.textContent = timerState.remaining;
  timerNum.style.color = timerState.remaining <= 10 ? "var(--red)" : "var(--accent)";
  if (timerState.remaining <= 3) beep();
}

function pauseTimer() {
  timerState.paused = true;
}

function resumeTimer() {
  if (!timerState.interval) return;
  timerState.paused = false;
}

function closeTimer() {
  if (timerState.interval) clearInterval(timerState.interval);
  timerState.interval = null;
  timerState.paused = false;
  document.getElementById("timerOverlay").classList.remove("active");
}

function pushTimerHistory(duration) {
  timerHistory.push({
    duration,
    topic: topicLabel,
    when: new Date().toLocaleString("pt-BR")
  });
  if (timerHistory.length > 100) timerHistory = timerHistory.slice(-100);
  saveState();
}

function beep() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = 0.04;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

function speak(text) {
  if (!("speechSynthesis" in window)) return alert("Seu navegador não suporta síntese de voz.");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

function exportReport() {
  const report = {
    level: currentLevel,
    mode: currentMode,
    category: selectedCategory,
    topic: topicLabel,
    answeredCount: Object.values(answered).filter(Boolean).length,
    favoriteCount: Object.values(favorites).filter(Boolean).length,
    notes: notesStore,
    timerHistory: timerHistory.slice(-20)
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `english-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function escapeSingle(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, " ");
}

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeHtmlAttr(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function toggleSidebar() {
  const app = document.querySelector(".app");
  app.classList.toggle("sidebar-collapsed");
  const isCollapsed = app.classList.contains("sidebar-collapsed");
  const btn = document.getElementById("sidebarToggleBtn");
  btn.textContent = isCollapsed ? "▶" : "◀";
  btn.setAttribute("aria-label", isCollapsed ? "Expandir sidebar" : "Contrair sidebar");
  btn.title = isCollapsed ? "Expandir sidebar" : "Contrair sidebar";
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  currentTheme = isLight ? "light" : "dark";
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.textContent = isLight ? "🌙" : "☀";
  btn.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo branco");
  btn.title = isLight ? "Ativar modo escuro" : "Ativar modo branco";
  localStorage.setItem("englishCoachTheme", currentTheme);
}

function toggleTheme() {
  applyTheme(currentTheme === "light" ? "dark" : "light");
}

function bindEvents() {
  document.getElementById("categorySelect").addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    updateTopicOptions();
  });
  document.getElementById("topicSelect").addEventListener("change", (e) => {
    selectedTopicId = e.target.value;
  });
  document.getElementById("generateBtn").addEventListener("click", generateLesson);
  document.getElementById("randomBtn").addEventListener("click", randomLesson);
  document.getElementById("exportBtn").addEventListener("click", exportReport);
  document.getElementById("pauseTimerBtn").addEventListener("click", pauseTimer);
  document.getElementById("resumeTimerBtn").addEventListener("click", resumeTimer);
  document.getElementById("closeTimerBtn").addEventListener("click", closeTimer);
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
  document.getElementById("sidebarToggleBtn").addEventListener("click", toggleSidebar);
  document.getElementById("mainArea").addEventListener("click", (ev) => {
    const grammarBtn = ev.target.closest(".js-check-grammar");
    if (grammarBtn) {
      const qid = grammarBtn.dataset.questionId;
      const answers = deserializeAnswers(decodeHtmlAttr(grammarBtn.dataset.answer || ""));
      const sentence = decodeHtmlAttr(grammarBtn.dataset.sentence || "");
      checkGrammar(qid, answers, sentence);
      return;
    }
    const fillBtn = ev.target.closest(".js-check-fill");
    if (fillBtn) {
      const qid = fillBtn.dataset.questionId;
      const answers = deserializeAnswers(decodeHtmlAttr(fillBtn.dataset.answer || ""));
      const sentence = decodeHtmlAttr(fillBtn.dataset.sentence || "");
      checkFill(qid, answers, sentence);
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.altKey && ev.key.toLowerCase() === "g") generateLesson();
    if (ev.altKey && ev.key.toLowerCase() === "n") goToPhase(Math.min(PHASES.length - 1, currentPhase + 1));
    if (ev.altKey && ev.key.toLowerCase() === "p") goToPhase(Math.max(0, currentPhase - 1));
  });
}

function init() {
  const savedTheme = localStorage.getItem("englishCoachTheme") || "dark";
  applyTheme(savedTheme === "light" ? "light" : "dark");
  loadState();
  predefinedQuestions = buildPredefinedQuestions();
  updateCategoryOptions();
  updateTopicOptions();
  bindEvents();
  updatePhaseList();
}

init();
