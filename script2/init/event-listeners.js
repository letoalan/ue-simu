import { AppState } from '../state/index.js';

/**
 * Attache les écouteurs d'événements globaux ou qui coordonnent plusieurs modules.
 * @param {object} DOMRefs - L'objet contenant les références DOM.
 */
export function attachGlobalEventListeners(DOMRefs) {

    // Exemple: Le bouton de lancement de la simulation est un "événement global"
    // car il déclenche la transition d'un module (carousel) à un autre (main).
    if (DOMRefs.launchSimulationBtn) {
        DOMRefs.launchSimulationBtn.addEventListener('click', () => {
            if (AppState.scenario === null /* || ... autres conditions */) {
                alert('Veuillez sélectionner un scénario et une directive.');
                return;
            }
            console.log("Lancement de la simulation...");
            // Ici, vous appelleriez la fonction qui gère l'écran de transition
        });
    }

    // ... Ajoutez ici les autres écouteurs "globaux" (dashboard, fullscreen, etc.)
}