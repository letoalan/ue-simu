import { initNegoCommissionSubTab } from './nego-com-sub-tab.js';
import { initNegoEtatsSubTab } from "./nego-etat-sub-tab.js";
import { initNegoPartisSubTab } from "./nego-part-sub-tab.js";
import { initNegoLobbiesSubTab } from "./nego-lobby-sub-tab.js";

/**
 * Initialise l'onglet Négociation avec sa sous-navigation
 */
export function initNegociationTab(DOMRefs) {
    console.log("═══════════════════════════════════════════");
    console.log("[NEGO-TAB-MANAGER] 🚀 Initialisation...");
    console.log("[NEGO-TAB-MANAGER] DOMRefs:", DOMRefs);
    console.log("═══════════════════════════════════════════");

    // IMPORTANT: Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        console.log("[NEGO-TAB-MANAGER] ⏳ DOM en cours de chargement, attente...");
        document.addEventListener('DOMContentLoaded', () => {
            console.log("[NEGO-TAB-MANAGER] ✅ DOM chargé, initialisation...");
            initNegociationTabContent(DOMRefs);
        });
    } else {
        console.log("[NEGO-TAB-MANAGER] ✅ DOM déjà chargé, initialisation immédiate");
        initNegociationTabContent(DOMRefs);
    }
}

/**
 * Fonction interne d'initialisation (appelée après chargement DOM)
 */
function initNegociationTabContent(DOMRefs) {
    console.log("[NEGO-TAB-MANAGER] 📋 Recherche des éléments DOM...");

    // Sélectionner les boutons de sous-navigation
    const subNavButtons = document.querySelectorAll('#pistes-nego-sub-nav .sub-nav-btn');
    console.log("[NEGO-TAB-MANAGER] Boutons trouvés:", subNavButtons.length);

    if (subNavButtons.length === 0) {
        console.error("[NEGO-TAB-MANAGER] ❌ Aucun bouton .sub-nav-btn trouvé dans #pistes-nego-sub-nav !");
        console.error("[NEGO-TAB-MANAGER] ❌ Vérifiez que pistes-nego.html est bien chargé");
        return;
    }

    // Sélectionner le conteneur des sous-onglets
    const subTabContainer = document.getElementById('pistes-nego-sub-tab-container');
    console.log("[NEGO-TAB-MANAGER] Conteneur sous-onglets:", subTabContainer);

    if (!subTabContainer) {
        console.error("[NEGO-TAB-MANAGER] ❌ Conteneur #pistes-nego-sub-tab-container introuvable !");
        return;
    }

    // Sélectionner tous les contenus de sous-onglets
    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');
    console.log("[NEGO-TAB-MANAGER] Contenus sous-onglets trouvés:", subTabContents.length);

    // Initialiser le sous-onglet Commission par défaut
    console.log("[NEGO-TAB-MANAGER] 🎯 Initialisation Commission...");
    try {
        initNegoCommissionSubTab();
        console.log("[NEGO-TAB-MANAGER] ✅ Commission initialisée");
    } catch (error) {
        console.error("[NEGO-TAB-MANAGER] ❌ Erreur lors de l'initialisation Commission:", error);
    }

    // Gestion des clics sur les boutons de sous-navigation
    subNavButtons.forEach((button, index) => {
        console.log(`[NEGO-TAB-MANAGER] 🔘 Bouton ${index}: ${button.dataset.subTab}`);

        button.addEventListener('click', () => {
            console.log(`[NEGO-TAB-MANAGER] 👆 Clic sur: ${button.dataset.subTab}`);

            // Retirer la classe active de tous les boutons
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Construire l'ID du sous-onglet cible
            const subTabId = button.dataset.subTab + '-sub-tab';
            console.log(`[NEGO-TAB-MANAGER] 🎯 ID cible: ${subTabId}`);

            // Activer le bon contenu de sous-onglet
            subTabContents.forEach(content => {
                const isActive = content.id === subTabId;
                content.classList.toggle('active', isActive);
                console.log(`[NEGO-TAB-MANAGER] ${content.id} -> ${isActive ? '✅ active' : '❌ inactive'}`);
            });

            // Initialisation à la demande pour les autres sous-onglets
            switch (button.dataset.subTab) {
                case 'pistes-commission':
                    console.log("[NEGO-TAB-MANAGER] 🔄 Réinitialisation Commission");
                    initNegoCommissionSubTab();
                    break;

                case 'pistes-etats':
                    console.log("[NEGO-TAB-MANAGER] ⏳ Initialisation négociation États, lancement Allemagne");
                    initNegoEtatsSubTab();
                    break;

                case 'pistes-partis':
                    console.log("[NEGO-TAB-MANAGER] ⏳ Init Partis lancement premier parti");
                    initNegoPartisSubTab();
                    break;

                case 'pistes-lobbies':
                    console.log("[NEGO-TAB-MANAGER] ⏳ Init Lobbies lancement tech");
                    initNegoLobbiesSubTab();
                    break;
            }
        });
    });

    console.log("═══════════════════════════════════════════");
    console.log("[NEGO-TAB-MANAGER] ✅ Initialisation terminée");
    console.log("═══════════════════════════════════════════");
}
