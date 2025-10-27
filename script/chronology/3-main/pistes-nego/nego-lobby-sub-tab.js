import { AppState } from '../../../state/index.js';

let lobbiesNegoData = null;
let selectedLobby = null;

// Mapping des lobbies vers leurs logos
const LOGOS_MAP = {
    'agrochimie': 'agrochimie.png',
    'auto': 'auto.png',
    'finance': 'finance.png',
    'fossiles': 'fossiles.png',
    'pharma': 'pharma.png',
    'tech': 'tech.png'
};

// Mapping des actor_id vers les noms courts
const LOBBY_NAMES = {
    'agrochimie': 'Agrochimie',
    'auto': 'Automobile',
    'finance': 'Finance',
    'fossiles': 'Énergies Fossiles',
    'pharma': 'Pharmaceutique',
    'tech': 'Technologies'
};

/**
 * Fonction utilitaire pour les chemins d'images
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
 * Chargement des données JSON des lobbies
 */
async function loadLobbiesNegoData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        console.error("[NEGO-LOBBIES] Scénario ou Directive manquants");
        return false;
    }

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/lob_s${currentScenarioId}-d${selectedDirectiveId}.json`;
    console.log("[NEGO-LOBBIES] Chargement:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        lobbiesNegoData = Array.isArray(data) ? data : [data];
        console.log("[NEGO-LOBBIES] ✅ Données chargées:", lobbiesNegoData.length, "lobbies");
        console.log("[NEGO-LOBBIES] Lobbies disponibles:", lobbiesNegoData.map(l => l.nom).join(', '));

        // DEBUG: Afficher les actor_id de tous les lobbies
        console.log("[NEGO-LOBBIES] 🔍 Actor IDs:", lobbiesNegoData.map(l => ({
            nom: l.nom,
            actor_id: l.actor_id || l.id
        })));

        return true;
    } catch (error) {
        console.error("[NEGO-LOBBIES] ❌ Erreur chargement:", error);
        return false;
    }
}

/**
 * Remplit le menu déroulant des lobbies
 */
function populateLobbyMenu() {
    const lobbyMenu = document.getElementById('pistes-lobbies-menu');
    if (!lobbyMenu || !lobbiesNegoData) {
        console.error("[NEGO-LOBBIES] Menu ou données manquants");
        return;
    }

    lobbyMenu.innerHTML = '';

    lobbiesNegoData.forEach(lobby => {
        const lobbyId = lobby.actor_id || lobby.id;
        console.log('[NEGO-LOBBIES] 📌', lobby.nom, '→ actor_id:', lobbyId);

        const option = document.createElement('option');
        option.value = lobbyId;
        option.textContent = lobby.nom;
        lobbyMenu.appendChild(option);
    });

    console.log("[NEGO-LOBBIES] ✅ Menu rempli avec", lobbiesNegoData.length, "lobbies");
}

/**
 * Met à jour le menu Directive/Amendements
 */
function updateDirectiveMenu() {
    const directiveMenu = document.getElementById('pistes-lobbies-directive-menu');
    if (!directiveMenu || !selectedLobby) {
        console.warn("[NEGO-LOBBIES] Menu directive ou lobby manquant");
        return;
    }

    const { currentScenarioData, selectedDirectiveId } = AppState;
    if (!currentScenarioData || !selectedDirectiveId) {
        console.error("[NEGO-LOBBIES] currentScenarioData ou selectedDirectiveId manquants");
        return;
    }

    const directiveData = currentScenarioData.directive?.find(d => d.id === selectedDirectiveId);
    if (!directiveData) {
        console.error("[NEGO-LOBBIES] Directive non trouvée");
        return;
    }

    directiveMenu.disabled = false;
    directiveMenu.innerHTML = '<option value="directive">Directive</option>';  // ✅ Directive ajoutée
    const amendments = directiveData.amendements || [];
    amendments.forEach(amend => {
        const option = document.createElement('option');
        option.value = amend.id;
        option.textContent = amend.title || `Amendement ${amend.id}`;
        directiveMenu.appendChild(option);
    });

    console.log("[NEGO-LOBBIES] ✅ Menu directive rempli avec", amendments.length, "amendements");
}

/**
 * Fonctions utilitaires pour les icônes et priorités
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
 * Met à jour l'affichage principal
 */
function updateDisplay(selection) {
    console.log('[NEGO-LOBBIES] 🔍 updateDisplay() appelé');
    console.log('[NEGO-LOBBIES] 🔍 selectedLobby:', selectedLobby);
    console.log('[NEGO-LOBBIES] 🔍 selection:', selection);

    if (!selectedLobby) {
        console.warn("[NEGO-LOBBIES] ⚠️ Aucun lobby sélectionné");
        return;
    }

    console.log("[NEGO-LOBBIES] Affichage pour:", selectedLobby, "- Sélection:", selection);

    const lobbyData = lobbiesNegoData.find(l => (l.actor_id || l.id) === selectedLobby);

    console.log('[NEGO-LOBBIES] 🔍 lobbyData trouvé:', lobbyData ? '✅ OUI' : '❌ NON');

    if (!lobbyData) {
        console.error("[NEGO-LOBBIES] ❌ Données du lobby introuvables:", selectedLobby);
        console.error("[NEGO-LOBBIES] 🔍 Actor IDs disponibles:", lobbiesNegoData.map(l => l.actor_id || l.id));
        return;
    }

    console.log("[NEGO-LOBBIES] ✅ Données trouvées pour:", lobbyData.nom);

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

    console.log('[NEGO-LOBBIES] 🔍 Subject:', subjectType, subjectName);

    // Mettre à jour l'élément du header
    const subjectHeader = document.getElementById('pistes-lobbies-subject-header');
    console.log('[NEGO-LOBBIES] 🔍 subjectHeader element:', subjectHeader ? '✅ trouvé' : '❌ NON TROUVÉ');

    if (subjectHeader) {
        subjectHeader.innerHTML = `
            <div style="font-size: 0.85em; color: #666; margin-bottom: 4px;">${subjectType}</div>
            <div style="font-size: 1.1em; font-weight: 600; color: #2c3e50;">${subjectName}</div>
        `;
        console.log('[NEGO-LOBBIES] ✅ Subject header mis à jour');
    }
    // ============================================

    // Titre du lobby
    const titleElem = document.getElementById('pistes-lobbies-title');
    console.log('[NEGO-LOBBIES] 🔍 titleElem:', titleElem ? '✅ trouvé' : '❌ NON TROUVÉ');

    if (titleElem) {
        const lobbyName = LOBBY_NAMES[selectedLobby] || lobbyData.nom;
        titleElem.textContent = `💼 ${lobbyName}`;
        console.log('[NEGO-LOBBIES] ✅ Titre mis à jour:', lobbyName);
    }

    // Logo du lobby dans l'en-tête
    const photoHeader = document.getElementById('pistes-lobbies-photo-header');
    console.log('[NEGO-LOBBIES] 🔍 photoHeader:', photoHeader ? '✅ trouvé' : '❌ NON TROUVÉ');

    if (photoHeader) {
        const logoFile = LOGOS_MAP[selectedLobby] || 'default.png';
        const imagePath = getImagePath(`/medias/images/logo-lobbies/${logoFile}`);
        photoHeader.style.backgroundImage = `url('${imagePath}')`;
        photoHeader.style.backgroundSize = 'contain';
        photoHeader.style.backgroundPosition = 'center';
        photoHeader.style.backgroundRepeat = 'no-repeat';

        const testImage = new Image();
        testImage.onerror = () => {
            console.warn('[NEGO-LOBBIES] Logo non trouvé:', imagePath);
            photoHeader.style.backgroundImage = 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';
            photoHeader.textContent = '💼';
            photoHeader.style.backgroundSize = 'cover';
        };
        testImage.onload = () => {
            console.log('[NEGO-LOBBIES] ✅ Logo chargé:', imagePath);
            photoHeader.textContent = '';
        };
        testImage.src = imagePath;
    }

    // Position et priorité
    let position = 'FAVORABLE';
    let priorite = 'très_haute';
    let strategie = lobbyData['stratégie'] || lobbyData.strategie || '';

    if (selection !== 'directive') {
        const amendData = (lobbyData.positions_amendements || []).find(a => a.amendement === selection);
        if (amendData) {
            position = amendData.position;
            priorite = amendData.priorite || amendData.priorite || 'moyenne';
            strategie = amendData.justification || strategie;
        }
    }

    // Badge position
    const positionBadge = document.getElementById('pistes-lobbies-position-badge');
    if (positionBadge) {
        const emoji = getPositionEmoji(position);
        const badgeIcon = positionBadge.querySelector('.badge-icon');
        const badgeText = positionBadge.querySelector('.badge-text');
        if (badgeIcon) badgeIcon.textContent = emoji;
        if (badgeText) badgeText.textContent = position.replace(/_/g, ' ');
    }

    // Badge priorité
    const priorityBadge = document.getElementById('pistes-lobbies-priority-badge');
    if (priorityBadge) {
        const starsElem = priorityBadge.querySelector('.priority-stars');
        const textElem = priorityBadge.querySelector('.priority-text');
        if (starsElem) starsElem.textContent = getPriorityStars(priorite);
        if (textElem) textElem.textContent = getPriorityText(priorite);
    }

    // Stratégie
    const strategyText = document.getElementById('pistes-lobbies-strategy-text');
    if (strategyText) {
        strategyText.textContent = strategie || 'Aucune stratégie définie.';
    }

    // Arguments
    const argumentsArray = lobbyData['éléments_d_argumentaire'] || lobbyData.elements_argumentaire || [];
    const argsContainer = document.getElementById('pistes-lobbies-arguments');
    const argsCount = document.getElementById('pistes-lobbies-args-count');

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
    const alliances = lobbyData.alliances || [];
    const alliancesContainer = document.getElementById('pistes-lobbies-alliances-list');
    const alliancesCount = document.getElementById('pistes-lobbies-alliances-count');

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
    const oppositions = lobbyData.oppositions || [];
    const oppositionsContainer = document.getElementById('pistes-lobbies-oppositions-list');
    const oppositionsCount = document.getElementById('pistes-lobbies-oppositions-count');

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
    const notes = lobbyData.notes_internes || 'Aucune note disponible';
    const notesText = document.getElementById('pistes-lobbies-notes-text');
    if (notesText) {
        notesText.textContent = notes;
    }

    console.log("[NEGO-LOBBIES] ✅ Affichage mis à jour complètement");
}

/**
 * Gestion des événements
 */
function handleLobbyChange() {
    const lobbyMenu = document.getElementById('pistes-lobbies-menu');
    if (!lobbyMenu) return;

    selectedLobby = lobbyMenu.value;
    console.log("[NEGO-LOBBIES] Lobby sélectionné:", selectedLobby);

    updateDirectiveMenu();
    updateDisplay('directive');
}

function handleDirectiveChange() {
    const directiveMenu = document.getElementById('pistes-lobbies-directive-menu');
    if (!directiveMenu) return;

    const selection = directiveMenu.value;
    updateDisplay(selection);
}

/**
 * Initialisation principale
 */
export async function initNegoLobbiesSubTab() {
    console.log("[NEGO-LOBBIES] 🚀 Initialisation...");

    const loaded = await loadLobbiesNegoData();
    if (!loaded) {
        console.error("[NEGO-LOBBIES] ❌ Échec du chargement des données");
        return;
    }

    populateLobbyMenu();

    const lobbyMenu = document.getElementById('pistes-lobbies-menu');
    console.log('[NEGO-LOBBIES] 🔍 lobbyMenu element:', lobbyMenu ? '✅ trouvé' : '❌ NON TROUVÉ');

    if (lobbyMenu) {
        lobbyMenu.addEventListener('change', handleLobbyChange);

        // Sélection automatique : priorité au lobby 'tech' si disponible
        if (lobbiesNegoData && lobbiesNegoData.length > 0) {
            // Chercher le lobby 'tech'
            const techLobby = lobbiesNegoData.find(l => (l.actor_id || l.id) === 'tech');

            if (techLobby) {
                selectedLobby = 'tech';
                console.log("[NEGO-LOBBIES] ✨ Lobby 'tech' sélectionné par défaut");
            } else {
                selectedLobby = lobbiesNegoData[0].actor_id || lobbiesNegoData[0].id;
                console.log("[NEGO-LOBBIES] Premier lobby sélectionné:", selectedLobby);
            }

            lobbyMenu.value = selectedLobby;
            console.log('[NEGO-LOBBIES] 🔍 Menu value défini à:', lobbyMenu.value);

            updateDirectiveMenu();
            updateDisplay('directive');
        }
    }

    const directiveMenu = document.getElementById('pistes-lobbies-directive-menu');
    if (directiveMenu) {
        directiveMenu.addEventListener('change', handleDirectiveChange);
    }

    console.log("[NEGO-LOBBIES] ✅ Initialisation terminée");
}
