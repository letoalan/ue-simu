import { loadAllComponents, collectAllDomReferences } from './init/dom-loader.js';
import { attachGlobalEventListeners } from './init/event-listeners.js';
import { init as initCarouselModule } from './chronology/1-carousel/index.js';

/**
 * Point d'entrée principal de l'application.
 * Orchestre le chargement des composants et leur initialisation.
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM prêt, démarrage de l'initialisation de l'application.");

    // Étape 1: Charger tous les fragments HTML en parallèle.
    await loadAllComponents();
    console.log("Étape 1/4 : Tous les composants HTML sont chargés.");

    // Étape 2: Collecter toutes les références DOM maintenant qu'elles existent.
    const domRefs = collectAllDomReferences();
    console.log("Étape 2/4 : Références DOM collectées.");

    // Étape 3: Attacher les écouteurs d'événements globaux et ceux qui lient les modules.
    attachGlobalEventListeners(domRefs);
    console.log("Étape 3/4 : Écouteurs d'événements globaux attachés.");

    // Étape 4: Initialiser le premier module visible (le carrousel).
    // L'initialisation des autres modules est déclenchée par des événements utilisateur.
    initCarouselModule(domRefs);
    console.log("Étape 4/4 : Module Carrousel initialisé. Application en attente de l'utilisateur.");
});