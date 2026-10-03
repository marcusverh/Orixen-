/* Orixen — comportements communs à toutes les pages */
(function () {
  var CALENDLY = 'https://calendly.com/orixen/eligibilite';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Apparition au défilement */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.rv, .step').forEach(function (el) { io.observe(el); });

  /* Source de la visite (ex. ?utm_source=instagram), transmise à Calendly */
  var utm = [];
  new URLSearchParams(location.search).forEach(function (v, k) {
    if (/^utm_/.test(k)) utm.push(k + '=' + encodeURIComponent(v));
  });
  try {
    if (utm.length) sessionStorage.setItem('orixen_utm', utm.join('&'));
    else utm = (sessionStorage.getItem('orixen_utm') || '').split('&').filter(Boolean);
  } catch (e) {}

  function bookingUrl() {
    var p = ['hide_gdpr_banner=1', 'background_color=141416', 'text_color=f5f5f7', 'primary_color=7fa6d9'].concat(utm);
    return CALENDLY + '?' + p.join('&');
  }

  /* Réservation : Calendly s'ouvre par-dessus la page, chargé seulement au clic */
  var loading = null;
  function loadCalendly() {
    if (window.Calendly) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
      setTimeout(reject, 5000);
    });
    return loading;
  }

  function openBooking() {
    window.Calendly.initPopupWidget({ url: bookingUrl() });
    // Le bouton « retour » du téléphone ferme la fenêtre au lieu de quitter le site
    history.pushState({ orixenCal: true }, '');
  }

  document.querySelectorAll('[data-book]').forEach(function (a) {
    a.href = bookingUrl();
    // Le chargement démarre dès que le doigt touche le bouton : la fenêtre s'ouvre plus vite
    a.addEventListener('pointerdown', function () { loadCalendly().catch(function () {}); }, { passive: true });
    a.addEventListener('click', function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      ev.preventDefault();
      a.setAttribute('aria-busy', 'true');
      loadCalendly()
        .then(openBooking)
        .catch(function () { location.href = bookingUrl(); })
        .then(function () { a.removeAttribute('aria-busy'); });
    });
  });

  window.addEventListener('popstate', function () {
    if (window.Calendly && document.querySelector('.calendly-overlay')) window.Calendly.closePopupWidget();
  });
  // Fenêtre fermée avec la croix : on retire l'étape ajoutée à l'historique
  var calSeen = false;
  new MutationObserver(function () {
    if (document.querySelector('.calendly-overlay')) { calSeen = true; return; }
    if (calSeen) {
      calSeen = false;
      if (history.state && history.state.orixenCal) history.back();
    }
  }).observe(document.body, { childList: true, subtree: true });

  /* Rendez-vous pris : direction la page de confirmation */
  window.addEventListener('message', function (e) {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') {
      location.href = '/confirmation/';
    }
  });

  /* Bouton fixe sur mobile : après l'ouverture, masqué en bas de page */
  var m = document.getElementById('mcta');
  if (m) {
    var onScroll = function () {
      var end = scrollY + innerHeight > document.documentElement.scrollHeight - 520;
      var on = scrollY > innerHeight * 0.8 && !end;
      m.classList.toggle('show', on);
      document.body.classList.toggle('cta-on', on);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Une seule question ouverte à la fois */
  var ds = document.querySelectorAll('.faq details');
  ds.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) ds.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Navigation : le lien de la section visible s'allume */
  var navLinks = document.querySelectorAll('.nav ul a[href^="#"]');
  if (navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* Calcul : ce que peuvent rapporter les 25 demandes garanties */
  var pan = document.getElementById('r-pan'), tx = document.getElementById('r-tx');
  if (pan && tx) {
    var eur = function (n) { return Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ') + ' €'; };
    var fill = function (r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); };
    var calc = function () {
      var ch = 25 * tx.value / 10;
      document.getElementById('o-pan').textContent = eur(+pan.value);
      document.getElementById('o-tx').textContent = tx.value;
      document.getElementById('o-res').textContent = eur(ch * pan.value);
      document.getElementById('o-ch').textContent = (ch % 1 ? Math.floor(ch) + ' à ' + Math.ceil(ch) : ch) + ' chantiers';
      fill(pan); fill(tx);
    };
    pan.addEventListener('input', calc);
    tx.addEventListener('input', calc);
    calc();
  }

  /* Éléments qui s'enchaînent (notifications, coches) */
  document.querySelectorAll('[data-t]').forEach(function (n) {
    setTimeout(function () { n.classList.add('on'); }, reduce ? 0 : +n.dataset.t);
  });
})();
