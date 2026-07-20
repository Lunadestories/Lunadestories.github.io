/* =========================================================
   LunaVerse — navigation.js
   Mobile nav toggle, sticky-header scroll shadow, and
   automatic aria-current="page" highlighting.
   ========================================================= */

(function (window, document) {
  "use strict";

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-nav-panel");
    if (!toggle || !panel) return;

    function close() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function open() {
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.contains("is-open");
      isOpen ? close() : open();
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initHeaderScrollState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initActiveLink() {
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".main-nav a, .mobile-nav-panel a").forEach(function (a) {
      try {
        var linkPath = new URL(a.href).pathname.replace(/\/index\.html$/, "/");
        if (linkPath === path) {
          a.setAttribute("aria-current", "page");
        }
      } catch (e) { /* ignore malformed hrefs */ }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initHeaderScrollState();
    initActiveLink();
  });
})(window, document);
