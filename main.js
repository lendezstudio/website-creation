/* ===========================================================
   LENDEZ STUDIO — SITE BEHAVIOR
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initReveal();
  initFaq();
  initPortfolioRender();
  initContactForm();
  initYear();
});

/* ---- Sticky header shadow/border on scroll ---- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- Mobile nav toggle ---- */
function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const mobile = document.querySelector(".nav__mobile");
  if (!toggle || !mobile) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    mobile.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  });

  mobile.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      mobile.classList.remove("is-open");
      document.body.style.overflow = "";
    })
  );
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ---- FAQ accordion ---- */
function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-item__q");
    const answer = item.querySelector(".faq-item__a");
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";

      items.forEach((other) => {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          other.querySelector(".faq-item__q")?.setAttribute("aria-expanded", "false");
          const otherAnswer = other.querySelector(".faq-item__a");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      item.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });
}

/* ===========================================================
   PORTFOLIO RENDERING
   Renders project markup from PORTFOLIO (see portfolio-data.js)
   into any container with [data-portfolio-mount].
   Modes: "featured" (homepage, 3 projects) or "all" (Work page).
   =========================================================== */
function initPortfolioRender() {
  const mount = document.querySelector("[data-portfolio-mount]");
  if (!mount || typeof PORTFOLIO === "undefined") return;

  const mode = mount.getAttribute("data-portfolio-mount");
  const projects = mode === "featured" ? getFeaturedProjects() : getAllProjects();

  mount.innerHTML = projects.map(renderProject).join("");

  initReveal(); // pick up newly injected .reveal nodes
  initWorkFilters();
}

function frameMarkup(project, kind) {
  const label = kind === "mobile" ? project.projectName + " — mobile" : project.projectName + " — desktop";
  const path = kind === "mobile" ? project.mobileImage : project.desktopImage;
  const urlLabel = project.liveUrl.replace(/^https?:\/\//, "");
  return `
    <div class="frame ${kind === "mobile" ? "frame--phone" : ""}">
      ${
        kind === "mobile"
          ? ""
          : `<div class="frame__bar">
              <div class="frame__dots"><span></span><span></span><span></span></div>
              <div class="frame__url">${urlLabel}</div>
            </div>`
      }
      <div class="frame__body">
        <div class="frame__placeholder">
          <div class="ph-mark">${project.projectName}</div>
          <div class="ph-path">${path}</div>
        </div>
      </div>
    </div>`;
}

function renderProject(project, index) {
  const numStr = String(project.displayOrder).padStart(2, "0");
  const focusList = project.focusAreas
    .slice(0, 5)
    .map((f) => `<li>${f}</li>`)
    .join("");
  const badgeClass = project.isClientWork ? "badge badge--client" : "badge";
  const categoryFilterAttr = `data-category="${project.category}"`;

  if (project.layout === "feature") {
    return `
    <article class="project project--feature reveal" ${categoryFilterAttr}>
      <div class="project__info">
        <span class="project__number">${numStr}</span>
        <div class="project__eyebrow-row">
          <span class="${badgeClass}">${project.badge}</span>
          <span class="project__category">${numStr} / ${project.categoryLabel.toUpperCase()}</span>
        </div>
        <h3 class="h3 project__title">${project.projectName}</h3>
        <p class="project__desc">${project.description}</p>
        <ul class="project__focus">${focusList}</ul>
        <a class="text-link project__cta" href="${project.liveUrl}" target="_blank" rel="noopener">
          ${project.ctaLabel}
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
      <div class="project__media">
        ${frameMarkup(project, "desktop")}
      </div>
    </article>`;
  }

  const mediaRightClass = project.layout === "media-right" ? "project--media-right" : "";

  return `
    <article class="project ${mediaRightClass} reveal" ${categoryFilterAttr}>
      <div class="project__media">
        <div class="project__media--split">
          ${frameMarkup(project, "desktop")}
          ${frameMarkup(project, "mobile")}
        </div>
      </div>
      <div class="project__info">
        <span class="project__number">${numStr}</span>
        <div class="project__eyebrow-row">
          <span class="${badgeClass}">${project.badge}</span>
        </div>
        <h3 class="h3 project__title">${project.projectName}</h3>
        <p class="project__desc">${project.description}</p>
        <ul class="project__focus">${focusList}</ul>
        <a class="text-link project__cta" href="${project.liveUrl}" target="_blank" rel="noopener">
          ${project.ctaLabel}
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </article>`;
}

/* ---- Work page category filters ---- */
function initWorkFilters() {
  const filterBar = document.querySelector(".filters");
  if (!filterBar) return;
  const buttons = filterBar.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll("[data-category]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      const filter = btn.getAttribute("data-filter");

      projects.forEach((p) => {
        const match = filter === "all" || p.getAttribute("data-category") === filter;
        p.hidden = !match;
      });
    });
  });
}

/* ===========================================================
   CONTACT FORM
   Front-end validation + simulated submit lifecycle.
   To connect a real backend, replace the body of
   `submitToBackend()` with a fetch() call to your endpoint
   or form service (e.g. Formspree, Netlify Forms, a serverless
   function). No API keys belong in this file.
   =========================================================== */
function initContactForm() {
  const form = document.querySelector("#project-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn?.querySelector(".btn-label");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const requiredFields = form.querySelectorAll("[required]");
    let hasError = false;

    requiredFields.forEach((field) => {
      const wrapper = field.closest(".field");
      const valid = field.type === "email" ? /^\S+@\S+\.\S+$/.test(field.value) : field.value.trim().length > 0;
      wrapper?.classList.toggle("has-error", !valid);
      if (!valid) hasError = true;
    });

    if (hasError) {
      status.classList.add("form-status--error");
      status.textContent = "Please fill in the required fields highlighted above.";
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitLabel ? submitLabel.textContent : submitBtn.textContent;
    if (submitLabel) submitLabel.textContent = "Sending…";
    submitBtn.insertAdjacentHTML("afterbegin", '<span class="spinner" aria-hidden="true"></span>');

    try {
      await submitToBackend(new FormData(form));
      status.classList.add("form-status--success");
      status.textContent =
        "Thanks — your message is in. I'll reply within a couple of business days to talk through your project.";
      form.reset();
    } catch (err) {
      status.classList.add("form-status--error");
      status.textContent = "Something went wrong sending that. Please try again, or reach out on Instagram @lynethlendez.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".spinner")?.remove();
      if (submitLabel) submitLabel.textContent = originalLabel;
    }
  });
}

// Placeholder submit — swap for a real endpoint when ready.
function submitToBackend(formData) {
  return new Promise((resolve) => {
    setTimeout(resolve, 900);
  });
}

/* ---- Footer year ---- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
