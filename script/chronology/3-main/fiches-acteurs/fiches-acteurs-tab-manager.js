import { initCommissionSubTab } from './commission-sub-tab.js';
import { initEtatsSubTab } from './etats-sub-tab.js';
import { initPartisSubTab } from './partis-sub-tab.js';
import { initLobbiesSubTab } from './lobby-sub-tab.js';



export function initFichesActeursTab(DOMRefs) {
    const subNavButtons = DOMRefs.fichesActeursSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('fiches-acteurs-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;

    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');

    // Initialiser le contenu du premier onglet (Commission) par défaut
    initCommissionSubTab(DOMRefs);

    subNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const subTabId = button.dataset.subTab + '-sub-tab';
            subTabContents.forEach(content => {
                content.classList.toggle('active', content.id === subTabId);
            });

            // Initialisation à la demande pour les autres sous-onglets
            if (button.dataset.subTab === 'fiches-etats') {
                initEtatsSubTab();
            }
            if (button.dataset.subTab === 'fiches-partis') {
                initPartisSubTab();
            }
            if (button.dataset.subTab === 'fiches-lobbies') {
                initLobbiesSubTab();
            }

        });
    });
}