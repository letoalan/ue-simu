# Registre de Référence du Moteur Mathématique — UE-SIMU (Phase A)

> **Document requis par `new.md` (Section 2 : Méthode et contrôle des décisions)**  
> **Dépôt** : `ue-simu` | **Branche active** : commit `a30f88ddf09268f6b76654d7ac88931fa3e1968a`  
> **Environnement** : Node.js `v24.14.1`, Vitest `v5.0.3`, TypeScript `~6.0.2`  
> **Statut initial des tests** : 13 suites, 62 tests passés au vert.

---

## 1. Périmètre et Données Démographiques de Base

### 1.1. Échantillon représentatif des 6 États membres
L'échantillon modélise 6 États membres pivots pour un total de **266,0 millions d'habitants** (~59,4% de l'UE à 27) :

| État | Code | Population ($M$) | Poids démographique $w_c$ | Profil socio-économique |
| :--- | :---: | :---: | :---: | :--- |
| **Allemagne** | `DE` | 84,3 | $\approx 0,3169$ ($31,69\%$) | Industrie forte, rigorisme budgétaire, pivot vert/hydrogène |
| **France** | `FR` | 64,7 | $\approx 0,2432$ ($24,32\%$) | Modèle colbertiste, nucléaire, planification stratégique |
| **Italie** | `IT` | 58,9 | $\approx 0,2214$ ($22,14\%$) | Forte dette publique, cohésion manufacturière Sud |
| **Pologne** | `PL` | 38,0 | $\approx 0,1429$ ($14,29\%$) | Rattrapage économique, forte intensité charbonnière |
| **Suède** | `SE` | 10,5 | $\approx 0,0395$ ($3,95\%$) | Modèle scandinave décarboné, fort bien-être (VEB 95) |
| **Hongrie** | `HU` | 9,6 | $\approx 0,0361$ ($3,61\%$) | Souverainisme national, vulnérabilité socio-économique |
| **Total** | — | **266,0** | **1,0000** ($100,0\%$) | — |

*Statut des données* : Populations Eurostat 2024 arrondies, convention pédagogique documentée.

---

## 2. Inventaire Exhaustif des Équations de l'Ancien Moteur

### 2.1. Initialisation à l'An 0 (2025)
$$V_{c, 0} = \text{Init}_{c} + \alpha \cdot (\text{CibleUE} - \text{Init}_{c})$$
- En Scénario 1 : $\alpha = 0,4$ pour la croissance ; $\alpha = 0,3$ pour Gini, CO₂ et VEB.
- En Scénario 2 : $\alpha = 0,4$ pour les quatre indicateurs (Normandie, V-Dem, PIB, IDH).
*Consommateur* : [`countryTrajectories.ts`](file:///c:/Users/alano/OneDrive/Documents/GitHub/ue-simu/projet2/src/simulation/countryTrajectories.ts).

### 2.2. Dynamique inter-annuelle non régulée ($t = 1 \dots 9$)
**Scénario 1 (Transition écologique)** :
$$\begin{aligned}
\text{CO2}_{c, t} &= \text{clamp}_{[2, 10]}\left(\text{CO2}_{c, t-1} + s_{\text{croiss\_co2}} \cdot \text{croiss}_{c, t-1}\right) \\
\text{VEB}_{c, t} &= \text{clamp}_{[0, 100]}\left(\text{VEB}_{c, t-1} - s_{\text{co2\_veb}} \cdot \text{CO2}_{c, t}\right) \\
\text{Gini}_{c, t} &= \text{clamp}_{[0.2, 0.6]}\left(\text{Gini}_{c, t-1} + s_{\text{veb\_gini}} \cdot \frac{100 - \text{VEB}_{c, t}}{100}\right) \\
\text{croiss}_{c, t} &= \text{clamp}_{[0, 4]}\left(\text{croiss}_{c, t-1} - s_{\text{veb\_croiss}} \cdot \left(10 - \frac{\text{VEB}_{c, t}}{10}\right) + \epsilon_t\right)
\end{aligned}$$
avec bruit pseudo-aléatoire $\epsilon_t \sim \text{PRNG.fluctuation}(0.04) \in [-0.04, +0.04]$.

**Scénario 2 (Sécurité et Démocratie)** :
$$\begin{aligned}
\text{Normandie}_{c, t} &= \text{clamp}_{[0, 100]}\left(\text{Normandie}_{c, t-1} + s_{\text{vdem\_norm}} \cdot (\text{vdem}_{c, t-1} - 0.5) \cdot 10\right) \\
\text{V-Dem}_{c, t} &= \text{clamp}_{[0, 1]}\left(\text{vdem}_{c, t-1} + s_{\text{norm\_vdem}} \cdot \left(\frac{\text{Normandie}_{c, t}}{100} - 0.5\right)\right) \\
\text{PIB}_{c, t} &= \text{clamp}_{[-2, 4]}\left(\text{PIB}_{c, t-1} + s_{\text{norm\_pib}} \cdot \left(\frac{\text{Normandie}_{c, t}}{100} - 0.5\right) + \epsilon_t\right) \\
\text{IDH}_{c, t} &= \text{clamp}_{[0, 1]}\left(\text{IDH}_{c, t-1} + s_{\text{norm\_idh}} \cdot \left(\frac{\text{Normandie}_{c, t}}{100} - 0.5\right) + s_{\text{pib\_idh}} \cdot \left(\frac{\text{PIB}_{c, t}}{4} - 0.25\right)\right)
\end{aligned}$$

### 2.3. Agrégation Européenne
Pour tout indicateur $I$ et toute année $t$ :
$$I_{\text{UE}, t} = \sum_{c \in \{\text{DE, FR, IT, PL, SE, HU}\}} w_c \cdot I_{c, t}$$

### 2.4. Score de Réussite Historique
$$Q = \text{round}\left(100 \cdot \left[ 0,4 S_f + 0,4 (1 - |0,8 - S_f|) + 0,2 (S_f - S_0) \right] \cdot 10\right) / 10$$
*Limites identifiées dans `testmot2.md`* :
- Peut chuter à $-12,0$ lors d'un effondrement (non borné à 0).
- La dérivée pour $S_f \ge 0,8$ vaut $+20 > 0$, donc $0,8$ n'est pas un maximum d'équilibre mais un simple point d'inflexion.
- Pénalise un acteur vertueux ($S_0 = 0,8$) par rapport à un acteur en retard ($S_0 = 0,2$) à résultat final identique.

---

## 3. Cas de Référence Reproductibles de l'Ancien Moteur

Les séries ci-dessous constituent l'empreinte chiffrée de référence (graine $42$) :

### Cas 1 : Scénario 1 Standard (D1 : `pib=2.0`, `gini=0.30`, `co2=8.0`, `veb=80.0`)
- **Score Réussite Global UE** : $30,9$
- **Croissance UE** : $2025: 1,44\% \to 2029: 0,38\% \to 2034: 0,11\%$ (effondrement sous l'entropie)
- **CO₂ UE** : $2025: 6,43 \to 2034: 7,51\text{ t/hab}$
- **Gini UE** : $2025: 0,309 \to 2034: 0,378$
- **VEB UE** : $2025: 80,4 \to 2034: 73,1$

### Cas 2 : Scénario 2 Standard (D1 : `normandie=85`, `vdem=0.86`, `pib=1.6`, `idh=0.93`)
- **Score Réussite Global UE** : $83,7$
- **Normandie UE** : $2025: 81,1 \to 2034: 100,0$ (saturation maximale)
- **V-Dem UE** : $2025: 0,865 \to 2034: 1,000$ (saturation maximale)
- **PIB UE** : $2025: 1,51\% \to 2034: 2,75\%$
- **IDH UE** : $2025: 0,930 \to 2034: 1,000$ (saturation maximale)

---

## 4. Registre des Coefficients et Paramètres Nationaux

| Paramètre | DE | FR | IT | PL | SE | HU | Unité / Statut |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `dev.sens.croiss_co2` | $0,13$ | $0,12$ | $0,11$ | $0,18$ | $0,07$ | $0,19$ | $\text{t/hab}/\%$ — convention pédagogique |
| `dev.sens.co2_veb` | $0,10$ | $0,11$ | $0,14$ | $0,13$ | $0,07$ | $0,16$ | $\text{pts}/(\text{t/hab})$ — convention pédagogique |
| `dev.sens.veb_gini` | $0,06$ | $0,07$ | $0,09$ | $0,08$ | $0,05$ | $0,11$ | $\text{Gini}/\text{pts}$ — convention pédagogique |
| `dev.sens.veb_croiss` | $0,07$ | $0,09$ | $0,12$ | $0,10$ | $0,06$ | $0,13$ | $\%/\text{pts}$ — convention pédagogique |
| `geo.sens.norm_vdem` | $0,10$ | $0,10$ | $0,09$ | $0,08$ | $0,12$ | $0,15$ | convention pédagogique |
| `geo.sens.vdem_norm` | $0,10$ | $0,10$ | $0,09$ | $0,08$ | $0,13$ | $0,15$ | convention pédagogique |
| `geo.sens.norm_pib` | $0,09$ | $0,08$ | $0,10$ | $0,11$ | $0,07$ | $0,13$ | convention pédagogique |
| `geo.sens.norm_idh` | $0,08$ | $0,09$ | $0,10$ | $0,09$ | $0,10$ | $0,13$ | convention pédagogique |
| `geo.sens.pib_idh` | $0,07$ | $0,07$ | $0,08$ | $0,09$ | $0,10$ | $0,13$ | convention pédagogique |
