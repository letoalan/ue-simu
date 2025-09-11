import { ScenariosData } from '../state/index.js';

/**
 * Détecte l'environnement (local ou GitHub Pages) pour construire le bon chemin de base.
 * @returns {string} Le chemin de base pour les ressources.
 */
function getBasePath() {
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        // Sur GitHub Pages, le chemin inclut le nom du repository.
        const pathParts = window.location.pathname.split('/').filter(part => part !== '');
        return pathParts.length > 0 ? `/${pathParts[0]}` : '';
    }
    // En local, un chemin relatif simple suffit.
    return '.';
}

/**
 * Charge les données de tous les scénarios au démarrage de l'application
 * et les stocke dans l'état global.
 */
export async function loadAllScenarioData() {
    const basePath = getBasePath();
    const scenario1Url = `${basePath}/json/scenario1.json`;
    const scenario2Url = `${basePath}/json/scenario2.json`;

    try {
        const [data1, data2] = await Promise.all([
            fetch(scenario1Url).then(r => r.json()),
            fetch(scenario2Url).then(r => r.json())
        ]);
        ScenariosData[1] = data1;
        ScenariosData[2] = data2;
        console.log("✅ Données des scénarios pré-chargées avec succès.");
    } catch (error) {
        console.error("❌ ERREUR CRITIQUE lors du pré-chargement des données des scénarios.", error);
        alert("Impossible de charger les données de la simulation. Veuillez vérifier votre connexion et rafraîchir la page.");
    }
}