/*
  Client-side include loader for GitHub Pages.

  Works for:
  - Root/custom domain (e.g., https://billson.li): base = "/"
  - Project site (e.g., https://username.github.io/repo/): pass data-base="/repo"
  Usage in HTML:
    <script src="/assets/js/includes.js" data-base="/repo-name"></script>
  If using a custom domain at root, omit data-base.
*/

async function inject(selector, url, base) {
  const el = document.querySelector(selector);
  if (!el) return;
  const resolved = base.replace(/\/$/, '') + url; // join base + url
  const res = await fetch(resolved, { cache: "no-store" });
  if (!res.ok) {
    console.warn("Include failed:", resolved, res.status);
    return;
  }
  el.innerHTML = await res.text();
}

function markActiveNav(base) {
  // Highlight the current nav item after header is injected
  const here = window.location.pathname.replace(base, "/");
  const links = document.querySelectorAll(".site-nav a");
  links.forEach(a => {
    const href = a.getAttribute("href") || "/";
    const target = href.startsWith("/") ? href : "/" + href;
    if (target === "/" && (here === "/" || here === "/index.html")) {
      a.classList.add("active");
    } else if (target !== "/" && here.startsWith(target)) {
      a.classList.add("active");
    }
  });
}

(function () {
  const script = document.currentScript;
  const base = (script?.dataset?.base || "").trim() || "/";

  document.addEventListener("DOMContentLoaded", async () => {
    await inject("#site-header", "/components/header.html", base);
    await inject("#site-footer", "/components/footer.html", base);

    // Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // Active nav
    markActiveNav(base);
  });
})();
