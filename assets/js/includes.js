<script>
/*
  Client-side include loader for GitHub Pages.
  Works for:
  - User/Org site (https://username.github.io/): base = "/"
  - Project site   (https://username.github.io/repo/): set data-base="/repo"
  Usage on each page:
    <script src="/assets/js/includes.js" data-base="/repo-name"></script>
  If you use a custom domain at the root, leave data-base blank.
*/

async function inject(selector, url, base) {
  const el = document.querySelector(selector);
  if (!el) return;
  const resolved = base.replace(/\/$/, '') + url; // join base + url
  const res = await fetch(resolved, { cache: "no-store" });
  if (!res.ok) { console.warn("Include failed:", resolved, res.status); return; }
  el.innerHTML = await res.text();
}

function markActiveNav(base) {
  // After header injected, highlight active link
  const here = window.location.pathname.replace(base, "/");
  const links = document.querySelectorAll(".site-nav a");
  links.forEach(a => {
    const href = a.getAttribute("href");
    // Normalize href with base
    const target = href.startsWith("/") ? href : "/" + href;
    if (target === "/" && (here === "/" || here === "/index.html")) a.classList.add("active");
    else if (target !== "/" && here.startsWith(target)) a.classList.add("active");
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
</script>
