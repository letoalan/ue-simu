import { AppState, simulationYears, partis, lobbies, pondPartis } from '../../../../state/index.js';
import { getNumericValue, normalize } from '../inputs.js';

/**
 * Fonction principale du moteur de simulation.
 * Elle exécute tous les calculs et retourne les résultats bruts.
 * Elle ne met à jour aucun élément de l'interface utilisateur.
 * @returns {{euData: object, localStatsUE: object}|null} Un objet contenant les résultats ou null en cas d'échec.
 */
export function runFullSimulation() {
    const activeScenario = AppState.currentScenarioId;
    console.log("Moteur de simulation: Démarrage pour le scénario:", activeScenario);

    // 1. Lecture des paramètres d'entrée
    const euInputs = readSimulationInputs(activeScenario);

    // 2. Simulation UE
    const euData = simulateEU(activeScenario, euInputs);
    if (!euData || !euData.arr1 || euData.arr1.length === 0) {
        console.error("ERREUR: Données de simulation UE invalides");
        return null;
    }

    // 3. Peuplement de statsUE
    const localStatsUE = populateStatsUE(euData, euInputs, activeScenario);

    // 4. Simulations des sous-systèmes
    simulerPolitique(localStatsUE, activeScenario);
    simulerLobbies(localStatsUE, activeScenario);

    console.log("Moteur de simulation: Calculs terminés.");

    // 5. Retourner toutes les données calculées pour que le contrôleur puisse mettre à jour l'UI
    return { euData, localStatsUE };
}

function readSimulationInputs(scenario) {
    const keys = scenario === 1
        ? ['pib_eu', 'gini_eu', 'co2_eu', 'veb_eu']
        : ['normandie_eu', 'vdem_eu', 'pib_growth_eu', 'idh_eu'];

    const inputs = {};
    keys.forEach(k => {
        const element = document.getElementById(k);
        inputs[k] = element ? parseFloat(element.value) || 0 : 0;
    });

    return inputs;
}

export function simulateEU(scenario, inputValues) {
    console.log("Simulation UE - Scénario:", scenario);

    const euData = { arr1: [], arr2: [], arr3: [], arr4: [], satisArr: [] };

    let pib, gini, co2, veb, normandie, vdem, pib_growth, idh;

    // Initialisation des valeurs
    if (scenario === 1) {
        pib = inputValues.pib_eu || 3;
        gini = inputValues.gini_eu || 0.3;
        co2 = inputValues.co2_eu || 4;
        veb = inputValues.veb_eu || 80;
    } else {
        normandie = inputValues.normandie_eu || 80;
        vdem = inputValues.vdem_eu || 0.85;
        pib_growth = inputValues.pib_growth_eu || 1.5;
        idh = inputValues.idh_eu || 0.92;
    }

    // Simulation sur 10 ans
    for (let i = 0; i < simulationYears.length; i++) {
        const fluctuation = (Math.random() - 0.5) * 0.1;

        if (scenario === 1) {
            // Scénario Développement Durable
            pib += pib * fluctuation;
            gini += (Math.random() - 0.5) * 0.01;
            co2 += (Math.random() - 0.5) * 0.1;
            veb += (Math.random() - 0.5) * 2;

            // Contraintes
            gini = Math.max(0.2, Math.min(0.6, gini));
            co2 = Math.max(2, Math.min(10, co2));
            veb = Math.max(0, Math.min(100, veb));

            euData.arr1.push(pib);
            euData.arr2.push(gini);
            euData.arr3.push(co2);
            euData.arr4.push(veb);

            // Satisfaction UE
            const scorePIB = normalize(pib, 0, 10);
            const scoreGini = 1 - normalize(gini, 0.2, 0.6);
            const scoreCO2 = 1 - normalize(co2, 2, 10);
            const scoreVEB = normalize(veb, 0, 100);
            euData.satisArr.push((scorePIB + scoreGini + scoreCO2 + scoreVEB) / 4);

        } else {
            // Scénario Géopolitique
            normandie += (Math.random() - 0.5) * 2;
            vdem += (Math.random() - 0.5) * 0.01;
            pib_growth += pib_growth * fluctuation;
            idh += (Math.random() - 0.5) * 0.01;

            // Contraintes
            normandie = Math.max(0, Math.min(100, normandie));
            vdem = Math.max(0, Math.min(1, vdem));
            pib_growth = Math.max(-5, Math.min(10, pib_growth));
            idh = Math.max(0, Math.min(1, idh));

            euData.arr1.push(pib_growth);
            euData.arr2.push(normandie);
            euData.arr3.push(vdem);
            euData.arr4.push(idh);

            // Satisfaction UE
            const scoreNormandie = normalize(normandie, 0, 100);
            const scoreVDem = normalize(vdem, 0, 1);
            const scorePIBGrowth = normalize(pib_growth, -5, 10);
            const scoreIDH = normalize(idh, 0, 1);
            euData.satisArr.push((scoreNormandie + scoreVDem + scorePIBGrowth + scoreIDH) / 4);
        }
    }

    return euData;
}

function populateStatsUE(euData, euInputs, scenario) {
    const statsUE = { pibArr: [], giniArr: [], co2Arr: [], vebArr: [], stabArr: [], demArr: [], idhArr: [] };

    if (scenario === 1) {
        statsUE.pibArr = euData.arr1;
        statsUE.giniArr = euData.arr2;
        statsUE.co2Arr = euData.arr3;
        statsUE.vebArr = euData.arr4;
        statsUE.stabArr = Array(10).fill(euInputs.normandie_eu || 80);
        statsUE.demArr = Array(10).fill(euInputs.vdem_eu || 0.85);
        statsUE.idhArr = Array(10).fill(euInputs.idh_eu || 0.92);
    } else {
        statsUE.pibArr = euData.arr1;
        statsUE.stabArr = euData.arr2;
        statsUE.demArr = euData.arr3;
        statsUE.idhArr = euData.arr4;
        statsUE.giniArr = Array(10).fill(euInputs.gini_eu || 0.3);
        statsUE.co2Arr = Array(10).fill(euInputs.co2_eu || 4);
        statsUE.vebArr = Array(10).fill(euInputs.veb_eu || 80);
    }
    return statsUE;
}

export function simulateCountry(profile, euInputs, scenario) {
    console.log("Simulation pays:", profile.name, "- Scénario:", scenario);

    const data = { arr1: [], arr2: [], arr3: [], arr4: [], satisArr: [] };

    if (scenario === 1) {
        let croiss = profile.dev.init.croiss + 0.4 * ((euInputs.pib || profile.dev.init.croiss) - profile.dev.init.croiss);
        let gini = profile.dev.init.gini + 0.3 * ((euInputs.gini || profile.dev.init.gini) - profile.dev.init.gini);
        let co2 = profile.dev.init.co2 + 0.3 * ((euInputs.co2 || profile.dev.init.co2) - profile.dev.init.co2);
        let veb = profile.dev.init.veb + 0.3 * ((euInputs.veb || profile.dev.init.veb) - profile.dev.init.veb);

        for (let i = 0; i < 10; i++) {
            co2 += profile.dev.sens.croiss_co2 * croiss;
            veb -= profile.dev.sens.co2_veb * co2;
            gini += profile.dev.sens.veb_gini * (100 - veb) / 100;
            croiss -= profile.dev.sens.veb_croiss * (10 - veb / 10);

            data.arr1.push(Math.max(0, Math.min(4, croiss)));
            data.arr2.push(Math.max(0.2, Math.min(0.6, gini)));
            data.arr3.push(Math.max(2, Math.min(10, co2)));
            data.arr4.push(Math.max(0, Math.min(100, veb)));

            const sat = profile.dev.pond.croiss * normalize(croiss, 0, 4) +
                profile.dev.pond.gini * (1 - normalize(gini, 0.2, 0.6)) +
                profile.dev.pond.co2 * (1 - normalize(co2, 2, 10)) +
                profile.dev.pond.veb * normalize(veb, 0, 100);

            data.satisArr.push(Math.max(0, Math.min(1, sat)));
        }
    } else {
        let normandie = profile.geo.init.normandie + 0.4 * ((euInputs.normandie || profile.geo.init.normandie) - profile.geo.init.normandie);
        let vdem = profile.geo.init.vdem + 0.4 * ((euInputs.vdem || profile.geo.init.vdem) - profile.geo.init.vdem);
        let pib = profile.geo.init.pib + 0.4 * ((euInputs.pib || profile.geo.init.pib) - profile.geo.init.pib);
        let idh = profile.geo.init.idh + 0.4 * ((euInputs.idh || profile.geo.init.idh) - profile.geo.init.idh);

        for (let i = 0; i < 10; i++) {
            normandie += profile.geo.sens.norm_vdem * (vdem - 0.5);
            vdem += profile.geo.sens.vdem_norm * (normandie / 100 - 0.5);
            pib += profile.geo.sens.norm_pib * (normandie / 100 - 0.5);
            idh += profile.geo.sens.norm_idh * (normandie / 100 - 0.5) + profile.geo.sens.pib_idh * (pib / 4 - 0.25);

            data.arr1.push(Math.max(-2, Math.min(4, pib)));
            data.arr2.push(Math.max(0, Math.min(100, normandie)));
            data.arr3.push(Math.max(0, Math.min(1, vdem)));
            data.arr4.push(Math.max(0, Math.min(1, idh)));

            const n_pib = normalize(pib, -2, 4);
            const n_normandie = normalize(normandie, 0, 100);
            const n_vdem = normalize(vdem, 0, 1);
            const n_idh = normalize(idh, 0, 1);

            const sat = profile.geo.pond.normandie * n_normandie +
                profile.geo.pond.vdem * n_vdem +
                profile.geo.pond.pib * n_pib +
                profile.geo.pond.idh * n_idh;

            data.satisArr.push(Math.max(0, Math.min(1, sat)));
        }
    }

    return data;
}

export function simulerPolitique(statsUE, scenario) {
    console.log("Simulation politique - Scénario:", scenario);

    Object.keys(partis).forEach(cle => {
        const pond = pondPartis[cle];
        const parti = partis[cle];
        parti.satisfactionArr = [];

        for (let i = 0; i < 10; i++) {
            const norm = {
                pib: normalize(statsUE.pibArr[i], -2, 4),
                gini: normalize(statsUE.giniArr[i], 0.2, 0.6),
                co2: normalize(statsUE.co2Arr[i], 2, 10),
                veb: normalize(statsUE.vebArr[i], 0, 100),
                stab: normalize(statsUE.stabArr[i], 0, 100),
                dem: normalize(statsUE.demArr[i], 0, 1),
                idh: normalize(statsUE.idhArr[i], 0, 1)
            };

            let s = calculerScoreDeBase(pond, norm, scenario);

            // Logique spécifique par parti
            switch (cle) {
                case 'VERT':
                    const ecoMultiplier = norm.veb * (1 - norm.co2);
                    s *= ecoMultiplier;
                    if (norm.veb > 0.8 && norm.co2 < 0.2) s += 0.2;
                    break;
                case 'SDE':
                case 'GUE':
                    if (norm.gini > 0.6) s -= (norm.gini - 0.6) * 1.5;
                    if (cle === 'GUE') s = Math.min(s, 0.80);
                    break;
                case 'PPE':
                    if (norm.pib < 0.4) s -= 0.2;
                    if (norm.pib > 0.7 && norm.stab > 0.7) s += 0.15;
                    break;
                case 'ECR':
                    s -= norm.dem * pond.dem * 1.2;
                    s = Math.min(s, 0.85);
                    break;
                case 'RENEW':
                    if (norm.stab < 0.5 || norm.dem < 0.5) s -= 0.3;
                    break;
            }

            parti.satisfactionArr.push(Math.max(0, Math.min(1, s)) * 100);
        }

        // Calcul des indicateurs politiques
        const sMoy5 = parti.satisfactionArr.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const sMoy10 = parti.satisfactionArr.reduce((a, b) => a + b, 0) / 10;

        parti.mepsArr = Array(5).fill(parti.base.meps)
            .concat(Array(4).fill(Math.round(parti.base.meps * (0.8 + 0.8 * sMoy5 / 100))))
            .concat([Math.round(parti.base.meps * (0.8 + 0.8 * sMoy10 / 100))]);

        parti.commissairesArr = Array(5).fill(parti.base.commissaires)
            .concat(Array(4).fill(Math.max(1, Math.round(parti.base.commissaires * (0.8 + 0.8 * sMoy5 / 100)))))
            .concat([Math.max(1, Math.round(parti.base.commissaires * (0.8 + 0.8 * sMoy10 / 100)))]);

        parti.conseilArr = Array(5).fill(parti.base.conseil)
            .concat(Array(4).fill(Math.min(100, Math.round(parti.base.conseil * (1 + 0.3 * (sMoy5 / 100 - 0.5))))))
            .concat([Math.min(100, Math.round(parti.base.conseil * (1 + 0.3 * (sMoy10 / 100 - 0.5))))]);

        parti.presArr = Array(5).fill(Math.round(parti.base.influence * 100))
            .concat(Array(4).fill(Math.round(parti.base.influence * 100 * (0.9 + 0.2 * sMoy5 / 100))))
            .concat([Math.round(parti.base.influence * 100 * (0.9 + 0.2 * sMoy10 / 100))]);

        parti.victoire = Math.round(100 * (
            0.6 * sMoy10 / 100 +
            0.2 * (parti.mepsArr[9] / 200) +
            0.2 * (parti.commissairesArr[9] / 10)
        ));

        parti.satisfaction = sMoy10;
    });
}

function calculerScoreDeBase(pond, norm, scenario) {
    let score = 0;
    let totalPoids = 0;

    if (scenario === 1) {
        score = pond.pib * norm.pib +
            pond.gini * (1 - norm.gini) +
            pond.co2 * (1 - norm.co2) +
            pond.veb * norm.veb;
        totalPoids = pond.pib + pond.gini + pond.co2 + pond.veb;
    } else {
        score = pond.pib * norm.pib +
            pond.stab * norm.stab +
            pond.dem * norm.dem +
            pond.idh * norm.idh;
        totalPoids = pond.pib + pond.stab + pond.dem + pond.idh;
    }

    return totalPoids > 0 ? score / totalPoids : 0;
}

export function simulerLobbies(statsUE, scenario) {
    console.log("Simulation lobbies - Scénario:", scenario);

    // Initialisation des tableaux de résultats
    Object.values(lobbies).forEach(lobby => {
        lobby.reputationArr = [lobby.base.reputation || 50];
        lobby.infEtatsArr = [lobby.base.infEtats || 30];
        lobby.infParlementArr = [lobby.base.infParlement || 30];
        lobby.infCommissionArr = [lobby.base.infCommission || 30];
    });

    // Simulation sur 9 années supplémentaires
    for (let i = 0; i < 9; i++) {
        const norm = {
            pib: normalize(statsUE.pibArr[i] || 0, -2, 4),
            gini: normalize(statsUE.giniArr[i] || 0.3, 0.2, 0.6),
            co2: normalize(statsUE.co2Arr[i] || 4, 2, 10),
            veb: normalize(statsUE.vebArr[i] || 80, 0, 100),
            stab: normalize(statsUE.stabArr[i] || 80, 0, 100),
            dem: normalize(statsUE.demArr[i] || 0.85, 0, 1),
            idh: normalize(statsUE.idhArr[i] || 0.92, 0, 1)
        };

        const impacts = {
            croissance: norm.pib,
            securite: norm.stab,
            stabilite: norm.stab,
            sante: norm.idh,
            ecologie: (norm.veb + (1 - norm.co2)) / 2,
            democratie: norm.dem
        };

        // Mise à jour réputation
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.facteurs?.rep) return;

            const currentRep = lobby.reputationArr[i] || 50;
            let changement_R = 0;

            for (const [facteur, ponderation] of Object.entries(lobby.facteurs.rep)) {
                if (impacts[facteur] !== undefined) {
                    changement_R += impacts[facteur] * ponderation * 10;
                }
            }

            if (Math.random() < 0.04) changement_R -= 25;

            lobby.reputationArr.push(Math.max(0, Math.min(100, currentRep + changement_R)));
        });

        // Mise à jour influence
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.facteurs?.inf) return;

            const repMultiplier = (lobby.reputationArr[i + 1] || 50) / 100;
            let changement_inf_base = 0;

            for (const [facteur, ponderation] of Object.entries(lobby.facteurs.inf)) {
                if (impacts[facteur] !== undefined) {
                    changement_inf_base += impacts[facteur] * ponderation * 8;
                }
            }

            const changement_inf_reel = changement_inf_base * repMultiplier;

            let nouvelleIE = (lobby.infEtatsArr[i] || 30) + changement_inf_reel;
            let nouvelleIM = (lobby.infParlementArr[i] || 30) + changement_inf_reel;
            let nouvelleIC = (lobby.infCommissionArr[i] || 30) + changement_inf_reel;

            // Bonus de scénario
            if (scenario === 1) nouvelleIC += changement_inf_reel > 0 ? 2 : 0;
            else nouvelleIE += changement_inf_reel > 0 ? 2 : 0;

            lobby.infEtatsArr.push(nouvelleIE);
            lobby.infParlementArr.push(nouvelleIM);
            lobby.infCommissionArr.push(nouvelleIC);
        });

        // Dynamique concurrentielle
        Object.values(lobbies).forEach(lobby => {
            if (!lobby.ennemis) return;

            let malus_ennemi = 0;
            lobby.ennemis.forEach(ennemi => {
                if (impacts[ennemi] > 0.6) {
                    malus_ennemi -= impacts[ennemi] * 3;
                }
            });

            lobby.infEtatsArr[i + 1] = Math.max(0, Math.min(100, lobby.infEtatsArr[i + 1] + malus_ennemi));
            lobby.infParlementArr[i + 1] = Math.max(0, Math.min(100, lobby.infParlementArr[i + 1] + malus_ennemi));
            lobby.infCommissionArr[i + 1] = Math.max(0, Math.min(100, lobby.infCommissionArr[i + 1] + malus_ennemi));
        });
    }

    // Calcul des scores finaux
    Object.values(lobbies).forEach(lobby => {
        const lastIndex = simulationYears.length - 1;
        if (lobby.infEtatsArr.length > lastIndex &&
            lobby.infParlementArr.length > lastIndex &&
            lobby.infCommissionArr.length > lastIndex) {

            const ie = lobby.infEtatsArr[lastIndex] || 0;
            const ip = lobby.infParlementArr[lastIndex] || 0;
            const ic = lobby.infCommissionArr[lastIndex] || 0;

            lobby.scoreDeReussite = (ie + ip + ic) / 3;
        } else {
            lobby.scoreDeReussite = 0;
        }
    });

    return { influenceScores: Array(10).fill(0) };
}

function showScore(satisArr, elementId) {
    const adhInit = satisArr[0];
    const adhFin = satisArr[satisArr.length - 1];
    const ecart = adhFin - adhInit;

    const scoreSucces = (0.4 * adhFin + 0.4 * (1 - Math.abs(0.8 - adhFin)) + 0.2 * ecart) * 100;
    const icon = ecart > 0.1 ? "📈" : ecart < -0.1 ? "📉" : "➡️";

    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div style="margin-bottom:4px;">
                <b>${icon} Score de réussite :</b> <span style="font-weight:600">${scoreSucces.toFixed(1)}/100</span>
            </div>
            <div style="font-size:0.94em; color:#555; line-height:1.4;">
                <div>• Niveau initial: ${(adhInit * 100).toFixed(1)}%</div>
                <div>• Niveau final: ${adhFin.toFixed(2)}%</div>
                <div>• Progression: ${ecart >= 0 ? "+" : ""}${(ecart * 100).toFixed(1)} points</div>
            </div>`;
    }
}