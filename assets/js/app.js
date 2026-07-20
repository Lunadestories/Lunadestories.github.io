/* =========================================================
   LunaVerse — app.js
   Shared utilities used across every page: path resolution,
   data fetching/caching, toast notifications, reveal-on-scroll,
   and homepage-only widgets (quote of the day, latest lists).
   ========================================================= */

(function (window, document) {
  "use strict";

  /**
   * Resolve the correct relative path prefix to /data and /assets
   * regardless of whether the current page lives at the root
   * (index.html) or inside /pages/*.html.
   */
  function resolveBase() {
    var path = window.location.pathname;
    return /\/pages\//.test(path) ? "../" : "";
  }

  var BASE = resolveBase();
  var dataCache = {};

  /**
   * Fetch a JSON data file from /data, with an in-memory cache
   * so repeat calls (e.g. search + page render) don't re-fetch.
   * @param {string} name e.g. "stories" -> /data/stories.json
   * @returns {Promise<any>}
   */
  function fetchData(name) {
    if (dataCache[name]) return Promise.resolve(dataCache[name]);
    var url = BASE + "data/" + name + ".json";
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + url);
        return res.json();
      })
      .then(function (json) {
        dataCache[name] = json;
        return json;
      })
      .catch(function (err) {
        console.error("[LunaVerse]", err);
        return null;
      });
  }

  /** Debounce helper */
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  /** Format an ISO date like 2026-03-14 into "Mar 14, 2026" */
  function formatDate(iso) {
    try {
      var d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  /** Estimate reading time in minutes from a word count */
  function readingTime(wordCount) {
    return Math.max(1, Math.round(wordCount / 200));
  }

  /** Show a small toast message at the bottom of the screen */
  var toastEl = null, toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  /** Escape a string for safe HTML interpolation */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /** Reveal elements with the .reveal / [data-reveal] class as they enter the viewport */
  function initScrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-inview"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /** Populate the "Quote of the Day" widget on the homepage */
  function initQuoteOfDay() {
    var mount = document.querySelector("[data-quote-of-day]");
    if (!mount) return;
    fetchData("quotes").then(function (quotes) {
      if (!quotes || !quotes.length) return;
      var dayIndex = Math.floor(Date.now() / 86400000) % quotes.length;
      var q = quotes[dayIndex];
      mount.innerHTML =
        '<p class="lead">\u201C' + escapeHTML(q.text) + '\u201D</p>' +
        '<p class="meta-row"><span>' + escapeHTML(q.author) + "</span>" +
        (q.language ? '<span class="dot"></span><span>' + escapeHTML(q.language) + "</span>" : "") + "</p>";
    });
  }

  /** Render "Latest Lessons" strip on the homepage, pulled across all three languages */
  function initLatestLessons() {
    var mount = document.querySelector("[data-latest-lessons]");
    if (!mount) return;
    Promise.all([fetchData("english"), fetchData("chinese"), fetchData("german")]).then(function (results) {
      var pool = [];
      results.forEach(function (langData) {
        if (!langData) return;
        langData.levels.forEach(function (level) {
          level.lessons.forEach(function (lesson) {
            pool.push({
              title: lesson.title,
              summary: lesson.summary || "",
              level: level.code,
              language: langData.language,
              slug: langData.slug,
              href: BASE + "pages/" + langData.slug + ".html?level=" + level.code + "&lesson=" + lesson.id
            });
          });
        });
      });
      var latest = pool.slice(-6).reverse();
      mount.innerHTML = latest.map(function (l) {
        return '<article class="card card-hover lesson-card">' +
          '<span class="badge-level">' + escapeHTML(l.language) + " \u00B7 " + escapeHTML(l.level) + "</span>" +
          "<h3>" + escapeHTML(l.title) + "</h3>" +
          "<p>" + escapeHTML(l.summary) + "</p>" +
          '<a class="btn btn-ghost btn-sm" href="' + l.href + '">Open lesson \u2192</a>' +
          "</article>";
      }).join("");
    });
  }

  /** Render "Latest Stories" strip on the homepage */
  function initLatestStories() {
    var mount = document.querySelector("[data-latest-stories]");
    if (!mount) return;
    fetchData("stories").then(function (stories) {
      if (!stories) return;
      var latest = stories.slice(0, 3);
      mount.innerHTML = latest.map(function (s) {
        return '<article class="card card-hover story-card">' +
          '<div class="cover"><span class="eyebrow" style="color:#fff">' + escapeHTML(s.category) + "</span></div>" +
          '<span class="tag">' + escapeHTML(s.level) + "</span>" +
          "<h3>" + escapeHTML(s.title) + "</h3>" +
          "<p>" + escapeHTML(s.excerpt) + "</p>" +
          '<p class="meta-row"><span>' + readingTime(s.wordCount) + " min read</span></p>" +
          '<a class="btn btn-ghost btn-sm" href="' + BASE + "pages/stories.html?story=" + s.slug + '">Read story \u2192</a>' +
          "</article>";
      }).join("");
    });
  }

  /** Newsletter / contact form progressive enhancement (no backend on GitHub Pages) */
  function initForms() {
    document.querySelectorAll("form[data-luna-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = form.querySelector("[name='name']");
        toast("Thanks" + (name && name.value ? ", " + name.value.split(" ")[0] : "") + "! Your message has been noted. \u2728");
        form.reset();
      });
    });
  }

  function initYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initQuoteOfDay();
    initLatestLessons();
    initLatestStories();
    initForms();
    initYear();
  });

  // Expose a small shared namespace for other modules (theme.js, search.js, etc.)
  window.Luna = window.Luna || {};
  window.Luna.base = BASE;
  window.Luna.fetchData = fetchData;
  window.Luna.debounce = debounce;
  window.Luna.formatDate = formatDate;
  window.Luna.readingTime = readingTime;
  window.Luna.toast = toast;
  window.Luna.escapeHTML = escapeHTML;
})(window, document);
