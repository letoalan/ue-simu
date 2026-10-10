# Registre des Équations et Spécifications du Modèle — UE-SIMU

Ce document formalise les hypothèses mathématiques, les unités, les bornes, les calculs annuels et le mécanisme de couplage unifié entre l'Union européenne et les États membres.

---

## 1. Cadre temporel et Échantillon

* **Horizon temporel** : 10 ans (2025 à 2034).
* **Échantillon représentatif d'États membres** :
  * Allemagne (DE) : 84,3 M d'habitants (~31,7% de l'échantillon)
  * France (FR) : 64,7 M d'habitants (~24,3%)
  * Italie (IT) : 58,9 M d'habitants (~22,1%)
  * Pologne (PL) : 38,0 M d'habitants (~14,3%)
  * Suède (SE) : 10,5 M d'habitants (~3,9%)
  * Hongrie (HU) : 9,6 M d'habitants (~3,6%)
  * *Total population échantillon* : 266,0 millions d'habitants.
  * *Poids démographique relatif* : $w_c = \frac{\text{Pop}_c}{\sum \text{Pop}}$.

---

## 2. Indicateurs et conventions d'échelle

### Scénario 1 : Développement Durable & Transition Écologique
| Indicateur | Code | Unité | Plage admise | Objectif d'utilité |
|---|---|---|---|---|
| Croissance du PIB | `croiss` | % annuel | [0.0 ; 4.0] % (UE: [0 ; 10]) | Plus élevé = meilleur |
| Inégalités économiques | `gini` | Coefficient (0 à 1) | [0.20 ; 0.60] | Plus faible = meilleur |
| Émissions de gaz à effet de serre | `co2` | Indice d'émissions | [2.0 ; 10.0] | Plus faible = meilleur |
| Végétalisation et bien-être | `veb` | Pourcentage | [0 ; 100] % | Plus élevé = meilleur |

### Scénario 2 : Stabilité Géopolitique & État de Droit
| Indicateur | Code | Unité | Plage admise | Objectif d'utilité |
|---|---|---|---|---|
| Sécurité / Indice Normandie | `normandie` | Score (0 à 100) | [0 ; 100] | Plus élevé = meilleur |
| Démocratie & État de droit | `vdem` | Indice (0 à 1) | [0.0 ; 1.0] | Plus élevé = meilleur |
| Croissance du PIB | `pib` | % annuel | [-2.0 ; 4.0] % | Plus élevé = meilleur |
| Indice de Développement Humain | `idh` | Indice (0 à 1) | [0.0 ; 1.0] | Plus élevé = meilleur |

---

## 3. Algorithme de simulation annuel

Pour chaque simulation (déclenchée par une sélection de directive et d'amendements) :

### Étape 1 : Initialisation de l'an 0 (2025)
Les valeurs de l'année 0 proviennent des profils initiaux historiques du pays, modulées par l'impulsion politique européenne de la directive retenue :
$$\text{Indicateur}_{c, 0} = \text{Init}_{c} + \alpha \cdot (\text{CibleUE}_{\text{directive}} - \text{Init}_{c})$$

### Étape 2 : Dynamique inter-indicateurs des États ($t = 1 \dots 9$)
Au sein de chaque État membre, les sensibilités sectorielles s'appliquent avec micro-fluctuation reproductible $\epsilon_t = \text{PRNG}(t, \text{seed}) \times \sigma$ :

#### En Scénario 1 :
1. $\text{co2}_{c, t} = \text{clamp}_{[2, 10]}\left(\text{co2}_{c, t-1} + s_{\text{croiss\_co2}} \cdot \text{croiss}_{c, t-1}\right)$
2. $\text{veb}_{c, t} = \text{clamp}_{[0, 100]}\left(\text{veb}_{c, t-1} - s_{\text{co2\_veb}} \cdot \text{co2}_{c, t}\right)$
3. $\text{gini}_{c, t} = \text{clamp}_{[0.2, 0.6]}\left(\text{gini}_{c, t-1} + s_{\text{veb\_gini}} \cdot \frac{100 - \text{veb}_{c, t}}{100}\right)$
4. $\text{croiss}_{c, t} = \text{clamp}_{[0, 4]}\left(\text{croiss}_{c, t-1} - s_{\text{veb\_croiss}} \cdot \left(10 - \frac{\text{veb}_{c, t}}{10}\right) + \epsilon_t\right)$

#### En Scénario 2 :
1. $\text{normandie}_{c, t} = \text{clamp}_{[0, 100]}\left(\text{normandie}_{c, t-1} + s_{\text{vdem\_norm}} \cdot (\text{vdem}_{c, t-1} - 0.5) \cdot 10\right)$
2. $\text{vdem}_{c, t} = \text{clamp}_{[0, 1]}\left(\text{vdem}_{c, t-1} + s_{\text{norm\_vdem}} \cdot \left(\frac{\text{normandie}_{c, t}}{100} - 0.5\right)\right)$
3. $\text{pib}_{c, t} = \text{clamp}_{[-2, 4]}\left(\text{pib}_{c, t-1} + s_{\text{norm\_pib}} \cdot \left(\frac{\text{normandie}_{c, t}}{100} - 0.5\right) + \epsilon_t\right)$
4. $\text{idh}_{c, t} = \text{clamp}_{[0, 1]}\left(\text{idh}_{c, t-1} + s_{\text{norm\_idh}} \cdot \left(\frac{\text{normandie}_{c, t}}{100} - 0.5\right) + s_{\text{pib\_idh}} \cdot \left(\frac{\text{pib}_{c, t}}{4} - 0.25\right)\right)$

### Étape 3 : Agrégation Européenne
Pour chaque année $t$, chaque indicateur européen résulte de la synthèse pondérée par le poids démographique des États membres :
$$\text{IndicateurUE}_t = \sum_{c \in \text{États}} w_c \cdot \text{Indicateur}_{c, t}$$

Cette règle garantit une cohérence mathématique absolue : **la trajectoire européenne est le reflet fidèle et mesurable des trajectoires nationales**.

---

## 4. Modèle Politique (Partis Européens)

Pour chaque parti $p \in \{\text{PPE, SDE, RENEW, VERT, ECR, GUE}\}$ et chaque année $t$ :
1. **Normalisation des 7 indicateurs** dans $[0 ; 1]$ :
   * $N(\text{pib}) = \text{norm}(\text{pib}, -2, 4)$
   * $N(\text{gini}) = 1 - \text{norm}(\text{gini}, 0.2, 0.6)$
   * $N(\text{co2}) = 1 - \text{norm}(\text{co2}, 2, 10)$
   * $N(\text{veb}) = \text{norm}(\text{veb}, 0, 100)$
   * $N(\text{stab}) = \text{norm}(\text{stab}, 0, 100)$
   * $N(\text{dem}) = \text{norm}(\text{dem}, 0, 1)$
   * $N(\text{idh}) = \text{norm}(\text{idh}, 0, 1)$

2. **Score de satisfaction annuel** :
   $$S_{p, t} = \frac{\sum_i \omega_{p, i} \cdot N(I_{i, t})}{\sum_i \omega_{p, i}} \pm \text{Bonus/Malus doctrinal}$$

3. **Traduction institutionnelle (évolution des sièges et pouvoirs)** :
   * Sièges au Parlement européen (MEPs) : réélection après l'an 5 et l'an 9 en fonction de la moyenne de satisfaction.
   * Commissaires et voix au Conseil : modulés par la satisfaction moyenne.
   * **Score de victoire** :
     $$\text{Victoire}_p = 100 \cdot \left(0.6 \cdot \bar{S}_{p} + 0.2 \cdot \frac{\text{MEPs}_9}{200} + 0.2 \cdot \frac{\text{Commissaires}_9}{10}\right)$$

---

## 5. Modèle des Lobbies

Pour chaque lobby $l$ sur les 9 années :
1. **Évolution de la réputation** :
   $$R_{l, t} = \text{clamp}_{[0, 100]}\left(R_{l, t-1} + \sum_f \text{impact}_f \cdot \omega_{l, f}^{\text{rep}} \cdot 10\right)$$
2. **Évolution de l'influence** :
   $$I_{l, t} = \text{clamp}_{[0, 100]}\left(I_{l, t-1} + \left(\sum_f \text{impact}_f \cdot \omega_{l, f}^{\text{inf}} \cdot 8\right) \cdot \frac{R_{l, t}}{100}\right)$$
3. **Pénalité concurrentielle** :
   Si un impact ennemi dépasse 0.6, application d'un malus de contre-influence.
4. **Score de réussite final** :
   $$\text{ScoreRéussite}_l = \frac{I_{\text{États}, 9} + I_{\text{Parlement}, 9} + I_{\text{Commission}, 9}}{3}$$
