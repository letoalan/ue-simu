import { AppState } from '../../../state/index.js';

let etatsNegoData = null;
let selectedCountry = null;

// Mapping des pays vers leurs fichiers de drapeaux
const FLAGS_MAP = {
    'allemagne': 'allemagne.jpg',
    'france': 'france.jpg',
    'hongrie': 'hongrie.jpg',
    'italie': 'italie.jpg',
    'pologne': 'pologne.jpg',
    'suède': 'suède.jpg',
    'suede': 'suède.jpg'
};

// Mapping des noms vers leurs actor_id
const COUNTRY_IDS = {
    'Allemagne': 'allemagne',
    'France': 'france',
    'Hongrie': 'hongrie',
    'Italie': 'italie',
    'Pologne': 'pologne',
    'Suède': 'suède'
};

// Mapping des pays vers leurs noms complets pour le titre
const COUNTRY_NAMES = {
    'allemagne': 'Allemagne',
    'france': 'France',
    'hongrie': 'Hongrie',
    'italie': 'Italie',
    'pologne': 'Pologne',
    'suède': 'Suède'
};

/**
 * Fonction utilitaire pour les chemins
 */
function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        if (window.location.pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        }
    }
    return `.${relativePath}`;
}

/**
 * Charge les données JSON de tous les États pour une directive
 */
async function loadEtatsNegoData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("[NEGO-ETATS] Scénario ou Directive manquants");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/cou_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("[NEGO-ETATS] Chargement:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        etatsNegoData = Array.isArray(data) ? data : [data];
        console.log("[NEGO-ETATS] ✅ Données chargées:", etatsNegoData.length, "États");
        console.log("[NEGO-ETATS] Pays disponibles:", etatsNegoData.map(c => c.nom).join(', '));
        return true;
    } catch (error) {
        console.error("[NEGO-ETATS] ❌ Erreur chargement:", error);
        return false;
    }
}

/**
 * Remplit le menu déroulant avec les pays
 */
function populateEtatsMenu() {
    const countryMenu = document.getElementById('pistes-etats-country-menu');

    if (!countryMenu || !etatsNegoData) {
        console.error("[NEGO-ETATS] Menu ou données manquants");
        return;
    }

    countryMenu.innerHTML = '<option value="">-- Sélectionner un pays --</option>';

    etatsNegoData.forEach(country => {
        const countryId = COUNTRY_IDS[country.nom] || country.nom.toLowerCase();
        const option = document.createElement('option');
        option.value = countryId;
        option.textContent = country.nom;
        countryMenu.appendChild(option);
    });

    console.log("[NEGO-ETATS] ✅ Menu rempli avec", etatsNegoData.length, "pays");
}

/**
 * Met à jour le menu Directive/Amendements
 */
function updateDirectiveMenu() {
    const directiveMenu = document.getElementById('pistes-etats-directive-menu');
    if (!directiveMenu || !selectedCountry) {
        console.warn("[NEGO-ETATS] Menu directive ou pays manquant");
        return;
    }

    const { currentScenarioData, selectedDirectiveId } = AppState;
    if (!currentScenarioData || !selectedDirectiveId) {
        console.error("[NEGO-ETATS] currentScenarioData ou selectedDirectiveId manquants");
        return;
    }

    const directiveData = currentScenarioData.directive?.find(d => d.id === selectedDirectiveId);
    if (!directiveData) {
        console.error("[NEGO-ETATS] Directive non trouvée");
        return;
    }

    directiveMenu.disabled = false;
    directiveMenu.innerHTML = '<option value="directive">Directive</option>';

    const amendments = directiveData.amendements || [];
    amendments.forEach(amend => {
        const option = document.createElement('option');
        option.value = amend.id;
        option.textContent = amend.title || `Amendement ${amend.id}`;
        directiveMenu.appendChild(option);
    });
}

/**
 * Fonctions utilitaires
 */
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

function getPriorityStars(priorite) {
    const stars = {
        'très_haute': '★★★',
        'haute': '★★',
        'moyenne': '★',
        'basse': '',
        'faible': ''
    };
    return stars[priorite] || '★';
}

function getPriorityText(priorite) {
    const texts = {
        'très_haute': 'Très haute priorité',
        'haute': 'Haute priorité',
        'moyenne': 'Moyenne priorité',
        'basse': 'Basse priorité',
        'faible': 'Faible priorité'
    };
    return texts[priorite] || 'Moyenne priorité';
}

/**
 * Affiche les données d'un pays
 */
function updateDisplay(selection) {
    if (!selectedCountry) {
        console.warn("[NEGO-ETATS] Aucun pays sélectionné");
        return;
    }

    console.log("[NEGO-ETATS] Affichage pour:", selectedCountry, "- Sélection:", selection);

    const countryData = etatsNegoData.find(c => {
        const countryId = COUNTRY_IDS[c.nom] || c.nom.toLowerCase();
        return countryId === selectedCountry.toLowerCase();
    });

    if (!countryData) {
        console.error("[NEGO-ETATS] ❌ Données du pays introuvables:", selectedCountry);
        return;
    }

    console.log("[NEGO-ETATS] ✅ Données trouvées pour:", countryData.nom);

    // Mise à jour du titre dans l'en-tête
    const titleElem = document.getElementById('pistes-etats-title');
    if (titleElem) {
        const countryName = COUNTRY_NAMES[selectedCountry.toLowerCase()] || selectedCountry;
        titleElem.textContent = `🌍 ${countryName}`;
    }

    // Récupérer et afficher le nom de la directive/amendement
    const { currentScenarioData, selectedDirectiveId } = AppState;
    const directiveData = currentScenarioData?.directive?.find(d => d.id === selectedDirectiveId);

    let subjectName = '';
    let subjectType = '';

    if (selection === 'directive' && directiveData) {
        subjectName = directiveData.nom; // Ex: "Pacte vert innovant"
        subjectType = '📋 Directive';
    } else if (selection && directiveData) {
        const amendement = directiveData.amendements?.find(a => a.id === selection);
        if (amendement) {
            subjectName = amendement.description;
            subjectType = '📝 Amendement';
        }
    }

// Mettre à jour l'élément du header
    const subjectHeader = document.getElementById('pistes-etats-subject-header');
    if (subjectHeader) {
        subjectHeader.innerHTML = `
        <div style="font-size: 0.85em; color: #666; margin-bottom: 4px;">${subjectType}</div>
        <div style="font-size: 1.1em; font-weight: 600; color: #2c3e50;">${subjectName}</div>
    `;
    }


    // Drapeau dans l'en-tête
    const photoHeader = document.getElementById('pistes-etats-photo-header');
    if (photoHeader) {
        const flagPath = FLAGS_MAP[selectedCountry.toLowerCase()];
        if (flagPath) {
            const fullPath = getImagePath(`/medias/images/flags/${flagPath}`);
            photoHeader.style.backgroundImage = `url('${fullPath}')`;

            // Fallback si l'image ne charge pas
            const testImage = new Image();
            testImage.onerror = () => {
                console.warn('[NEGO-ETATS] Drapeau non trouvé, utilisation du fallback');
                photoHeader.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                photoHeader.textContent = '🌍';
            };
            testImage.onload = () => {
                photoHeader.textContent = ''; // Retire l'emoji si l'image charge
            };
            testImage.src = fullPath;
        }
    }

    // Position + Priorité
    let position = 'FAVORABLE';
    let priorite = 'haute';
    let strategie = countryData['stratégie'] || countryData.strategie || 'Aucune stratégie définie';

    if (selection !== 'directive' && selection) {
        const amendData = (countryData.positions_amendements || []).find(a => a.amendement === selection);
        if (amendData) {
            position = amendData.position;
            priorite = amendData.priorite || amendData.priorité || 'moyenne';
            strategie = amendData.justification || strategie;
        }
    }

    // Badge position
    const positionBadge = document.getElementById('pistes-etats-position-badge');
    if (positionBadge) {
        const emoji = getPositionEmoji(position);
        const badgeIcon = positionBadge.querySelector('.badge-icon');
        const badgeText = positionBadge.querySelector('.badge-text');
        if (badgeIcon) badgeIcon.textContent = emoji;
        if (badgeText) badgeText.textContent = position.replace(/_/g, ' ');
    }

    // Badge priorité
    const priorityBadge = document.getElementById('pistes-etats-priority-badge');
    if (priorityBadge) {
        const starsElem = priorityBadge.querySelector('.priority-stars');
        const textElem = priorityBadge.querySelector('.priority-text');
        if (starsElem) starsElem.textContent = getPriorityStars(priorite);
        if (textElem) textElem.textContent = getPriorityText(priorite);
    }

    // Stratégie
    const strategyText = document.getElementById('pistes-etats-strategy-text');
    if (strategyText) {
        strategyText.textContent = strategie || 'Aucune stratégie définie.';
    }

    // Arguments
    const argumentsArray = countryData['éléments_d_argumentaire'] ||
        countryData.elements_argumentaire ||
        countryData['éléments_argumentaire'] || [];

    const argsContainer = document.getElementById('pistes-etats-arguments');
    const argsCount = document.getElementById('pistes-etats-args-count');

    if (argsCount) argsCount.textContent = argumentsArray.length;
    if (argsContainer) {
        argsContainer.innerHTML = '';

        if (argumentsArray.length === 0) {
            argsContainer.innerHTML = '<p style="color: #999; font-style: italic;">Aucun argument disponible.</p>';
        } else {
            argumentsArray.forEach(arg => {
                const div = document.createElement('div');
                div.className = 'argument-item';
                div.textContent = arg;
                argsContainer.appendChild(div);
            });
        }
    }

    // Alliances
    const alliances = countryData.alliances || [];
    const alliancesContainer = document.getElementById('pistes-etats-alliances-list');
    const alliancesCount = document.getElementById('pistes-etats-alliances-count');

    if (alliancesCount) alliancesCount.textContent = alliances.length;
    if (alliancesContainer) {
        alliancesContainer.innerHTML = '';

        if (alliances.length === 0) {
            const li = document.createElement('li');
            li.style.color = '#999';
            li.style.fontStyle = 'italic';
            li.textContent = 'Aucune alliance identifiée.';
            alliancesContainer.appendChild(li);
        } else {
            alliances.forEach(alliance => {
                const parts = alliance.split(/[\(\):]/);
                const name = parts[0].trim();
                const desc = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';

                const li = document.createElement('li');
                li.className = 'nego-card-list-item';
                li.innerHTML = `
                    <span class="nego-card-list-item-icon">✔</span>
                    <span class="nego-card-list-item-text">
                        <strong>${name}</strong>${desc ? ` - ${desc}` : ''}
                    </span>
                `;
                alliancesContainer.appendChild(li);
            });
        }
    }

    // Oppositions
    const oppositions = countryData.oppositions || [];
    const oppositionsContainer = document.getElementById('pistes-etats-oppositions-list');
    const oppositionsCount = document.getElementById('pistes-etats-oppositions-count');

    if (oppositionsCount) oppositionsCount.textContent = oppositions.length;
    if (oppositionsContainer) {
        oppositionsContainer.innerHTML = '';

        if (oppositions.length === 0) {
            const li = document.createElement('li');
            li.style.color = '#999';
            li.style.fontStyle = 'italic';
            li.textContent = 'Aucune opposition identifiée.';
            oppositionsContainer.appendChild(li);
        } else {
            oppositions.forEach(opp => {
                const parts = opp.split(/[\(\):]/);
                const name = parts[0].trim();
                const desc = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';

                const li = document.createElement('li');
                li.className = 'nego-card-list-item opposition';
                li.innerHTML = `
                    <span class="nego-card-list-item-icon">🔴</span>
                    <span class="nego-card-list-item-text">
                        <strong>${name}</strong>${desc ? ` - ${desc}` : ''}
                    </span>
                `;
                oppositionsContainer.appendChild(li);
            });
        }
    }

    // Notes internes
    const notes = countryData.notes_internes || 'Aucune note disponible';
    const notesText = document.getElementById('pistes-etats-notes-text');
    if (notesText) {
        notesText.textContent = notes;
    }

    console.log("[NEGO-ETATS] ✅ Affichage terminé");
}

/**
 * Initialisation principale
 */
export async function initNegoEtatsSubTab() {
    console.log("[NEGO-ETATS] 🚀 Initialisation...");

    const loaded = await loadEtatsNegoData();
    if (!loaded) {
        console.error("[NEGO-ETATS] ❌ Échec chargement données");
        return;
    }

    populateEtatsMenu();

    // Événement sur le menu pays
    const countryMenu = document.getElementById('pistes-etats-country-menu');
    if (countryMenu) {
        countryMenu.addEventListener('change', (e) => {
            selectedCountry = e.target.value;
            console.log("[NEGO-ETATS] Pays sélectionné:", selectedCountry);
            if (selectedCountry) {
                updateDirectiveMenu();
                updateDisplay('directive');
            }
        });
    }

    // Événement sur le menu directive/amendements
    const directiveMenu = document.getElementById('pistes-etats-directive-menu');
    if (directiveMenu) {
        directiveMenu.addEventListener('change', (e) => {
            console.log("[NEGO-ETATS] Sélection changée:", e.target.value);
            updateDisplay(e.target.value);
        });
    }

    // Initialisation auto avec l'Allemagne
    if (countryMenu && etatsNegoData.length > 0) {
        const allemagne = etatsNegoData.find(c => c.nom === 'Allemagne');
        if (allemagne) {
            const allemagneId = COUNTRY_IDS['Allemagne'];
            console.log("[NEGO-ETATS] 🇩🇪 Initialisation automatique avec l'Allemagne");
            countryMenu.value = allemagneId;
            selectedCountry = allemagneId;
            updateDirectiveMenu();
            updateDisplay('directive');
        }
    }

    console.log("[NEGO-ETATS] ✅ Initialisation terminée");
}
