import { updateContentDisplay } from '../content-display-manager.js';

// Fonction utilitaire pour les chemins d'images
function getImagePath(relativePath) {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    // Si on est sur GitHub Pages
    if (hostname.includes('github.io')) {
        if (pathname.includes('/ue-simu/')) {
            return `/ue-simu${relativePath}`;
        } else {
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

// Contenu pour le sous-onglet "Règles" (format identique à comprehensionContent)
const reglesContent = {
    general: {
        photo: getImagePath('/medias/images/euro/regles-generales.jpg'),
        text: `RÈGLES GÉNÉRALES<br>
    Le jeu simule la procédure législative de l’UE entre Commission, Conseil, Parlement et lobbies.<br>
    Chaque jeton donné engage le bénéficiaire à suivre l'accord au vote concerné.<br>
    Un texte (directive ou amendement) est adopté seulement si Conseil ET Parlement l’approuvent selon leurs règles de majorité.<br>
    La trahison d'un accord jeton est sanctionnée par un "carton rouge".`
    },
    deroulement: {
        photo: getImagePath('/medias/images/euro/regles-deroulement.jpg'),
        text: `DÉROULEMENT DU JEU<br>
    1. Mise en situation et attribution des rôles.<br>
    2. Phase de négociation et échanges de jetons d’engagement.<br>
    3. Vote séquentiel sur la directive, les amendements puis le package final, affichage automatique des majorités et résultats.<br>
    4. Débriefing, vérification des engagements respectés ou trahis, calcul des scores et cartons rouges.`
    },
    commission: {
        photo: getImagePath('/medias/images/euro/commission-jeu.jpg'),
        text: `RÔLE DE LA COMMISSION<br>
    La Commission anime et facilite la négociation, pour faire adopter la directive et le package final.<br>
    Elle dispose de 10 jetons d’entretien à remettre à des États ou des partis pour ouvrir le dialogue (information, influence).<br>
    Ne peut recevoir de jetons que des lobbies. 3 cartons rouges ou plus (pour manipulation avérée) : score nul.<br>
    N'a pas de droit de vote.`
    },
    conseil: {
        photo: getImagePath('/medias/images/euro/conseil-vote.jpg'),
        text: `RÈGLES POUR LE CONSEIL EUROPÉEN (ÉTATS)<br>
    Chaque État peut donner maximum 3 jetons (5 max reçus).<br>
    Respect de l'engagement requis : la trahison = carton rouge.<br>
    Majorité qualifiée requise pour valider un texte (55% des États et 65% population UE).<br>
    +10 points par engagement tenu / 3 cartons rouges ou plus : score = zéro.`
    },
    parlement: {
        photo: getImagePath('/medias/images/euro/parlement-jeu.jpg'),
        text: `RÈGLES POUR LE PARLEMENT<br>
    Chaque parti politique peut donner jusqu'à 3 jetons (max 5 reçus).<br>
    Engagement = obligation de suivre l'accord au vote correspondant.<br>
    Majorité absolue requise pour adopter/amender.<br>
    10 points par engagement respecté / 3 cartons rouges ou plus : score = zéro.`
    },
    lobbies: {
        photo: getImagePath('/medias/images/euro/lobbies.jpg'),
        text: `RÈGLES POUR LES LOBBIES<br>
    Chaque lobby doit placer 5 jetons d’influence au cours de la partie (pas d’engagement réciproque).<br>
    Un engagement respecté = 10 points.<br>
    Jeton non placé = pas de point.<br>
    Peuvent donner des jetons à la Commission pour obtenir info ou influence.`
    }
};

// Fonctions de mise à jour du contenu (identiques pour comprehension et règles)
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
function updateRulesContent(selection, DOMRefs) {
    const content = reglesContent[selection];
    if (!content) return;
    updateContentDisplay({
        photoContainer: DOMRefs.reglesPhoto,
        textContainer: DOMRefs.reglesText,
        photoUrl: content.photo,
        text: content.text
    });
}

// Initialisation
export function initObjectivesTab(DOMRefs) {
    const subNavButtons = DOMRefs.objectivesSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('objectives-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;
    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');

    // Menus
    const comprehensionMenu = DOMRefs.comprehensionMenu;
    const reglesMenu = DOMRefs.reglesMenu;

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

    if (comprehensionMenu) {
        comprehensionMenu.addEventListener('change', e => {
            updateComprehensionContent(e.target.value, DOMRefs);
        });
        updateComprehensionContent('familiariser', DOMRefs);
    }

    if (reglesMenu) {
        reglesMenu.addEventListener('change', e => {
            updateRulesContent(e.target.value, DOMRefs);
        });
        updateRulesContent('general', DOMRefs);
    }
}
