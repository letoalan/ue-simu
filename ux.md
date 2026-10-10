# UE-SIMU — Refonte UX selon trois parcours

## 1. Mission

Refondre l'expérience autour de trois entrées :
- « Je suis un participant ».
- « Je suis un animateur ».
- « Je suis le maître du jeu ».

Conserver le même moteur, les mêmes accords et les mêmes résultats. Les parcours organisent accès, tâches et informations ; ils ne créent pas trois simulations indépendantes.

Respecter `new.md`, `finance.md` et `podcast.md`. La Phase A doit fonctionner sans afficher une négociation financière non implémentée. La Phase B active le financement via une capacité explicite de l'application.

Priorités : lisibilité smartphone, progression compréhensible, médiation accessible, séparation entre proposition et décision, maîtrise des interventions et protection contre les pertes de session.

## 2. Audit préalable

Inspecter navigation, store, votes, fiches, graphiques, décryptage, médias, imports/exports et persistance réellement existants.

Livrer carte des parcours actuels, matrice tâches/écrans et liste des composants réutilisables. Vérifier les dispositifs de Phase A/B réellement disponibles.

Ne pas annoncer des permissions sécurisées ou une synchronisation réseau absentes. Les choix de parcours et éventuels codes locaux sont des protections d'usage, pas une authentification serveur.

Décisions à valider :
- Animateur et maître du jeu peuvent-ils être incarnés par une même personne ? Recommandation : oui, avec changement de mode explicite.
- Les votes sont-ils saisis individuellement ou centralisés ? Recommandation MVP : centralisés par l'animateur.
- Quelles informations des fiches sont publiques ou réservées à l'acteur ?
- Quels changements de règles sont permis après ouverture de la partie ?

## 3. Rôles et responsabilités

### Participant : préparer, négocier, comprendre

Accède à son rôle, ses enjeux, stratégies, amendements, aperçu des effets, podcasts et bilan. Consulte les accords et résultats validés.

Peut préparer une position et explorer des variantes dans un espace distinct. Ne modifie pas l'accord officiel ni les paramètres de la session par une simple exploration.

Le participant Commission dispose des outils de proposition liés à sa fiche. Cela ne lui donne pas les pouvoirs techniques du maître du jeu.

Les lobbies influencent mais ne disposent pas de vote institutionnel. Les éventuels boutons de vote respectent la catégorie d'acteur.

### Animateur : conduire la séance

Organise la discussion, présente propositions et résultats, gère ordre de passage et temps, recueille les votes et annonce les décisions.

Ne change pas discrètement les équations, données, règles ou votes déjà validés. Un vote automatique éventuel est identifié comme aide pédagogique, pas comme choix des élèves.

### Maître du jeu : configurer et garantir

Prépare scénario, directive, rôles, règles validées, hypothèses de référence et sauvegardes. Gère incidents, réouverture d'une décision et paramètres autorisés.

Distinguer outils d'exploitation et édition du modèle : ne pas créer un éditeur universel des équations dans l'interface. Toute modification de modèle relève des fichiers, de la validation et des tests, pas d'un curseur caché pendant une séance.

## 4. Matrice d'actions proposée

| Action | Participant | Animateur | Maître du jeu |
|---|---|---|---|
| Lire contenu public/podcasts | Oui | Oui | Oui |
| Lire sa fiche complète | Oui, selon confidentialité retenue | Selon règle | Selon règle |
| Explorer hypothèses | Brouillon isolé | Aperçu identifié | Aperçu identifié |
| Proposer un amendement | Préparation/proposition | Présentation/recueil | Supervision |
| Saisir les votes officiels | Non en MVP centralisé | Oui | Mode de secours tracé |
| Valider la décision | Non | Selon règles de vote | Correction exceptionnelle tracée |
| Configurer la session | Non | Options de conduite | Oui |
| Modifier règles/hypothèses | Non | Non | Avant séance ou intervention explicite |
| Exporter la session | Export personnel | Bilan public | Export complet selon confidentialité |
| Restaurer/réinitialiser | Non | Non | Oui, confirmation |

Cette matrice exprime des garde-fous UX. Elle ne constitue pas une sécurité forte dans une application statique.

## 5. Accueil et identification

Page d'accueil avec trois cartes exactement nommées selon les parcours. Sous chaque carte : une phrase décrivant la mission et un bouton clair.

Afficher : nouvelle partie, reprendre une session disponible, ouvrir un export compatible. Ne pas afficher « rejoindre en direct » sans synchronisation implémentée.

Participant : choisir session disponible, rôle attribué et acteur. Le choix d'un acteur ne réserve pas automatiquement une place sur un autre appareil.

Animateur : ouvrir la session, vérifier scénario, acteurs et phase active, puis entrer dans le tableau de conduite.

Maître du jeu : préparer/importer la session, vérifier sa cohérence puis l'ouvrir.

Changement de parcours toujours accessible mais distinct du changement d'acteur. Conserver la session, ne pas relancer le moteur ou réinitialiser les votes.

## 6. Parcours participant

Navigation mobile proposée, quatre destinations :
1. Mon rôle.
2. Négocier.
3. Comprendre.
4. Résultats.

### Mon rôle

Carte synthétique : acteur, catégorie, mission, priorités et phase. Sections progressives : enjeux, lignes rouges, arguments, alliances possibles et mandat détaillé.

Phase B : afficher contribution, allocation, cofinancement et analyses par paliers de `finance.md`, sans les intégrer comme verdict automatique.

Distinguer mandat stable et lecture de la proposition courante.

### Négocier

Directive actuelle, amendements, état proposé/adopté/rejeté et position personnelle facultative.

Deux actions distinctes : « Préparer ma position » et « Explorer les effets ». L'exploration ne modifie pas le texte officiel.

En Phase B : besoins estimés, proposition financière, paliers et arguments. Afficher version de l'accord politique sous-jacent.

Prévoir notes personnelles locales facultatives ; ne pas annoncer leur partage automatique.

### Comprendre

Podcast de la directive et transcription. Décryptage contextuel : intention → action → réalisation → interaction → résultat.

Trois profondeurs : explication courte, schéma/exemple, équations facultatives.

### Résultats

Mon acteur d'abord, vue collective ensuite. Satisfaction, évolution, gain face à référence si disponible, objectifs et limites. Solde financier séparé de réussite.

Questions de débriefing : « Qu'avions-nous prévu ? Qu'observons-nous ? Quel mécanisme explique l'écart ? »

## 7. Parcours animateur

Tableau de conduite avec : phase, directive, proposition/version, prochaine action, état des votes, temps facultatif et problèmes bloquants.

Structure :
- Séance.
- Propositions.
- Votes.
- Projection.
- Bilan.

### Séance

Ordre du jour et étapes avec statut : à préparer, en discussion, adopté, rejeté, à reprendre. Actions « Pause », « Reprendre », « Présenter la prochaine proposition ».

Le temps est indicatif sauf règle explicitement configurée ; pas de clôture automatique par défaut.

### Votes

Saisie centralisée par acteur autorisé. Confirmer avant verrouillage. Afficher votes manquants et détails du calcul des majorités.

Une correction après validation exige motif et nouvelle version. Aucun passage automatique au résultat final sur votes incomplets.

### Projection

Vue publique grand écran : proposition, arguments non confidentiels, votes si autorisés, graphiques et schémas. Exclure notes réservées et réglages avancés.

Le mode projection peut être une vue sur le même appareil. Ne pas promettre une diffusion synchronisée à d'autres appareils.

### Bilan

Comparer accords, hypothèses et résultats. Export public imprimable ou téléchargeable si implémenté ; préciser le périmètre. Prévoir questions de discussion, pas seulement classement.

## 8. Parcours maître du jeu

Assistant de préparation :
1. Choisir scénario/directive.
2. Charger données et vérifier versions.
3. Attribuer rôles.
4. Choisir règles pédagogiques validées.
5. Vérifier hypothèses de référence et graine.
6. Vérifier contenus, médias et accessibilité.
7. Exporter un instantané et ouvrir la séance.

Ecran de contrôle : diagnostics, données manquantes, contradictions de mandat, disponibilité des podcasts, paramètres utilisés, versions et sauvegardes.

Afficher valeurs, unité, origine et conséquence d'un réglage. Les options expertes sont repliées, non invisibles.

Réouvrir un accord, changer scénario ou restaurer : résumé des conséquences, confirmation, sauvegarde proposée, invalidation des accords dérivés et journal d'événement.

Une absence de fonds supplémentaire n'est pas une absence d'application : vérifier la référence nationale selon `finance.md`.

## 9. Etat de session et transitions

Séparer état partagé, exploration personnelle et préférences d'interface.

Etats proposés : préparation → politique en discussion → politique adoptée → finance en discussion si active → accord complet → simulation finale → débriefing.

Prévoir branches rejet, pause et réouverture. En Phase A, passer de politique adoptée à résultat sous conditions de référence, avec intitulé explicite.

Chaque résultat indique : provisoire/final, versions d'accord, hypothèses et graine. Une modification en amont invalide les résultats en aval.

Les parcours consomment les mêmes sélecteurs de données. Aucun composant ne recalcule une version parallèle du moteur.

Journal : acteur de conduite, action, horodatage, version et motif des corrections. L'horodatage local n'est pas une preuve institutionnelle ni un mécanisme de synchronisation.

## 10. Smartphone, tableaux et graphiques

Une tâche principale par écran, titres courts, valeurs avec unités, boutons lisibles, retour clair. Eviter sept onglets serrés ; regrouper par parcours et contexte.

Cartes pour lecture détaillée ; tableau ou vue de comparaison dédiée pour comparer plusieurs Etats. Défilement horizontal seulement si indispensable et signalé.

Graphiques : séries sélectionnables, légendes lisibles, consultation des valeurs au toucher, alternative tabulaire et agrandissement facultatif. Ne pas afficher plusieurs unités comme une seule grandeur.

Finance : contribution/allocation côte à côte ou deux barres par Etat ; solde signé ; couverture des besoins ; reserve et non-affecté séparés. Ne pas confondre engagement, allocation et dépense.

Aucun recalcul à l'ouverture d'un décryptage. Les explications doivent revenir facilement au graphique et conserver la position de lecture.

Tester petits écrans, portrait/paysage, zoom de texte, clavier et lecteurs d'écran. Contraste, focus, labels, titres et alternatives ; pas d'information par couleur ou survol seuls.

## 11. Podcasts et médiation

Réutiliser le manifeste de `podcast.md` pour les 16 directives. Pas de duplication du catalogue dans chaque parcours.

Participant : préparation de sa position.
Animateur : introduction ou pause explicative de séance.
Maître du jeu : vérification des contenus et versions.

Pas d'autoplay. Un seul audio actif. Transcription consultable sans audio. Etat « à produire » si média absent.

Les fiches et schémas séparent coefficient d'influence, poids de préférence, agrégation, seuil et règle de jeu. Les exemples numériques proviennent du contrat validé.

## 12. Sessions locales et appareils multiples

MVP recommandé : fonctionnement statique, une session officielle sur l'appareil de conduite, lecture et explorations possibles ailleurs sans prétendre les synchroniser.

Export/import versionné pour transmettre un état. Identifier clairement copie reçue, date et version. L'import n'écrase pas sans confirmation.

Sauvegarde locale : documenter limites, disponibilité du stockage et récupération. Réduire les données personnelles ; noms des élèves facultatifs et dissociés du calcul.

Si une collaboration en direct est souhaitée, en faire un projet distinct : architecture, permissions, conflits, confidentialité et tests. Ne pas simuler le réseau par un bouton inopérant.

Les fiches confidentielles dans des assets publics restent techniquement accessibles : ne pas promettre un secret sécurisé sans architecture adéquate.

## 13. Lots d'implémentation

UX0 — Audit et décisions : rôles, tâches, capacités existantes et périmètre local.
UX1 — Contrat de session, transitions, droits d'usage et séparation des brouillons.
UX2 — Accueil et navigation par parcours, avec fonctionnalités activables selon Phase A/B.
UX3 — Participant : rôle, négociation, décryptage, podcasts et bilan.
UX4 — Animateur : conduite, votes, projection et corrections tracées.
UX5 — Maître du jeu : préparation, diagnostics, sauvegarde et reprise.
UX6 — Harmonisation mobile, graphiques et accessibilité.
UX7 — Tests utilisateurs, non-régression, documentation et GitHub Pages.

Présenter des maquettes ou prototypes de trois écrans clés par parcours avant refonte générale. Tests et médiation dès les premiers lots.

## 14. Tests et critères d'acceptation

- Changer de parcours ne modifie ni résultats ni accords.
- Exploration participant ne modifie pas la session officielle.
- Commission participante n'obtient pas les pouvoirs techniques du maître du jeu.
- Lobbies sans vote direct.
- Règles et seuils affichés correspondent aux calculs.
- Résultats obsolètes invalidés et visibles comme tels.
- Paramètres hypothétiques/finalement adoptés clairement distincts.
- Réinitialisation/import/réouverture confirmés et traçables.
- Phase B absente : parcours Phase A complet et aucune fonctionnalité fictive active.
- Exports respectent public/réservé selon convention, sans prétendre à une sécurité inexistante.
- Podcasts et transcriptions associés aux bons ids.
- Tables, valeurs et actions accessibles au tactile et clavier.
- Pas de débordement général sur petits écrans ni texte illisible.
- Déploiement statique et ressources vérifiés.

Organiser des tâches observables : participant trouve sa mission et explique un effet indirect ; animateur saisit et valide un vote ; maître du jeu restaure une session et comprend les invalidations.

Mesurer difficultés, erreurs et compréhension ; ne pas déclarer des tests utilisateurs réalisés sans observation réelle.

## 15. Livrables

Carte des parcours, matrice rôles/actions, maquettes validées, composants, contrats d'état, tests, guide par parcours, wiki des fichiers modifiés et rapport UX.

Ne pas modifier les équations pour simplifier un écran. Ne pas modifier préférences/mandats sans validation. Signaler toute configuration hors version TypeScript.

La refonte est achevée lorsque chacun trouve ses tâches, comprend le statut de la session et peut expliquer les résultats sans confondre décision politique, moyens, réalisation et jugement des acteurs.
