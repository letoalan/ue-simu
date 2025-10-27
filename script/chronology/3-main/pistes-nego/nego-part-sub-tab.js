import { AppState } from '../../../state/index.js';

let partisNegoData = null;
let selectedParti = null;

// Mapping des partis vers leurs fichiers de logos
const LOGOS_MAP = {
    'verts': 'verts.png',
    'gue': 'gue.png',
    'renew': 'renew.png',
    'sd': 'sd.png',
    'ppe': 'ppe.png',
    'ecr': 'ecr.png'
};

// Mapping des actor_id vers les noms complets
const PARTI_NAMES = {
    'verts': 'Verts/ALE',
    'gue': 'Gauche Unitaire',
    'renew': 'Renew Europe',
    'sd': 'Socialistes & Démocrates',
    'ppe': 'PPE',
    'ecr': 'Conservateurs (ECR)'
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
 * Charge les données JSON de tous les partis pour une directive
 */
async function loadPartisNegoData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("[NEGO-PARTIS] Scénario ou Directive manquants");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/par_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("[NEGO-PARTIS] Chargement:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        partisNegoData = Array.isArray(data) ? data : [data];
        console.log("[NEGO-PARTIS] ✅ Données chargées:", partisNegoData.length, "partis");
        console.log("[NEGO-PARTIS] Partis disponibles:", partisNegoData.map(p => p.nom).join(', '));
        return true;
    } catch (error) {
        console.error("[NEGO-PARTIS] ❌ Erreur chargement:", error);
        return false;
    }
}

/**
 * Remplit le menu déroulant avec les partis
 */
function populatePartisMenu() {
    const partiMenu = document.getElementById('pistes-partis-menu');
    if (!partiMenu || !partisNegoData) {
        console.error("[NEGO-PARTIS] Menu ou données manquants");
        return;
    }

    partiMenu.innerHTML = '';

    partisNegoData.forEach(parti => {
        const partiId = parti.actor_id;
        const option = document.createElement('option');
        option.value = partiId;
        option.textContent = parti.nom;
        partiMenu.appendChild(option);
    });

    console.log("[NEGO-PARTIS] ✅ Menu rempli avec", partisNegoData.length, "partis");
}

/**
 * Met à jour le menu Directive/Amendements
 */
function updateDirectiveMenu() {
    const directiveMenu = document.getElementById('pistes-partis-directive-menu');
    if (!directiveMenu || !selectedParti) {
        console.warn("[NEGO-PARTIS] Menu directive ou parti manquant");
        return;
    }

    const { currentScenarioData, selectedDirectiveId } = AppState;
    if (!currentScenarioData || !selectedDirectiveId) {
        console.error("[NEGO-PARTIS] currentScenarioData ou selectedDirectiveId manquants");
        return;
    }

    const directiveData = currentScenarioData.directive?.find(d => d.id === selectedDirectiveId);
    if (!directiveData) {
        console.error("[NEGO-PARTIS] Directive non trouvée");
        return;
    }

    directiveMenu.disabled = false;
    directiveMenu.innerHTML = '';

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
 * Affiche les données d'un parti
 */
function updateDisplay(selection) {
    if (!selectedParti) {
        console.warn("[NEGO-PARTIS] Aucun parti sélectionné");
        return;
    }

    console.log("[NEGO-PARTIS] Affichage pour:", selectedParti, "- Sélection:", selection);

    const partiData = partisNegoData.find(p => p.actor_id === selectedParti);

    if (!partiData) {
        console.error("[NEGO-PARTIS] ❌ Données du parti introuvables:", selectedParti);
        return;
    }

    console.log("[NEGO-PARTIS] ✅ Données trouvées pour:", partiData.nom);

    // ============================================
    // Récupérer et afficher le nom de la directive/amendement
    // ============================================
    const { currentScenarioData, selectedDirectiveId } = AppState;
    const directiveData = currentScenarioData?.directive?.find(d => d.id === selectedDirectiveId);

    let subjectName = '';
    let subjectType = '';

    if (selection === 'directive' && directiveData) {
        subjectName = directiveData.nom;
        subjectType = '📋 Directive';
    } else if (selection && directiveData) {
        const amendement = directiveData.amendements?.find(a => a.id === selection);
        if (amendement) {
            subjectName = amendement.description;
            subjectType = '📝 Amendement';
        }
    }

    // Mettre à jour l'élément du header
    const subjectHeader = document.getElementById('pistes-partis-subject-header');
    if (subjectHeader) {
        subjectHeader.innerHTML = `
            <div style="font-size: 0.85em; color: #666; margin-bottom: 4px;">${subjectType}</div>
            <div style="font-size: 1.1em; font-weight: 600; color: #2c3e50;">${subjectName}</div>
        `;
    }
    // ============================================

    // Mise à jour du titre dans l'en-tête
    const titleElem = document.getElementById('pistes-partis-title');
    if (titleElem) {
        const partiName = PARTI_NAMES[selectedParti] || partiData.nom;
        titleElem.textContent = `🗳️ ${partiName}`;
    }

    // Photo/Logo dans l'en-tête
    const photoHeader = document.getElementById('pistes-partis-photo-header');
    if (photoHeader) {
        const logoFile = LOGOS_MAP[selectedParti] || 'default.png';
        const imagePath = getImagePath(`/medias/images/logo-partis/${logoFile}`);
        photoHeader.style.backgroundImage = `url('${imagePath}')`;
        photoHeader.style.backgroundSize = 'contain';
        photoHeader.style.backgroundPosition = 'center';

        // Fallback si l'image ne charge pas
        const testImage = new Image();
        testImage.onerror = () => {
            console.warn('[NEGO-PARTIS] Logo non trouvé, utilisation d\'un gradient de fallback');
            photoHeader.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            photoHeader.textContent = '🗳️';
            photoHeader.style.backgroundSize = 'cover';
        };
        testImage.onload = () => {
            photoHeader.textContent = '';
        };
        testImage.src = imagePath;
    }

    // Position + Priorité
    let position = 'FAVORABLE';
    let priorite = 'très_haute';
    let strategie = partiData['stratégie'] || partiData.strategie || '';

    if (selection !== 'directive') {
        const amendData = (partiData.positions_amendements || []).find(a => a.amendement === selection);
        if (amendData) {
            position = amendData.position;
            priorite = amendData.priorite || amendData.priorité || 'moyenne';
            strategie = amendData.justification || strategie;
        }
    }

    // Badge position
    const positionBadge = document.getElementById('pistes-partis-position-badge');
    if (positionBadge) {
        const emoji = getPositionEmoji(position);
        const badgeIcon = positionBadge.querySelector('.badge-icon');
        const badgeText = positionBadge.querySelector('.badge-text');

        if (badgeIcon) badgeIcon.textContent = emoji;
        if (badgeText) badgeText.textContent = position.replace(/_/g, ' ');
    }

    // Badge priorité
    const priorityBadge = document.getElementById('pistes-partis-priority-badge');
    if (priorityBadge) {
        const priorityStars = getPriorityStars(priorite);
        const priorityText = getPriorityText(priorite);

        const starsElem = priorityBadge.querySelector('.priority-stars');
        const textElem = priorityBadge.querySelector('.priority-text');

        if (starsElem) starsElem.textContent = priorityStars;
        if (textElem) textElem.textContent = priorityText;
    }

    // Stratégie
    const strategyText = document.getElementById('pistes-partis-strategy-text');
    if (strategyText) {
        strategyText.textContent = strategie || 'Aucune stratégie définie.';
    }

    // Arguments
    const argumentsArray = partiData['éléments_d_argumentaire'] || partiData.elements_argumentaire || [];
    const argsContainer = document.getElementById('pistes-partis-arguments');
    const argsCount = document.getElementById('pistes-partis-args-count');

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
    const alliances = partiData.alliances || [];
    const alliancesContainer = document.getElementById('pistes-partis-alliances-list');
    const alliancesCount = document.getElementById('pistes-partis-alliances-count');

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
    const oppositions = partiData.oppositions || [];
    const oppositionsContainer = document.getElementById('pistes-partis-oppositions-list');
    const oppositionsCount = document.getElementById('pistes-partis-oppositions-count');

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
    const notes = partiData.notes_internes || 'Aucune note disponible';
    const notesText = document.getElementById('pistes-partis-notes-text');
    if (notesText) {
        notesText.textContent = notes;
    }
}

/**
 * Gestion des événements
 */
function handlePartiChange() {
    const partiMenu = document.getElementById('pistes-partis-menu');
    if (!partiMenu) return;

    selectedParti = partiMenu.value;
    console.log("[NEGO-PARTIS] Parti sélectionné:", selectedParti);

    updateDirectiveMenu();
    updateDisplay('directive');
}

function handleDirectiveChange() {
    const directiveMenu = document.getElementById('pistes-partis-directive-menu');
    if (!directiveMenu) return;

    const selection = directiveMenu.value;
    updateDisplay(selection);
}

/**
 * Initialisation du sous-onglet Partis
 */
export async function initNegoPartisSubTab() {
    console.log("[NEGO-PARTIS] Initialisation...");

    const success = await loadPartisNegoData();
    if (!success) {
        console.error("[NEGO-PARTIS] ❌ Échec du chargement");
        return;
    }

    populatePartisMenu();

    const partiMenu = document.getElementById('pistes-partis-menu');
    if (partiMenu) {
        partiMenu.addEventListener('change', handlePartiChange);

        // Sélection automatique du premier parti
        if (partisNegoData && partisNegoData.length > 0) {
            selectedParti = partisNegoData[0].actor_id;
            partiMenu.value = selectedParti;
            updateDirectiveMenu();
            updateDisplay('directive');
        }
    }

    const directiveMenu = document.getElementById('pistes-partis-directive-menu');
    if (directiveMenu) {
        directiveMenu.addEventListener('change', handleDirectiveChange);
    }

    console.log("[NEGO-PARTIS] ✅ Initialisé");
}
