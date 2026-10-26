/* Orixen Command Center · données de démonstration (entreprise fictive) */
window.CC_DATA = (function () {
  var NOW = new Date('2026-10-26T17:40:00');
  var h = function (hoursAgo) { return new Date(NOW.getTime() - hoursAgo * 3600e3).toISOString(); };
  var d = function (daysAgo, hh, mm) { var x = new Date(NOW); x.setDate(x.getDate() - daysAgo); x.setHours(hh || 9, mm || 0, 0, 0); return x.toISOString(); };
  var f = function (daysAhead, hh, mm) { var x = new Date(NOW); x.setDate(x.getDate() + daysAhead); x.setHours(hh || 9, mm || 0, 0, 0); return x.toISOString(); };

  var users = [
    { id: 'u1', nom: 'Julien Martin', role: 'Dirigeant', email: 'julien@toitures-martin.fr' },
    { id: 'u2', nom: 'Karim Benali', role: 'Commercial', email: 'karim@toitures-martin.fr' },
    { id: 'u3', nom: 'Sophie Martin', role: 'Associée · lecture', email: 'sophie@toitures-martin.fr' }
  ];

  var stages = [
    { id: 'nouveau', nom: 'Nouveaux leads' },
    { id: 'contacte', nom: 'Contactés' },
    { id: 'qualifie', nom: 'Qualifiés' },
    { id: 'rdv', nom: 'Rendez-vous pris' },
    { id: 'rdv_fait', nom: 'Rendez-vous réalisés' },
    { id: 'devis', nom: 'Devis envoyés' },
    { id: 'nego', nom: 'En négociation' },
    { id: 'signe', nom: 'Ventes signées' },
    { id: 'perdu', nom: 'Opportunités perdues' }
  ];

  var raw = [
    // id, prénom nom, travaux, ville, budget, délai, campagne, heures depuis réception, étape, qualif, resp, valeur estimée, signé, motif
    ['L-1043', 'Anne-Laure Delmas-Fontanille, SCI Les Jardins de la Couze', 'Réfection complète', 'Saint-Germain-Lembron', '25 000 € et plus', 'Dans les 3 mois', 'c1', 1.2, 'nouveau', 'À qualifier', 'u1', 34000],
    ['L-1042', 'Nathalie Roux', 'Réfection complète', 'Issoire', '15 000 à 25 000 €', 'Dans les 3 mois', 'c1', 3, 'nouveau', 'À qualifier', 'u2', 18000],
    ['L-1041', 'Patrick Faure', 'Fuite ou réparation', 'Perrier', 'Non communiqué', 'Dès que possible', 'c2', 5, 'nouveau', 'À qualifier', 'u2', 2500],
    ['L-1040', 'Élodie Chabrier', 'Démoussage et entretien', 'Le Broc', '1 000 à 3 000 €', 'Dans les 3 mois', 'c1', 9, 'nouveau', 'À qualifier', 'u1', 1800],
    ['L-1039', 'Bernard Teyssier', 'Réfection complète', 'Parentignat', '25 000 € et plus', 'Dans l\'année', 'c1', 26, 'contacte', 'À qualifier', 'u2', 28000],
    ['L-1038', 'Claire Vidal', 'Gouttières et zinguerie', 'Orbeil', '1 000 à 3 000 €', 'Dans les 3 mois', 'c2', 31, 'contacte', 'À qualifier', 'u1', 2200],
    ['L-1037', 'Thomas Brun', 'Réfection complète', 'Issoire', '15 000 à 25 000 €', 'Dès que possible', 'c1', 40, 'qualifie', 'Qualifié', 'u2', 21000],
    ['L-1036', 'Monique Pradel', 'Isolation de toiture', 'Coudes', '5 000 à 15 000 €', 'Dans les 3 mois', 'c3', 52, 'qualifie', 'Qualifié', 'u1', 9500],
    ['L-1035', 'Laurent Gidon', 'Réfection complète', 'Saint-Yvoine', '15 000 à 25 000 €', 'Dans les 3 mois', 'c1', 70, 'rdv', 'Qualifié', 'u2', 19500],
    ['L-1034', 'Isabelle Rocher', 'Fuite ou réparation', 'Issoire', '3 000 à 5 000 €', 'Dès que possible', 'c2', 76, 'rdv', 'Qualifié', 'u1', 4200],
    ['L-1033', 'Gérard Michel', 'Réfection complète', 'Meilhaud', '25 000 € et plus', 'Dans les 3 mois', 'c1', 98, 'rdv', 'Qualifié', 'u2', 32000],
    ['L-1032', 'Sandrine Aubert', 'Démoussage et entretien', 'Perrier', '1 000 à 3 000 €', 'Dans les 3 mois', 'c1', 120, 'rdv_fait', 'Qualifié', 'u1', 2100],
    ['L-1031', 'Philippe Ferrand', 'Réfection complète', 'Issoire', '15 000 à 25 000 €', 'Dans les 3 mois', 'c1', 150, 'devis', 'Qualifié', 'u2', 22400],
    ['L-1030', 'Anne Delmas', 'Isolation de toiture', 'Le Broc', '5 000 à 15 000 €', 'Dans les 3 mois', 'c3', 170, 'devis', 'Qualifié', 'u1', 11800],
    ['L-1029', 'Michel Garnier', 'Réfection complète', 'Parentignat', '15 000 à 25 000 €', 'Dès que possible', 'c1', 200, 'nego', 'Qualifié', 'u2', 19800],
    ['L-1028', 'Catherine Bonnet', 'Réfection complète', 'Issoire', '15 000 à 25 000 €', 'Dans les 3 mois', 'c1', 260, 'signe', 'Qualifié', 'u2', 18600, 18600],
    ['L-1027', 'Jean-Pierre Lamy', 'Gouttières et zinguerie', 'Coudes', '3 000 à 5 000 €', 'Dès que possible', 'c2', 300, 'signe', 'Qualifié', 'u1', 3900, 4100],
    ['L-1026', 'Hélène Morel', 'Réfection complète', 'Orbeil', '25 000 € et plus', 'Dans les 3 mois', 'c1', 340, 'signe', 'Qualifié', 'u2', 27500, 26800],
    ['L-1025', 'Yannick Prat', 'Fuite ou réparation', 'Issoire', 'Non communiqué', 'Dès que possible', 'c2', 380, 'perdu', 'Qualifié', 'u1', 1500, 0, 'Prix jugé trop élevé'],
    ['L-1024', 'Rachid Amrani', 'Réfection complète', 'Clermont-Ferrand', 'Non communiqué', 'Dans l\'année', 'c1', 410, 'perdu', 'Disqualifié', 'u2', 0, 0, 'Hors zone'],
    ['L-1023', 'Test Formulaire', 'Autre', 'Issoire', 'Non communiqué', 'Je me renseigne', 'c1', 430, 'perdu', 'Disqualifié', 'u1', 0, 0, 'Coordonnées invalides'],
    ['L-1022', 'Odile Charbonnel', 'Réfection complète', 'Meilhaud', '15 000 à 25 000 €', 'Plus d\'un an', 'c1', 470, 'perdu', 'Disqualifié', 'u2', 0, 0, 'Projet trop éloigné'],
    ['L-1021', 'Serge Pouget', 'Isolation de toiture', 'Perrier', '1 000 à 3 000 €', 'Dans les 3 mois', 'c3', 520, 'perdu', 'Disqualifié', 'u1', 0, 0, 'Budget incompatible'],
    ['L-1020', 'Mireille Faure', 'Fuite ou réparation', 'Perrier', 'Non communiqué', 'Dès que possible', 'c2', 560, 'perdu', 'Disqualifié', 'u2', 0, 0, 'Doublon'],
    ['L-1019', 'Damien Coste', 'Réfection complète', 'Saint-Yvoine', '15 000 à 25 000 €', 'Dans les 3 mois', 'c1', 610, 'devis', 'Qualifié', 'u2', 20500],
    ['L-1018', 'Véronique Lac', 'Démoussage et entretien', 'Issoire', '1 000 à 3 000 €', 'Dans les 3 mois', 'c1', 34, 'contacte', 'À qualifier', 'u1', 1600]
  ];

  var tel = function (i) { return '06 ' + String(12 + i).padStart(2, '0') + ' 4' + (i % 10) + ' 7' + ((i * 3) % 10) + ' ' + String(10 + (i * 7) % 89).padStart(2, '0'); };

  var leads = raw.map(function (r, i) {
    var parts = r[1].split(' ');
    var recu = h(r[7]);
    var L = {
      id: r[0], nom: r[1], prenom: parts[0], tel: tel(i), email: parts[0].toLowerCase().replace(/[éè]/g, 'e') + '@exemple.fr',
      travaux: r[2], ville: r[3], budget: r[4], delai: r[5], source: 'Facebook et Instagram', campagne: r[6],
      recu: recu, etape: r[8], qualif: r[9], resp: r[10], valeur: r[11], signe: r[12] || 0, motif: r[13] || '',
      proprietaire: r[9] === 'Disqualifié' && r[13] === 'Hors zone' ? 'Oui' : 'Oui',
      rdv: null, devis: null, historique: []
    };
    var t0 = new Date(recu).getTime();
    var ev = function (mins, type, txt, who) { L.historique.push({ at: new Date(t0 + mins * 60e3).toISOString(), type: type, txt: txt, par: who || 'Système Orixen' }); };
    ev(0, 'form', 'Formulaire reçu depuis Facebook');
    ev(0.2, 'crm', 'Contact créé dans le CRM');
    ev(0.4, 'notif', 'SMS envoyé à ' + (r[10] === 'u1' ? 'Julien Martin' : 'Karim Benali'));
    ev(0.5, 'notif', 'SMS de confirmation envoyé au prospect');
    var order = stages.map(function (s) { return s.id; });
    var idx = order.indexOf(r[8]);
    var resp = users.find(function (u) { return u.id === r[10]; }).nom;
    if (idx >= 1) ev(r[7] > 30 ? 26 * 60 : 45, 'call', 'Appel sortant · 4 min', resp);
    if (idx >= 2) ev(r[7] > 30 ? 26 * 60 + 5 : 50, 'status', 'Qualifié : propriétaire, projet dans la zone', resp);
    if (idx >= 3 && r[8] !== 'perdu') {
      var rdvAt = idx === 3 ? f(1 + (i % 3), 10 + (i % 4) * 2) : new Date(t0 + 3 * 864e5).toISOString();
      L.rdv = { at: rdvAt, statut: idx === 3 ? (i % 2 ? 'À confirmer' : 'Confirmé') : 'Honoré', lieu: r[3] };
      ev(60 * 3, 'rdv', 'Rendez-vous planifié sur place', resp);
    }
    if (idx >= 4 && r[8] !== 'perdu') ev(3 * 1440 + 60, 'rdv', 'Rendez-vous honoré', resp);
    if (idx >= 5 && r[8] !== 'perdu') { L.devis = { montant: r[11], envoye: new Date(t0 + 4 * 864e5).toISOString() }; ev(4 * 1440, 'devis', 'Devis envoyé · ' + r[11].toLocaleString('fr-FR') + ' €', resp); }
    if (r[8] === 'signe') ev(8 * 1440, 'win', 'Vente signée · ' + r[12].toLocaleString('fr-FR') + ' €', resp);
    if (r[8] === 'perdu') ev(1440, 'lost', (r[9] === 'Disqualifié' ? 'Disqualifié · ' : 'Perdu · ') + r[13], resp);
    if (L.rdv) L.rdv.note = idx >= 4 ? 'Toiture de 1978, tuiles à remplacer. Le client compare deux devis.' : 'Accès par la cour, prévoir l’échelle de 9 m.';
    return L;
  });
  /* rendez-vous annulé et absence */
  var la = leads.find(function (l) { return l.id === 'L-1037'; });
  la.rdv = { at: d(2, 10, 0), statut: 'Annulé', lieu: la.ville, note: 'Annulé par le prospect, préfère un samedi. Nouveau créneau proposé automatiquement.' };
  la.historique.push({ at: d(3, 9, 12), type: 'rdv', txt: 'Rendez-vous annulé par le prospect', par: 'Système Orixen' });
  var lb = leads.find(function (l) { return l.id === 'L-1036'; });
  lb.rdv = { at: d(3, 17, 30), statut: 'Absent', lieu: lb.ville, note: 'Personne sur place. SMS de rappel envoyé, à rappeler lundi.' };
  lb.historique.push({ at: d(3, 18, 5), type: 'rdv', txt: 'Prospect absent au rendez-vous', par: 'Julien Martin' });

  var campagnes = [
    { id: 'c1', nom: 'Réfection de toiture · Issoire et 15 km', objectif: 'Demandes de devis pour réfection complète', statut: 'active', budgetJour: 22, depense: 612, impressions: 41800, clics: 702, formulaires: 15,
      creas: [{ nom: 'Vidéo de Julien sur un chantier', cpl: 31, leads: 9 }, { nom: 'Avant et après · maison de Perrier', cpl: 48, leads: 5 }, { nom: 'Âge du toit', cpl: 96, leads: 1 }],
      changements: [
        { at: d(9, 19, 10), par: 'Marcus · Orixen', txt: 'Budget de 18 à 22 € par jour', pourquoi: 'La vidéo de Julien produit des leads qualifiés à 31 € : on lui donne plus de budget.' },
        { at: d(4, 18, 40), par: 'Marcus · Orixen', txt: 'Publicité « Âge du toit » mise en pause', pourquoi: '96 € par lead et aucun lead qualifié sur 14 jours.' }
      ],
      reco: { txt: 'Tourner une deuxième vidéo de Julien, sur un autre chantier.', pourquoi: 'Les vidéos de Julien coûtent 3 fois moins cher par lead qualifié que les photos. Une seule vidéo s\'use vite.', confiance: 'Élevée', manque: 'Aucune', etat: 'À valider par vous' } },
    { id: 'c2', nom: 'Fuites et réparations · urgence', objectif: 'Demandes urgentes de réparation', statut: 'apprentissage', budgetJour: 8, depense: 214, impressions: 15200, clics: 260, formulaires: 6,
      creas: [{ nom: 'Fuite après l\'orage', cpl: 32, leads: 4 }, { nom: 'Tuiles déplacées', cpl: 54, leads: 2 }],
      changements: [{ at: d(6, 18, 0), par: 'Marcus · Orixen', txt: 'Campagne lancée', pourquoi: 'Tester la demande d\'urgence en automne.' }],
      reco: { txt: 'Attendre 7 jours avant de juger cette campagne.', pourquoi: 'Elle est encore en apprentissage : 6 leads ne suffisent pas pour conclure.', confiance: 'Moyenne', manque: 'Résultats commerciaux des 6 leads', etat: 'Rien à faire' } },
    { id: 'c3', nom: 'Isolation de toiture', objectif: 'Demandes d\'isolation par la toiture', statut: 'pause', budgetJour: 0, depense: 168, impressions: 9100, clics: 121, formulaires: 3,
      creas: [{ nom: 'Combles et facture de chauffage', cpl: 56, leads: 3 }],
      changements: [{ at: d(12, 19, 0), par: 'Marcus · Orixen', txt: 'Campagne mise en pause', pourquoi: '1 lead sur 3 hors budget. Julien préfère se concentrer sur la toiture avant l\'hiver.' }],
      reco: { txt: 'Garder en pause jusqu\'en février.', pourquoi: 'Décision prise avec vous le ' + new Date(d(12)).toLocaleDateString('fr-FR') + '.', confiance: 'Élevée', manque: 'Aucune', etat: 'Réalisée' } }
  ];

  var systeme = [
    { id: 's1', nom: 'Formulaires de capture', desc: 'Le formulaire Facebook « Votre devis toiture »', statut: 'ok', verif: h(0.07), incident: null },
    { id: 's2', nom: 'Pages d\'acquisition', desc: 'Votre page de demande de devis', statut: 'ok', verif: h(0.07), incident: null },
    { id: 's3', nom: 'Connexion Meta', desc: 'Accès partenaire à votre page et à votre compte publicitaire', statut: 'ok', verif: h(0.25), incident: null },
    { id: 's4', nom: 'Transmission vers le CRM', desc: 'Chaque formulaire devient un contact', statut: 'ok', verif: h(0.07), incident: { at: d(8, 21, 12), txt: 'Jeton Meta expiré · 2 leads transmis avec 38 min de retard', resolu: d(8, 21, 50), par: 'Marcus · Orixen' } },
    { id: 's5', nom: 'Notifications SMS', desc: 'Le SMS que vous recevez à chaque lead', statut: 'warn', verif: h(0.07), incident: { at: h(5), txt: 'Délai d\'envoi de 2 min 40 sur le dernier lead, contre 20 s d\'habitude', resolu: null, par: 'Marcus · Orixen', confirme: 'Le SMS est bien arrivé. Le retard vient du fournisseur d\'envoi.', enquete: 'Retard ponctuel ou durable ? Contrôle toutes les 15 min jusqu\'à demain.', etape: 'Si le retard se répète, bascule sur le numéro d\'envoi de secours.' } },
    { id: 's6', nom: 'Message au prospect', desc: 'Le SMS « Votre demande est bien reçue »', statut: 'ok', verif: h(0.07), incident: null },
    { id: 's7', nom: 'Calendrier', desc: 'Synchronisation de vos rendez-vous', statut: 'ok', verif: h(0.5), incident: null },
    { id: 's8', nom: 'Mesure des conversions', desc: 'Meta sait quels leads deviennent qualifiés', statut: 'ok', verif: h(1), incident: null },
    { id: 's9', nom: 'Surveillance des erreurs', desc: 'Test automatique du circuit complet toutes les 15 minutes', statut: 'ok', verif: h(0.07), incident: null },
    { id: 's10', nom: 'Automatisations', desc: 'Rappels de rendez-vous, relances de devis, nouveau créneau en cas d’annulation', statut: 'ok', verif: h(0.3), incident: null },
    { id: 's11', nom: 'E-mails', desc: 'Confirmations, rapports et factures envoyés par e-mail', statut: 'ok', verif: h(0.5), incident: null }
  ];
  var proc = {
    s1: 'Si le formulaire ne répond plus : bascule sur le formulaire de secours, puis correction sous 2 h.',
    s2: 'Si la page tombe : les publicités sont redirigées vers le formulaire Facebook.',
    s3: 'Si l’accès expire : Orixen vous envoie un lien de reconnexion d’un clic.',
    s4: 'Si un lead n’arrive pas : il est récupéré dans Meta et rejoué, sans doublon.',
    s5: 'Si les SMS ralentissent : bascule sur le numéro d’envoi de secours.',
    s6: 'Si l’envoi échoue : nouvel essai, puis e-mail au prospect.',
    s7: 'Si la synchronisation échoue : vos rendez-vous restent dans le CRM, resynchronisés au retour.',
    s8: 'Si la mesure s’interrompt : les campagnes continuent, Orixen corrige le suivi.',
    s9: 'Si le test échoue deux fois : alerte immédiate à Marcus.',
    s10: 'Si une relance échoue : elle passe en tâche dans « À traiter ».',
    s11: 'Si un e-mail est refusé : le contenu reste lisible dans votre espace.'
  };
  systeme.forEach(function (c) { c.proc = proc[c.id]; });

  var messages = [
    { at: d(2, 19, 15), de: 'Julien Martin', txt: 'Est-ce qu’on peut mettre en avant la zinguerie ? J’ai de la place en décembre.' },
    { at: d(2, 19, 40), de: 'Marcus Verhaar', txt: 'Oui. Je prépare deux visuels avec vos photos de gouttières, je vous les envoie jeudi pour validation.' },
    { at: d(1, 18, 0), de: 'Marcus Verhaar', txt: 'Visuels en cours. Petite question : vous faites aussi le zinc à joint debout ?' }
  ];
  var comptesRendus = [
    { at: d(5, 19, 0), titre: 'Point hebdomadaire · semaine 43', resume: 'Résultats de la semaine, zone resserrée à 15 km, Karim reçoit les réparations.', suite: 'Marcus : nouvelle vidéo. Julien : renseigner les résultats de rendez-vous.' },
    { at: d(12, 19, 0), titre: 'Point hebdomadaire · semaine 42', resume: 'Isolation mise en pause, budget toiture porté à 22 € par jour.', suite: 'Marcus : suivre le coût par lead qualifié. Julien : envoyer 10 photos de gouttières.' }
  ];

  var demandes = [
    { id: 'D-118', cat: 'Qualité des prospects', titre: 'Deux leads hors zone cette semaine', statut: 'Résolue', prio: 'Normale', resp: 'Marcus', ouvert: d(5, 20, 2), maj: d(4, 18, 40), hist: ['Reçue', 'Zone de diffusion resserrée à 15 km, communes listées', 'Résolue'] },
    { id: 'D-121', cat: 'Campagnes publicitaires', titre: 'Mettre en avant la zinguerie', statut: 'En cours', prio: 'Normale', resp: 'Marcus', ouvert: d(2, 19, 15), maj: d(1, 18, 0), hist: ['Reçue', 'Visuels en préparation, livraison jeudi'] },
    { id: 'D-123', cat: 'Facturation', titre: 'Facture d\'octobre au nom de la SARL', statut: 'Reçue', prio: 'Basse', resp: 'Marcus', ouvert: h(20), maj: h(20), hist: ['Reçue'] }
  ];

  var decisions = [
    { at: d(12, 19, 0), txt: 'Isolation en pause jusqu\'en février', par: 'Julien et Marcus' },
    { at: d(9, 19, 10), txt: 'Budget toiture porté à 22 € par jour', par: 'Julien et Marcus' },
    { at: d(5, 19, 30), txt: 'Karim reçoit les leads de réparation, Julien la réfection', par: 'Julien' }
  ];

  var serie = [];
  for (var k = 29; k >= 0; k--) {
    var day = new Date(NOW); day.setDate(day.getDate() - k); day.setHours(0, 0, 0, 0);
    var recus = [1, 0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 1, 1, 0, 1, 2, 0, 1, 1, 0, 2, 1][29 - k];
    var qualif = Math.max(0, recus - ((29 - k) % 3 === 0 ? 1 : 0));
    serie.push({ date: day.toISOString(), recus: recus, qualifies: qualif });
  }

  /* compléments : consentements, messages de formulaire, notes, prochaine action */
  var msgs = ['Infiltration au-dessus de la chambre depuis l’orage.', 'Toiture d’origine (1975), je voudrais un devis complet.', 'Tuiles déplacées côté rue.', 'Gouttière qui déborde à chaque pluie.', 'Mousse importante, maison achetée cet été.'];
  var ads = { c1: ['Vidéo de Julien sur un chantier', 'Avant et après · maison de Perrier'], c2: ['Fuite après l’orage', 'Tuiles déplacées'], c3: ['Combles et facture de chauffage'] };
  leads.forEach(function (l, i) {
    l.consent = { rappel: l.motif !== 'Coordonnées invalides', at: l.recu, canal: 'Formulaire Facebook', marketing: i % 4 === 0 };
    l.message = msgs[i % msgs.length];
    l.pub = ads[l.campagne][i % ads[l.campagne].length];
    l.notes = i === 10 ? [{ at: d(4, 18, 20), par: 'Julien Martin', txt: 'Préfère être appelée après 18h. Voisine de la cliente Bonnet.' }] : [];
    if (l.etape === 'perdu' && !l.motif) l.motif = 'Inconnu';
    var next = { nouveau: 'Premier appel', contacte: 'Qualifier le projet', qualifie: 'Proposer un rendez-vous', rdv: 'Confirmer le rendez-vous', rdv_fait: 'Renseigner le résultat du rendez-vous', devis: 'Relancer le devis', nego: 'Proposer la signature' }[l.etape];
    l.next = next ? { txt: next, due: l.etape === 'nouveau' ? NOW.toISOString() : f(l.etape === 'devis' ? 1 : 2, 18, 0) } : null;
    l.derniere = l.historique[l.historique.length - 1];
  });
  systeme.forEach(function (c) { c.etat = c.statut === 'ok' ? 'ok' : 'warn'; c.sync = c.verif; c.err = c.incident ? c.incident.txt + ' · ' + new Date(c.incident.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : null; });
  systeme.find(function (c) { return c.id === 's8'; }).etat = 'checking';
  systeme.find(function (c) { return c.id === 's7'; }).etat = 'unknown';
  var conseq = { s1: 'Les particuliers peuvent envoyer leur demande.', s2: 'Votre page de demande s’affiche.', s3: 'Orixen peut piloter vos publicités.', s4: 'Chaque demande arrive dans votre espace.', s5: 'Vos SMS peuvent arriver avec 2 à 3 minutes de retard. Aucune demande perdue.', s6: 'Le prospect sait que vous allez le rappeler.', s7: 'Vos rendez-vous ne s’ajoutent pas à Google Agenda tant que la connexion n’est pas faite.', s8: 'Sans impact sur vos demandes. Meta optimise un peu moins bien en attendant.', s9: 'Un problème serait détecté en moins de 15 minutes.', s10: 'Les rappels et relances partent à l’heure.', s11: 'Vos rapports et factures arrivent par e-mail.' };
  var act = { s5: 'Pris en charge par Orixen : contrôle toutes les 15 min, bascule sur le numéro de secours si le retard se répète.', s7: 'À faire par vous : connecter votre agenda dans Paramètres.', s8: 'Pris en charge par Orixen : vérification de l’envoi des événements à Meta, résultat dans 1 h.' };
  systeme.forEach(function (c) { c.conseq = conseq[c.id]; c.action = act[c.id] || 'Aucune action nécessaire.'; });
  systeme.find(function (c) { return c.id === 's7'; }).sync = null;

  var equipe = {
    orixen: [
      { txt: 'Deuxième vidéo de Julien en ligne', resp: 'Marcus', date: f(3, 18, 0), statut: 'En cours', attendu: 'Baisser le coût par demande qualifiée sous 60 €' },
      { txt: 'Visuels zinguerie', resp: 'Marcus', date: f(3, 18, 0), statut: 'En cours', attendu: 'Remplir le planning de décembre en zinguerie' },
      { txt: 'Page dédiée aux réparations', resp: 'Marcus', date: f(10, 18, 0), statut: 'Proposé', attendu: 'Tester une page plus courte pour les urgences' }
    ],
    client: [
      { txt: 'Valider la vidéo du chantier de Perrier', resp: 'Julien', date: f(2, 19, 0), statut: 'En cours', attendu: 'Mise en ligne jeudi' },
      { txt: 'Renseigner le résultat du rendez-vous de Sandrine Aubert', resp: 'Julien', date: f(4, 19, 0), statut: 'En cours', attendu: 'Résultats commerciaux complets' },
      { txt: 'Connecter Google Agenda', resp: 'Julien', date: f(7, 19, 0), statut: 'Proposé', attendu: 'Rendez-vous dans votre agenda sans ressaisie' }
    ],
    jalons: [
      { txt: '15 demandes qualifiées · fin de la garantie de démarrage', date: f(6, 8, 0), statut: 'En cours' },
      { txt: 'Bilan du premier mois', date: f(8, 18, 30), statut: 'Proposé' },
      { txt: 'Lancement de la zinguerie', date: f(14, 8, 0), statut: 'Proposé' }
    ]
  };
  demandes[1].commentaires = [
    { at: d(2, 19, 15), de: 'Julien Martin', txt: 'Est-ce qu’on peut mettre en avant la zinguerie ? J’ai de la place en décembre.' },
    { at: d(2, 19, 40), de: 'Marcus Verhaar', txt: 'Oui. Je prépare deux visuels avec vos photos de gouttières, je vous les envoie jeudi pour validation.' },
    { at: d(1, 18, 0), de: 'Marcus Verhaar', txt: 'Petite question : vous faites aussi le zinc à joint debout ?' }
  ];
  demandes[0].commentaires = [{ at: d(5, 20, 2), de: 'Julien Martin', txt: 'Deux demandes de Clermont cette semaine, hors de ma zone.' }, { at: d(4, 18, 40), de: 'Marcus Verhaar', txt: 'Zone resserrée à 15 km et communes listées. Je surveille la semaine prochaine.' }];
  demandes[2].commentaires = [{ at: h(20), de: 'Julien Martin', txt: 'Merci de mettre la facture au nom de la SARL.' }];
  var notifs = [
    { at: h(3), txt: 'Nouvelle demande · réfection complète à Issoire', href: '#/opportunites/L-1042', type: 'action' },
    { at: h(5), txt: 'Retard des SMS · pris en charge par Orixen', href: '#/systeme', type: 'warn' },
    { at: h(5.2), txt: 'Nouvelle demande · réparation à Perrier', href: '#/opportunites/L-1041', type: 'action' },
    { at: h(20), txt: 'Marcus a répondu à « Mettre en avant la zinguerie »', href: '#/equipe', type: 'info' },
    { at: h(26), txt: 'Rapport de la semaine disponible', href: '#/rapport', type: 'info' }
  ];
  var journal = [
    { at: h(30), par: 'Julien Martin', txt: 'Notification « Facture disponible » désactivée' },
    { at: d(5, 19, 32), par: 'Julien Martin', txt: 'Karim Benali ajouté avec le rôle Commercial' },
    { at: d(8, 21, 50), par: 'Marcus Verhaar', txt: 'Connexion Meta renouvelée' }
  ];

  return {
    NOW: NOW, equipe: equipe, notifs: notifs, journal: journal, entreprise: 'Toitures Martin', metier: 'Couverture et zinguerie', zone: ['Issoire', 'Meilhaud', 'Perrier', 'Le Broc', 'Parentignat', 'Orbeil', 'Saint-Yvoine', 'Coudes'],
    contact: { nom: 'Marcus Verhaar', role: 'Votre responsable de compte', tel: '+33627776832', telAff: '06 27 77 68 32', email: 'contact@orixen.fr', delai: 'Réponse le jour même, 7 jours sur 7' },
    garantie: { objectif: 15, jours: 30, debut: d(24, 8, 0) },
    users: users, stages: stages, leads: leads, campagnes: campagnes, systeme: systeme, demandes: demandes, decisions: decisions, serie: serie, messages: messages, comptesRendus: comptesRendus,
    hebdo: [ { s: 'Sem. 40', rdvPris: 2, rdvFaits: 1, devis: 1, ventes: 0 }, { s: 'Sem. 41', rdvPris: 3, rdvFaits: 2, devis: 2, ventes: 1 }, { s: 'Sem. 42', rdvPris: 3, rdvFaits: 3, devis: 2, ventes: 1 }, { s: 'Sem. 43', rdvPris: 4, rdvFaits: 2, devis: 2, ventes: 1 } ],
    precedent: { leads: 19, qualifies: 13, rdv: 6, ventes: 2, cplq: 54, depense: 940, ca: 31200 }
  };
})();
