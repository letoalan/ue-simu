import { AppState, DOMRefs, euStatesData, partis, profiles } from '../../../state/index.js';
import { showTab } from '../tabs-router.js';

// --- CONFIGURATION & STATE ---

let VOTE_STEPS = []; // Sera peuplé dynamiquement à partir des données du scénario
const VOTE_STATES = ['pour', 'abstention', 'contre'];

// État local du module
let votes = {};
let stepStatus = {}; // Ex: { directive: { validated: false, unlocked: true }, ... }
let currentStepId = null;
let charts = {};

/**
 * Point d'entrée du module de vote.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module de Vote (Séquentiel).");

    // SÉCURITÉ : Vérifier que les données nécessaires sont présentes dans l'état global.
    if (!AppState.currentScenarioData || !AppState.selectedDirectiveId) {
        console.error("ERREUR: Données de scénario ou de directive non disponibles. L'onglet de vote ne peut pas s'initialiser.");
        const voteArea = document.getElementById('vote-content-area');
        if (voteArea) {
            voteArea.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Erreur : Veuillez d'abord sélectionner un scénario et une directive depuis l'accueil.</p>`;
        }
        return;
    }

    buildVoteSteps(); // Construire les étapes dynamiquement

    if (VOTE_STEPS.length === 0) {
        console.error("ERREUR: Aucune étape de vote n'a pu être construite. Vérifiez les données de la directive.");
        return;
    }

    initializeState();
    renderStepSelector();
    renderStepContent(currentStepId);
    attachGlobalEventListeners();
}

/**
 * Construit dynamiquement la liste des étapes de vote à partir des données du scénario.
 */
function buildVoteSteps() {
    const directive = AppState.currentScenarioData.directive.find(d => d.id === AppState.selectedDirectiveId);

    if (!directive || !directive.amendements) {
        console.error("La directive ou ses amendements n'ont pas pu être trouvés dans les données du scénario.");
        VOTE_STEPS = [];
        return;
    }

    VOTE_STEPS = [
        { id: 'directive', name: 'Directive Générale', description: directive.description },
        ...directive.amendements.map((amend, index) => ({
            id: `amend-${index + 1}`,
            name: `Amendement ${index + 1}`,
            description: amend.description,
            amendId: amend.id // Garder l'ID original pour le calcul des résultats
        })),
        { id: 'package', name: 'Package Final', description: 'Vote sur le texte final incluant les amendements adoptés.' }
    ];

    currentStepId = VOTE_STEPS.length > 0 ? VOTE_STEPS[0].id : null;
}

/**
 * Initialise l'état des votes et des étapes.
 */
function initializeState() {
    votes = { states: {}, parliament: {} };
    euStatesData.forEach(state => {
        votes.states[state.code] = {};
        VOTE_STEPS.forEach(step => votes.states[state.code][step.id] = 'abstention');
    });
    Object.keys(partis).forEach(partyKey => {
        votes.parliament[partyKey] = {};
        VOTE_STEPS.forEach(step => votes.parliament[partyKey][step.id] = 'abstention');
    });

    stepStatus = {};
    VOTE_STEPS.forEach((step, index) => {
        stepStatus[step.id] = {
            validated: false,
            unlocked: index === 0 // Seule la première étape est déverrouillée au départ
        };
    });
    currentStepId = VOTE_STEPS.length > 0 ? VOTE_STEPS[0].id : null;
}

// --- RENDERING ---

/**
 * Génère le sélecteur de navigation pour chaque étape de vote.
 */
function renderStepSelector() {
    const selectorContainer = document.getElementById('vote-step-selector-container');
    if (!selectorContainer) return;

    selectorContainer.innerHTML = '';
    const select = document.createElement('select');
    select.className = 'sim-selector vote-step-selector';

    VOTE_STEPS.forEach(step => {
        const option = document.createElement('option');
        option.value = step.id;
        option.textContent = `${stepStatus[step.id].validated ? '✓ ' : ''}${step.name}`;
        option.disabled = !stepStatus[step.id].unlocked;
        select.appendChild(option);
    });

    select.value = currentStepId;

    select.addEventListener('change', (e) => {
        currentStepId = e.target.value;
        renderStepSelector(); // Re-génère pour mettre à jour l'état visuel
        renderStepContent(currentStepId);
    });

    selectorContainer.appendChild(select);
}

/**
 * Affiche le contenu complet pour une étape de vote donnée.
 * @param {string} stepId - L'ID de l'étape à afficher (ex: 'directive').
 */
function renderStepContent(stepId) {
    const wrapper = document.getElementById('vote-step-content-wrapper');
    if (!wrapper) return;

    const currentStepData = VOTE_STEPS.find(s => s.id === stepId);
    const isStepValidated = stepStatus[stepId]?.validated;
    const validatedClass = isStepValidated ? 'validated' : '';

    const stepDescriptionHTML = currentStepData
        ? `<h3 class="step-description-title">${currentStepData.name}: <span class="step-description-text">${currentStepData.description}</span></h3>`
        : '';

    // Contenu vertical : Graph Conseil, Tableau Conseil, Graph Parlement, Tableau Parlement
    const contentHTML = `
        <div class="viz-container step-viz-header">
            <h4>Vote du Conseil</h4>
            <div class="progress-bar-container">
                <div id="council-progress-bar" class="progress-bar">0%</div>
            </div>
            <div class="viz-summary-text" id="council-summary-text"></div>
        </div>
        <div class="vote-table-container ${validatedClass}">
            <h3>Votes des États Membres</h3>
            <div class="vote-table-wrapper">
                ${createVoteTableHTML('states', euStatesData, 'code', 'name', stepId)}
            </div>
        </div>
        <div class="viz-container step-viz-header parliament-viz-container">
            <h4>Vote du Parlement</h4>
            <canvas id="parliament-hemicycle-chart"></canvas>
            <div class="viz-summary-text" id="parliament-summary-text"></div>
        </div>
        <div class="vote-table-container ${validatedClass}">
            <h3>Votes des Groupes Parlementaires</h3>
            <div class="vote-table-wrapper">
                ${createVoteTableHTML('parliament', Object.entries(partis).map(([key, value]) => ({ code: key, nom: value.nom })), 'code', 'nom', stepId)}
            </div>
        </div>
    `;

    wrapper.innerHTML = stepDescriptionHTML + contentHTML;

    // Initialiser les graphiques et mettre à jour les visuels
    initializeStepCharts(stepId);
    updateVisualsForStep(stepId);
    updateValidationButton();
}

/**
 * Crée le HTML pour un tableau de vote pour une étape spécifique.
 */
function createVoteTableHTML(type, actors, keyField, nameField, stepId) {
    if (!actors || !Array.isArray(actors)) {
        console.error(`ERREUR createVoteTableHTML: 'actors' est invalide pour le type '${type}'.`, actors);
        return '<table><tr><td>Erreur de données pour les acteurs.</td></tr></table>';
    }

    let headHTML = '<tr><th>Acteur</th><th>Vote</th></tr>';
    let bodyHTML = '';

    actors.forEach((actor, index) => {
        // SÉCURITÉ : On vérifie que l'acteur et ses propriétés existent.
        if (!actor || actor[keyField] === undefined || actor[nameField] === undefined) {
            console.warn(`WARN createVoteTableHTML: L'acteur à l'index ${index} est invalide pour le type '${type}'.`, actor);
            return; // On saute cet acteur pour éviter le crash.
        }

        const actorKey = actor[keyField];
        const actorName = actor[nameField];

        bodyHTML += `<tr><td class="actor-name">${actorName}</td><td class="vote-cell">`;
        VOTE_STATES.forEach(state => {
            const id = `${type}-${actorKey}-${stepId}-${state}`;
            const name = `${type}-${actorKey}-${stepId}`;
            // SÉCURITÉ RENFORCÉE : On utilise l'optional chaining (?.) pour un accès sûr.
            const isChecked = votes[type]?.[actorKey]?.[stepId] === state;
            bodyHTML += `
                <input type="radio" id="${id}" name="${name}" value="${state}" 
                       data-type="${type}" data-actor="${actorKey}" data-item="${stepId}" 
                       ${isChecked ? 'checked' : ''} ${stepStatus[stepId]?.validated ? 'disabled' : ''}>
                <label for="${id}" class="vote-${state}" title="${state}"></label>
            `;
        });
        bodyHTML += `</td></tr>`;
    });

    return `<table class="vote-table"><thead>${headHTML}</thead><tbody>${bodyHTML}</tbody></table>`;
}


// --- CHARTS & VISUALS ---

/**
 * Initialise les graphiques pour l'étape de vote actuelle.
 */
function initializeStepCharts(stepId) {
    if (charts.parliament) charts.parliament.destroy();

    const parliamentCanvas = document.getElementById('parliament-hemicycle-chart');
    if (parliamentCanvas) {
        charts.parliament = new Chart(parliamentCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Pour', 'Abstention', 'Contre'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                rotation: -90,
                circumference: 180,
                cutout: '50%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    }
}

/**
 * Met à jour toutes les visualisations pour l'étape actuelle.
 */
function updateVisualsForStep(stepId) {
    console.log(`  -> [VOTE LOG 2] Mise à jour des graphiques pour l'étape : ${stepId}`);
    updateCouncilVisual(stepId);
    updateParliamentVisual(stepId);
}

function updateCouncilVisual(stepId) {
    console.log(`%c--- [COUNCIL VIZ LOG] Début de updateCouncilVisual pour ${stepId} ---`, "color: purple; font-weight: bold;");

    const progressBar = document.getElementById('council-progress-bar');
    const summaryText = document.getElementById('council-summary-text');
    if (!progressBar || !summaryText) {
        console.error(`  -> ERREUR: progressBar ou summaryText introuvable.`);
        return;
    }
    console.log("  -> Éléments DOM trouvés:", { progressBar, summaryText });

    let populationPour = 0;
    let totalPopulation = 0;
    let statesPour = 0;
    let statesContre = 0;

    euStatesData.forEach(state => {
        totalPopulation += state.population || 0; // SÉCURITÉ: Utilise 0 si la population est undefined
        const vote = votes.states[state.code]?.[stepId];
        if (vote === 'pour') {
            populationPour += state.population || 0; // SÉCURITÉ: Utilise 0 si la population est undefined
            statesPour++;
        } else if (vote === 'contre') {
            statesContre++;
        }
        console.log(`    - ${state.code}: vote='${vote}', pop=${state.population || 0}`);
    });

    console.log("  -> Totaux calculés:", { populationPour, totalPopulation, statesPour });

    const popPercentage = totalPopulation > 0 ? (populationPour / totalPopulation) * 100 : 0;
    const statesPercentage = (statesPour / euStatesData.length) * 100;

    console.log("  -> Pourcentages calculés:", { popPercentage: popPercentage.toFixed(2), statesPercentage: statesPercentage.toFixed(2) });

    let majorityReached;
    let ruleText;

    if (stepId === 'directive') {
        // Règle de la majorité simple pour la directive générale
        majorityReached = statesPour > statesContre;
        ruleText = `Majorité simple (${Math.ceil((statesPour + statesContre + 1) / 2)} états) :`;
    } else {
        // Règle de la majorité qualifiée pour les amendements et le package
        const mqPopReached = popPercentage >= 65;
        const mqStatesReached = statesPour >= (euStatesData.length * 0.55);
        majorityReached = mqPopReached && mqStatesReached;
        ruleText = `MQ (${Math.ceil(euStatesData.length * 0.55)} états & 65% pop.) :`;
    }

    console.log("  -> Majorité atteinte:", { majorityReached });

    progressBar.style.width = `${popPercentage.toFixed(1)}%`;
    progressBar.textContent = `${popPercentage.toFixed(0)}%`;
    progressBar.className = 'progress-bar'; // Reset
    if (majorityReached) {
        progressBar.classList.add('green');
    } else if (popPercentage > 50 || statesPour >= (euStatesData.length * 0.4)) {
        progressBar.classList.add('orange');
        console.log("  -> Classe appliquée: 'orange'");
    } else {
        console.log("  -> Aucune classe de couleur appliquée (gris par défaut).");
    }

    console.log(`  -> Application au DOM: progressBar.style.width = "${progressBar.style.width}", progressBar.textContent = "${progressBar.textContent}"`);
    summaryText.textContent = `${statesPour}/${euStatesData.length} États (${statesPercentage.toFixed(0)}%) - ${popPercentage.toFixed(0)}% pop. | ${ruleText} ${majorityReached ? 'Atteinte' : 'Non atteinte'}`;
    console.log(`%c--- [COUNCIL VIZ LOG] Fin de updateCouncilVisual ---`, "color: purple;");
}

function updateParliamentVisual(stepId) {
    if (!charts.parliament) return;
    const summaryText = document.getElementById('parliament-summary-text');

    const totals = { pour: 0, abstention: 0, contre: 0 };
    let totalMeps = 0;
    Object.keys(partis).forEach(partyKey => {
        const partyMeps = partis[partyKey].base.meps;
        totalMeps += partyMeps;
        const vote = votes.parliament[partyKey][stepId];
        totals[vote] += partyMeps;
    });

    let majorityReached;
    let ruleText;

    if (stepId === 'directive') {
        // Règle de la majorité simple pour la directive générale
        majorityReached = totals.pour > totals.contre;
        ruleText = `Majorité simple :`;
    } else {
        // Règle de la majorité absolue pour les amendements et le package
        majorityReached = totals.pour > (totalMeps / 2);
        ruleText = `Majorité absolue (${Math.ceil(totalMeps / 2)} sièges) :`;
    }

    charts.parliament.data.datasets[0].data = [totals.pour, totals.abstention, totals.contre];
    charts.parliament.update('none'); // 'none' pour une mise à jour sans animation, plus fluide
    console.log(`    [Parlement - ${stepId}] Sièges:`, totals);

    if (summaryText) {
        summaryText.textContent = `${totals.pour} sièges "Pour". ${ruleText} ${majorityReached ? 'Atteinte' : 'Non atteinte'}.`;
    }
}


// --- EVENT LISTENERS ---

/**
 * Attache les écouteurs d'événements globaux à l'onglet.
 */
function attachGlobalEventListeners() {
    const contentArea = document.getElementById('vote-content-area');
    if (contentArea) {
        // Utilise la délégation d'événement pour les boutons radio
        contentArea.addEventListener('change', (event) => {
            if (event.target.type === 'radio' && (event.target.name.startsWith('states-') || event.target.name.startsWith('parliament-'))) {
                handleVoteChange(event);
            }
        });
    }

    const validateBtn = document.getElementById('validate-step-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', handleValidateClick);
    }

    const applyBtn = document.getElementById('applyVoteResultsBtn');
    if(applyBtn) {
        applyBtn.addEventListener('click', applyVoteResults);
    }
}

/**
 * Gère le changement de vote.
 */
function handleVoteChange(event) {
    // LOG 1: Vérifier ce que l'on reçoit de l'événement
    console.log("%c--- [VOTE LOG 1] Vote détecté ---", "color: orange; font-weight: bold;");
    console.log("Élément cliqué:", event.target);
    console.log("Dataset de l'élément:", event.target.dataset);
    console.log("Valeur de l'élément (event.target.value):", event.target.value);

    const { type, actor, item } = event.target.dataset;
    const value = event.target.value; // CORRECTION : La valeur vient de .value, pas de .dataset.value

    if (!type || !actor || !item || !value) {
        console.error("ERREUR: Données de vote manquantes dans l'événement.", { type, actor, item, value });
        return;
    }

    votes[type][actor][item] = value;
    updateVisualsForStep(item);
}

/**
 * Gère la validation d'une étape.
 */
function handleValidateClick() {
    stepStatus[currentStepId].validated = true;
    // NOUVEAU: Mettre à jour les résumés après validation
    updateSummaries();

    const currentIndex = VOTE_STEPS.findIndex(s => s.id === currentStepId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < VOTE_STEPS.length) {
        const nextStep = VOTE_STEPS[nextIndex];
        stepStatus[nextStep.id].unlocked = true;
        currentStepId = nextStep.id;
        renderStepSelector();
        renderStepContent(currentStepId);
    } else {
        // Dernière étape validée
        renderStepSelector(); // Met à jour le dernier item en 'validé'
        document.getElementById('validate-step-btn').style.display = 'none';
        document.getElementById('final-results-section').style.display = 'block';

        // NOUVEAU: Déverrouiller l'onglet simulateur
        if (DOMRefs.simulatorTabBtn) {
            DOMRefs.simulatorTabBtn.disabled = false;
            DOMRefs.simulatorTabBtn.title = 'Accéder au simulateur';
        }
        alert("Tous les votes sont terminés ! Cliquez sur 'Appliquer les résultats' pour calculer l'impact final.");
    }
}

function updateValidationButton() {
    const validateBtn = document.getElementById('validate-step-btn');
    if (validateBtn) {
        validateBtn.disabled = stepStatus[currentStepId].validated;
        validateBtn.textContent = stepStatus[currentStepId].validated ? 'Vote Verrouillé' : 'Valider ce vote';
    }
}

// --- LOGIQUE FINALE ---

/**
 * Orchestre la mise à jour des deux tableaux récapitulatifs.
 */
function updateSummaries() {
    const summarySection = document.getElementById('vote-summary-section');
    if (!summarySection) return;

    summarySection.style.display = 'grid'; // Rendre la section visible

    renderVoteOutcomeTable();
    renderIndicatorImpactTable();
}

/**
 * Calcule le résultat (adopté/rejeté) d'une étape de vote.
 * @param {string} stepId - L'ID de l'étape.
 * @returns {{passed: boolean, councilPassed: boolean, parliamentPassed: boolean}}
 */
function getStepOutcome(stepId) {
    // Calcul pour le Conseil
    let councilPopFor = 0, councilTotalPop = 0, councilStatesFor = 0, councilStatesAgainst = 0;
    euStatesData.forEach(state => {
        councilTotalPop += state.population || 0;
        const vote = votes.states[state.code]?.[stepId];
        if (vote === 'pour') {
            councilPopFor += state.population || 0;
            councilStatesFor++;
        } else if (vote === 'contre') {
            councilStatesAgainst++;
        }
    });
    const popPercentage = councilTotalPop > 0 ? (councilPopFor / councilTotalPop) * 100 : 0;
    const councilPassed = (stepId === 'directive')
        ? councilStatesFor > councilStatesAgainst
        : (popPercentage >= 65 && councilStatesFor >= (euStatesData.length * 0.55));

    // Calcul pour le Parlement
    let parliamentSeatsFor = 0, parliamentSeatsAgainst = 0, totalMeps = 0;
    Object.keys(partis).forEach(partyKey => {
        const partyMeps = partis[partyKey].base.meps;
        totalMeps += partyMeps;
        const vote = votes.parliament[partyKey]?.[stepId];
        if (vote === 'pour') parliamentSeatsFor += partyMeps;
        if (vote === 'contre') parliamentSeatsAgainst += partyMeps;
    });
    const parliamentPassed = (stepId === 'directive')
        ? parliamentSeatsFor > parliamentSeatsAgainst
        : parliamentSeatsFor > (totalMeps / 2);

    return { passed: councilPassed && parliamentPassed, councilPassed, parliamentPassed };
}

/**
 * Affiche le tableau récapitulatif des résultats des votes.
 */
function renderVoteOutcomeTable() {
    const wrapper = document.getElementById('vote-results-summary-table-wrapper');
    if (!wrapper) return;

    let tableHTML = '<table class="summary-table"><thead><tr><th>Item Voté</th><th>Résultat</th></tr></thead><tbody>';
    VOTE_STEPS.forEach(step => {
        if (stepStatus[step.id].validated) {
            const outcome = getStepOutcome(step.id);
            stepStatus[step.id].passed = outcome.passed; // Stocke le résultat pour un accès facile
            const icon = outcome.passed ? '✅' : '❌';
            tableHTML += `<tr><td>${step.name}</td><td class="result-icon">${icon}</td></tr>`;
        }
    });
    tableHTML += '</tbody></table>';
    wrapper.innerHTML = tableHTML;
}

/**
 * Affiche le tableau récapitulatif de l'impact sur les indicateurs.
 */
function renderIndicatorImpactTable() {
    const wrapper = document.getElementById('indicator-impact-summary-table-wrapper');
    if (!wrapper) return;

    const directive = AppState.currentScenarioData.directive.find(d => d.id === AppState.selectedDirectiveId);
    if (!directive) return;

    const initialStats = directive.statistiques_depart;

    // --- NOUVELLE LOGIQUE : Définir les indicateurs et leur "sens" par scénario ---
    const scenarioId = AppState.currentScenarioId;
    const indicatorConfig = {
        1: { // Scénario 1: Développement Durable
            pib_eu: { label: 'PIB', positiveIsGood: true },
            gini_eu: { label: 'Gini', positiveIsGood: false }, // Plus bas c'est mieux
            co2_eu: { label: 'CO2', positiveIsGood: false },  // Plus bas c'est mieux
            veb_eu: { label: 'VEB', positiveIsGood: true }
        },
        2: { // Scénario 2: Stabilité Géopolitique
            normandie_eu: { label: 'Normandie', positiveIsGood: true },
            vdem_eu: { label: 'V-Dem', positiveIsGood: true },
            pib_growth_eu: { label: 'Croissance', positiveIsGood: true },
            idh_eu: { label: 'IDH', positiveIsGood: true }
        }
    };

    const relevantIndicators = indicatorConfig[scenarioId] || {};
    const indicatorKeys = Object.keys(relevantIndicators);

    // --- Calcul des stats finales (inchangé mais plus robuste grâce à indicatorKeys) ---
    const passedAmendments = VOTE_STEPS
        .filter(step => step.id.startsWith('amend-') && stepStatus[step.id]?.validated && stepStatus[step.id]?.passed)
        .map(step => directive.amendements.find(a => a.id === step.amendId))
        .filter(Boolean);

    const finalStats = { ...initialStats };
    if (passedAmendments.length > 0) {
        const impactSum = {}, impactCount = {};
        indicatorKeys.forEach(key => { impactSum[key] = 0; impactCount[key] = 0; });
        passedAmendments.forEach(amend => {
            for (const key in amend.impact) {
                if (impactSum.hasOwnProperty(key)) {
                    impactSum[key] += amend.impact[key];
                    impactCount[key]++;
                }
            }
        });
        indicatorKeys.forEach(key => {
            if (impactCount[key] > 0) finalStats[key] = impactSum[key] / impactCount[key];
        });
    }

    // --- Génération du tableau (maintenant dynamique) ---
    let tableHTML = '<table class="summary-table"><thead><tr><th>Indicateur</th><th>Initial</th><th>Calculé</th><th>Variation</th></tr></thead><tbody>';
    indicatorKeys.forEach(key => {
        const config = relevantIndicators[key];
        const initialValue = initialStats[key] ?? 0;
        const calculatedValue = finalStats[key] ?? initialValue;
        const variation = calculatedValue - initialValue;

        let variationClass = 'neutral';
        if (variation > 0.01) variationClass = config.positiveIsGood ? 'positive' : 'negative';
        if (variation < -0.01) variationClass = config.positiveIsGood ? 'negative' : 'positive';

        tableHTML += `<tr><td>${config.label}</td><td>${initialValue.toFixed(2)}</td><td>${calculatedValue.toFixed(2)}</td><td class="variation ${variationClass}">${variation > 0 ? '+' : ''}${variation.toFixed(2)}</td></tr>`;
    });
    tableHTML += '</tbody></table>';
    wrapper.innerHTML = tableHTML;
}

/**
 * Calcule les statistiques finales en fonction des amendements adoptés.
 * @returns {{finalStats: object, indicatorKeys: string[], relevantIndicators: object}|null}
 */
function calculateFinalStats() {
    const directive = AppState.currentScenarioData.directive.find(d => d.id === AppState.selectedDirectiveId);
    if (!directive) return null;

    const initialStats = directive.statistiques_depart;
    const scenarioId = AppState.currentScenarioId;
    const indicatorConfig = {
        1: { pib_eu: { label: 'PIB' }, gini_eu: { label: 'Gini' }, co2_eu: { label: 'CO2' }, veb_eu: { label: 'VEB' } },
        2: { normandie_eu: { label: 'Normandie' }, vdem_eu: { label: 'V-Dem' }, pib_growth_eu: { label: 'Croissance' }, idh_eu: { label: 'IDH' } }
    };

    const relevantIndicators = indicatorConfig[scenarioId] || {};
    const indicatorKeys = Object.keys(relevantIndicators);

    const passedAmendments = VOTE_STEPS
        .filter(step => step.id.startsWith('amend-') && stepStatus[step.id]?.validated && stepStatus[step.id]?.passed)
        .map(step => directive.amendements.find(a => a.id === step.amendId))
        .filter(Boolean);

    const finalStats = { ...initialStats };
    if (passedAmendments.length > 0) {
        const impactSum = {}, impactCount = {};
        indicatorKeys.forEach(key => { impactSum[key] = 0; impactCount[key] = 0; });
        passedAmendments.forEach(amend => {
            for (const key in amend.impact) {
                if (impactSum.hasOwnProperty(key)) {
                    impactSum[key] += amend.impact[key];
                    impactCount[key]++;
                }
            }
        });
        indicatorKeys.forEach(key => {
            if (impactCount[key] > 0) finalStats[key] = impactSum[key] / impactCount[key];
        });
    }
    return { finalStats, indicatorKeys, relevantIndicators };
}

/**
 * Affiche les résultats finaux dans l'onglet du simulateur sans y basculer.
 */
function applyVoteResults() {
    console.log("Affichage des résultats finaux pour le simulateur...");

    const resultsContainer = DOMRefs.voteResultsForSimulator;
    if (!resultsContainer) {
        console.error("Le conteneur pour les résultats du vote dans l'onglet simulateur est introuvable.");
        return;
    }

    const calculation = calculateFinalStats();
    if (!calculation) {
        alert("Erreur lors du calcul des résultats finaux.");
        return;
    }

    const { finalStats, indicatorKeys, relevantIndicators } = calculation;

    // --- Formatage et affichage ---
    let html = `<h4>Valeurs finales issues du vote (à reporter dans les inputs ci-dessous) :</h4><ul>`;
    indicatorKeys.forEach(key => {
        const config = relevantIndicators[key];
        const finalValue = finalStats[key] ?? 0;
        html += `<li><strong>${config.label}:</strong> ${finalValue.toFixed(2)}</li>`;
    });
    html += `</ul>`;

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';

    showToast("Les valeurs du vote sont prêtes dans l'onglet Simulateur !");

    // Désactiver le bouton après utilisation pour éviter de multiples clics
    const applyBtn = document.getElementById('applyVoteResultsBtn');
    if (applyBtn) {
        applyBtn.textContent = "Résultats Appliqués ✓";
        applyBtn.disabled = true;
    }
}

/**
 * Affiche une notification "toast" temporaire en bas de l'écran.
 * @param {string} message - Le message à afficher.
 * @param {number} duration - La durée d'affichage en millisecondes.
 */
function showToast(message, duration = 4000) {
    // Supprimer un toast existant s'il y en a un
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animation d'apparition
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Animation de disparition
    setTimeout(() => {
        toast.classList.remove('show');
        // Supprimer l'élément du DOM après la transition
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, duration);
}