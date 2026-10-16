const FOOTER_CREDIT_DELAY_MS = 120000;

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initNavActiveState();
  initNavScrollState();
  initMobileNavClose();
  initReadMore();
  initScrollReveal();
  initDelayedFooterCredit();
});

function initFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initNavActiveState() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.target.closest(".nav-link");
      if (!target || target.classList.contains("nav-link-cta")) return;

      navItems.forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function initNavScrollState() {
  const nav = document.getElementById("nav-bar");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNavClose() {
  const collapse = document.getElementById("navbarSupportedContent");
  if (!collapse || typeof bootstrap === "undefined") return;

  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse, {
    toggle: false,
  });

  collapse.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && collapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });
}

function initDelayedFooterCredit() {
  const footer = document.getElementById("site-footer");
  const credit = document.getElementById("footer-credit");
  if (!footer || !credit) return;

  const linkedInUrl = footer.dataset.davidLinkedin;
  const davidLink = credit.querySelector(".site-footer-link");

  if (davidLink && linkedInUrl) {
    davidLink.href = linkedInUrl;
  }

  let creditTimer = null;
  let hasRevealed = false;

  const revealCredit = () => {
    if (hasRevealed) return;
    hasRevealed = true;
    credit.removeAttribute("hidden");
    credit.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      credit.classList.add("is-visible");
    });
  };

  creditTimer = window.setTimeout(revealCredit, FOOTER_CREDIT_DELAY_MS);

  window.addEventListener(
    "pagehide",
    () => {
      if (creditTimer !== null) {
        window.clearTimeout(creditTimer);
        creditTimer = null;
      }
    },
    { once: true }
  );
}

function initReadMore() {
  const CHAR_THRESHOLD = 320;
  const quotes = document.querySelectorAll(".review-quote");

  quotes.forEach((quote) => {
    const text = quote.textContent.trim();
    if (text.length < CHAR_THRESHOLD) return;

    const wrap = document.createElement("div");
    wrap.className = "review-quote-wrap is-expandable is-clamped";
    quote.parentNode.insertBefore(wrap, quote);
    wrap.appendChild(quote);

    quote.classList.add("is-clamped");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-more-btn";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.textContent = expanded ? "Read more" : "Show less";
      quote.classList.toggle("is-clamped", expanded);
      wrap.classList.toggle("is-clamped", expanded);
      wrap.classList.toggle("is-expanded", !expanded);
    });

    wrap.appendChild(btn);
  });
}

function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const revealElements = document.querySelectorAll(
    ".section-intro, #testimonials-container .card"
  );

  revealElements.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(index * 40, 400)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}
