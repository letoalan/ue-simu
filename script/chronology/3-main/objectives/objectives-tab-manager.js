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
        text: `<b>Règles Générales</b><br><br>
    Ce jeu simule la procédure législative de l'Union européenne où interviennent la Commission, le Conseil, le Parlement et les lobbies.<br>
    Les acteurs disposent de jetons d'engagement limités qui matérialisent des accords contraignants : un jeton donné signifie que le bénéficiaire s'engage à respecter la demande exprimée lors du vote correspondant.<br>
    Pour qu'une loi (directive, ensemble d'amendements ou package final) soit adoptée, il faut un consensus positif simultané des deux institutions votantes : le Conseil (avec majorité qualifiée) et le Parlement (avec majorité absolue ou simple selon l'étape).<br>
    La violation d'un accord signé par un jeton constitue une trahison sanctionnable par l'attribution de cartons rouges.<br><br>
    Ces mécanismes introduisent un équilibre entre négociation stratégique, engagement sincère et risques de sanction, permettant la simulation d'un contexte politique réaliste et ludique.
`
    },
    deroulement: {
        photo: getImagePath('/medias/images/euro/regles-deroulement.jpg'),
        text: `<b>Déroulement du Jeu</b><br><br>
    1. Introduction et répartition des rôles entre acteurs.<br>
    2. Phase de négociation active où les acteurs peuvent échanger des jetons, signer des accords d'engagement, et bâtir des coalitions.<br>
    3. Votes successifs sur la directive générale, chaque amendement, puis le paquet législatif final, avec contrôle automatisé du respect des majorités requises.<br>
    4. Synthèse des résultats à chaque étape : ajustement des stratégies en fonction des gains/pertes.<br>
    5. Phase finale de contrôle où les joueurs peuvent dénoncer les manquements aux accords par la présentation de preuves, entraînant l'attribution de cartons rouges.<br>
    6. Calcul final des scores, prenant en compte les points gagnés grâce aux engagements respectés, aux points accumulés par usage de jetons, ainsi qu'aux pénalités liées aux sanctions.
`
    },
    commission: {
        photo: getImagePath('/medias/images/euro/commission-jeu.jpg'),
            text: `<b>Rôle de la Commission</b><br><br>
    La Commission agit comme facilitatrice et médiatrice, visant à orienter la négociation vers l'adoption réussie de la directive générale et du paquet législatif final.<br>
    Elle dispose de 10 jetons spéciaux pour initier des entretiens formels avec les États et partis, permettant de partager des informations stratégiques et influencer les votes.<br>
    La Commission ne participe pas aux votes, mais peut recevoir des jetons uniquement des lobbies, lesquels peuvent l'utiliser pour promouvoir leur intérêt de manière dissimulée.<br>
    Toute manœuvre manifeste biaisant la procédure expose la Commission à des cartons rouges ; au-delà de trois, son score final est nul.<br>
    Son succès dépend de sa capacité à équilibrer les aspirations des acteurs tout en évitant une surenchère législative nuisible.
    `
    },
    conseil: {
        photo: getImagePath('/medias/images/euro/conseil-vote.jpg'),
        text: `<b>Règles du Conseil Européen (États)</b><br><br>
    Chaque État peut distribuer jusqu'à 3 jetons d'engagement durant toute la partie.<br>
    Ils peuvent donc formaliser des accords de vote avec d'autres acteurs.<br>
    Chaque État peut recevoir jusqu'à 5 jetons d'engagement maximum, représentant les engagements qu'il doit honorer.<br>
    Le respect des engagements est obligatoire ; tout manquement avéré provoque un carton rouge.<br>
    Les décisions s'adoptent sur la base de la majorité qualifiée : au moins 55 % des États membres représentant au moins 65 % de la population de l'UE doivent voter en faveur.<br>
    Chaque engagement respecté rapporte 10 points à l'État.<br>
    Si</> un État accumule 3 cartons rouges ou plus, son score total est annulé.
`
    },
    parlement: {
        photo: getImagePath('/medias/images/euro/parlement-jeu.jpg'),
        text: `<b>Règles du Parlement Européen</b><br><br>
    Chaque parti politique dispose de 3 jetons d'engagement à allouer durant la partie.<br>
    Ils reçoivent au maximum 5 jetons, représentant les engagements formalisés.<br>
    Ils doivent respecter scrupuleusement leurs engagements liés à ces jetons.<br>
    Les votes exigent la majorité absolue des députés pour être validés.<br>
    Chaque engagement respecté donne 10 points au parti.<br>
    Le</> non-respect d’engagements entraine l’attribution de cartons rouges ; à 3 cartons l’accumulation, le score final du parti est nul.`
    },
    lobbies: {
        photo: getImagePath('/medias/images/euro/lobbies.jpg'),
        text: `<b>Règles des Lobbies</b><br><br>
    Les lobbies ne votent pas et ne peuvent recevoir de jetons d'engagement.<br>
    Ils doivent placer 5 jetons d'influence auprès des États et partis, visant à obtenir des engagements.<br>
    Chaque jeton d'influence utilisé avec succès rapporte 10 points au lobby.<br>
    Les jetons non placés ou les engagements non tenus ne rapportent aucun point.<br>
    Les lobbies peuvent fournir des jetons à la Commission, favorisant certains intérêts via échanges d'informations.`
    }
};

// NOUVEAU : Contenu pour le sous-onglet "Description d'une partie type"
const partieContent = {
    preparation: {
        photo: getImagePath('/medias/images/euro/roles.jpg'),
        text: `<h3>Préparation : lecture, appropriation, déclaration d’intention et identification des porteurs d’amendement</h3>
<b>Rôles et Fonction :</b><br>Tous les acteurs (Commission, États, Partis, Lobbies) prennent connaissance du texte législatif, des scénarios et des fiches de rôle institutionnelles. Chaque participant rédige en amont une déclaration d’intention qui expose ses priorités et objectifs. Les porteurs d’amendement (4 États, 4 groupes parlementaires) préparent une note argumentaire pour défendre leur proposition.<br><br>
<b>Enjeux :</b><br>Formaliser ses intentions favorise des négociations claires. La responsabilité des amendements impose rigueur et engagement, rendant les rapports de force transparents.<br><br>
<b>Conseils :</b><br>Travaillez vos déclarations à l’avance. Porteurs d’amendement : anticipez les critiques et préparez des compromis.`
    },
    negociation: {
        photo: getImagePath('/medias/images/euro/deroule.jpg'),
        text: `<h3>Phase de négociation et échanges de jetons d’engagement</h3>
<b>Rôles et Fonction :</b><br>La Commission facilite les compromis. Les États et Partis négocient et échangent des jetons pour formaliser des engagements de vote. Les lobbies placent leurs jetons pour influencer les coalitions décisives.<br><br>
<b>Enjeux :</b><br>Construire une majorité crédible pour chaque vote, tout en gérant la rareté des jetons. La traçabilité des engagements est cruciale pour éviter les sanctions.<br><br>
<b>Conseils :</b><br>Priorisez vos alliances et ne gaspillez pas vos jetons. Porteurs d’amendement : négociez activement pour atteindre le seuil de majorité.`
    },
    votes: {
        photo: getImagePath('/medias/images/euro/vote.jpg'),
        text: `<h3>Votes séquentiels (directive, amendements, package final)</h3>
<b>Rôles et Fonction :</b><br>Les États et Partis votent en respectant leurs engagements. La Commission observe et propose des compromis. Les Lobbies vérifient le respect des accords.<br><br>
<b>Enjeux :</b><br>Chaque vote peut bouleverser la dynamique. Les engagements sont mis à l’épreuve et tout manquement peut être dénoncé. Un texte trop modifié risque d'être rejeté au vote final.<br><br>
<b>Conseils :</b><br>Affichez votre fidélité aux engagements et documentez vos votes. Les trahisons sont visibles et risquent de coûter cher.`
    },
    debriefing: {
        photo: getImagePath('/medias/images/euro/simul.jpg'),
        text: `<h3>Débriefing, vérification des engagements, score final</h3>
<b>Rôles et Fonction :</b><br>La Commission compile les résultats, contrôle la conformité des votes et attribue points et cartons rouges. Les acteurs dénoncent les trahisons avec preuves.<br><br>
<b>Enjeux :</b><br>Finaliser la simulation en récompensant les stratégies loyales et en sanctionnant les manquements. Analyser l'équilibre entre gain individuel et réussite collective.<br><br>
<b>Conseils :</b><br>Conservez les preuves de vos engagements. Acceptez la critique comme un apprentissage et participez activement au débat final pour maximiser le bénéfice pédagogique.`
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

function updatePartieContent(selection, DOMRefs) {
    const content = partieContent[selection];
    if (!content) return;
    updateContentDisplay({
        photoContainer: DOMRefs.partiePhoto,
        textContainer: DOMRefs.partieText,
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
    const partieMenu = DOMRefs.partieMenu;

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

    if (partieMenu) {
        partieMenu.addEventListener('change', e => {
            updatePartieContent(e.target.value, DOMRefs);
        });
        updatePartieContent('preparation', DOMRefs);
    }
}
