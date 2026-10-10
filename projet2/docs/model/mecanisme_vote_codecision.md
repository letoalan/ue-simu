# Procédure Législative Ordinaire & Mécanisme de Vote (Co-décision)

Ce document décrit la modélisation constitutionnelle, mathématique et ergonomique de la phase de vote intégrée dans **projet2** de l'application **UE-SIMU**.

---

## 1. Fondements Institutionnels Européens

Le vote reproduit fidèlement la procédure législative ordinaire de l'Union européenne (art. 294 TFUE et art. 16 TUE), opposant et associant deux branches du pouvoir législatif :

### A. Le Conseil de l'Union Européenne (Majorité Qualifiée)
Pour qu'un amendement ou un texte soit approuvé par le Conseil des ministres, la règle de la **Majorité Qualifiée (MQ)** s'applique :
1. **Critère des États membres** : Au moins **55% des États membres** doivent voter **POUR**.
   - Dans le modèle (6 pays représentatifs : DE, FR, IT, PL, SE, HU) : $\lceil 6 \times 0.55 \rceil = \mathbf{4\text{ États}}$.
2. **Critère démographique (Population)** : Les États votant POUR doivent représenter au moins **65% de la population totale** de l'UE représentée.
   - Total population du modèle :
     - Allemagne (DE) : 84,3 M
     - France (FR) : 64,7 M
     - Italie (IT) : 58,9 M
     - Pologne (PL) : 38,0 M
     - Suède (SE) : 10,5 M
     - Hongrie (HU) : 9,6 M
     - **Total = 266,0 M hab.**
   - Seuil de population : $266,0 \times 0.65 = \mathbf{172,9\text{ M hab.}}$.

*Note sur la directive globale* : La proposition générale initiale est soumise à une majorité simple d'approbation politique ($\ge 4/6$ États).

### B. Le Parlement Européen (Majorité Absolue des Députés)
Pour qu'un amendement soit adopté par le Parlement en co-décision (art. 294 TFUE) :
1. **Critère des Sièges** : Une majorité absolue des suffrages des membres composant le Parlement est requise, soit strictement **> 50% des sièges**.
   - Total sièges du modèle :
     - PPE (Parti Populaire Européen) : 182
     - S&D (Socialistes & Démocrates) : 154
     - Renew Europe (Centristes / Libéraux) : 102
     - Verts/ALE (Écologistes) : 72
     - ECR (Conservateurs & Réformistes) : 62
     - GUE/NGL (Gauche unitaire) : 39
     - **Total = 611 sièges**.
   - Seuil de majorité absolue : $\lfloor 611 / 2 \rfloor + 1 = \mathbf{306\text{ voix POUR}}$.

---

## 2. Règle de Co-décision Bicamérale

Un amendement $A_k$ est **ADOPTÉ** si et seulement si les deux chambres le valident conjointement :
$$\text{Adopté}(A_k) \iff \text{ConseilMQ}(A_k) \land \text{ParlementMajoritéAbsolue}(A_k)$$

Si l'une des deux institutions émet un avis défavorable ou n'atteint pas son seuil constitutionnel, l'amendement est **REJETÉ**.

---

## 3. Propagation et Impact dans le Simulateur

### A. Intégration des impacts d'amendements
Chaque amendement voté $A_k$ porte un vecteur d'impacts nominaux $\Delta_{k, v}$ sur les indicateurs de politique publique (ex. PIB, Gini, $CO_2$, Bien-être pour le scénario 1 ; Normandie, V-Dem, PIB, IDH pour le scénario 2).

Lorsque la synthèse du vote est validée :
1. L'ensemble des amendements adoptés $E_{\text{adoptes}} = \{A_k \mid \text{Adopté}(A_k) = \text{true}\}$ est compilé.
2. Pour chaque indicateur $v$, l'impact moyen des amendements adoptés est calculé :
   $$\overline{\Delta}_v = \frac{1}{|E_{\text{adoptes}}|} \sum_{A_k \in E_{\text{adoptes}}} \Delta_{k, v}$$
3. La valeur d'entrée de la simulation est mise à jour avec l'impact moyen cumulé :
   $$\text{Input}_v^{\text{final}} = \text{Clamp}\Big(\text{Input}_v^{\text{base}} + \overline{\Delta}_v, [\min_v, \max_v]\Big)$$
4. La simulation est immédiatement recalculée sur l'horizon de 10 ans via le moteur mathématique complet (`recomputeSimulation()`).

### B. Traçabilité dans l'Interface Utilisateur
- **Badge d'état officiel** dans le Simulateur : « 🗳️ Texte issu du vote » (vert) remplaçant « ⚠️ Proposition non votée » (orange).
- **Liste des amendements adoptés** affichée sous forme de badges (`A1`, `A3`, etc.) sur la carte de directive.
- **Accès bidirectionnel** :
  - Depuis le simulateur : Bouton « Revoir le vote 🗳️ » ou « Voter le texte 🗳️ ».
  - Depuis le vote : Bouton « 🚀 Appliquer le texte voté au Simulateur » menant directement au tableau de bord.
  - Depuis le scénario : Bouton « 🗳️ Séance de vote institutionnelle » dans la section des amendements.

---

## 4. Architecture Technique des Fichiers

| Fichier | Rôle dans la Phase de Vote |
|---|---|
| [`projet2/src/state/store.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/state/store.ts) | Gestion d'état réactif, types de vote, calculs des majorités, vote réaliste par PRNG, application au simulateur. |
| [`projet2/src/ui/voteView.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/ui/voteView.ts) | Vue interactive complète : stepper, jauge de population Conseil, hémicycle Chart.js PE, verdict en temps réel, package final. |
| [`projet2/src/ui/simulatorView.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/ui/simulatorView.ts) | Intégration du statut du vote, badges des amendements adoptés, navigation vers la séance de vote. |
| [`projet2/src/ui/scenarioView.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/ui/scenarioView.ts) | Passerelle d'entrée orientant l'utilisateur vers la séance de vote institutionnelle. |
| [`projet2/src/styles/main.css`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/styles/main.css) | Styles graphiques du stepper, des cartes législatives, des jauges avec seuils et des pilules de vote. |
| [`projet2/tests/vote.test.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/tests/vote.test.ts) | Suite de tests automatisés (5 tests unitaires) validant la MQ, la majorité absolue et l'application aux curseurs. |
