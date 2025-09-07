const histoireContent = {
    rome: {
        photo: '/medias/images/traite-de-rome.jpg',
        text: `Le traité de Rome, signé en 1957, est l'acte fondateur de la Communauté économique européenne (CEE). Il a établi un marché commun basé sur la libre circulation des marchandises, des services, des capitaux et des personnes. Cet accord historique visait à créer une union douanière et à promouvoir une coopération économique étroite pour assurer la paix et la prospérité en Europe après les ravages de la Seconde Guerre mondiale. Les six pays fondateurs – la France, l'Allemagne de l'Ouest, l'Italie, la Belgique, les Pays-Bas et le Luxembourg – ont jeté les bases d'une intégration progressive qui allait transformer le continent. Le traité a également mis en place des institutions clés comme la Commission européenne, le Conseil des ministres et l'Assemblée parlementaire, préfigurant la structure de l'Union européenne actuelle. Son succès a encouragé d'autres nations à rejoindre le projet, marquant le début d'un processus d'élargissement continu. La vision des pères fondateurs était de lier les économies européennes de manière si inextricable que la guerre deviendrait matériellement impossible. Ce principe reste au cœur de l'UE aujourd'hui.`
    },
    elargissements: {
        photo: '/medias/images/elargissement-ue.jpg',
        text: `Depuis sa création, l'Union européenne a connu plusieurs vagues d'élargissement, intégrant progressivement de nouveaux États membres et étendant son influence. La première vague en 1973 a vu l'adhésion du Royaume-Uni, de l'Irlande et du Danemark. Les années 1980 ont marqué l'entrée de la Grèce, de l'Espagne et du Portugal, consolidant la démocratie dans le sud de l'Europe. La chute du mur de Berlin a ouvert la voie à l'élargissement le plus significatif en 2004, avec l'intégration de dix pays d'Europe centrale et orientale, dont la Pologne, la Hongrie et la République tchèque. Ce "big bang" a symbolisé la réunification du continent. La Bulgarie et la Roumanie ont suivi en 2007, puis la Croatie en 2013. Chaque élargissement a enrichi l'Union sur les plans culturel et économique, mais a également posé des défis en termes de gouvernance et de cohésion. Le processus a culminé avec le Brexit en 2020, la première fois qu'un État membre quittait l'Union, ouvrant une nouvelle ère de réflexion sur l'avenir du projet européen.`
    },
    pouvoirs: {
        photo: '/medias/images/delegation-pouvoirs.jpg',
        text: `Le fonctionnement de l'Union européenne repose sur un système complexe de délégation de pouvoirs des États membres vers les institutions supranationales. Ce principe de subsidiarité stipule que l'UE n'intervient que si une action est plus efficace au niveau européen qu'au niveau national. Les traités successifs, de Maastricht à Lisbonne, ont progressivement étendu les compétences de l'Union dans des domaines tels que la monnaie unique, la politique étrangère, la sécurité et la justice. La Commission européenne détient le monopole de l'initiative législative, tandis que le Parlement européen, directement élu, et le Conseil de l'Union européenne, représentant les gouvernements nationaux, agissent en tant que colégislateurs. La Cour de justice de l'Union européenne assure la primauté du droit européen sur les droits nationaux dans les domaines de compétence de l'UE. Cet équilibre délicat entre souveraineté nationale et intégration européenne est au cœur des débats politiques et constitue l'un des principaux défis pour l'avenir de l'Union.`
    }
};

function updateHistoireContent(selection, DOMRefs) {
    const content = histoireContent[selection];
    if (content && DOMRefs.histoirePhoto && DOMRefs.histoireText) {
        DOMRefs.histoirePhoto.innerHTML = `<img src="${content.photo}" alt="Illustration pour ${selection}">`;
        DOMRefs.histoireText.innerHTML = `<p>${content.text.replace(/\n/g, '</p><p>')}</p>`;
    }
}

export function initEuroTab(DOMRefs) {
    const subNavButtons = DOMRefs.euroSubNav?.querySelectorAll('.sub-nav-btn');
    const subTabContainer = document.getElementById('euro-sub-tab-container');
    if (!subNavButtons || !subTabContainer) return;

    const subTabContents = subTabContainer.querySelectorAll('.sub-tab-content');
    const histoireMenu = DOMRefs.histoireMenu;

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
        });
    });

    if (histoireMenu) {
        histoireMenu.addEventListener('change', (e) => {
            updateHistoireContent(e.target.value, DOMRefs);
        });
    }

    // Afficher le contenu par défaut au chargement
    updateHistoireContent('rome', DOMRefs);
}