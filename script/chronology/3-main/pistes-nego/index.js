import { initNegociationTab } from './negociation-tab-manager.js';

export function init(DOMRefs) {
    console.log("═══════════════════════════════════════════");
    console.log("[PISTES-NEGO-INDEX] 🚀 Initialisation du module Pistes de Négociation");
    console.log("[PISTES-NEGO-INDEX] DOMRefs reçus:", DOMRefs);
    console.log("═══════════════════════════════════════════");

    // Vérifier que la fonction est disponible
    if (typeof initNegociationTab !== 'function') {
        console.error("[PISTES-NEGO-INDEX] ❌ initNegociationTab n'est pas une fonction !");
        return;
    }

    console.log("[PISTES-NEGO-INDEX] Appel de initNegociationTab...");
    initNegociationTab(DOMRefs);
    console.log("[PISTES-NEGO-INDEX] ✅ initNegociationTab terminé");
}
