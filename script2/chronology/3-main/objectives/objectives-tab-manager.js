import { updateContentDisplay } from '../content-display-manager.js';



// SOLUTION 1: Fonction utilitaire pour les chemins d'images
function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    console.log('Image path - Hostname:', hostname);
    console.log('Image path - Pathname:', pathname);

    // Si on est sur GitHub Pages
    if (hostname.includes('github.io')) {
        if (pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        } else {
            // Extraire le nom du repo du pathname
            const pathParts = pathname.split('/').filter(part => part !== '');
            if (pathParts.length > 0) {
                return `/${pathParts[0]}${relativePath}`;
            }
        }
        return relativePath;
    }

    // Si on est en local
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168')) {
        return `.${relativePath}`;
    }

    // Cas par défaut - chemin relatif
    return `.${relativePath}`;
}


// Contenu textuel et images pour le sous-onglet "Compréhension"
const comprehensionContent = {
    familiariser: {
        photo: getImagePath('/medias/images/euro/triangle-institutionnel.jpg'),
        text: `L'un des objectifs principaux de cette simulation est de vous familiariser avec le "triangle institutionnel" de l'Union européenne. Vous apprendrez concrètement le rôle de chaque institution clé : la Commission européenne, qui propose les lois ; le Parlement européen, qui représente les citoyens ; et le Conseil de l'Union européenne, qui représente les gouvernements des États membres. En incarnant l'un de ces acteurs, vous découvrirez de l'intérieur leurs prérogatives, leurs contraintes et leur manière d'interagir. Cette connaissance pratique est essentielle pour quiconque souhaite comprendre le fonctionnement réel de l'UE, au-delà des schémas théoriques.`
    },
    comprendre: {
        photo: getImagePath('/medias/images/euro/processus-legislatif.jpg'),
        text: `La simulation vous plonge au cœur du processus législatif ordinaire, aussi appelé "codécision". Vous suivrez le parcours d'une proposition de directive, depuis son élaboration par la Commission jusqu'aux négociations d'amendements avec le Parlement et le Conseil. Vous expérimenterez les différentes étapes : la première lecture, les trilogues (négociations informelles), et la recherche d'un compromis final. L'objectif est de démystifier ce processus qui peut paraître complexe, en vous faisant vivre les tensions, les alliances et les stratégies nécessaires pour faire adopter une loi à l'échelle de 27 États membres.`
    },
    apprehender: {
        photo: getImagePath('/medias/images/euro/crise-ue2.jpg'),
        text: `Au-delà des procédures, l'objectif est de vous faire appréhender la complexité inhérente à la prise de décision européenne. Vous réaliserez que chaque décision est le fruit d'un équilibre délicat entre des intérêts multiples et souvent divergents : les intérêts nationaux défendus par les gouvernements, les lignes politiques portées par les groupes du Parlement, et l'influence des lobbies représentant la société civile ou des secteurs économiques. La simulation vous met au défi de naviguer dans cette complexité, de comprendre les motivations des autres acteurs et de trouver des solutions qui, bien que n'étant parfaites pour personne, sont acceptables pour tous.`
    }
};

/**
 * Met à jour le contenu du sous-onglet "Compréhension" en utilisant le gestionnaire générique.
 * @param {string} selection - La clé de la sélection du menu (ex: 'familiariser').
 * @param {object} DOMRefs - Les références DOM globales.
 */
function updateComprehensionContent(selection, DOMRefs) {
    const content = comprehensionContent[selection];
    if (!content) return;

    updateContentDisplay({
        photoContainer: DOMRefs.comprehensionPhoto,
        textContainer: DOMRefs.comprehensionText,
        photoUrl: content.photo,
        text: content.text
    });
}

/**
 * Initialise la logique de l'onglet "Objectifs de la simulation".
 * @param {object} DOMRefs - Les références DOM globales.
 */
export function initObjectivesTab(DOMRefs) {
    const subNavButtons = DOMRefs.objectivesSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('objectives-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;

    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');
    const comprehensionMenu = DOMRefs.comprehensionMenu;

    // Gérer la navigation entre les sous-onglets
    subNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const subTabId = button.dataset.subTab + '-sub-tab';
            subTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === subTabId) {
                    content.classList.add('active');
                }
            });

            // Charger le contenu par défaut du sous-onglet activé
            const menu = document.getElementById(`${button.dataset.subTab}-menu`);
            if (menu) {
                menu.dispatchEvent(new Event('change'));
            }
        });
    });

    // Gérer le menu du premier sous-onglet
    if (comprehensionMenu) {
        comprehensionMenu.addEventListener('change', (e) => {
            updateComprehensionContent(e.target.value, DOMRefs);
        });
    }

    // Afficher le contenu par défaut au chargement initial
    updateComprehensionContent('familiariser', DOMRefs);
}