/* ===========================================================
   LENDEZ STUDIO — SITE BEHAVIOR
   Shared by every page. No dependencies, no build step.
   =========================================================== */

(function () {
  "use strict";

  /* ---- Sticky header state on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    var setMenu = function (open) {
      toggle.classList.toggle("open", open);
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () {
      setMenu(!toggle.classList.contains("open"));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.classList.contains("open")) setMenu(false);
    });
  }

  /* ---- Scroll reveal ---- */
  function initReveal() {
    var revealEls = document.querySelectorAll(".reveal, .mask-reveal");
    if (!revealEls.length) return;

    document.querySelectorAll(".reveal-stagger").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--i", i);
      });
    });

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }
  initReveal();

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ===========================================================
     CONTACT FORM
     Opens the visitor's email app with a pre-filled message to
     lendezstudio@gmail.com. No backend, no secrets in this file.
     To use a form service instead, replace the submit handler
     body with a fetch() to your endpoint.
     =========================================================== */
  var form = document.querySelector("#project-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      function get(k) { return (data.get(k) || "").toString().trim(); }

      var lines = [
        "Name: " + get("name"),
        "Business: " + get("business"),
        "Email: " + get("email"),
        "Phone / WhatsApp: " + get("phone"),
        "Current website: " + (get("website") || "None"),
        "Industry: " + get("industry"),
        "What they need: " + get("project_type"),
        "Budget: " + (get("budget") || "Not specified"),
        "",
        "Project details:",
        get("details")
      ].join("\n");

      var subject = encodeURIComponent("New project inquiry, " + (get("business") || get("name")));
      var body = encodeURIComponent(lines);
      window.location.href = "mailto:lendezstudio@gmail.com?subject=" + subject + "&body=" + body;

      var status = document.querySelector("#form-status");
      if (status) {
        status.textContent = "Opening your email app to send this inquiry.";
        status.classList.add("ok");
      }
    });
  }
})();
