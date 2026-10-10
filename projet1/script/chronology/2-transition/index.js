import { AppState, DOMRefs } from '../../state/index.js';

/**
 * Remplit la page de transition avec les données de l'état de l'application.
 */
function fillTransitionPage() {
    const {
        selectedScenarioElement,
        selectedDirectiveElement,
        scenarioDescription,
        objectivesList
    } = DOMRefs;

    if (!selectedScenarioElement || !selectedDirectiveElement || !scenarioDescription || !objectivesList) {
        console.error("Un ou plusieurs éléments de l'écran de transition sont manquants dans DOMRefs.");
        return;
    }

    // Utilise AppState pour récupérer les informations, au lieu de 'window'
    selectedScenarioElement.textContent = `Scénario : ${AppState.currentScenarioName || 'Non défini'}`;
    selectedDirectiveElement.textContent = `Directive : ${AppState.selectedDirectiveDescription || 'Non définie'}`;

    if (AppState.currentScenarioId === 1) {
        scenarioDescription.textContent = `Vous allez participer à la négociation d'une directive européenne majeure visant à accélérer la transition énergétique tout en maintenant la compétitivité économique.`;
        objectivesList.innerHTML = `
            <li>Réduire les émissions de CO₂ d'au moins 55 % d'ici 2030</li>
            <li>Maintenir une croissance économique stable</li>
            <li>Préserver la cohésion sociale entre les États membres</li>
            <li>Assurer la sécurité énergétique de l'Union</li>
            <li>Trouver un équilibre entre régulation et innovation</li>`;
    } else {
        scenarioDescription.textContent = `Vous allez participer à la négociation d'une directive européenne majeure visant à renforcer la stabilité géopolitique et la sécurité de l'Union face aux nouveaux défis internationaux.`;
        objectivesList.innerHTML = `
            <li>Renforcer la position géopolitique de l'Union</li>
            <li>Maintenir des relations diplomatiques stables</li>
            <li>Assurer la sécurité intérieure face aux nouvelles menaces</li>
            <li>Préserver les valeurs démocratiques européennes</li>
            <li>Trouver un équilibre entre souveraineté et coopération</li>`;
    }
}

/**
 * Affiche l'écran de transition et masque les autres conteneurs principaux.
 */
function showTransitionScreen() {
    if (DOMRefs.carouselContainer) DOMRefs.carouselContainer.style.display = 'none';
    if (DOMRefs.mainContent) DOMRefs.mainContent.style.display = 'none';

    if (DOMRefs.transitionContainer) {
        DOMRefs.transitionContainer.style.display = 'flex';
        // Forcer un reflow pour s'assurer que le navigateur prend en compte le changement de display
        // avant que l'animation de la barre de chargement ne commence.
        const _ = DOMRefs.transitionContainer.offsetHeight;
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Masque l'écran de transition.
 */
function hideTransitionScreen() {
    if (DOMRefs.transitionContainer) {
        DOMRefs.transitionContainer.style.display = 'none';
    }
}

/**
 * Lance l'animation de la barre de chargement.
 * @param {number} duration - La durée de l'animation en millisecondes.
 * @returns {Promise<void>} Une promesse qui se résout à la fin de l'animation.
 */
function runLoadingAnimation(duration = 1500) {
    return new Promise(resolve => {
        if (!DOMRefs.loadingProgress) {
            console.error("L'élément de la barre de progression est introuvable.");
            resolve();
            return;
        }
        DOMRefs.loadingProgress.style.width = '0%';
        DOMRefs.loadingProgress.style.transition = `width ${duration}ms linear`;

        setTimeout(() => {
            DOMRefs.loadingProgress.style.width = '100%';
        }, 50);

        setTimeout(resolve, duration);
    });
}

/**
 * Orchestre la séquence de transition complète.
 * Cette fonction est le point d'entrée principal pour ce module.
 * @param {number} [duration=1500] - La durée de la transition en millisecondes.
 * @returns {Promise<void>}
 */
export async function startTransition(duration = 1500) {
    console.log("Séquence de transition démarrée...");
    fillTransitionPage();
    showTransitionScreen();
    await runLoadingAnimation(duration);
    hideTransitionScreen();
    console.log("Séquence de transition terminée.");
}