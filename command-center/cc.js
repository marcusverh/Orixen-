/* Orixen Command Center · prototype · « Precision, not noise » */
(function () {
  'use strict';
  var D = window.CC_DATA, NOW = D.NOW;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var nb = function (s) { return String(s).replace(/[ \s]/g, ' '); };
  var eur = function (n) { return nb(Math.round(n).toLocaleString('fr-FR')) + ' €'; };
  var nf = function (n) { return nb(Math.round(n).toLocaleString('fr-FR')); };
  var pct = function (a, b) { return b ? Math.round(a / b * 100) + ' %' : '·'; };
  var store = { get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var user = function (id) { return D.users.find(function (u) { return u.id === id; }) || { nom: 'Non attribué' }; };
  var stage = function (id) { return D.stages.find(function (s) { return s.id === id; }); };
  var lead = function (id) { return D.leads.find(function (l) { return l.id === id; }); };
  var hrs = function (iso) { return (NOW - new Date(iso)) / 36e5; };
  var ago = function (iso) {
    var m = Math.round((NOW - new Date(iso)) / 6e4);
    if (m < 1) return 'à l’instant'; if (m < 60) return 'il y a ' + m + ' min';
    var h = Math.round(m / 60); if (h < 24) return 'il y a ' + h + ' h';
    var d = Math.round(h / 24); return 'il y a ' + d + ' j';
  };
  var dt = function (iso) { return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(':', 'h').replace(' à ', ', '); };
  var dd = function (iso, o) { return new Date(iso).toLocaleDateString('fr-FR', o || { day: 'numeric', month: 'short' }); };
  var day = function (iso) { var s = new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); return s.charAt(0).toUpperCase() + s.slice(1); };
  var hm = function (iso) { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h'); };
  var nowHM = function () { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h'); };
  var MAJ = 'à jour au ' + dd(NOW.toISOString(), { day: 'numeric', month: 'long' }) + ' à ' + hm(NOW.toISOString());

  /* ── Icônes : une seule famille, trait 1,75 ── */
  var P = {
    home: '<path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z"/>',
    opp: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    perf: '<path d="M4 20V11M10 20V5M16 20v-6M3 20h18"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    sys: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    team: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    phone: '<path d="M21 16.5v3a1.5 1.5 0 0 1-1.6 1.5A18 18 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3h3a1.5 1.5 0 0 1 1.5 1.3c.1.9.4 1.8.7 2.6a1.5 1.5 0 0 1-.4 1.6L8 9.8a14 14 0 0 0 6.2 6.2l1.3-1.3a1.5 1.5 0 0 1 1.6-.4c.8.3 1.7.6 2.6.7a1.5 1.5 0 0 1 1.3 1.5z"/>',
    msg: '<path d="M20 4H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4l4 3 4-3h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    ok: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.3 2.7 2.7L16 9.7"/>',
    warn: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.3v.2"/>',
    err: '<circle cx="12" cy="12" r="8.5"/><path d="m9 9 6 6M15 9l-6 6"/>',
    act: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12h7M12.5 9l3 3-3 3"/>',
    est: '<circle cx="12" cy="12" r="8.5"/><path d="M8 10.5c1.3-1.3 2.7-1.3 4 0s2.7 1.3 4 0M8 14c1.3-1.3 2.7-1.3 4 0s2.7 1.3 4 0"/>',
    inc: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
    unk: '<circle cx="12" cy="12" r="8.5"/><path d="M9.8 9.5a2.3 2.3 0 1 1 3.3 2.1c-.7.4-1.1.9-1.1 1.6M12 16.5v.2"/>',
    chk: '<path d="M20 11a8 8 0 1 0-2.3 5.6M20 4.5V11h-6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15.5 6 9M10 20.5a2 2 0 0 0 4 0"/>',
    dl: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
    sort: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
    up: '<path d="M8 14l4-4 4 4"/>',
    down: '<path d="M8 10l4 4 4-4"/>',
    left: '<path d="M14.5 6 8.5 12l6 6"/>',
    right: '<path d="m9.5 6 6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    form: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
    q: '<circle cx="12" cy="12" r="8.5"/><path d="M9.8 9.5a2.3 2.3 0 1 1 3.3 2.1c-.7.4-1.1.9-1.1 1.6M12 16.5v.2"/>'
  };
  var ic = function (n, s) { return '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; };

  /* ── Langage des états ── */
  var ST = {
    ok: ['ok', 'ok'], confirmed: ['ok', 'ok'], warn: ['warn', 'warn'], err: ['err', 'err'],
    act: ['act', 'act'], est: ['est', 'est'], inc: ['warn', 'inc'], unk: ['unk', 'unk'], chk: ['chk', 'chk']
  };
  var state = function (k, label) { var s = ST[k] || ST.unk; return '<span class="state ' + s[0] + '">' + ic(s[1], 14) + esc(label) + '</span>'; };
  var SYS = { ok: ['ok', 'Fonctionnelle'], warn: ['warn', 'À surveiller'], err: ['err', 'En erreur'], checking: ['chk', 'Vérification en cours'], unknown: ['unk', 'État inconnu'] };
  var RDV = { 'Confirmé': 'confirmed', 'À confirmer': 'act', 'Honoré': 'ok', 'Absent': 'err', 'Annulé': 'unk' };
  var rdvLabel = function (s) { return s === 'Honoré' ? 'Réalisé' : s; };

  /* ── État de l'interface ── */
  var S = {
    period: store.get('cc-period') || '30', from: '2026-10-01', to: '2026-10-26',
    seg: 'todo', q: '', fWork: '', fResp: '', fDate: '', sort: { k: 'recu', dir: -1 }, view: 'table',
    rdvView: 'cal', week: 0, rdvSort: { k: 'date', dir: 1 }, campSort: { k: 'depense', dir: -1 }, campF: '',
    set: 'entreprise', rep: 'mois', team: {}, ob: store.get('cc-ob') || { step: 0, data: {} }
  };

  /* ── Période ── */
  function range() {
    var end = new Date(NOW), start = new Date(NOW), label;
    if (S.period === 'mois') { start = new Date(2026, 9, 1); label = 'Octobre 2026'; }
    else if (S.period === 'trim') { start = new Date(2026, 9, 1); label = '4e trimestre 2026'; }
    else if (S.period === 'perso') { start = new Date(S.from + 'T00:00'); end = new Date(S.to + 'T23:59'); if (end > NOW) end = new Date(NOW); label = 'Du ' + dd(start) + ' au ' + dd(end); }
    else { start.setDate(start.getDate() - 30); label = '30 derniers jours'; }
    var days = Math.max(1, Math.round((end - start) / 864e5));
    return { start: start, end: end, label: label, days: days, full: 'Du ' + dd(start, { day: 'numeric', month: 'long' }) + ' au ' + dd(end, { day: 'numeric', month: 'long', year: 'numeric' }) };
  }
  function M() {
    var R = range();
    var L = D.leads.filter(function (l) { var t = new Date(l.recu); return t >= R.start && t <= R.end; });
    var spend = D.campagnes.reduce(function (a, c) { return a + c.depense; }, 0) * Math.min(1, R.days / 30);
    var q = L.filter(function (l) { return l.qualif === 'Qualifié'; }).length;
    var rdv = L.filter(function (l) { return l.rdv; });
    var conf = rdv.filter(function (l) { return l.rdv.statut === 'Confirmé' || l.rdv.statut === 'Honoré'; }).length;
    var due = rdv.filter(function (l) { return new Date(l.rdv.at) <= NOW && l.rdv.statut !== 'Annulé'; });
    var hon = due.filter(function (l) { return l.rdv.statut === 'Honoré'; }).length;
    var noRes = L.filter(function (l) { return l.etape === 'rdv_fait'; }).length;
    var devis = L.filter(function (l) { return l.devis; }).length;
    var won = L.filter(function (l) { return l.etape === 'signe'; });
    return { R: R, L: L, n: L.length, q: q, rdv: rdv.length, conf: conf, due: due.length, hon: hon, noRes: noRes, devis: devis, won: won.length, ca: won.reduce(function (a, l) { return a + l.signe; }, 0), spend: spend,
      cpl: L.length ? spend / L.length : 0, cplq: q ? spend / q : 0, imp: D.campagnes.reduce(function (a, c) { return a + c.impressions; }, 0), clics: D.campagnes.reduce(function (a, c) { return a + c.clics; }, 0) };
  }
  var PREV = D.precedent;
  function cmp(cur, prev, lowerBetter, fmt) {
    if (!prev) return '<span class="muted">Pas de période précédente comparable</span>';
    var d = (cur - prev) / prev * 100, r = Math.round(d);
    if (Math.abs(r) < 3) return 'Stable vs période précédente';
    var good = lowerBetter ? d < 0 : d > 0;
    return '<span class="' + (good ? 'up' : 'down') + '">' + ic(d > 0 ? 'up' : 'down', 14).replace('<svg', '<svg style="vertical-align:-2px"') + (d > 0 ? '+' : '') + r + ' %</span> vs ' + (fmt ? fmt(prev) : nf(prev));
  }

  /* ── Fil de preuve : calcul, source, mise à jour ── */
  var PROOF = {
    recues: ['Demandes reçues', 'Nombre de formulaires reçus sur la période, doublons et tests compris.', 'Formulaires Meta, transmis au CRM Orixen'],
    qualif: ['Demandes qualifiées', 'Demandes d’une personne joignable, propriétaire ou mandatée, pour des travaux de votre métier, dans votre zone.', 'Qualification renseignée par votre équipe dans les fiches'],
    rdvc: ['Rendez-vous confirmés', 'Rendez-vous pris sur la période dont le prospect a confirmé sa venue, ou qui ont eu lieu.', 'Confirmations reçues par SMS et rendez-vous renseignés'],
    ventes: ['Ventes conclues', 'Ventes déclarées comme signées par votre équipe, issues d’une demande Orixen.', 'Résultats commerciaux saisis dans les fiches'],
    spend: ['Dépenses publicitaires', 'Montant facturé par Meta sur la période, sur votre compte publicitaire.', 'API Marketing de Meta'],
    imp: ['Impressions', 'Nombre d’affichages de vos publicités.', 'API Marketing de Meta'],
    clics: ['Clics', 'Clics vers votre formulaire de demande.', 'API Marketing de Meta'],
    cpl: ['Coût par demande', 'Dépenses publicitaires ÷ demandes reçues.', 'Meta pour les dépenses, CRM Orixen pour les demandes'],
    tq: ['Taux de qualification', 'Demandes qualifiées ÷ demandes reçues.', 'Fiches de votre équipe'],
    cplq: ['Coût par demande qualifiée', 'Dépenses publicitaires ÷ demandes qualifiées.', 'Meta et fiches de votre équipe'],
    rdvp: ['Rendez-vous pris', 'Rendez-vous planifiés sur la période, quelle que soit leur date.', 'Calendrier du CRM Orixen'],
    pres: ['Taux de présence', 'Rendez-vous réalisés ÷ rendez-vous arrivés à échéance (annulations exclues).', 'Résultats de rendez-vous saisis'],
    devis: ['Devis envoyés', 'Devis déclarés comme envoyés.', 'Fiches de votre équipe'],
    cac: ['Coût d’acquisition client', '(Dépenses publicitaires + honoraires Orixen de la période) ÷ ventes conclues.', 'Meta, contrat Orixen, ventes déclarées'],
    ca: ['Chiffre d’affaires attribué', 'Montants signés reliés à une demande Orixen. Règle : la demande Orixen est le premier contact connu avec ce client.', 'Ventes déclarées par votre équipe']
  };
  var proof = function (k) { return '<button class="proof" data-proof="' + k + '">' + ic('info', 13) + 'Source et calcul</button>'; };
  function showProof(btn) {
    var p = PROOF[btn.dataset.proof], pop = $('#pop'), r = btn.getBoundingClientRect();
    pop.innerHTML = '<h4>' + esc(p[0]) + '</h4><dl><dt>Calcul</dt><dd>' + esc(p[1]) + '</dd><dt>Source</dt><dd>' + esc(p[2]) + '</dd><dt>Période</dt><dd>' + range().full + '</dd><dt>À jour</dt><dd>' + MAJ.replace('à jour ', '') + '</dd></dl>';
    pop.hidden = false;
    var x = Math.min(r.left, innerWidth - 316), y = r.bottom + 8; if (y + 220 > innerHeight) y = Math.max(8, r.top - 228);
    pop.style.left = Math.max(8, x) + 'px'; pop.style.top = y + 'px';
  }

  /* ── Tâches commerciales ── */
  function tasks() {
    var T = [];
    D.leads.forEach(function (l) {
      if (l.etape === 'nouveau') T.push({ p: 1, l: l, t: 'Rappeler ' + l.nom, k: 'call' });
      if (l.rdv && l.rdv.statut === 'À confirmer' && new Date(l.rdv.at) > NOW) T.push({ p: 2, l: l, t: 'Confirmer le rendez-vous de ' + l.nom, k: 'confirm' });
      if (l.etape === 'rdv_fait') T.push({ p: 2, l: l, t: 'Renseigner le résultat du rendez-vous de ' + l.nom, k: 'result' });
      if (l.etape === 'devis' && l.devis && hrs(l.devis.envoye) > 72) T.push({ p: 3, l: l, t: 'Relancer le devis de ' + l.nom, k: 'devis' });
    });
    return T;
  }

  /* ── Navigation ── */
  var NAV = [
    ['Pilotage', [['', 'Vue d’ensemble', 'home'], ['opportunites', 'Opportunités', 'opp'], ['performance', 'Performance', 'perf'], ['rendez-vous', 'Rendez-vous', 'cal']]],
    ['Service', [['systeme', 'Système', 'sys'], ['equipe', 'Équipe Orixen', 'team']]],
    ['Compte', [['parametres', 'Paramètres', 'gear']]]
  ];
  function chrome(cur) {
    var todo = D.leads.filter(function (l) { return l.etape === 'nouveau'; }).length;
    var watch = D.systeme.filter(function (c) { return c.etat === 'warn' || c.etat === 'err'; }).length;
    $('#nav').innerHTML = NAV.map(function (g) {
      return '<div class="grp">' + g[0] + '</div>' + g[1].map(function (n) {
        var c = n[0] === 'opportunites' && todo ? '<span class="count act">' + todo + '</span>' : n[0] === 'systeme' && watch ? '<span class="count">' + watch + '</span>' : '';
        return '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '"' + (cur === n[0] ? ' aria-current="page"' : '') + ' title="' + n[1] + '">' + ic(n[2]) + '<span>' + n[1] + '</span>' + c + '</a>';
      }).join('');
    }).join('');
    var tb = [['', 'Accueil', 'home', 0], ['opportunites', 'Leads', 'opp', todo], ['rendez-vous', 'Rendez-vous', 'cal', 0]];
    $('#tabbar').innerHTML = tb.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? 'on' : '') + '">' + ic(n[2], 22) + n[1] + (n[3] ? '<span class="n">' + n[3] + '</span>' : '') + '</a>'; }).join('') +
      '<button id="mm" class="' + (['performance', 'systeme', 'equipe', 'parametres', 'rapport'].indexOf(cur) > -1 ? 'on' : '') + '" aria-expanded="false">' + ic('menu', 22) + 'Menu</button>';
    $('#mmenu').innerHTML = [['performance', 'Performance', 'perf'], ['systeme', 'Système', 'sys'], ['equipe', 'Équipe Orixen', 'team'], ['parametres', 'Paramètres', 'gear']].map(function (n) { return '<a href="#/' + n[0] + '">' + ic(n[2], 20) + n[1] + '</a>'; }).join('');
    $('#mm').onclick = function () { var on = !$('#mmenu').classList.contains('on'); $('#mmenu').classList.toggle('on', on); $('#scrim').classList.toggle('on', on); this.setAttribute('aria-expanded', on); };
    $('#ent').textContent = D.entreprise;
    var k = watch ? 'warn' : 'ok';
    $('#sys').className = 'state hide-m ' + k;
    $('#sys').innerHTML = ic(k, 14) + (watch ? 'Système : ' + watch + (watch > 1 ? ' points' : ' point') + ' à surveiller' : 'Système fonctionnel');
    $('#bell').innerHTML = ic('bell', 20) + '<span class="badge-dot"></span>';
  }
  function periodOptions() {
    var o = [['30', '30 derniers jours'], ['mois', 'Mois en cours'], ['trim', 'Trimestre'], ['perso', 'Période personnalisée']];
    return o.map(function (x) { return '<option value="' + x[0] + '"' + (S.period === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('');
  }
  function setPeriod(v) { S.period = v; store.set('cc-period', v); $('#custom').hidden = v !== 'perso'; $('#period').innerHTML = periodOptions(); render(); }

  /* ── Retours ── */
  var tt;
  function toast(msg, err) { var t = $('#toast'); t.className = 'toast' + (err ? ' err' : ''); t.innerHTML = ic(err ? 'err' : 'ok', 16) + esc(msg); requestAnimationFrame(function () { t.classList.add('on'); }); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  function save(btn, fn, msg) {
    if (!navigator.onLine) { toast('Hors connexion : rien n’a été enregistré', true); return; }
    btn.classList.add('loading'); btn.setAttribute('aria-busy', 'true');
    setTimeout(function () { btn.classList.remove('loading'); btn.removeAttribute('aria-busy'); btn.classList.add('done'); var old = btn.innerHTML; btn.innerHTML = ic('ok', 16) + 'Enregistré'; setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = old; fn(); toast(msg + ' · confirmé à ' + nowHM()); }, 500); }, 450);
  }
  function confirmModal(title, text, okLabel, fn) {
    $('#modal').innerHTML = '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="mt"><div class="box"><h3 id="mt">' + esc(title) + '</h3><p>' + esc(text) + '</p><div class="row"><button class="btn" id="m-no">Annuler</button><button class="btn pri" id="m-ok">' + esc(okLabel) + '</button></div></div></div>';
    $('#m-no').focus();
    $('#m-no').onclick = function () { $('#modal').innerHTML = ''; };
    $('#m-ok').onclick = function () { var b = this; save(b, function () { $('#modal').innerHTML = ''; fn(); }, okLabel); };
  }
  function logEvent(l, txt) { l.historique.push({ at: new Date().toISOString(), type: 'status', txt: txt, par: 'Vous' }); l.derniere = l.historique[l.historique.length - 1]; }

  /* ── Orixen Intelligence, dans le contexte ── */
  var AI = {
    prio: function () {
      var T = tasks().sort(function (a, b) { return a.p - b.p; }).slice(0, 3);
      return { f: T.map(function (t, i) { return (i + 1) + '. ' + t.t + ' · ' + t.l.travaux + ' à ' + t.l.ville + ' · reçue ' + ago(t.l.recu); }), h: ['L’ordre suit l’ancienneté et l’étape : un premier contact passe avant une relance de devis.'], lim: ['Je ne connais pas vos contraintes de planning du jour.'], src: 'Fiches des demandes, rendez-vous à venir' };
    },
    qualif: function (l) {
      return { f: ['Propriétaire : ' + (l.proprietaire || 'non renseigné') + ' (réponse du formulaire).', 'Commune : ' + l.ville + (D.zone.indexOf(l.ville) > -1 ? ', dans votre zone exclusive.' : ', hors de votre zone exclusive.'), 'Travaux : ' + l.travaux + '.', 'Accord pour être rappelé : ' + (l.consent.rappel ? 'oui' : 'non') + '.', 'Qualification enregistrée : ' + l.qualif + '.'], h: [], lim: ['Les réponses du formulaire sont déclaratives : le budget et le délai restent à confirmer au téléphone.'], src: 'Formulaire du ' + dt(l.recu) + ', fiche ' + l.id };
    },
    cpl: function () {
      var m = M();
      return { f: ['Coût par demande qualifiée : ' + eur(m.cplq) + ', contre ' + eur(PREV.cplq) + ' sur la période précédente.', 'Budget de la campagne Réfection passé de 18 à 22 € par jour le 17 octobre.', 'Publicité « Âge du toit » (96 € par demande) mise en pause le 22 octobre.'], h: ['Une partie du budget supplémentaire est allée à « Âge du toit » avant sa pause. Non confirmé : la répartition jour par jour n’est pas encore disponible.'], lim: ['Les résultats commerciaux des 6 demandes de la campagne Réparations ne sont pas encore renseignés.'], src: 'API Meta, journal des changements, fiches des demandes' };
    },
    rdvprep: function (l) {
      return { f: ['Travaux demandés : ' + l.travaux + ' · budget indiqué : ' + l.budget + ' · délai : ' + l.delai + '.', 'Message du prospect : « ' + l.message + ' »', l.rdv && l.rdv.note ? 'Note : ' + l.rdv.note : 'Aucune note interne.'], h: [], lim: ['Le statut de propriétaire est déclaratif : à confirmer sur place.', l.rdv && l.rdv.statut === 'À confirmer' ? 'Le prospect n’a pas encore confirmé sa venue.' : 'Venue confirmée par le prospect.'], src: 'Fiche ' + l.id + ', formulaire et rendez-vous' };
    }
  };
  AI.followup = function (l) {
    var msg = 'Bonjour ' + l.prenom + ', c’est Julien de Toitures Martin. ' + (l.etape === 'nouveau' ? 'Je vous rappelle au sujet de votre demande pour votre toiture. Quel moment vous arrange aujourd’hui ?' : l.etape === 'devis' ? 'Avez-vous pu regarder notre devis ? Je reste disponible pour en parler.' : 'Je reviens vers vous pour la suite de votre projet. Quand pouvons-nous en parler ?');
    return { f: ['Accord pour être rappelé : oui, donné le ' + dt(l.consent.at) + '.', 'Étape actuelle : ' + stage(l.etape).nom.toLowerCase() + '.'], h: [], lim: ['Le message n’est envoyé qu’après votre confirmation explicite.'], src: 'Fiche ' + l.id, draft: msg, lead: l.id };
  };
  var askLink = function (key, arg, label) { return '<button class="ask" data-ask="' + key + '"' + (arg ? ' data-arg="' + arg + '"' : '') + ' aria-expanded="false">' + ic('q', 15) + esc(label) + '</button><div class="ai-slot"></div>'; };
  function answer(btn) {
    var slot = btn.nextElementSibling; if (slot.innerHTML) { slot.innerHTML = ''; btn.setAttribute('aria-expanded', false); return; }
    var A = AI[btn.dataset.ask](btn.dataset.arg ? lead(btn.dataset.arg) : null);
    var ul = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    slot.innerHTML = '<div class="answer"><header><span>Orixen Intelligence · réponse fondée sur les données de votre compte</span><button class="btn ghost icon" aria-label="Fermer la réponse" data-close>' + ic('x', 16) + '</button></header><div class="ab"><h4>Faits</h4>' + ul(A.f) + (A.h.length ? '<h4>Hypothèses</h4>' + ul(A.h) : '') + '<h4>Limites</h4>' + ul(A.lim) + (A.draft ? '<h4>Message proposé</h4><div class="field"><label class="sr" for="draft">Message proposé</label><textarea id="draft">' + esc(A.draft) + '</textarea></div><button class="btn pri" style="margin-top:8px" data-sendai="' + A.lead + '">Envoyer ce SMS</button>' : '') + '<p class="src">Sources : ' + esc(A.src) + ' · ' + MAJ + '</p></div></div>';
    btn.setAttribute('aria-expanded', true);
    var sb = $('[data-sendai]', slot); if (sb) sb.onclick = function () { var l = lead(sb.dataset.sendai), txt = $('#draft').value.trim(); if (!txt) { $('#draft').focus(); return; } confirmModal('Envoyer ce SMS à ' + l.nom + ' ?', 'Le message part au ' + l.tel + ' au nom de Toitures Martin. Le prospect a accepté d’être rappelé. Rien n’est envoyé sans votre accord.', 'Envoyer', function () { logEvent(l, 'SMS envoyé : « ' + txt + ' » (proposé par Orixen Intelligence, validé par vous)'); D.journal.unshift({ at: new Date().toISOString(), par: 'Proposé par Orixen Intelligence · validé par Julien Martin', txt: 'SMS de suivi envoyé à ' + l.nom, ia: true }); openLead(l.id); }); };
    $('[data-close]', slot).onclick = function () { slot.innerHTML = ''; btn.setAttribute('aria-expanded', false); btn.focus(); };
  }

  /* ════════ 1 · VUE D'ENSEMBLE ════════ */
  function vHome() {
    var m = M(), T = tasks();
    var calls = T.filter(function (t) { return t.k === 'call'; }).map(function (t) { return t.l; }).sort(function (a, b) { return new Date(a.recu) - new Date(b.recu); });
    var prio;
    if (calls.length) prio = { t: calls.length + (calls.length > 1 ? ' demandes attendent' : ' demande attend') + ' votre premier contact.', p: 'La plus ancienne a été reçue ' + ago(calls[0].recu) + '. Chaque prospect a reçu un SMS annonçant votre appel aujourd’hui.', who: calls.map(function (l) { return esc(l.nom) + ' · ' + esc(l.travaux.toLowerCase()) + ' · ' + ago(l.recu); }), b: ['Voir les demandes', '#/opportunites?seg=todo'] };
    else if (T.length) prio = { t: T[0].t + '.', p: 'C’est la prochaine action la plus utile sur votre compte.', who: [], b: ['Ouvrir la demande', '#/opportunites/' + T[0].l.id] };
    else prio = { t: 'Rien d’urgent aujourd’hui.', p: 'Prochain jalon : ' + D.equipe.jalons[0].txt.toLowerCase() + ', le ' + dd(D.equipe.jalons[0].date, { day: 'numeric', month: 'long' }) + '.', who: [], b: ['Voir la performance', '#/performance'] };
    var next = T.filter(function (t) { return t.k !== 'call'; }).sort(function (a, b) { return a.p - b.p; })[0];

    var evs = [];
    D.leads.forEach(function (l) { l.historique.forEach(function (e) { if (['form', 'rdv', 'devis', 'win', 'status'].indexOf(e.type) > -1) evs.push({ at: e.at, txt: (e.type === 'form' ? 'Nouvelle demande · ' + l.nom + ', ' + l.travaux.toLowerCase() : e.txt + ' · ' + l.nom), href: '#/opportunites/' + l.id, ic: { form: 'form', rdv: 'cal', devis: 'doc', win: 'ok', status: 'edit' }[e.type] }); }); });
    D.systeme.forEach(function (c) { if (c.incident && c.incident.resolu) evs.push({ at: c.incident.resolu, txt: 'Intégration rétablie · ' + c.nom, href: '#/systeme', ic: 'sys' }); });
    evs = evs.filter(function (e) { return new Date(e.at) <= NOW; }).sort(function (a, b) { return new Date(b.at) - new Date(a.at); }).slice(0, 7);

    var salesState = m.noRes ? state('inc', 'Incomplet · ' + m.noRes + ' rendez-vous sans résultat') : state('confirmed', 'Déclarées par votre équipe');
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Vue d’ensemble</h1><div class="sub">' + m.R.full + ' · données ' + MAJ + '</div></div><div class="acts only-m"><select class="select" data-period aria-label="Période analysée">' + periodOptions() + '</select></div></div>' +
      '<section class="prio" aria-labelledby="prio-t"><div><span class="state act">' + ic('act', 14) + 'Priorité du jour</span><h2 id="prio-t">' + prio.t + '</h2><p>' + prio.p + '</p>' + (prio.who.length ? '<div class="who">' + prio.who.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' : '') + '<div style="margin-top:12px">' + askLink('prio', '', 'Quelles sont les trois priorités aujourd’hui ?') + '</div></div><a class="btn pri lg" href="' + prio.b[1] + '">' + prio.b[0] + '</a></section>' +
      '<div class="rule"><span class="idx">01</span><h2 class="h-sec">Indicateurs</h2><span class="meta">' + m.R.label + '</span></div>' +
      '<div class="metrics">' +
        metric('Demandes reçues', nf(m.n), cmp(m.n, PREV.leads), 'recues', state('confirmed', 'Confirmé')) +
        metric('Demandes qualifiées', nf(m.q), cmp(m.q, PREV.qualifies) + ' · ' + pct(m.q, m.n) + ' des demandes', 'qualif', state('confirmed', 'Confirmé')) +
        metric('Rendez-vous confirmés', nf(m.conf), cmp(m.conf, PREV.rdv), 'rdvc', state('confirmed', 'Confirmé')) +
        metric('Ventes conclues', nf(m.won), cmp(m.won, PREV.ventes) + ' · ' + eur(m.ca), 'ventes', salesState) +
      '</div>' +
      '<p class="small muted" style="margin-top:12px">Un volume élevé de demandes ne suffit pas : ce qui compte, c’est combien répondent, correspondent à vos travaux et deviennent clients. Coûts et dépenses : <a class="link" href="#/performance">Performance</a>.</p>' +
      '<div class="grid g-main" style="margin-top:40px">' +
        '<section><div class="rule" style="margin-top:0"><span class="idx">02</span><h2 class="h-sec">Activité récente</h2><a class="meta link" href="#/opportunites?seg=all">Tout voir</a></div><div class="panel feed list">' +
          evs.map(function (e) { return '<a href="' + e.href + '">' + ic(e.ic, 18) + '<span><b>' + esc(e.txt) + '</b></span><time datetime="' + e.at + '">' + ago(e.at) + '</time></a>'; }).join('') + '</div></section>' +
        '<section><div class="rule" style="margin-top:0"><span class="idx">03</span><h2 class="h-sec">Prochaine étape</h2><span class="meta"></span></div>' +
          (next ? '<div class="panel next"><span class="lab">Prochaine action</span><h3>' + esc(next.t) + '</h3><div class="who">Responsable : ' + esc(user(next.l.resp).nom) + ' · ' + (next.k === 'confirm' ? 'avant le ' + dd(next.l.rdv.at, { day: 'numeric', month: 'long' }) : 'cette semaine') + '</div><a class="btn" href="#/opportunites/' + next.l.id + (next.k === 'result' ? '?resultat' : '') + '">Ouvrir la demande</a></div>'
            : '<div class="panel empty"><h3>Aucune autre action en attente</h3><p>Les prochaines actions apparaîtront ici.</p></div>') +
        '</section>' +
      '</div>';
  }
  function metric(label, val, c, pk, st) {
    return '<div class="metric"><span class="lab">' + label + '</span><b>' + val + '</b><div class="cmp">' + c + '</div><div class="foot">' + st + proof(pk) + '</div></div>';
  }

  /* ════════ 2 · OPPORTUNITÉS ════════ */
  var SEG = { todo: ['Non traitées', function (l) { return l.etape === 'nouveau'; }], active: ['En cours', function (l) { return ['contacte', 'qualifie', 'rdv', 'rdv_fait', 'devis', 'nego'].indexOf(l.etape) > -1; }], won: ['Gagnées', function (l) { return l.etape === 'signe'; }], lost: ['Perdues', function (l) { return l.etape === 'perdu'; }], all: ['Toutes', function () { return true; }] };
  function oppRows() {
    var q = S.q.trim().toLowerCase();
    var L = D.leads.filter(function (l) {
      if (!SEG[S.seg][1](l)) return false;
      if (S.fWork && l.travaux !== S.fWork) return false;
      if (S.fResp && l.resp !== S.fResp) return false;
      if (S.fDate === '1' && hrs(l.recu) > 24) return false;
      if (S.fDate === '7' && hrs(l.recu) > 168) return false;
      if (q && (l.nom + ' ' + l.ville + ' ' + l.travaux + ' ' + l.tel + ' ' + l.id).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var key = { contact: function (l) { return l.nom; }, recu: function (l) { return new Date(l.recu).getTime(); }, statut: function (l) { return D.stages.findIndex(function (s) { return s.id === l.etape; }); }, resp: function (l) { return user(l.resp).nom; }, last: function (l) { return new Date(l.derniere.at).getTime(); } }[S.sort.k];
    return L.sort(function (a, b) { var x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * S.sort.dir; });
  }
  var statusCell = function (l) { return '<span title="' + (l.etape === 'perdu' ? (l.qualif === 'Disqualifié' ? 'Disqualifiée' : 'Perdue') : stage(l.etape).nom) + '">' + statusCell0(l) + '</span>'; };
  var statusCell0 = function (l) { var cls = l.etape === 'nouveau' ? 'new' : l.etape === 'signe' ? 'won' : l.etape === 'perdu' ? 'lost' : ''; return '<span class="dot ' + cls + '"></span>' + (l.etape === 'perdu' ? (l.qualif === 'Disqualifié' ? 'Disqualifiée' : 'Perdue') : stage(l.etape).nom); };
  function vOpp() {
    var L = oppRows(), works = Array.from(new Set(D.leads.map(function (l) { return l.travaux; })));
    var counts = {}; Object.keys(SEG).forEach(function (k) { counts[k] = D.leads.filter(SEG[k][1]).length; });
    var th = function (k, lab) { var on = S.sort.k === k; return '<th' + (on ? ' aria-sort="' + (S.sort.dir > 0 ? 'ascending' : 'descending') + '"' : '') + '><button data-sort="' + k + '">' + lab + ic(on ? (S.sort.dir > 0 ? 'up' : 'down') : 'sort', 14) + '</button></th>'; };
    var chips = [];
    if (S.fDate) chips.push(['fDate', S.fDate === '1' ? 'Dernières 24 h' : '7 derniers jours']);
    if (S.fWork) chips.push(['fWork', S.fWork]);
    if (S.fResp) chips.push(['fResp', user(S.fResp).nom]);
    if (S.q) chips.push(['q', '« ' + S.q + ' »']);
    var act = D.leads.filter(SEG.active[1]), byStage = {};
    act.forEach(function (l) { (byStage[l.etape] = byStage[l.etape] || []).push(hrs(l.derniere.at)); });
    var slow = Object.keys(byStage).map(function (k) { return [k, byStage[k].reduce(function (a, b) { return a + b; }, 0) / byStage[k].length]; }).sort(function (a, b) { return b[1] - a[1]; })[0];
    var h = '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Opportunités</h1><div class="sub">' + D.leads.length + ' demandes · ' + range().label + '</div></div><div class="acts"><div class="seg" role="group" aria-label="Affichage"><button data-view="table" aria-pressed="' + (S.view === 'table') + '">Tableau</button><button data-view="board" aria-pressed="' + (S.view === 'board') + '">Pipeline</button></div><button class="btn" id="export">' + ic('dl', 16) + 'Exporter</button></div></div>' +
      '<div class="tabs" role="tablist">' + Object.keys(SEG).map(function (k) { return '<button role="tab" data-seg="' + k + '" aria-selected="' + (S.seg === k) + '">' + SEG[k][0] + ' <span class="muted num">' + counts[k] + '</span></button>'; }).join('') + '</div>' +
      (slow ? '<p class="small t2" style="margin:-8px 0 16px">' + state('warn', 'À surveiller') + '&nbsp; Les opportunités ralentissent à l’étape « ' + stage(slow[0]).nom + ' » : ' + (slow[1] < 48 ? Math.round(slow[1]) + ' h' : Math.round(slow[1] / 24) + ' jours') + ' sans nouvelle action en moyenne.</p>' : '') +
      '<div class="toolbar"><label class="search">' + ic('search', 16) + '<span class="sr">Rechercher</span><input id="q" type="search" placeholder="Rechercher un nom, une ville, un téléphone" value="' + esc(S.q) + '"></label>' +
        '<select class="select" id="fDate" aria-label="Date de réception"><option value="">Toute la période</option><option value="1"' + (S.fDate === '1' ? ' selected' : '') + '>Dernières 24 h</option><option value="7"' + (S.fDate === '7' ? ' selected' : '') + '>7 derniers jours</option></select>' +
        '<select class="select" id="fWork" aria-label="Type de travaux"><option value="">Tous les travaux</option>' + works.map(function (w) { return '<option' + (S.fWork === w ? ' selected' : '') + '>' + esc(w) + '</option>'; }).join('') + '</select>' +
        '<select class="select" id="fResp" aria-label="Responsable"><option value="">Tous les responsables</option>' + D.users.slice(0, 2).map(function (u) { return '<option value="' + u.id + '"' + (S.fResp === u.id ? ' selected' : '') + '>' + u.nom + '</option>'; }).join('') + '</select></div>' +
      '<div class="chips">' + (chips.length ? 'Filtres actifs : ' + chips.map(function (c) { return '<span class="chip">' + esc(c[1]) + '<button aria-label="Retirer le filtre ' + esc(c[1]) + '" data-unf="' + c[0] + '">' + ic('x', 12) + '</button></span>'; }).join('') + '<button class="link" data-unf="all">Effacer les filtres</button>' : '<span>' + L.length + ' résultat' + (L.length > 1 ? 's' : '') + '</span>') + '</div>';
    if (!L.length) return h + '<div class="table-wrap empty"><h3>Aucune demande ne correspond</h3><p>Retirez un filtre ou changez d’onglet.</p><button class="btn" data-unf="all">Effacer les filtres</button></div>';
    if (S.view === 'board') {
      return h + '<div class="board">' + D.stages.filter(function (s) { return S.seg === 'all' || L.some(function (l) { return l.etape === s.id; }); }).map(function (s) {
        var it = L.filter(function (l) { return l.etape === s.id; });
        return '<div class="col"><h3>' + s.nom + '<span>' + it.length + '</span></h3>' + (slow && slow[0] === s.id ? '<div class="slow">' + ic('warn', 12) + ' Étape la plus lente</div>' : '') + it.map(function (l) { return '<a href="#/opportunites/' + l.id + '"><b>' + esc(l.nom) + '</b><span>' + esc(l.travaux) + ' · ' + ago(l.recu) + '</span></a>'; }).join('') + '</div>';
      }).join('') + '</div>';
    }
    return h + '<div class="table-wrap"><div class="table-scroll"><table class="opp"><thead><tr>' + th('contact', 'Contact') + '<th>Projet</th>' + th('recu', 'Reçu le') + th('statut', 'Statut') + th('resp', 'Responsable').replace('<th', '<th class="c-resp"') + th('last', 'Dernière action') + '<th class="r">Action</th></tr></thead><tbody>' +
      L.map(function (l) { return '<tr class="row" tabindex="0" data-lead="' + l.id + '"><td><b style="font-weight:500">' + esc(l.nom) + '</b><span class="two">' + (l.consent.rappel ? 'Téléphone · SMS' : 'Aucun contact autorisé') + '</span></td><td title="' + esc(l.travaux + ' · ' + l.ville) + '">' + esc(l.travaux) + '<span class="two">' + esc(l.ville) + '</span></td><td class="num">' + dt(l.recu).replace(',', '') + '</td><td>' + statusCell(l) + '</td><td class="c-resp">' + esc(user(l.resp).nom) + '</td><td class="c-last" title="' + esc(l.derniere.txt) + '">' + esc(l.derniere.txt) + '<span class="two">' + ago(l.derniere.at) + '</span></td><td class="r"><a class="btn icon ghost" href="#/opportunites/' + l.id + '" aria-label="Ouvrir la fiche de ' + esc(l.nom) + '" title="Ouvrir la fiche">' + ic('right', 16) + '</a></td></tr>'; }).join('') +
      '</tbody></table></div><div class="mlist">' + L.map(function (l) { return '<a class="mitem" href="#/opportunites/' + l.id + '"><div class="l1"><span>' + esc(l.nom) + '</span><span class="small muted">' + ago(l.recu) + '</span></div><div class="l2">' + esc(l.travaux) + ' · ' + esc(l.ville) + '</div><div class="l3"><span>' + statusCell(l) + '</span><span class="muted">' + esc(user(l.resp).nom) + '</span></div></a>'; }).join('') + '</div></div>';
  }
  function bindOpp() {
    var q = $('#q'); if (!q) return;
    q.oninput = function () { S.q = q.value; var p = q.selectionStart; render(); var n = $('#q'); n.focus(); n.setSelectionRange(p, p); };
    ['fDate', 'fWork', 'fResp'].forEach(function (k) { $('#' + k).onchange = function () { S[k] = this.value; render(); }; });
    $$('[data-seg]').forEach(function (b) { b.onclick = function () { S.seg = b.dataset.seg; render(); }; });
    $$('[data-view]').forEach(function (b) { b.onclick = function () { S.view = b.dataset.view; render(); }; });
    $$('[data-sort]').forEach(function (b) { b.onclick = function () { var k = b.dataset.sort; S.sort = { k: k, dir: S.sort.k === k ? -S.sort.dir : (k === 'recu' || k === 'last' ? -1 : 1) }; render(); }; });
    $$('[data-unf]').forEach(function (b) { b.onclick = function () { var k = b.dataset.unf; if (k === 'all') { S.q = ''; S.fDate = ''; S.fWork = ''; S.fResp = ''; } else S[k] = ''; render(); }; });
    $$('tr.row[data-lead]').forEach(function (r) { r.onclick = function (e) { if (e.target.closest('a')) return; location.hash = '#/opportunites/' + r.dataset.lead; }; r.onkeydown = function (e) { if (e.key === 'Enter') location.hash = '#/opportunites/' + r.dataset.lead; }; });
    $('#export').onclick = function () {
      var rows = [['Identifiant', 'Contact', 'Téléphone', 'Projet', 'Ville', 'Reçu le', 'Statut', 'Responsable']].concat(oppRows().map(function (l) { return [l.id, l.nom, l.tel, l.travaux, l.ville, dt(l.recu), stage(l.etape).nom, user(l.resp).nom]; }));
      var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'orixen-demandes-demo.csv'; a.click();
      toast('Export de ' + (rows.length - 1) + ' demandes (données de démonstration)');
    };
  }

  /* fiche d'une demande */
  function sec(t, body) { return '<section style="margin-top:24px"><h3 class="h-sec" style="font-size:15px;padding-bottom:8px;margin-bottom:12px;border-bottom:1px solid var(--line)">' + t + '</h3>' + body + '</section>'; }
  function openLead(id, mode) {
    var l = lead(id); if (!l) return;
    var camp = D.campagnes.find(function (c) { return c.id === l.campagne; }) || {};
    var upcoming = l.rdv && new Date(l.rdv.at) > NOW;
    var tel = l.tel.replace(/\s/g, '');
    var h = '<div class="sh-h"><div style="flex:1;min-width:0"><span class="lab">' + l.id + ' · ' + statusCell(l) + '</span><h2>' + esc(l.nom) + '</h2><div class="small muted">' + esc(l.travaux) + ' à ' + esc(l.ville) + ' · reçue le ' + dt(l.recu) + '</div></div><button class="btn icon ghost" id="sh-x" aria-label="Fermer la fiche">' + ic('x') + '</button></div><div class="sh-b">' +
      sec('Prochaine action', (l.next ? '<p style="font-weight:500">' + esc(l.next.txt) + '</p><p class="small muted">Responsable : ' + esc(user(l.resp).nom) + ' · échéance ' + (hrs(l.next.due) >= 0 ? 'aujourd’hui' : dd(l.next.due, { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>' : '<p class="muted">Aucune action en attente : demande ' + (l.etape === 'signe' ? 'gagnée' : 'clôturée') + '.</p>') + '<div id="rem" style="margin-top:12px"></div>') +
      sec('Statut', '<div class="field"><label for="st-sel">Étape du pipeline</label><select id="st-sel">' + D.stages.map(function (s) { return '<option value="' + s.id + '"' + (l.etape === s.id ? ' selected' : '') + '>' + s.nom + '</option>'; }).join('') + '</select></div><div class="field" id="motif-f" style="margin-top:12px' + (l.etape === 'perdu' ? '' : ';display:none') + '"><label for="motif">Motif de perte</label><select id="motif">' + ['Inconnu', 'Coordonnées invalides', 'Doublon', 'Hors zone', 'Prestation non adaptée', 'Budget incompatible', 'Projet trop éloigné', 'Prix jugé trop élevé', 'A choisi un concurrent', 'Ne répond plus'].map(function (x) { return '<option' + ((l.motif || 'Inconnu') === x ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select><span class="small muted">Le motif n’est jamais supposé : « Inconnu » tant que vous ne l’avez pas renseigné.</span></div><button class="btn pri" id="st-save" style="margin-top:12px">Enregistrer le statut</button>') +
      (['rdv_fait', 'devis', 'nego'].indexOf(l.etape) > -1 || mode === 'resultat' ? sec('Résultat commercial', '<div class="opts" role="group" aria-label="Résultat">' + ['En cours', 'Gagnée', 'Perdue'].map(function (o) { return '<button data-res="' + o + '" aria-pressed="false">' + o + '</button>'; }).join('') + '</div><div class="field" id="amt-f" style="margin-top:12px;display:none"><label for="amt">Montant signé</label><input id="amt" inputmode="numeric" placeholder="Exemple : 18 600"><span class="err" id="amt-err" hidden></span></div><div class="field" style="margin-top:12px"><label for="res-note">Note (facultative)</label><input id="res-note" placeholder="Ce qu’il faut retenir"></div><button class="btn pri" id="res-save" style="margin-top:12px">Enregistrer le résultat</button>') : '') +
      sec('Coordonnées et consentements', '<dl class="kv"><dt>Téléphone</dt><dd class="num">' + esc(l.tel) + '</dd><dt>E-mail</dt><dd>' + esc(l.email) + '</dd><dt>Être rappelé</dt><dd>' + (l.consent.rappel ? state('confirmed', 'Accordé le ' + dt(l.consent.at)) : state('err', 'Non accordé')) + '<span class="small muted" style="display:block">' + esc(l.consent.canal) + '</span></dd><dt>Prospection commerciale</dt><dd>' + (l.consent.marketing ? 'Accordée' : 'Non accordée') + '</dd><dt>Visibilité</dt><dd class="small t2">' + ic('lock', 13) + ' Vous et ' + esc(user(l.resp).nom) + '</dd></dl>') +
      sec('Origine', '<dl class="kv"><dt>Source</dt><dd>' + esc(l.source) + '</dd><dt>Campagne</dt><dd>' + esc(camp.nom || 'Inconnue') + '</dd><dt>Publicité</dt><dd>' + esc(l.pub) + '</dd><dt>Reçue le</dt><dd class="num">' + dt(l.recu) + '</dd></dl>') +
      sec('Besoin du prospect', '<dl class="kv"><dt>Travaux</dt><dd>' + esc(l.travaux) + '</dd><dt>Commune</dt><dd>' + esc(l.ville) + '</dd><dt>Budget indiqué</dt><dd>' + esc(l.budget) + '</dd><dt>Délai</dt><dd>' + esc(l.delai) + '</dd><dt>Propriétaire</dt><dd>' + esc(l.proprietaire) + '</dd><dt>Message</dt><dd>« ' + esc(l.message) + ' »</dd><dt>Valeur estimée</dt><dd>' + (l.valeur ? state('est', 'Estimé · ' + eur(l.valeur)) : '·') + '</dd><dt>Montant signé</dt><dd>' + (l.signe ? state('confirmed', eur(l.signe)) : '·') + '</dd></dl><div style="margin-top:12px;display:grid;gap:8px;justify-items:start">' + (l.consent.rappel && l.etape !== 'signe' && l.etape !== 'perdu' ? askLink('followup', l.id, 'Proposer un message de suivi') : '') + askLink('qualif', l.id, 'Pourquoi cette demande est-elle considérée comme ' + (l.qualif === 'Qualifié' ? 'qualifiée' : 'non qualifiée') + ' ?') + '</div>') +
      (l.rdv ? sec('Rendez-vous', '<dl class="kv"><dt>Date</dt><dd>' + day(l.rdv.at) + ' à ' + hm(l.rdv.at) + '</dd><dt>Statut</dt><dd>' + state(RDV[l.rdv.statut], rdvLabel(l.rdv.statut)) + '</dd><dt>Note</dt><dd>' + esc(l.rdv.note || '·') + '</dd></dl>' + (upcoming ? '<div style="margin-top:12px">' + askLink('rdvprep', l.id, 'Quelles informations faut-il vérifier avant ce rendez-vous ?') + '</div>' : '')) : '') +
      sec('Notes internes', '<div id="notes">' + (l.notes.length ? l.notes.map(function (n) { return '<div class="cmt"><span class="by">' + esc(n.par) + ' · ' + dt(n.at) + '</span><div>' + esc(n.txt) + '</div></div>'; }).join('') : '<p class="small muted">Aucune note.</p>') + '</div><div class="field" id="note-f" style="margin-top:12px"><label for="note-in">Ajouter une note</label><textarea id="note-in" placeholder="Visible par vous et votre équipe autorisée"></textarea><span class="err" id="note-err" hidden></span></div><button class="btn" id="note-add" style="margin-top:8px">Ajouter la note</button>') +
      sec('Historique', '<ul class="tl">' + l.historique.slice().reverse().map(function (e) { return '<li><span>' + esc(e.txt) + '<span class="by">' + esc(e.par) + '</span></span><time datetime="' + e.at + '">' + dt(e.at) + '</time></li>'; }).join('') + '</ul>') +
      '</div><div class="sh-f">' + (l.consent.rappel ? '<a class="btn" href="tel:' + tel + '">' + ic('phone', 16) + 'Appeler</a><a class="btn" href="sms:' + tel + '">' + ic('msg', 16) + 'Message</a>' : '<button class="btn" disabled>' + ic('phone', 16) + 'Appeler</button><button class="btn" disabled>' + ic('msg', 16) + 'Message</button>') + '<button class="btn" id="jump">' + ic('edit', 16) + 'Statut</button><button class="btn" id="rem-btn">' + ic('clock', 16) + 'Rappel</button></div>';
    var sh = $('#sheet'); sh.innerHTML = h; sh.classList.add('on'); $('#scrim').classList.add('on');
    $('#sh-x').onclick = closeSheet;
    if (mode === 'resultat') setTimeout(function () { var r = $('[data-res]', sh); if (r) r.scrollIntoView({ block: 'center' }); }, 220); else $('#sh-x').focus();
    var sel = $('#st-sel'); sel.onchange = function () { $('#motif-f').style.display = sel.value === 'perdu' ? '' : 'none'; };
    $('#st-save').onclick = function () {
      var prev = l.etape, nv = sel.value; if (nv === prev && nv !== 'perdu') { toast('Le statut n’a pas changé'); return; }
      save(this, function () { l.etape = nv; if (nv === 'perdu') { l.motif = $('#motif').value; } logEvent(l, 'Statut : ' + stage(prev).nom + ' → ' + stage(nv).nom + (nv === 'perdu' ? ' · motif : ' + l.motif.toLowerCase() : '')); render(true); openLead(id); }, 'Statut mis à jour');
    };
    var res = '';
    $$('[data-res]', sh).forEach(function (b) { b.onclick = function () { res = b.dataset.res; $$('[data-res]', sh).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('#amt-f').style.display = res === 'Gagnée' ? '' : 'none'; }; });
    var rs = $('#res-save'); if (rs) rs.onclick = function () {
      if (!res) { toast('Choisissez un résultat', true); return; }
      var amt = +($('#amt').value || '').replace(/\D/g, '');
      if (res === 'Gagnée' && !amt) { var e = $('#amt-err'); e.innerHTML = ic('err', 13) + 'Indiquez le montant réellement signé.'; e.hidden = false; $('#amt-f').classList.add('has-err'); $('#amt').focus(); return; }
      save(this, function () {
        var note = $('#res-note').value.trim();
        if (res === 'Gagnée') { l.etape = 'signe'; l.signe = amt; logEvent(l, 'Vente conclue · ' + eur(amt)); }
        else if (res === 'Perdue') { l.etape = 'perdu'; l.motif = 'Inconnu'; logEvent(l, 'Perdue · motif inconnu'); }
        else logEvent(l, 'Résultat renseigné : en cours');
        if (note) l.notes.push({ at: new Date().toISOString(), par: 'Vous', txt: note });
        render(true); openLead(id);
      }, 'Résultat enregistré');
    };
    $('#note-add').onclick = function () {
      var v = $('#note-in').value.trim(); if (!v) { var e = $('#note-err'); e.innerHTML = ic('err', 13) + 'La note est vide.'; e.hidden = false; $('#note-f').classList.add('has-err'); $('#note-in').focus(); return; }
      save(this, function () { l.notes.push({ at: new Date().toISOString(), par: 'Vous', txt: v }); openLead(id); }, 'Note ajoutée');
    };
    $('#jump').onclick = function () { $('#st-sel').scrollIntoView({ block: 'center' }); $('#st-sel').focus(); };
    $('#rem-btn').onclick = function () {
      var box = $('#rem');
      box.innerHTML = '<div class="form panel" style="padding:16px"><div class="field"><label for="rem-d">Date du rappel</label><input type="date" id="rem-d" value="2026-10-27"></div><div class="field"><label for="rem-h">Heure</label><input type="time" id="rem-h" value="18:15"></div><button class="btn pri" id="rem-ok">Créer le rappel</button></div>';
      box.scrollIntoView({ block: 'center' }); $('#rem-d').focus();
      $('#rem-ok').onclick = function () { var dv = $('#rem-d').value, hv = $('#rem-h').value; save(this, function () { logEvent(l, 'Rappel créé pour le ' + dd(dv + 'T' + hv, { day: 'numeric', month: 'long' }) + ' à ' + hv.replace(':', 'h')); openLead(id); }, 'Rappel créé'); };
    };
    bindCommon(sh);
  }
  function closeSheet() {
    if (!$('#sheet').classList.contains('on')) return;
    $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on');
    var h = location.hash; if (/^#\/(opportunites|performance)\/[^/?]+/.test(h)) history.replaceState(null, '', h.split('?')[0].replace(/\/[^/]+$/, ''));
  }

  /* ════════ 3 · PERFORMANCE ════════ */
  function vPerf() {
    var m = M();
    var row = function (lab, val, c, pk, st) { return { lab: lab, val: val, c: c || '', pk: pk, st: st || '' }; };
    var tbl = function (rows) {
      return '<div class="table-wrap"><div class="table-scroll"><table><thead><tr><th>Indicateur</th><th class="r">Valeur</th><th>Évolution</th><th>État</th><th class="r"><span class="sr">Source</span></th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r.lab + '</td><td class="r" style="font-size:15px;font-weight:500">' + r.val + '</td><td class="t2">' + r.c + '</td><td>' + r.st + '</td><td class="r">' + proof(r.pk) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="mlist">' + rows.map(function (r) { return '<div class="mitem"><div class="l1"><span>' + r.lab + '</span><span class="num">' + r.val + '</span></div>' + (r.c ? '<div class="l2">' + r.c + '</div>' : '') + '<div class="l3">' + r.st + proof(r.pk) + '</div></div>'; }).join('') + '</div></div>';
    };
    var C = D.campagnes.filter(function (c) { return !S.campF || c.statut === S.campF; }).map(function (c) {
      var L = D.leads.filter(function (l) { return l.campagne === c.id; });
      return { c: c, dep: c.depense, n: c.formulaires, cpl: c.depense / c.formulaires, q: L.filter(function (l) { return l.qualif === 'Qualifié'; }).length, rdv: L.filter(function (l) { return l.rdv; }).length, won: L.filter(function (l) { return l.etape === 'signe'; }).length };
    });
    var ck = { nom: function (x) { return x.c.nom; }, depense: function (x) { return x.dep; }, n: function (x) { return x.n; }, cpl: function (x) { return x.cpl; }, q: function (x) { return x.q; } }[S.campSort.k];
    C.sort(function (a, b) { var x = ck(a), y = ck(b); return (x > y ? 1 : x < y ? -1 : 0) * S.campSort.dir; });
    var cst = { active: ['ok', 'Active'], apprentissage: ['est', 'En apprentissage'], pause: ['unk', 'En pause'], erreur: ['err', 'En erreur'] };
    var cth = function (k, lab, r) { var on = S.campSort.k === k; return '<th class="' + (r ? 'r' : '') + '"' + (on ? ' aria-sort="' + (S.campSort.dir > 0 ? 'ascending' : 'descending') + '"' : '') + '><button data-csort="' + k + '">' + lab + ic(on ? (S.campSort.dir > 0 ? 'up' : 'down') : 'sort', 14) + '</button></th>'; };
    var conf = state('confirmed', 'Confirmé');
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Performance</h1><div class="sub">' + m.R.full + ' · dépenses Meta à jour au 26 octobre à 17h00 · ventes déclarées jusqu’au 26 octobre</div></div><div class="acts"><select class="select only-m" data-period aria-label="Période analysée">' + periodOptions() + '</select><a class="btn" href="#/rapport">' + ic('doc', 16) + 'Rapport</a></div></div>' +
      '<div class="rule"><span class="idx">01</span><h2 class="h-sec">Acquisition</h2><span class="meta">Ce que la publicité produit</span></div>' +
      tbl([row('Dépenses publicitaires', eur(m.spend), cmp(m.spend, PREV.depense, false, eur), 'spend', conf), row('Impressions', nf(m.imp), '', 'imp', conf), row('Clics', nf(m.clics), '', 'clics', conf), row('Demandes reçues', nf(m.n), cmp(m.n, PREV.leads), 'recues', conf), row('Coût par demande', eur(m.cpl), '', 'cpl', conf)]) +
      '<div class="rule"><span class="idx">02</span><h2 class="h-sec">Qualité</h2><span class="meta">Ce qui est exploitable</span></div>' +
      tbl([row('Demandes qualifiées', nf(m.q), cmp(m.q, PREV.qualifies), 'qualif', conf), row('Taux de qualification', pct(m.q, m.n), '', 'tq', conf), row('Coût par demande qualifiée', eur(m.cplq), cmp(m.cplq, PREV.cplq, true, eur), 'cplq', conf), row('Rendez-vous pris', nf(m.rdv), cmp(m.rdv, PREV.rdv), 'rdvp', conf), row('Taux de présence', pct(m.hon, m.due), '', 'pres', m.noRes ? state('inc', 'Incomplet') : conf)]) +
      '<div class="rule"><span class="idx">03</span><h2 class="h-sec">Résultats commerciaux</h2><span class="meta">Ce qui est signé</span></div>' +
      tbl([row('Devis envoyés', nf(m.devis), '', 'devis', state('confirmed', 'Déclaré')), row('Ventes conclues', nf(m.won), cmp(m.won, PREV.ventes), 'ventes', m.noRes ? state('inc', 'Incomplet') : state('confirmed', 'Déclaré')), row('Coût d’acquisition client', m.won ? eur((m.spend + 2500) / m.won) : '·', '', 'cac', state('est', 'Estimé')), row('Chiffre d’affaires attribué', eur(m.ca), '', 'ca', state('est', 'Attribué, non incrémental'))]) +
      '<p class="small t2" style="margin-top:12px;max-width:820px">Le chiffre d’affaires attribué n’est pas forcément du chiffre d’affaires supplémentaire : certains clients vous auraient peut-être trouvé autrement. Ce n’est pas non plus votre marge. Aucune rentabilité n’est calculée tant que votre taux de marge n’est pas renseigné.</p>' +
      '<div class="rule"><span class="idx">04</span><h2 class="h-sec">Demandes reçues et qualifiées, jour par jour</h2><span class="meta">30 derniers jours · mêmes définitions sur toute la période</span></div>' +
      '<div class="panel pad">' + lineChart('ch1') + '<p class="small t2" style="margin-top:12px">L’écart entre les deux courbes correspond aux demandes non qualifiées. Jamais plus de 2 jours d’affilée sans demande.</p><div style="margin-top:12px">' + askLink('cpl', '', 'Qu’est-ce qui explique l’évolution du coût par demande ?') + '</div></div>' +
      '<div class="rule"><span class="idx">05</span><h2 class="h-sec">Campagnes</h2><span class="meta"><label><span class="sr">Filtrer par état</span><select class="select" id="campF" style="height:32px"><option value="">Tous les états</option>' + Object.keys(cst).map(function (k) { return '<option value="' + k + '"' + (S.campF === k ? ' selected' : '') + '>' + cst[k][1] + '</option>'; }).join('') + '</select></label></span></div>' +
      (C.length ? '<div class="table-wrap"><div class="table-scroll"><table><thead><tr>' + cth('nom', 'Campagne') + '<th>État</th>' + cth('depense', 'Dépensé', 1) + cth('n', 'Demandes', 1) + cth('cpl', 'Coût par demande', 1) + cth('q', 'Qualifiées', 1) + '<th class="r">Rendez-vous</th><th class="r">Ventes</th></tr></thead><tbody>' +
        C.map(function (x) { return '<tr class="row" tabindex="0" data-camp="' + x.c.id + '"><td><b style="font-weight:500">' + esc(x.c.nom) + '</b><span class="two">' + esc(x.c.objectif) + '</span></td><td>' + state(cst[x.c.statut][0], cst[x.c.statut][1]) + '</td><td class="r">' + eur(x.dep) + '</td><td class="r">' + x.n + '</td><td class="r">' + eur(x.cpl) + '</td><td class="r">' + x.q + '</td><td class="r">' + x.rdv + '</td><td class="r">' + x.won + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="mlist">' + C.map(function (x) { return '<a class="mitem" href="#/performance/' + x.c.id + '"><div class="l1"><span>' + esc(x.c.nom) + '</span></div><div class="l3"><span>' + state(cst[x.c.statut][0], cst[x.c.statut][1]) + '</span><span class="num">' + x.n + ' demandes · ' + eur(x.cpl) + '</span></div></a>'; }).join('') + '</div></div>'
        : '<div class="table-wrap empty"><h3>Aucune campagne dans cet état</h3><p>Choisissez « Tous les états » pour tout voir.</p></div>');
  }
  function openCamp(id) {
    var c = D.campagnes.find(function (x) { return x.id === id; }); if (!c) return;
    var cst = { active: ['ok', 'Active'], apprentissage: ['est', 'En apprentissage'], pause: ['unk', 'En pause'], erreur: ['err', 'En erreur'] }[c.statut];
    $('#sheet').innerHTML = '<div class="sh-h"><div style="flex:1"><span class="lab">Campagne · ' + state(cst[0], cst[1]) + '</span><h2>' + esc(c.nom) + '</h2><div class="small muted">' + esc(c.objectif) + '</div></div><button class="btn icon ghost" id="sh-x" aria-label="Fermer">' + ic('x') + '</button></div><div class="sh-b">' +
      sec('Chiffres', '<dl class="kv"><dt>Budget</dt><dd>' + (c.budgetJour ? eur(c.budgetJour) + ' par jour' : 'En pause') + '</dd><dt>Dépensé</dt><dd class="num">' + eur(c.depense) + '</dd><dt>Impressions</dt><dd class="num">' + nf(c.impressions) + '</dd><dt>Clics</dt><dd class="num">' + nf(c.clics) + '</dd><dt>Demandes</dt><dd class="num">' + c.formulaires + '</dd><dt>Coût par demande</dt><dd class="num">' + eur(c.depense / c.formulaires) + '</dd></dl>') +
      sec('Publicités les plus efficaces', '<ul class="tl">' + c.creas.map(function (x) { return '<li><span>' + esc(x.nom) + '<span class="by">' + x.leads + (x.leads > 1 ? ' demandes' : ' demande') + '</span></span><span class="num">' + eur(x.cpl) + ' par demande</span></li>'; }).join('') + '</ul>') +
      sec('Changements effectués par Orixen', '<ul class="tl">' + c.changements.map(function (x) { return '<li><span>' + esc(x.txt) + '<span class="by">Pourquoi : ' + esc(x.pourquoi) + '</span><span class="by">' + esc(x.par) + '</span></span><time>' + dt(x.at) + '</time></li>'; }).join('') + '</ul>') +
      sec('Prochaine action recommandée', '<p style="font-weight:500">' + esc(c.reco.txt) + '</p><p class="small t2" style="margin-top:4px">' + esc(c.reco.pourquoi) + '</p><dl class="kv" style="margin-top:12px"><dt>Confiance</dt><dd>' + esc(c.reco.confiance) + '</dd><dt>Données manquantes</dt><dd>' + esc(c.reco.manque) + '</dd><dt>État</dt><dd>' + (c.reco.etat === 'Réalisée' ? state('confirmed', 'Réalisée') : c.reco.etat === 'À valider par vous' ? state('act', 'Votre validation est attendue') : state('est', 'Proposée · rien à faire')) + '</dd></dl>' + (c.reco.etat === 'À valider par vous' ? '<div style="display:flex;gap:8px;margin-top:16px"><button class="btn pri" id="reco-ok">Valider</button><a class="btn" href="#/equipe">En parler à Marcus</a></div>' : '')) +
      '<div style="margin-top:20px">' + askLink('cpl', '', 'Qu’est-ce qui explique l’évolution du coût par demande ?') + '</div></div>';
    $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); $('#sh-x').onclick = closeSheet; $('#sh-x').focus();
    var ok = $('#reco-ok'); if (ok) ok.onclick = function () { save(this, function () { c.reco.etat = 'Réalisée'; D.decisions.unshift({ at: new Date().toISOString(), txt: 'Validé : ' + c.reco.txt, par: 'Julien' }); openCamp(id); }, 'Décision transmise à Marcus'); };
    bindCommon($('#sheet'));
  }
  function bindPerf() {
    var f = $('#campF'); if (!f) return;
    f.onchange = function () { S.campF = this.value; render(); };
    $$('[data-csort]').forEach(function (b) { b.onclick = function () { var k = b.dataset.csort; S.campSort = { k: k, dir: S.campSort.k === k ? -S.campSort.dir : -1 }; render(); }; });
    $$('[data-camp]').forEach(function (r) { r.onclick = function () { location.hash = '#/performance/' + r.dataset.camp; }; r.onkeydown = function (e) { if (e.key === 'Enter') r.onclick(); }; });
    bindChart('ch1');
  }
  function lineChart(id) {
    var s = D.serie, W = 960, H = 240, pl = 32, pr = 12, pt = 12, pb = 28, max = 3;
    var x = function (i) { return pl + i * (W - pl - pr) / (s.length - 1); }, y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var path = function (k) { return s.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[k]).toFixed(1); }).join(' '); };
    var g = '';
    for (var v = 0; v <= max; v++) g += '<line class="g" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="ax" x="' + (pl - 10) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    [0, 7, 14, 21, 29].forEach(function (i) { g += '<text class="ax" x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + dd(s[i].date) + '</text>'; });
    return '<div class="legend"><span><i style="background:var(--s1)"></i>Demandes reçues</span><span><i style="background:var(--s2)"></i>Demandes qualifiées</span><span class="muted">Axe vertical : demandes par jour</span></div><svg class="chart" id="' + id + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Demandes reçues et qualifiées par jour sur 30 jours">' + g +
      '<path class="l1" d="' + path('recus') + '"/><path class="l2" d="' + path('qualifies') + '"/><line id="' + id + '-x" stroke="var(--text-3)" stroke-dasharray="3 3" y1="' + pt + '" y2="' + (H - pb) + '" opacity="0"/><rect x="' + pl + '" y="0" width="' + (W - pl - pr) + '" height="' + H + '" fill="transparent" data-w="' + W + '" data-pl="' + pl + '" data-pr="' + pr + '"/></svg>' +
      '<details style="margin-top:8px"><summary class="small link" style="cursor:pointer">Voir les données en tableau</summary><div class="table-scroll"><table><thead><tr><th>Jour</th><th class="r">Reçues</th><th class="r">Qualifiées</th></tr></thead><tbody>' + s.map(function (p) { return '<tr><td>' + dd(p.date, { weekday: 'short', day: 'numeric', month: 'short' }) + '</td><td class="r">' + p.recus + '</td><td class="r">' + p.qualifies + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
  }
  function bindChart(id) {
    var svg = document.getElementById(id); if (!svg) return;
    var r = svg.querySelector('rect'), line = document.getElementById(id + '-x'), tip = $('#tip'), s = D.serie;
    var mv = function (e) {
      var b = svg.getBoundingClientRect(), W = +r.dataset.w, pl = +r.dataset.pl, pr = +r.dataset.pr, p = e.touches ? e.touches[0] : e;
      var i = Math.max(0, Math.min(s.length - 1, Math.round((((p.clientX - b.left) / b.width * W) - pl) / (W - pl - pr) * (s.length - 1))));
      var xx = pl + i * (W - pl - pr) / (s.length - 1); line.setAttribute('x1', xx); line.setAttribute('x2', xx); line.setAttribute('opacity', 1);
      tip.innerHTML = '<b>' + day(s[i].date) + '</b><div><span>Demandes reçues</span><span class="num">' + s[i].recus + '</span></div><div><span>Demandes qualifiées</span><span class="num">' + s[i].qualifies + '</span></div>';
      tip.style.left = Math.min(p.clientX + 14, innerWidth - 190) + 'px'; tip.style.top = (p.clientY - 72) + 'px'; tip.classList.add('on');
    };
    var lv = function () { line.setAttribute('opacity', 0); tip.classList.remove('on'); };
    r.addEventListener('mousemove', mv); r.addEventListener('touchmove', mv, { passive: true }); r.addEventListener('mouseleave', lv); r.addEventListener('touchend', lv);
  }

  /* rapport éditorial */
  function vReport() {
    var m = M(), R = range();
    var types = { jour: 'Point du jour', semaine: 'Bilan de la semaine', mois: 'Rapport mensuel' };
    var body = {
      jour: [['Objectif', 'Rappeler chaque nouvelle demande dans l’heure et confirmer les rendez-vous du lendemain.'], ['Résultats réels', '3 nouvelles demandes aujourd’hui. 1 rendez-vous à confirmer pour demain.'], ['Évolution', 'Hier : 1 demande. Aujourd’hui : 3, à budget constant.'], ['Résultats commerciaux confirmés', 'Aucune nouvelle vente déclarée aujourd’hui.'], ['Ce que nous avons appris', 'Les 3 demandes viennent de la vidéo de Julien.']],
      semaine: [['Objectif', 'Atteindre 15 demandes qualifiées avant le 1er novembre, coût par demande qualifiée sous 60 €.'], ['Résultats réels', '6 demandes reçues, 4 qualifiées, 2 rendez-vous, 1 vente conclue (4 100 €).'], ['Évolution', 'Coût par demande qualifiée en hausse : l’explication détaillée est dans Performance.'], ['Résultats commerciaux confirmés', '3 ventes déclarées sur la période. 1 devis de 22 400 € en attente.'], ['Ce que nous avons appris', 'Les vidéos tournées sur chantier coûtent 3 fois moins cher par demande qualifiée que les photos.']],
      mois: [['Objectif', 'Lancer la zone d’Issoire et atteindre la garantie de 15 demandes qualifiées.'], ['Résultats réels', m.n + ' demandes reçues, ' + m.q + ' qualifiées, ' + m.won + ' ventes conclues pour ' + eur(m.ca) + '.'], ['Évolution', 'Première période complète : la comparaison avec septembre porte sur 19 jours seulement.'], ['Résultats commerciaux confirmés', eur(m.ca) + ' signés et déclarés. Devis en cours : 54 700 € (non signés, non comptés).'], ['Ce que nous avons appris', 'La réfection complète est le segment le plus rentable. La campagne réparations est encore en apprentissage.']]
    }[S.rep];
    var actions = [['Mettre en ligne la deuxième vidéo', 'Marcus', 'jeudi 29 octobre'], ['Renseigner le résultat du rendez-vous de Sandrine Aubert', 'Julien', 'vendredi 30 octobre'], ['Décider de la reprise de l’isolation', 'Julien et Marcus', 'février 2027']];
    return '<div class="ph no-print"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Rapport</h1><div class="sub">Composé pour être présenté à un associé sans retouche</div></div><div class="acts"><div class="seg" role="group" aria-label="Type de rapport">' + Object.keys(types).map(function (k) { return '<button data-rep="' + k + '" aria-pressed="' + (S.rep === k) + '">' + types[k] + '</button>'; }).join('') + '</div><button class="btn" id="pdf">' + ic('dl', 16) + 'PDF</button><button class="btn" id="share">Partager</button></div></div>' +
      '<article class="report"><div class="rh"><div><span class="lab">' + types[S.rep] + ' · ' + esc(D.entreprise) + '</span><h1>' + (S.rep === 'mois' ? 'Octobre 2026' : S.rep === 'semaine' ? 'Semaine du 19 au 25 octobre' : day(NOW.toISOString())) + '</h1><p class="small muted" style="margin-top:4px">Préparé par Marcus Verhaar, Orixen · ' + R.full + ' · données ' + MAJ + '</p></div><img src="/assets/icon-192.png" alt="Orixen" width="32" height="32" style="border-radius:7px"></div>' +
      '<div class="rk"><div><span class="lab">Demandes reçues</span><b class="num">' + m.n + '</b></div><div><span class="lab">Qualifiées</span><b class="num">' + m.q + '</b></div><div><span class="lab">Rendez-vous confirmés</span><b class="num">' + m.conf + '</b></div><div><span class="lab">Ventes conclues</span><b class="num">' + m.won + '</b></div></div>' +
      body.map(function (b) { return '<h2>' + b[0] + '</h2><p>' + esc(b[1]) + '</p>'; }).join('') +
      '<h2>Limites des données</h2><ul><li>Les ventes sont déclarées par votre équipe : ' + (m.noRes ? m.noRes + ' rendez-vous réalisé n’a pas encore de résultat.' : 'tous les rendez-vous ont un résultat.') + '</li><li>Le chiffre d’affaires attribué n’est ni incrémental, ni une marge.</li><li>La mesure des conversions Meta est en cours de vérification depuis ce matin.</li></ul>' +
      '<h2>Prochaines actions</h2><ul>' + actions.map(function (a) { return '<li><b style="color:var(--text);font-weight:500">' + esc(a[0]) + '</b> · ' + esc(a[1]) + ' · ' + esc(a[2]) + '</li>'; }).join('') + '</ul></article>';
  }
  function bindReport() {
    $$('[data-rep]').forEach(function (b) { b.onclick = function () { S.rep = b.dataset.rep; render(); }; });
    var p = $('#pdf'); if (p) p.onclick = function () { window.print(); };
    var s = $('#share'); if (s) s.onclick = function () { confirmModal('Partager ce rapport', 'Sophie Martin (associée, droit de lecture) recevra un lien vers ce rapport. Elle ne pourra rien modifier.', 'Partager', function () {}); };
  }

  /* ════════ 4 · RENDEZ-VOUS ════════ */
  function vRdv() {
    var R = D.leads.filter(function (l) { return l.rdv; });
    var up = R.filter(function (l) { return new Date(l.rdv.at) > NOW; }).length;
    var mob = innerWidth <= 720;
    var view = mob ? 'list' : S.rdvView;
    var h = '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Rendez-vous</h1><div class="sub">' + up + ' à venir · heure de Paris (UTC+1) · modifications et annulations historisées dans chaque fiche</div></div><div class="acts">' + (mob ? '' : '<div class="seg" role="group" aria-label="Affichage"><button data-rv="cal" aria-pressed="' + (view === 'cal') + '">Calendrier</button><button data-rv="list" aria-pressed="' + (view === 'list') + '">Liste</button></div>') + '<a class="btn" href="#/parametres?s=integr">' + ic('cal', 16) + 'Synchroniser mon agenda</a></div></div>';
    if (view === 'cal') {
      var start = new Date(NOW); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + S.week * 7);
      var days = []; for (var i = 0; i < 7; i++) { var x = new Date(start); x.setDate(x.getDate() + i); days.push(x); }
      var cal = '<div class="toolbar"><button class="btn icon" data-wk="-1" aria-label="Semaine précédente">' + ic('left') + '</button><button class="btn" data-wk="0">Cette semaine</button><button class="btn icon" data-wk="1" aria-label="Semaine suivante">' + ic('right') + '</button><span class="small t2" style="margin-left:8px">Semaine du ' + dd(days[0].toISOString(), { day: 'numeric', month: 'long' }) + ' au ' + dd(days[6].toISOString(), { day: 'numeric', month: 'long' }) + '</span></div><div class="cal"><div class="hd"></div>' +
        days.map(function (d) { var today = d.toDateString() === NOW.toDateString(); return '<div class="hd' + (today ? ' today' : '') + '">' + d.toLocaleDateString('fr-FR', { weekday: 'short' }) + '<b>' + d.getDate() + '</b></div>'; }).join('');
      var count = 0;
      for (var hh = 8; hh <= 19; hh++) {
        cal += '<div class="hr">' + hh + 'h</div>';
        days.forEach(function (d) {
          var ev = R.filter(function (l) { var t = new Date(l.rdv.at); return t.toDateString() === d.toDateString() && t.getHours() === hh; });
          count += ev.length;
          cal += '<div class="cell">' + ev.map(function (l) { var k = { 'Confirmé': 'ok', 'Honoré': 'ok', 'À confirmer': 'warn', 'Absent': 'err' }[l.rdv.statut] || ''; return '<button class="ev ' + k + '" data-open="' + l.id + '" aria-label="' + esc(l.nom + ', ' + hm(l.rdv.at) + ', ' + rdvLabel(l.rdv.statut)) + '"><b>' + esc(l.nom) + '</b>' + hm(l.rdv.at) + ' · ' + rdvLabel(l.rdv.statut) + '</button>'; }).join('') + '</div>';
        });
      }
      return h + cal + '</div>' + (count ? '' : '<p class="small t2" style="margin-top:12px">Aucun rendez-vous cette semaine. Utilisez les flèches pour changer de semaine.</p>') + '<div class="legend" style="margin-top:12px">' + ['Confirmé', 'À confirmer', 'Réalisé', 'Absent', 'Annulé'].map(function (s) { return state(RDV[s === 'Réalisé' ? 'Honoré' : s], s); }).join('') + '</div>';
    }
    var L = R.slice(); var k = { date: function (l) { return new Date(l.rdv.at).getTime(); }, statut: function (l) { return l.rdv.statut; }, resp: function (l) { return user(l.resp).nom; } }[S.rdvSort.k];
    L.sort(function (a, b) { var x = k(a), y = k(b); return (x > y ? 1 : x < y ? -1 : 0) * S.rdvSort.dir; });
    var th = function (kk, lab) { var on = S.rdvSort.k === kk; return '<th' + (on ? ' aria-sort="' + (S.rdvSort.dir > 0 ? 'ascending' : 'descending') + '"' : '') + '><button data-rsort="' + kk + '">' + lab + ic(on ? (S.rdvSort.dir > 0 ? 'up' : 'down') : 'sort', 14) + '</button></th>'; };
    var actions = function (l) { var fut = new Date(l.rdv.at) > NOW; return (fut && l.rdv.statut === 'À confirmer' && !l.rdv.sms ? '<button class="btn" data-confirm="' + l.id + '">Demander confirmation</button> ' : '') + (!fut && l.rdv.statut === 'Honoré' && l.etape === 'rdv_fait' ? '<a class="btn" href="#/opportunites/' + l.id + '?resultat">Résultat</a> ' : ''); };
    return h + '<div class="table-wrap"><div class="table-scroll"><table><thead><tr><th>Prospect</th>' + th('date', 'Date et heure') + '<th>Projet</th>' + th('resp', 'Responsable') + th('statut', 'Statut') + '<th class="r"><span class="sr">Actions</span></th></tr></thead><tbody>' +
      L.map(function (l) { return '<tr><td><b style="font-weight:500">' + esc(l.nom) + '</b><span class="two">' + esc(l.ville) + '</span></td><td class="num">' + dd(l.rdv.at, { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + hm(l.rdv.at) + '</td><td>' + esc(l.travaux) + '</td><td>' + esc(user(l.resp).nom) + '</td><td>' + state(RDV[l.rdv.statut], rdvLabel(l.rdv.statut)) + (l.rdv.sms ? '<span class="two">SMS envoyé · en attente de réponse</span>' : '') + '</td><td class="r" style="white-space:nowrap">' + actions(l) + '<a class="link" href="#/opportunites/' + l.id + '">Ouvrir</a></td></tr>'; }).join('') +
      '</tbody></table></div><div class="mlist">' + L.map(function (l) { return '<div class="mitem"><a href="#/opportunites/' + l.id + '" style="display:block"><div class="l1"><span>' + esc(l.nom) + '</span><span class="num">' + hm(l.rdv.at) + '</span></div><div class="l2">' + day(l.rdv.at) + ' · ' + esc(l.travaux) + '</div></a><div class="l3">' + state(RDV[l.rdv.statut], rdvLabel(l.rdv.statut) + (l.rdv.sms ? ' · SMS envoyé' : '')) + '<span>' + actions(l) + '</span></div></div>'; }).join('') + '</div></div>';
  }
  function bindRdv() {
    $$('[data-rv]').forEach(function (b) { b.onclick = function () { S.rdvView = b.dataset.rv; render(); }; });
    $$('[data-wk]').forEach(function (b) { b.onclick = function () { var v = +b.dataset.wk; S.week = v === 0 ? 0 : S.week + v; render(); }; });
    $$('[data-open]').forEach(function (b) { b.onclick = function () { location.hash = '#/opportunites/' + b.dataset.open; }; });
    $$('[data-rsort]').forEach(function (b) { b.onclick = function () { var k = b.dataset.rsort; S.rdvSort = { k: k, dir: S.rdvSort.k === k ? -S.rdvSort.dir : 1 }; render(); }; });
    $$('[data-confirm]').forEach(function (b) { b.onclick = function () { var l = lead(b.dataset.confirm); save(b, function () { l.rdv.sms = true; logEvent(l, 'Demande de confirmation envoyée par SMS'); render(); }, 'SMS envoyé · la confirmation s’affichera à la réponse du prospect'); }; });
  }

  /* ════════ 5 · SYSTÈME ════════ */
  function vSys() {
    var counts = {}; D.systeme.forEach(function (c) { counts[c.etat] = (counts[c.etat] || 0) + 1; });
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Système</h1><div class="sub">Ce qui est réellement testé : toutes les 15 minutes, un formulaire de test est envoyé et suivi jusqu’au SMS reçu.</div></div><div class="acts"><button class="btn" id="recheck">' + ic('chk', 16) + 'Relancer une vérification</button></div></div>' +
      '<p class="t2" style="margin-bottom:16px;display:flex;flex-wrap:wrap;gap:8px 24px">' + Object.keys(SYS).filter(function (k) { return counts[k]; }).map(function (k) { return state(SYS[k][0], counts[k] + ' · ' + SYS[k][1].toLowerCase()); }).join('') + '</p>' +
      '<div class="rule"><span class="idx">01</span><h2 class="h-sec">Intégrations</h2><span class="meta">' + D.systeme.length + ' éléments suivis</span></div>' +
      '<div class="panel list">' + D.systeme.map(function (c) {
        return '<div class="sys"><div><h4>' + esc(c.nom) + '</h4><p class="d">' + esc(c.desc) + '</p><div style="margin-top:8px">' + state(SYS[c.etat][0], SYS[c.etat][1]) + '</div></div>' +
          '<dl><dt>Vérifié</dt><dd>' + (c.etat === 'unknown' ? 'Impossible à vérifier' : ago(c.verif)) + '</dd><dt>Dernière synchro</dt><dd>' + (c.sync ? ago(c.sync) : 'Aucune') + '</dd><dt>Dernière erreur</dt><dd>' + esc(c.err || 'Aucune') + '</dd></dl>' +
          '<dl><dt>Pour vous</dt><dd>' + esc(c.conseq) + '</dd><dt>Action</dt><dd>' + esc(c.action) + '</dd>' + (c.incident && !c.incident.resolu ? '<dt>Confirmé</dt><dd>' + esc(c.incident.confirme) + '</dd><dt>En analyse</dt><dd>' + esc(c.incident.enquete) + '</dd><dt>Responsable</dt><dd>' + esc(c.incident.par) + '</dd>' : '') + '<dt>Procédure</dt><dd class="muted">' + esc(c.proc) + '</dd></dl></div>';
      }).join('') + '</div>' +
      '<div class="rule"><span class="idx">02</span><h2 class="h-sec">Historique des incidents</h2><span class="meta">30 derniers jours</span></div><div class="panel list">' + D.systeme.filter(function (c) { return c.incident; }).map(function (c) { return '<div class="task"><div><h4>' + esc(c.incident.txt) + '</h4><p>' + esc(c.nom) + ' · ouvert ' + dt(c.incident.at) + ' · responsable ' + esc(c.incident.par) + '</p></div>' + (c.incident.resolu ? state('confirmed', 'Résolu ' + dt(c.incident.resolu)) : state('warn', 'En cours')) + '</div>'; }).join('') + '</div>';
  }
  function bindSys() {
    var b = $('#recheck'); if (!b) return;
    b.onclick = function () { var btn = this; btn.classList.add('loading'); setTimeout(function () { btn.classList.remove('loading'); D.systeme.forEach(function (c) { if (c.etat !== 'unknown') c.verif = NOW.toISOString(); }); render(); toast('Vérification terminée · aucun nouveau problème'); }, 1200); };
  }

  /* ════════ 6 · ÉQUIPE ORIXEN ════════ */
  function vTeam() {
    var E = D.equipe, stK = { 'Terminé': 'confirmed', 'En cours': 'act', 'Proposé': 'est', 'Résolue': 'confirmed', 'Reçue': 'est' };
    var taskList = function (arr) { return '<div class="panel list">' + arr.map(function (t) { return '<div class="task"><div><h4>' + esc(t.txt) + '</h4><p>' + esc(t.resp) + ' · ' + dd(t.date, { weekday: 'long', day: 'numeric', month: 'long' }) + (t.attendu ? ' · résultat attendu : ' + esc(t.attendu.charAt(0).toLowerCase() + t.attendu.slice(1)) : '') + '</p></div>' + state(stK[t.statut], t.statut) + '</div>'; }).join('') + '</div>'; };
    var replies = []; D.demandes.forEach(function (d) { (d.commentaires || []).forEach(function (c) { if (c.de === 'Marcus Verhaar') replies.push({ d: d, c: c }); }); });
    replies.sort(function (a, b) { return new Date(b.c.at) - new Date(a.c.at); });
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Équipe Orixen</h1><div class="sub">Responsable de compte : Marcus Verhaar · réponse le jour même, prévue au contrat</div></div><div class="acts"><a class="btn" href="tel:' + D.contact.tel + '">' + ic('phone', 16) + D.contact.telAff + '</a><a class="btn" href="mailto:' + D.contact.email + '">' + ic('msg', 16) + 'E-mail</a></div></div>' +
      '<div class="grid g-main"><div>' +
        '<div class="rule" style="margin-top:0"><span class="idx">01</span><h2 class="h-sec">En attente côté Orixen</h2><span class="meta">' + E.orixen.length + ' actions</span></div>' + taskList(E.orixen) +
        '<div class="rule"><span class="idx">02</span><h2 class="h-sec">En attente de votre côté</h2><span class="meta">' + E.client.length + ' actions</span></div>' + taskList(E.client) +
        '<div class="rule"><span class="idx">03</span><h2 class="h-sec">Demandes de support</h2><button class="btn" id="new-req">Nouvelle demande</button></div>' +
        '<div id="req-form" hidden class="panel pad form" style="margin-bottom:16px"><div class="field"><label for="rq-cat">Catégorie</label><select id="rq-cat">' + ['Campagnes publicitaires', 'Qualité des prospects', 'CRM', 'Automatisations', 'Facturation', 'Stratégie', 'Incident technique'].map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div><div class="field"><label for="rq-p">Priorité</label><select id="rq-p"><option>Normale</option><option>Haute</option><option>Basse</option></select></div><div class="field" id="rq-f"><label for="rq-t">Votre demande</label><textarea id="rq-t"></textarea><span class="err" id="rq-err" hidden></span></div><div><button class="btn pri" id="rq-send">Envoyer la demande</button></div></div>' +
        '<div class="panel list">' + D.demandes.slice().reverse().map(function (d) { return '<details class="req"' + (S.team[d.id] ? ' open' : '') + ' data-req="' + d.id + '"><summary><div><b style="font-weight:500">' + esc(d.titre) + '</b><div class="small muted">' + d.id + ' · ' + esc(d.cat) + ' · priorité ' + esc(d.prio.toLowerCase()) + ' · ' + esc(d.resp) + ' · mise à jour ' + ago(d.maj) + '</div></div>' + state(stK[d.statut] || 'act', d.statut) + '</summary><div class="body">' + (d.commentaires || []).map(function (c) { return '<div class="cmt"><span class="by">' + esc(c.de) + ' · ' + dt(c.at) + '</span><div>' + esc(c.txt) + '</div></div>'; }).join('') + '<div class="field" style="margin-top:12px"><label for="r-' + d.id + '">Répondre sur ce sujet</label><input id="r-' + d.id + '" placeholder="Votre réponse"></div><button class="btn" data-reply="' + d.id + '" style="margin-top:8px">Envoyer</button></div></details>'; }).join('') + '</div>' +
      '</div><div>' +
        '<div class="rule" style="margin-top:0"><span class="idx">04</span><h2 class="h-sec">Responsable du compte</h2><span class="meta"></span></div><div class="panel pad"><div class="am" style="padding:0"><span class="av" style="width:40px;height:40px">MV</span><div style="display:block"><b>Marcus Verhaar</b><span>Responsable de compte · Orixen</span></div></div><p class="small t2" style="margin-top:12px">' + D.contact.delai + '.</p></div>' +
        '<div class="rule"><span class="idx">05</span><h2 class="h-sec">Dernières réponses</h2><span class="meta"></span></div><div class="panel list">' + replies.slice(0, 3).map(function (r) { return '<a class="task" href="#/equipe" data-openreq="' + r.d.id + '"><div><h4>' + esc(r.d.titre) + '</h4><p>' + esc(r.c.txt.length > 80 ? r.c.txt.slice(0, 79) + '…' : r.c.txt) + '</p></div><time class="small muted">' + ago(r.c.at) + '</time></a>'; }).join('') + '</div>' +
        '<div class="rule"><span class="idx">06</span><h2 class="h-sec">Prochains jalons</h2><span class="meta"></span></div><div class="panel list">' + E.jalons.map(function (j) { return '<div class="task"><div><h4>' + esc(j.txt) + '</h4><p>' + dd(j.date, { weekday: 'long', day: 'numeric', month: 'long' }) + '</p></div>' + state(stK[j.statut], j.statut) + '</div>'; }).join('') + '</div>' +
        '<div class="rule"><span class="idx">07</span><h2 class="h-sec">Décisions importantes</h2><span class="meta"></span></div><div class="panel pad"><ul class="tl">' + D.decisions.map(function (d) { return '<li><span>' + esc(d.txt) + '<span class="by">' + esc(d.par) + '</span></span><time>' + dd(d.at) + '</time></li>'; }).join('') + '</ul></div>' +
      '</div></div>';
  }
  function bindTeam() {
    var b0 = $('#new-req'); if (!b0) return;
    b0.onclick = function () { $('#req-form').hidden = !$('#req-form').hidden; if (!$('#req-form').hidden) $('#rq-t').focus(); };
    $('#rq-send').onclick = function () {
      var t = $('#rq-t').value.trim();
      if (t.length < 10) { var e = $('#rq-err'); e.innerHTML = ic('err', 13) + 'Décrivez votre demande en une phrase au moins.'; e.hidden = false; $('#rq-f').classList.add('has-err'); $('#rq-t').focus(); return; }
      save(this, function () { D.demandes.push({ id: 'D-' + (124 + D.demandes.length), cat: $('#rq-cat').value, titre: t.slice(0, 80), statut: 'Reçue', prio: $('#rq-p').value, resp: 'Marcus', maj: new Date().toISOString(), commentaires: [{ at: new Date().toISOString(), de: 'Julien Martin', txt: t }] }); render(); }, 'Demande envoyée · réponse le jour même');
    };
    $$('details.req').forEach(function (d) { d.ontoggle = function () { S.team[d.dataset.req] = d.open; }; });
    $$('[data-reply]').forEach(function (b) { b.onclick = function () { var id = b.dataset.reply, v = $('#r-' + id).value.trim(); if (!v) { $('#r-' + id).focus(); return; } var d = D.demandes.find(function (x) { return x.id === id; }); save(b, function () { d.commentaires = d.commentaires || []; d.commentaires.push({ at: new Date().toISOString(), de: 'Julien Martin', txt: v }); d.maj = new Date().toISOString(); S.team[id] = true; render(); }, 'Réponse envoyée'); }; });
    $$('[data-openreq]').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var id = a.dataset.openreq; S.team[id] = true; render(); var el = $('[data-req="' + id + '"]'); if (el) el.scrollIntoView({ block: 'center' }); }; });
  }

  /* ════════ 7 · PARAMÈTRES ════════ */
  var SETS = [['entreprise', 'Entreprise et coordonnées'], ['users', 'Utilisateurs et rôles'], ['notif', 'Notifications'], ['integr', 'Connexions et intégrations'], ['affichage', 'Préférences d’affichage'], ['secu', 'Sécurité et sessions'], ['donnees', 'Confidentialité et données'], ['factu', 'Facturation et documents']];
  function vSet() {
    var r = function (a, b, c) { return '<div class="srow"><div><h4>' + a + '</h4><p>' + b + '</p></div>' + (c || '') + '</div>'; };
    var sw = function (on, lab) { return '<button class="switch" role="switch" data-sw="' + esc(lab) + '" aria-checked="' + on + '" aria-label="' + esc(lab) + '"></button>'; };
    var grp = function (t, s) { return '<div class="pad" style="padding-bottom:4px"><h3 class="h-sec" style="font-size:15px">' + t + '</h3>' + (s ? '<p class="small muted">' + s + '</p>' : '') + '</div>'; };
    if (!SETS.some(function (s) { return s[0] === S.set; })) S.set = 'entreprise';
    var cur = S.set, body = '';
    if (cur === 'entreprise') body = r('Raison sociale', 'Toitures Martin SARL') + r('Adresse', '12 rue des Couvreurs, 63500 Issoire') + r('SIRET', '000 000 000 00000 (exemple)') + r('Métier', D.metier) + r('Zone exclusive', D.zone.join(', ')) + r('Panier moyen indicatif', '18 000 € pour une réfection complète') + r('Taux de marge moyen', 'Non renseigné · nécessaire pour calculer une rentabilité', '<button class="btn" data-todo>Renseigner</button>') + r('Configuration du compte', 'Le parcours de démarrage en 5 étapes', '<a class="btn" href="#/bienvenue">Ouvrir</a>');
    if (cur === 'users') body = D.users.map(function (u) { return r(u.nom, u.role + ' · ' + u.email, state('confirmed', 'Actif')); }).join('') + '<div class="pad"><div class="table-scroll"><table><thead><tr><th>Droit</th><th>Dirigeant</th><th>Commercial</th><th>Associé</th></tr></thead><tbody>' +
      [['Voir ses demandes', 1, 1, 1], ['Voir toutes les demandes', 1, 0, 1], ['Modifier les statuts', 1, 1, 0], ['Voir les coordonnées des prospects', 1, 1, 0], ['Voir dépenses et rapports', 1, 0, 1], ['Gérer la facturation', 1, 0, 0], ['Gérer les connexions publicitaires', 1, 0, 0], ['Gérer les utilisateurs', 1, 0, 0]].map(function (x) { return '<tr><td>' + x[0] + '</td>' + x.slice(1).map(function (v) { return '<td>' + (v ? state('confirmed', 'Oui') : '<span class="muted">Non</span>') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><p class="small muted" style="margin-top:12px">Dans la version connectée, ces droits sont appliqués par le serveur, pas seulement masqués à l’écran.</p><button class="btn" style="margin-top:12px" data-todo>Inviter un utilisateur</button></div>';
    if (cur === 'notif') body = grp('Urgentes', 'SMS et notification de l’application') + r('Nouvelle demande qualifiée', 'Dans la minute', sw(true, 'Nouvelle demande qualifiée')) + r('Demande sans suivi depuis 24 h', 'Une fois par demande', sw(true, 'Demande sans suivi')) + r('Erreur de transmission', 'Dès la détection', sw(true, 'Erreur de transmission')) +
      grp('Informatives', 'E-mail') + r('Rendez-vous confirmé', 'À chaque confirmation', sw(true, 'Rendez-vous confirmé')) + r('Rapport disponible', 'Chaque dimanche', sw(true, 'Rapport disponible')) + r('Facture disponible', 'Chaque mois', sw(false, 'Facture disponible')) + r('Décision attendue', 'Quand Orixen a besoin de votre accord', sw(true, 'Décision attendue')) +
      grp('Commerciales', 'Désactivables à tout moment') + r('Conseils pour signer plus', 'Une fois par mois', sw(false, 'Conseils')) + r('Nouveautés Orixen', 'Nouvelles fonctions', sw(false, 'Nouveautés')) +
      grp('Horaires et confidentialité') + r('Heures calmes', 'Aucune notification non urgente de 21h à 7h', sw(true, 'Heures calmes')) + r('Écran verrouillé', 'Masquer le nom et le téléphone du prospect', sw(true, 'Masquer sur écran verrouillé'));
    if (cur === 'integr') body = [['Meta · Facebook et Instagram', 'Accès partenaire à votre page et à votre compte publicitaire', 'ok'], ['CRM Orixen', 'Demandes, statuts et historique', 'ok'], ['Messagerie SMS', 'Notifications et rappels', 'warn'], ['Google Agenda', 'Synchronisation de vos rendez-vous', 'unknown']].map(function (x) { return r(x[0], x[1], x[2] === 'unknown' ? '<button class="btn pri" data-gcal>Connecter</button>' : state(SYS[x[2]][0], SYS[x[2]][1])); }).join('');
    if (cur === 'affichage') { var th = store.get('cc-theme') || 'system'; body = '<div class="pad form"><div class="field"><span class="lab">Thème</span><div class="opts" role="group" aria-label="Thème">' + [['light', 'Clair'], ['dark', 'Sombre'], ['system', 'Selon l’appareil']].map(function (t) { return '<button data-theme="' + t[0] + '" aria-pressed="' + (th === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div></div><div class="field"><label for="def-p">Période par défaut</label><select id="def-p">' + periodOptions() + '</select></div></div>'; }
    if (cur === 'secu') body = r('Double authentification', 'Code par SMS sur chaque nouvel appareil', sw(true, 'Double authentification')) + r('iPhone de Julien', 'Safari · Issoire · actif maintenant', state('confirmed', 'Cette session')) + r('Ordinateur du bureau', 'Chrome · Issoire · il y a 2 j', '') + r('Déconnecter les autres sessions', 'Il faudra vous reconnecter sur ces appareils', '<button class="btn" id="kill">Déconnecter</button>');
    if (cur === 'donnees') body = r('Exporter mes données', 'Demandes, statuts et historique, au format CSV', '<button class="btn" id="exp2">Exporter</button>') + r('Rectification ou suppression', 'Pour un prospect qui exerce ses droits RGPD', '<button class="btn" id="del">Faire une demande</button>') + r('Traitement des données', 'Vous êtes responsable de traitement ; Orixen est sous-traitant (article 28 du RGPD)', '<a class="btn" href="/confidentialite/" target="_blank" rel="noopener">Lire</a>') +
      '<div class="pad"><h3 class="h-sec" style="font-size:15px;margin-bottom:8px">Historique d’Orixen Intelligence</h3><p class="small muted" style="margin-bottom:8px">Chaque action proposée par l’Intelligence, et qui l’a validée.</p><ul class="tl">' + (D.journal.filter(function (j) { return j.ia; }).map(function (j) { return '<li><span>' + esc(j.txt) + '<span class="by">' + esc(j.par) + '</span></span><time>' + dt(j.at) + '</time></li>'; }).join('') || '<li><span class="muted">Aucune action pour le moment.</span></li>') + '</ul></div><div class="pad"><h3 class="h-sec" style="font-size:15px;margin-bottom:8px">Journal des changements importants</h3><ul class="tl">' + D.journal.map(function (j) { return '<li><span>' + esc(j.txt) + '<span class="by">' + esc(j.par) + '</span></span><time>' + dt(j.at) + '</time></li>'; }).join('') + '</ul></div>';
    if (cur === 'factu') body = r('Formule', 'Partenaire fondateur · 2 500 € par mois · sans engagement', '<a class="btn" href="/conditions/" target="_blank" rel="noopener">Conditions</a>') + r('Coordonnées de facturation', 'Toitures Martin SARL · 12 rue des Couvreurs, 63500 Issoire', '<button class="btn" data-todo>Modifier</button>') + r('Prochain prélèvement', 'Suspendu tant que la garantie de démarrage n’est pas atteinte', state('est', 'Garantie en cours')) + r('Contrat signé', 'Le 2 octobre 2026', '<button class="btn" data-todo>Télécharger</button>') + r('Factures', 'Octobre 2026', '<button class="btn" data-todo>Voir</button>') + r('Budget publicitaire', 'Payé directement à Meta, avec votre carte. Orixen ne le touche jamais.', '');
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Paramètres</h1></div></div><div class="settings"><nav class="snav" aria-label="Sections">' + SETS.map(function (s) { return '<button data-set="' + s[0] + '" aria-current="' + (cur === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</nav><div><h2 class="h-sec" style="margin-bottom:16px">' + SETS.find(function (s) { return s[0] === cur; })[1] + '</h2><div class="panel list">' + body + '</div></div></div>';
  }
  function bindSet() {
    $$('[data-set]').forEach(function (b) { b.onclick = function () { S.set = b.dataset.set; if (location.hash.indexOf('?s=') > -1) history.replaceState(null, '', '#/parametres'); render(); }; });
    $$('[data-sw]').forEach(function (s) { s.onclick = function () { var on = s.getAttribute('aria-checked') !== 'true'; s.setAttribute('aria-checked', on); D.journal.unshift({ at: new Date().toISOString(), par: 'Vous', txt: '« ' + s.dataset.sw + ' » ' + (on ? 'activé' : 'désactivé') }); toast((on ? 'Activé' : 'Désactivé') + ' · enregistré à ' + nowHM()); }; });
    $$('button[data-theme]').forEach(function (b) { b.onclick = function () { setTheme(b.dataset.theme); render(); }; });
    var dp = $('#def-p'); if (dp) dp.onchange = function () { setPeriod(this.value); toast('Période par défaut enregistrée'); };
    var k = $('#kill'); if (k) k.onclick = function () { confirmModal('Déconnecter les autres sessions ?', 'L’ordinateur du bureau sera déconnecté. Il faudra s’y reconnecter avec le code de double authentification.', 'Déconnecter', function () { D.journal.unshift({ at: new Date().toISOString(), par: 'Vous', txt: 'Autres sessions déconnectées' }); }); };
    var dl = $('#del'); if (dl) dl.onclick = function () { confirmModal('Demande de suppression', 'Les données du prospect concerné seront supprimées de votre espace et du CRM sous 30 jours. Cette action est irréversible.', 'Envoyer la demande', function () { D.journal.unshift({ at: new Date().toISOString(), par: 'Vous', txt: 'Demande de suppression RGPD envoyée' }); }); };
    var ex = $('#exp2'); if (ex) ex.onclick = function () { location.hash = '#/opportunites?seg=all'; setTimeout(function () { var b = $('#export'); if (b) b.click(); }, 150); };
    $$('[data-todo]').forEach(function (b) { b.onclick = function () { toast('Disponible dans la version connectée'); }; });
    $$('[data-gcal]').forEach(function (b) { b.onclick = function () { var row = b.closest('.srow'); b.classList.add('loading'); setTimeout(function () { b.classList.remove('loading'); b.classList.add('err'); b.textContent = 'Réessayer'; var p = row.querySelector('p'); p.innerHTML = '<span class="state err">' + ic('err', 14) + 'Connexion refusée par Google</span> · l’autorisation a été annulée dans la fenêtre Google. Rien n’a été modifié. Réessayez et acceptez l’accès au calendrier.'; D.journal.unshift({ at: new Date().toISOString(), par: 'Vous', txt: 'Échec de connexion à Google Agenda (autorisation annulée)' }); }, 900); }; });
  }

  /* ════════ Configuration du compte ════════ */
  function vOnb() {
    var steps = ['Votre entreprise', 'Votre système d’acquisition', 'Votre équipe', 'Test de bout en bout', 'Validation finale'];
    var s = S.ob.step, d = S.ob.data;
    var f = function (k, lab, ph) { return '<div class="field"><label for="ob-' + k + '">' + lab + '</label><input id="ob-' + k + '" data-ob="' + k + '" value="' + esc(d[k] || '') + '" placeholder="' + esc(ph) + '"></div>'; };
    var chk = function (arr) { return '<div class="list">' + arr.map(function (x) { return '<div class="srow" style="padding:12px 0"><span>' + x[0] + '</span>' + state(x[1], x[2]) + '</div>'; }).join('') + '</div>'; };
    var body = [
      f('activites', 'Activités', 'Couverture, zinguerie') + f('zones', 'Communes desservies', 'Issoire, Perrier, Le Broc') + f('travaux', 'Types de travaux à recevoir', 'Réfection, réparation, gouttières') + f('panier', 'Panier moyen indicatif', '18 000 €') + f('capacite', 'Rendez-vous possibles par semaine', '6') + f('objectif', 'Objectif', 'Remplir le planning de janvier'),
      chk([['Compte publicitaire Meta', 'confirmed', 'Connecté'], ['Formulaire de demande', 'confirmed', 'Créé'], ['CRM Orixen', 'confirmed', 'Prêt'], ['Calendrier', 'act', 'À connecter']]),
      f('resp', 'Responsable des nouvelles demandes', 'Julien Martin') + f('users', 'Utilisateurs autorisés', 'Julien (dirigeant), Karim (commercial)') + f('tel', 'Téléphone de réception', '06 00 00 00 00') + f('rappel', 'Processus de rappel', 'Rappel dans l’heure, 3 tentatives'),
      chk([['Formulaire de test envoyé', 'confirmed', 'Testé'], ['Demande reçue dans le CRM', 'confirmed', 'Testé'], ['SMS reçu par le responsable', 'confirmed', 'Testé · 38 s'], ['SMS reçu par le prospect', 'confirmed', 'Testé'], ['Attribution et suivi', 'confirmed', 'Testé']]),
      chk([['Configuré : entreprise, zone, formulaire, CRM, notifications', 'confirmed', 'Fait'], ['Testé : le circuit complet en 38 secondes', 'confirmed', 'Fait'], ['Manquant : calendrier · Julien, d’ici jeudi', 'inc', 'Non bloquant'], ['Prochaine étape : publicités envoyées pour validation · Marcus, demain', 'act', 'À venir']]) + '<p class="small t2" style="margin-top:12px">Les campagnes ne sont mises en ligne qu’après ces vérifications et votre accord écrit.</p>'
    ][s];
    return '<div class="ph"><div><div class="lab">' + esc(D.entreprise) + '</div><h1>Configuration du compte</h1><div class="sub">Étape ' + (s + 1) + ' sur 5 · vos réponses sont enregistrées, vous pouvez reprendre plus tard</div></div></div>' +
      '<div style="max-width:720px"><ol style="list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:24px" aria-label="Progression">' + steps.map(function (x, i) { return '<li style="border-top:2px solid ' + (i <= s ? 'var(--text)' : 'var(--line-2)') + ';padding-top:8px;font-size:12px;color:' + (i === s ? 'var(--text)' : 'var(--text-3)') + '"' + (i === s ? ' aria-current="step"' : '') + '>' + x + '</li>'; }).join('') + '</ol>' +
      '<div class="panel pad"><h2 class="h-sec" style="margin-bottom:16px">' + steps[s] + '</h2><div class="form">' + body + '</div><div style="display:flex;justify-content:space-between;margin-top:24px"><button class="btn" id="ob-prev"' + (s ? '' : ' disabled') + '>Retour</button><button class="btn pri" id="ob-next">' + (s === 4 ? 'Valider la configuration' : 'Continuer') + '</button></div></div></div>';
  }
  function bindOnb() {
    $$('[data-ob]').forEach(function (i) { i.oninput = function () { S.ob.data[i.dataset.ob] = i.value; store.set('cc-ob', S.ob); }; });
    var p = $('#ob-prev'), n = $('#ob-next'); if (!n) return;
    p.onclick = function () { S.ob.step = Math.max(0, S.ob.step - 1); store.set('cc-ob', S.ob); render(); };
    n.onclick = function () { if (S.ob.step === 4) { save(this, function () { S.ob.done = true; store.set('cc-ob', S.ob); location.hash = '#/'; }, 'Configuration validée · Marcus est prévenu'); return; } S.ob.step++; store.set('cc-ob', S.ob); render(); };
  }

  /* ── Liaisons communes ── */
  function bindCommon(root) {
    $$('[data-proof]', root).forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); showProof(b); }; });
    $$('[data-ask]', root).forEach(function (b) { b.onclick = function () { answer(b); }; });
    $$('[data-period]', root).forEach(function (s) { s.onchange = function () { setPeriod(this.value); }; });
  }
  function setTheme(t) { store.set('cc-theme', t); var eff = t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t; document.documentElement.setAttribute('data-theme', eff); }

  /* menus de l'en-tête */
  function menus() {
    $('#bell-menu').innerHTML = D.notifs.map(function (n) { return '<a href="' + n.href + '">' + ic(n.type === 'warn' ? 'warn' : n.type === 'action' ? 'form' : 'info', 16) + '<span>' + esc(n.txt) + '<time>' + ago(n.at) + '</time></span></a>'; }).join('') + '<a href="#/parametres?s=notif">' + ic('gear', 16) + '<span>Régler les notifications</span></a>';
    $('#me-menu').innerHTML = '<div style="padding:12px 16px;border-bottom:1px solid var(--line)"><b style="font-weight:600">Julien Martin</b><div class="small muted">Dirigeant · Toitures Martin</div></div><a href="#/parametres?s=affichage">' + ic('edit', 16) + 'Préférences d’affichage</a><a href="#/bienvenue">' + ic('form', 16) + 'Configuration du compte</a><a href="#/parametres?s=secu">' + ic('lock', 16) + 'Sécurité et sessions</a><button id="logout">' + ic('left', 16) + 'Se déconnecter</button>';
    var tog = function (btn, menu) { btn.onclick = function (e) { e.stopPropagation(); var open = menu.hidden; closeMenus(); menu.hidden = !open; btn.setAttribute('aria-expanded', open); }; };
    tog($('#bell'), $('#bell-menu')); tog($('#me'), $('#me-menu'));
    $('#logout').onclick = function () { closeMenus(); toast('Déconnexion désactivée en mode démonstration'); };
  }
  function closeMenus() { $('#bell-menu').hidden = true; $('#me-menu').hidden = true; $('#bell').setAttribute('aria-expanded', false); $('#me').setAttribute('aria-expanded', false); $('#pop').hidden = true; }
  document.addEventListener('click', function (e) { if (!e.target.closest('.menu') && !e.target.closest('#pop')) closeMenus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenus(); closeSheet(); $('#modal').innerHTML = ''; $('#mmenu').classList.remove('on'); } });
  $('#scrim').onclick = function () { closeSheet(); $('#mmenu').classList.remove('on'); $('#scrim').classList.remove('on'); };
  $('#period').innerHTML = periodOptions();
  $('#period').onchange = function () { setPeriod(this.value); };
  $('#custom').hidden = S.period !== 'perso';
  $('#apply').onclick = function () {
    var f = $('#from').value, t = $('#to').value, e = $('#date-err');
    if (!f || !t || f > t) { e.innerHTML = ic('err', 13) + 'La date de début doit précéder la date de fin.'; e.hidden = false; return; }
    e.hidden = true; S.from = f; S.to = t; render(); toast('Période appliquée');
  };
  var net = function () { var off = !navigator.onLine; $('.demo').innerHTML = off ? '<span class="state err">' + ic('err', 14) + 'Hors connexion</span> · les données affichées datent de votre dernière connexion. Les modifications sont désactivées jusqu’au retour du réseau.' : '<b>Mode démonstration</b> · Toitures Martin est une entreprise fictive. Toutes les données de cet espace sont des exemples.'; };
  addEventListener('online', net); addEventListener('offline', net);

  /* ── Routeur ── */
  var TITLES = { '': 'Vue d’ensemble', opportunites: 'Opportunités', performance: 'Performance', rapport: 'Rapport', 'rendez-vous': 'Rendez-vous', systeme: 'Système', equipe: 'Équipe Orixen', parametres: 'Paramètres', bienvenue: 'Configuration du compte' };
  var VIEWS = { '': vHome, opportunites: vOpp, performance: vPerf, rapport: vReport, 'rendez-vous': vRdv, systeme: vSys, equipe: vTeam, parametres: vSet, bienvenue: vOnb };
  var cur = null;
  function render(keepSheet) {
    var hash = location.hash.replace(/^#\/?/, ''), path = hash.split('?')[0], qs = new URLSearchParams(hash.split('?')[1] || '');
    var parts = path.split('/'), route = parts[0] || '', sub = parts[1];
    if (!(route in VIEWS)) route = '';
    if (qs.get('seg') && SEG[qs.get('seg')]) S.seg = qs.get('seg');
    if (qs.get('s')) S.set = qs.get('s');
    var changed = route !== cur; cur = route;
    var c = $('#content'), y = scrollY;
    c.innerHTML = '<div class="' + (changed ? 'view' : '') + '">' + VIEWS[route]() + '</div>';
    document.title = TITLES[route] + ' · Orixen Command Center';
    chrome(route); $('#mmenu').classList.remove('on');
    bindCommon(c); bindOpp(); bindPerf(); bindReport(); bindRdv(); bindSys(); bindTeam(); bindSet(); bindOnb();
    if (sub && route === 'opportunites') openLead(sub, qs.has('resultat') ? 'resultat' : '');
    else if (sub && route === 'performance') openCamp(sub);
    else if (!keepSheet) { $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on'); }
    if (changed && !sub) { scrollTo(0, 0); c.focus({ preventScroll: true }); } else scrollTo(0, y);
  }
  addEventListener('hashchange', function () { render(); });
  $('#collapse').onclick = function () { var on = !document.documentElement.classList.contains('collapsed'); document.documentElement.classList.toggle('collapsed', on); try { localStorage.setItem('cc-collapsed', on ? '1' : '0'); } catch (e) {} this.setAttribute('aria-pressed', on); this.setAttribute('aria-label', on ? 'Déplier le menu' : 'Réduire le menu'); };
  menus(); net(); render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/command-center/sw.js', { scope: '/command-center/' }).catch(function () {});
})();
