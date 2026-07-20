/* =========================================================
   LunaVerse — blog.js
   Powers /pages/blog.html: "Luna's Journey" post grid with
   category + tag filtering, search, and a single-post view.
   ========================================================= */

(function (window, document) {
  "use strict";

  function cardTemplate(post) {
    var Luna = window.Luna;
    return '<article class="card card-hover blog-card" data-reveal>' +
      '<div class="cover"><span class="eyebrow" style="color:#fff">' + Luna.escapeHTML(post.category) + "</span></div>" +
      "<h3>" + Luna.escapeHTML(post.title) + "</h3>" +
      "<p>" + Luna.escapeHTML(post.excerpt) + "</p>" +
      '<p class="meta-row"><span>' + Luna.formatDate(post.date) + '</span><span class="dot"></span><span>' + Luna.readingTime(post.wordCount) + " min read</span></p>" +
      '<div class="cluster gap-2xs">' + post.tags.map(function (t) { return '<span class="tag">#' + Luna.escapeHTML(t) + "</span>"; }).join("") + "</div>" +
      '<a class="btn btn-ghost btn-sm" href="?post=' + post.slug + '">Read post \u2192</a>' +
    "</article>";
  }

  function renderGrid(posts, container, category, query) {
    var filtered = posts.filter(function (p) {
      var matchesCategory = category === "all" || p.category === category;
      var matchesQuery = !query || (p.title + p.excerpt + p.tags.join(" ")).toLowerCase().indexOf(query) !== -1;
      return matchesCategory && matchesQuery;
    });
    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state"><div class="moon-mark" style="margin:0 auto 12px;"></div><p>No posts match yet \u2014 try another filter.</p></div>';
      return;
    }
    container.innerHTML = filtered.map(cardTemplate).join("");
  }

  function renderPost(post, mount) {
    var Luna = window.Luna;
    mount.innerHTML =
      '<a class="btn btn-ghost btn-sm" href="blog.html">\u2190 All posts</a>' +
      '<article class="reader" style="margin-top:1.5rem;">' +
        '<span class="tag tag-gold">' + Luna.escapeHTML(post.category) + "</span>" +
        "<h1 style=\"margin-top:0.75rem;\">" + Luna.escapeHTML(post.title) + "</h1>" +
        '<p class="meta-row" style="margin-bottom:2rem;"><span>' + Luna.formatDate(post.date) + '</span><span class="dot"></span><span>' + Luna.readingTime(post.wordCount) + " min read</span></p>" +
        '<div class="reader-body">' + post.body.map(function (p) { return "<p>" + Luna.escapeHTML(p) + "</p>"; }).join("") + "</div>" +
        '<div class="cluster gap-2xs" style="margin-top:2rem;">' + post.tags.map(function (t) { return '<span class="tag">#' + Luna.escapeHTML(t) + "</span>"; }).join("") + "</div>" +
      "</article>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-blog-grid]");
    var postMount = document.querySelector("[data-blog-post]");
    var listView = document.querySelector("[data-blog-list-view]");
    if (!grid && !postMount) return;

    window.Luna.fetchData("blog").then(function (posts) {
      if (!posts) return;
      var params = new URLSearchParams(window.location.search);
      var slug = params.get("post");

      if (slug && postMount) {
        var post = posts.find(function (p) { return p.slug === slug; });
        if (listView) listView.style.display = "none";
        postMount.style.display = "block";
        if (post) renderPost(post, postMount);
        else postMount.innerHTML = '<p>Post not found. <a href="blog.html">Back to Luna\u2019s Journey \u2192</a></p>';
        return;
      }

      if (!grid) return;
      var category = "all";
      var query = "";
      renderGrid(posts, grid, category, query);

      document.querySelectorAll("[data-blog-filter]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          document.querySelectorAll("[data-blog-filter]").forEach(function (c) { c.classList.remove("is-active"); });
          chip.classList.add("is-active");
          category = chip.dataset.blogFilter;
          renderGrid(posts, grid, category, query);
        });
      });

      var searchInput = document.querySelector("[data-blog-search]");
      if (searchInput) {
        searchInput.addEventListener("input", window.Luna.debounce(function () {
          query = searchInput.value.trim().toLowerCase();
          renderGrid(posts, grid, category, query);
        }, 150));
      }
    });
  });
})(window, document);
