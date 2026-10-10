import { AppState } from '../../../state/index.js';

let commissionNegoData = null;

function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        if (window.location.pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        }
    }
    return `.${relativePath}`;
}

async function loadCommissionNegoData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) return false;

    const url = `json/directives/fiches-acteurs/s${currentScenarioId}/d${selectedDirectiveId}/com_s${currentScenarioId}-d${selectedDirectiveId}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        commissionNegoData = await response.json();
        return true;
    } catch (error) {
        console.error("[NEGO] Erreur chargement:", error);
        return false;
    }
}

function populateDirectiveMenu() {
    const menu = document.getElementById('pistes-com-directive-menu');
    if (!menu) return;

    const { currentScenarioData, selectedDirectiveId } = AppState;
    if (!currentScenarioData || !selectedDirectiveId) return;

    const directiveData = currentScenarioData.directive?.find(d => d.id === selectedDirectiveId);
    if (!directiveData) return;

    menu.innerHTML = '<option value="directive">Directive</option>';

    const amendments = directiveData.amendements || [];
    amendments.forEach(amend => {
        const option = document.createElement('option');
        option.value = amend.id;
        option.textContent = amend.title || `Amendement ${amend.id}`;
        menu.appendChild(option);
    });
}

function updateDisplay(selection) {
    if (!commissionNegoData) return;

    // Photo dans l'en-tête
    const photoHeader = document.getElementById('pistes-com-photo-header');
    if (photoHeader) {
        const imagePath = getImagePath('/medias/images/euro/comnego.jpg');
        photoHeader.style.backgroundImage = `url('${imagePath}')`;

        // Fallback si l'image ne charge pas
        const testImage = new Image();
        testImage.onerror = () => {
            console.warn('[NEGO] Image non trouvée, utilisation d\'un gradient de fallback');
            photoHeader.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            photoHeader.textContent = '🏛️';
        };
        testImage.onload = () => {
            photoHeader.textContent = ''; // Retire l'emoji si l'image charge
        };
        testImage.src = imagePath;
    } else {
        console.error("[NEGO] Élément pistes-com-photo-header non trouvé");
    }

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

    const subjectHeader = document.getElementById('pistes-com-subject-header');
    if (subjectHeader) {
        subjectHeader.innerHTML = `
        <div style="font-size: 0.85em; color: #666; margin-bottom: 4px;">${subjectType}</div>
        <div style="font-size: 1.1em; font-weight: 600; color: #2c3e50;">${subjectName}</div>
    `;
    }
// ============================================




    // Position + Priorité
    let position = 'FAVORABLE';
    let priorite = 'très_haute';
    let strategie = commissionNegoData['stratégie'] || commissionNegoData.strategie || '';

    if (selection !== 'directive') {
        const amendData = (commissionNegoData.positions_amendements || []).find(a => a.amendement === selection);
        if (amendData) {
            position = amendData.position;
            priorite = amendData.priorite || amendData.priorité || 'moyenne';
            strategie = amendData.justification || strategie;
        }
    }

    // Badge position dans l'en-tête
    const positionBadge = document.getElementById('pistes-com-position-badge');
    if (positionBadge) {
        const emoji = position.includes('FAVORABLE') ? '🟢' :
            position.includes('DEFAVORABLE') ? '🔴' : '⚪';
        const badgeIcon = positionBadge.querySelector('.badge-icon');
        const badgeText = positionBadge.querySelector('.badge-text');

        if (badgeIcon) badgeIcon.textContent = emoji;
        if (badgeText) badgeText.textContent = position.replace(/_/g, ' ');
    }

    // Badge priorité dans l'en-tête
    const priorityBadge = document.getElementById('pistes-com-priority-badge');
    if (priorityBadge) {
        const priorityStars = {
            'très_haute': '★★★',
            'haute': '★★',
            'moyenne': '★',
            'basse': '',
            'faible': ''
        }[priorite] || '★';

        const priorityText = {
            'très_haute': 'Très haute priorité',
            'haute': 'Haute priorité',
            'moyenne': 'Moyenne priorité',
            'basse': 'Basse priorité',
            'faible': 'Faible priorité'
        }[priorite] || 'Moyenne priorité';

        const starsElem = priorityBadge.querySelector('.priority-stars');
        const textElem = priorityBadge.querySelector('.priority-text');

        if (starsElem) starsElem.textContent = priorityStars;
        if (textElem) textElem.textContent = priorityText;
    }

    // Stratégie
    const strategyText = document.getElementById('pistes-com-strategy-text');
    if (strategyText) {
        strategyText.textContent = strategie || 'Aucune stratégie définie.';
    }

    // Arguments
    const argumentsArray = commissionNegoData['éléments_d_argumentaire'] || commissionNegoData.elements_argumentaire || [];
    const argsContainer = document.getElementById('pistes-com-arguments');
    const argsCount = document.getElementById('pistes-com-args-count');

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
    const alliances = commissionNegoData.alliances || [];
    const alliancesContainer = document.getElementById('pistes-com-alliances-list');
    const alliancesCount = document.getElementById('pistes-com-alliances-count');

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
    const oppositions = commissionNegoData.oppositions || [];
    const oppositionsContainer = document.getElementById('pistes-com-oppositions-list');
    const oppositionsCount = document.getElementById('pistes-com-oppositions-count');

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
    const notes = commissionNegoData.notes_internes || 'Aucune note disponible';
    const notesText = document.getElementById('pistes-com-notes-text');
    if (notesText) {
        notesText.textContent = notes;
    }
}

export async function initNegoCommissionSubTab() {
    const loaded = await loadCommissionNegoData();
    if (!loaded) {
        console.error('[NEGO] Impossible de charger les données');
        return;
    }

    // ✅ NOUVEAU : Mettre à jour le titre avec scénario + directive
    const titleElem = document.getElementById('pistes-com-title');
    if (titleElem) {
        const { currentScenarioId, selectedDirectiveId, currentScenarioData } = AppState;

        // Récupérer le nom de la directive
        const directiveData = currentScenarioData?.directive?.find(d => d.id === selectedDirectiveId);
        const directiveName = directiveData?.nom || 'Directive';

        // Format: "📋 Scénario 1 | Pacte vert innovant"
        titleElem.textContent = `📋 Scénario ${currentScenarioId} | ${directiveName}`;
    }

    populateDirectiveMenu();

    const menu = document.getElementById('pistes-com-directive-menu');
    if (menu) {
        menu.addEventListener('change', (e) => updateDisplay(e.target.value));
    }

    updateDisplay('directive');
}
