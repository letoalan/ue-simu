# UE-SIMU — Campagne d'Audit et Tests Complémentaires du Moteur Mathématique

> **Référence documentaire** : Spécification d'audit `testmot.md`  
> **Date d'exécution** : 8 octobre 2026  
> **Statut global** : Audit complet réalisé — 55 tests automatisés exécutés et validés (12 suites) — Zéro modification des équations en production — Incohérences documentaires et paradoxes formels cartographiés.

---

## 1. Environnement, Commit et Commandes d'Exécution

| Paramètre | Valeur / Référence |
| :--- | :--- |
| **Dépôt Git** | `ue-simu` (branche active) |
| **Commit examiné** | `a30f88ddf09268f6b76654d7ac88931fa3e1968a` |
| **Environnement d'exécution** | Windows 11 / Node.js `v24.14.1` / npm `11.11.0` |
| **Compilateur TypeScript** | TypeScript `~6.0.2` (`tsc --noEmit`) |
| **Framework de test** | Vitest `v5.0.3` |
| **Outil de build** | Vite `v8.3.3` |

### Commandes exécutées et résultats

1. **Vérification statique des types** :
   ```bash
   npm run typecheck
   # Sortie : tsc --noEmit — Code retour : 0 (aucune erreur)
   ```
2. **Suite complète de tests unitaires et d'audit** :
   ```bash
   npm test
   # Sortie : 12 test files passed, 55 passed (55) — Code retour : 0
   ```
3. **Validation de l'assemblage de production** :
   ```bash
   npm run build
   # Sortie : 32 modules transformed, built in 1.18s — Code retour : 0
   ```

---

## 2. Inventaire Exhaustif des Assertions par Catégorie

Les tests sont répartis selon les 4 catégories épistémologiques exigées par la mission d'audit :

| ID Test | Fichier de test | Priorité | Catégorie | Intitulé / Hypothèse examinée |
| :--- | :--- | :--- | :--- | :--- |
| **GINI-01** | `politicalSensitivity.test.ts` | P0 | Invariant & Caractérisation | Définition exacte du seuil de malus Gini : la condition porte sur la nuisance normalisée $N_{gini} > 0.60$ (soit $Gini_{brut} > 0.44$). |
| **GINI-02** | `politicalSensitivity.test.ts` | P0 | Diagnostic exploratoire | Atteignabilité intégrée du seuil dans les simulations réelles du Scénario 1 sans forçage. |
| **GINI-03** | `politicalSensitivity.test.ts` | P0 | Exigence de modèle & Diagnostic | Décroissance stricte de S&D et saturation double de la Gauche (plafond idéologique à 80% puis plancher à 0%). |
| **ECO-01** | `politicalSensitivity.test.ts` | P0 | Caractérisation | Effet isolé de la hausse du $CO_2$ à VEB constant : décroissance stricte de satisfaction des Verts et perte du bonus au seuil de $3.6$ t/hab. |
| **ECO-02** | `politicalSensitivity.test.ts` | P0 | Caractérisation | Effet isolé de la hausse du VEB à $CO_2$ constant : croissance et saut de bonus à $VEB > 80\%$. |
| **ECO-03** | `politicalSensitivity.test.ts` | P0 | Invariant contractuel | Polarisation doctrinale des lobbies : avantage net des Énergies Fossiles sous fort $CO_2$ vs effondrement des Verts. |
| **ECO-04** | `politicalSensitivity.test.ts` | P0 | Diagnostic exploratoire | Boucle macroéconomique complète : érosion indirecte de la croissance sous $CO_2$ élevé médiée par la dégradation du VEB. |
| **SCORE-01** | `successScores.test.ts` | P0 | Invariant contractuel | Conformité exacte à la formule $Q = 100 \times [0.4 S_f + 0.4(1 - \|0.8 - S_f\|) + 0.2(S_f - S_0)]$ sur les 4 cas témoins. |
| **SCORE-01b**| `successScores.test.ts` | P0 | Diagnostic exploratoire | Absence de clamp : le moteur produit des scores négatifs ($Q = -12$ pour $S_0=1, S_f=0$) sans borne inférieure. |
| **SCORE-02** | `successScores.test.ts` | P0 | Diagnostic exploratoire | Démonstration du paradoxe de l'optimum : $\frac{\partial Q}{\partial S_f} = +20 > 0$ pour $S_f \in [0.8, 1.0]$. $0.8$ n'est pas un optimum. |
| **SCORE-03** | `successScores.test.ts` | P0 | Diagnostic exploratoire | Biais d'initialisation : à résultat final identique ($S_f=0.8$), l'acteur en retard au départ gagne $+12$ points par rapport à l'acteur déjà vertueux. |
| **SEATS-01** | `institutionalTotals.test.ts` | P0 | Caractérisation | Échelle électorale : conformité du facteur multiplicateur $\in [0.8, 1.6]$ appliqué à la base des eurodéputés. |
| **SEATS-02** | `institutionalTotals.test.ts` | P0 | Diagnostic exploratoire | Non-conservation de l'hémicycle : total initial de 611 sièges (au lieu de 720) fluctuant entre 489 et 978 sièges. Statut d'indices de puissance. |
| **SEATS-03** | `institutionalTotals.test.ts` | P0 | Diagnostic exploratoire | Non-conservation des commissaires (22 à 43) et dépassement des pourcentages du Conseil ($106\%$ de base). |
| **AGG-01** | `aggregation.test.ts` | P1 | Invariant contractuel | Oracle d'agrégation démographique indépendant vérifié sur les 4 indicateurs et les 10 ans pour S1 et S2. |
| **AGG-02** | `aggregation.test.ts` | P1 | Diagnostic exploratoire | Représentativité démographique de l'échantillon des 6 pays : 266,0 M d'habitants (~59% de l'UE à 27). |
| **TIME-01** | `aggregation.test.ts` | P1 | Caractérisation & Invariant | Traitement de l'an 0 : l'année 2025 incorpore l'impulsion de la directive, suivie de 9 transitions dynamiques. |
| **STATE-01** | `aggregation.test.ts` | P1 | Invariant contractuel | Absence stricte de mutation sur les profils en mémoire et les objets de paramètres d'entrée. |
| **RNG-01** | `reproducibility.test.ts` | P1 | Invariant contractuel | Reproductibilité bit-à-bit stricte avec la même graine et absence d'état global caché lors d'intercalations. |
| **RNG-02** | `reproducibility.test.ts` | P1 | Caractérisation & Diagnostic | Couplage de séquence du PRNG : consommation séquentielle par les pays puis les lobbies (54 tirages pays). |
| **RNG-03** | `reproducibility.test.ts` | P1 | Caractérisation | Statique de l'API : profils codés en dur dans les imports, absence d'injection dynamique d'acteurs. |
| **DYN-01** | `dynamics.test.ts` | P1 | Caractérisation | Dérive structurelle déterministe dans S1 : emballement du $CO_2$ et affaissement du bien-être/croissance. |
| **DYN-02** | `dynamics.test.ts` | P1 | Diagnostic exploratoire | Point critique géopolitique $(50, 0.5)$ : résilience de l'Allemagne vs bascule de la Hongrie dans une spirale descendante. |
| **SAT-01** | `dynamics.test.ts` | P1 | Diagnostic exploratoire | Diagnostic exhaustif des saturations aux bornes sur les 16 directives (139 occurrences relevées). |
| **POLICY-01**| `dynamics.test.ts` | P1 | Caractérisation | Nature de la politique : impulsion ponctuelle à $t=0$ et divergence libre à $t > 0$ (pas de persistance forcée). |
| **INPUT-01** | `inputValidation.test.ts` | P2 | Caractérisation & Limite | Repli par défaut sur les valeurs initiales en cas d'absence de champ ; propagation non interceptée des NaN. |
| **REF-01** | `inputValidation.test.ts` | P2 | Caractérisation | Absence de fonction différentielle native comparant la directive au statut quo. |
| **ROB-01** | `inputValidation.test.ts` | P2 | Diagnostic exploratoire | Test de sensibilité multi-graines sur 50 tirages : $\sigma \approx 0.10$ point, 0% d'inversion ordinale. |

---

## 3. Résultats Numériques Observés et Oracles Indépendants

### 3.1. Ambiguïté Gini (GINI-01 & GINI-02)

- **Chaîne de transformation** :  
  Donnée brute $G \in [0.20, 0.60]$ $\xrightarrow{\text{agrégation}}$ $G_{UE} = \sum w_c G_c$ $\xrightarrow{\text{normalisation}}$ $N_{gini} = \frac{G_{UE} - 0.20}{0.60 - 0.20} = \frac{G_{UE} - 0.20}{0.40}$ $\xrightarrow{\text{condition politique}}$ `if (norm.gini > 0.6) s -= (norm.gini - 0.6) * 1.5`.
- **Équivalence exacte des seuils** :
  - $N_{gini} = 0.59$ $\iff$ $Gini_{brut} = 0.436$ $\implies$ Malus $= 0$.
  - $N_{gini} = 0.60$ $\iff$ $Gini_{brut} = 0.440$ $\implies$ Malus $= 0$.
  - $N_{gini} = 0.61$ $\iff$ $Gini_{brut} = 0.444$ $\implies$ Malus $= (0.61 - 0.60) \times 1.5 = 0.015$ ($-1.5\%$ de satisfaction).
  - $N_{gini} = 1.00$ $\iff$ $Gini_{brut} = 0.600$ $\implies$ Malus $= (1.00 - 0.60) \times 1.5 = 0.600$ ($-60\%$ de satisfaction).
- **Atteignabilité intégrée** :  
  Dans le Scénario 1 standard (sans inputs forcés), la **Directive 6** (*Industrie 5.0*) atteint un $Gini_{UE}$ maximal de **$0.4872$** en an 9 ($N_{gini} = 0.718$). Le malus est donc **réellement et activement déclenché** dans le jeu normal.  
  *Observation critique* : Si le cahier des charges prévoyait un seuil brut à $0.60$, ce malus aurait été rigoureusement impossible à déclencher car $Gini_{brut}$ est clampé à $0.60$. Le code applique donc le malus sur la nuisance normalisée, ce qui l'active dès $0.44$.

### 3.2. Scores de Réussite (SCORE-01 & SCORE-02)

Calculs confrontés à l'oracle indépendant $Q = 100 \times [0.4 S_f + 0.4(1 - |0.8 - S_f|) + 0.2(S_f - S_0)]$ :

| $S_0$ (Départ) | $S_f$ (Final) | Terme niveau ($0.4 S_f$) | Terme cible ($0.4(1 - \|0.8 - S_f\|)$) | Terme progression ($0.2(S_f - S_0)$) | $Q$ Théorique | $Q$ Moteur (`engine.ts`) | Conformité |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$1.0$** | **$0.0$** | $0.0$ | $0.4 \times 0.2 = 0.08$ | $0.2 \times (-1.0) = -0.20$ | **$-12.0$** | **$-12.0$** | Exacte (Négatif non borné) |
| **$0.0$** | **$1.0$** | $0.40$ | $0.4 \times 0.8 = 0.32$ | $0.2 \times (+1.0) = +0.20$ | **$92.0$** | **$92.0$** | Exacte |
| **$0.5$** | **$0.8$** | $0.32$ | $0.4 \times 1.0 = 0.40$ | $0.2 \times (+0.3) = +0.06$ | **$78.0$** | **$78.0$** | Exacte |
| **$0.5$** | **$0.81$** | $0.324$ | $0.4 \times 0.99 = 0.396$ | $0.2 \times (+0.31) = +0.062$ | **$78.2$** | **$78.2$** | Dérivée positive $> 0.8$ |
| **$0.5$** | **$1.0$** | $0.40$ | $0.4 \times 0.8 = 0.32$ | $0.2 \times (+0.5) = +0.10$ | **$82.0$** | **$82.0$** | Décrochage de +4 points |

---

## 4. Échecs Reproductibles et Contre-Exemples Minimaux

### Contre-exemple 1 : Le paradoxe de l'optimum 0.8 (SCORE-02)
- **Allégation documentaire** : « 0.8 représente la cible optimale d'équilibre européen ; s'en écarter vers le haut pénalise le joueur ».
- **Réalité mathématique du code** :  
  Pour $S_f \in [0.8, 1.0]$ :  
  $$Q(S_f, S_0) = 100 \times [0.4 S_f + 0.4(1 - (S_f - 0.8)) + 0.2(S_f - S_0)]$$
  $$Q(S_f, S_0) = 100 \times [0.4 S_f + 0.72 - 0.4 S_f + 0.2 S_f - 0.2 S_0] = 72 + 20 S_f - 20 S_0$$
  $$\frac{\partial Q}{\partial S_f} = +20 > 0$$
- **Preuve empirique** : À $S_0 = 0.5$, un joueur atteignant $S_f = 0.80$ obtient **78,0**, tandis qu'un joueur atteignant l'excellence maximale $S_f = 1.00$ obtient **82,0**.  
  Le seuil 0.8 n'est donc pas un maximum local, mais un simple point d'inflexion où la sensibilité marginale chute de $+100$ à $+20$.

### Contre-exemple 2 : Plafond idéologique et saturation au plancher de la Gauche (GINI-03)
- **Code incriminé** (`partiesEngine.ts`) :
  ```typescript
  case 'SDE':
  case 'GUE': {
    if (norm.gini > 0.6) s -= (norm.gini - 0.6) * 1.5;
    if (code === 'GUE') s = Math.min(s, 0.80);
    break;
  }
  ```
- **Comportement mis au jour** :
  1. Pour $Gini \in [0.20, 0.28]$, la satisfaction brute dépasse 80%, mais `Math.min(s, 0.80)` la sature au plafond de **80.0%**. Même en égalité parfaite, la Gauche ne peut pas dépasser 80%.
  2. Pour $Gini \in [0.28, 0.50]$, la satisfaction décroît strictement de 80.0% à 15.0%.
  3. Pour $Gini \ge 0.55$, le malus $-1.5 \times (N - 0.6)$ fait basculer $s$ en valeur négative (ex: $-0.0257$ pour $Gini = 0.55$), qui est immédiatement clampée à **0.0%**.
  La Gauche présente donc deux plateaux de saturation totale aux deux extrêmes.

### Contre-exemple 3 : L'hémicycle à géométrie variable (SEATS-02)
- Total de base des eurodéputés : $182 + 154 + 102 + 72 + 62 + 39 = \mathbf{611}$ (manque 109 députés pour faire 720).
- À l'an 5 (renouvellement électoral) :
  - Si tous les partis ont $0\%$ de satisfaction : Total Parlement = **489 sièges** ($-20\%$).
  - Si tous les partis ont $50\%$ de satisfaction : Total Parlement = **733 sièges** ($+20\%$).
  - Si tous les partis ont $100\%$ de satisfaction : Total Parlement = **978 sièges** ($+60\%$).
- Les sièges ne conservent aucune contrainte institutionnelle de taille d'assemblée.

---

## 5. Branches Inaccessibles et Ambiguïtés Conventionnelles

1. **Seuil Gini brut 0.60 vs Seuil normalisé** :
   Si une spécification exige que le malus politique ne se déclenche que lorsque « le Gini brut dépasse 0.60 », cette branche serait **rigoureusement inaccessible** puisque le modèle clampe les Gini nationaux dans $[0.20, 0.60]$. En l'état, le code utilise `norm.gini > 0.6`, ce qui correspond à $Gini_{brut} > 0.44$, rendant la condition accessible.
2. **Score de réussite non borné inférieurement** :
   Aucun `Math.max(0, ...)` n'encadre le calcul du score de réussite dans `engine.ts`. Une dégradation sévère ($S_0=1, S_f=0$) produit un score négatif de $-12.0$.
3. **Pondérations du Conseil de l'UE** :
   La somme des pourcentages d'influence au Conseil dans `PARTIES_PROFILES` totalise **106%** ($35+28+17+12+9+5$). De plus, la formule électorale les fait varier indépendamment sans contrainte de somme à 100%.

---

## 6. Distribution des Saturations et Robustesse Multi-Graines

### 6.1. Recensement des 139 saturations aux bornes (SAT-01)
Sur les 16 directives officielles simulées sur les 6 pays pendant 10 ans :

| Indicateur | Borne atteinte | Nombre d'occurrences | Pays les plus affectés | Première année d'atteinte |
| :--- | :---: | :---: | :--- | :---: |
| **Croissance du PIB (S1)** | **MIN (0.0 %)** | **32** | Italie, Hongrie, France | Dès **2029 (an 4)** en Hongrie |
| **Inégalités Gini (S1)** | **MAX (0.60)** | **8** | Hongrie | Dès **2032 (an 7)** |
| **Émissions de CO₂ (S1)** | **MAX (10.0 t/hab)** | **3** | Pologne | Dès **2033 (an 8)** |
| **État de droit V-Dem (S2)** | **MAX (1.00)** | **48** | Allemagne, France, Suède | Dès **2028 (an 3)** |
| **Développement IDH (S2)** | **MAX (1.00)** | **48** | Allemagne, France, Suède | Dès **2028 (an 3)** |

> **Diagnostic pédagogique** :  
> - Dans le Scénario 1, l'absence de politique environnementale ambitieuse entraîne une spirale d'effondrement économique : la dégradation du VEB tire la croissance vers le bas jusqu'à la bloquer à 0% dans les pays fragiles.  
> - Dans le Scénario 2, la synergie positive Normandie/V-Dem entraîne une saturation précoce au plafond de 1.00 pour les démocraties occidentales.

### 6.2. Sensibilité aux graines aléatoires (ROB-01)
Évaluation de 3 directives représentatives de S1 sur 50 graines (`seed = 1..50`) :

| Directive | Score Moyen $\mu$ | Écart-type $\sigma$ | Min | Max | Taux d'inversion ordinale |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **D1 — Pacte vert innovant** | **29.75** | **0.09** | 29.5 | 30.1 | Référence |
| **D4 — Flexisécurité européenne** | **33.71** | **0.10** | 33.4 | 34.0 | **0.0 %** vs D1 (50/50 victoires de D4) |
| **D8 — Fédéralisme fiscal** | **31.70** | **0.10** | 31.4 | 32.0 | **0.0 %** vs D1 et D4 |

> **Conclusion de robustesse** : Le micro-bruit pseudo-aléatoire ($\pm 0.04$) produit une variance infime ($\sigma \approx 0.10$ point). Le classement entre directives est **strictement invariant** face au bruit.

---

## 7. Limites Techniques et Périmètres Non Exécutés

1. **Injection dynamique d'acteurs (RNG-03)** : L'API de `engine.ts` repose sur des imports statiques (`COUNTRIES_PROFILES`, `PARTIES_PROFILES`, `LOBBIES_PROFILES`). Aucun test n'a pu injecter dynamiquement un 7ème pays dans `runSimulation` sans altérer les signatures publiques du code existant.
2. **Validation runtime de schéma (INPUT-01)** : Le moteur repose sur le typage compile-time TypeScript. L'absence de bibliothèque de validation à l'exécution (type Zod) permet la propagation silencieuse de `NaN` si un appelant JavaScript pur injecte des valeurs non numériques.

---

## 8. Décisions Pédagogiques Requises

Les points suivants nécessitent un arbitrage de conception éditoriale :

1. **Choix du seuil Gini** : Valider explicitement si le malus s'active dès que le Gini brut dépasse $0.44$ (code actuel, sensible et pédagogique) ou redéfinir la fonction de pénalité si le seuil souhaité est $0.50$ ou $0.60$.
2. **Formule du score de réussite** : Remplacer le terme $|0.8 - S_f|$ si l'on souhaite réellement pénaliser le dépassement de $0.8$, ou assumer que l'excellence ($S_f = 1.0$) reste la cible la plus gratifiante (score de 82 vs 78).
3. **Statut des sièges parlementaires** : Clarifier dans l'interface et la documentation que les députés affichés sont des **indices de puissance électorale** et non la composition statique des 720 sièges du Parlement de Strasbourg.
4. **Adoucissement des boucles de rétroaction** : Ajuster les coefficients de sensibilité de l'Italie et de la Hongrie pour éviter que leur croissance ne tombe systématiquement à 0% après 4 ans dans les scénarios sans transition écologique.

---

## 9. Propositions de Correction Formelles (Séparées du Code)

### Proposition A : Normalisation du score de réussite et vrai optimum à 0.8
Pour faire de $S_f = 0.8$ un optimum effectif et garantir $Q \in [0, 100]$ :
```typescript
// Proposition : terme quadratique centré sur 0.8 et clamp explicite
const penaltyExcess = Math.pow(Math.max(0, finSat - 0.8), 2) * 2;
const scoreBrut = 100 * (0.5 * finSat - penaltyExcess + 0.2 * ecart);
const scoreSucces = Math.max(0, Math.min(100, Math.round(scoreBrut * 10) / 10));
```

### Proposition B : Conservation proportionnelle des 720 sièges parlementaires
```typescript
// Calcul des poids électoraux puis normalisation sur 720 sièges
const rawMeps = Object.fromEntries(
  Object.entries(partiesProfiles).map(([code, p]) => [
    code,
    p.base.meps * (0.8 + 0.8 * (satisfactionArr[t] / 100))
  ])
);
const totalRaw = Object.values(rawMeps).reduce((a, b) => a + b, 0);
const normalizedMeps = Object.fromEntries(
  Object.entries(rawMeps).map(([code, v]) => [code, Math.round((v / totalRaw) * 720)])
);
```

---

## 10. Conclusion de l'Audit

1. **Qualité technique** : Excellente. Le moteur est 100% pur, déterministe, reproductible et sans fuite d'état.
2. **Conformité aux contrats** : Parfaite vis-à-vis du code TypeScript et des invariants d'agrégation.
3. **Cohérence des mécanismes** : Présente plusieurs décrochages mathématiques majeurs (paradoxe de la dérivée du score au-delà de 0.8, non-conservation des sièges, double saturation de la Gauche).
4. **Pertinence pédagogique** : Très immersive mais soumise à des effets d'emballement rapides (saturation des indicateurs en 3 à 5 ans) qui méritent un lissage lors d'une future mise à jour de modèle.
