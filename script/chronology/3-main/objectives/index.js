import { initObjectivesTab } from './objectives-tab-manager.js';

/**
 * Point d'entrée du module des objectifs.
 * @param {object} DOMRefs - Les références DOM globales.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module Objectives.");
    // Délègue l'initialisation de l'onglet Objectifs au manager spécifique.
    initObjectivesTab(DOMRefs);
}