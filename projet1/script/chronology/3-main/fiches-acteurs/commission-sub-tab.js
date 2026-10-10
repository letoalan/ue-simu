import { AppState, ChartInstances, simulationYears } from '../../../state/index.js';
import { updateContentDisplay } from '../content-display-manager.js';
import { simulateEU } from '../simulator/engine/index.js';

// Pour stocker les données de la fiche une fois chargées
let commissionFicheData = null;
let commissionDetailedData = null; // NOUVEAU: Données détaillées depuis com_s1-d1.json

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

// NOUVEAU: Fonctions utilitaires pour gérer les deux structures de données
function getCommissionData(data) {
    // Si c'est un fichier com_s1-d1.json (structure directe)
    if (data.type === "Commission" || data.nom === "Commission européenne") {
        return data;
    }
    // Si c'est un fichier s1-d1.json (structure avec .commission)
    return data.commission;
}

function getAmendments(data) {
    const commissionData = getCommissionData(data);
    // Priorité aux positions_amendements (plus détaillé)
    if (commissionData?.positions_amendements) {
        return commissionData.positions_amendements;
    }
    // Fallback sur impacts_amendements
    return commissionData?.impacts_amendements || [];
}

// NOUVEAU: Charger les données détaillées depuis com_s1-d1.json
async function loadCommissionDetailedData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Scénario ou Directive non sélectionné.");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/com_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("Chargement données détaillées Commission:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        commissionDetailedData = await response.json();
        console.log("Données détaillées Commission chargées:", commissionDetailedData);
        return true;
    } catch (error) {
        console.error("Impossible de charger les données détaillées Commission:", error);
        commissionDetailedData = null;
        return false;
    }
}

/**
 * Charge les données JSON spécifiques à la fiche de la Commission.
 */
async function loadCommissionFicheData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("Fiche Commission: Scénario ou Directive non sélectionné.");
        return false;
    }

    // Essayer d'abord de charger les données détaillées
    await loadCommissionDetailedData();

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/s${currentScenarioId}-d${selectedDirectiveId}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        commissionFicheData = await response.json();
        return true;
    } catch (error) {
        console.error("Impossible de charger les données de la fiche Commission:", error);
        const container = document.getElementById('fiches-commission-text');
        if (container) {
            container.innerHTML = `<p style="color: red;">Erreur: Impossible de charger les données pour cette fiche.</p>`;
        }
        return false;
    }
}

/**
 * Peuple le sélecteur avec la directive et les amendements concernés.
 */
function populateCommissionSelector() {
    const menu = document.getElementById('fiches-commission-menu');
    if (!menu) return;

    // Utiliser les données détaillées si disponibles, sinon fallback
    const dataSource = commissionDetailedData || commissionFicheData;
    if (!dataSource) return;

    const commissionData = getCommissionData(dataSource);
    if (!commissionData) return;

    menu.innerHTML = ''; // Vider les options existantes

    // Option pour la directive principale
    menu.innerHTML += `<option value="directive">Directive</option>`;

    // Options pour chaque amendement
    const amendments = getAmendments(dataSource);
    if (amendments && amendments.length > 0) {
        amendments.forEach(amend => {
            const amendId = amend.amendement || amend.id;
            menu.innerHTML += `<option value="${amendId}">Amendement ${amendId}</option>`;
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
        'basse': '⚪'
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
 * Affiche la carte d'information textuelle enrichie.
 */
function renderCommissionCard(selection, DOMRefs) {
    if (!DOMRefs.fichesCommissionText) return;

    // Utiliser les données détaillées si disponibles, sinon fallback
    const dataSource = commissionDetailedData || commissionFicheData;
    if (!dataSource) return;

    const commissionData = getCommissionData(dataSource);
    if (!commissionData) return;

    let html = '';

    if (selection === 'directive') {
        // Affichage enrichi de la directive (SANS Stratégie, Alliances, Oppositions)
        if (commissionDetailedData) {
            html = `
                <h3>Commission européenne</h3>
                <p><strong>Rôle européen :</strong> ${commissionData.role_europeen}</p>
            `;

            if (commissionData.enjeux_directive && commissionData.enjeux_directive.length > 0) {
                html += `
                    <h4>📋 Enjeux de la directive</h4>
                    <ul>
                        ${commissionData.enjeux_directive.map(enjeu => `<li>${enjeu}</li>`).join('')}
                    </ul>
                `;
            }

            if (commissionData.impacts_directive && commissionData.impacts_directive.length > 0) {
                html += `
                    <h4>💼 Impacts attendus</h4>
                    <ul>
                        ${commissionData.impacts_directive.map(impact => `<li>${impact}</li>`).join('')}
                    </ul>
                `;
            }
        } else {
            // Fallback sur l'ancienne structure
            html = `<p><strong>Rôle européen :</strong> ${commissionData.role_europeen}</p>`;
        }
    } else {
        // Affichage enrichi des amendements
        const amendments = getAmendments(dataSource);
        const amendment = amendments.find(a => (a.amendement || a.id) === selection);

        if (amendment) {
            if (commissionDetailedData && amendment.position) {
                // Affichage enrichi avec données détaillées
                const positionColor = getPositionColor(amendment.position) || '#2196f3'; // Valeur par défaut
                const positionEmoji = getPositionEmoji(amendment.position);

                html = `
                        <h3>Amendement ${amendment.amendement || amendment.id}</h3>
                        <div style="background: linear-gradient(135deg, ${positionColor}22, ${positionColor}11); padding: 15px; border-radius: 8px; border-left: 4px solid ${positionColor};">
                            <p><strong>Position de la Commission :</strong> ${positionEmoji} <span style="color: ${positionColor}; font-weight: bold;">${amendment.position}</span></p>
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

                if (amendment.argumentaire && amendment.argumentaire.length > 0) {
                    const topArgs = amendment.argumentaire.slice(0, 3);
                    html += `
                        <h4>🗣️ Arguments clés</h4>
                        <ul>
                            ${topArgs.map(arg => `<li>${arg}</li>`).join('')}
                        </ul>
                    `;
                }
            } else {
                // Fallback sur l'ancienne structure
                html = `
                    <p><strong>Stratégie générale :</strong> ${commissionData.stratégie}</p>
                    <p><strong>Origine :</strong> ${amendment.origine}</p>
                    <p><strong>Description :</strong> ${amendment.description}</p>
                    <p><strong>Impact analysé par la Commission :</strong> ${amendment.impact}</p>
                `;
            }
        }
    }

    const imageUrl = getImagePath('/medias/images/euro/commission-fiche.jpg');
    const contentArea = DOMRefs.fichesCommissionPhoto?.parentElement;

    // Met à jour dynamiquement le layout en fonction de l'image
    updateLayoutBasedOnImage(contentArea, imageUrl);

    updateContentDisplay({
        photoContainer: DOMRefs.fichesCommissionPhoto,
        textContainer: DOMRefs.fichesCommissionText,
        photoUrl: imageUrl,
        text: html
    });
}

/**
 * Affiche le graphique d'évolution sur 10 ans basé sur le moteur de simulation.
 */
function renderCommissionChart(selection) {
    const canvas = document.getElementById('fiches-commission-chart');
    if (!canvas) return;

    if (ChartInstances.fichesCommissionChart) {
        ChartInstances.fichesCommissionChart.destroy();
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
        console.error("La simulation pour le graphique de la commission a échoué.");
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
        scales: {} // Construit dynamiquement ci-dessous
    };

    // --- Configuration spécifique par scénario ---
    if (currentScenarioId === 1) {
        // Création des datasets pour le Scénario 1
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
            label: 'Satisfaction Commission (%)',
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y3', // Partage l'axe avec VEB
            tension: 0.1
        });

        // Configuration des axes pour le Scénario 1
        chartOptions.scales = {
            y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'PIB (%)' } },
            y1: { type: 'linear', display: true, position: 'right', min: 0, max: 20, title: { display: true, text: 'CO₂/hab (t)' }, grid: { drawOnChartArea: false } },
            y2: { type: 'linear', display: true, position: 'left', offset: true, min: 0.2, max: 0.6, title: { display: true, text: 'Indice de Gini', color: '#e91e63' }, ticks: { color: '#e91e63' }, grid: { drawOnChartArea: false } },
            y3: { type: 'linear', display: true, position: 'right', min: 0, max: 100, title: { display: true, text: 'VEB & Satisfaction (%)' }, grid: { drawOnChartArea: false } }
        };

    } else if (currentScenarioId === 2) {
        // Création des datasets pour le Scénario 2
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
            label: 'Satisfaction Commission (%)',
            data: simulationResults.satisArr.map(v => v * 100),
            borderColor: '#ff6d00',
            backgroundColor: '#ff6d0033',
            yAxisID: 'y', // Partage l'axe avec Normandie
            tension: 0.1
        });

        // Configuration des axes pour le Scénario 2
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

    ChartInstances.fichesCommissionChart = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: chartOptions
    });
}

/**
 * Point d'entrée pour l'initialisation du sous-onglet Commission.
 */
export async function initCommissionSubTab(DOMRefs) {
    const dataLoaded = await loadCommissionFicheData();
    if (!dataLoaded || !DOMRefs.fichesCommissionMenu) return;

    populateCommissionSelector();

    DOMRefs.fichesCommissionMenu.addEventListener('change', (e) => {
        const selection = e.target.value;
        renderCommissionCard(selection, DOMRefs);
        renderCommissionChart(selection);
    });

    // Affichage initial
    DOMRefs.fichesCommissionMenu.dispatchEvent(new Event('change'));
}
