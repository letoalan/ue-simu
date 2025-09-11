import { showTab } from './tabs-router.js';
import { init as initSimulator } from './simulator/index.js';
import { updateSimulatorInputsDisplay } from './simulator/inputs.js';
import { init as initInstitutionsModule } from './institutions/index.js';
import { init as initObjectivesModule } from './objectives/index.js';
import { init as initVoteModule } from './vote/index.js';

/**
 * Initialise le module de l'interface principale (contenu post-transition).
 * @param {object} DOMRefs - Les références DOM collectées globalement.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module Main Interface.");

    // 1. Mettre à jour l'affichage des inputs en fonction du scénario choisi dans le carrousel.
    updateSimulatorInputsDisplay();

    // 2. Configurer les événements de l'interface principale (onglets, dashboard)
    setupMainEvents(DOMRefs);

    // NOUVEAU: Verrouiller l'onglet du simulateur par défaut
    if (DOMRefs.simulatorTabBtn) {
        DOMRefs.simulatorTabBtn.disabled = true;
        DOMRefs.simulatorTabBtn.title = "Veuillez d'abord terminer le processus de vote dans l'onglet 'Vote'.";
    }

    // 3. Initialiser les sous-modules, comme le simulateur (attache les écouteurs, etc.)
    initSimulator(DOMRefs);

    // 4. Lancer une première simulation pour peupler les graphiques avec les valeurs par défaut.
    if (DOMRefs.simulateBtn) {
        DOMRefs.simulateBtn.click();
    }

    // 5. Initialiser la logique des sous-onglets de la page Euro
    if (DOMRefs.euroSubNav) {
        initInstitutionsModule(DOMRefs);
    }

    // 6. Initialiser la logique de l'onglet Objectifs
    if (DOMRefs.objectivesSubNav) {
        initObjectivesModule(DOMRefs);
    }

    // 7. Initialiser la logique de l'onglet Vote
    // Note: L'ID 'vote-tab' doit exister dans 3_main_interface.html
    if (document.getElementById('vote-tab')) {
        initVoteModule(DOMRefs);
    }

    // 8. Afficher l'onglet par défaut au démarrage
    showTab('euro-tab');
}

function setupMainEvents(DOMRefs) {
    // Événements des onglets
    if (DOMRefs.tabButtons) {
        DOMRefs.tabButtons.forEach(button => {
            button.addEventListener('click', () => showTab(button.dataset.tab));
        });
    }

}