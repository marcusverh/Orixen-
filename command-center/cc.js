/* Orixen Command Center · prototype */
(function () {
  'use strict';
  var D = window.CC_DATA, NOW = D.NOW;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { return Math.round(n).toLocaleString('fr-FR').replace(/ |\s/g, ' ') + ' €'; };
  var nf = function (n) { return Math.round(n).toLocaleString('fr-FR').replace(/ |\s/g, ' '); };
  var pct = function (a, b) { return b ? Math.round(a / b * 100) + ' %' : '·'; };
  var store = { get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var user = function (id) { return D.users.find(function (u) { return u.id === id; }) || { nom: '·' }; };
  var stage = function (id) { return D.stages.find(function (s) { return s.id === id; }); };
  var lead = function (id) { return D.leads.find(function (l) { return l.id === id; }); };
  var hoursSince = function (iso) { return (NOW - new Date(iso)) / 36e5; };
  var ago = function (iso) {
    var m = Math.round((NOW - new Date(iso)) / 6e4);
    if (m < 1) return 'à l’instant'; if (m < 60) return 'il y a ' + m + ' min';
    var h = Math.round(m / 60); if (h < 24) return 'il y a ' + h + ' h';
    var d = Math.round(h / 24); return 'il y a ' + d + ' j';
  };
  var dt = function (iso, o) { var s = new Date(iso).toLocaleString('fr-FR', o || { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); return s.replace(':', 'h'); };
  var dday = function (iso) { var s = new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); return s.charAt(0).toUpperCase() + s.slice(1); };
  var hhmm = function (iso) { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h'); };

  /* icônes */
  var P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    opp: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    perf: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    sys: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/><path d="M7 10l2 2 4-4"/>',
    team: '<path d="M4 5h16v11H8l-4 4z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    msg: '<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6A8 8 0 1 1 21 12z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
    euro: '<path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/>',
    flag: '<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
    dl: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>'
  };
  var ic = function (n, s) { return '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; };
  var stBadge = function (k, txt) { var i = { ok: 'check', warn: 'warn', crit: 'x', info: 'info', neutral: 'info' }[k]; return '<span class="st ' + k + '">' + ic(i, 13) + esc(txt) + '</span>'; };

  /* état */
  var S = {
    period: '30', view: 'board', q: '', fStage: '', fResp: '', fWork: '',
    done: store.get('cc-done') || [], perfTab: 'acq', repTab: 'hebdo', setTab: 'entreprise', rdvTab: 'avenir',
    ob: store.get('cc-ob') || { step: 0, data: {} }
  };

  /* période */
  function range() {
    var end = new Date(NOW), start = new Date(NOW), label;
    if (S.period === 'mois') { start = new Date(NOW.getFullYear(), NOW.getMonth(), 1); label = 'Octobre 2026'; }
    else if (S.period === 'trim') { start = new Date(NOW.getFullYear(), 9, 1); label = '4e trimestre 2026'; }
    else if (S.period === 'perso') { start = new Date(NOW); start.setDate(start.getDate() - 14); label = '14 derniers jours (exemple)'; }
    else { start.setDate(start.getDate() - 30); label = '30 derniers jours'; }
    var days = Math.max(1, Math.round((end - start) / 864e5));
    return { start: start, end: end, label: label, days: days };
  }
  function metrics() {
    var R = range();
    var L = D.leads.filter(function (l) { var t = new Date(l.recu); return t >= R.start && t <= R.end; });
    var spend = D.campagnes.reduce(function (a, c) { return a + c.depense; }, 0) * Math.min(1, R.days / 30);
    var q = L.filter(function (l) { return l.qualif === 'Qualifié'; });
    var rdv = L.filter(function (l) { return l.rdv; });
    var rdvDue = rdv.filter(function (l) { return new Date(l.rdv.at) <= NOW; });
    var honored = rdvDue.filter(function (l) { return l.rdv.statut === 'Honoré'; });
    var devis = L.filter(function (l) { return l.devis; });
    var won = L.filter(function (l) { return l.etape === 'signe'; });
    var ca = won.reduce(function (a, l) { return a + l.signe; }, 0);
    var reachable = L.filter(function (l) { return l.motif !== 'Coordonnées invalides'; });
    return { R: R, L: L, n: L.length, q: q.length, rdv: rdv.length, rdvDue: rdvDue.length, honored: honored.length, devis: devis.length, won: won.length, ca: ca, spend: spend,
      cpl: L.length ? spend / L.length : 0, cplq: q.length ? spend / q.length : 0, reach: reachable.length,
      impressions: D.campagnes.reduce(function (a, c) { return a + c.impressions; }, 0), clics: D.campagnes.reduce(function (a, c) { return a + c.clics; }, 0) };
  }

  /* tâches à traiter */
  function tasks() {
    var T = [];
    D.leads.forEach(function (l) {
      var r = user(l.resp).nom;
      if (l.etape === 'nouveau') T.push({ id: 'call-' + l.id, p: 1, lead: l.id, titre: 'Rappeler ' + l.nom, ctx: l.travaux + ' à ' + l.ville + ' · reçu ' + ago(l.recu), resp: r, ech: 'Aujourd’hui', act: 'Appeler', type: 'call' });
      if (l.etape === 'rdv' && l.rdv && l.rdv.statut === 'À confirmer') T.push({ id: 'conf-' + l.id, p: 2, lead: l.id, titre: 'Confirmer le rendez-vous de ' + l.nom, ctx: dday(l.rdv.at) + ' à ' + hhmm(l.rdv.at) + ' · ' + l.ville, resp: r, ech: 'Avant demain', act: 'Confirmer', type: 'confirm' });
      if (l.etape === 'rdv_fait') T.push({ id: 'res-' + l.id, p: 2, lead: l.id, titre: 'Renseigner le résultat du rendez-vous de ' + l.nom, ctx: 'Rendez-vous honoré · résultat non renseigné', resp: r, ech: 'Cette semaine', act: 'Renseigner', type: 'outcome' });
      if (l.etape === 'devis' && l.devis && hoursSince(l.devis.envoye) > 72) T.push({ id: 'dev-' + l.id, p: 2, lead: l.id, titre: 'Relancer le devis de ' + l.nom, ctx: 'Devis de ' + eur(l.devis.montant) + ' envoyé ' + ago(l.devis.envoye), resp: r, ech: 'Cette semaine', act: 'Relancer', type: 'call' });
      if (l.etape === 'contacte' && hoursSince(l.recu) > 24) T.push({ id: 'qual-' + l.id, p: 3, lead: l.id, titre: 'Qualifier ' + l.nom, ctx: 'Contacté, qualification non renseignée', resp: r, ech: 'Sans échéance', act: 'Mettre à jour', type: 'open' });
    });
    return T.sort(function (a, b) { return a.p - b.p; });
  }
  var activeTasks = function () { return tasks().filter(function (t) { return S.done.indexOf(t.id) < 0; }); };

  /* système */
  function pulse() {
    var bad = D.systeme.filter(function (c) { return c.statut !== 'ok'; });
    var last = D.systeme.reduce(function (a, c) { return new Date(c.verif) > new Date(a) ? c.verif : a; }, D.systeme[0].verif);
    return { ok: !bad.length, bad: bad, last: last, total: D.systeme.length };
  }

  /* navigation */
  var NAV = [
    ['', 'Vue d’ensemble', 'home'], ['opportunites', 'Opportunités', 'opp'], ['performance', 'Performance', 'perf'],
    ['rendez-vous', 'Rendez-vous', 'cal'], ['systeme', 'Système', 'sys'], ['equipe', 'Équipe Orixen', 'team'], ['parametres', 'Paramètres', 'gear']
  ];
  function renderNav(cur) {
    var nt = activeTasks().length;
    $('#nav').innerHTML = NAV.map(function (n) {
      var b = n[0] === '' && nt ? '<span class="badge">' + nt + '</span>' : (n[0] === 'systeme' && !pulse().ok ? '<span class="badge" style="background:var(--warn)">1</span>' : '');
      return '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '"' + (cur === n[0] ? ' aria-current="page"' : '') + '>' + ic(n[2]) + n[1] + b + '</a>';
    }).join('');
    var newLeads = D.leads.filter(function (l) { return l.etape === 'nouveau'; }).length;
    var tabItems = [['', 'Accueil', 'home', nt], ['opportunites', 'Prospects', 'opp', newLeads], ['rendez-vous', 'Rendez-vous', 'cal', 0], ['performance', 'Résultats', 'perf', 0]];
    $('#tab').innerHTML = tabItems.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '">' + ic(n[2], 22) + n[1] + (n[3] ? '<span class="badge">' + n[3] + '</span>' : '') + '</a>'; }).join('') +
      '<button id="more" class="' + (['systeme', 'equipe', 'parametres'].indexOf(cur) > -1 ? 'on' : '') + '">' + ic('more', 22) + 'Plus</button>';
    $('#more').onclick = function () { openSheet(true); };
    $('#sheet-b').innerHTML = [['systeme', 'Système', 'sys'], ['equipe', 'Équipe Orixen', 'team'], ['parametres', 'Paramètres', 'gear']].map(function (n) { return '<a href="#/' + n[0] + '">' + ic(n[2], 20) + n[1] + '</a>'; }).join('');
    var p = pulse();
    $('#pulse-chip').innerHTML = (p.ok ? '<span style="color:var(--ok)">' + ic('check', 14) + '</span><span class="hide-m">Tout fonctionne</span>' : '<span style="color:var(--warn)">' + ic('warn', 14) + '</span><span class="hide-m">1 point surveillé</span>');
    $('#pulse-chip').setAttribute('aria-label', p.ok ? 'Système : tout fonctionne' : 'Système : 1 point surveillé');
  }
  function openSheet(on) { $('#sheet').classList.toggle('on', on); $('#scrim').classList.toggle('on', on || $('#drawer').classList.contains('on')); }

  /* toast */
  var tt;
  function toast(msg) { var t = $('#toast'); t.innerHTML = ic('check', 16) + esc(msg); t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2600); }
  var stamp = function () { return 'par vous, à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h'); };

  /* KPI */
  var DEF = {
    leads: ['Leads reçus', 'Nombre de formulaires reçus sur la période, doublons et tests compris.', 'Un volume élevé ne suffit pas : ce qui compte, c’est combien deviennent des clients.'],
    qualif: ['Leads qualifiés', 'Prospects joignables, propriétaires ou mandatés, avec un projet dans votre zone et votre métier.', 'Taux de qualification = leads qualifiés ÷ leads reçus.'],
    rdv: ['Rendez-vous obtenus', 'Rendez-vous pris avec un prospect sur la période, quelle que soit leur date.', 'Taux de prise de rendez-vous = rendez-vous pris ÷ leads reçus.'],
    ventes: ['Ventes signées', 'Ventes déclarées comme signées par votre équipe, issues d’un lead Orixen.', 'Seules les ventes renseignées sont comptées.'],
    cplq: ['Coût par lead qualifié', 'Dépenses publicitaires ÷ leads qualifiés.', 'Plus parlant que le coût par lead : il ignore les demandes inutilisables.']
  };
  function cmp(cur, prev, lowerIsBetter, fmt) {
    if (prev == null || !prev) return '<span class="muted">Pas de période précédente</span>';
    var d = (cur - prev) / prev * 100, r = Math.round(d);
    if (Math.abs(r) < 3) return '<span class="flat">Stable</span> vs période précédente';
    var good = lowerIsBetter ? d < 0 : d > 0;
    return '<span class="' + (good ? 'up' : 'down') + '">' + (d > 0 ? '+' : '') + r + ' %</span> vs ' + (fmt ? fmt(prev) : prev);
  }
  function kpiCard(key, val, c) {
    return '<button class="kpi" data-def="' + key + '" aria-label="' + esc(DEF[key][0]) + ' : ' + esc(val) + '. Voir la définition"><span class="lab">' + DEF[key][0] + ic('info', 13) + '</span><div class="val num">' + val + '</div><div class="cmp">' + c + '</div></button>';
  }
  function showDef(key) {
    var d = DEF[key], M = metrics();
    openAI();
    $('#ai-q').value = '';
    $('#ai-b').innerHTML = '<div class="ans"><h3>' + d[0] + '</h3><ul><li>' + esc(d[1]) + '</li><li>' + esc(d[2]) + '</li></ul><h5>' + ic('cal', 13) + 'PÉRIODE</h5><ul><li>' + M.R.label + ', mis à jour à ' + hhmm(NOW.toISOString()) + '.</li></ul></div>';
  }

  /* graphique en ligne */
  function lineChart(id) {
    var s = D.serie, W = 720, H = 200, pl = 28, pr = 12, pt = 14, pb = 26;
    var max = Math.max.apply(null, s.map(function (x) { return x.recus; })) + 1;
    var x = function (i) { return pl + i * (W - pl - pr) / (s.length - 1); };
    var y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var path = function (k) { return s.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[k]).toFixed(1); }).join(' '); };
    var g = '';
    for (var v = 0; v <= max; v++) g += '<line class="grid-l" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="ax" x="' + (pl - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    [0, 7, 14, 21, 29].forEach(function (i) { g += '<text class="ax" x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + new Date(s[i].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + '</text>'; });
    return '<div class="legend"><span><i style="background:var(--s1)"></i>Leads reçus</span><span><i style="background:var(--s2)"></i>Leads qualifiés</span></div>' +
      '<svg class="chart" id="' + id + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Leads reçus et qualifiés par jour sur 30 jours">' + g +
      '<path class="l1" d="' + path('recus') + '"/><path class="l2" d="' + path('qualifies') + '"/>' +
      '<line id="' + id + '-x" stroke="var(--text-3)" stroke-dasharray="3 3" y1="' + pt + '" y2="' + (H - pb) + '" opacity="0"/>' +
      '<rect x="' + pl + '" y="0" width="' + (W - pl - pr) + '" height="' + H + '" fill="transparent" data-w="' + W + '" data-pl="' + pl + '" data-pr="' + pr + '"/></svg>';
  }
  function bindChart(id) {
    var svg = document.getElementById(id); if (!svg) return;
    var r = svg.querySelector('rect'), line = document.getElementById(id + '-x'), tip = $('#tip'), s = D.serie;
    var move = function (e) {
      var b = svg.getBoundingClientRect(), W = +r.dataset.w, pl = +r.dataset.pl, pr = +r.dataset.pr;
      var px = ((e.touches ? e.touches[0].clientX : e.clientX) - b.left) / b.width * W;
      var i = Math.max(0, Math.min(s.length - 1, Math.round((px - pl) / (W - pl - pr) * (s.length - 1))));
      var xx = pl + i * (W - pl - pr) / (s.length - 1);
      line.setAttribute('x1', xx); line.setAttribute('x2', xx); line.setAttribute('opacity', 1);
      tip.innerHTML = '<b>' + new Date(s[i].date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + '</b><div><span>Leads reçus</span><span>' + s[i].recus + '</span></div><div><span>Leads qualifiés</span><span>' + s[i].qualifies + '</span></div>';
      var cx = (e.touches ? e.touches[0].clientX : e.clientX), cy = (e.touches ? e.touches[0].clientY : e.clientY);
      tip.style.left = Math.min(cx + 14, innerWidth - 170) + 'px'; tip.style.top = (cy - 70) + 'px'; tip.classList.add('on');
    };
    var leave = function () { line.setAttribute('opacity', 0); tip.classList.remove('on'); };
    r.addEventListener('mousemove', move); r.addEventListener('touchmove', move, { passive: true });
    r.addEventListener('mouseleave', leave); r.addEventListener('touchend', leave);
  }
  function funnel(M) {
    var rows = [['Leads reçus', M.n], ['Leads qualifiés', M.q], ['Rendez-vous pris', M.rdv], ['Rendez-vous réalisés', M.honored], ['Devis envoyés', M.devis], ['Ventes signées', M.won]];
    var max = rows[0][1] || 1;
    return '<div class="funnel">' + rows.map(function (r) { return '<div class="fr" title="' + r[0] + ' : ' + r[1] + '"><span>' + r[0] + '</span><div class="bar"><i style="width:' + (r[1] / max * 100) + '%"></i></div><b class="num">' + r[1] + '</b></div>'; }).join('') + '</div>';
  }

  /* ─── VUE D'ENSEMBLE ─── */
  function vOverview() {
    var M = metrics(), p = pulse(), T = activeTasks(), pr = D.precedent;
    var calls = T.filter(function (t) { return t.type === 'call' && t.p === 1; });
    var hour = NOW.getHours(), greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    var gDays = Math.round((NOW - new Date(D.garantie.debut)) / 864e5);
    var summary = M.won + ' ventes signées pour ' + eur(M.ca) + ', ' + M.q + ' leads qualifiés, et ' + (calls.length ? calls.length + ' prospects attendent votre appel.' : 'aucun prospect en attente.');
    var prio = calls.length ? {
      t: 'Rappeler ' + calls.length + ' nouveau' + (calls.length > 1 ? 'x' : '') + ' prospect' + (calls.length > 1 ? 's' : '') + '.',
      p: 'Ils ont reçu un SMS leur annonçant votre appel aujourd’hui. Le plus ancien attend depuis ' + ago(lead(calls[calls.length - 1].lead).recu).replace('il y a ', '') + '. Les demandes rappelées vite se signent plus souvent.',
      rows: calls.map(function (t) { var l = lead(t.lead); return '<a href="#/opportunites/' + l.id + '"><span>' + esc(l.nom) + ' · ' + esc(l.travaux) + '</span><span>' + ago(l.recu) + '</span></a>'; }).join('')
    } : { t: 'Rien d’urgent aujourd’hui.', p: 'Tous vos prospects ont été rappelés. Profitez-en pour renseigner vos résultats de rendez-vous.', rows: '' };

    return '<section class="hello"><h2>' + greet + ' Julien.</h2><p>' + esc(D.entreprise) + ' · ' + M.R.label + '. ' + esc(summary) + '</p></section>' +

      '<div class="grid g-main">' +
        '<div class="card" aria-label="État du système"><div class="pulse"><div class="ring ' + (p.ok ? 'ok' : 'warn') + '">' + ic(p.ok ? 'check' : 'warn', 22) + '</div><div><h3>Orixen Pulse · ' + (p.ok ? 'Tout fonctionne normalement' : 'Tout fonctionne · 1 point surveillé') + '</h3><p>' + p.total + ' composants vérifiés · dernière vérification réelle ' + ago(p.last) + '.</p></div><a class="btn sm" href="#/systeme">Détails</a></div>' +
        (p.bad.length ? '<div class="alert" style="margin:14px 0 0"><span>' + ic('warn') + '</span><div><h4>Problème technique · ' + esc(p.bad[0].nom) + '</h4><p>' + esc(p.bad[0].incident.txt) + '. ' + esc(p.bad[0].incident.confirme) + ' Rien à faire de votre côté : Marcus suit le point.</p></div></div>' : '') +
        '<div class="pulse-list">' + [['Campagnes', 'ok'], ['Formulaires', 'ok'], ['Connexions', 'ok'], ['Automatisations', p.ok ? 'ok' : 'warn']].map(function (x) { return '<div>' + stBadge(x[1], x[1] === 'ok' ? 'OK' : 'Surveillé') + x[0] + '</div>'; }).join('') + '</div></div>' +
        '<div class="prio"><span class="k">Votre priorité aujourd’hui</span><h3>' + prio.t + '</h3><p>' + prio.p + '</p>' + (prio.rows ? '<div class="rows">' + prio.rows + '</div>' : '') + '</div>' +
      '</div>' +

      '<div class="sec-t"><span>Vos résultats · ' + M.R.label + '</span><span class="hide-m">Garantie : ' + M.q + ' leads qualifiés sur ' + D.garantie.objectif + ', jour ' + gDays + ' sur ' + D.garantie.jours + '</span></div>' +
      '<div class="kpis">' +
        kpiCard('leads', M.n, cmp(M.n, pr.leads)) +
        kpiCard('qualif', M.q, cmp(M.q, pr.qualifies) + ' · ' + pct(M.q, M.n)) +
        kpiCard('rdv', M.rdv, cmp(M.rdv, pr.rdv)) +
        kpiCard('ventes', M.won, cmp(M.won, pr.ventes)) +
        kpiCard('cplq', eur(M.cplq), cmp(M.cplq, pr.cplq, true, eur)) +
      '</div>' +
      '<div class="second"><span>Budget publicitaire dépensé <b class="num">' + eur(M.spend) + '</b></span><span>Chiffre d’affaires signé attribué <b class="num">' + eur(M.ca) + '</b></span><a class="link" href="#/performance">Comprendre ces chiffres</a></div>' +
      '<p class="upd">Mis à jour aujourd’hui à ' + hhmm(NOW.toISOString()) + ' · ventes déclarées par votre équipe · touchez un indicateur pour sa définition.</p>' +

      '<div class="sec-t"><span>À traiter · ' + T.length + '</span><a class="link" href="#/historique">Historique</a></div>' +
      '<div class="card" style="padding:6px 16px">' + tasksHtml(T) + '</div>' +

      '<div class="grid g2 sec">' +
        '<div class="card"><div class="card-h"><h3>Les demandes arrivent-elles régulièrement ?</h3><span class="meta">30 derniers jours</span></div>' + lineChart('ch1') + '</div>' +
        '<div class="card"><div class="card-h"><h3>Où se perdent vos prospects ?</h3><span class="meta">' + M.R.label + '</span></div><p class="q">Sur <b>' + M.n + '</b> leads reçus, <b>' + M.won + '</b> sont devenus des ventes. L’étape la plus faible est la prise de rendez-vous.</p>' + funnel(M) + '</div>' +
      '</div>';
  }
  function tasksHtml(T) {
    if (!T.length) return '<div class="empty">Tout est traité. Les nouvelles tâches apparaîtront ici.</div>';
    return '<div class="tasks">' + T.map(function (t) {
      var l = lead(t.lead), href = t.type === 'call' ? 'tel:' + l.tel.replace(/\s/g, '') : '#/opportunites/' + l.id;
      return '<div class="task" data-t="' + t.id + '"><span class="dot p' + t.p + '" title="Priorité ' + ['haute', 'moyenne', 'basse'][t.p - 1] + '"></span><div><h4>' + esc(t.titre) + '</h4><p>' + esc(t.ctx) + ' · ' + esc(t.resp) + ' · ' + esc(t.ech) + ' · <span class="sr">priorité </span>' + ['Haute', 'Moyenne', 'Basse'][t.p - 1] + '</p></div><div class="acts">' +
        (t.type === 'outcome' ? '<a class="btn sm acc" href="#/opportunites/' + l.id + '?resultat">' + t.act + '</a>' : '<a class="btn sm acc" href="' + href + '" data-act="' + t.type + '">' + t.act + '</a>') +
        '<button class="btn sm" data-done="' + t.id + '">Fait</button></div></div>';
    }).join('') + '</div>';
  }
  function bindTasks(root) {
    $$('[data-done]', root).forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.done, row = b.closest('.task');
        S.done.push(id); store.set('cc-done', S.done);
        b.textContent = 'Fait'; b.classList.add('done');
        row.classList.add('out');
        setTimeout(function () { render(); }, 340);
        toast('Tâche terminée · ' + stamp());
      };
    });
  }

  /* ─── HISTORIQUE ─── */
  function vHistory() {
    var all = tasks().filter(function (t) { return S.done.indexOf(t.id) > -1; });
    return '<section class="hello"><h2>Historique des tâches</h2><p>Les tâches terminées restent consultables ici.</p></section><div class="card" style="padding:6px 16px">' +
      (all.length ? '<div class="tasks">' + all.map(function (t) { return '<div class="task"><span style="color:var(--ok)">' + ic('check') + '</span><div><h4>' + esc(t.titre) + '</h4><p>' + esc(t.ctx) + ' · terminé par vous</p></div><div class="acts"><button class="btn sm" data-undo="' + t.id + '">Rétablir</button></div></div>'; }).join('') + '</div>' : '<div class="empty">Aucune tâche terminée pour le moment.</div>') + '</div>';
  }

  /* ─── OPPORTUNITÉS ─── */
  function filtered() {
    var q = S.q.trim().toLowerCase();
    return D.leads.filter(function (l) {
      if (S.fStage && l.etape !== S.fStage) return false;
      if (S.fResp && l.resp !== S.fResp) return false;
      if (S.fWork && l.travaux !== S.fWork) return false;
      if (q && (l.nom + ' ' + l.ville + ' ' + l.travaux + ' ' + l.tel + ' ' + l.id).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function vOpp() {
    var L = filtered(), works = Array.from(new Set(D.leads.map(function (l) { return l.travaux; })));
    var slow = D.leads.filter(function (l) { return l.etape === 'nouveau' || (l.etape === 'contacte' && hoursSince(l.recu) > 24); });
    var oldest = slow.length ? Math.max.apply(null, slow.map(function (l) { return hoursSince(l.recu); })) : 0;
    var html = '<section class="hello"><h2>Opportunités</h2><p>' + D.leads.length + ' prospects · ' + D.leads.filter(function (l) { return l.etape === 'nouveau'; }).length + ' nouveaux · valeur estimée en cours ' + eur(D.leads.filter(function (l) { return ['signe', 'perdu'].indexOf(l.etape) < 0; }).reduce(function (a, l) { return a + l.valeur; }, 0)) + ' (estimation, différente du signé).</p></section>';
    if (slow.length) html += '<div class="alert"><span>' + ic('warn') + '</span><div><h4>' + slow.length + ' prospects attendent un premier contact ou une qualification</h4><p>Le plus ancien attend depuis ' + Math.round(oldest) + ' heures. Recommandation : les rappeler en premier, avant les nouveaux devis. Rien ne permet de dire qu’ils sont perdus.</p></div><a class="btn sm" href="#/">Voir les tâches</a></div>';
    html += '<div class="tools"><label class="search">' + ic('search', 16) + '<input id="q" type="search" placeholder="Rechercher un nom, une ville, un téléphone" value="' + esc(S.q) + '" aria-label="Rechercher un prospect"></label>' +
      '<select class="sel" id="fStage" aria-label="Étape"><option value="">Toutes les étapes</option>' + D.stages.map(function (s) { return '<option value="' + s.id + '"' + (S.fStage === s.id ? ' selected' : '') + '>' + s.nom + '</option>'; }).join('') + '</select>' +
      '<select class="sel" id="fResp" aria-label="Responsable"><option value="">Tous les responsables</option>' + D.users.slice(0, 2).map(function (u) { return '<option value="' + u.id + '"' + (S.fResp === u.id ? ' selected' : '') + '>' + u.nom + '</option>'; }).join('') + '</select>' +
      '<select class="sel hide-m" id="fWork" aria-label="Travaux"><option value="">Tous les travaux</option>' + works.map(function (w) { return '<option' + (S.fWork === w ? ' selected' : '') + '>' + esc(w) + '</option>'; }).join('') + '</select>' +
      '<div class="seg" role="tablist"><button data-view="board" class="' + (S.view === 'board' ? 'on' : '') + '">Pipeline</button><button data-view="list" class="' + (S.view === 'list' ? 'on' : '') + '">Liste</button></div></div>';
    if (S.view === 'board') {
      html += '<div class="board">' + D.stages.map(function (s) {
        var items = L.filter(function (l) { return l.etape === s.id; });
        var late = s.id === 'nouveau' && items.some(function (l) { return hoursSince(l.recu) > 2; });
        return '<div class="col"><div class="col-h' + (late ? ' slow' : '') + '">' + s.nom + ' <span>' + items.length + '</span></div>' + items.map(card).join('') + (items.length ? '' : '<div class="empty" style="padding:10px">Aucun</div>') + '</div>';
      }).join('') + '</div>';
    } else {
      html += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Prospect</th><th>Travaux</th><th class="hide-m">Ville</th><th>Étape</th><th class="hide-m">Responsable</th><th class="hide-m">Reçu</th><th class="r">Valeur</th></tr></thead><tbody>' +
        L.map(function (l) { return '<tr class="row" data-lead="' + l.id + '"><td><b>' + esc(l.nom) + '</b></td><td>' + esc(l.travaux) + '</td><td class="hide-m">' + esc(l.ville) + '</td><td>' + stageBadge(l) + '</td><td class="hide-m">' + esc(user(l.resp).nom) + '</td><td class="hide-m">' + ago(l.recu) + '</td><td class="r num">' + (l.signe ? '<b>' + eur(l.signe) + '</b>' : (l.valeur ? eur(l.valeur) : '·')) + '</td></tr>'; }).join('') +
        (L.length ? '' : '<tr><td colspan="7" class="empty">Aucun prospect ne correspond. Effacez un filtre.</td></tr>') + '</tbody></table></div>';
    }
    return html;
  }
  function stageBadge(l) {
    var k = l.etape === 'signe' ? 'ok' : l.etape === 'perdu' ? 'neutral' : l.etape === 'nouveau' ? 'info' : 'neutral';
    return stBadge(k, stage(l.etape).nom.replace('Opportunités perdues', l.qualif === 'Disqualifié' ? 'Disqualifié' : 'Perdu'));
  }
  function card(l) {
    var late = l.etape === 'nouveau' && hoursSince(l.recu) > 2;
    return '<a class="lc" href="#/opportunites/' + l.id + '"><b>' + esc(l.nom) + '</b><span>' + esc(l.travaux) + ' · ' + esc(l.ville) + '</span><div class="foot"><span class="age' + (late ? ' late' : '') + '">' + ago(l.recu) + '</span><span class="num">' + (l.signe ? eur(l.signe) : l.valeur ? eur(l.valeur) : '') + '</span></div></a>';
  }
  function bindOpp() {
    var q = $('#q');
    if (q) q.oninput = function () { S.q = q.value; var pos = q.selectionStart; render(); var n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); };
    ['fStage', 'fResp', 'fWork'].forEach(function (k) { var el = $('#' + k); if (el) el.onchange = function () { S[k] = el.value; render(); }; });
    $$('[data-view]').forEach(function (b) { b.onclick = function () { S.view = b.dataset.view; render(); }; });
    $$('[data-lead]').forEach(function (r) { r.onclick = function () { location.hash = '#/opportunites/' + r.dataset.lead; }; });
  }

  /* fiche prospect */
  function openLead(id, mode) {
    var l = lead(id); if (!l) return;
    var tlIcon = { form: 'form', crm: 'db', notif: 'bell', call: 'phone', status: 'flag', rdv: 'cal', devis: 'euro', win: 'check', lost: 'x' };
    var h = '<div class="dr-h"><div style="flex:1;min-width:0"><span class="k">' + l.id + ' · ' + stage(l.etape).nom + '</span><h2>' + esc(l.nom) + '</h2><p>' + esc(l.travaux) + ' · ' + esc(l.ville) + ' · reçu ' + dt(l.recu) + '</p></div><button class="icon-btn" id="dr-x" aria-label="Fermer la fiche">' + ic('x', 16) + '</button></div><div class="dr-b">' +
      '<div class="quick"><a href="tel:' + l.tel.replace(/\s/g, '') + '">' + ic('phone') + 'Appeler</a><a href="sms:' + l.tel.replace(/\s/g, '') + '">' + ic('msg') + 'Message</a><button data-q="rdv">' + ic('cal') + 'Rendez-vous</button><button data-q="assign">' + ic('user') + 'Attribuer</button></div>' +
      '<div class="card"><div class="card-h"><h3>Statut</h3><span class="meta" id="st-meta">Modifié ' + ago(l.historique[l.historique.length - 1].at) + ' par ' + esc(l.historique[l.historique.length - 1].par) + '</span></div>' +
        '<div class="pills" id="stage-pills">' + D.stages.map(function (s) { return '<button data-stage="' + s.id + '" class="' + (l.etape === s.id ? 'on' : '') + '">' + s.nom.replace('Opportunités perdues', 'Perdue') + '</button>'; }).join('') + '</div>' +
        '<div id="disq" style="margin-top:12px' + (l.etape === 'perdu' ? '' : ';display:none') + '"><div class="field"><label for="motif">Motif</label><select id="motif"><option value="">Choisir un motif</option>' + ['Coordonnées invalides', 'Doublon', 'Hors zone', 'Prestation non adaptée', 'Budget incompatible', 'Projet trop éloigné', 'Prix jugé trop élevé', 'A choisi un concurrent', 'Ne répond plus'].map(function (m) { return '<option' + (l.motif === m ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></div><p class="small muted" style="margin-top:6px">Ces motifs servent à Orixen pour améliorer la qualité des prospects, pas seulement leur nombre.</p></div></div>' +
      outcomeForm(l, mode === 'resultat') +
      '<div class="card"><div class="card-h"><h3>Projet</h3><span class="locked">' + ic('lock', 12) + 'Visible par vous et ' + esc(user(l.resp).nom) + '</span></div><dl class="kv">' +
        [['Téléphone', l.tel], ['E-mail', l.email], ['Travaux', l.travaux], ['Ville', l.ville], ['Budget indiqué', l.budget], ['Délai du projet', l.delai], ['Propriétaire', 'Oui'], ['Qualification', l.qualif], ['Source', l.source], ['Campagne', (D.campagnes.find(function (c) { return c.id === l.campagne; }) || {}).nom], ['Responsable', user(l.resp).nom], ['Rendez-vous', l.rdv ? dt(l.rdv.at) + ' · ' + l.rdv.statut : 'Aucun'], ['Devis', l.devis ? eur(l.devis.montant) + ' · envoyé ' + ago(l.devis.envoye) : 'Aucun'], ['Valeur estimée', l.valeur ? eur(l.valeur) : '·'], ['Montant signé', l.signe ? eur(l.signe) : '·'], ['Consentement', 'Accepte d’être rappelé']]
          .map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl></div>' +
      '<div class="card"><div class="card-h"><h3>Historique</h3><span class="meta">' + l.historique.length + ' événements</span></div><ul class="tl" id="tl">' +
        l.historique.slice().reverse().map(function (e) { return '<li><span class="ic ' + (e.type === 'win' ? 'win' : e.type === 'lost' ? 'lost' : '') + '">' + ic(tlIcon[e.type] || 'info', 12) + '</span><div><b>' + esc(e.txt) + '</b><span>' + dt(e.at) + ' · ' + esc(e.par) + '</span></div></li>'; }).join('') + '</ul></div>' +
      '</div>';
    var dr = $('#drawer'); dr.innerHTML = h; dr.classList.add('on'); $('#scrim').classList.add('on');
    $('#dr-x').onclick = closeLead; dr.querySelector('.dr-b').scrollTop = mode === 'resultat' ? 340 : 0;
    $$('[data-stage]', dr).forEach(function (b) {
      b.onclick = function () {
        var prev = l.etape; l.etape = b.dataset.stage;
        $$('[data-stage]', dr).forEach(function (x) { x.classList.toggle('on', x === b); });
        $('#disq').style.display = l.etape === 'perdu' ? '' : 'none';
        addEvent(l, 'status', 'Étape : ' + stage(prev).nom + ' → ' + stage(l.etape).nom);
        $('#st-meta').textContent = 'Modifié à l’instant par vous';
        toast('Statut mis à jour · ' + stamp()); renderNav(cur);
      };
    });
    var m = $('#motif'); if (m) m.onchange = function () { l.motif = m.value; addEvent(l, 'lost', 'Motif : ' + m.value); toast('Motif enregistré · ' + stamp()); };
    $$('[data-q]', dr).forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.q === 'assign') { var other = l.resp === 'u1' ? 'u2' : 'u1'; l.resp = other; addEvent(l, 'status', 'Attribué à ' + user(other).nom); toast('Attribué à ' + user(other).nom); openLead(id); }
        else { toast('Choix du créneau : version connectée à votre calendrier'); }
      };
    });
    bindOutcome(l);
  }
  function outcomeForm(l, open) {
    if (['rdv_fait', 'devis', 'nego', 'rdv'].indexOf(l.etape) < 0 && !open) return '';
    var Q = [['hon', 'Le rendez-vous a-t-il été honoré ?', ['Oui', 'Non', 'Reporté']], ['qua', 'Le prospect est-il qualifié ?', ['Oui', 'Non']], ['dev', 'Devis envoyé ?', ['Oui', 'Pas encore']], ['res', 'Résultat', ['Gagné', 'En cours', 'Perdu']]];
    return '<div class="card" id="outcome"><div class="card-h"><h3>Après le rendez-vous</h3><span class="meta">20 secondes</span></div><div class="form">' +
      Q.map(function (q) { return '<div class="field"><label>' + q[1] + '</label><div class="pills" data-o="' + q[0] + '">' + q[2].map(function (o) { return '<button>' + o + '</button>'; }).join('') + '</div></div>'; }).join('') +
      '<div class="field" id="o-amt" style="display:none"><label for="amt">Montant réellement signé</label><input id="amt" inputmode="numeric" placeholder="Exemple : 18 600"></div>' +
      '<div class="field" id="o-why" style="display:none"><label for="why">Motif de perte</label><select id="why"><option>Prix jugé trop élevé</option><option>A choisi un concurrent</option><option>Projet reporté</option><option>Ne répond plus</option><option>Autre</option></select></div>' +
      '<button class="btn pri" id="o-save">Enregistrer le résultat</button></div></div>';
  }
  function bindOutcome(l) {
    var box = $('#outcome'); if (!box) return; var ans = {};
    $$('[data-o]', box).forEach(function (g) {
      $$('button', g).forEach(function (b) {
        b.onclick = function () {
          $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); }); ans[g.dataset.o] = b.textContent;
          $('#o-amt').style.display = ans.res === 'Gagné' ? '' : 'none'; $('#o-why').style.display = ans.res === 'Perdu' ? '' : 'none';
        };
      });
    });
    $('#o-save').onclick = function () {
      var b = this; if (!ans.res) { toast('Choisissez au moins le résultat'); return; }
      if (ans.res === 'Gagné') { l.etape = 'signe'; l.signe = +($('#amt').value || '').replace(/\D/g, '') || l.valeur; addEvent(l, 'win', 'Vente signée · ' + eur(l.signe)); }
      else if (ans.res === 'Perdu') { l.etape = 'perdu'; l.motif = $('#why').value; addEvent(l, 'lost', 'Perdu · ' + l.motif); }
      else { if (ans.dev === 'Oui') l.etape = 'devis'; addEvent(l, 'status', 'Résultat du rendez-vous renseigné'); }
      b.textContent = 'Enregistré'; b.classList.add('done');
      toast('Résultat enregistré · il alimente vos rapports');
      setTimeout(function () { openLead(l.id); render(); }, 500);
    };
  }
  function addEvent(l, type, txt) { l.historique.push({ at: new Date().toISOString(), type: type, txt: txt, par: 'Vous' }); var t = $('#tl'); if (t) t.insertAdjacentHTML('afterbegin', '<li><span class="ic">' + ic('flag', 12) + '</span><div><b>' + esc(txt) + '</b><span>à l’instant · Vous</span></div></li>'); }
  function closeLead() { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); if (/^#\/opportunites\//.test(location.hash)) history.replaceState(null, '', '#/opportunites'); }

  /* ─── PERFORMANCE ─── */
  function vPerf() {
    var M = metrics(), tabs = [['acq', 'Acquisition'], ['qual', 'Qualité commerciale'], ['biz', 'Résultats business'], ['camp', 'Campagnes'], ['rep', 'Rapports']];
    var h = '<section class="hello"><h2>Performance</h2><p>' + M.R.label + '. Trois niveaux, du clic à la vente signée. Chaque chiffre a sa définition.</p></section><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button data-pt="' + t[0] + '" class="' + (S.perfTab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var row = function (lab, val, def) { return '<div class="set-row"><div><h4>' + lab + '</h4><p>' + def + '</p></div><b class="num" style="font-size:19px">' + val + '</b></div>'; };
    if (S.perfTab === 'acq') h += '<div class="card"><div class="set-list">' + row('Dépenses publicitaires', eur(M.spend), 'Montant facturé par Meta sur la période, sur votre compte.') + row('Impressions', nf(M.impressions), 'Nombre d’affichages de vos publicités.') + row('Clics', nf(M.clics), 'Clics vers votre formulaire.') + row('Formulaires reçus', M.n, 'Demandes envoyées, avant tri.') + row('Coût par lead', eur(M.cpl), 'Dépenses ÷ leads reçus.') + '</div></div>';
    if (S.perfTab === 'qual') h += '<div class="card"><div class="set-list">' + row('Leads joignables', M.reach + ' sur ' + M.n, 'Leads dont les coordonnées fonctionnent.') + row('Taux de qualification', pct(M.q, M.n), 'Leads qualifiés ÷ leads reçus.') + row('Coût par lead qualifié', eur(M.cplq), 'Dépenses ÷ leads qualifiés.') + row('Taux de prise de rendez-vous', pct(M.rdv, M.n), 'Rendez-vous pris ÷ leads reçus.') + row('Taux de présence', pct(M.honored, M.rdvDue), 'Rendez-vous honorés ÷ rendez-vous prévus arrivés à échéance (' + M.rdvDue + ').') + row('Devis envoyés', M.devis, 'Devis déclarés comme envoyés.') + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Pourquoi des leads ont été écartés</h3><span class="meta">Motifs renseignés</span></div>' + disqHtml() + '</div>';
    if (S.perfTab === 'biz') {
      var cac = M.won ? (M.spend + 2500) / M.won : 0;
      h += '<div class="card"><div class="set-list">' + row('Ventes signées', M.won, 'Ventes déclarées par votre équipe, issues d’un lead Orixen.') + row('Chiffre d’affaires attribué', eur(M.ca), 'Montants signés reliés à un lead Orixen (règle : le lead est la première source du contact).') + row('Coût d’acquisition client', eur(cac), '(Dépenses publicitaires + honoraires Orixen du mois, 2 500 €) ÷ ventes signées.') + row('Taux de transformation', pct(M.won, M.honored + 0), 'Ventes ÷ rendez-vous réalisés, sur les opportunités de plus de 21 jours.') + '</div></div>' +
        '<div class="alert info"><span>' + ic('info') + '</span><div><h4>Ce que ces chiffres ne disent pas encore</h4><p>Le chiffre d’affaires attribué n’est pas forcément incrémental : certains clients vous auraient peut-être trouvé autrement. Et ce n’est pas votre marge. Renseignez votre taux de marge moyen dans Paramètres pour obtenir une rentabilité réelle.</p></div><a class="btn sm" href="#/parametres">Renseigner</a></div>';
    }
    if (S.perfTab === 'camp') h += D.campagnes.map(campCard).join('');
    if (S.perfTab === 'rep') h += vReports();
    return h;
  }
  function disqHtml() {
    var c = {}; D.leads.forEach(function (l) { if (l.motif && l.qualif === 'Disqualifié') c[l.motif] = (c[l.motif] || 0) + 1; });
    var k = Object.keys(c); if (!k.length) return '<div class="empty">Aucun motif renseigné.</div>';
    return '<div class="funnel">' + k.map(function (m) { return '<div class="fr"><span>' + m + '</span><div class="bar"><i style="width:' + (c[m] / Math.max.apply(null, k.map(function (x) { return c[x]; })) * 100) + '%"></i></div><b class="num">' + c[m] + '</b></div>'; }).join('') + '</div><p class="small muted" style="margin-top:12px">Action Orixen : zone resserrée à 15 km le 21 octobre, après deux leads hors zone.</p>';
  }
  function campCard(c) {
    var st = { active: ['ok', 'Active'], apprentissage: ['info', 'En apprentissage'], pause: ['neutral', 'En pause'], erreur: ['crit', 'En erreur'] }[c.statut];
    var leads = D.leads.filter(function (l) { return l.campagne === c.id; });
    var q = leads.filter(function (l) { return l.qualif === 'Qualifié'; }).length, won = leads.filter(function (l) { return l.etape === 'signe'; });
    return '<div class="card"><div class="card-h"><div><h3>' + esc(c.nom) + '</h3><p class="small muted">' + esc(c.objectif) + '</p></div>' + stBadge(st[0], st[1]) + '</div>' +
      '<div class="kpis" style="grid-template-columns:repeat(5,1fr)">' + [['Budget', c.budgetJour ? eur(c.budgetJour) + '/j' : 'En pause'], ['Dépensé', eur(c.depense)], ['Leads', c.formulaires], ['Coût par lead', eur(c.depense / c.formulaires)], ['Qualifiés · ventes', q + ' · ' + won.length]].map(function (x) { return '<div class="kpi" style="box-shadow:none;background:var(--surface-2)"><span class="lab">' + x[0] + '</span><div class="val num" style="font-size:21px">' + x[1] + '</div></div>'; }).join('') + '</div>' +
      '<p class="k" style="margin:16px 0 6px">Publicités les plus efficaces</p>' + c.creas.map(function (cr) { return '<div class="set-row"><div><h4>' + esc(cr.nom) + '</h4><p>' + cr.leads + (cr.leads > 1 ? ' leads' : ' lead') + '</p></div><b class="num">' + eur(cr.cpl) + ' par lead</b></div>'; }).join('') +
      '<p class="k" style="margin:16px 0 6px">Ce qu’Orixen a changé, et pourquoi</p><ul class="tl">' + c.changements.map(function (ch) { return '<li><span class="ic">' + ic('flag', 12) + '</span><div><b>' + esc(ch.txt) + '</b><span>' + dt(ch.at) + ' · ' + esc(ch.par) + '</span><p class="small" style="color:var(--text-2);margin-top:2px">' + esc(ch.pourquoi) + '</p></div></li>'; }).join('') + '</ul>' +
      '<div class="reco"><span class="k">Prochaine action recommandée</span><h4>' + esc(c.reco.txt) + '</h4><p>' + esc(c.reco.pourquoi) + '</p><div class="tags">' + stBadge('info', 'Confiance ' + c.reco.confiance.toLowerCase()) + stBadge('neutral', 'Données manquantes : ' + c.reco.manque.toLowerCase()) + stBadge(c.reco.etat === 'Réalisée' ? 'ok' : c.reco.etat === 'À valider par vous' ? 'warn' : 'neutral', c.reco.etat) + '</div>' + (c.reco.etat === 'À valider par vous' ? '<div style="margin-top:12px;display:flex;gap:8px"><button class="btn sm acc" data-validate="' + c.id + '">Valider</button><button class="btn sm" data-later>En parler à Marcus</button></div>' : '') + '</div></div>';
  }
  function vReports() {
    var tabs = [['jour', 'Point du jour'], ['hebdo', 'Bilan de la semaine'], ['mois', 'Bilan du mois']];
    var M = metrics();
    var Q = {
      jour: [['Nouveaux leads', '3 aujourd’hui : Nathalie Roux, Patrick Faure, Élodie Chabrier.'], ['Rendez-vous', '1 rendez-vous à confirmer pour demain.'], ['Action importante', 'Rappeler les 3 nouveaux leads avant 19h.']],
      hebdo: [['Quel était l’objectif ?', 'Atteindre 15 leads qualifiés avant le 23 novembre, garder le coût par lead qualifié sous 60 €.'], ['Quels sont les résultats réels ?', '6 leads reçus, 4 qualifiés, 2 rendez-vous, 1 vente signée (4 100 €).'], ['Qu’est-ce qui a changé ?', 'Coût par lead qualifié en baisse de 54 € à ' + eur(M.cplq) + ', grâce à la vidéo de Julien.'], ['Quels résultats commerciaux sont confirmés ?', 'Ventes déclarées : 3 sur la période. 1 devis de 22 400 € en attente de réponse.'], ['Qu’avons-nous appris ?', 'Les vidéos tournées sur chantier font 3 fois mieux que les photos. Les leads d’isolation sortent souvent du budget.'], ['Prochaines actions', 'Marcus : nouvelle vidéo en ligne d’ici jeudi. Julien : renseigner le résultat du rendez-vous de Sandrine Aubert avant vendredi.']],
      mois: [['Quel était l’objectif ?', 'Lancer la zone d’Issoire et atteindre la garantie de 15 leads qualifiés.'], ['Quels sont les résultats réels ?', M.n + ' leads, ' + M.q + ' qualifiés, ' + M.won + ' ventes pour ' + eur(M.ca) + '.'], ['Qu’est-ce qui a changé ?', 'Première période complète : pas de comparaison fiable.'], ['Quels résultats commerciaux sont confirmés ?', eur(M.ca) + ' signés et déclarés. Valeur des devis en cours : ' + eur(54700) + ' (non signée).'], ['Qu’avons-nous appris ?', 'La réfection complète est le meilleur segment. L’urgence réparation est prometteuse mais encore jeune.'], ['Prochaines actions', 'Novembre : deuxième vidéo, test d’une page dédiée aux réparations, isolation en pause jusqu’en février.']]
    };
    return '<div class="seg" style="margin-bottom:14px">' + tabs.map(function (t) { return '<button data-rt="' + t[0] + '" class="' + (S.repTab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div class="card-h"><div><h3>' + tabs.find(function (t) { return t[0] === S.repTab; })[1] + '</h3><p class="small muted">Préparé par Marcus · ' + dt(NOW.toISOString()) + '</p></div><div class="no-print" style="display:flex;gap:8px"><button class="btn sm" id="pdf">' + ic('dl', 14) + 'PDF</button><button class="btn sm" id="share">Partager</button></div></div>' +
      Q[S.repTab].map(function (q, i) { return '<div class="rq"><span class="n">' + (i + 1) + '</span><div><h4>' + q[0] + '</h4><p>' + esc(q[1]) + '</p></div></div>'; }).join('') + '</div>';
  }
  function bindPerf() {
    $$('[data-pt]').forEach(function (b) { b.onclick = function () { S.perfTab = b.dataset.pt; render(); }; });
    $$('[data-rt]').forEach(function (b) { b.onclick = function () { S.repTab = b.dataset.rt; render(); }; });
    var p = $('#pdf'); if (p) p.onclick = function () { window.print(); };
    var sh = $('#share'); if (sh) sh.onclick = function () { toast('Lien de lecture créé pour Sophie Martin (associée)'); };
    $$('[data-validate]').forEach(function (b) { b.onclick = function () { b.textContent = 'Validé'; b.classList.add('done'); toast('Décision transmise à Marcus · ' + stamp()); }; });
    $$('[data-later]').forEach(function (b) { b.onclick = function () { location.hash = '#/equipe'; }; });
  }

  /* ─── RENDEZ-VOUS ─── */
  function vRdv() {
    var R = D.leads.filter(function (l) { return l.rdv; });
    var up = R.filter(function (l) { return new Date(l.rdv.at) > NOW; }).sort(function (a, b) { return new Date(a.rdv.at) - new Date(b.rdv.at); });
    var past = R.filter(function (l) { return new Date(l.rdv.at) <= NOW; }).sort(function (a, b) { return new Date(b.rdv.at) - new Date(a.rdv.at); });
    var list = S.rdvTab === 'avenir' ? up : past;
    var conf = up.filter(function (l) { return l.rdv.statut === 'À confirmer'; }).length;
    return '<section class="hello"><h2>Rendez-vous</h2><p>' + up.length + ' à venir' + (conf ? ', dont ' + conf + ' à confirmer' : '') + ' · ' + past.length + ' réalisés · 0 absence ce mois-ci.</p></section>' +
      '<div class="tools"><div class="seg"><button data-rv="avenir" class="' + (S.rdvTab === 'avenir' ? 'on' : '') + '">À venir</button><button data-rv="passes" class="' + (S.rdvTab === 'passes' ? 'on' : '') + '">Réalisés</button></div><span style="flex:1"></span><a class="btn sm" href="#/parametres">' + ic('cal', 14) + 'Synchroniser mon calendrier</a></div>' +
      '<div class="ag">' + (list.length ? list.map(function (l) {
        var d = new Date(l.rdv.at), k = l.rdv.statut === 'Confirmé' || l.rdv.statut === 'Honoré' ? 'ok' : 'warn';
        return '<div class="agi"><div class="d"><span>' + d.toLocaleDateString('fr-FR', { weekday: 'short' }) + '</span><b>' + d.getDate() + '</b><span>' + hhmm(l.rdv.at) + '</span></div><div><h4>' + esc(l.nom) + '</h4><p>' + esc(l.travaux) + ' · ' + esc(l.ville) + ' · ' + esc(user(l.resp).nom) + '</p></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end">' + stBadge(k, l.rdv.statut) +
          (l.rdv.statut === 'À confirmer' ? '<button class="btn sm acc" data-confirm="' + l.id + '">Confirmer</button>' : '') + (S.rdvTab === 'passes' ? '<a class="btn sm" href="#/opportunites/' + l.id + '?resultat">Résultat</a>' : '<a class="btn sm" href="#/opportunites/' + l.id + '">Fiche</a>') + '</div></div>';
      }).join('') : '<div class="card empty">Aucun rendez-vous.</div>') + '</div>' +
      '<div class="card sec"><div class="card-h"><h3>Rappels automatiques</h3><span class="meta">Avec le consentement du prospect</span></div><div class="set-list">' +
        [['Confirmation', 'SMS au prospect dès la prise de rendez-vous'], ['Rappel la veille', 'SMS la veille à 18h'], ['Nouveau créneau', 'Proposé automatiquement en cas d’annulation'], ['Relance de devis', 'Vous recevez un rappel 3 jours puis 7 jours après l’envoi']].map(function (x) { return '<div class="set-row"><div><h4>' + x[0] + '</h4><p>' + x[1] + '</p></div>' + stBadge('ok', 'Actif') + '</div>'; }).join('') + '</div></div>';
  }
  function bindRdv() {
    $$('[data-rv]').forEach(function (b) { b.onclick = function () { S.rdvTab = b.dataset.rv; render(); }; });
    $$('[data-confirm]').forEach(function (b) { b.onclick = function () { var l = lead(b.dataset.confirm); l.rdv.statut = 'Confirmé'; addEvent(l, 'rdv', 'Rendez-vous confirmé'); S.done.push('conf-' + l.id); store.set('cc-done', S.done); toast('Rendez-vous confirmé · SMS envoyé au prospect'); render(); }; });
  }

  /* ─── SYSTÈME ─── */
  function vSys() {
    var p = pulse();
    return '<section class="hello"><h2>Système</h2><p>Votre machine d’acquisition, composant par composant. Chaque statut vient d’un test réel, refait toutes les 15 minutes.</p></section>' +
      '<div class="card"><div class="pulse"><div class="ring ' + (p.ok ? 'ok' : 'warn') + '">' + ic(p.ok ? 'check' : 'warn', 22) + '</div><div><h3>' + (p.ok ? 'Tout fonctionne normalement' : 'Tout fonctionne · 1 point surveillé') + '</h3><p>Dernier test complet ' + ago(p.last) + ' : formulaire rempli, lead reçu dans le CRM, SMS envoyés, attribution faite.</p></div></div></div>' +
      '<div class="card sec" style="padding:6px 18px">' + D.systeme.map(function (c) {
        var inc = c.incident, k = c.statut === 'ok' ? ['ok', 'Opérationnel'] : c.statut === 'warn' ? ['warn', 'Surveillé'] : ['crit', 'En panne'];
        var incH = '';
        if (inc && !inc.resolu) incH = '<div class="inc"><b style="color:var(--text)">' + esc(inc.txt) + '</b> · ouvert ' + ago(inc.at) + ' · responsable ' + esc(inc.par) + '<dl><dt>Confirmé</dt><dd>' + esc(inc.confirme) + '</dd><dt>En cours d’analyse</dt><dd>' + esc(inc.enquete) + '</dd><dt>Prochaine étape</dt><dd>' + esc(inc.etape) + '</dd><dt>Impact possible</dt><dd>Vos SMS peuvent arriver avec 2 à 3 minutes de retard. Aucun lead perdu.</dd></dl></div>';
        else if (inc) incH = '<div class="inc">Dernier incident : ' + esc(inc.txt) + ' · ' + dt(inc.at) + ' · résolu ' + dt(inc.resolu) + ' par ' + esc(inc.par) + '.</div>';
        return '<div class="comp"><div><h4>' + esc(c.nom) + '</h4><p>' + esc(c.desc) + ' · vérifié ' + ago(c.verif) + '</p></div>' + stBadge(k[0], k[1]) + incH + '</div>';
      }).join('') + '</div>';
  }

  /* ─── ÉQUIPE ─── */
  function vTeam() {
    var st = { 'Reçue': 'info', 'En cours': 'warn', 'Résolue': 'ok' };
    return '<section class="hello"><h2>Équipe Orixen</h2><p>Vos échanges, vos demandes et les décisions prises, au même endroit. Vous n’avez jamais à répéter le contexte.</p></section>' +
      '<div class="grid g-main"><div class="card"><div class="card-h"><h3>Vos demandes</h3><button class="btn sm acc" id="new-req">Nouvelle demande</button></div><div id="req-form" style="display:none;margin-bottom:12px" class="form"><div class="field"><label for="rq-cat">Catégorie</label><select id="rq-cat"><option>Campagnes publicitaires</option><option>Qualité des prospects</option><option>CRM</option><option>Automatisations</option><option>Facturation</option><option>Stratégie</option><option>Incident technique</option></select></div><div class="field"><label for="rq-t">Votre demande</label><textarea id="rq-t" placeholder="Décrivez ce dont vous avez besoin"></textarea></div><button class="btn pri" id="rq-send">Envoyer</button></div>' +
        '<div class="tbl-wrap" style="box-shadow:none"><table class="tbl"><thead><tr><th>Demande</th><th class="hide-m">Catégorie</th><th>Statut</th><th class="hide-m">Mise à jour</th></tr></thead><tbody id="req-b">' + D.demandes.slice().reverse().map(function (d) { return '<tr><td><b>' + esc(d.titre) + '</b><div class="small muted">' + d.id + ' · ' + esc(d.hist[d.hist.length - 1]) + '</div></td><td class="hide-m">' + esc(d.cat) + '</td><td>' + stBadge(st[d.statut], d.statut) + '</td><td class="hide-m">' + ago(d.maj) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div><div class="card"><div class="am" style="box-shadow:none;padding:0;background:none"><span class="av" style="width:44px;height:44px;font-size:15px">MV</span><div><b style="font-size:16px">' + D.contact.nom + '</b><span>' + D.contact.role + '</span></div></div><p class="small" style="margin:12px 0;color:var(--text-2)">' + D.contact.delai + '. Votre contrat prévoit une réponse le jour même.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn sm acc" href="https://wa.me/' + D.contact.tel.replace('+', '') + '">WhatsApp</a><a class="btn sm" href="tel:' + D.contact.tel + '">Appeler</a><a class="btn sm" href="mailto:' + D.contact.email + '">E-mail</a></div></div>' +
      '<div class="card"><div class="card-h"><h3>Décisions prises</h3></div><ul class="tl">' + D.decisions.map(function (d) { return '<li><span class="ic">' + ic('flag', 12) + '</span><div><b>' + esc(d.txt) + '</b><span>' + dt(d.at, { day: 'numeric', month: 'long' }) + ' · ' + esc(d.par) + '</span></div></li>'; }).join('') + '</ul></div>' +
      '<div class="card"><div class="card-h"><h3>Prochain point</h3></div><p style="font-size:15px;font-weight:600">' + dday(new Date(NOW.getTime() + 6 * 864e5).toISOString()) + ' à 18h30</p><p class="small muted">Point hebdomadaire de 10 minutes · compte rendu publié ici ensuite.</p></div></div></div>';
  }
  function bindTeam() {
    var b = $('#new-req'); if (!b) return;
    b.onclick = function () { var f = $('#req-form'); f.style.display = f.style.display === 'none' ? '' : 'none'; $('#rq-t').focus(); };
    $('#rq-send').onclick = function () {
      var t = $('#rq-t').value.trim(); if (!t) { toast('Écrivez votre demande'); return; }
      D.demandes.push({ id: 'D-' + (124 + D.demandes.length), cat: $('#rq-cat').value, titre: t.slice(0, 70), statut: 'Reçue', prio: 'Normale', resp: 'Marcus', ouvert: new Date().toISOString(), maj: new Date().toISOString(), hist: ['Reçue · Marcus est prévenu'] });
      toast('Demande reçue · réponse le jour même'); render();
    };
  }

  /* ─── PARAMÈTRES ─── */
  function vSet() {
    var tabs = [['entreprise', 'Entreprise'], ['equipe', 'Utilisateurs et droits'], ['notif', 'Notifications'], ['integr', 'Intégrations'], ['factu', 'Contrat et facturation'], ['donnees', 'Données et sécurité']];
    var h = '<section class="hello"><h2>Paramètres</h2></section><div class="tabs">' + tabs.map(function (t) { return '<button data-st="' + t[0] + '" class="' + (S.setTab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var row = function (a, b, c) { return '<div class="set-row"><div><h4>' + a + '</h4><p>' + b + '</p></div>' + (c || '') + '</div>'; };
    var sw = function (on, lab) { return '<button class="sw" role="switch" aria-checked="' + on + '" aria-label="' + esc(lab) + '"></button>'; };
    if (S.setTab === 'entreprise') h += '<div class="card"><div class="set-list">' + row('Entreprise', D.entreprise + ' · ' + D.metier, '<button class="btn sm">Modifier</button>') + row('Zone exclusive', D.zone.join(', '), '<button class="btn sm">Voir</button>') + row('Panier moyen indicatif', '18 000 € pour une réfection complète', '<button class="btn sm">Modifier</button>') + row('Taux de marge moyen', 'Non renseigné · nécessaire pour calculer la rentabilité réelle', '<button class="btn sm acc">Renseigner</button>') + row('Capacité commerciale', '6 rendez-vous par semaine', '<button class="btn sm">Modifier</button>') + '</div></div>';
    if (S.setTab === 'equipe') h += '<div class="card"><div class="card-h"><h3>Utilisateurs</h3><button class="btn sm acc">Inviter</button></div><div class="set-list">' + D.users.map(function (u) { return row(u.nom, u.role + ' · ' + u.email, stBadge('ok', 'Actif')); }).join('') + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Qui peut faire quoi</h3></div><div class="tbl-wrap" style="box-shadow:none"><table class="tbl perm"><thead><tr><th>Droit</th><th>Dirigeant</th><th>Commercial</th><th>Associé</th></tr></thead><tbody>' +
        [['Voir ses prospects', 1, 1, 1], ['Voir tous les prospects', 1, 0, 1], ['Modifier les statuts', 1, 1, 0], ['Voir les coordonnées', 1, 1, 0], ['Voir les dépenses et rapports', 1, 0, 1], ['Gérer la facturation', 1, 0, 0], ['Gérer les connexions publicitaires', 1, 0, 0]].map(function (r) { return '<tr><td>' + r[0] + '</td>' + r.slice(1).map(function (v) { return '<td>' + (v ? '<span class="yes">' + ic('check', 15) + '<span class="sr">Oui</span></span>' : '<span class="no">·<span class="sr">Non</span></span>') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>';
    if (S.setTab === 'notif') h += '<div class="card"><div class="card-h"><h3>Urgentes</h3><span class="meta">SMS et notification</span></div><div class="set-list">' + row('Nouveau lead qualifié', 'Dans la minute', sw(true, 'Nouveau lead qualifié')) + row('Lead sans suivi depuis 24 h', 'Une fois par lead', sw(true, 'Lead sans suivi')) + row('Erreur de transmission', 'Dès la détection', sw(true, 'Erreur de transmission')) + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>Informatives</h3><span class="meta">E-mail</span></div><div class="set-list">' + row('Rendez-vous confirmé', 'Quand un prospect confirme', sw(true, 'Rendez-vous confirmé')) + row('Rapport disponible', 'Chaque dimanche', sw(true, 'Rapport disponible')) + row('Facture disponible', 'Chaque mois', sw(false, 'Facture disponible')) + row('Décision attendue', 'Quand Orixen a besoin de votre accord', sw(true, 'Décision attendue')) + '</div></div>' +
      '<div class="card"><div class="set-list">' + row('Heures calmes', 'Aucune notification non urgente de 21h à 7h', sw(true, 'Heures calmes')) + row('Écran verrouillé', 'Masquer le nom et le téléphone du prospect', sw(true, 'Masquer sur écran verrouillé')) + '</div></div>';
    if (S.setTab === 'integr') h += '<div class="card"><div class="set-list">' + [['Meta (Facebook et Instagram)', 'Accès partenaire à votre page et à votre compte publicitaire'], ['CRM Orixen', 'Vos prospects, statuts et historique'], ['Messagerie SMS', 'Notifications et rappels'], ['Google Agenda', 'Synchronisation de vos rendez-vous']].map(function (x, i) { return row(x[0], x[1], i === 3 ? '<button class="btn sm acc">Connecter</button>' : stBadge('ok', 'Connecté')); }).join('') + '</div></div>';
    if (S.setTab === 'factu') h += '<div class="card"><div class="set-list">' + row('Formule', 'Partenaire fondateur · 2 500 € par mois · sans engagement', '<a class="btn sm" href="/conditions/" target="_blank">Conditions</a>') + row('Contrat', 'Signé le ' + dt(D.garantie.debut, { day: 'numeric', month: 'long', year: 'numeric' }), '<button class="btn sm">Télécharger</button>') + row('Prochain prélèvement', 'Suspendu tant que la garantie n’est pas atteinte', stBadge('info', 'Garantie en cours')) + row('Factures', '1 facture · octobre 2026', '<button class="btn sm">Voir</button>') + row('Budget publicitaire', 'Payé directement à Meta, avec votre carte', '') + '</div></div>';
    if (S.setTab === 'donnees') h += '<div class="card"><div class="set-list">' + row('Exporter mes données', 'Prospects, statuts et historique, en CSV', '<button class="btn sm">Exporter</button>') + row('Demande de rectification ou de suppression', 'Pour un prospect qui exerce ses droits RGPD', '<button class="btn sm">Ouvrir</button>') + row('Traitement des données', 'Vous êtes responsable de traitement, Orixen est sous-traitant (article 28 du RGPD)', '<a class="btn sm" href="/confidentialite/" target="_blank">Lire</a>') + row('Historique des actions sensibles', 'Exports, changements de droits, connexions', '<button class="btn sm">Voir</button>') + row('Double authentification', 'Code par SMS à chaque nouvel appareil', sw(true, 'Double authentification')) + row('Sessions actives', 'iPhone de Julien · ordinateur du bureau', '<button class="btn sm">Tout déconnecter</button>') + '</div></div>';
    return h;
  }
  function bindSet() {
    $$('[data-st]').forEach(function (b) { b.onclick = function () { S.setTab = b.dataset.st; render(); }; });
    $$('.sw').forEach(function (s) { s.onclick = function () { var on = s.getAttribute('aria-checked') !== 'true'; s.setAttribute('aria-checked', on); toast((on ? 'Activé' : 'Désactivé') + ' · ' + stamp()); }; });
  }

  /* ─── ONBOARDING ─── */
  function vOnb() {
    var steps = ['Votre entreprise', 'Votre acquisition', 'Votre équipe', 'Test du système', 'Validation'];
    var s = S.ob.step, d = S.ob.data;
    var fld = function (k, lab, ph) { return '<div class="field"><label for="ob-' + k + '">' + lab + '</label><input id="ob-' + k + '" data-ob="' + k + '" value="' + esc(d[k] || '') + '" placeholder="' + esc(ph || '') + '"></div>'; };
    var body = [
      fld('activites', 'Vos activités', 'Réfection, réparation, zinguerie') + fld('zones', 'Communes desservies', 'Issoire, Perrier, Le Broc') + fld('panier', 'Panier moyen indicatif', '18 000 €') + fld('capacite', 'Rendez-vous possibles par semaine', '6') + fld('objectif', 'Votre objectif', 'Remplir le planning de janvier'),
      ['Accès Facebook et compte publicitaire', 'Formulaire de demande', 'Calendrier', 'CRM Orixen'].map(function (x, i) { return '<div class="check-row">' + stBadge(i < 2 ? 'ok' : 'neutral', i < 2 ? 'Fait' : 'À faire') + x + '</div>'; }).join(''),
      fld('resp', 'Qui reçoit les nouveaux leads ?', 'Julien Martin') + fld('tel', 'Téléphone des demandes', '06 00 00 00 00') + fld('rappel', 'Délai de rappel visé', 'Moins d’une heure'),
      ['Formulaire rempli', 'Lead reçu dans le CRM', 'SMS reçu par Julien', 'SMS reçu par le prospect', 'Lead attribué à Julien'].map(function (x) { return '<div class="check-row">' + stBadge('ok', 'Testé') + x + '</div>'; }).join('') + '<p class="small muted" style="margin-top:10px">Test de bout en bout réalisé le ' + dt(NOW.toISOString()) + ' · 38 secondes du formulaire au SMS.</p>',
      '<div class="rq"><span class="n">1</span><div><h4>Configuré</h4><p>Entreprise, zone, formulaire, CRM, notifications.</p></div></div><div class="rq"><span class="n">2</span><div><h4>Testé</h4><p>Le circuit complet, en 38 secondes.</p></div></div><div class="rq"><span class="n">3</span><div><h4>Manquant</h4><p>Calendrier (Julien, d’ici jeudi). Non bloquant.</p></div></div><div class="rq"><span class="n">4</span><div><h4>Prochaine étape</h4><p>Marcus envoie les publicités pour validation demain. Mise en ligne seulement après votre accord.</p></div></div>'
    ][s];
    return '<section class="hello"><h2>Bienvenue chez Orixen, Julien.</h2><p>Cinq étapes pour lancer votre système. Vous pouvez vous arrêter à tout moment : tout est enregistré.</p></section>' +
      '<div class="card" style="max-width:720px"><div class="steps">' + steps.map(function (x, i) { return '<div class="' + (i <= s ? 'on' : '') + '" title="' + x + '"></div>'; }).join('') + '</div><span class="k">Étape ' + (s + 1) + ' sur 5</span><h3 style="font-size:22px;font-weight:700;letter-spacing:-.025em;margin:4px 0 16px">' + steps[s] + '</h3><div class="form">' + body + '</div>' +
      '<div class="ob-nav"><button class="btn" id="ob-prev"' + (s ? '' : ' disabled') + '>Retour</button><button class="btn pri" id="ob-next">' + (s === 4 ? 'Valider et lancer' : 'Continuer') + '</button></div></div>';
  }
  function bindOnb() {
    $$('[data-ob]').forEach(function (i) { i.oninput = function () { S.ob.data[i.dataset.ob] = i.value; store.set('cc-ob', S.ob); }; });
    var p = $('#ob-prev'), n = $('#ob-next');
    if (p) p.onclick = function () { S.ob.step = Math.max(0, S.ob.step - 1); store.set('cc-ob', S.ob); render(); };
    if (n) n.onclick = function () { if (S.ob.step === 4) { toast('Validé · Marcus est prévenu'); location.hash = '#/'; return; } S.ob.step++; store.set('cc-ob', S.ob); render(); };
  }

  /* ─── INTELLIGENCE ─── */
  var AQ = [
    { q: 'Quels prospects dois-je rappeler ?', k: /rappel|appeler|prospect/, a: function () {
      var c = D.leads.filter(function (l) { return l.etape === 'nouveau' || l.etape === 'contacte'; }).sort(function (a, b) { return new Date(a.recu) - new Date(b.recu); });
      return { t: c.length + ' prospects à rappeler, du plus ancien au plus récent', f: c.map(function (l) { return l.nom + ' · ' + l.travaux + ' à ' + l.ville + ' · reçu ' + ago(l.recu) + ' · ' + stage(l.etape).nom.toLowerCase(); }), h: ['Les prospects contactés il y a plus de 24 h sans qualification risquent de signer ailleurs.'], r: ['Commencer par Véronique Lac et Claire Vidal, qui attendent depuis le plus longtemps.', 'Renseigner le résultat de chaque appel : il améliore le ciblage des campagnes.'], src: 'Fiches prospects, étapes « Nouveaux leads » et « Contactés »', conf: 'Élevée' };
    } },
    { q: 'Pourquoi avons-nous reçu moins de leads qualifiés cette semaine ?', k: /pourquoi|moins|baisse/, a: function () {
      return { t: 'Moins de leads qualifiés cette semaine : ce que l’on sait', f: ['Cette semaine : 4 leads qualifiés, contre 5 la semaine précédente.', 'La campagne Isolation est en pause depuis le 14 octobre (décision prise avec vous).', 'La publicité « Âge du toit » a été mise en pause le 22 octobre.'], h: ['La pause de l’isolation explique sans doute une partie de l’écart : elle apportait environ 1 lead qualifié par semaine.', 'L’écart de 1 lead est trop faible pour conclure à une vraie baisse.'], r: ['Ne rien changer cette semaine.', 'Valider la deuxième vidéo de Julien, qui a le meilleur coût par lead qualifié.'], src: 'Campagnes, journal des changements, leads du 19 au 25 octobre', conf: 'Moyenne' };
    } },
    { q: 'Combien la publicité m’a-t-elle rapporté ce mois-ci ?', k: /rapport|gagn|rentab|argent|chiffre/, a: function () {
      var M = metrics();
      return { t: eur(M.ca) + ' de ventes signées attribuées, pour ' + eur(M.spend) + ' de publicité', f: [M.won + ' ventes déclarées comme signées, issues d’un lead Orixen.', 'Dépenses publicitaires sur la période : ' + eur(M.spend) + ', plus 2 500 € d’honoraires.'], h: ['Une partie de ces clients vous aurait peut-être trouvé sans publicité : ce chiffre n’est pas forcément incrémental.'], r: ['Renseigner votre taux de marge dans Paramètres pour connaître la rentabilité réelle, et pas seulement le chiffre d’affaires.'], src: 'Ventes déclarées, dépenses Meta, contrat', conf: 'Élevée sur les montants, faible sur l’incrémentalité' };
    } }
  ];
  function openAI() { $('#ai').classList.add('on'); setTimeout(function () { $('#ai-q').focus(); }, 50); }
  function closeAI() { $('#ai').classList.remove('on'); }
  function aiHome() { $('#ai-b').innerHTML = '<p class="k" style="margin-bottom:8px">Questions fréquentes</p><div class="sugg">' + AQ.map(function (x, i) { return '<button data-aq="' + i + '">' + x.q + '</button>'; }).join('') + '</div><p class="small muted" style="margin-top:14px">Orixen Intelligence répond uniquement à partir des données de votre compte, et distingue toujours les faits, les hypothèses et les recommandations.</p>'; $$('[data-aq]').forEach(function (b) { b.onclick = function () { answer(AQ[+b.dataset.aq]); }; }); }
  function answer(x) {
    var A = x.a(), li = function (a) { return '<ul>' + a.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; };
    $('#ai-q').value = x.q;
    $('#ai-b').innerHTML = '<div class="ans"><h3>' + esc(A.t) + '</h3><h5>' + ic('check', 13) + 'FAITS</h5>' + li(A.f) + '<h5>' + ic('info', 13) + 'HYPOTHÈSES</h5>' + li(A.h) + '<h5>' + ic('flag', 13) + 'RECOMMANDATIONS</h5>' + li(A.r) + '<p class="src">Sources : ' + esc(A.src) + ' · confiance ' + esc(A.conf.toLowerCase()) + '</p><div style="display:flex;gap:8px;margin-top:14px"><button class="btn sm" id="ai-back">Autre question</button></div></div>';
    $('#ai-back').onclick = aiHome;
  }
  $('#ai-q').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return; var v = this.value.toLowerCase(); var m = AQ.find(function (x) { return x.k.test(v); });
    if (m) answer(m); else $('#ai-b').innerHTML = '<div class="ans"><h3>Je n’ai pas encore de réponse fiable à cette question.</h3><ul><li>Dans cette démonstration, je ne connais que trois questions. Dans la version connectée, je chercherai dans vos données et je citerai mes sources.</li></ul><div style="display:flex;gap:8px;margin-top:14px"><a class="btn sm acc" href="#/equipe" id="ai-fw">Poser la question à Marcus</a><button class="btn sm" id="ai-back">Autre question</button></div></div>', $('#ai-back').onclick = aiHome, $('#ai-fw').onclick = closeAI;
  });
  $('#ask').onclick = function () { openAI(); aiHome(); };
  $('#ai-x').onclick = closeAI;
  $('#ai').onclick = function (e) { if (e.target === this) closeAI(); };
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openAI(); aiHome(); }
    if (e.key === 'Escape') { closeAI(); closeLead(); openSheet(false); }
  });

  /* thème */
  function setThemeIcon() { var t = document.documentElement.getAttribute('data-theme'); $('#theme').innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 16); $('#theme').setAttribute('aria-label', t === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'); }
  $('#theme').onclick = function () { var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('cc-theme', t); } catch (e) {} setThemeIcon(); };
  setThemeIcon();
  $('#period').onchange = function () { S.period = this.value; render(); };
  $('#scrim').onclick = function () { closeLead(); openSheet(false); };
  $('#s-ent').textContent = D.entreprise; $('#s-met').textContent = D.metier;

  /* routeur */
  var cur = '';
  var TITLES = { '': 'Vue d’ensemble', opportunites: 'Opportunités', performance: 'Performance', 'rendez-vous': 'Rendez-vous', systeme: 'Système', equipe: 'Équipe Orixen', parametres: 'Paramètres', historique: 'Historique', bienvenue: 'Bienvenue' };
  function render() {
    var hash = location.hash.replace(/^#\/?/, ''), parts = hash.split('?')[0].split('/'), mode = hash.split('?')[1];
    var route = parts[0] || '', sub = parts[1];
    if (!(route in TITLES)) route = '';
    var changed = route !== cur; cur = route;
    var views = { '': vOverview, opportunites: vOpp, performance: vPerf, 'rendez-vous': vRdv, systeme: vSys, equipe: vTeam, parametres: vSet, historique: vHistory, bienvenue: vOnb };
    var page = $('#page');
    page.innerHTML = '<div class="' + (changed ? 'page-in' : '') + '">' + views[route]() + '</div>';
    $('#title').textContent = TITLES[route];
    document.title = TITLES[route] + ' · Orixen Command Center';
    renderNav(route); openSheet(false);
    bindTasks(page); bindChart('ch1'); bindOpp(); bindPerf(); bindRdv(); bindTeam(); bindSet(); bindOnb();
    $$('[data-def]').forEach(function (b) { b.onclick = function () { showDef(b.dataset.def); }; });
    $$('[data-undo]').forEach(function (b) { b.onclick = function () { S.done = S.done.filter(function (x) { return x !== b.dataset.undo; }); store.set('cc-done', S.done); render(); }; });
    $$('[data-act="call"]').forEach(function (a) { a.addEventListener('click', function () { toast('Appel lancé · pensez à noter le résultat'); }); });
    $$('[data-act="confirm"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var id = a.closest('.task').dataset.t.replace('conf-', ''); var l = lead(id); l.rdv.statut = 'Confirmé'; S.done.push('conf-' + id); store.set('cc-done', S.done); toast('Rendez-vous confirmé · SMS envoyé au prospect'); render(); }); });
    if (route === 'opportunites' && sub) openLead(sub, mode); else if ($('#drawer').classList.contains('on')) { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); }
    if (changed && !sub) { window.scrollTo(0, 0); }
  }
  window.addEventListener('hashchange', render);
  render();
})();
