# UE-SIMU — Phase B : négociation financière et propagation

## 1. Mission

Implémenter la seconde partie financière dans la version TypeScript existante (dossier `projet2/` à vérifier). S'appuyer sur l'interface de réalisation consolidée en Phase A, décrite dans `new.md`.

Parcours cible :
1. Vote de la directive et des amendements, avec aperçus sous hypothèses communes.
2. Evaluation initiale, négociation puis vote de l'accord financier.
3. Simulation finale de l'accord politique et financier.

Préserver acteurs, versions historiques, publication statique GitHub Pages, lisibilité smartphone et documentation par fichier.

Ce document définit un plan d'implémentation. Les formules de financement sont des conventions proposées à valider, pas une reproduction exacte du FEDER ou du budget de l'UE.

## 2. Préalables et décisions bloquantes

Inspecter le code, la configuration et les JSON réels ; identifier commit, modifications locales et commandes disponibles. Vérifier l'achèvement de Phase A et le contrat effectif du connecteur de réalisation.

Avant de coder les éléments concernés, valider :
- Unité monétaire interne et affichée.
- Période et calendrier : enveloppe totale du programme, détail annuel.
- Sources et statut des coûts et capacités.
- Clés de contribution et de distribution ; ne pas imposer POP/IDH sans décision.
- Bornes négociables et seuils des quatre paliers.
- Réserve et possibilité de fonds non affectés.
- Cofinancement en montant ou taux, avec dénominateur explicite.
- Convention de vote budgétaire du jeu.
- Sort d'un texte adopté sans accord financier.
- Statut de l'impact financier dans les scores.

Recommandations : enveloppe négociée pour toute la période ; calendrier annuel explicite ; quatre intervalles entre minimum et maximum ; solde financier affiché séparément de la satisfaction ; possibilité d'une réalisation avec moyens nationaux de référence si le fonds supplémentaire est nul.

Une valeur illustrative ne doit pas être inscrite comme donnée empirique. Aucun modèle historique contradictoire ne doit être repris silencieusement.

## 3. Ouverture obligatoire : évaluation initiale

La phase financière commence par un écran expliquant comment l'enveloppe proposée est obtenue à partir de l'accord politique adopté.

### 3.1. Actions et besoins

Associer chaque directive et amendement à des actions identifiées : équipements, accompagnement, prestations, dispositifs administratifs, entretien ou transition sectorielle.

Chaque action comporte : identifiant, pays/périmètre, volume, coût unitaire, coûts fixes, calendrier, entretien, conditions, source et statut des hypothèses.

Pour une action :
coût = quantité × coût unitaire + coûts fixes + entretien prévu.

Pour un pays et une année :
K(c,t) = somme des coûts des actions nécessaires cette année.

Les amendements modifient les actions, volumes, conditions ou calendriers. Ne pas simplement additionner des forfaits qui comptent deux fois le même projet. Détecter incompatibilités et doublons.

Si un besoin n'est pas raisonnablement estimable, afficher une hypothèse à valider ou une fourchette, pas un chiffre fictivement précis.

### 3.2. Proposition de fonds commun

Distinguer besoin total, moyens nationaux de référence et besoin restant.

G(c,t) = max(0, K(c,t) − Nref(c,t)).

Proposition de référence :
Fproposé = somme de rho(c,t) × G(c,t) + réserve.

rho représente la part proposée de mutualisation entre 0 et 1. Expliquer et valider sa règle. Si la réserve est un pourcentage, préciser si elle porte sur les allocations ou sur le fonds total ; résoudre correctement le calcul et éviter toute circularité implicite.

Les moyens nationaux de référence inclus dans Nref ne doivent pas être ajoutés une seconde fois comme nouveau cofinancement. Distinguer contribution nationale déjà prévue et engagement national supplémentaire.

L'estimation ne change pas parce que le joueur propose une autre enveloppe. Elle change lorsque l'accord politique, les actions ou les hypothèses de coût sont modifiés.

### 3.3. Présentation

Afficher :
- Accord politique et version évalués.
- Besoin total et détail par Etat/action.
- Moyens nationaux de référence.
- Besoin restant.
- Fonds proposé et réserve.
- Fourchette et hypothèses.
- Calendrier et limites de capacité.

Bouton « Comprendre cette estimation » : objectifs → actions → volumes → coûts → moyens existants → besoin à mutualiser.

Ne pas appeler la proposition budget obligatoire ou montant scientifiquement optimal.

## 4. Domaine et état partagé

Définir des types stricts et validation runtime pour :
PoliticalAgreement, CostAssessment, ActionCost, FinancialProposal, FinancialAgreement, ContributionRule, AllocationRule, CountryFinancialPlan, AnnualFinancialState, FinancialTier et ActorFinancialAnalysis.

Noms ajustables selon le code existant. Aucun any ni assertion servant à masquer une incohérence.

Séparer :
- Configuration et mandats immuables.
- Evaluation des besoins.
- Proposition exploratoire.
- Votes.
- Accord adopté et verrouillé.
- Flux annuels et réalisation.
- Résultat final.
- Etat de présentation.

Une proposition doit identifier sa version, l'accord politique associé, les règles, montants, calendrier, hypothèses et diagnostics.

Modifier un accord politique adopté invalide l'accord financier dérivé et les résultats finaux, après avertissement. Préserver les instantanés utiles à la comparaison.

Les vues lisent le même état ; ouvrir un graphique ou une fiche ne déclenche pas de calcul métier alternatif.

## 5. Flux et comptabilité

Distinguer :
- Contribution d'un Etat au fonds commun.
- Allocation reçue.
- Cofinancement national/territorial des actions.
- Réserve.
- Fonds non affectés.
- Dépenses effectivement réalisées.
- Allocations non utilisées.

Solde du fonds par Etat = allocation − contribution.

Ce solde n'est pas le bilan complet de la politique ni un score de victoire automatique.

Contrats :
- Somme des contributions = fonds constitué, sauf ressource extérieure explicitement définie et tracée.
- Somme des allocations + réserve + non-affecté = fonds constitué.
- Ressources des actions = allocation mobilisée + moyens nationaux affectés, sans double comptage.
- Engagements et dépenses sont séparés.
- Les flux annuels et totaux se réconcilient.

Utiliser des unités internes maîtrisées et une règle d'arrondi conservant les totaux. Documenter précision, bornes numériques et attribution des restes.

Les calculs financiers, votes et calculs d'impact doivent être des modules séparés.

## 6. Contribution et redistribution

Contributions : capacité contributive selon la convention validée.
Allocations : besoins/actions, population concernée et éventuels critères de solidarité selon la convention validée.

Ne pas utiliser automatiquement une clé unique pour les deux.

Normaliser les poids, valider leur domaine et définir le cas d'une somme nulle. Toute redistribution d'un reste ou dépassement d'un plafond doit être déterministe et visible.

Une allocation à un pays ne peut excéder les contraintes adoptées sans diagnostic. Ne pas redistribuer automatiquement une allocation inutilisée sans règle.

Limiter le fonds aux six Etats simulés, ou introduire explicitement un périmètre différent validé. Ne pas imputer implicitement les ressources de toute l'UE aux six acteurs.

## 7. Quatre paliers préétablis par indicateur

Interprétation retenue : quatre intervalles entre minimum et maximum, pas quatre niveaux ajoutés aux extrêmes.

Indicateurs à prévoir :
- Enveloppe commune.
- Contribution nationale et effort relatif.
- Allocation et couverture relative du besoin.
- Cofinancement.
- Part distribuée, si négociable.
- Réalisation permise, calculée et non assimilée automatiquement au financement.

Pour x entre L et U : z = (x − L)/(U − L).

Convention par défaut à valider :
P1 : 0 ≤ z < 0,25 — faible.
P2 : 0,25 ≤ z < 0,50 — modéré.
P3 : 0,50 ≤ z < 0,75 — élevé.
P4 : 0,75 ≤ z ≤ 1 — très élevé.

Les libellés sont descriptifs, pas des notes de réussite. Une grande contribution peut être appréciée ou contestée selon l'acteur.

Si L=U : indicateur fixé, sans division. Hors plage : diagnostic explicite avant classification ; ne pas cacher une proposition invalide par saturation.

Les bornes sont établies par directive/indicateur avant la négociation, versionnées et stables pendant la session. Comparer les pays avec des références pertinentes : besoin, capacité contributive ou capacité nationale, pas seulement montant absolu.

Si toute l'enveloppe doit être allouée hors réserve, ne pas inventer un curseur de part distribuée. Documenter la décision.

## 8. JSON des 16 directives et stratégies

Vérifier deux scénarios de huit directives ; réutiliser leurs identifiants stables et titres réels.

Organisation proposée :
public/json/finance/
  manifest.json
  shared/indicators.json
  shared/tier-definitions.json
  s1/d1/evaluation.json
  s1/d1/commission.json
  s1/d1/countries.json
  s1/d1/parties.json
  s1/d1/lobbies.json
  ... d2 à d8 et s2/d1 à d8.

Chaque dossier est spécifique à une directive ; les conventions partagées ne doivent pas être copiées partout.

### Contenus

Evaluation : actions, coûts, sources, calendrier, lien aux amendements, besoins et hypothèses de référence.
Commission : proposition initiale, explications par palier, garanties et compromis possibles.
Etats : mandat financier, demandes, contraintes, cofinancements, analyses par palier.
Partis : enveloppe souhaitée, priorités de dépenses, critères, conditionnalités et concessions.
Lobbies : intérêts sectoriels, projets, territoires justifiés, charges recherchées ou contestées, cibles d'influence ; aucun vote direct.

Chaque analyse par indicateur et palier comprend : interpretation, position possible, arguments, demandes, concessions et limites.

Prévoir quelques règles combinées prioritaires : forte contribution/faible allocation, allocation forte/capacité faible, enveloppe basse/objectif ambitieux. Eviter une explosion de toutes les combinaisons possibles et résoudre les messages contradictoires.

Faire proposer les mandats par l'IA puis les faire valider ; ne pas inventer des engagements réels. Séparer faits sourcés, paramètres du jeu et arguments fictifs attribués.

Préserver identités, orientations et ids des acteurs. Les nouveaux JSON financiers doivent se relier aux fiches existantes, pas créer une seconde identité indépendante.

Charger et valider les fichiers ; erreurs explicites. Un fallback ne doit pas présenter une stratégie obsolète comme actuelle.

## 9. Négociation et vote

Entrée : accord politique adopté et évaluation expliquée.

Permettre propositions, modification des règles/poids, comparaison à la référence, commentaires ou justifications, puis votes.

La Commission propose et vérifie ; Etats et partis négocient selon les règles pédagogiques validées ; lobbies influencent sans vote direct.

Ne pas réutiliser automatiquement les seuils législatifs pour le budget. Les règles doivent être configurées, documentées comme convention du jeu et testées.

Les analyses JSON sont aides à la négociation, jamais décisions humaines imposées. Un éventuel vote automatique est un mode distinct et signalé.

Adoption : verrouiller un instantané du texte financier associé à l'accord politique.
Rejet : proposer renégociation ou réalisation avec moyens nationaux de référence si cette sortie a été validée. Pas de simulation finale accidentelle sur une proposition non adoptée.

## 10. Raccordement au moteur Phase A

La finance calcule les moyens et conditions de réalisation par action/pays/année. Le connecteur transmet ces conditions, pas les décisions de l'interface.

Conserver :
- Contexte indépendant de la politique.
- Moyens nationaux de référence.
- Effets initiaux justifiés.
- Effets annuels et délais.
- Capacités et contraintes.
- Référence comparable avec mêmes événements exogènes.

Ne pas multiplier tous les coefficients par un unique bonus financier. Ne pas assimiler 60 % du besoin financé à 60 % du résultat macroéconomique.

Définir comment financement, capacité et calendrier limitent les actions. Une règle de goulot d'étranglement peut être proposée, mais doit être validée et expliquée. Allocations inutilisées et entretien doivent rester visibles.

Les aperçus et le résultat final utilisent le même moteur. Marquer clairement hypothèse financière provisoire ou accord adopté.

## 11. Interface et graphiques

### Ouverture

Carte d'estimation avec détail des actions, coûts, besoin restant et enveloppe proposée. Liens vers amendements et hypothèses.

### Graphiques

1. Barres horizontales groupées par Etat : contribution et allocation, même unité/période.
2. Barres divergentes de solde : contributeur net / bénéficiaire net ; pas gagnant/perdant.
3. Couverture du besoin par Etat : moyens nationaux, allocation, besoin restant ; contributions au fonds exclues des ressources nationales.
4. Vue du fonds : constitué, alloué, réserve, non-affecté.
5. Calendrier : engagements et dépenses réalisées, si simulées.

Eviter de représenter comme segment positif un besoin restant négatif ; identifier séparément toute ressource excédentaire.

Tables de valeurs exactes pour tous les graphiques. Comparaison proposition actuelle/référence/accord adopté avec versions visibles.

### Smartphones et accessibilité

Fiches de pays avec petites barres, montants, soldes signés, libellés et paliers. Comparaison globale dédiée plutôt que tableau réduit illisible.

Clavier, focus, commandes tactiles, texte alternatif, absence de dépendance au survol et couleurs non exclusives. Un diagramme de flux peut compléter, jamais remplacer la version accessible.

## 12. Propagation pédagogique et documentaire

Actualiser introduction, navigation, fiches Commission/Etats/partis/lobbies, dashboard, votes, aperçus, graphiques, tables, exports, sauvegardes, règles, wiki et décryptage.

Messages requis :
- Où va l'argent ?
- Qui finance ?
- Que permet-il de réaliser ?
- Pourquoi argent attribué et dépenses réalisées diffèrent-ils ?
- Pourquoi un solde négatif n'est-il pas un échec automatique ?
- Que devient une directive sans fonds supplémentaire ?

Schéma commun : décision → actions → besoin → ressources → réalisation → effets → évaluation.

L'explication lit les paramètres actifs. Les podcasts concernés sont revus selon `podcast.md` ; ajouter des compléments financiers ciblés plutôt que réécrire automatiquement les 16 épisodes. Toute incidence changée exige revue du script correspondant.

## 13. Persistance et traçabilité

Prévoir export/import versionné des accords et résultats ; sauvegarde locale si validée. Ne pas supposer un mode multijoueur réseau existant.

Enregistrer versions du schéma, modèle, données, accords, règles, paramètres et graine. Valider l'import ; signaler incompatibilités et ne pas appliquer silencieusement des migrations incertaines.

Les noms des élèves ne sont pas nécessaires aux calculs financiers ; traiter leur sauvegarde séparément.

## 14. Tests

- Conservation des ressources, réserves et calendriers.
- Arrondis sans perte de total.
- Soldes exacts, non-négativité, NaN/infinis et références nulles.
- Coûts indépendamment vérifiés, amendements sans doubles comptes.
- Quatre paliers : avant/au/après chaque frontière, L=U et hors plage.
- Couverture des 16 directives et de tous les acteurs.
- Cohérence des messages combinés et absence de données non validées.
- Accord politique modifié : invalidation cohérente.
- Adoption/rejet selon convention configurée, lobbies sans vote.
- Fonds nul, cofinancement nul, capacité faible et allocations inutilisées.
- Connecteur, effets annuels et absence de double bénéfice.
- Même contexte pour aperçu, référence et final.
- Pureté, reproductibilité et indépendance d'ordre.
- Tous les consommateurs affichent la même proposition.
- Export/import, assets et publication GitHub Pages.
- Parcours navigateur mobile et clavier ; signaler tests non exécutés.

Oracles indépendants et tolérances justifiées. Préserver l'historique des tests, faire évoluer explicitement les caractérisations remplacées. Tests réussis ne signifient pas validité empirique ou compréhension pédagogique démontrée.

## 15. Lots d'implémentation

B0 — Audit et contrat financier : décisions, unités, horizons et bornes.
B1 — Evaluation d'ouverture : actions/coûts des 16 directives et détail explicatif.
B2 — JSON et stratégies : manifeste, schémas, paliers et validation éditoriale.
B3 — Calculateurs purs : contributions, allocations, calendrier et invariants.
B4 — Parcours de négociation : propositions, votes, accords et invalidation.
B5 — Vues et propagation : graphiques, fiches, médiation et smartphones.
B6 — Connecteur final, bilans, persistance, documentation et déploiement.

Tests dès chaque lot. B2 et B3 peuvent progresser en parallèle après validation du contrat. Ne pas terminer les textes avant les règles qui déterminent leur sens.

## 16. Livrables et clôture

Livrer : code, JSON validés, registre des paramètres/sources, matrice de propagation, schémas, tests et rapport, documentation par fichier, guide utilisateur et publication.

Acceptation :
- Ouverture par estimation traçable de l'accord politique.
- Quatre paliers définis sans ambiguïté pour chaque indicateur retenu.
- Stratégies couvrant les 16 directives et les quatre familles d'acteurs.
- Conservation financière et absence de doubles comptes.
- Accord financier versionné, lié au bon texte politique.
- Raccordement au moteur sans reconstruire ses équations dans les vues.
- Graphiques des engagements et de la redistribution lisibles sur smartphone.
- Moyens de référence préservés lorsque le fonds est nul.
- Aucun solde automatiquement assimilé à une victoire.
- Documentation et hypothèses accessibles aux élèves.
- Commandes, tests et déploiement réellement vérifiés ou limites déclarées.

Attendre validation des arbitrages bloquants avant d'implémenter les éléments correspondants. Ne pas engager de fonds réels ni modifier un service externe : cette phase concerne une simulation pédagogique.
