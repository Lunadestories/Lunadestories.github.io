/* =========================================================
   LunaVerse — theme.js
   Light / Dark mode toggle. Persists preference in
   localStorage under "luna-theme" and falls back to the
   OS-level `prefers-color-scheme` on first visit.
   ========================================================= */

(function (window, document) {
  "use strict";

  var STORAGE_KEY = "luna-theme";
  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* private browsing / storage disabled — fail silently */ }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0C1020" : "#F5F6FA");
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  }

  // Apply the correct theme as early as possible (this script is loaded
  // with `defer` in <head> so it still runs before first paint completes).
  var stored = getStoredTheme();
  applyTheme(stored || (systemPrefersDark() ? "dark" : "light"));

  // Keep in sync with OS changes if the user hasn't set an explicit preference
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
    applyTheme(currentTheme()); // sync aria state on freshly-rendered buttons
  });

  window.Luna = window.Luna || {};
  window.Luna.toggleTheme = toggleTheme;
  window.Luna.currentTheme = currentTheme;
})(window, document);
