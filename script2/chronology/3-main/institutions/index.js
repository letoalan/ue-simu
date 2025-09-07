import { initEuroTab } from './euro-tab-manager.js';

export function init(DOMRefs) {
    console.log("Initialisation du module Institutions (Euro Tab).");
    // Délègue l'initialisation de l'onglet Euro au manager spécifique.
    initEuroTab(DOMRefs);
}