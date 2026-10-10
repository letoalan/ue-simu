import { showTab } from './tabs-router.js';
import { init as initSimulator } from './simulator/index.js';
import { updateSimulatorInputsDisplay } from './simulator/inputs.js';
import { init as initInstitutionsModule } from './institutions/index.js';
import { init as initObjectivesModule } from './objectives/index.js';
import { init as initVoteModule } from './vote/index.js';
import { init as initEnjeuxModule } from './enjeux/index.js';
import { init as initFichesActeursModule } from './fiches-acteurs/index.js';
import { init as initPistesNegoModule } from './pistes-nego/index.js';

// Flag EN DEHORS de la fonction pour persister
let pistesNegoInitialized = false;

/**
 * Initialise le module de l'interface principale (contenu post-transition).
 * @param {object} DOMRefs - Les références DOM collectées globalement.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module Main Interface.");

    // 1. Mettre à jour l'affichage des inputs
    updateSimulatorInputsDisplay();

    // 2. Configurer les événements
    setupMainEvents(DOMRefs);

    // Verrouiller l'onglet simulateur par défaut
    if (DOMRefs.simulatorTabBtn) {
        DOMRefs.simulatorTabBtn.disabled = true;
        DOMRefs.simulatorTabBtn.title = "Veuillez d'abord terminer le processus de vote dans l'onglet 'Vote'.";
    }

    // 3. Initialiser le simulateur
    initSimulator(DOMRefs);

    // 4. Lancer une première simulation
    if (DOMRefs.simulateBtn) {
        DOMRefs.simulateBtn.click();
    }

    // 5. Initialiser les sous-onglets Euro
    if (DOMRefs.euroSubNav) {
        initInstitutionsModule(DOMRefs);
    }

    // 6. Initialiser l'onglet Objectifs
    if (DOMRefs.objectivesSubNav) {
        initObjectivesModule(DOMRefs);
    }

    // 7. Initialiser l'onglet Vote
    if (document.getElementById('vote-tab')) {
        initVoteModule(DOMRefs);
    }

    // 9. Initialiser l'onglet Fiches Acteurs
    if (document.getElementById('fiches-acteurs-tab')) {
        initFichesActeursModule(DOMRefs);
    }

    // 11. Afficher l'onglet par défaut
    showTab('euro-tab');
}

function setupMainEvents(DOMRefs) {
    // Événements des onglets
    if (DOMRefs.tabButtons) {
        DOMRefs.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                console.log(`[MAIN] Clic sur onglet: ${tabId}`);

                // Changer d'onglet AVANT l'initialisation
                showTab(tabId);

                // Initialisation à la demande pour l'onglet Enjeux
                if (tabId === 'scenario-tab') {
                    initEnjeuxModule(DOMRefs);
                }

                // ✅ CORRECTION: Initialisation SANS setTimeout
                if (tabId === 'pistes-nego-tab' && !pistesNegoInitialized) {
                    console.log("[MAIN] ⏳ Initialisation Pistes de Négociation...");

                    // Vérifier immédiatement que le HTML est chargé
                    const checkElement = document.getElementById('pistes-nego-sub-nav');
                    console.log("[MAIN] Élément #pistes-nego-sub-nav:", checkElement ? "✅ trouvé" : "❌ non trouvé");

                    if (checkElement) {
                        initPistesNegoModule(DOMRefs);
                        pistesNegoInitialized = true;
                        console.log("[MAIN] ✅ Pistes de Négociation initialisées");
                    } else {
                        console.error("[MAIN] ❌ HTML #pistes-nego-sub-nav non trouvé !");
                        console.error("[MAIN] Vérifiez que pistes-nego.html est bien inclus dans le DOM");
                    }
                }
            });
        });
    }
}
