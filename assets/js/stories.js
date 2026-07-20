/* =========================================================
   LunaVerse — stories.js
   Powers /pages/stories.html: grid + filters, bookmarking
   (localStorage), and a distraction-free reader view with a
   scroll progress bar and dark reading mode.
   ========================================================= */

(function (window, document) {
  "use strict";

  var BOOKMARK_KEY = "luna-story-bookmarks";

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; }
    catch (e) { return []; }
  }
  function setBookmarks(arr) {
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function toggleBookmark(slug) {
    var marks = getBookmarks();
    var i = marks.indexOf(slug);
    if (i === -1) { marks.push(slug); window.Luna.toast("Bookmarked \u2014 saved for later \u2728"); }
    else { marks.splice(i, 1); window.Luna.toast("Removed bookmark"); }
    setBookmarks(marks);
    return marks;
  }

  function cardTemplate(story, isBookmarked) {
    var Luna = window.Luna;
    return '<article class="card card-hover story-card" data-reveal>' +
      '<div class="cover"><span class="eyebrow" style="color:#fff">' + Luna.escapeHTML(story.category) + "</span></div>" +
      '<div class="cluster gap-2xs">' +
        '<span class="tag">' + Luna.escapeHTML(story.level) + "</span>" +
        '<span class="tag tag-teal">' + Luna.escapeHTML(story.language) + "</span>" +
      "</div>" +
      "<h3>" + Luna.escapeHTML(story.title) + "</h3>" +
      "<p>" + Luna.escapeHTML(story.excerpt) + "</p>" +
      '<p class="meta-row"><span>' + Luna.readingTime(story.wordCount) + ' min read</span><span class="dot"></span><span>' + story.wordCount + " words</span></p>" +
      '<div class="cluster gap-xs">' +
        '<a class="btn btn-primary btn-sm" href="?story=' + story.slug + '">Read \u2192</a>' +
        '<button class="btn btn-ghost btn-sm bookmark-btn" data-slug="' + story.slug + '" aria-pressed="' + isBookmarked + '">' +
          (isBookmarked ? "\u2605 Saved" : "\u2606 Save") +
        "</button>" +
      "</div>" +
    "</article>";
  }

  function renderGrid(stories, container, activeFilter, query) {
    var bookmarks = getBookmarks();
    var filtered = stories.filter(function (s) {
      var matchesFilter = activeFilter === "all" ? true :
        activeFilter === "bookmarked" ? bookmarks.indexOf(s.slug) !== -1 :
        s.category === activeFilter;
      var matchesQuery = !query || (s.title + s.excerpt).toLowerCase().indexOf(query) !== -1;
      return matchesFilter && matchesQuery;
    });
    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state"><div class="moon-mark" style="margin:0 auto 12px;"></div><p>No stories match yet \u2014 try another filter.</p></div>';
      return;
    }
    container.innerHTML = filtered.map(function (s) { return cardTemplate(s, bookmarks.indexOf(s.slug) !== -1); }).join("");
    container.querySelectorAll(".bookmark-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var marks = toggleBookmark(btn.dataset.slug);
        btn.setAttribute("aria-pressed", marks.indexOf(btn.dataset.slug) !== -1);
        btn.textContent = marks.indexOf(btn.dataset.slug) !== -1 ? "\u2605 Saved" : "\u2606 Save";
      });
    });
  }

  function renderReader(story, mount) {
    var Luna = window.Luna;
    var bookmarks = getBookmarks();
    var isBookmarked = bookmarks.indexOf(story.slug) !== -1;
    mount.innerHTML =
      '<a class="btn btn-ghost btn-sm" href="stories.html">\u2190 All stories</a>' +
      '<article class="reader" style="margin-top:1.5rem;">' +
        '<div class="cluster gap-2xs" style="margin-bottom:1rem;">' +
          '<span class="tag">' + Luna.escapeHTML(story.level) + "</span>" +
          '<span class="tag tag-teal">' + Luna.escapeHTML(story.language) + "</span>" +
          '<span class="tag tag-gold">' + Luna.escapeHTML(story.category) + "</span>" +
        "</div>" +
        "<h1>" + Luna.escapeHTML(story.title) + "</h1>" +
        '<p class="meta-row" style="margin-bottom:2rem;"><span>By ' + Luna.escapeHTML(story.author || "Luna") + '</span><span class="dot"></span><span>' + Luna.readingTime(story.wordCount) + " min read</span></p>" +
        '<div class="reader-body">' + story.body.map(function (p) { return "<p>" + Luna.escapeHTML(p) + "</p>"; }).join("") + "</div>" +
        '<button class="btn btn-secondary bookmark-btn" data-slug="' + story.slug + '" aria-pressed="' + isBookmarked + '" style="margin-top:2rem;">' +
          (isBookmarked ? "\u2605 Saved to your list" : "\u2606 Save for later") +
        "</button>" +
      "</article>";
    mount.querySelector(".bookmark-btn").addEventListener("click", function (e) {
      var marks = toggleBookmark(e.target.dataset.slug);
      var saved = marks.indexOf(e.target.dataset.slug) !== -1;
      e.target.setAttribute("aria-pressed", saved);
      e.target.textContent = saved ? "\u2605 Saved to your list" : "\u2606 Save for later";
    });
  }

  function initReadingProgress() {
    var bar = document.querySelector(".reader-progress");
    if (!bar) return;
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = (isFinite(scrolled) ? scrolled : 0) + "%";
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-story-grid]");
    var readerMount = document.querySelector("[data-story-reader]");
    var listView = document.querySelector("[data-story-list-view]");
    if (!grid && !readerMount) return;

    initReadingProgress();

    window.Luna.fetchData("stories").then(function (stories) {
      if (!stories) return;
      var params = new URLSearchParams(window.location.search);
      var storySlug = params.get("story");

      if (storySlug && readerMount) {
        var story = stories.find(function (s) { return s.slug === storySlug; });
        if (listView) listView.style.display = "none";
        readerMount.style.display = "block";
        if (story) renderReader(story, readerMount);
        else readerMount.innerHTML = '<p>Story not found. <a href="stories.html">Back to all stories \u2192</a></p>';
        return;
      }

      if (!grid) return;
      var activeFilter = "all";
      var query = "";
      renderGrid(stories, grid, activeFilter, query);

      document.querySelectorAll("[data-story-filter]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          document.querySelectorAll("[data-story-filter]").forEach(function (c) { c.classList.remove("is-active"); });
          chip.classList.add("is-active");
          activeFilter = chip.dataset.storyFilter;
          renderGrid(stories, grid, activeFilter, query);
        });
      });

      var searchInput = document.querySelector("[data-story-search]");
      if (searchInput) {
        searchInput.addEventListener("input", window.Luna.debounce(function () {
          query = searchInput.value.trim().toLowerCase();
          renderGrid(stories, grid, activeFilter, query);
        }, 150));
      }
    });
  });
})(window, document);
