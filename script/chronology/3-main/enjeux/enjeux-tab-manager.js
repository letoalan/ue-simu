import { AppState } from '../../../state/index.js';
import { updateContentDisplay } from '../content-display-manager.js';

let enjeuxData = null; // Stocke les données JSON une fois chargées

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
function updateCommissionContent(DOMRefs) {
    if (!enjeuxData?.directive) return;
    const directive = enjeuxData.directive;
    const commission = directive.commission;
    if (!commission) return;

    const text = `
         <div class="enjeux-header">
             <h2>${directive.title}</h2>
             <p>${directive.description}</p>
             <div class="commission-enjeux">
                 <h4>Rôle de la Commission</h4>
                 <p><b>Objectif principal :</b> ${commission.role}</p>
                 <b>Enjeux à maîtriser :</b>
                 <ul>${commission.enjeux.map(e => `<li>${e}</li>`).join('')}</ul>
             </div>
         </div>`;

    updateContentDisplay({
        photoContainer: DOMRefs.enjeuxCommissionPhoto,
        textContainer: DOMRefs.enjeuxCommissionText,
        photoUrl: getImagePath('/medias/images/euro/omnibus.jpg'), // Image générique
        text: text
    });
}


/**
 * Crée le HTML pour une carte d'acteur unique.
 * @param {object} actor - L'objet de données pour l'acteur (pays, parti, ou lobby).
 * @param {string} type - Le type d'acteur ('state', 'party', ou 'lobby').
 * @returns {string} Le HTML de la carte.
 */
function createActorCardHTML(actor, type) {
    if (!actor) return '<p>Données non disponibles pour cette sélection.</p>';

    let contentHTML = '';
    if (type === 'state' || type === 'party') {
        contentHTML = `
             ${actor.position ? `<p><b>Position :</b> ${actor.position}</p>` : ''}
             ${actor.amendment ? `<p><b>Amendement proposé :</b> ${actor.amendment}</p>` : ''}
             ${actor.amendments ? `<b>Amendements proposés :</b><ul>${actor.amendments.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
         `;
    } else if (type === 'lobby') {
        contentHTML = `
             <b>Intérêts à défendre :</b>
             <ul>${actor.interests.map(i => `<li>${i}</li>`).join('')}</ul>
             ${actor.alliances && actor.alliances.length > 0 ? `<p><b>Alliances probables :</b> ${actor.alliances.join(', ')}</p>` : ''}
         `;
    }

    return `
         <div class="enjeux-card">
             <h4>${actor.name || actor.sector}</h4>
             ${actor.role ? `<p class="role ${actor.role.toLowerCase().includes('porteur') ? 'porteur' : ''}">Rôle : ${actor.role}</p>` : ''}
             ${contentHTML}
             ${actor.enjeux ? `<b>Enjeux :</b><ul>${actor.enjeux.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
             ${actor.strategie ? `<p><b>Stratégie :</b> ${actor.strategie}</p>` : ''}
         </div>
     `;
}

function updateEtatsContent(countryName, DOMRefs) {
    if (!enjeuxData?.directive?.countries) return;
    const data = enjeuxData.directive.countries.find(c => c.name === countryName);
    const cardHTML = createActorCardHTML(data, 'state');

    updateContentDisplay({
        photoContainer: DOMRefs.enjeuxEtatsPhoto,
        textContainer: DOMRefs.enjeuxEtatsText,
        photoUrl: getImagePath('/medias/images/euro/etatdir.jpg'), // Image générique
        text: cardHTML
    });
}

function updatePartisContent(partyName, DOMRefs) {
    if (!enjeuxData?.directive?.parties) return;
    const data = enjeuxData.directive.parties.find(p => p.name === partyName);
    const cardHTML = createActorCardHTML(data, 'party');

    updateContentDisplay({
        photoContainer: DOMRefs.enjeuxPartisPhoto,
        textContainer: DOMRefs.enjeuxPartisText,
        photoUrl: getImagePath('/medias/images/euro/partidir.jpg'), // Image générique
        text: cardHTML
    });
}

function updateLobbiesContent(lobbySector, DOMRefs) {
    if (!enjeuxData?.directive?.lobbies) return;
    const data = enjeuxData.directive.lobbies.find(l => l.sector === lobbySector);
    const cardHTML = createActorCardHTML(data, 'lobby');

    updateContentDisplay({
        photoContainer: DOMRefs.enjeuxLobbiesPhoto,
        textContainer: DOMRefs.enjeuxLobbiesText,
        photoUrl: getImagePath('/medias/images/euro/lobbiesdir.jpg'), // Image générique
        text: cardHTML
    });
}

function populateSelectors(DOMRefs) {
    if (!enjeuxData?.directive) return;
    const { countries, parties, lobbies } = enjeuxData.directive;

    if (DOMRefs.enjeuxEtatsMenu && countries) {
        DOMRefs.enjeuxEtatsMenu.innerHTML = countries.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
    if (DOMRefs.enjeuxPartisMenu && parties) {
        DOMRefs.enjeuxPartisMenu.innerHTML = parties.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    }
    if (DOMRefs.enjeuxLobbiesMenu && lobbies) {
        DOMRefs.enjeuxLobbiesMenu.innerHTML = lobbies.map(l => `<option value="${l.sector}">${l.sector}</option>`).join('');
    }
}

async function loadEnjeuxData() {
    const { currentScenarioId, selectedDirectiveId } = AppState;
    if (!currentScenarioId || !selectedDirectiveId) {
        document.getElementById('scenario-tab').innerHTML = `<p style="color: red; text-align: center;">Veuillez sélectionner un scénario et une directive.</p>`;
        return false;
    }

    // Utilise le chemin de base pré-calculé
    const url = `./json/directives/enjeux/s${currentScenarioId}/s${currentScenarioId}d${selectedDirectiveId}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        enjeuxData = await response.json();
        return true;
    } catch (error) {
        console.error("Impossible de charger les données des enjeux:", error);
        document.getElementById('scenario-tab').innerHTML = `<p style="color: red; text-align: center;">Erreur de chargement des données pour cette directive.</p>`;
        return false;
    }
}

export async function initEnjeuxTab(DOMRefs) {
    const dataLoaded = await loadEnjeuxData();
    if (!dataLoaded) return;

    // La structure HTML est déjà chargée. On se contente de la peupler.
    populateSelectors(DOMRefs);

    const subNavButtons = DOMRefs.enjeuxSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('enjeux-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;

    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');

    // Navigation
    subNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const subTabId = button.dataset.subTab + '-sub-tab';
            subTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === subTabId) {
                    content.classList.add('active');
                }
            });
            // Charger le contenu par défaut du sous-onglet activé
            const menu = document.getElementById(`${button.dataset.subTab}-menu`);
            if (menu) {
                menu.dispatchEvent(new Event('change'));
            } else { // Cas de la commission qui n'a pas de menu
                updateCommissionContent(DOMRefs);
            }
        });
    });
    // Listeners pour les menus
    DOMRefs.enjeuxEtatsMenu?.addEventListener('change', e => updateEtatsContent(e.target.value, DOMRefs));
    DOMRefs.enjeuxPartisMenu?.addEventListener('change', e => updatePartisContent(e.target.value, DOMRefs));
    DOMRefs.enjeuxLobbiesMenu?.addEventListener('change', e => updateLobbiesContent(e.target.value, DOMRefs));

    // Affichage initial
    updateCommissionContent(DOMRefs);
    if (DOMRefs.enjeuxEtatsMenu && DOMRefs.enjeuxEtatsMenu.options.length > 0) updateEtatsContent(DOMRefs.enjeuxEtatsMenu.value, DOMRefs);
    if (DOMRefs.enjeuxPartisMenu && DOMRefs.enjeuxPartisMenu.options.length > 0) updatePartisContent(DOMRefs.enjeuxPartisMenu.value, DOMRefs);
    if (DOMRefs.enjeuxLobbiesMenu && DOMRefs.enjeuxLobbiesMenu.options.length > 0) updateLobbiesContent(DOMRefs.enjeuxLobbiesMenu.value, DOMRefs);
}
