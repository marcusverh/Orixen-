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

  document.querySelectorAll('[data-book]').forEach(function (a) {
    a.href = bookingUrl();
    a.addEventListener('click', function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      ev.preventDefault();
      a.setAttribute('aria-busy', 'true');
      loadCalendly()
        .then(function () { window.Calendly.initPopupWidget({ url: bookingUrl() }); })
        .catch(function () { location.href = bookingUrl(); })
        .then(function () { a.removeAttribute('aria-busy'); });
    });
  });

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
      m.classList.toggle('show', scrollY > innerHeight * 0.8 && !end);
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

  /* Éléments qui s'enchaînent (notifications, coches) */
  document.querySelectorAll('[data-t]').forEach(function (n) {
    setTimeout(function () { n.classList.add('on'); }, reduce ? 0 : +n.dataset.t);
  });
})();
