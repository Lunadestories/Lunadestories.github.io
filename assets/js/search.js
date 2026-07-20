/* =========================================================
   LunaVerse — search.js
   Builds a single searchable index from every data file
   (lessons across 3 languages, stories, blog posts) and
   powers the ⌘K / Ctrl+K global search overlay.
   ========================================================= */

(function (window, document) {
  "use strict";

  var index = null; // built lazily on first open
  var activeIndex = -1;

  function buildIndex() {
    if (index) return Promise.resolve(index);
    var Luna = window.Luna;
    return Promise.all([
      Luna.fetchData("english"),
      Luna.fetchData("chinese"),
      Luna.fetchData("german"),
      Luna.fetchData("stories"),
      Luna.fetchData("blog")
    ]).then(function (r) {
      var entries = [];
      var langs = [r[0], r[1], r[2]];
      langs.forEach(function (lang) {
        if (!lang) return;
        lang.levels.forEach(function (level) {
          level.lessons.forEach(function (lesson) {
            entries.push({
              type: "Lesson",
              title: lesson.title,
              meta: lang.language + " \u00B7 " + level.code,
              href: Luna.base + "pages/" + lang.slug + ".html?level=" + level.code + "&lesson=" + lesson.id,
              haystack: (lesson.title + " " + (lesson.summary || "") + " " + lang.language).toLowerCase()
            });
          });
        });
      });
      var stories = r[3] || [];
      stories.forEach(function (s) {
        entries.push({
          type: "Story",
          title: s.title,
          meta: "Story \u00B7 " + s.level,
          href: Luna.base + "pages/stories.html?story=" + s.slug,
          haystack: (s.title + " " + s.excerpt + " " + s.category).toLowerCase()
        });
      });
      var posts = r[4] || [];
      posts.forEach(function (p) {
        entries.push({
          type: "Blog",
          title: p.title,
          meta: "Luna's Journey \u00B7 " + p.category,
          href: Luna.base + "pages/blog.html?post=" + p.slug,
          haystack: (p.title + " " + p.excerpt + " " + p.category + " " + (p.tags || []).join(" ")).toLowerCase()
        });
      });
      index = entries;
      return entries;
    });
  }

  function render(results, panel, query) {
    var list = panel.querySelector(".search-results");
    activeIndex = -1;
    if (!query) {
      list.innerHTML = '<p class="empty-state" style="padding:1rem 0;">Search lessons, stories and blog posts across LunaVerse.</p>';
      return;
    }
    if (!results.length) {
      list.innerHTML = '<div class="empty-state"><div class="moon-mark" style="margin:0 auto 8px;"></div><p>No results for \u201C' + window.Luna.escapeHTML(query) + '\u201D</p></div>';
      return;
    }
    list.innerHTML = results.slice(0, 20).map(function (r, i) {
      return '<a class="search-result-item" href="' + r.href + '" data-index="' + i + '">' +
        '<span class="r-title">' + window.Luna.escapeHTML(r.title) + "</span>" +
        '<span class="r-meta">' + window.Luna.escapeHTML(r.type) + " \u2014 " + window.Luna.escapeHTML(r.meta) + "</span>" +
        "</a>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.querySelector(".search-overlay");
    var panel = overlay ? overlay.querySelector(".search-panel") : null;
    var input = overlay ? overlay.querySelector("input") : null;
    var openers = document.querySelectorAll("[data-search-open]");
    if (!overlay || !panel || !input) return;

    function openOverlay() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      buildIndex().then(function () { render([], panel, ""); });
      setTimeout(function () { input.focus(); }, 50);
    }
    function closeOverlay() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      input.value = "";
    }

    openers.forEach(function (btn) { btn.addEventListener("click", openOverlay); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeOverlay(); });
    panel.querySelector(".search-close") && panel.querySelector(".search-close").addEventListener("click", closeOverlay);

    document.addEventListener("keydown", function (e) {
      var isK = e.key === "k" || e.key === "K";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        overlay.classList.contains("is-open") ? closeOverlay() : openOverlay();
      }
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeOverlay();

      if (overlay.classList.contains("is-open")) {
        var items = panel.querySelectorAll(".search-result-item");
        if (e.key === "ArrowDown" && items.length) {
          e.preventDefault();
          activeIndex = Math.min(activeIndex + 1, items.length - 1);
          items.forEach(function (it, i) { it.classList.toggle("is-active", i === activeIndex); });
        } else if (e.key === "ArrowUp" && items.length) {
          e.preventDefault();
          activeIndex = Math.max(activeIndex - 1, 0);
          items.forEach(function (it, i) { it.classList.toggle("is-active", i === activeIndex); });
        } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
          window.location.href = items[activeIndex].getAttribute("href");
        }
      }
    });

    input.addEventListener("input", window.Luna.debounce(function () {
      var q = input.value.trim().toLowerCase();
      buildIndex().then(function (entries) {
        var results = q ? entries.filter(function (e) { return e.haystack.indexOf(q) !== -1; }) : [];
        render(results, panel, input.value.trim());
      });
    }, 120));
  });
})(window, document);
