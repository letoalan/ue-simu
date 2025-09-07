import { DOMRefs } from '../state/index.js';

/**
 * Charge un seul composant HTML et l'injecte dans son conteneur.
 * @param {string} url - Le chemin vers le fichier HTML.
 * @param {string} containerId - L'ID de l'élément conteneur.
 */
async function loadComponent(url, containerId) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const html = await res.text();
        const target = document.getElementById(containerId);
        if (target) {
            target.innerHTML = html;
        }
    } catch (err) {
        console.error(`⚠️ Impossible de charger ${url}`, err);
    }
}

/**
 * Charge tous les composants HTML de l'interface principale.
 */
export async function loadAllComponents() {
    await Promise.all([
        loadComponent('components/1_carousel.html', 'carouselContainer'),
        loadComponent('components/2_transition.html', 'transitionContainer'),
        loadComponent('components/3_main_interface.html', 'mainContent'),
        loadComponent('components/4_dashboard.html', 'presentation'),
        loadComponent('components/5_fullscreen_modal.html', 'dashboardFullscreenModal')
    ]);

    // Gérer la visibilité initiale
    const carouselContainer = document.getElementById('carouselContainer');
    const transitionContainer = document.getElementById('transitionContainer');
    const mainContent = document.getElementById('mainContent');

    if (carouselContainer) carouselContainer.style.display = 'flex';
    if (transitionContainer) transitionContainer.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
}

/**
 * Collecte toutes les références DOM importantes après le chargement des composants
 * et les stocke dans l'objet DOMRefs partagé.
 * @returns {object} L'objet DOMRefs rempli.
 */
export function collectAllDomReferences() {
    // On peuple l'objet DOMRefs importé depuis le state
    DOMRefs.carousel = document.getElementById('landing-carousel');
    DOMRefs.slides = document.querySelectorAll('.carousel-slide');
    DOMRefs.dots = document.querySelectorAll('.carousel-dot');
    DOMRefs.prevBtn = document.querySelector('.carousel-btn.prev');
    DOMRefs.nextBtn = document.querySelector('.carousel-btn.next');
    DOMRefs.launchSimulationBtn = document.getElementById('launchSimulationBtn');
    // ... Ajoutez ici TOUTES les autres références de votre ancienne fonction `collectAllDomReferences`
    console.table(Object.fromEntries(
        Object.entries(DOMRefs).map(([k, v]) => [k, v ? '✅' : '❌'])
    ));
    return DOMRefs;
}