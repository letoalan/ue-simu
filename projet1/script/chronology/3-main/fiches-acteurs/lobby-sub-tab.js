import { AppState, ChartInstances, simulationYears } from '../../../state/index.js';
import { updateContentDisplay } from '../content-display-manager.js';
import { simulateEU } from '../simulator/engine/index.js';

// Pour stocker les données de la fiche une fois chargées
let lobbiesFicheData = null;
let lobbiesDetailedData = null; // NOUVEAU: Données détaillées depuis lob_s1-d1.json

// Liste des lobbies avec leurs informations
const europeanLobbies = [
    { id: 'tech', name: 'Big Tech', fullName: 'Big Tech (Technologies)' },
    { id: 'fossiles', name: 'Énergies Fossiles', fullName: 'Lobbies Énergies Fossiles' },
    { id: 'finance', name: 'Banque et Finance', fullName: 'Secteur Bancaire et Financier' },
    { id: 'agrochimie', name: 'Agrochimie', fullName: 'Secteur Agrochimique' },
    { id: 'pharma', name: 'Pharmaceutique', fullName: 'Secteur Pharmaceutique' },
    { id: 'auto', name: 'Automobile', fullName: 'Secteur Automobile' }
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

// Fonctions utilitaires pour gérer les structures de données
function getLobbyData(data, lobbyId) {
    // Si c'est un fichier lob_s1-d1.json (array de lobbies)
    if (Array.isArray(data)) {
        return data.find(l => l.actor_id === lobbyId || l.nom.includes(getLobbyName(lobbyId)));
    }
    // Sinon structure classique s1-d1.json
    return data?.lobbies?.find(l => l.actor_id === lobbyId);
}

function getLobbyName(lobbyId) {
    const lobby = europeanLobbies.find(l => l.id === lobbyId);
    return lobby ? lobby.name : lobbyId;
}

function getLobbyFullName(lobbyId) {
    const lobby = europeanLobbies.find(l => l.id === lobbyId);
    return lobby ? lobby.fullName : lobbyId;
}

function getAmendments(lobbyData) {
    // Priorité aux positions_amendements (plus détaillé)
    if (lobbyData?.positions_amendements) {
        return lobbyData.positions_amendements;
    }
    return lobbyData?.impacts_amendements || [];
}

// Charger les données détaillées depuis lob_s1-d1.json
async function loadLobbiesDetailedData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Scénario ou Directive non sélectionné.");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/lob_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("Chargement données détaillées Lobbies:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        lobbiesDetailedData = await response.json();
        console.log("Données détaillées Lobbies chargées:", lobbiesDetailedData);
        return true;
    } catch (error) {
        console.error("Impossible de charger les données détaillées Lobbies:", error);
        lobbiesDetailedData = null;
        return false;
    }
}

/**
 * Charge les données JSON spécifiques à la fiche des Lobbies.
 */
async function loadLobbiesFicheData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Fiche Lobbies: Scénario ou Directive non sélectionné.");
        return false;
    }

    // Essayer d'abord de charger les données détaillées
    await loadLobbiesDetailedData();

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/s${currentScenarioId}-d${selectedDirectiveId}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        lobbiesFicheData = await response.json();
        return true;
    } catch (error) {
        console.error("Impossible de charger les données de la fiche Lobbies:", error);
        const container = document.getElementById('fiches-lobbies-text');
        if (container) {
            container.innerHTML = `<p style="color: red;">Erreur: Impossible de charger les données pour cette fiche.</p>`;
        }
        return false;
    }
}

/**
 * Peuple les sélecteurs avec les lobbies et les amendements.
 */
function populateLobbiesSelectors() {
    const lobbyMenu = document.getElementById('fiches-lobbies-lobby-menu');
    const directiveMenu = document.getElementById('fiches-lobbies-directive-menu');

    if (!lobbyMenu || !directiveMenu) return;

    // Utiliser les données détaillées si disponibles
    const dataSource = lobbiesDetailedData || lobbiesFicheData;
    if (!dataSource) return;

    // Remplir le menu des lobbies
    lobbyMenu.innerHTML = '';
    europeanLobbies.forEach(lobby => {
        lobbyMenu.innerHTML += `<option value="${lobby.id}">${lobby.name}</option>`;
    });

    // Remplir le menu des amendements (basé sur le premier lobby par défaut)
    const firstLobbyData = getLobbyData(dataSource, europeanLobbies[0].id);
    if (firstLobbyData) {
        updateAmendmentSelector(firstLobbyData);
    }
}

/**
 * Met à jour le sélecteur d'amendements en fonction du lobby sélectionné.
 */
function updateAmendmentSelector(lobbyData) {
    const directiveMenu = document.getElementById('fiches-lobbies-directive-menu');
    if (!directiveMenu) return;

    const { currentScenarioData, selectedDirectiveId } = AppState;
    const directiveData = currentScenarioData?.directive.find(d => d.id === selectedDirectiveId);

    directiveMenu.innerHTML = '<option value="directive">Directive</option>';

    // Récupérer les amendements depuis positions_amendements
    const positions = lobbyData.positions_amendements || [];

    if (positions.length > 0) {
        positions.forEach(pos => {
            const amendId = pos.amendement;

            // Chercher le titre dans les données de la directive principale
            const amendmentRef = directiveData?.amendements.find(a => a.id === amendId);
            const amendTitle = amendmentRef?.title || pos.titre || `Amendement ${amendId}`;

            directiveMenu.innerHTML += `<option value="${amendId}">${amendTitle}</option>`;
        });
    }
}

// Fonctions pour le code couleur des positions
function getPositionColor(position) {
    const colors = {
        'FAVORABLE': '#4caf50',
        'FAVORABLE_CONDITIONNEL': '#8bc34a',
        'NEUTRE': '#9e9e9e',
        'DEFAVORABLE_PARTIEL': '#ff9800',
        'DEFAVORABLE': '#f44336'
    };
    return colors[position] || '#9e9e9e';
}

function getPositionEmoji(position) {
    const emojis = {
        'FAVORABLE': '🟢',
        'FAVORABLE_CONDITIONNEL': '🟡',
        'NEUTRE': '⚪',
        'DEFAVORABLE_PARTIEL': '🟠',
        'DEFAVORABLE': '🔴'
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
 * Affiche la carte d'information textuelle enrichie et les deux images.
 */
function renderLobbiesCard(lobbyId, selection, DOMRefs) {
    if (!DOMRefs.fichesLobbiesText) return;

    // Utiliser les données détaillées si disponibles
    const dataSource = lobbiesDetailedData || lobbiesFicheData;
    if (!dataSource) return;

    const lobbyData = getLobbyData(dataSource, lobbyId);
    if (!lobbyData) {
        DOMRefs.fichesLobbiesText.innerHTML = `<p>Données non disponibles pour ce lobby.</p>`;
        return;
    }

    // Mettre à jour le sélecteur d'amendements
    const directiveMenu = document.getElementById('fiches-lobbies-directive-menu');
    const currentSelection = directiveMenu ? directiveMenu.value : selection;
    updateAmendmentSelector(lobbyData);

    // Restaurer la sélection si elle existe dans le nouveau menu
    if (directiveMenu && currentSelection) {
        const optionExists = Array.from(directiveMenu.options).some(opt => opt.value === currentSelection);
        if (optionExists) {
            directiveMenu.value = currentSelection;
        }
    }

    let html = '';

    if (selection === 'directive') {
        // Affichage enrichi de la directive
        html = `
            <h3>${lobbyData.nom}</h3>
            <p><strong>Rôle européen :</strong> ${lobbyData.role_europeen}</p>
        `;

        if (lobbyData.enjeux_directive && lobbyData.enjeux_directive.length > 0) {
            html += `
                <h4>📋 Enjeux de la directive</h4>
                <ul>
                    ${lobbyData.enjeux_directive.map(enjeu => `<li>${enjeu}</li>`).join('')}
                </ul>
            `;
        }

        if (lobbyData.impacts_directive && lobbyData.impacts_directive.length > 0) {
            html += `
                <h4>💼 Impacts attendus</h4>
                <ul>
                    ${lobbyData.impacts_directive.map(impact => `<li>${impact}</li>`).join('')}
                </ul>
            `;
        }
    } else {
        // Affichage enrichi des amendements
        const amendments = getAmendments(lobbyData);
        const amendment = amendments.find(a => (a.amendement || a.id) === selection);

        if (amendment) {
            const positionColor = getPositionColor(amendment.position) || '#2196f3';
            const positionEmoji = getPositionEmoji(amendment.position);
            const amendTitle = amendment.titre || amendment.title || `Amendement ${amendment.amendement || amendment.id}`;

            html = `
                <h3>${lobbyData.nom}</h3>
                <h4>${amendTitle}</h4>
                <div style="background: linear-gradient(135deg, ${positionColor}22, ${positionColor}11); padding: 15px; border-radius: 8px; border-left: 4px solid ${positionColor};">
                    <p><strong>Position du lobby :</strong> ${positionEmoji} <span style="color: ${positionColor}; font-weight: bold;">${amendment.position}</span></p>
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

            if (lobbyData.éléments_d_argumentaire && lobbyData.éléments_d_argumentaire.length > 0) {
                const topArgs = lobbyData.éléments_d_argumentaire.slice(0, 3);
                html += `
                    <h4>🗣️ Arguments clés</h4>
                    <ul>
                        ${topArgs.map(arg => `<li>${arg}</li>`).join('')}
                    </ul>
                `;
            }
        } else {
            html = `
                <h3>${lobbyData.nom}</h3>
                <h4>Amendement ${selection}</h4>
                <p>Aucune position enregistrée pour cet amendement.</p>
            `;
        }
    }

    // Afficher le texte
    DOMRefs.fichesLobbiesText.innerHTML = html;

    // Gérer les deux images avec les bons chemins
    const { currentScenarioId, selectedDirectiveId } = AppState;

    // Image 1: Logo du lobby (FIXE)
    const logoUrl = getImagePath(`/medias/images/logo-lobbies/${lobbyId}.png`);

    // Image 2: Image de la directive (dynamique)
    const directiveImageUrl = getImagePath(`/medias/images/fiches-acteurs/s${currentScenarioId}/${currentScenarioId}-${selectedDirectiveId}.png`);

    if (DOMRefs.fichesLobbiesPhoto1) {
        DOMRefs.fichesLobbiesPhoto1.style.backgroundImage = `url('${logoUrl}')`;
        DOMRefs.fichesLobbiesPhoto1.style.backgroundSize = 'contain';
        DOMRefs.fichesLobbiesPhoto1.style.backgroundPosition = 'center';
        DOMRefs.fichesLobbiesPhoto1.style.backgroundRepeat = 'no-repeat';
    }

    if (DOMRefs.fichesLobbiesPhoto2) {
        DOMRefs.fichesLobbiesPhoto2.style.backgroundImage = `url('${directiveImageUrl}')`;
        DOMRefs.fichesLobbiesPhoto2.style.backgroundSize = 'cover';
        DOMRefs.fichesLobbiesPhoto2.style.backgroundPosition = 'center';
    }
}

/**
 * Affiche le graphique d'évolution sur 10 ans basé sur le moteur de simulation.
 */
function renderLobbiesChart(selection) {
    const canvas = document.getElementById('fiches-lobbies-chart');
    if (!canvas) return;

    if (ChartInstances.fichesLobbiesChart) {
        ChartInstances.fichesLobbiesChart.destroy();
    }

    const { currentScenarioId, selectedDirectiveId, currentScenarioData } = AppState;
    const directiveData = currentScenarioData.directive.find(d => d.id === selectedDirectiveId);
    if (!directiveData) return;

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

    const simulationResults = simulateEU(currentScenarioId, inputValues);
    if (!simulationResults) {
        console.error("La simulation pour le graphique des lobbies a échoué.");
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
            label: 'Satisfaction Lobbies (%)',
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
            label: 'Satisfaction Lobbies (%)',
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y',
            tension: 0.1
        });

        chartOptions.scales = {
            y: { type: 'linear', display: true, position: 'left', min: 0, max: 100, title: { display: true, text: 'Normandie / Satisfaction (%)' } },
            y2: { type: 'linear', display: true, position: 'right', min: 0, max: 1, title: { display: true, text: 'IDH / V-Dem' }, grid: { drawOnChartArea: false } },
            y3: { type: 'linear', display: true, position: 'right', min: 0, max: 5, title: { display: true, text: 'Croissance PIB (%)' }, grid: { drawOnChartArea: false } }
        };
    }

    ChartInstances.fichesLobbiesChart = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: chartOptions
    });
}

/**
 * Point d'entrée pour l'initialisation du sous-onglet Lobbies.
 */
export async function initLobbiesSubTab(DOMRefs) {
    const dataLoaded = await loadLobbiesFicheData();
    if (!dataLoaded) return;

    const lobbyMenu = document.getElementById('fiches-lobbies-lobby-menu');
    const directiveMenu = document.getElementById('fiches-lobbies-directive-menu');
    const textContainer = document.getElementById('fiches-lobbies-text');
    const photo1Container = document.getElementById('fiches-lobbies-photo-1');
    const photo2Container = document.getElementById('fiches-lobbies-photo-2');

    if (!lobbyMenu || !directiveMenu) {
        console.error("Éléments DOM manquants pour l'onglet Lobbies");
        return;
    }

    const localDOMRefs = {
        fichesLobbiesText: textContainer,
        fichesLobbiesPhoto1: photo1Container,
        fichesLobbiesPhoto2: photo2Container
    };

    populateLobbiesSelectors();

    lobbyMenu.addEventListener('change', (e) => {
        const lobbyId = e.target.value;
        const selection = directiveMenu.value;
        renderLobbiesCard(lobbyId, selection, localDOMRefs);
        renderLobbiesChart(selection);
    });

    directiveMenu.addEventListener('change', (e) => {
        const lobbyId = lobbyMenu.value;
        const selection = e.target.value;
        renderLobbiesCard(lobbyId, selection, localDOMRefs);
        renderLobbiesChart(selection);
    });

    // Affichage initial
    const initialLobbyId = lobbyMenu.value;
    const initialSelection = directiveMenu.value;
    renderLobbiesCard(initialLobbyId, initialSelection, localDOMRefs);
    renderLobbiesChart(initialSelection);
}
