import { AppState, ChartInstances, simulationYears } from '../../../state/index.js';
import { updateContentDisplay } from '../content-display-manager.js';
import { simulateEU } from '../simulator/engine/index.js';

// Pour stocker les données de la fiche une fois chargées
let partisFicheData = null;
let partisDetailedData = null; // NOUVEAU: Données détaillées depuis par_s1-d1.json

// Liste des partis européens avec leurs informations
const europeanParties = [
    { id: 'verts', name: 'Verts/ALE', fullName: 'Verts/Alliance Libre Européenne' },
    { id: 'sd', name: 'S&D', fullName: 'Socialistes et Démocrates' },
    { id: 'renew', name: 'Renew Europe', fullName: 'Renew Europe' },
    { id: 'ppe', name: 'PPE', fullName: 'Parti Populaire Européen' },
    { id: 'ecr', name: 'ECR', fullName: 'Conservateurs et Réformistes Européens' },
    { id: 'gue', name: 'GUE/NGL', fullName: 'Gauche Unitaire Européenne/Gauche Verte Nordique' }
];

// Fonction utilitaire pour les chemins d'images
function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    if (hostname.includes('github.io')) {
        if (pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        } else {
            const pathParts = pathname.split('/').filter(part => part !== '');
            if (pathParts.length > 0) {
                return `/${pathParts[0]}${relativePath}`;
            }
        }
        return relativePath;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168')) {
        return `.${relativePath}`;
    }
    return `.${relativePath}`;
}

// Configuration des indicateurs et de leurs libellés par scénario
const chartConfig = {
    1: {
        pib_eu: 'PIB (%)',
        gini_eu: 'Gini',
        co2_eu: 'CO₂/hab (t)',
        veb_eu: 'VEB'
    },
    2: {
        pib_growth_eu: 'Croissance (%)',
        normandie_eu: 'Stabilité',
        vdem_eu: 'V-Dem',
        idh_eu: 'IDH'
    }
};

// NOUVEAU: Fonctions utilitaires pour gérer les structures de données
function getPartyData(data, partyId) {
    // Si c'est un fichier par_s1-d1.json (array de partis)
    if (Array.isArray(data)) {
        return data.find(p => p.actor_id === partyId || p.nom.includes(getPartyName(partyId)));
    }
    // Sinon structure classique s1-d1.json (à adapter si nécessaire)
    return data?.parties?.find(p => p.actor_id === partyId);
}

function getPartyName(partyId) {
    const party = europeanParties.find(p => p.id === partyId);
    return party ? party.name : partyId;
}

function getPartyFullName(partyId) {
    const party = europeanParties.find(p => p.id === partyId);
    return party ? party.fullName : partyId;
}

function getAmendments(partyData) {
    // Priorité aux positions_amendements (plus détaillé)
    if (partyData?.positions_amendements) {
        return partyData.positions_amendements;
    }
    return partyData?.impacts_amendements || [];
}

// NOUVEAU: Charger les données détaillées depuis par_s1-d1.json
async function loadPartisDetailedData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Scénario ou Directive non sélectionné.");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/par_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("Chargement données détaillées Partis:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        partisDetailedData = await response.json();
        console.log("Données détaillées Partis chargées:", partisDetailedData);
        return true;
    } catch (error) {
        console.error("Impossible de charger les données détaillées Partis:", error);
        partisDetailedData = null;
        return false;
    }
}

/**
 * Charge les données JSON spécifiques à la fiche des Partis.
 */
async function loadPartisFicheData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Fiche Partis: Scénario ou Directive non sélectionné.");
        return false;
    }

    // Essayer d'abord de charger les données détaillées
    await loadPartisDetailedData();

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/s${currentScenarioId}-d${selectedDirectiveId}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        partisFicheData = await response.json();
        return true;
    } catch (error) {
        console.error("Impossible de charger les données de la fiche Partis:", error);
        const container = document.getElementById('fiches-partis-text');
        if (container) {
            container.innerHTML = `<p style="color: red;">Erreur: Impossible de charger les données pour cette fiche.</p>`;
        }
        return false;
    }
}

/**
 * Peuple les sélecteurs avec les partis et les amendements.
 */
function populatePartisSelectors() {
    const partyMenu = document.getElementById('fiches-partis-party-menu');
    const directiveMenu = document.getElementById('fiches-partis-directive-menu');

    if (!partyMenu || !directiveMenu) return;

    // Utiliser les données détaillées si disponibles
    const dataSource = partisDetailedData || partisFicheData;
    if (!dataSource) return;

    // Remplir le menu des partis
    partyMenu.innerHTML = '';
    europeanParties.forEach(party => {
        partyMenu.innerHTML += `<option value="${party.id}">${party.name}</option>`;
    });

    // Remplir le menu des amendements (basé sur le premier parti par défaut)
    const firstPartyData = getPartyData(dataSource, europeanParties[0].id);
    if (firstPartyData) {
        updateAmendmentSelector(firstPartyData);
    }
}

/**
 * Met à jour le sélecteur d'amendements en fonction du parti sélectionné.
 */
function updateAmendmentSelector(partyData) {
    const directiveMenu = document.getElementById('fiches-partis-directive-menu');
    if (!directiveMenu) return;

    directiveMenu.innerHTML = '<option value="directive">Directive</option>';

    // Récupérer les amendements depuis positions_amendements
    const positions = partyData.positions_amendements || [];
    const impacts = partyData.impacts_amendements || [];

    if (positions.length > 0) {
        positions.forEach(pos => {
            const amendId = pos.amendement;
            // Chercher le titre dans impacts_amendements si disponible
            const impact = impacts.find(imp => imp.id === amendId);
            const amendTitle = pos.titre || impact?.description || `Amendement ${amendId}`;
            directiveMenu.innerHTML += `<option value="${amendId}">${amendTitle}</option>`;
        });
    } else if (impacts.length > 0) {
        // Fallback sur impacts_amendements si positions n'est pas disponible
        impacts.forEach(amend => {
            const amendId = amend.id;
            const amendTitle = amend.description || `Amendement ${amendId}`;
            directiveMenu.innerHTML += `<option value="${amendId}">${amendTitle}</option>`;
        });
    }
}



// NOUVEAU: Fonctions pour le code couleur des positions
function getPositionColor(position) {
    const colors = {
        'FAVORABLE': '#4caf50',
        'FAVORABLE_CONDITIONNEL': '#8bc34a',
        'NEUTRE': '#9e9e9e',
        'DEFAVORABLE_PARTIEL': '#ff9800',
        'DEFAVORABLE': '#f44336',
        'Défavorable': '#f44336'
    };
    return colors[position] || '#9e9e9e';
}

function getPositionEmoji(position) {
    const emojis = {
        'FAVORABLE': '🟢',
        'FAVORABLE_CONDITIONNEL': '🟡',
        'NEUTRE': '⚪',
        'DEFAVORABLE_PARTIEL': '🟠',
        'DEFAVORABLE': '🔴',
        'Défavorable': '🔴'
    };
    return emojis[position] || '⚪';
}

function getPriorityDisplay(priority) {
    const displays = {
        'très_haute': '🔴🔴🔴',
        'haute': '🔴🔴',
        'moyenne': '🟡',
        'basse': '⚪',
        'faible': '⚪'
    };
    return displays[priority] || priority;
}

/**
 * Met à jour le layout (horizontal/vertical) en fonction du ratio de l'image.
 */
function updateLayoutBasedOnImage(contentArea, imageUrl) {
    if (!contentArea || !imageUrl) return;

    const img = new Image();
    img.onload = () => {
        const isLandscape = img.naturalWidth > img.naturalHeight;
        contentArea.classList.toggle('layout-vertical', isLandscape);
        contentArea.classList.toggle('layout-horizontal', !isLandscape);
    };
    img.onerror = () => {
        contentArea.classList.add('layout-horizontal');
        contentArea.classList.remove('layout-vertical');
        console.warn(`Impossible de charger l'image ${imageUrl} pour déterminer le layout.`);
    };
    img.src = imageUrl;
}

/**
 * Affiche la carte d'information textuelle enrichie et les deux images.
 */
function renderPartisCard(partyId, selection, DOMRefs) {
    if (!DOMRefs.fichesPartisText) return;

    // Utiliser les données détaillées si disponibles
    const dataSource = partisDetailedData || partisFicheData;
    if (!dataSource) return;

    const partyData = getPartyData(dataSource, partyId);
    if (!partyData) {
        DOMRefs.fichesPartisText.innerHTML = `<p>Données non disponibles pour ce parti.</p>`;
        return;
    }

    // CORRECTION: Mettre à jour le sélecteur d'amendements AVANT de construire le HTML
    // mais SANS réinitialiser la sélection actuelle
    const directiveMenu = document.getElementById('fiches-partis-directive-menu');
    const currentSelection = directiveMenu ? directiveMenu.value : selection;
    updateAmendmentSelector(partyData);

    // Restaurer la sélection si elle existe dans le nouveau menu
    if (directiveMenu && currentSelection) {
        // Vérifier si la sélection existe dans les nouvelles options
        const optionExists = Array.from(directiveMenu.options).some(opt => opt.value === currentSelection);
        if (optionExists) {
            directiveMenu.value = currentSelection;
        }
    }

    let html = '';

    if (selection === 'directive') {
        // Affichage enrichi de la directive (SANS Stratégie, Alliances, Oppositions)
        html = `
            <h3>${partyData.nom}</h3>
            <p><strong>Rôle européen :</strong> ${partyData.role_europeen}</p>
        `;

        if (partyData.enjeux_directive && partyData.enjeux_directive.length > 0) {
            html += `
                <h4>📋 Enjeux de la directive</h4>
                <ul>
                    ${partyData.enjeux_directive.map(enjeu => `<li>${enjeu}</li>`).join('')}
                </ul>
            `;
        }

        if (partyData.impacts_directive && partyData.impacts_directive.length > 0) {
            html += `
                <h4>💼 Impacts attendus</h4>
                <ul>
                    ${partyData.impacts_directive.map(impact => `<li>${impact}</li>`).join('')}
                </ul>
            `;
        }
    } else {
        // Affichage enrichi des amendements
        const amendments = getAmendments(partyData);
        const amendment = amendments.find(a => (a.amendement || a.id) === selection);

        if (amendment) {
            const positionColor = getPositionColor(amendment.position) || '#2196f3';
            const positionEmoji = getPositionEmoji(amendment.position);

            // CORRECTION: Afficher le titre complet de l'amendement
            const amendTitle = amendment.titre || amendment.title || `Amendement ${amendment.amendement || amendment.id}`;

            html = `
                <h3>${partyData.nom}</h3>
                <h4>${amendTitle}</h4>
                <div style="background: linear-gradient(135deg, ${positionColor}22, ${positionColor}11); padding: 15px; border-radius: 8px; border-left: 4px solid ${positionColor};">
                    <p><strong>Position du parti :</strong> ${positionEmoji} <span style="color: ${positionColor}; font-weight: bold;">${amendment.position}</span></p>
                </div>
            `;

            if (amendment.priorité || amendment.priorite) {
                const priority = amendment.priorité || amendment.priorite;
                html += `<p><strong>Priorité :</strong> ${getPriorityDisplay(priority)} ${priority}</p>`;
            }

            if (amendment.origine) {
                html += `<p><strong>Origine :</strong> ${amendment.origine}</p>`;
            }

            if (amendment.description) {
                html += `<h4>📝 Description</h4><p>${amendment.description}</p>`;
            }

            if (amendment.justification) {
                html += `<h4>💬 Justification</h4><p>${amendment.justification}</p>`;
            }

            if (amendment.impact_analyse) {
                html += `<h4>📈 Impact analysé</h4><p>${amendment.impact_analyse}</p>`;
            }

            if (partyData.éléments_d_argumentaire && partyData.éléments_d_argumentaire.length > 0) {
                const topArgs = partyData.éléments_d_argumentaire.slice(0, 3);
                html += `
                    <h4>🗣️ Arguments clés</h4>
                    <ul>
                        ${topArgs.map(arg => `<li>${arg}</li>`).join('')}
                    </ul>
                `;
            }
        } else {
            html = `
                <h3>${partyData.nom}</h3>
                <h4>Amendement ${selection}</h4>
                <p>Aucune position enregistrée pour cet amendement.</p>
            `;
        }
    }

    // Afficher le texte
    DOMRefs.fichesPartisText.innerHTML = html;

    // Gérer les deux images avec les bons chemins
    const { currentScenarioId, selectedDirectiveId } = AppState;

    const logoUrl = getImagePath(`/medias/images/logo-partis/${partyId}.png`);
    const directiveImageUrl = getImagePath(`/medias/images/fiches-acteurs/s${currentScenarioId}/${currentScenarioId}-${selectedDirectiveId}.png`);

    if (DOMRefs.fichesPartisPhoto1) {
        DOMRefs.fichesPartisPhoto1.style.backgroundImage = `url('${logoUrl}')`;
        DOMRefs.fichesPartisPhoto1.style.backgroundSize = 'contain';
        DOMRefs.fichesPartisPhoto1.style.backgroundPosition = 'center';
        DOMRefs.fichesPartisPhoto1.style.backgroundRepeat = 'no-repeat';
    }

    if (DOMRefs.fichesPartisPhoto2) {
        DOMRefs.fichesPartisPhoto2.style.backgroundImage = `url('${directiveImageUrl}')`;
        DOMRefs.fichesPartisPhoto2.style.backgroundSize = 'cover';
        DOMRefs.fichesPartisPhoto2.style.backgroundPosition = 'center';
    }
}


/**
 * Affiche le graphique d'évolution sur 10 ans basé sur le moteur de simulation.
 */
function renderPartisChart(selection) {
    const canvas = document.getElementById('fiches-partis-chart');
    if (!canvas) return;

    if (ChartInstances.fichesPartisChart) {
        ChartInstances.fichesPartisChart.destroy();
    }

    const { currentScenarioId, selectedDirectiveId, currentScenarioData } = AppState;
    const directiveData = currentScenarioData.directive.find(d => d.id === selectedDirectiveId);
    if (!directiveData) return;

    // Déterminer les valeurs d'entrée en fonction de la sélection (directive vs amendement)
    let inputValues = {};
    let simulationTitle = '';

    if (selection !== 'directive') {
        const amendment = directiveData.amendements.find(a => a.id === selection);
        inputValues = amendment?.impact || directiveData.statistiques_depart;
        simulationTitle = amendment ? `Projection sur 10 ans (avec Amend. ${amendment.id})` : 'Projection sur 10 ans (Amendement non trouvé)';
    } else {
        inputValues = directiveData.statistiques_depart;
        simulationTitle = 'Projection sur 10 ans (Directive Initiale)';
    }

    // Exécuter la simulation
    const simulationResults = simulateEU(currentScenarioId, inputValues);
    if (!simulationResults) {
        console.error("La simulation pour le graphique des partis a échoué.");
        return;
    }

    const labels = simulationYears;
    const currentChartConfig = chartConfig[currentScenarioId];
    const colors = ['#1a237e', '#1976d2', '#03a9f4', '#81d4fa'];
    const datasets = [];
    let colorIndex = 0;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: simulationTitle },
            legend: { position: 'top' }
        },
        scales: {}
    };

    // Configuration spécifique par scénario
    if (currentScenarioId === 1) {
        Object.keys(currentChartConfig).forEach((key, i) => {
            const dataset = {
                label: currentChartConfig[key],
                data: simulationResults[`arr${i + 1}`],
                tension: 0.1,
            };

            if (key === 'pib_eu') {
                dataset.yAxisID = 'y';
                dataset.borderColor = colors[0];
                dataset.backgroundColor = `${colors[0]}33`;
            } else if (key === 'gini_eu') {
                dataset.yAxisID = 'y2';
                dataset.borderColor = '#e91e63';
                dataset.backgroundColor = '#e91e6333';
            } else if (key === 'co2_eu') {
                dataset.yAxisID = 'y1';
                dataset.borderColor = colors[1];
                dataset.backgroundColor = `${colors[1]}33`;
            } else if (key === 'veb_eu') {
                dataset.yAxisID = 'y3';
                dataset.borderColor = colors[2];
                dataset.backgroundColor = `${colors[2]}33`;
            }

            datasets.push(dataset);
        });

        datasets.push({
            label: 'Satisfaction Partis (%)',
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y3',
            tension: 0.1
        });

        chartOptions.scales = {
            y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'PIB (%)' } },
            y1: { type: 'linear', display: true, position: 'right', min: 0, max: 20, title: { display: true, text: 'CO₂/hab (t)' }, grid: { drawOnChartArea: false } },
            y2: { type: 'linear', display: true, position: 'left', offset: true, min: 0.2, max: 0.6, title: { display: true, text: 'Indice de Gini', color: '#e91e63' }, ticks: { color: '#e91e63' }, grid: { drawOnChartArea: false } },
            y3: { type: 'linear', display: true, position: 'right', min: 0, max: 100, title: { display: true, text: 'VEB & Satisfaction (%)' }, grid: { drawOnChartArea: false } }
        };

    } else if (currentScenarioId === 2) {
        Object.keys(currentChartConfig).forEach((key, i) => {
            const dataset = {
                label: currentChartConfig[key],
                data: simulationResults[`arr${i + 1}`],
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: `${colors[colorIndex % colors.length]}33`,
                tension: 0.1,
            };

            if (key === 'normandie_eu') {
                dataset.yAxisID = 'y';
            } else if (key === 'idh_eu' || key === 'vdem_eu') {
                dataset.yAxisID = 'y2';
            } else if (key === 'pib_growth_eu') {
                dataset.yAxisID = 'y3';
            }

            datasets.push(dataset);
            colorIndex++;
        });

        datasets.push({
            label: 'Satisfaction Partis (%)',
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y',
            tension: 0.1
        });

        chartOptions.scales = {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                min: 0,
                max: 100,
                title: { display: true, text: 'Normandie / Satisfaction (%)' }
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 1,
                title: { display: true, text: 'IDH / V-Dem' },
                grid: { drawOnChartArea: false }
            },
            y3: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 5,
                title: { display: true, text: 'Croissance PIB (%)' },
                grid: { drawOnChartArea: false }
            }
        };
    }

    ChartInstances.fichesPartisChart = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: chartOptions
    });
}

/**
 * Point d'entrée pour l'initialisation du sous-onglet Partis.
 */
/**
 * Point d'entrée pour l'initialisation du sous-onglet Partis.
 */
export async function initPartisSubTab(DOMRefs) {
    const dataLoaded = await loadPartisFicheData();
    if (!dataLoaded) return;

    // Récupérer les éléments DOM directement par ID
    const partyMenu = document.getElementById('fiches-partis-party-menu');
    const directiveMenu = document.getElementById('fiches-partis-directive-menu');
    const textContainer = document.getElementById('fiches-partis-text');
    const photo1Container = document.getElementById('fiches-partis-photo-1');
    const photo2Container = document.getElementById('fiches-partis-photo-2');

    if (!partyMenu || !directiveMenu) {
        console.error("Éléments DOM manquants pour l'onglet Partis");
        return;
    }

    // Créer l'objet DOMRefs pour les fonctions de rendu
    const localDOMRefs = {
        fichesPartisText: textContainer,
        fichesPartisPhoto1: photo1Container,
        fichesPartisPhoto2: photo2Container
    };

    populatePartisSelectors();

    // Événements sur les deux menus
    partyMenu.addEventListener('change', (e) => {
        const partyId = e.target.value;
        const selection = directiveMenu.value;
        renderPartisCard(partyId, selection, localDOMRefs);
        renderPartisChart(selection);
    });

    directiveMenu.addEventListener('change', (e) => {
        const partyId = partyMenu.value;
        const selection = e.target.value;
        renderPartisCard(partyId, selection, localDOMRefs);
        renderPartisChart(selection);
    });

    // Affichage initial
    const initialPartyId = partyMenu.value;
    const initialSelection = directiveMenu.value;
    renderPartisCard(initialPartyId, initialSelection, localDOMRefs);
    renderPartisChart(initialSelection);
}
