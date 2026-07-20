/* =========================================================
   LunaVerse — games.js
   Five vocabulary mini-games, all driven by the same
   language data files used by the lesson pages so content
   never has to be duplicated: Flashcards, Memory Cards,
   Typing Game, Word Match, and Random Quiz.
   ========================================================= */

(function (window, document) {
  "use strict";

  var LANG_FILES = { english: "english", chinese: "chinese", german: "german" };

  /** Flatten every vocabulary entry across all levels/lessons of a language into one pool */
  function getVocabPool(langKey) {
    return window.Luna.fetchData(LANG_FILES[langKey]).then(function (data) {
      if (!data) return [];
      var pool = [];
      data.levels.forEach(function (level) {
        level.lessons.forEach(function (lesson) {
          (lesson.vocabulary || []).forEach(function (v) {
            pool.push({ term: v.term, translation: v.translation, notes: v.notes || "", level: level.code });
          });
        });
      });
      return pool;
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }

  /* ---------------------------------------------------------
     1. Flashcards
     --------------------------------------------------------- */
  function initFlashcards(root) {
    var stageCard = root.querySelector(".flashcard");
    var frontEl = root.querySelector(".flashcard-face.front");
    var backEl = root.querySelector(".flashcard-face.back");
    var counter = root.querySelector("[data-fc-counter]");
    var langSelect = root.querySelector("[data-fc-lang]");
    var pool = [], cursor = 0, known = 0;

    function renderCard() {
      if (!pool.length) return;
      var card = pool[cursor];
      frontEl.querySelector("strong").textContent = card.term;
      backEl.querySelector("strong").textContent = card.translation;
      backEl.querySelector("p").textContent = card.notes || "";
      counter.textContent = (cursor + 1) + " / " + pool.length;
      stageCard.classList.remove("is-flipped");
    }

    function load(langKey) {
      getVocabPool(langKey).then(function (p) {
        pool = sample(p, Math.min(16, p.length));
        cursor = 0; known = 0;
        renderCard();
      });
    }

    stageCard.addEventListener("click", function () { stageCard.classList.toggle("is-flipped"); });
    stageCard.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stageCard.classList.toggle("is-flipped"); }
    });

    root.querySelector("[data-fc-next]").addEventListener("click", function () {
      cursor = (cursor + 1) % pool.length;
      renderCard();
    });
    root.querySelector("[data-fc-prev]").addEventListener("click", function () {
      cursor = (cursor - 1 + pool.length) % pool.length;
      renderCard();
    });
    root.querySelector("[data-fc-shuffle]").addEventListener("click", function () {
      pool = shuffle(pool); cursor = 0; renderCard();
      window.Luna.toast("Shuffled the deck \ud83c\udf00");
    });
    langSelect.addEventListener("change", function () { load(langSelect.value); });

    load(langSelect.value);
  }

  /* ---------------------------------------------------------
     2. Memory Cards
     --------------------------------------------------------- */
  function initMemory(root) {
    var board = root.querySelector("[data-memory-board]");
    var langSelect = root.querySelector("[data-mem-lang]");
    var movesEl = root.querySelector("[data-mem-moves]");
    var statusEl = root.querySelector("[data-mem-status]");
    var flipped = [], matched = 0, moves = 0, lock = false;

    function buildBoard(pairs) {
      var tiles = [];
      pairs.forEach(function (p, i) {
        tiles.push({ pairId: i, label: p.term, type: "term" });
        tiles.push({ pairId: i, label: p.translation, type: "translation" });
      });
      tiles = shuffle(tiles);
      board.innerHTML = tiles.map(function (t, i) {
        return '<div class="memory-tile" data-index="' + i + '" data-pair="' + t.pairId + '">' +
          '<div class="memory-tile-inner">' +
            '<div class="memory-tile-face front">?</div>' +
            '<div class="memory-tile-face back">' + window.Luna.escapeHTML(t.label) + "</div>" +
          "</div></div>";
      }).join("");
      moves = 0; matched = 0; flipped = []; lock = false;
      movesEl.textContent = "0";
      statusEl.textContent = pairs.length + " pairs to find";
      board.querySelectorAll(".memory-tile").forEach(function (tile) {
        tile.addEventListener("click", function () { onTileClick(tile, pairs.length); });
      });
    }

    function onTileClick(tile, totalPairs) {
      if (lock || tile.classList.contains("is-matched") || tile.classList.contains("is-flipped")) return;
      tile.classList.add("is-flipped");
      flipped.push(tile);
      if (flipped.length === 2) {
        lock = true;
        moves++; movesEl.textContent = String(moves);
        var same = flipped[0].dataset.pair === flipped[1].dataset.pair;
        setTimeout(function () {
          if (same) {
            flipped.forEach(function (t) { t.classList.add("is-matched"); });
            matched++;
            statusEl.textContent = matched === totalPairs ? "Solved in " + moves + " moves! \ud83c\udf19" : (totalPairs - matched) + " pairs left";
          } else {
            flipped.forEach(function (t) { t.classList.remove("is-flipped"); });
          }
          flipped = []; lock = false;
        }, same ? 350 : 700);
      }
    }

    function load(langKey) {
      getVocabPool(langKey).then(function (p) {
        buildBoard(sample(p, Math.min(8, p.length)));
      });
    }

    langSelect.addEventListener("change", function () { load(langSelect.value); });
    root.querySelector("[data-mem-restart]").addEventListener("click", function () { load(langSelect.value); });
    load(langSelect.value);
  }

  /* ---------------------------------------------------------
     3. Typing Game
     --------------------------------------------------------- */
  function initTyping(root) {
    var targetEl = root.querySelector("[data-type-target]");
    var input = root.querySelector("[data-type-input]");
    var scoreEl = root.querySelector("[data-type-score]");
    var langSelect = root.querySelector("[data-type-lang]");
    var pool = [], cursor = 0, score = 0, startTime = 0;

    function renderTarget() {
      var word = pool[cursor].translation;
      targetEl.textContent = word;
      input.value = "";
      startTime = Date.now();
    }

    function load(langKey) {
      getVocabPool(langKey).then(function (p) {
        pool = sample(p, Math.min(20, p.length));
        cursor = 0; score = 0;
        scoreEl.textContent = "0";
        if (pool.length) renderTarget();
      });
    }

    input.addEventListener("input", function () {
      var target = pool[cursor].translation;
      var value = input.value;
      var isCorrect = value === target;
      var isPrefix = target.indexOf(value) === 0;
      input.style.borderColor = value.length === 0 ? "" : (isPrefix || isCorrect) ? "var(--luna-teal)" : "var(--luna-coral)";
      if (isCorrect) {
        score++;
        scoreEl.textContent = String(score);
        cursor = (cursor + 1) % pool.length;
        if (cursor === 0) window.Luna.toast("Deck complete! Restarting \u2728");
        renderTarget();
      }
    });

    langSelect.addEventListener("change", function () { load(langSelect.value); });
    load(langSelect.value);
  }

  /* ---------------------------------------------------------
     4. Word Match
     --------------------------------------------------------- */
  function initMatch(root) {
    var leftCol = root.querySelector("[data-match-left]");
    var rightCol = root.querySelector("[data-match-right]");
    var statusEl = root.querySelector("[data-match-status]");
    var langSelect = root.querySelector("[data-match-lang]");
    var selectedLeft = null, matchedCount = 0, pairCount = 0;

    function build(pairs) {
      pairCount = pairs.length; matchedCount = 0; selectedLeft = null;
      var rightItems = shuffle(pairs);
      leftCol.innerHTML = pairs.map(function (p, i) {
        return '<button class="match-item" data-pair="' + i + '" data-side="left">' + window.Luna.escapeHTML(p.term) + "</button>";
      }).join("");
      rightCol.innerHTML = rightItems.map(function (p) {
        var idx = pairs.indexOf(p);
        return '<button class="match-item" data-pair="' + idx + '" data-side="right">' + window.Luna.escapeHTML(p.translation) + "</button>";
      }).join("");
      statusEl.textContent = pairCount + " pairs \u2014 match term to meaning";
      root.querySelectorAll(".match-item").forEach(function (btn) { btn.addEventListener("click", onPick); });
    }

    function onPick(e) {
      var btn = e.currentTarget;
      if (btn.classList.contains("is-matched")) return;
      if (btn.dataset.side === "left") {
        root.querySelectorAll('[data-side="left"]').forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        selectedLeft = btn;
        return;
      }
      if (!selectedLeft) return;
      var isMatch = selectedLeft.dataset.pair === btn.dataset.pair;
      if (isMatch) {
        selectedLeft.classList.add("is-matched");
        btn.classList.add("is-matched");
        selectedLeft.classList.remove("is-selected");
        matchedCount++;
        statusEl.textContent = matchedCount === pairCount ? "Perfect match! \ud83c\udf19" : (pairCount - matchedCount) + " pairs left";
        selectedLeft = null;
      } else {
        btn.classList.add("is-incorrect-flash");
        setTimeout(function () { btn.classList.remove("is-incorrect-flash"); }, 300);
      }
    }

    function load(langKey) {
      getVocabPool(langKey).then(function (p) { build(sample(p, Math.min(6, p.length))); });
    }

    langSelect.addEventListener("change", function () { load(langSelect.value); });
    root.querySelector("[data-match-restart]").addEventListener("click", function () { load(langSelect.value); });
    load(langSelect.value);
  }

  /* ---------------------------------------------------------
     5. Random Quiz
     --------------------------------------------------------- */
  function initQuiz(root) {
    var questionEl = root.querySelector("[data-quiz-question]");
    var optionsEl = root.querySelector("[data-quiz-options]");
    var scoreEl = root.querySelector("[data-quiz-score]");
    var progressEl = root.querySelector("[data-quiz-progress]");
    var langSelect = root.querySelector("[data-quiz-lang]");
    var pool = [], questions = [], cursor = 0, score = 0;

    function buildQuestions(p) {
      return shuffle(p).slice(0, Math.min(10, p.length)).map(function (correct) {
        var distractors = sample(p.filter(function (v) { return v.term !== correct.term; }), 3).map(function (v) { return v.translation; });
        var options = shuffle(distractors.concat([correct.translation]));
        return { term: correct.term, answer: correct.translation, options: options };
      });
    }

    function renderQuestion() {
      if (cursor >= questions.length) {
        questionEl.textContent = "Quiz complete \u2014 you scored " + score + " / " + questions.length + " \ud83c\udf19";
        optionsEl.innerHTML = '<button class="btn btn-primary" data-quiz-restart>Play again</button>';
        optionsEl.querySelector("[data-quiz-restart]").addEventListener("click", function () { load(langSelect.value); });
        progressEl.style.width = "100%";
        return;
      }
      var q = questions[cursor];
      questionEl.textContent = "What does \u201C" + q.term + "\u201D mean?";
      progressEl.style.width = (cursor / questions.length * 100) + "%";
      optionsEl.innerHTML = q.options.map(function (opt) {
        return '<button class="quiz-option" data-option="' + window.Luna.escapeHTML(opt) + '">' + window.Luna.escapeHTML(opt) + "</button>";
      }).join("");
      optionsEl.querySelectorAll(".quiz-option").forEach(function (btn) {
        btn.addEventListener("click", function () { onAnswer(btn, q); });
      });
    }

    function onAnswer(btn, q) {
      optionsEl.querySelectorAll(".quiz-option").forEach(function (b) { b.disabled = true; });
      var picked = btn.dataset.option;
      if (picked === q.answer) {
        btn.classList.add("is-correct");
        score++;
        scoreEl.textContent = String(score);
      } else {
        btn.classList.add("is-incorrect");
        optionsEl.querySelectorAll(".quiz-option").forEach(function (b) {
          if (b.dataset.option === q.answer) b.classList.add("is-correct");
        });
      }
      setTimeout(function () { cursor++; renderQuestion(); }, 900);
    }

    function load(langKey) {
      getVocabPool(langKey).then(function (p) {
        pool = p;
        questions = buildQuestions(pool);
        cursor = 0; score = 0;
        scoreEl.textContent = "0";
        renderQuestion();
      });
    }

    langSelect.addEventListener("change", function () { load(langSelect.value); });
    load(langSelect.value);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var fc = document.querySelector("[data-game='flashcards']");
    var mem = document.querySelector("[data-game='memory']");
    var typ = document.querySelector("[data-game='typing']");
    var mat = document.querySelector("[data-game='match']");
    var quiz = document.querySelector("[data-game='quiz']");
    if (fc) initFlashcards(fc);
    if (mem) initMemory(mem);
    if (typ) initTyping(typ);
    if (mat) initMatch(mat);
    if (quiz) initQuiz(quiz);
  });
})(window, document);
