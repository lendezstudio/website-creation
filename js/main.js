/* ===========================================================
   LENDEZ STUDIO. SITE BEHAVIOR.
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
  var pageParts = document.querySelectorAll("main, footer, .wa-float, .site-header .nav-inner > :not(.menu-toggle)");

  if (toggle && mobileMenu) {
    var isOpen = function () { return toggle.classList.contains("open"); };

    var setMenu = function (open, returnFocus) {
      toggle.classList.toggle("open", open);
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      pageParts.forEach(function (el) {
        if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert");
      });
      if (open) {
        var first = mobileMenu.querySelector("a");
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () { setMenu(!isOpen(), true); });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false, false); });
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { setMenu(false, true); return; }
      if (e.key !== "Tab") return;
      var items = [toggle].concat(Array.prototype.slice.call(mobileMenu.querySelectorAll("a")));
      var firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    });

    window.matchMedia("(min-width: 921px)").addEventListener("change", function (mq) {
      if (mq.matches && isOpen()) setMenu(false, false);
    });
  }

  /* ---- Custom cursor (desktop, fine pointer only) ---- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = document.querySelector(".cursor-dot");
    if (dot) {
      var rafId = null, mx = 0, my = 0;
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        dot.classList.add("is-active");
        if (rafId) return;
        rafId = requestAnimationFrame(function () {
          dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
          rafId = null;
        });
      });
      document.addEventListener("mouseleave", function () { dot.classList.remove("is-active"); });
    }
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
    var status = document.querySelector("#form-status");
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reveal the website-URL field only when the visitor says they have one.
    var hasWebsiteSelect = form.elements["has_website"];
    var websiteField = document.querySelector("#website-field");
    if (hasWebsiteSelect && websiteField) {
      hasWebsiteSelect.addEventListener("change", function () {
        var show = hasWebsiteSelect.value === "yes";
        websiteField.hidden = !show;
        if (!show) { form.elements["website"].value = ""; }
      });
    }

    // Fields that must be completed before the inquiry can be sent.
    var REQUIRED = [
      { name: "name", message: "Please enter your name." },
      { name: "email", message: "Please enter your email address." },
      { name: "industry", message: "Please choose an industry." },
      { name: "project_type", message: "Please choose what you need help with." },
      { name: "details", message: "Please tell me a bit about your project." }
    ];

    function fieldOf(el) { return el ? el.closest(".field") : null; }

    function clearError(el) {
      var wrap = fieldOf(el);
      if (!wrap) return;
      wrap.classList.remove("invalid");
      el.removeAttribute("aria-invalid");
      var msg = wrap.querySelector(".field-error");
      if (msg) msg.remove();
    }

    function showError(el, text) {
      var wrap = fieldOf(el);
      if (!wrap) return;
      wrap.classList.add("invalid");
      el.setAttribute("aria-invalid", "true");
      var msg = wrap.querySelector(".field-error");
      if (!msg) {
        msg = document.createElement("p");
        msg.className = "field-error";
        msg.id = (el.id || el.name) + "-error";
        wrap.appendChild(msg);
      }
      msg.textContent = text;
      el.setAttribute("aria-describedby", msg.id);
    }

    // Returns the first invalid field element, or null when the form is good.
    function findProblems() {
      var first = null;
      REQUIRED.forEach(function (rule) {
        var el = form.elements[rule.name];
        if (!el) return;
        var value = (el.value || "").toString().trim();
        var bad = !value;
        if (!bad && rule.name === "email" && !EMAIL_RE.test(value)) {
          bad = true;
          rule = { message: "Please enter a valid email address." };
        }
        if (bad) {
          showError(el, rule.message);
          if (!first) first = el;
        } else {
          clearError(el);
        }
      });
      return first;
    }

    // Clear a field's error as soon as the visitor starts fixing it.
    REQUIRED.forEach(function (rule) {
      var el = form.elements[rule.name];
      if (!el) return;
      el.addEventListener("input", function () { clearError(el); });
      el.addEventListener("change", function () { clearError(el); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = findProblems();
      if (firstInvalid) {
        if (status) {
          status.textContent = "Please fill in the highlighted fields before sending.";
          status.classList.remove("ok");
          status.classList.add("err");
        }
        firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      function get(k) { return (data.get(k) || "").toString().trim(); }

      var hasWebsite = get("has_website");
      var websiteLine = hasWebsite === "yes"
        ? "Yes, " + (get("website") || "URL not provided")
        : hasWebsite === "no" ? "No" : "Not specified";

      var lines = [
        "Name: " + get("name"),
        "Business: " + get("business"),
        "Email: " + get("email"),
        "Phone / WhatsApp: " + get("phone"),
        "Has a website: " + websiteLine,
        "Industry: " + get("industry"),
        "What they need: " + get("project_type"),
        "",
        "Project details:",
        get("details")
      ].join("\n");

      var subject = encodeURIComponent("New project inquiry, " + (get("business") || get("name")));
      var body = encodeURIComponent(lines);
      window.location.href = "mailto:lendezstudio@gmail.com?subject=" + subject + "&body=" + body;

      if (status) {
        status.textContent = "Opening your email app to send this inquiry.";
        status.classList.remove("err");
        status.classList.add("ok");
      }
    });
  }
})();
