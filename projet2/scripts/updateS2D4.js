import fs from 'fs';
import path from 'path';

// 1. Charger et corriger scenario2.json
function updateScenario2(baseDir) {
  const file = path.join(baseDir, 'scenario2.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const d4 = data.directive ? data.directive.find(d => d.id === 4) : null;
  if (d4) {
    d4.nom = "Souveraineté agricole européenne";
    d4.declaration_intention = "La présente directive vise à garantir la souveraineté agricole de l’Union européenne en instaurant une réserve stratégique de céréales et en soutenant la production agricole locale. Elle entend réduire la dépendance aux importations, renforcer la sécurité alimentaire et promouvoir une agriculture durable et résiliente. Cette initiative s’inscrit dans la stratégie européenne de souveraineté agricole, conformément aux priorités du Conseil européen et du Pacte vert pour l’Europe.";
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Mis à jour : ${file}`);
}

// 2. Charger et corriger s2d4.json (enjeux)
function updateS2D4Enjeux(baseDir) {
  const file = path.join(baseDir, 'directives/enjeux/s2/s2d4.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.directive.title = "Souveraineté agricole européenne";
  
  // Mettre à jour l'intérêt Big Tech avec le cadrage strict IA
  const bigTech = data.directive.lobbies.find(l => l.sector === "Big Tech");
  if (bigTech) {
    bigTech.interests = [
      "Développement de solutions d'agronomie de précision et d'outils numériques (capteurs IoT, modélisation agronomique, prévision météorologique et anticipation des calamités agricoles par l'IA).",
      "Valorisation et sécurisation des données agricoles et logistiques."
    ];
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Mis à jour : ${file}`);
}

// 3. Charger et corriger stats2d4.json
function updateStats2D4(baseDir) {
  const file = path.join(baseDir, 'directives/fiches-acteurs/s2/d4/stats2d4.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.nom = "Souveraineté agricole européenne";
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Mis à jour : ${file}`);
}

// 4. Commission
function getCorrectedCommission(original) {
  return {
    ...original,
    type: "Commission",
    nom: "Commission européenne",
    actor_id: "commission",
    role_europeen: "Porte la proposition initiale, garantit la cohérence institutionnelle et fait le lien entre Parlement, Conseil et acteurs externes.",
    enjeux_directive: [
      "Garantir la sécurité et la souveraineté agricoles de l'Union européenne en réduisant la dépendance aux importations alimentaires et d'intrants.",
      "Soutenir la production agricole locale et les circuits courts pour renforcer la résilience des territoires ruraux.",
      "Équilibrer souveraineté agricole, transition agroécologique et viabilité économique des exploitations.",
      "Anticiper les tensions de marché entre pays agricoles exportateurs nets et pays importateurs nets.",
      "Promouvoir l'agronomie de précision, la modélisation météorologique et l'anticipation des calamités agricoles pour limiter les pertes de récoltes.",
      "Assurer une répartition équitable des ressources entre régions rurales productrices et grands bassins de consommation."
    ],
    impacts_directive: [
      "La directive renforcera le rôle de la Commission dans la régulation et la gestion coordonnée des réserves stratégiques agricoles européennes.",
      "La Commission verra son autorité consolidée pour équilibrer transition agroécologique et sécurité des approvisionnements alimentaires."
    ],
    stratégie: "La Commission européenne adopte une approche transversale pour garantir la cohérence entre transition agroécologique, résilience alimentaire et équilibre budgétaire. Elle privilégie le dialogue stratégique avec les États membres et les filières agricoles pour aligner les mesures sur les priorités de l'Union. La stratégie se concentre sur trois piliers : 1) bâtir un filet de sécurité céréalier crédible face aux crises géopolitiques et climatiques, 2) accompagner la transition agroécologique sans compromettre la viabilité économique des exploitants, et 3) harmoniser les politiques nationales de stockage pour prévenir toute distorsion de concurrence au sein du marché unique.",
    alliances: [
      "France (soutien à l'autonomie agricole, régulation des marchés et gestion des stocks)",
      "Italie (promotion des signes de qualité AOP/IGP, circuits courts et résilience hydrique)",
      "Verts/ALE (soutien à la transition agroécologique et préservation des sols)",
      "S&D (soutien aux circuits courts, label européen et accessibilité alimentaire)",
      "Banque et Finance (financement des capacités de stockage et modernisation des exploitations)",
      "Automobile (décarbonation du machinisme agricole et logistique alimentaire durable)",
      "Big Tech (outils numériques d'agronomie de précision, prévisions météo et anticipation des calamités agricoles par l'IA)"
    ],
    oppositions: [
      "Hongrie (demande de report de deux ans et flexibilité excessive sur les stocks)",
      "Pologne (demande de priorisation exclusive des grandes exploitations céréalières)",
      "Conservateurs et Réformistes (opposition aux contraintes réglementaires et surcoûts bureaucratiques)",
      "Énergies fossiles (inquiétude sur les coûts énergétiques du séchage et stockage des céréales)",
      "Agrochimie (résistance aux contraintes sur les intrants et défense du modèle conventionnel)"
    ],
    éléments_d_argumentaire: [
      "La directive renforce l'autosuffisance et la souveraineté agricoles européennes face aux chocs géopolitiques et aux dérèglements climatiques mondiaux.",
      "L'intégration des circuits courts favorise une économie rurale plus résiliente, tout en soutenant équitablement les petits producteurs locaux.",
      "La transition agroécologique est indispensable pour préserver la fertilité des sols et garantir la durabilité de la production à long terme.",
      "Les mécanismes de stockage stratégique évitent les flambées spéculatives de prix et harmonisent les conditions de marché entre États membres.",
      "Le soutien aux innovations ciblées (agronomie de précision, modélisation météorologique et anticipation des calamités agricoles) optimise l'usage des ressources naturelles.",
      "La coordination européenne garantit une solidarité effective entre pays excédentaires et déficitaires lors de crises alimentaires imprévues."
    ],
    positions_amendements: [
      {
        amendement: "2-4A",
        titre: "Porter la réserve stratégique à 9 mois",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Cette mesure renforcerait considérablement la sécurité alimentaire européenne face aux crises géopolitiques prolongées, mais elle exige une gestion rigoureuse des coûts d'immobilisation des stocks.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Porter la réserve stratégique à 9 mois"
      },
      {
        amendement: "2-4B",
        titre: "Conditionner les aides à la transition agroécologique",
        position: "FAVORABLE",
        justification: "Ce dispositif aligne le soutien public sur les impératifs de préservation des sols et de réduction des intrants, garantissant une résilience agricole durable.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner les aides à la transition agroécologique"
      },
      {
        amendement: "2-4C",
        titre: "Instaurer un fonds européen pour la relocalisation alimentaire",
        position: "FAVORABLE",
        justification: "Ce fonds renforce l'indépendance productive locale et revitalise les zones rurales défavorisées en rapprochant production et consommation.",
        priorite: "haute",
        origine: "Gauche Unitaire",
        description: "Instaurer un fonds européen pour la relocalisation alimentaire"
      },
      {
        amendement: "2-4D",
        titre: "Créer un label européen de circuits courts",
        position: "FAVORABLE",
        justification: "Ce label offre une transparence accrue aux consommateurs et valorise économiquement les producteurs engagés dans des filières de proximité.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un label européen de circuits courts"
      },
      {
        amendement: "2-4E",
        titre: "Limiter la réserve stratégique à 3 mois",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Un horizon de 3 mois réduit les coûts de stockage mais limite fortement la capacité de résilience de l'Union en cas de mauvaise récolte majeure consécutive.",
        priorite: "moyenne",
        origine: "France",
        description: "Limiter la réserve stratégique à 3 mois"
      },
      {
        amendement: "2-4F",
        titre: "Exclure certains produits agricoles de la réserve",
        position: "DEFAVORABLE",
        justification: "Une réserve restreinte risque de déstabiliser les équilibres nutritionnels et de créer des failles dans la couverture de sécurité alimentaire.",
        priorite: "faible",
        origine: "Suède",
        description: "Exclure certains produits agricoles de la réserve"
      },
      {
        amendement: "2-4G",
        titre: "Soutenir prioritairement les grandes exploitations",
        position: "DEFAVORABLE",
        justification: "Cette priorisation accentuerait les disparités territoriales au détriment des exploitations familiales essentielles au maillage rural.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement les grandes exploitations"
      },
      {
        amendement: "2-4H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Un différé de deux ans retarderait inutilement la mise en place d'un bouclier alimentaire devenu urgent dans le contexte géopolitique actuel.",
        priorite: "faible",
        origine: "Hongrie",
        description: "Reporter l’application de la directive de deux ans"
      }
    ],
    références: [
      "s2d4.json",
      "scenario2.json"
    ],
    notes_internes: "Surveiller les tensions entre modèles agricoles intensifs (Pologne) et familiaux/agroécologiques (France, Italie). Évaluer l'impact des sécheresses sur les régions méditerranéennes et danubiennes."
  };
}

// 5. Pays
function getCorrectedCountries(originalList) {
  return [
    // France
    {
      ...originalList[0],
      enjeux_directive: [
        "Limiter la durée de la réserve stratégique à 3 mois pour éviter les surcoûts prohibitifs d'immobilisation et de stockage céréalier.",
        "Préserver la réactivité et la compétitivité des exportations de céréales françaises sur les marchés européens et internationaux.",
        "Défendre le modèle agricole familial et valoriser les circuits courts territoriaux.",
        "Soutenir la transition agroécologique sans fragiliser la trésorerie des exploitations agricoles."
      ],
      stratégie: "Prôner une gestion pragmatique des stocks pour préserver la rentabilité des exploitations, en nouant des alliances avec les pays méridionaux sur les circuits courts tout en s'opposant aux reports de mise en œuvre.",
      alliances: [
        "Italie (collaboration sur les circuits courts, filières de qualité et résilience hydrique)",
        "S&D (soutien au label de circuits courts et justice sociale pour les exploitants)",
        "Verts/ALE (soutien à la transition agroécologique progressive)",
        "Automobile (machinisme agricole décarboné et logistique de proximité)",
        "Banque et Finance (financement des capacités de stockage et modernisation agricole)",
        "Big Tech (agronomie de précision, capteurs de sol et prévision des calamités climatiques)"
      ],
      oppositions: [
        "Hongrie (demande de report de deux ans pénalisant la réactivité européenne)",
        "Pologne (volonté de réserver les fonds aux seules méga-exploitations)",
        "Conservateurs et Réformistes (refus de toute régulation solidaire)",
        "Énergies fossiles (pressions sur les prix des carburants et engrais agricoles)"
      ],
      éléments_d_argumentaire: [
        "Une réserve de 3 mois offre le compromis optimal entre sécurité d'approvisionnement et maîtrise des frais financiers de stockage.",
        "Le maintien de flux céréaliers dynamiques est indispensable pour préserver les parts de marché et l'équilibre financier de nos producteurs.",
        "Les circuits courts apportent une valeur ajoutée directe aux agriculteurs et renforcent le lien de confiance avec les consommateurs.",
        "L'accompagnement financier des exploitations familiales est la clé d'une transition agroécologique réussie."
      ],
      notes_internes: "Préserver l'équilibre entre la grande céréaliculture exportatrice du Bassin parisien et les filières d'élevage et polyculture régionales."
    },
    // Allemagne
    {
      ...originalList[1],
      enjeux_directive: [
        "Garantir un approvisionnement céréalier et alimentaire stable pour les industries de transformation agroalimentaire et la population.",
        "Préserver le bon fonctionnement et la libre circulation des denrées agricoles au sein du marché intérieur sans distorsions.",
        "Maîtriser les coûts budgétaires globaux de stockage public et éviter les lourdeurs bureaucratiques excessives.",
        "Accompagner la décarbonation du machinisme agricole et la modernisation technique des exploitations."
      ],
      stratégie: "Adopter un rôle de médiateur budgétaire rigoureux, veillant à ce que la réserve céréalière garantisse la sécurité d'approvisionnement des transformateurs sans peser excessivement sur les finances publiques.",
      alliances: [
        "France (stabilité des marchés et équilibre des approvisionnements)",
        "Renouveau Européen (pragmatisme économique et modernisation des filières)",
        "Automobile (machinisme agricole sobre et logistique multimodale des grains)",
        "Banque et Finance (rigueur des montages financiers de stockage)",
        "Big Tech (modélisation agronomique et prévisions météorologiques par l'IA)"
      ],
      oppositions: [
        "Hongrie (opposition à un report de deux ans qui créerait de l'incertitude sur les approvisionnements)",
        "Pologne (refus des distorsions de concurrence favorisant uniquement les grands céréaliers de l'Est)",
        "Énergies fossiles (dépendance excessive aux énergies carbonées pour les silos)"
      ],
      éléments_d_argumentaire: [
        "Le marché intérieur agricole doit rester fluide, sans constitution de stocks publics excessifs qui fausseraient les prix.",
        "L'industrie agroalimentaire a besoin d'une visibilité claire et d'une sécurité contractuelle d'approvisionnement.",
        "La rigueur budgétaire impose de calibrer strictement les mécanismes de compensation et de stockage.",
        "Le progrès agronomique et le machinisme performant permettent d'allier productivité et respect de l'environnement."
      ],
      notes_internes: "Surveiller l'impact sur l'industrie de transformation et veiller à une gestion décentralisée mais coordonnée des stocks stratégiques."
    },
    // Italie
    {
      ...originalList[2],
      enjeux_directive: [
        "Sécuriser les productions vivrières locales et les cultures méditerranéennes face aux crises géopolitiques.",
        "Valoriser les filières d'excellence sous signes officiels de qualité (AOP/IGP) et l'agriculture paysanne.",
        "Mobiliser des financements européens pour la résilience hydrique des exploitations face aux sécheresses récurrentes.",
        "Assurer une répartition équitable des fonds de stockage entre céréales continentales et productions méridionales."
      ],
      stratégie: "Agir comme chef de file des agricultures méridionales, en défendant les circuits courts et les aides à l'adaptation climatique face au stress hydrique.",
      alliances: [
        "France (défense des modèles agricoles familiaux et des circuits courts)",
        "S&D (cohésion rurale et alimentation de qualité)",
        "Verts/ALE (soutien à l'agroécologie et gestion durable de l'eau)",
        "Pharmaceutique (sécurité sanitaire et traçabilité des filières)",
        "Banque et Finance (prêts bonifiés pour les infrastructures d'irrigation et de stockage)"
      ],
      oppositions: [
        "Pologne (tentative de monopoliser les aides au profit des céréales intensives du Nord et de l'Est)",
        "Conservateurs et Réformistes (dérégulation mettant en péril les normes de qualité AOP/IGP)",
        "Énergies fossiles (impact de la hausse des prix des intrants sur les exploitations italiennes)"
      ],
      éléments_d_argumentaire: [
        "La souveraineté alimentaire européenne ne peut se limiter aux grandes céréales et doit englober la diversité méditerranéenne.",
        "Les sécheresses chroniques imposent des investissements d'urgence dans les retenues d'eau et l'irrigation efficiente.",
        "Les circuits courts et les labels de qualité protègent la valeur ajoutée des agriculteurs face aux géants industriels.",
        "Les fonds européens doivent soutenir équitablement le Sud pour éviter une désertification agricole rurale."
      ],
      notes_internes: "Priorité absolue aux mesures de résilience face au stress hydrique dans la plaine du Pô et le Mezzogiorno."
    },
    // Hongrie
    {
      ...originalList[3],
      enjeux_directive: [
        "Obtenir un délai de deux ans pour permettre l'adaptation des silos et infrastructures de stockage nationales.",
        "Limiter la charge financière immédiate pesant sur les exploitations agricoles familiales et le budget national.",
        "Préserver l'autonomie nationale dans la gestion des équilibres agricoles et des surplus céréaliers.",
        "Assurer une transition progressive vers les normes de stockage sans déstabiliser la viabilité des exploitants."
      ],
      stratégie: "Bâtir une alliance d'assouplissement avec les pays demandant de la flexibilité budgétaire et réglementaire, en faisant valoir les délais d'équipement des silos danubiens.",
      alliances: [
        "Pologne (partage des préoccupations sur les investissements de stockage et les contraintes de l'Est)",
        "Parti Populaire Européen (flexibilité réglementaire et pragmatisme)",
        "Conservateurs et Réformistes (défense de la subsidiarité nationale)",
        "Énergies fossiles (maintien d'engrais et de carburants agricoles accessibles)"
      ],
      oppositions: [
        "France (exigence d'une application sans délai pour stabiliser les marchés)",
        "Renouveau Européen (refus catégorique du report de deux ans)",
        "Verts/ALE (opposition à tout ralentissement des normes agroécologiques)"
      ],
      éléments_d_argumentaire: [
        "Un délai de deux ans est indispensable pour que nos silos ruraux soient modernisés sans asphyxier nos exploitants.",
        "Chaque État membre doit conserver une marge d'appréciation adaptée à ses spécificités pédo-climatiques.",
        "Imposer des normes de stockage trop rapides pénaliserait les fermes familiales au profit des grands négociants.",
        "La souveraineté alimentaire commence par la protection économique des producteurs nationaux."
      ],
      notes_internes: "Maintenir une position ferme sur le calendrier d'application tout en négociant des dérogations pour les silos régionaux."
    },
    // Pologne
    {
      ...originalList[4],
      enjeux_directive: [
        "Consolider les capacités de production et de stockage des grands bassins céréaliers polonais.",
        "Maximiser les volumes de céréales mobilisables pour garantir la sécurité alimentaire de l'Est européen.",
        "Orienter les aides européennes de stockage vers les structures agricoles à fort rendement capables d'alimenter les réserves stratégiques.",
        "Sécuriser l'accès aux engrais azotés et carburants indispensables à la productivité des grandes plaines agricoles."
      ],
      stratégie: "Pousser vigoureusement pour des aides et des investissements ciblant les exploitations à fort volume céréalier, en mettant en avant la position géostratégique de la Pologne aux frontières orientales de l'UE.",
      alliances: [
        "Hongrie (solidarité régionale d'Europe centrale)",
        "PPE (défense des grands producteurs et compétitivité agricole)",
        "Agrochimie (rendement céréalier et fertilisation raisonnée)",
        "Énergies fossiles (sécurisation des engrais azotés et carburants de récolte)"
      ],
      oppositions: [
        "Verts/ALE (opposition au modèle productif des grandes exploitations)",
        "GUE/NGL et France (défense prioritaire de l'agriculture paysanne et des petits exploitants)",
        "Suède (refus d'aides sectorielles asymétriques)"
      ],
      éléments_d_argumentaire: [
        "La sécurité alimentaire du continent repose sur la capacité productive de masse de nos grands bassins céréaliers.",
        "Les investissements européens doivent prioritairement équiper les structures à fort rendement pour constituer des réserves efficaces.",
        "La disponibilité garantie des engrais et carburants est un préalable absolu à la sécurité des récoltes.",
        "La Pologne constitue un bastion agricole stratégique essentiel pour la résilience géopolitique de l'Europe."
      ],
      notes_internes: "Veiller à ce que les critères d'éligibilité aux fonds de stockage favorisent les capacités de grande échelle de Mazovie et Grande-Pologne."
    },
    // Suède
    {
      ...originalList[5],
      enjeux_directive: [
        "Restreindre le périmètre de la réserve aux céréales panifiables stratégiques afin d'éviter le gaspillage et la dégradation de denrées périssables.",
        "Garantir une gestion budgétaire rationnelle, transparente et efficiente des stocks publics de denrées.",
        "Éviter les coûts de stockage disproportionnés pour les pays nordiques ayant des contraintes climatiques spécifiques.",
        "Préserver la fluidité des flux marchands sans distorsion étatique excessive."
      ],
      stratégie: "Plaider pour une gestion ciblée, rationnelle et scientifiquement éprouvée des denrées stockées, en s'appuyant sur les États frugaux et attachés à l'efficacité gestionnaire.",
      alliances: [
        "Allemagne (rigueur budgétaire et bon fonctionnement du marché)",
        "Renouveau Européen (modernisation rationnelle et logistique numérique des chaînes d'approvisionnement)",
        "Banque et Finance (efficacité financière des mécanismes de stockage)"
      ],
      oppositions: [
        "Commission européenne (qui prône une couverture alimentaire trop extensive)",
        "S&D et GUE/NGL (crainte d'une réserve trop étriquée ne garantissant pas la sécurité alimentaire complète)",
        "Hongrie (désaccord sur le calendrier et les méthodes)"
      ],
      éléments_d_argumentaire: [
        "Seules les céréales de base à longue conservation doivent être stockées pour prévenir les gaspillages massifs.",
        "Les denrées périssables doivent être exclues pour éviter des coûts sanitaires et d'énergie disproportionnés.",
        "Une réserve ciblée est plus réactive, moins coûteuse et plus transparente à administrer.",
        "Le marché intérieur doit rester la source première d'ajustement sans interventionnisme excessif."
      ],
      notes_internes: "Défendre l'exclusion stricte des produits à conservation délicate pour éviter des charges de gestion inutiles."
    }
  ];
}

// 6. Partis politiques
function getCorrectedParties(originalList) {
  return [
    // PPE
    {
      ...originalList[0],
      enjeux_directive: [
        "Maintenir l'équilibre entre sécurité alimentaire et économie de marché.",
        "Défendre les revenus et la compétitivité des agriculteurs face aux pressions réglementaires et aux marchés mondiaux.",
        "Assurer une transition agroécologique compatible avec le maintien des rendements céréaliers.",
        "Soutenir les industries de transformation agroalimentaire et le machinisme agricole moderne."
      ],
      alliances: [
        "Pologne (soutien aux grands producteurs agricoles et rendements)",
        "Allemagne (stabilité économique et compétitivité agro-industrielle)",
        "Agrochimie (protection des récoltes et transition mesurée)",
        "Automobile (machinisme agricole innovant)",
        "Banque et Finance (investissements productifs dans le stockage)",
        "Renouveau Européen (pragmatisme économique)"
      ],
      oppositions: [
        "Verts/ALE (surréglementation environnementale pénalisant les rendements)",
        "GUE/NGL (mesures radicales contre l'économie de marché agricole)"
      ],
      éléments_d_argumentaire: [
        "La souveraineté alimentaire repose avant tout sur des agriculteurs rentables et compétitifs.",
        "Les normes environnementales ne doivent pas provoquer de baisse de rendement en pleine crise géopolitique.",
        "Le stockage stratégique doit être géré en partenariat étroit avec les acteurs professionnels de la filière.",
        "L'innovation technique et le machinisme performant sont les vrais moteurs de la durabilité."
      ],
      positions_amendements: originalList[0].positions_amendements
    },
    // S&D
    {
      ...originalList[1],
      enjeux_directive: [
        "Promouvoir une agriculture de proximité, durable et solidaire.",
        "Renforcer la cohésion territoriale et soutenir l'emploi rural et les petites exploitations.",
        "Garantir une alimentation saine, de qualité et accessible à tous les citoyens européens.",
        "Créer un label européen protecteur pour valoriser les circuits courts.",
        "Équilibrer souveraineté alimentaire, justice sociale et objectifs environnementaux."
      ],
      alliances: [
        "France (défense des modèles familiaux et circuits courts)",
        "Italie (filières de qualité et cohésion territoriale)",
        "Verts/ALE (transition agroécologique et préservation des sols)",
        "GUE/NGL (soutien direct aux petits producteurs paysans)",
        "Pharmaceutique (traçabilité sanitaire des aliments)",
        "Banque et Finance (soutien aux projets agricoles durables)"
      ],
      oppositions: [
        "Pologne (favoritisme excessif des grands conglomérats agricoles)",
        "Conservateurs et Réformistes (dérégulation et refus de solidarité)",
        "Agrochimie (maintien du modèle conventionnel intensif)"
      ],
      éléments_d_argumentaire: [
        "La souveraineté alimentaire doit profiter aux citoyens et aux petits producteurs, pas à la spéculation.",
        "Le label de circuits courts est un outil puissant pour relocaliser la valeur dans nos campagnes.",
        "Une réserve céréalière solide protège les ménages vulnérables contre l'inflation alimentaire.",
        "La justice sociale est indissociable de la transition écologique de nos systèmes agricoles."
      ],
      positions_amendements: originalList[1].positions_amendements.map(pa => {
        if (pa.amendement === "2-4A") {
          return {
            ...pa,
            justification: "S&D soutient cette proposition pour renforcer la sécurité alimentaire européenne et garantir un bouclier protecteur face aux flambées des cours mondiaux des céréales, tout en protégeant les consommateurs vulnérables."
          };
        }
        return pa;
      })
    },
    // Renouveau Européen
    {
      ...originalList[2],
      enjeux_directive: [
        "Maximiser l'autonomie stratégique et la résilience alimentaire face aux crises géopolitiques mondiales.",
        "Porter la réserve stratégique de céréales à 9 mois pour garantir un approvisionnement ininterrompu.",
        "Moderniser les filières agricoles grâce aux outils d'agronomie de précision et à la logistique numérique.",
        "Assurer la fluidité du marché unique agricole en évitant les réflexes de repli national.",
        "Renforcer les chaînes de production et d'approvisionnement locales."
      ],
      alliances: [
        "Commission européenne (cohésion institutionnelle et vision stratégique)",
        "Allemagne (fluidité du marché unique et logistique)",
        "Big Tech (outils numériques d'agronomie de précision, prévisions météo et anticipation des calamités agricoles par l'IA)",
        "Automobile (logistique durable et machinisme agricole moderne)",
        "Banque et Finance (financement des capacités de stockage)"
      ],
      oppositions: [
        "France (sur la réduction à 3 mois qui fragiliserait l'ambition stratégique)",
        "Hongrie (refus du report de deux ans qui ralentirait l'Union)",
        "Conservateurs et Réformistes (refus de l'intégration et de la régulation commune)"
      ],
      éléments_d_argumentaire: [
        "Une réserve de 9 mois garantit à l'Europe une indépendance géopolitique absolue face aux crises mondiales.",
        "L'innovation numérique et l'agronomie moderne permettent de produire mieux avec moins d'intrants.",
        "Le marché unique agricole doit être protégé contre toute tentation protectionniste interne.",
        "L'Europe doit être capable de nourrir ses citoyens quelles que soient les perturbations internationales."
      ],
      positions_amendements: originalList[2].positions_amendements
    },
    // Verts/ALE
    {
      ...originalList[3],
      enjeux_directive: [
        "Conditionner les aides publiques à la transition agroécologique et à la régénération des sols.",
        "Lier indissociablement sécurité alimentaire, protection de la biodiversité et climat.",
        "Réduire drastiquement la dépendance européenne aux engrais chimiques et aux pesticides.",
        "Soutenir prioritairement les circuits courts et l'agriculture biologique résiliente.",
        "Protéger les petits producteurs face aux subventions asymétriques des grands groupes."
      ],
      alliances: [
        "S&D (convergence sur les circuits courts et la justice environnementale)",
        "GUE/NGL (défense de l'agriculture paysanne et relocalisation)",
        "Italie (filières durables et gestion protectrice de l'eau)",
        "France (soutien aux modèles familiaux diversifiés)"
      ],
      oppositions: [
        "Agrochimie (défense acharnée des pesticides et engrais de synthèse)",
        "Pologne (priorité accordée aux méga-exploitations intensives)",
        "Énergies fossiles (dépendance aux hydrocarbures pour les intrants)",
        "PPE (résistances aux normes agroécologiques contraignantes)"
      ],
      éléments_d_argumentaire: [
        "La vraie souveraineté agricole passe par des sols vivants et des fermes libérées de la dépendance aux intrants chimiques importés.",
        "Conditionner les subventions à l'agroécologie est la seule façon de garantir la pérennité de nos récoltes face au dérèglement climatique.",
        "Les circuits courts réduisent l'empreinte carbone et redonnent du pouvoir aux agriculteurs.",
        "Une agriculture résiliente face aux sécheresses est notre meilleure assurance-vie collective."
      ],
      positions_amendements: originalList[3].positions_amendements
    },
    // ECR
    {
      ...originalList[4],
      enjeux_directive: [
        "Préserver la subsidiarité et l'autonomie des États membres dans la gestion de leurs stocks agricoles.",
        "Limiter les coûts financiers imposés aux agriculteurs par des obligations de stockage centralisées.",
        "Éviter la bureaucratisation excessive et les contraintes environnementales contre-productives.",
        "Protéger la liberté d'entreprendre des exploitants agricoles nationaux."
      ],
      alliances: [
        "Hongrie (défense des délais et de la souveraineté nationale)",
        "Pologne (soutien à la productivité et aux grandes capacités de récolte)",
        "Énergies fossiles (maintien de coûts énergétiques bas pour les exploitations)"
      ],
      oppositions: [
        "Verts/ALE (opposition frontale aux conditionnalités écologiques contraignantes)",
        "Renouveau Européen (refus d'une réserve centralisée de 9 mois)",
        "Commission européenne (défiance envers la gestion supranationale des stocks)"
      ],
      éléments_d_argumentaire: [
        "Les États membres et les agriculteurs connaissent mieux leurs besoins de stockage que les fonctionnaires de Bruxelles.",
        "Multiplier les contraintes agroécologiques affaiblit la production européenne au profit des importations.",
        "La souveraineté doit rester nationale avant d'être communautaire.",
        "La flexibilité et la réduction des charges sont indispensables à la compétitivité rurale."
      ],
      positions_amendements: originalList[4].positions_amendements.map(pa => {
        if (pa.amendement === "2-4A") {
          return {
            ...pa,
            justification: "Cette mesure est jugée trop contraignante et coûteuse pour la gestion des stocks agricoles nationaux, imposant des charges excessives aux exploitants et aux finances publiques."
          };
        }
        if (pa.amendement === "2-4E") {
          return {
            ...pa,
            justification: "Cette mesure permettrait de réduire les coûts financiers mais l'ECR privilégie une flexibilité totale laissée aux États membres dans la gestion de leurs stocks agricoles et céréaliers."
          };
        }
        return pa;
      })
    },
    // GUE/NGL
    {
      ...originalList[5],
      enjeux_directive: [
        "Soutenir massivement les petits producteurs et l'agriculture paysanne face aux conglomérats agro-industriels.",
        "Créer un fonds européen dédié à la relocalisation agricole et alimentaire.",
        "Lutter contre la spéculation sur les céréales et garantir l'accès de tous à une alimentation saine.",
        "Enrayer l'accaparement des terres et la disparition des exploitations familiales.",
        "Assurer des revenus équitables aux travailleurs de la terre."
      ],
      alliances: [
        "S&D (soutien au fonds de relocalisation et au label local)",
        "Verts/ALE (convergence sur l'agroécologie et la protection de l'environnement)",
        "Italie (défense de l'agriculture paysanne méridionale)"
      ],
      oppositions: [
        "Spéculateurs financiers des marchés à terme céréaliers (qui marchandisent la faim)",
        "Agrochimie et conglomérats de l'agro-business (modèle productiviste destructeur)",
        "Pologne (priorité accordée aux méga-exploitations industrielles)",
        "Conservateurs et Réformistes (politiques néolibérales dérégulatrices)"
      ],
      éléments_d_argumentaire: [
        "L'alimentation est un droit humain fondamental, pas une marchandise pour spéculateurs boursiers.",
        "Le fonds de relocalisation est l'outil indispensable pour redonner vie à nos campagnes et nourrir nos villes localement.",
        "Il faut soutenir les bras qui travaillent la terre, pas les dividendes des multinationales de l'agrochimie.",
        "La souveraineté alimentaire appartient aux peuples et aux producteurs paysans."
      ],
      positions_amendements: originalList[5].positions_amendements
    }
  ];
}

// 7. Lobbies
function getCorrectedLobbies(originalList) {
  return [
    // 0: Big Tech
    {
      ...originalList[0],
      role_europeen: "Représente les acteurs des technologies numériques et de l'agritech, promouvant les solutions de données et d'outils d'aide à la décision pour le secteur agricole.",
      enjeux_directive: [
        "Développer des solutions d'agronomie de précision (capteurs IoT de sol, modulation des doses d'eau et de fertilisants).",
        "Améliorer les modèles de prévision météorologique locale pour anticiper les chocs climatiques (gelées, canicules, stress hydrique).",
        "Déployer des systèmes d'alerte et d'anticipation des calamités agricoles (sécheresses extrêmes, inondations, attaques de ravageurs) grâce à l'IA.",
        "Sécuriser la traçabilité des stocks de céréales et l'interopérabilité des données logistiques des silos.",
        "Assurer un cadre réglementaire clair et harmonisé pour les technologies d'agronomie numérique sans entrave à l'innovation."
      ],
      stratégie: "Big Tech se positionne comme le partenaire d'excellence de la résilience agricole en fournissant des outils avancés d'agronomie de précision, de modélisation météorologique et d'anticipation des calamités par l'IA, tout en nouant des alliances avec les constructeurs de machines agricoles et les régulateurs européens.",
      alliances: [
        "Renouveau Européen (modernisation numérique et résilience agricole)",
        "Commission européenne (innovation technologique au service du Pacte Vert)",
        "Automobile (machinisme agricole connecté et capteurs embarqués de récolte)",
        "France (agronomie de précision et anticipation des risques climatiques)",
        "Banque et Finance (digitalisation de la gestion des risques et de l'assurance récolte)"
      ],
      oppositions: [
        "Conservateurs et Réformistes (réticence aux standards technologiques harmonisés)",
        "Hongrie (crainte d'une fracture technologique défavorisant les petites fermes)"
      ],
      éléments_d_argumentaire: [
        "L'agronomie de précision permet de réduire les intrants tout en maintenant les rendements nécessaires à la souveraineté alimentaire.",
        "L'IA appliquée aux modèles météorologiques offre aux agriculteurs des fenêtres de décision cruciales face aux calamités climatiques.",
        "La surveillance numérique des silos céréaliers prévient les pertes de matière et garantit la qualité sanitaire des réserves.",
        "La valorisation transparente des données agricoles renforce la souveraineté et la réactivité de toute la chaîne de valeur européenne."
      ],
      positions_amendements: originalList[0].positions_amendements.map(pa => {
        if (pa.amendement === "2-4A") {
          return {
            ...pa,
            justification: "Big Tech soutient cet amendement car la gestion de réserves stratégiques sur 9 mois exige des outils numériques avancés de surveillance des silos et d'optimisation logistique pour prévenir les dégradations de récoltes."
          };
        }
        if (pa.amendement === "2-4B") {
          return {
            ...pa,
            justification: "Big Tech est favorable au conditionnement agroécologique, ses outils d'agronomie de précision permettant précisément de réduire les intrants tout en maintenant les rendements nécessaires."
          };
        }
        if (pa.amendement === "2-4H") {
          return {
            ...pa,
            justification: "Big Tech s'oppose à ce report car retarder la directive freinerait l'adoption des solutions d'agronomie prédictive indispensables pour affronter les calamités climatiques actuelles."
          };
        }
        return pa;
      }),
      notes_internes: "Veiller à ce que l'usage de l'IA reste scrupuleusement cantonné aux modèles agronomiques, météorologiques et d'anticipation des calamités agricoles pour préserver l'adhésion des acteurs ruraux."
    },
    // 1: Énergies Fossiles
    {
      ...originalList[1],
      impacts_directive: [
        "La directive modifie les équilibres de consommation énergétique du secteur agricole, en particulier pour le séchage et la ventilation des céréales.",
        "La pression sur la réduction des engrais de synthèse impacte directement la demande en gaz naturel nécessaire à la fabrication d'ammoniac et d'urée.",
        "Le maintien de carburants agricoles abordables est crucial pour éviter des surcoûts dans la constitution et le transport des réserves stratégiques."
      ],
      role_europeen: "Représente les fournisseurs de carburants agricoles (GNR) et de gaz naturel, matière première essentielle pour la synthèse des engrais azotés (ammoniac/urée).",
      enjeux_directive: [
        "Sécuriser l'accès aux engrais azotés et carburants indispensables aux travaux des champs et aux récoltes céréalières.",
        "Limiter les surcoûts énergétiques liés au séchage, à la ventilation et au maintien en température des réserves céréalières stratégiques.",
        "Assurer la viabilité économique des chaînes d'approvisionnement en carburants ruraux pour éviter toute rupture logistique de moisson.",
        "Défendre un calendrier de transition réaliste tenant compte de la dépendance technique actuelle de l'agriculture aux engrais de synthèse."
      ],
      stratégie: "Plaider auprès des décideurs pour la reconnaissance du gaz naturel comme vecteur indispensable de la sécurité alimentaire (engrais azotés) et alerter sur les factures énergétiques induites par le stockage prolongé des grains.",
      alliances: [
        "Conservateurs et Réformistes (défense de la compétitivité et pragmatisme économique)",
        "Hongrie (sensibilité aux coûts énergétiques et demande de délai)",
        "Pologne (sécurisation des approvisionnements en engrais des grands bassins céréaliers)",
        "Agrochimie (dépendance de la fabrication d'engrais au gaz naturel)"
      ],
      oppositions: [
        "Verts/ALE (volonté d'interdire rapidement les engrais azotés de synthèse)",
        "S&D (taxation carbone renforcée pesant sur les coûts de stockage)",
        "France (volonté de réduire la dépendance aux intrants fossiles importés)"
      ],
      éléments_d_argumentaire: [
        "Sans gaz naturel pour fabriquer les engrais azotés, les rendements céréaliers européens chuteraient de 40 %, détruisant la souveraineté alimentaire.",
        "Le séchage du grain et la ventilation des silos de la réserve stratégique nécessitent une énergie abondante et abordable.",
        "Les carburants agricoles restent irremplaçables à court terme pour faire tourner les flottes de moissonneuses et tracteurs.",
        "Une transition énergétique punitive imposée à l'agriculture provoquerait une envolée immédiate du prix du pain."
      ],
      positions_amendements: [
        {
          amendement: "2-4A",
          titre: "Porter la réserve stratégique à 9 mois",
          position: "DEFAVORABLE_PARTIEL",
          justification: "Stocker des céréales sur 9 mois engendre d'importantes consommations énergétiques pour le séchage et la ventilation continue des silos afin d'éviter le pourrissement des grains.",
          priorite: "haute",
          origine: "Renouveau Européen",
          description: "Porter la réserve stratégique à 9 mois"
        },
        {
          amendement: "2-4B",
          titre: "Conditionner les aides à la transition agroécologique",
          position: "DEFAVORABLE",
          justification: "Conditionner les aides à la baisse des engrais de synthèse menace la rentabilité des exploitations et déstabilise la filière européenne de fertilisation minérale.",
          priorite: "très_haute",
          origine: "Verts/ALE",
          description: "Conditionner les aides à la transition agroécologique"
        },
        {
          amendement: "2-4C",
          titre: "Instaurer un fonds européen pour la relocalisation alimentaire",
          position: "NEUTRE",
          justification: "La relocalisation alimentaire a un impact marginal sur les volumes globaux de carburants agricoles et d'engrais nécessaires aux grandes cultures.",
          priorite: "faible",
          origine: "Gauche Unitaire",
          description: "Instaurer un fonds européen pour la relocalisation alimentaire"
        },
        {
          amendement: "2-4D",
          titre: "Créer un label européen de circuits courts",
          position: "NEUTRE",
          justification: "Ce label commercial n'affecte pas directement les marchés d'approvisionnement en carburants et fertilisants des filières agricoles.",
          priorite: "faible",
          origine: "Socialistes & Démocrates",
          description: "Créer un label européen de circuits courts"
        },
        {
          amendement: "2-4E",
          titre: "Limiter la réserve stratégique à 3 mois",
          position: "FAVORABLE",
          justification: "Une durée de réserve limitée à 3 mois réduit les dépenses d'énergie nécessaires au séchage et à la conservation prolongée des grains en silos.",
          priorite: "moyenne",
          origine: "France",
          description: "Limiter la réserve stratégique à 3 mois"
        },
        {
          amendement: "2-4F",
          titre: "Exclure certains produits agricoles de la réserve",
          position: "FAVORABLE_CONDITIONNEL",
          justification: "Exclure les denrées complexes permet de limiter le recours à des chaînes de conservation frigorifiques ou énergivores.",
          priorite: "moyenne",
          origine: "Suède",
          description: "Exclure certains produits agricoles de la réserve"
        },
        {
          amendement: "2-4G",
          titre: "Soutenir prioritairement les grandes exploitations",
          position: "FAVORABLE",
          justification: "Les grandes exploitations possèdent l'échelle technique requise pour optimiser l'usage du matériel et des engrais minéraux, garantissant des volumes stratégiques élevés.",
          priorite: "haute",
          origine: "Pologne",
          description: "Soutenir prioritairement les grandes exploitations"
        },
        {
          amendement: "2-4H",
          titre: "Reporter l’application de la directive de deux ans",
          position: "FAVORABLE",
          justification: "Un délai de deux ans permet d'adapter les capacités de séchage et d'amortir les fluctuations des cours mondiaux de l'énergie et des engrais.",
          priorite: "haute",
          origine: "Hongrie",
          description: "Reporter l’application de la directive de deux ans"
        }
      ],
      notes_internes: "Coordonner les arguments avec l'Agrochimie sur la dépendance indissociable entre prix du gaz et volumes de récoltes céréalières."
    },
    // 2: Banque et Finance
    {
      ...originalList[2],
      role_europeen: "Représente les institutions bancaires, les fonds d'investissement et les assurances agricoles finançant les infrastructures de stockage et la modernisation rurale.",
      enjeux_directive: [
        "Financer les infrastructures de stockage de la réserve stratégique céréalière (silos, terminaux portuaires et ferroviaires).",
        "Développer des instruments de trésorerie et d'assurance récolte pour sécuriser les agriculteurs face aux aléas climatiques.",
        "Mettre en place des outils financiers de couverture contre la volatilité des cours mondiaux des céréales.",
        "Garantir des rendements stables et un cadre juridique sécurisé pour les investissements publics-privés dans l'agrobusiness."
      ],
      alliances: [
        "France (financement vert et modernisation des infrastructures agricoles)",
        "Allemagne (rigueur des montages financiers et stabilité du marché)",
        "PPE (soutien à l'investissement productif et compétitivité)",
        "Big Tech (digitalisation de la gestion du risque et évaluation actuarielle des récoltes)"
      ],
      oppositions: [
        "Hongrie (risques d'incertitude juridique et de dégradation de notation en cas de blocage)",
        "Conservateurs et Réformistes (réticence face aux garanties européennes mutualisées)"
      ],
      éléments_d_argumentaire: [
        "La réserve stratégique offre un sous-jacent tangible pour structurer des obligations d'investissement agricole européennes pérennes.",
        "La couverture des risques climatiques est indispensable pour maintenir la solvabilité des exploitations face aux calamités.",
        "La mutualisation financière réduit le coût d'emprunt pour la construction des silos stratégiques régionaux.",
        "La stabilité des cours céréaliers protège l'ensemble de l'écosystème bancaire et agroalimentaire."
      ],
      positions_amendements: originalList[2].positions_amendements.map(pa => {
        if (pa.amendement === "2-4H") {
          return {
            ...pa,
            justification: "Banque et Finance s'oppose à ce report car l'incertitude réglementaire gèlerait les investissements bancaires programmés dans les infrastructures de stockage céréalier."
          };
        }
        return pa;
      })
    },
    // 3: Agrochimie
    {
      ...originalList[3],
      role_europeen: "Représente les industriels des produits phytosanitaires, des semences et des fertilisants indispensables à la protection des cultures et à la préservation des grains stockés.",
      enjeux_directive: [
        "Préserver la protection des récoltes céréalières et la productivité des surfaces agricoles européennes.",
        "Garantir la conservation saine des grains stockés en silos contre les attaques de ravageurs, d'insectes et de moisissures.",
        "Plaider pour une transition agroécologique progressive sans baisse brutale des rendements par hectare.",
        "Promouvoir la recherche dans les biostimulants et les solutions de biocontrôle pour accompagner la durabilité."
      ],
      alliances: [
        "Pologne (priorité aux rendements et volumes céréaliers des grandes cultures)",
        "PPE (défense de la compétitivité et refus des baisses de production)",
        "Hongrie (maintien des outils conventionnels de protection des récoltes)",
        "Énergies fossiles (synergies sur les engrais de synthèse)"
      ],
      oppositions: [
        "Verts/ALE (volonté d'interdire les produits phytosanitaires de synthèse)",
        "GUE/NGL (opposition aux modèles agrochimiques industriels)"
      ],
      éléments_d_argumentaire: [
        "Sans protection efficace des plantes, jusqu'à 30 % des récoltes céréalières sont perdues au champ avant même de pouvoir être stockées.",
        "La conservation des céréales sur une durée prolongée impose des traitements sanitaires rigoureux pour éviter la contamination par les insectes des silos.",
        "La transition vers le biocontrôle doit être progressive pour ne pas provoquer d'effondrement de la souveraineté alimentaire européenne.",
        "L'innovation semencière et agronomique est le véritable levier pour conjuguer haut rendement et réduction de l'empreinte environnementale."
      ],
      positions_amendements: originalList[3].positions_amendements.map(pa => {
        if (pa.amendement === "2-4A") {
          return {
            ...pa,
            justification: "Agrochimie soutient cet amendement car la conservation sécurisée des réserves sur 9 mois valorise ses technologies de protection des grains contre les insectes nuisibles et les mycotoxines en silos."
          };
        }
        if (pa.amendement === "2-4E") {
          return {
            ...pa,
            justification: "Agrochimie préfère une rotation des stocks sur une durée mesurée, mais une réserve de 3 mois réduit le volume global de grains stabilisés sous surveillance sanitaire."
          };
        }
        return pa;
      })
    },
    // 4: Pharmaceutique (Biosécurité & Santé animale)
    {
      ...originalList[4],
      impacts_directive: [
        "La directive renforce les exigences de biosécurité et de contrôles sanitaires dans le stockage des réserves céréalières et la chaîne alimentaire.",
        "Le secteur de la santé vétérinaire et de la traçabilité sanitaire voit son rôle conforté dans la prévention des risques biologiques et des mycotoxines."
      ],
      role_europeen: "Représente les acteurs de la santé animale, de la biosécurité vétérinaire et de la sécurité sanitaire des denrées et filières agroalimentaires européennes.",
      enjeux_directive: [
        "Garantir les normes de biosécurité et la sécurité sanitaire de la chaîne alimentaire de l'étable et du champ jusqu'à l'assiette.",
        "Prévenir et contrôler les risques biologiques, mycotoxines et contaminants pathogènes dans les stocks céréaliers stratégiques.",
        "Renforcer la traçabilité sanitaire des filières agricoles et d'élevage pour prévenir les épizooties et zoonoses.",
        "Sécuriser la disponibilité des traitements vétérinaires essentiels pour protéger le cheptel européen et les filières animales."
      ],
      stratégie: "Le lobby de la santé vétérinaire et de la biosécurité défend une intégration stricte des normes sanitaires dans la gestion des réserves alimentaires, affirmant que la souveraineté alimentaire est indissociable de la sécurité microbiologique et de la santé animale.",
      alliances: [
        "Socialistes et Démocrates (défense de la qualité sanitaire des aliments et transparence pour les citoyens)",
        "Verts/ALE (lutte contre les contaminations chimiques et biologiques dans les filières)",
        "Commission européenne (normes sanitaires rigoureuses du marché intérieur)",
        "Italie (filières de qualité et contrôles sanitaires stricts)"
      ],
      oppositions: [
        "Conservateurs et Réformistes (tentative d'alléger les contrôles et protocoles de biosécurité)",
        "Hongrie (réticence face aux exigences sanitaires contraignantes pour les silos locaux)"
      ],
      éléments_d_argumentaire: [
        "Une réserve stratégique de céréales n'a de valeur que si les grains sont exempts de mycotoxines et de contaminations biologiques dangereuses.",
        "La santé animale et la sécurité sanitaire humaine sont interdépendantes selon le principe éprouvé 'Une seule santé' (One Health).",
        "La surveillance épidémiologique vétérinaire protège nos filières agricoles contre les chocs d'approvisionnement provoqués par les épizooties.",
        "Des normes sanitaires et de traçabilité exigeantes protègent les consommateurs européens et valorisent nos exportations."
      ],
      positions_amendements: [
        {
          amendement: "2-4A",
          titre: "Porter la réserve stratégique à 9 mois",
          position: "FAVORABLE_CONDITIONNEL",
          justification: "Une réserve prolongée à 9 mois exige des protocoles de biosécurité renforcés pour empêcher le développement de mycotoxines et de moisissures dans les silos.",
          priorite: "haute",
          origine: "Renouveau Européen",
          description: "Porter la réserve stratégique à 9 mois"
        },
        {
          amendement: "2-4B",
          titre: "Conditionner les aides à la transition agroécologique",
          position: "FAVORABLE",
          justification: "L'agroécologie améliore la résilience sanitaire naturelle des écosystèmes agricoles et réduit l'exposition aux risques pathogènes.",
          priorite: "haute",
          origine: "Verts/ALE",
          description: "Conditionner les aides à la transition agroécologique"
        },
        {
          amendement: "2-4C",
          titre: "Instaurer un fonds européen pour la relocalisation alimentaire",
          position: "FAVORABLE",
          justification: "Raccourcir les circuits d'approvisionnement facilite la traçabilité sanitaire et réduit les ruptures de chaîne du froid ou de conservation.",
          priorite: "moyenne",
          origine: "Gauche Unitaire",
          description: "Instaurer un fonds européen pour la relocalisation alimentaire"
        },
        {
          amendement: "2-4D",
          titre: "Créer un label européen de circuits courts",
          position: "FAVORABLE",
          justification: "Ce label offre une opportunité majeure d'intégrer des garanties officielles de biosécurité et de transparence sanitaire pour le consommateur.",
          priorite: "haute",
          origine: "Socialistes & Démocrates",
          description: "Créer un label européen de circuits courts"
        },
        {
          amendement: "2-4E",
          titre: "Limiter la réserve stratégique à 3 mois",
          position: "NEUTRE",
          justification: "Une durée plus courte réduit les risques sanitaires d'altération biologique des stocks, mais offre une résilience alimentaire globale plus faible.",
          priorite: "faible",
          origine: "France",
          description: "Limiter la réserve stratégique à 3 mois"
        },
        {
          amendement: "2-4F",
          titre: "Exclure certains produits agricoles de la réserve",
          position: "FAVORABLE",
          justification: "Exclure les denrées périssables à risque sanitaire élevé permet de concentrer les réserves sur des grains secs stables et hautement sécurisés.",
          priorite: "haute",
          origine: "Suède",
          description: "Exclure certains produits agricoles de la réserve"
        },
        {
          amendement: "2-4G",
          titre: "Soutenir prioritairement les grandes exploitations",
          position: "NEUTRE",
          justification: "Les protocoles de biosécurité doivent s'appliquer avec la même rigueur dans les grandes structures que dans les exploitations familiales.",
          priorite: "moyenne",
          origine: "Pologne",
          description: "Soutenir prioritairement les grandes exploitations"
        },
        {
          amendement: "2-4H",
          titre: "Reporter l’application de la directive de deux ans",
          position: "DEFAVORABLE",
          justification: "Retarder la directive reporte également l'harmonisation indispensable des normes de surveillance sanitaire des réserves stratégiques européennes.",
          priorite: "moyenne",
          origine: "Hongrie",
          description: "Reporter l’application de la directive de deux ans"
        }
      ],
      notes_internes: "Maintenir l'accent exclusif sur la biosécurité des silos, la santé vétérinaire du bétail et l'intégrité de la chaîne alimentaire."
    },
    // 5: Automobile (Machinisme agricole & Logistique alimentaire)
    {
      ...originalList[5],
      impacts_directive: [
        "La directive stimule la demande pour des engins de machinisme agricole sobres et des flottes de transport logistique agroalimentaire décarbonées.",
        "La valorisation des biocarburants durables issus des surplus agricoles ouvre de nouvelles perspectives pour les motorisations lourdes et le transport céréalier."
      ],
      role_europeen: "Représente les constructeurs de machinisme agricole (tracteurs, moissonneuses-batteuses) et les équipementiers de véhicules de transport logistique agroalimentaire.",
      enjeux_directive: [
        "Promouvoir le machinisme agricole durable et renouveler le parc d'engins vers des motorisations sobres (biométhane, biocarburants durables).",
        "Développer des flottes de transport logistique adaptées à la collecte des grains et à la distribution alimentaire en circuits courts.",
        "Valoriser les débouchés énergétiques des biocarburants durables issus de coproduits agricoles européens.",
        "Soutenir les aides à l'investissement pour que les exploitants agricoles s'équipent en matériel de récolte moderne et moins énergivore."
      ],
      stratégie: "L'industrie du machinisme agricole et de la logistique alimentaire valorise son rôle indispensable pour assurer les récoltes et le transport des céréales vers les silos stratégiques, en plaidant pour des aides à l'équipement moderne et le développement des biocarburants.",
      alliances: [
        "Allemagne (excellence des constructeurs de machines agricoles et logistique)",
        "Renouveau Européen (soutien à l'innovation industrielle et logistique multimodale)",
        "PPE (défense de l'investissement dans le matériel productif)",
        "Big Tech (interopérabilité des capteurs embarqués sur les tracteurs et moissonneuses)"
      ],
      oppositions: [
        "Hongrie (réticence face aux normes d'émissions des équipements neufs)",
        "Verts/ALE (si le machinisme lourd est perçu comme favorisant les monocultures intensives)"
      ],
      éléments_d_argumentaire: [
        "Sans moissonneuses-batteuses modernes et tracteurs fiables, il est impossible de rentrer les récoltes et de constituer les réserves céréalières.",
        "Le machinisme agricole nouvelle génération réduit le compactage des sols et optimise la consommation de carburant par hectare.",
        "Les biocarburants issus de résidus agricoles offrent une solution immédiate pour décarboner le transport lourd des grains.",
        "La modernisation du parc d'engins est le garant direct de la productivité et de la sécurité des agriculteurs."
      ],
      positions_amendements: [
        {
          amendement: "2-4A",
          titre: "Porter la réserve stratégique à 9 mois",
          position: "FAVORABLE",
          justification: "Augmenter la réserve stimule les besoins en capacités de transport logistique et en renouvellement du parc d'engins de collecte des récoltes.",
          priorite: "haute",
          origine: "Renouveau Européen",
          description: "Porter la réserve stratégique à 9 mois"
        },
        {
          amendement: "2-4B",
          titre: "Conditionner les aides à la transition agroécologique",
          position: "FAVORABLE_CONDITIONNEL",
          justification: "La transition agroécologique nécessite des équipements spécialisés (semoirs de précision, désherbage mécanique), à condition que les aides soutiennent ces achats.",
          priorite: "moyenne",
          origine: "Verts/ALE",
          description: "Conditionner les aides à la transition agroécologique"
        },
        {
          amendement: "2-4C",
          titre: "Instaurer un fonds européen pour la relocalisation alimentaire",
          position: "FAVORABLE",
          justification: "Ce fonds favorise l'équipement des filières locales en véhicules utilitaires légers de distribution et en matériel adapté aux exploitations moyennes.",
          priorite: "moyenne",
          origine: "Gauche Unitaire",
          description: "Instaurer un fonds européen pour la relocalisation alimentaire"
        },
        {
          amendement: "2-4D",
          titre: "Créer un label européen de circuits courts",
          position: "FAVORABLE_CONDITIONNEL",
          justification: "Ce label met en valeur les chaînes logistiques locales et incite au verdissement des véhicules de livraison de proximité.",
          priorite: "faible",
          origine: "Socialistes & Démocrates",
          description: "Créer un label européen de circuits courts"
        },
        {
          amendement: "2-4E",
          titre: "Limiter la réserve stratégique à 3 mois",
          position: "DEFAVORABLE_PARTIEL",
          justification: "Une réserve réduite diminue les volumes totaux transportés et stockés, limitant les investissements dans les flottes logistiques dédiées.",
          priorite: "moyenne",
          origine: "France",
          description: "Limiter la réserve stratégique à 3 mois"
        },
        {
          amendement: "2-4F",
          titre: "Exclure certains produits agricoles de la réserve",
          position: "NEUTRE",
          justification: "L'impact logistique dépend du volume effectif des céréales retenues, sans modifier substantiellement le besoin en engins de récolte.",
          priorite: "faible",
          origine: "Suède",
          description: "Exclure certains produits agricoles de la réserve"
        },
        {
          amendement: "2-4G",
          titre: "Soutenir prioritairement les grandes exploitations",
          position: "FAVORABLE_CONDITIONNEL",
          justification: "Les grandes exploitations sont les premières acheteuses de machines de haute capacité, mais le secteur a aussi besoin de débouchés pour les engins compacts.",
          priorite: "moyenne",
          origine: "Pologne",
          description: "Soutenir prioritairement les grandes exploitations"
        },
        {
          amendement: "2-4H",
          titre: "Reporter l’application de la directive de deux ans",
          position: "DEFAVORABLE",
          justification: "Le report retarderait les programmes d'aides à l'équipement des exploitations et les investissements logistiques associés.",
          priorite: "faible",
          origine: "Hongrie",
          description: "Reporter l’application de la directive de deux ans"
        }
      ],
      notes_internes: "Centrer exclusivement le propos sur le machinisme agricole, la logistique de transport des denrées et les biocarburants durables."
    }
  ];
}

// 8. Générer s2-d4.json consolidé
function generateConsolidated(commission, countries, parties, lobbies) {
  function toConsolidatedActor(act) {
    const impacts_amendements = (act.positions_amendements || []).map(pa => ({
      id: pa.amendement,
      origine: pa.origine,
      description: pa.description || pa.titre,
      impact: pa.justification
    }));
    return {
      type: act.type,
      nom: act.nom,
      role_europeen: act.role_europeen,
      enjeux_directive: act.enjeux_directive,
      impacts_directive: act.impacts_directive,
      impacts_amendements: impacts_amendements,
      positions_amendements: act.positions_amendements,
      stratégie: act.stratégie,
      alliances: act.alliances,
      oppositions: act.oppositions,
      éléments_d_argumentaire: act.éléments_d_argumentaire,
      références: act.références,
      notes_internes: act.notes_internes
    };
  }

  return {
    directive: {
      id: "2-4",
      title: "Souveraineté agricole européenne",
      description: "Réserve stratégique de céréales (6 mois). Soutien aux agriculteurs locaux, développement des circuits courts et constitution d'une réserve stratégique alimentaire pour réduire les importations et garantir l'autonomie.",
      commission: toConsolidatedActor(commission),
      countries: countries.map(toConsolidatedActor),
      parties: parties.map(toConsolidatedActor),
      lobbies: lobbies.map(toConsolidatedActor)
    }
  };
}

export function runUpdateProjet2() {
  const p2Public = path.resolve('projet2/public/json');
  const p2Json = path.resolve('projet2/json');

  const targets = [p2Public, p2Json];

  // 1. scenario2.json
  targets.forEach(t => updateScenario2(t));

  // 2. s2d4.json (enjeux)
  targets.forEach(t => updateS2D4Enjeux(t));

  // 3. stats2d4.json
  targets.forEach(t => updateStats2D4(t));

  // 4. Charger et transformer les fiches acteurs
  const comRaw = JSON.parse(fs.readFileSync(path.join(p2Public, 'directives/fiches-acteurs/s2/d4/com_s2-d4.json'), 'utf8'));
  const couRaw = JSON.parse(fs.readFileSync(path.join(p2Public, 'directives/fiches-acteurs/s2/d4/cou_s2-d4.json'), 'utf8'));
  const parRaw = JSON.parse(fs.readFileSync(path.join(p2Public, 'directives/fiches-acteurs/s2/d4/par_s2-d4.json'), 'utf8'));
  const lobRaw = JSON.parse(fs.readFileSync(path.join(p2Public, 'directives/fiches-acteurs/s2/d4/lob_s2-d4.json'), 'utf8'));

  const correctedCom = getCorrectedCommission(comRaw);
  const correctedCou = getCorrectedCountries(couRaw);
  const correctedPar = getCorrectedParties(parRaw);
  const correctedLob = getCorrectedLobbies(lobRaw);
  const consolidated = generateConsolidated(correctedCom, correctedCou, correctedPar, correctedLob);

  // Sauvegarder dans public et json
  targets.forEach(t => {
    const dir = path.join(t, 'directives/fiches-acteurs/s2/d4');
    fs.writeFileSync(path.join(dir, 'com_s2-d4.json'), JSON.stringify(correctedCom, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'cou_s2-d4.json'), JSON.stringify(correctedCou, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'par_s2-d4.json'), JSON.stringify(correctedPar, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 'lob_s2-d4.json'), JSON.stringify(correctedLob, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(dir, 's2-d4.json'), JSON.stringify(consolidated, null, 2) + '\n', 'utf8');
    console.log(`Fiches acteurs sauvegardées dans ${dir}`);
  });

  console.log('Mise à jour projet2 terminée avec succès !');
}

runUpdateProjet2();
