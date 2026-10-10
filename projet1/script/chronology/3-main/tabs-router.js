import { DOMRefs } from '../../state/index.js';

export function showTab(tabId) {
    console.log(`Changement d'onglet: ${tabId}`);

    // Retirer la classe 'active' de tous les boutons
    DOMRefs.tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Masquer tous les contenus d'onglets
    DOMRefs.tabContents.forEach(section => {
        section.style.display = 'none';
    });

    // Afficher le contenu de l'onglet sélectionné
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Activer le bouton correspondant
    const activeButton = document.querySelector(`nav button[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Gérer la visibilité du bouton dashboard
    if (DOMRefs.dashboardToggle) {
        DOMRefs.dashboardToggle.style.display = (tabId === 'simulator-tab') ? 'block' : 'none';
    }
}