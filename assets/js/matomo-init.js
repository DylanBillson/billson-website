// Idempotent Matomo loader with consent hooks
(function () {
  if (window.__MATOMO_BOOTSTRAPPED__) return;
  window.__MATOMO_BOOTSTRAPPED__ = true;

  // --- CONFIG ---
  var CONFIG = {
    url: 'https://analytics.sublimecyb.org/', // tracker base URL
    siteId: '2',                               // Matomo site ID
    respectDnt: true,                          // optional
    useCookies: false                          // cookie-less by default; toggle via consent
  };

  // --- CONSENT STATE ---
  // values: 'accepted' | 'rejected' | null
  function getConsent() { return localStorage.getItem('analytics_consent'); }
  function setConsent(v){ localStorage.setItem('analytics_consent', v); }

  // --- MATOMO BOOT ---
  function bootMatomo() {
    var _paq = window._paq = window._paq || [];
    if (CONFIG.respectDnt) _paq.push(['setDoNotTrack', true]);
    if (!CONFIG.useCookies) _paq.push(['disableCookies']);

    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', CONFIG.url + 'matomo.php']);
    _paq.push(['setSiteId', CONFIG.siteId]);
    _paq.push(['trackPageView']);

    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async = true; g.src = CONFIG.url + 'matomo.js'; s.parentNode.insertBefore(g, s);
  }

  // --- PUBLIC API for your banner/toggle ---
  window.enableAnalytics = function () {
    setConsent('accepted');
    CONFIG.useCookies = true;

    // Tell Matomo consent is granted (optionally persist for 365 days)
    var _paq = window._paq = window._paq || [];
    _paq.push(['rememberConsentGiven', 365]);

    // (Optional) tidy-up: manually clear any stale "consent removed" cookie
    // Try with and without a leading dot on the domain
    ['' , '.'].forEach(function(prefix){
      document.cookie = 'mtm_consent_removed=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + prefix + location.hostname + '; SameSite=Lax';
    });

    bootMatomo();
  };

  window.disableAnalytics = function () {
    setConsent('rejected');

    var _paq = window._paq = window._paq || [];
    _paq.push(['forgetConsentGiven']);           // revoke
    _paq.push(['rememberConsentRemoved', 365]);  // persist the "rejected" state (1 year)

    // (You can optionally trigger a soft reload if you want to clear any in-memory trackers)
    // location.reload();
  };

  // --- AUTO-START based on stored consent ---
  var consent = getConsent();
  if (consent === 'accepted') {
    window.enableAnalytics();
  } else if (consent === 'rejected') {
    // do nothing
  } else {
    // no choice yet: stay idle until the banner calls enable/disableAnalytics
    // optionally do cookieless pageview now; if you want that:
    // bootMatomo();  // while CONFIG.useCookies=false
  }
})();
