/* =========================================================
   LunaVerse — lessons.js
   Shared renderer for the three language pages (English,
   Chinese, German). Reads the page's `data-lang-file`
   attribute to know which JSON file to load, then renders
   level tabs, a lesson list, and an individual lesson view
   with its vocabulary table.
   ========================================================= */

(function (window, document) {
  "use strict";

  function vocabRow(v, isChinese) {
    var Luna = window.Luna;
    if (isChinese) {
      return "<tr><td><span class=\"vocab-hanzi\">" + Luna.escapeHTML(v.term) + '</span></td><td><span class="vocab-pinyin">' + Luna.escapeHTML(v.pinyin || "") + "</span></td><td>" + Luna.escapeHTML(v.translation) + "</td><td>" + Luna.escapeHTML(v.notes || "") + "</td></tr>";
    }
    return "<tr><td><strong>" + Luna.escapeHTML(v.term) + "</strong></td><td>" + Luna.escapeHTML(v.translation) + "</td><td>" + Luna.escapeHTML(v.notes || "") + "</td></tr>";
  }

  function renderLessonDetail(lesson, langData, mount) {
    var Luna = window.Luna;
    var isChinese = langData.slug === "chinese";
    var vocabHeadRow = isChinese
      ? "<tr><th>Character</th><th>Pinyin</th><th>Meaning</th><th>Notes</th></tr>"
      : "<tr><th>Term</th><th>Meaning</th><th>Notes</th></tr>";

    mount.innerHTML =
      '<button class="btn btn-ghost btn-sm" data-back-to-list type="button">\u2190 Back to lessons</button>' +
      '<article class="reader" style="margin-top:1.5rem;">' +
        '<span class="badge-level">' + Luna.escapeHTML(langData.language) + " \u00B7 " + Luna.escapeHTML(lesson._levelCode) + "</span>" +
        "<h1 style=\"margin-top:0.75rem;\">" + Luna.escapeHTML(lesson.title) + "</h1>" +
        '<p class="lead">' + Luna.escapeHTML(lesson.summary) + "</p>" +
        '<div class="reader-body">' + lesson.content.map(function (p) { return "<p>" + Luna.escapeHTML(p) + "</p>"; }).join("") + "</div>" +
        (lesson.vocabulary && lesson.vocabulary.length ? (
          "<h2>Key Vocabulary</h2>" +
          '<div style="overflow-x:auto;"><table class="vocab-table">' +
            "<thead>" + vocabHeadRow + "</thead>" +
            "<tbody>" + lesson.vocabulary.map(function (v) { return vocabRow(v, isChinese); }).join("") + "</tbody>" +
          "</table></div>"
        ) : "") +
        '<div class="card" style="margin-top:2rem; background:var(--accent-soft); border:none;">' +
          '<p style="margin:0;">Want to practice this vocabulary? <a href="games.html" style="color:var(--accent); font-weight:600;">Try a mini game \u2192</a></p>' +
        "</div>" +
      "</article>";

    mount.querySelector("[data-back-to-list]").addEventListener("click", function () {
      history.pushState({}, "", window.location.pathname);
      renderListView();
    });
  }

  var langData = null, activeLevel = null, listView, detailView, tabsMount, listMount;

  function renderLevelTabs() {
    tabsMount.innerHTML = langData.levels.map(function (level) {
      return '<button class="level-tab' + (level.code === activeLevel ? " is-active" : "") + '" data-level="' + level.code + '" type="button">' + level.title + "</button>";
    }).join("");
    tabsMount.querySelectorAll(".level-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeLevel = tab.dataset.level;
        renderLevelTabs();
        renderLessonList();
      });
    });
  }

  function renderLessonList() {
    var level = langData.levels.find(function (l) { return l.code === activeLevel; });
    if (!level) return;
    var descEl = document.querySelector("[data-level-description]");
    if (descEl) descEl.textContent = level.description || "";
    listMount.innerHTML = level.lessons.map(function (lesson, i) {
      return '<button class="lesson-row" data-lesson-id="' + lesson.id + '" type="button" style="width:100%; text-align:left; cursor:pointer;">' +
        '<span class="lesson-row-index">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="lesson-row-body"><h4>' + window.Luna.escapeHTML(lesson.title) + "</h4><p>" + window.Luna.escapeHTML(lesson.summary) + "</p></span>" +
        '<span class="tag">' + window.Luna.escapeHTML(lesson.type) + "</span>" +
      "</button>";
    }).join("");
    listMount.querySelectorAll("[data-lesson-id]").forEach(function (row) {
      row.addEventListener("click", function () {
        var lesson = level.lessons.find(function (l) { return l.id === row.dataset.lessonId; });
        lesson._levelCode = level.code;
        openLesson(lesson, level.code);
      });
    });
  }

  function renderListView() {
    listView.style.display = "block";
    detailView.style.display = "none";
  }

  function openLesson(lesson, levelCode) {
    lesson._levelCode = levelCode;
    listView.style.display = "none";
    detailView.style.display = "block";
    renderLessonDetail(lesson, langData, detailView);
    var url = new URL(window.location.href);
    url.searchParams.set("level", levelCode);
    url.searchParams.set("lesson", lesson.id);
    history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.querySelector("[data-lang-file]");
    if (!page) return;
    var file = page.getAttribute("data-lang-file");

    tabsMount = document.querySelector("[data-level-tabs]");
    listMount = document.querySelector("[data-lesson-list]");
    listView = document.querySelector("[data-lesson-list-view]");
    detailView = document.querySelector("[data-lesson-detail-view]");

    window.Luna.fetchData(file).then(function (data) {
      if (!data) return;
      langData = data;

      var titleEl = document.querySelector("[data-lang-title]");
      var descEl = document.querySelector("[data-lang-description]");
      if (titleEl) titleEl.textContent = data.language;
      if (descEl) descEl.textContent = data.description;

      var params = new URLSearchParams(window.location.search);
      var levelParam = params.get("level");
      var lessonParam = params.get("lesson");
      activeLevel = (levelParam && data.levels.some(function (l) { return l.code === levelParam; })) ? levelParam : data.levels[0].code;

      renderLevelTabs();
      renderLessonList();

      if (lessonParam) {
        var level = data.levels.find(function (l) { return l.code === activeLevel; });
        var lesson = level && level.lessons.find(function (l) { return l.id === lessonParam; });
        if (lesson) openLesson(lesson, level.code);
      }
    });
  });
})(window, document);
