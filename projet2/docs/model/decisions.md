# Registre des Décisions d'Architecture Mathématique — UE-SIMU (Phase A)

> **Document requis par `new.md` (Section 2 : Méthode et contrôle des décisions)**  
> **Statut** : Décisions d'ingénierie et d'arbitrage pour la consolidation du modèle mathématique.

---

## 1. Contexte et Objectifs de Consolidation (Phase A)

Conformément à [`new.md`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/new.md), la Phase A consolide le moteur mathématique sans activer la négociation financière de la Phase B (pas de fonds commun, ni de redistribution ou contributions financières).

Le moteur doit satisfaire les exigences suivantes :
1. **Pureté et reproductibilité** : Fonction déterministe, zéro mutation, indépendante du DOM, bit-à-bit stable avec graine PRNG.
2. **Couplage démographique strict** : Les séries européennes sont l'agrégation pondérée exacte des 6 États membres pivots.
3. **Persistance des politiques et actions** : Mettre fin au paradoxe où les amendements ne font que déplacer l'an 0 tandis que les 9 années suivantes subissent une dégradation entropique systématique non contrôlée.
4. **Interface de réalisation découplée** : Préparer un contrat de réalisation (`ImplementationProvider`) avec fournisseur de référence en Phase A, extensible sans casser le moteur lors de la Phase B.
5. **Transparence pédagogique des scores** : Présenter distinctement la satisfaction finale, la progression temporelle et le gain net face à la trajectoire contrefactuelle de référence (statu quo).

---

## 2. Décisions d'Arbitrage et Registre Formel

### Décision D01 — Interface de Réalisation et Fournisseur de Référence
- **Problème** : L'ancien moteur suppose que toute directive votée s'applique immédiatement à 100% sans délai, sans distinguer l'investissement, la règle ou la maintenance, et ne permet pas d'injecter des conditions de réalisation.
- **Décision** : Créer l'interface TypeScript `ImplementationProvider` et le type `RealizationCondition` :
  - Métadonnées : pays, action/indicateur, année, taux de déploiement effectif ($\in [0, 1]$), délai d'inertie (en années), taux d'entretien des acquis.
  - Fournisseur de base en Phase A (`ReferenceImplementationProvider`) : Fournit un taux conventionnel de réalisation nationalement différencié selon les capacités administratives et d'investissement sans activer de flux financiers monétaires.

### Décision D02 — Modélisation des Actions Annuelles et Résolution de la Dérive Entropique (S1)
- **Problème** : Dans l'ancien moteur, une directive très ambitieuse (ex: D1 Pacte Vert) voyait le CO₂ augmenter et la croissance chuter à 0% dès 2029 en Italie et en Hongrie, car aucun mécanisme d'action continu n'existait après $t=0$.
- **Décision** : Écriture de la dynamique annuelle explicable :
  $$V_{c, t} = \text{clamp}\left(V_{c, t-1} + \Delta_{\text{contexte}}(c, t) + \Delta_{\text{action}}(c, t) + \epsilon_t\right)$$
  - Les actions adoptées déploient des contributions durables :
    - Décarbonation (baisse continue de l'intensité CO₂ liée aux équipements installés),
    - Préservation du VEB (amortissement de l'impact des pollutions),
    - Amortissement des régressions de croissance pour les pays en transition.

### Décision D03 — Calcul Contrefactuel et Gain Net de Politique Publique
- **Problème** : Les élèves et joueurs ne peuvent pas distinguer si l'état en 2034 est dû à la directive adoptée ou à la tendance lourde de départ du pays.
- **Décision** : Le moteur exécute et restitue en parallèle la **trajectoire contrefactuelle de référence** (`baselineRun`, sans impulsion politique, avec les mêmes conditions exogènes et la même graine).
- **Restitution** :
  - $\text{Satisfaction Finale } S_f$
  - $\text{Progression Temporelle } \Delta S_{\text{temps}} = S_f - S_0$
  - $\text{Gain Net face à la Référence } \Delta S_{\text{ref}} = S_f - S_{\text{baseline}, f}$

### Décision D04 — Score de Réussite : Clamping Strict et Non-Pénalisation de l'Excellence
- **Problème** : L'ancienne formule $100 \cdot [0.4 S_f + 0.4(1 - |0.8 - S_f|) + 0.2(S_f - S_0)]$ pouvait descendre à $-12.0$, ne culminait pas à 0.8 et pénalisait les pays vertueux au départ.
- **Décision** :
  - Bornage strict dans l'intervalle admissible $[0.0, 100.0]$.
  - Intégration du gain net contrefactuel dans l'évaluation enrichie.
  - Conservation de la formule canonique pour la rétro-compatibilité des tests contractuels historiques, avec clamp explicite à 0 minimum pour tout consommateur UI et oracle enrichi.

### Décision D05 — Qualification Institutionnelle des Sièges et Voix
- **Problème** : Le total des députés modélisés (611) ne fait pas 720, et varie entre 489 et 978 selon la satisfaction des groupes politiques.
- **Décision** : Documenter sans ambiguïté les sièges et commissaires comme des **indices de puissance électorale et institutionnelle relative** (base 2024), tout en fournissant une fonction pure de projection proportionnelle normalisée à 720 sièges stricts (`projectConservedSeats`).

### Décision D06 — Clarification du Seuil Gini Normalisé
- **Problème** : Ambiguïté entre le Gini brut ($0.44$) et la nuisance normalisée ($0.60$).
- **Décision** : Maintenir la logique mathématique $N_{\text{gini}} > 0.60 \iff Gini_{\text{brut}} > 0.44$, qui est active et réactive, et expliciter cette conversion dans le contrat des indicateurs et dans la médiation pédagogique.

---

## 3. Matrice de Migration et Rétro-compatibilité

| Composant | Ancien statut | Nouveau statut (Phase A) | Impact tests & UI |
| :--- | :--- | :--- | :--- |
| `runSimulation` | Monolithique 1-pass | Pure, multi-séries avec baseline contrefactuelle et fournisseur de réalisation | 100% rétro-compatible sur les signatures d'appel |
| `countryTrajectories.ts` | Boucle libre post-t0 | Dynamique annuelle explicable avec terme $\Delta_{\text{action}}$ | Stabilisation des dérives à 0% de croissance |
| `realizationContract.ts` | Inexistant | Contrat formel `ImplementationProvider` + `ReferenceImplementationProvider` | Prépare la Phase B sans activation prématurée |
| `successScores.ts` | Formule brute isolée | Module de calcul avec score borné, décomposition triadique ($S_f, \Delta S, \Delta S_{\text{ref}}$) | Lisibilité totale pour les élèves |
