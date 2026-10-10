import fs from 'fs';
import path from 'path';

// Helper to write file to both public/json and json/
function writeDual(relPath, data) {
  const str = JSON.stringify(data, null, 2) + '\n';
  const pPublic = path.join('projet2/public/json', relPath);
  const pJson = path.join('projet2/json', relPath);
  fs.mkdirSync(path.dirname(pPublic), { recursive: true });
  fs.mkdirSync(path.dirname(pJson), { recursive: true });
  fs.writeFileSync(pPublic, str, 'utf8');
  fs.writeFileSync(pJson, str, 'utf8');
  console.log(`Saved: ${relPath}`);
}

// -------------------------------------------------------------
// 1. directives/enjeux/s2/s2d5.json
// -------------------------------------------------------------
const s2d5Enjeux = {
  directive: {
    id: "2-5",
    title: "Coopération diplomatique européenne",
    description: "Missions diplomatiques communes et représentation unique. Instaurer une représentation unique de l’UE dans les organisations internationales et déployer des missions diplomatiques conjointes pour renforcer la voix de l’Union, améliorer la cohérence extérieure et promouvoir la paix et la stabilité.",
    commission: {
      role: "Porte la proposition initiale, garantit la cohérence institutionnelle et fait le lien entre Parlement, Conseil et acteurs externes.",
      enjeux: [
        "Renforcer la cohérence et l’efficacité de l’action extérieure de l’UE via le Service européen pour l’action extérieure (SEAE).",
        "Affirmer la voix de l'Union dans les enceintes multilatérales par une représentation unique.",
        "Déployer des missions diplomatiques conjointes et mutualiser la protection consulaire des citoyens européens.",
        "Créer des capacités d'action préventive et de gestion concertée des crises internationales."
      ]
    },
    countries: [
      {
        name: "France",
        role: "Porteur",
        amendment: "Exclure certains États membres de la représentation unique",
        enjeux: [
          "Préserver son statut de membre permanent au Conseil de sécurité de l’ONU et l'autonomie de son réseau diplomatique mondial.",
          "Soutenir la solidarité diplomatique européenne tout en conservant une liberté d'action stratégique souveraine."
        ],
        strategie: "Défendre son statut diplomatique singulier (siège à l'ONU) tout en promouvant une solidarité européenne accrue face aux crises géopolitiques."
      },
      {
        name: "Allemagne",
        role: "Non-porteur",
        position: "Soutien favorable au multilatéralisme et à la coordination diplomatique européenne intégrée.",
        enjeux: [
          "Renforcer le multilatéralisme, le respect du droit international et l'influence globale de l'Union.",
          "Mutualiser les réseaux diplomatiques pour optimiser l'efficacité et réduire les coûts administratifs."
        ],
        role_description: "Médiateur pour une diplomatie multilatérale intégrée et un compromis constructif entre États membres."
      },
      {
        name: "Italie",
        role: "Non-porteur",
        position: "Soutien à la diplomatie commune avec un accent prioritaire sur la Méditerranée et le voisinage Sud.",
        enjeux: [
          "Accroître la solidarité diplomatique européenne dans le bassin méditerranéen et la gestion des crises régionales.",
          "Mutualiser les services consulaires et développer des mécanismes d'intervention d'urgence."
        ],
        role_description: "Défenseur d'une diplomatie commune proactive dans le voisinage méridional."
      },
      {
        name: "Hongrie",
        role: "Porteur",
        amendment: "Limiter la représentation unique à certaines organisations",
        enjeux: [
          "Préserver la souveraineté nationale en matière de politique étrangère et de relations internationales.",
          "Empêcher une centralisation des compétences diplomatiques au profit des institutions bruxelloises."
        ],
        strategie: "Fédérer les États souverainistes pour circonscrire la représentation unique à un nombre restreint d'enceintes."
      },
      {
        name: "Pologne",
        role: "Porteur",
        amendment: "Soutenir prioritairement la diplomatie bilatérale nationale",
        enjeux: [
          "Préserver ses alliances bilatérales stratégiques (notamment avec les États-Unis) et son action directe sur le flanc Est.",
          "Empêcher que la diplomatie européenne ne ralentisse les prises de position face aux menaces régionales."
        ],
        strategie: "Défendre la primauté et l'agilité des diplomaties bilatérales nationales sur les mécanismes intégrés."
      },
      {
        name: "Suède",
        role: "Porteur",
        amendment: "Reporter l’application de la directive de deux ans",
        enjeux: [
          "Assurer une transition réaliste et ordonnée pour l'harmonisation des missions consulaires et diplomatiques.",
          "Préserver son expertise historique de médiation internationale et la défense rigoureuse des droits humains."
        ],
        strategie: "Obtenir un calendrier d'application pragmatique pour garantir la viabilité administrative des réformes."
      }
    ],
    parties: [
      {
        name: "Parti Populaire Européen",
        role: "Porteur",
        amendment: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        enjeux: [
          "Renforcer la crédibilité géopolitique de l'UE et protéger les intérêts stratégiques européens face aux régimes autoritaires.",
          "Mettre en place une solidarité diplomatique et consulaire automatique pour tous les citoyens de l'Union."
        ],
        strategie: "Faire de l'Union un acteur diplomatique fort doté de mécanismes concrets d'assistance et de solidarité."
      },
      {
        name: "Socialistes et Démocrates",
        role: "Porteur",
        amendment: "Créer un fonds européen pour la diplomatie préventive",
        enjeux: [
          "Privilégier la résolution pacifique des conflits, la médiation et le soutien aux droits humains.",
          "Doter l'Union de ressources financières dédiées à l'anticipation des crises et à la diplomatie préventive."
        ],
        strategie: "Placer la prévention, la paix et la solidarité internationale au cœur de l'action diplomatique européenne."
      },
      {
        name: "Renouveau Européen",
        role: "Porteur",
        amendment: "Élargir la représentation unique à toutes les organisations internationales",
        enjeux: [
          "Fédéraliser et unifier la voix de l'Europe dans l'ensemble des instances mondiales pour maximiser son poids politique.",
          "Renforcer le SEAE et créer un véritable corps diplomatique européen commun."
        ],
        strategie: "Pousser l'intégration maximale vers une diplomatie européenne unifiée et influente."
      },
      {
        name: "Verts/ALE",
        role: "Porteur",
        amendment: "Conditionner la participation aux missions à la formation diplomatique commune",
        enjeux: [
          "Assurer une formation diplomatique d'excellence axée sur le droit international, les droits humains et la diplomatie climatique.",
          "Garantir des standards éthiques et démocratiques stricts dans toutes les représentations de l'Union."
        ],
        strategie: "Conditionner les missions communes à une professionnalisation et un socle de valeurs partagées."
      },
      {
        name: "Conservateurs et Réformistes",
        role: "Non-porteur",
        position: "Défense de la souveraineté nationale des États membres dans la conduite de leurs relations extérieures.",
        enjeux: [
          "Préserver la souveraineté diplomatique exclusive des capitales nationales.",
          "Refuser la création d'un service diplomatique européen supranational obligatoire."
        ],
        strategie: "S'opposer à toute centralisation fédérale et défendre le modèle de coopération intergouvernementale."
      },
      {
        name: "Gauche Unitaire",
        role: "Non-porteur",
        position: "Soutien au pacifisme multilatéral universel sous l'égide de l'ONU, critique de toute logique de confrontation de blocs.",
        enjeux: [
          "Promouvoir le désarmement, la justice sociale internationale et le respect universel du droit international.",
          "Éviter que la diplomatie européenne ne devienne un instrument géopolitique agressif."
        ],
        strategie: "Plaider pour une diplomatie de paix, de coopération et de respect de la souveraineté des peuples."
      }
    ],
    lobbies: [
      {
        sector: "Big Tech",
        interests: [
          "Participer à la cyber-diplomatie et aux négociations internationales sur la gouvernance de l'internet et de l'IA.",
          "Garantir la sécurité des infrastructures numériques et des flux mondiaux de données face aux cybermenaces."
        ],
        alliances: [
          "Renouveau Européen",
          "France",
          "Parti Populaire Européen"
        ]
      },
      {
        sector: "Energies Fossiles",
        interests: [
          "Sécuriser les corridors d'approvisionnement énergétique internationaux et la diplomatie des ressources stratégiques.",
          "Anticiper et gérer l'impact des régimes de sanctions diplomatiques internationales sur les contrats et approvisionnements énergétiques."
        ],
        alliances: [
          "Pologne",
          "Conservateurs et Réformistes",
          "Hongrie"
        ]
      },
      {
        sector: "Banque et Finance",
        interests: [
          "Renforcer la voix de l'UE au sein des institutions financières mondiales (FMI, Banque mondiale, G20, BRI).",
          "Assurer la sécurité juridique et la coordination internationale des sanctions financières et des flux monétaires."
        ],
        alliances: [
          "Allemagne",
          "Parti Populaire Européen",
          "Renouveau Européen"
        ]
      },
      {
        sector: "Agrochimie",
        interests: [
          "Défendre les intérêts exportateurs européens dans les négociations commerciales internationales et à l'OMC.",
          "Harmoniser les normes sanitaires et phytosanitaires (SPS) à l'international pour lever les barrières non tarifaires."
        ],
        alliances: [
          "Italie",
          "Socialistes et Démocrates"
        ]
      },
      {
        sector: "Pharmaceutique",
        interests: [
          "Renforcer la diplomatie sanitaire mondiale (OMS) et sécuriser les chaînes d'approvisionnement de santé face aux crises.",
          "Défendre les droits de propriété intellectuelle (accords ADPIC/TRIPS) et la reconnaissance mutuelle des standards thérapeutiques."
        ],
        alliances: [
          "France",
          "Renouveau Européen",
          "Parti Populaire Européen"
        ]
      },
      {
        sector: "Automobile",
        interests: [
          "Faciliter la conclusion d'accords commerciaux multilatéraux et bilatéraux pour fluidifier les exportations de véhicules et composants.",
          "Prévenir et résoudre les différends commerciaux et les barrières tarifaires et non tarifaires sur les grands marchés mondiaux."
        ],
        alliances: [
          "Allemagne",
          "Parti Populaire Européen"
        ]
      }
    ]
  }
};

// -------------------------------------------------------------
// 2. directives/fiches-acteurs/s2/d5/com_s2-d5.json
// -------------------------------------------------------------
const comS2D5 = {
  type: "Commission",
  nom: "Commission européenne",
  actor_id: "commission",
  role_europeen: "Porte la proposition initiale, garantit la cohérence institutionnelle et fait le lien entre Parlement, Conseil et acteurs externes.",
  enjeux_directive: [
    "Renforcer la cohérence et l’efficacité de l’action extérieure de l’UE via le Service européen pour l’action extérieure (SEAE).",
    "Affirmer une voix européenne unifiée dans les organisations et enceintes multilatérales.",
    "Déployer des missions diplomatiques conjointes et mutualiser la protection consulaire des citoyens européens.",
    "Créer des mécanismes de solidarité diplomatique et de diplomatie préventive face aux crises internationales.",
    "Promouvoir une approche multilatérale fondée sur les règles, la paix et la médiation pacifique."
  ],
  impacts_directive: [
    "La directive renforcera le rôle du SEAE et de la Commission dans la conduite concertée des relations extérieures de l'Union.",
    "Elle consolidera l'autorité et la visibilité de l'UE comme acteur géopolitique crédible et unifié.",
    "Elle favorisera une coordination étroite entre diplomatie stratégique, politique commerciale et aide humanitaire."
  ],
  impacts_amendements: [
    {
      id: "2-5A",
      origine: "Renouveau Européen",
      description: "Élargir la représentation unique à toutes les organisations internationales",
      impact: "Renforcerait significativement l'influence multilatérale de l'Union, mais exige une adhésion totale des États membres et un mandat diplomatique clair."
    },
    {
      id: "2-5B",
      origine: "Socialistes & Démocrates",
      description: "Créer un fonds européen pour la diplomatie préventive",
      impact: "Permettrait d'anticiper les crises géopolitiques et de financer des médiations rapides avant l'escalade des conflits."
    },
    {
      id: "2-5C",
      origine: "Verts/ALE",
      description: "Conditionner la participation aux missions à la formation diplomatique commune",
      impact: "Améliorerait l'interopérabilité, les standards éthiques et le professionnalisme des équipes diplomatiques communes."
    },
    {
      id: "2-5D",
      origine: "Parti Populaire Européen",
      description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
      impact: "Offrirait un filet de sécurité diplomatique indispensable pour protéger les ressortissants et missions des États membres en crise."
    },
    {
      id: "2-5E",
      origine: "Hongrie",
      description: "Limiter la représentation unique à certaines organisations",
      impact: "Modérerait la portée et la visibilité internationale de l'Union en créant des régimes d'exception par organisation."
    },
    {
      id: "2-5F",
      origine: "France",
      description: "Exclure certains États membres de la représentation unique",
      impact: "Introduirait une asymétrie entre États membres, bien que compréhensible pour préserver le statut spécifique du siège permanent français au CSNU."
    },
    {
      id: "2-5G",
      origine: "Pologne",
      description: "Soutenir prioritairement la diplomatie bilatérale nationale",
      impact: "Risquerait de fragmenter la parole européenne au détriment de l'action collective unifiée."
    },
    {
      id: "2-5H",
      origine: "Suède",
      description: "Reporter l’application de la directive de deux ans",
      impact: "Reporterait de deux ans les bénéfices d'une voix unifiée, mais faciliterait l'adaptation logistique et administrative des chancelleries nationales."
    }
  ],
  stratégie: "La Commission européenne adopte une stratégie centrée sur le renforcement de la cohérence institutionnelle et la promotion d’une diplomatie multilatérale. Elle vise à aligner les actions diplomatiques des États membres avec un cadre stratégique commun sous l'égide du SEAE. En matière de représentation unique, elle soutient son déploiement ambitieux pour peser de tout son poids dans les forums mondiaux (ONU, OMC, G20). Elle accueille très favorablement la création d'un fonds de diplomatie préventive (2-5B) et d'un mécanisme de solidarité diplomatique (2-5D), tout en recherchant des compromis pragmatiques sur les formations communes (2-5C) et les spécificités de souveraineté légitimes (2-5F). Elle s'oppose en revanche aux tentatives de vidage du texte qui viseraient à sanctuariser un bilatéralisme isolé (2-5G) ou à restreindre drastiquement le champ de la coopération (2-5E).",
  alliances: [
    "Renouveau Européen (partage l'objectif d'une représentation unique élargie et d'un rôle diplomatique fédéral)",
    "Socialistes & Démocrates (soutien au fonds de diplomatie préventive et à la médiation pacifique)",
    "PPE (appui au mécanisme de solidarité diplomatique et à la crédibilité internationale)",
    "Verts/ALE (soutien à la formation diplomatique commune et à la diplomatie multilatérale)",
    "Allemagne (attachement fort au multilatéralisme et aux règles internationales)",
    "Italie (intérêt pour les missions conjointes et la stabilisation de la Méditerranée)",
    "Banque et Finance (soutien à la représentation coordonnée dans les instances financières mondiales)"
  ],
  oppositions: [
    "Hongrie (refus d'une représentation unique et défense stricte de la souveraineté bilatérale)",
    "Pologne (priorité donnée à la diplomatie bilatérale nationale et aux liens transatlantiques exclusifs)",
    "Conservateurs et Réformistes (défense de la souveraineté diplomatique exclusive des capitales)"
  ],
  éléments_d_argumentaire: [
    "Une diplomatie européenne unifiée démultiplie l'influence des 27 États membres face aux grandes puissances géopolitiques.",
    "La représentation unique dans les organisations internationales met fin aux cacophonies et garantit la défense coordonnée des valeurs et intérêts européens.",
    "Le fonds européen pour la diplomatie préventive permet d'intervenir en amont pour désamorcer les conflits plutôt que de subir des crises déstabilisatrices.",
    "Le mécanisme de solidarité diplomatique garantit à chaque citoyen européen une protection consulaire renforcée, partout dans le monde.",
    "Une formation diplomatique commune constitue le socle indispensable d'une culture stratégique partagée au sein du Service européen pour l'action extérieure."
  ],
  références: [
    "s2d5.json",
    "scenario2.json"
  ],
  notes_internes: "Surveiller les tensions de souveraineté diplomatique entre la France (siège permanent au Conseil de sécurité de l'ONU) et les partisans d'une intégration fédérale stricte. Trouver un terrain d'entente avec la Suède sur un calendrier progressif d'application sans dénaturer l'ambition initiale.",
  positions_amendements: [
    {
      amendement: "2-5A",
      titre: "Élargir la représentation unique à toutes les organisations internationales",
      position: "FAVORABLE",
      justification: "La Commission soutient cet amendement car il concrétise la vision d'une voix européenne forte et cohérente dans toutes les enceintes multilatérales majeures.",
      priorite: "très_haute",
      origine: "Renouveau Européen",
      description: "Élargir la représentation unique à toutes les organisations internationales"
    },
    {
      amendement: "2-5B",
      titre: "Créer un fonds européen pour la diplomatie préventive",
      position: "FAVORABLE",
      justification: "La Commission juge ce fonds indispensable pour agir de façon proactive, financer des médiations de paix et éviter l'embrasement de crises internationales.",
      priorite: "très_haute",
      origine: "Socialistes & Démocrates",
      description: "Créer un fonds européen pour la diplomatie préventive"
    },
    {
      amendement: "2-5C",
      titre: "Conditionner la participation aux missions à la formation diplomatique commune",
      position: "FAVORABLE_CONDITIONNEL",
      justification: "La Commission soutient la professionnalisation et l'harmonisation via une académie diplomatique européenne, mais souhaite éviter des critères d'accès trop rigides qui freineraient le déploiement opérationnel des missions.",
      priorite: "haute",
      origine: "Verts/ALE",
      description: "Conditionner la participation aux missions à la formation diplomatique commune"
    },
    {
      amendement: "2-5D",
      titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
      position: "FAVORABLE",
      justification: "Ce mécanisme concrétise le principe de solidarité entre États membres en assurant une assistance consulaire et diplomatique automatique en cas d'urgence.",
      priorite: "haute",
      origine: "Parti Populaire Européen",
      description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
    },
    {
      amendement: "2-5E",
      titre: "Limiter la représentation unique à certaines organisations",
      position: "DEFAVORABLE",
      justification: "Une telle restriction affaiblirait la portée de la directive et fragmenterait la parole de l'Union sur la scène mondiale.",
      priorite: "moyenne",
      origine: "Hongrie",
      description: "Limiter la représentation unique à certaines organisations"
    },
    {
      amendement: "2-5F",
      titre: "Exclure certains États membres de la représentation unique",
      position: "DEFAVORABLE_PARTIEL",
      justification: "La Commission défend l'universalité de la représentation commune, tout en admettant des aménagements pragmatiques pour le statut historique de la France au Conseil de sécurité des Nations unies.",
      priorite: "moyenne",
      origine: "France",
      description: "Exclure certains États membres de la représentation unique"
    },
    {
      amendement: "2-5G",
      titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
      position: "DEFAVORABLE",
      justification: "Privilégier le bilatéralisme isolé risque de réintroduire des divergences nationales et d'annihiler l'impact géopolitique de l'action collective européenne.",
      priorite: "moyenne",
      origine: "Pologne",
      description: "Soutenir prioritairement la diplomatie bilatérale nationale"
    },
    {
      amendement: "2-5H",
      titre: "Reporter l’application de la directive de deux ans",
      position: "DEFAVORABLE",
      justification: "La Commission préconise une entrée en vigueur rapide pour répondre aux crises géopolitiques contemporaines, tout en restant ouverte à des phases de transition technique.",
      priorite: "faible",
      origine: "Suède",
      description: "Reporter l’application de la directive de deux ans"
    }
  ],
  metadata: {
    source_file: "s2-d5.json",
    type: "commission",
    directive_id: "2-5",
    tokens: {
      count: 750,
      model_reference: "Qwen3-14B",
      counted_at: "2026-10-10T17:30:00.000000",
      context_limits: {
        fits_8k: true,
        fits_16k: true,
        fits_32k: true,
        fits_128k: true
      },
      size_category: "small"
    }
  },
  scenario_id: 2,
  directive_id: 5,
  actor_type: "commission",
  generated_at: "2026-10-10T17:30:00.000000",
  version: "4.8"
};

// -------------------------------------------------------------
// 3. directives/fiches-acteurs/s2/d5/cou_s2-d5.json
// -------------------------------------------------------------
const couS2D5 = [
  {
    type: "Etat",
    nom: "France",
    actor_id: "france",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Préserver son statut de membre permanent au Conseil de sécurité de l’ONU et l'autonomie de son réseau diplomatique mondial.",
      "Promouvoir l'autonomie stratégique européenne et la solidarité diplomatique face aux crises géopolitiques.",
      "Assurer une concertation européenne sans subordonner son outil diplomatique souverain.",
      "Renforcer l'efficacité des missions conjointes dans les zones de crise et la protection consulaire partagée."
    ],
    impacts_directive: [
      "La directive affectera l'organisation de l'appareil diplomatique français et sa coordination avec le SEAE.",
      "La position de la France reflète sa double identité de puissance diplomatique mondiale et de moteur de l'intégration européenne."
    ],
    stratégie: "La France défend fermement l'amendement 2-5F pour sanctuariser son siège permanent au Conseil de sécurité des Nations unies et l'indépendance de sa voix nationale dans cette enceinte clé. Elle soutient en revanche avec vigueur le renforcement de la solidarité diplomatique (2-5D) et la création du fonds de diplomatie préventive (2-5B). Elle favorise une politique étrangère européenne puissante, complémentaire des diplomaties nationales de premier rang, mais s'oppose à une uniformisation qui priverait l'Europe du levier diplomatique singulier que constitue la diplomatie française.",
    alliances: [
      "Allemagne (concertation étroite sur les priorités géopolitiques et le multilatéralisme)",
      "Italie (partage de priorités sur la stabilité méditerranéenne et la gestion de crise)",
      "Parti Populaire Européen (soutien au mécanisme de solidarité diplomatique)",
      "Socialistes et Démocrates (accord sur le fonds de diplomatie préventive)",
      "Pharmaceutique (synergies sur la diplomatie sanitaire mondiale)",
      "Big Tech (coopération sur la cyber-diplomatie et la souveraineté numérique)"
    ],
    oppositions: [
      "Hongrie (désaccord sur le repli souverainiste et l'obstruction aux positions communes)",
      "Conservateurs et Réformistes (opposition au refus de toute solidarité diplomatique européenne)"
    ],
    éléments_d_argumentaire: [
      "Le siège permanent de la France au Conseil de sécurité de l'ONU est un atout stratégique pour l'ensemble de l'Europe qui doit être préservé de toute dissolution institutionnelle.",
      "Une diplomatie européenne crédible doit reposer sur des mécanismes automatiques de solidarité et d'assistance consulaire en cas de crise internationale.",
      "Le fonds européen de diplomatie préventive permettra d'intervenir rapidement pour stabiliser les zones de tension et prévenir les conflits.",
      "L'Union européenne gagne en force lorsque les missions diplomatiques conjointes s'articulent avec les réseaux d'influence mondiaux des États membres.",
      "L'exclusion ciblée de certaines représentations uniques (2-5F) garantit l'équilibre indispensable entre souveraineté diplomatique nationale et intégration européenne."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Veiller à maintenir une ligne ferme sur la préservation intégrale des prérogatives françaises au Conseil de sécurité de l'ONU tout en valorisant le leadership français sur la solidarité de crise.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "La France soutient l'élargissement de la représentation commune dans la plupart des organisations multilatérales, à condition expresse que son statut de membre permanent au CSNU soit sanctuarisé.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "La France soutient activement ce fonds pour renforcer les capacités de médiation et d'anticipation des crises de l'Union européenne.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "DEFAVORABLE_PARTIEL",
        justification: "La France souhaite préserver l'autonomie et l'excellence de son propre corps diplomatique tout en acceptant des modules partagés au niveau du SEAE.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Ce mécanisme concrétise l'autonomie stratégique et renforce l'aide consulaire et sécuritaire apportée aux citoyens européens.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "La France s'oppose à une restriction générale qui viderait la directive de sa substance, préférant des dérogations fonctionnelles précises.",
        priorite: "faible",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE",
        justification: "Amendement initié par la France pour préserver son statut permanent au Conseil de sécurité de l'ONU et l'indépendance de sa diplomatie stratégique.",
        priorite: "très_haute",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "NEUTRE",
        justification: "La France combine diplomatie bilatérale et multilatérale, mais refuse que la priorité absolue au bilatéralisme ne paralyse l'ambition européenne.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE_PARTIEL",
        justification: "La France préfère une mise en œuvre sans retard injustifié pour peser rapidement dans les négociations internationales actuelles.",
        priorite: "moyenne",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Etat",
    nom: "Allemagne",
    actor_id: "allemagne",
    role_europeen: "Non-porteur - Soutien prudent, privilégie une approche progressive.",
    enjeux_directive: [
      "Renforcer le multilatéralisme, le respect du droit international et l'ordre mondial fondé sur des règles.",
      "Optimiser l'efficacité de l'action extérieure européenne en mutualisant les moyens diplomatiques et consulaires.",
      "Promouvoir la diplomatie économique et la stabilité des marchés mondiaux.",
      "Rechercher un équilibre constructif entre intégration diplomatique et souveraineté des partenaires."
    ],
    impacts_directive: [
      "La directive confortera le rôle moteur de l'Allemagne dans la consolidation du multilatéralisme européen.",
      "Elle permettra des économies d'échelle substantielles dans le réseau consulaire européen."
    ],
    stratégie: "L’Allemagne adopte une approche pragmatique et constructive. Fervente partisane d'un multilatéralisme efficace et d'une parole européenne unie, elle soutient l'élargissement de la représentation unique (2-5A) et la création du fonds de diplomatie préventive (2-5B). Elle s'efforce de jouer un rôle de médiateur entre les ambitions fédéralistes de Renouveau et les réserves des pays attachés à leurs prérogatives nationales. Elle appuie les mécanismes de formation commune (2-5C) et de solidarité (2-5D) tout en veillant à la maîtrise budgétaire.",
    alliances: [
      "France (moteur du compromis franco-allemand sur les relations extérieures)",
      "Parti Populaire Européen (priorité à la stabilité et à la solidarité diplomatique)",
      "Socialistes et Démocrates (engagement en faveur de la médiation et de la diplomatie préventive)",
      "Renouveau Européen (soutien à la représentation unifiée)",
      "Banque et Finance (défense de la diplomatie économique et monétaire)",
      "Automobile (sécurisation des accords commerciaux mondiaux)"
    ],
    oppositions: [
      "Hongrie (critique du blocage systématique des positions communes)",
      "Pologne (réserves face à un bilatéralisme exclusif qui affaiblirait l'Union)"
    ],
    éléments_d_argumentaire: [
      "Le multilatéralisme est le garant de la sécurité, de la prospérité et de la stabilité internationales.",
      "Une représentation unifiée au sein des grandes organisations internationales confère à l'UE un poids déterminant face aux superpuissances.",
      "La mutualisation des chancelleries et des services consulaires améliore le service rendu aux citoyens tout en réduisant les coûts pour les contribuables.",
      "La diplomatie préventive est un investissement stratégique indispensable pour prévenir les crises géopolitiques majeures.",
      "L'Europe doit parler d'une seule voix pour défendre les accords de libre-échange et les normes internationales."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Faciliter un compromis équilibré entre la France et les autres États sur la question de la représentation à l'ONU, et soutenir un calendrier réaliste.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "L'Allemagne soutient pleinement une voix européenne unie dans toutes les institutions multilatérales.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "L'Allemagne considère la prévention et la médiation pacifique comme des piliers essentiels de sa doctrine de politique étrangère.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La formation commune renforce la cohérence doctrinale et opérationnelle des missions de l'Union.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La solidarité diplomatique garantit la cohésion européenne et protège tous les citoyens de l'Union à l'étranger.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Cette restriction réduirait la portée internationale de l'Union et contredirait la vocation multilatérale européenne.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE_PARTIEL",
        justification: "L'Allemagne privilégie l'égalité entre États membres, mais admet un compromis pragmatique pour tenir compte du siège permanent de la France au Conseil de sécurité de l'ONU.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE",
        justification: "Donner la priorité absolue au bilatéralisme affaiblirait la capacité collective de l'Europe à peser sur les décisions mondiales.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "NEUTRE",
        justification: "L'Allemagne est ouverte à une phase de mise en œuvre progressive si cela permet de consolider l'accord politique général.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Etat",
    nom: "Italie",
    actor_id: "italie",
    role_europeen: "Non-porteur - Soutien actif aux missions conjointes et à la solidarité méditerranéenne.",
    enjeux_directive: [
      "Mobiliser la diplomatie européenne sur la stabilisation du bassin méditerranéen et de l'Afrique du Nord.",
      "Renforcer l'assistance consulaire et les mécanismes d'évacuation d'urgence pour les citoyens européens.",
      "Promouvoir une diplomatie humanitaire et de gestion de crise active.",
      "Assurer une répartition équitable des moyens diplomatiques communs entre le Sud et l'Est de l'Europe."
    ],
    impacts_directive: [
      "L'Italie bénéficiera d'un appui diplomatique renforcé dans ses zones de voisinage stratégique immédiat.",
      "Les consulats italiens pourront s'appuyer sur le réseau mutualisé de l'Union dans les pays tiers."
    ],
    stratégie: "L’Italie soutient fermement la directive, qu'elle perçoit comme un multiplicateur d'influence dans son voisinage méditerranéen. Elle soutient avec enthousiasme le fonds de diplomatie préventive (2-5B) et le mécanisme de solidarité diplomatique (2-5D) qui peuvent être mobilisés pour la stabilisation régionale. Elle veille à ce que les missions diplomatiques communes accordent une priorité suffisante aux défis migratoires et sécuritaires au Sud de l'Europe.",
    alliances: [
      "France (collaboration étroite sur les affaires méditerranéennes et africaines)",
      "Socialistes et Démocrates (priorité à la prévention des conflits et à la solidarité)",
      "Parti Populaire Européen (engagement pour la protection consulaire)",
      "Agrochimie (défense des exportations et normes de qualité à l'international)"
    ],
    oppositions: [
      "Hongrie (désaccord sur la limitation de l'action extérieure européenne)",
      "Pologne (divergence potentielle sur l'équilibre des priorités entre flanc Est et bassin Sud)"
    ],
    éléments_d_argumentaire: [
      "La Méditerranée est un espace stratégique vital qui nécessite une présence diplomatique européenne unie et proactive.",
      "Le fonds de diplomatie préventive est un instrument clé pour stabiliser les pays partenaires et éviter les crises migratoires majeures.",
      "La solidarité diplomatique doit fonctionner à plein pour protéger les ressortissants et délégations européennes en zone de danger.",
      "Une voix européenne unie à l'ONU et dans les instances régionales renforce la crédibilité de l'Europe comme médiateur de paix."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Veiller à ce que l'accent mis sur la diplomatie préventive intègre pleinement les partenariats stratégiques avec les pays de la rive sud de la Méditerranée.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "L'Italie est favorable à une représentation unifiée qui amplifie l'influence collective des pays membres.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Ce fonds est essentiel pour stabiliser la Méditerranée et anticiper les tensions géopolitiques.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "Une formation partagée garantit la cohérence des interventions diplomatiques sur le terrain.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Ce mécanisme offre une sécurité essentielle pour les citoyens et diplomates en cas d'urgence extérieure.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Restreindre la représentation unique réduirait la portée de l'action internationale de l'Union.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE_PARTIEL",
        justification: "L'Italie préfère l'égalité des États membres mais comprend les impératifs du statut français à l'ONU.",
        priorite: "faible",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Le bilatéralisme ne doit pas supplanter l'action diplomatique commune de l'Union européenne.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE",
        justification: "L'urgence des crises géopolitiques exige une mise en œuvre sans retard de la coopération diplomatique.",
        priorite: "moyenne",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Etat",
    nom: "Hongrie",
    actor_id: "hongrie",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Préserver sa souveraineté nationale en matière de politique étrangère et de relations bilatérales.",
      "Empêcher une centralisation excessive des compétences diplomatiques entre les mains des institutions européennes.",
      "Garder la liberté d'entretenir des relations diplomatiques et économiques autonomes avec des pays tiers.",
      "Limiter les obligations financières et institutionnelles supranationales."
    ],
    impacts_directive: [
      "La directive pourrait restreindre la marge de manœuvre diplomatique bilatérale de la Hongrie si elle n'est pas assortie de limites strictes.",
      "La position hongroise illustre la défense sans compromis de la politique étrangère souveraine."
    ],
    stratégie: "La Hongrie est l'initiatrice de l'amendement 2-5E visant à limiter strictement la représentation unique à un nombre restreint d'organisations. Elle s'oppose à toute idée d'une diplomatie européenne intégrée ou contraignante qui réduirait sa liberté d'action géopolitique. Elle s'allie avec la Pologne et les forces conservatrices pour défendre la subsidiarité et appuie l'amendement 2-5G favorable aux diplomaties bilatérales, tout en soutenant le report de la directive (2-5H).",
    alliances: [
      "Pologne (solidarité sur la défense des compétences souveraines nationales)",
      "Conservateurs et Réformistes (défense de la subsidiarité en politique étrangère)",
      "Énergies Fossiles (préservation des relations diplomatiques et contrats énergétiques bilatéraux)"
    ],
    oppositions: [
      "Renouveau Européen (rejet absolu du fédéralisme diplomatique)",
      "Commission européenne (opposition à la centralisation supranationale)",
      "Verts/ALE (critique de l'ingérence normative)"
    ],
    éléments_d_argumentaire: [
      "La politique étrangère relève de la souveraineté inaliénable de chaque État membre et ne peut faire l'objet d'une tutelle supranationale.",
      "Une représentation unique généralisée priverait les petits États membres de leur voix propre sur la scène internationale.",
      "L'UE doit respecter les intérêts nationaux spécifiques de chaque pays dans ses relations avec ses voisins et partenaires stratégiques.",
      "Limiter la représentation unique (2-5E) est indispensable pour préserver la flexibilité diplomatique des nations souveraines."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Mobiliser les soutiens au Conseil pour faire adopter l'amendement 2-5E et freiner toute tentative d'imposer des votes à la majorité qualifiée en politique étrangère.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "DEFAVORABLE",
        justification: "La Hongrie rejette cet élargissement qui priverait les États membres de leur représentation souveraine dans les enceintes mondiales.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Crainte que ce fonds ne serve à financer des priorités idéologiques éloignées des intérêts nationaux hongrois.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "DEFAVORABLE",
        justification: "La Hongrie entend garder la maîtrise exclusive de la formation de ses propres diplomates.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Opposée à des obligations automatiques de solidarité qui engageraient sa responsabilité sans consentement explicite.",
        priorite: "moyenne",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "FAVORABLE",
        justification: "Amendement initié par la Hongrie pour restreindre le champ d'application de la directive et préserver l'autonomie des diplomaties nationales.",
        priorite: "très_haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE",
        justification: "La Hongrie soutient toute dérogation qui reconnaît le droit des États à préserver leur diplomatie nationale.",
        priorite: "haute",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "FAVORABLE",
        justification: "Soutien plein à l'amendement polonais réaffirmant la primauté légitime des relations bilatérales souveraines.",
        priorite: "très_haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE",
        justification: "Un report de deux ans permet de retarder une intégration diplomatique jugée inopportune.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Etat",
    nom: "Pologne",
    actor_id: "pologne",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Préserver l'autonomie et l'agilité de sa diplomatie bilatérale, en particulier avec les États-Unis et ses partenaires régionaux.",
      "Garantir la priorité absolue aux impératifs de sécurité et de dissuasion sur le flanc oriental de l'Europe.",
      "Empêcher que des procédures diplomatiques communes lentes ne paralysent la réactivité face aux crises géopolitiques à l'Est.",
      "Bénéficier d'une solidarité diplomatique européenne sans renoncer à ses partenariats stratégiques privilégiés."
    ],
    impacts_directive: [
      "La directive pourrait impacter les relations bilatérales directes de Varsovie si une voix unique s'imposait sans consensus.",
      "La position de la Pologne reflète la primauté des considérations de sécurité immédiate sur le flanc Est."
    ],
    stratégie: "La Pologne est à l'initiative de l'amendement 2-5G visant à soutenir prioritairement la diplomatie bilatérale nationale. Très attachée à ses liens bilatéraux étroits avec Washington et ses voisins orientaux, elle craint qu'une diplomatie commune trop centralisée n'édulcore les réponses fermes face aux menaces extérieures. Elle soutient en revanche le mécanisme de solidarité diplomatique (2-5D) et reste ouverte à un report (2-5H) pour ajuster les dispositifs.",
    alliances: [
      "Hongrie (front commun pour la subsidiarité et les diplomaties souveraines)",
      "Conservateurs et Réformistes (appui politique au Parlement européen)",
      "Parti Populaire Européen (convergence sur la solidarité de crise et la fermeté géopolitique)",
      "Énergies Fossiles (sécurisation des approvisionnements stratégiques)"
    ],
    oppositions: [
      "Renouveau Européen (opposition à la fédéralisation exclusive des affaires étrangères)",
      "Commission européenne (méfiance face à toute restriction du rôle des diplomaties nationales)"
    ],
    éléments_d_argumentaire: [
      "La diplomatie bilatérale est un outil indispensable de sécurité nationale, garantissant réactivité et confiance directe avec les alliés stratégiques.",
      "L'Union européenne ne doit pas entraver les canaux diplomatiques privilégiés des États membres situés aux frontières extérieures les plus exposées.",
      "La solidarité diplomatique en cas de crise (2-5D) est essentielle, mais elle doit épauler les diplomaties nationales et non les remplacer.",
      "Soutenir la diplomatie bilatérale (2-5G) garantit la prise en compte immédiate des réalités sécuritaires du flanc oriental."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "S'assurer que la coopération diplomatique européenne ne concurrence jamais les garanties de sécurité transatlantiques ni l'autonomie stratégique bilatérale de Varsovie.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "DEFAVORABLE",
        justification: "La Pologne craint qu'une représentation unique généralisée ne restreigne sa capacité à défendre ses intérêts vitaux sur le flanc Est.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "NEUTRE",
        justification: "Favorable au principe de prévention, mais attentive à ce que les fonds ne soient pas détournés des urgences sécuritaires orientales.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Réticente face à des conditions bureaucratiques qui limiteraient la flexibilité de son personnel diplomatique.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La Pologne soutient fortement la solidarité automatique entre Européens en cas de crise géopolitique extérieure.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "FAVORABLE",
        justification: "Soutient la proposition hongroise de circonscrire l'intégration supranationale.",
        priorite: "haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Ouverte à des exceptions si celles-ci peuvent également s'appliquer aux contextes sécuritaires spécifiques du flanc Est.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "FAVORABLE",
        justification: "Amendement initié par la Pologne pour sacraliser l'agilité et la priorité des alliances diplomatiques bilatérales directes.",
        priorite: "très_haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE",
        justification: "Un délai supplémentaire facilite l'évaluation approfondie des impacts sur les réseaux bilatéraux.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Etat",
    nom: "Suède",
    actor_id: "suede",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Assurer une mise en œuvre pragmatique, méthodique et rigoureuse de la coopération diplomatique européenne.",
      "Valoriser son savoir-faire reconnu en matière de médiation internationale de paix et de défense de l'État de droit.",
      "Éviter les dysfonctionnements administratifs et financiers lors de la mise en commun des missions consulaires.",
      "Promouvoir la transparence, les droits humains et la diplomatie féministe et multilatérale."
    ],
    impacts_directive: [
      "La directive exigera une réorganisation graduelle de ses représentations à l'étranger.",
      "La position suédoise prône l'efficacité concrète et un calendrier soutenable pour les administrations."
    ],
    stratégie: "La Suède est à l'origine de l'amendement 2-5H préconisant un report de l'application de la directive de deux ans. Favorable sur le fond à la coopération diplomatique multilatérale, à la diplomatie préventive (2-5B) et à la formation commune (2-5C), elle considère qu'un délai de transition de deux ans est indispensable pour harmoniser les procédures consulaires, former les agents et adapter les systèmes sans créer de vide opérationnel.",
    alliances: [
      "Allemagne (partage d'une vision multilatérale et rigueur de gestion)",
      "Verts/ALE (convergence sur la formation commune et les droits fondamentaux)",
      "Socialistes et Démocrates (accord sur la médiation pacifique et la prévention des conflits)",
      "Parti Populaire Européen (soutien à la solidarité diplomatique coordonnée)"
    ],
    oppositions: [
      "Hongrie (critique du manque d'ambition sur les valeurs démocratiques internationales)",
      "Pologne (méfiance face à un bilatéralisme qui négligerait les principes multilatéraux)"
    ],
    éléments_d_argumentaire: [
      "Une réforme diplomatique de cette ampleur nécessite un temps de préparation rigoureux pour être efficace sur le terrain.",
      "Le report de deux ans (2-5H) garantira une transition sans faille pour nos réseaux consulaires et la protection de nos concitoyens.",
      "La Suède soutient fermement la diplomatie préventive et la promotion active de l'État de droit et des droits humains à l'échelle mondiale.",
      "La formation diplomatique commune (2-5C) est la condition d'un service diplomatique européen respecté et irréprochable."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Défendre fermement le report de deux ans comme une mesure de bon sens administratif et de pragmatisme gestionnaire, sans remettre en cause l'objectif européen global.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "pays",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable au principe de représentation commune si elle démontre une réelle valeur ajoutée et une gestion transparente.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Soutien plein à un fonds dédié à la paix, à la médiation et à l'anticipation des conflits.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La formation commune est essentielle pour diffuser les meilleures pratiques en matière de droit international et de droits humains.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La solidarité européenne doit jouer pleinement pour protéger nos ressortissants dans les situations d'urgence.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "NEUTRE",
        justification: "Pragmatique sur le périmètre des organisations concernées en fonction de l'évaluation coût-efficacité.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "La Suède défend l'égalité de traitement et des règles communes pour tous les États membres sans passe-droit.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Le multilatéralisme doit primer sur les approches bilatérales exclusives.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE",
        justification: "Amendement initié par la Suède pour accorder le temps nécessaire à une adaptation administrative et opérationnelle sans accroc.",
        priorite: "très_haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  }
];

// -------------------------------------------------------------
// 4. directives/fiches-acteurs/s2/d5/par_s2-d5.json
// -------------------------------------------------------------
const parS2D5 = [
  {
    type: "Parti",
    nom: "Parti Populaire Européen",
    actor_id: "ppe",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Renforcer la crédibilité géopolitique de l'Union européenne sur la scène internationale.",
      "Instaurer un mécanisme de solidarité diplomatique automatique en cas de crise extérieure (2-5D).",
      "Assurer une protection consulaire efficace et coordonnée pour tous les citoyens de l'UE dans le monde.",
      "Allier fermeté diplomatique, sécurité et défense des intérêts stratégiques européens."
    ],
    impacts_directive: [
      "La directive conférera à l'Union une stature internationale accrue face aux puissances rivales.",
      "Elle assurera une protection opérationnelle directe à l'ensemble des ressortissants européens."
    ],
    stratégie: "Le PPE est l'initiateur de l'amendement 2-5D créant un mécanisme de solidarité diplomatique en cas de crise. Le parti défend une diplomatie européenne forte, protectrice et influente, capable de répondre avec fermeté aux défis géopolitiques mondiaux. Il appuie l'élargissement de la représentation unique (2-5A) et recherche des compromis réalistes sur la formation (2-5C) et le financement préventif (2-5B), tout en rejetant les velléités de division ou de repli souverainiste.",
    alliances: [
      "France (convergence sur la solidarité diplomatique et la stature de puissance)",
      "Allemagne (appui commun au multilatéralisme fort et à la stabilité)",
      "Renouveau Européen (soutien à l'affirmation géopolitique de l'UE)",
      "Socialistes et Démocrates (accord sur la protection consulaire et la gestion de crise)",
      "Banque et Finance (défense de la diplomatie économique et financière)",
      "Automobile (soutien aux accords commerciaux protecteurs)"
    ],
    oppositions: [
      "Hongrie (opposition à l'affaiblissement de la voix européenne commune)",
      "Conservateurs et Réformistes (rejet de l'inaction supranationale)"
    ],
    éléments_d_argumentaire: [
      "L'Union européenne doit être en mesure d'agir et de protéger ses citoyens partout dans le monde avec un mécanisme de solidarité sans faille (2-5D).",
      "Une diplomatie européenne affirmée est la clé pour défendre nos valeurs démocratiques et nos intérêts économiques stratégiques.",
      "La mutualisation consulaire garantit à chaque citoyen européen une assistance immédiate même dans les pays où son État d'origine n'a pas d'ambassade.",
      "La voix de l'Europe ne sera respectée que si elle fait preuve d'une unité indéfectible face aux régimes autoritaires."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Maintenir la priorité absolue sur l'amendement 2-5D pour inscrire la solidarité diplomatique concrète au cœur du texte final.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Le PPE défend une représentation commune étendue pour peser face aux grandes puissances dans toutes les enceintes multilatérales.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable au fonds préventif sous réserve d'une gouvernance rigoureuse et d'un contrôle budgétaire strict.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "NEUTRE",
        justification: "Soutient la qualité de la formation mais refuse des critères rigides qui bloqueraient les nominations rapides.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Amendement phare du PPE instituant un mécanisme automatique de secours et d'assistance diplomatique et consulaire en cas d'urgence internationale.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Le PPE s'oppose à un rabaissement général de la stature diplomatique de l'Union.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Le PPE comprend la spécificité du statut de la France au Conseil de sécurité de l'ONU comme atout stratégique pour l'Europe.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Le bilatéralisme ne doit pas miner l'unité européenne mais s'articuler harmonieusement avec elle.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Préfère une mise en œuvre sans délai excessif au vu de l'instabilité internationale actuelle.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Parti",
    nom: "Socialistes et Démocrates",
    actor_id: "sd",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Créer un fonds européen pour la diplomatie préventive et le règlement pacifique des différends (2-5B).",
      "Placer les droits humains, la démocratie, la justice sociale et l'aide au développement au cœur des relations extérieures.",
      "Renforcer le multilatéralisme universel dans le cadre de la charte des Nations unies.",
      "Promouvoir la paix durable, la médiation de conflits et le désarmement."
    ],
    impacts_directive: [
      "La directive permettra d'orienter l'action extérieure européenne vers la prévention plutôt que la réaction militaire.",
      "Elle renforcera la légitimité éthique et démocratique de l'Union européenne sur la scène internationale."
    ],
    stratégie: "Le groupe S&D porte l'amendement 2-5B pour doter l'Union d'un fonds de diplomatie préventive ambitieux. Convaincu que la paix durable s'obtient par le dialogue, la coopération et le développement économique inclusif, le S&D milite pour une diplomatie humaine et multilatérale. Il soutient l'élargissement de la représentation unique (2-5A), la formation commune (2-5C) et la solidarité consulaire (2-5D), tout en refusant les logiques de repli bilatéral ou de confrontation stérile.",
    alliances: [
      "Verts/ALE (convergence sur la paix, les droits humains et la formation diplomatique)",
      "Renouveau Européen (accord sur la représentation multilatérale unifiée)",
      "Parti Populaire Européen (compromis sur la solidarité de crise et la diplomatie préventive)",
      "Italie (soutien à la stabilisation de la Méditerranée et diplomatie humanitaire)",
      "Allemagne (attachement commun à la médiation pacifique)"
    ],
    oppositions: [
      "Hongrie (critique de l'opposition aux valeurs universelles de paix et de solidarité)",
      "Conservateurs et Réformistes (rejet du repli nationaliste)"
    ],
    éléments_d_argumentaire: [
      "Investir dans la diplomatie préventive coûte infiniment moins cher en vies et en ressources que de gérer des conflits armés ouverts.",
      "Le fonds européen de diplomatie préventive (2-5B) est l'outil indispensable pour intervenir en amont avec des médiateurs formés et neutres.",
      "Une diplomatie européenne unifiée doit porter les valeurs de démocratie, d'égalité et de droits humains à travers le monde.",
      "La solidarité diplomatique doit protéger tous les citoyens européens sans distinction de nationalité."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Mobiliser les soutiens progressistes et centristes pour garantir un budget significatif au fonds de diplomatie préventive.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Soutien plein à une voix européenne forte pour porter les valeurs de paix et de multilatéralisme.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Amendement initié par le S&D pour faire de l'anticipation des conflits et de la médiation le cœur de l'action extérieure de l'UE.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La formation commune garantit la maîtrise du droit international et des droits fondamentaux par tous les diplomates européens.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La solidarité est un principe fondamental de l'Union qui doit s'appliquer pleinement aux relations extérieures.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Cette restriction affaiblirait l'impact des politiques diplomatiques européennes.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Le S&D regrette les dérogations mais accepte une approche pragmatique pour préserver l'accord d'ensemble.",
        priorite: "faible",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE",
        justification: "Prioriser le bilatéralisme fragmenterait la solidarité et l'action internationale concertée de l'UE.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE",
        justification: "L'urgence diplomatique requiert une action rapide sans délais injustifiés.",
        priorite: "moyenne",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Parti",
    nom: "Renouveau Européen",
    actor_id: "re",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Élargir la représentation unique de l'UE à toutes les organisations internationales (2-5A).",
      "Fédéraliser et moderniser l'action extérieure pour doter l'Union d'une voix puissante et respectée dans le monde.",
      "Renforcer les prérogatives du SEAE et constituer une véritable diplomatie européenne intégrée.",
      "Dépasser les concurrences nationales stériles pour affirmer la souveraineté européenne."
    ],
    impacts_directive: [
      "La directive constitue une avancée historique vers une diplomatie européenne véritablement intégrée.",
      "Elle placera l'Union européenne sur un pied d'égalité avec les superpuissances dans tous les forums internationaux."
    ],
    stratégie: "Renouveau Européen est le porteur de l'amendement 2-5A. Il prône une intégration diplomatique ambitieuse, convaincu que seule une représentation unique généralisée permet à l'Europe de faire face aux défis mondiaux (commerce, climat, sécurité, régulation numérique). Il soutient ardemment le fonds préventif (2-5B), la formation commune (2-5C) et la solidarité de crise (2-5D), et s'oppose vigoureusement à toute tentative de dilution souverainiste (2-5E, 2-5G).",
    alliances: [
      "Commission européenne (allié naturel pour une diplomatie unifiée forte)",
      "Socialistes et Démocrates (accord sur la représentation unifiée et le multilatéralisme)",
      "Parti Populaire Européen (convergence sur la force géopolitique de l'UE)",
      "Verts/ALE (soutien à l'académie diplomatique et au droit international)",
      "Big Tech (coopération sur la cyber-diplomatie et les standards numériques mondiaux)"
    ],
    oppositions: [
      "Hongrie (opposition résolue au repli nationaliste)",
      "Conservateurs et Réformistes (rejet de l'intergouvernementalisme frileux)",
      "Pologne (refus de subordonner la diplomatie commune au bilatéralisme)"
    ],
    éléments_d_argumentaire: [
      "Dans un monde de géants et de rivalités exacerbées, les diplomaties nationales isolées n'ont pas la taille critique nécessaire pour s'imposer.",
      "L'élargissement de la représentation unique à toutes les organisations internationales (2-5A) donne à l'Europe le poids politique correspondant à sa puissance économique.",
      "Une diplomatie intégrée est la condition sine qua non de la véritable souveraineté européenne.",
      "La coordination totale de nos réseaux diplomatiques et consulaires offre aux Européens une protection sans égale."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Défendre l'amendement 2-5A avec la plus haute priorité et négocier des passerelles avec la France sur les modalités opérationnelles.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Amendement phare de Renouveau pour bâtir une diplomatie européenne intégrée et incontournable sur la scène mondiale.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Ce fonds renforce la réactivité et la crédibilité de l'action extérieure de l'Union.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La création d'un corps diplomatique formé ensemble est le socle d'une diplomatie commune efficace.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La solidarité diplomatique concrétise l'appartenance à une communauté de destin européenne.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Cette proposition affaiblirait drastiquement la portée du texte et la stature internationale de l'Union.",
        priorite: "très_haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Renouveau souhaite l'unité la plus large possible mais accepte une exception temporaire et ciblée pour le Conseil de sécurité de l'ONU.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE",
        justification: "Privilégier le bilatéralisme va à l'encontre de la construction d'une politique étrangère européenne intégrée.",
        priorite: "haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE",
        justification: "Le monde n'attendra pas deux ans : l'Europe doit s'affirmer sans tarder sur la scène géopolitique.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Parti",
    nom: "Verts/Alliance Libre Européenne (Verts/ALE)",
    actor_id: "verts_ale",
    role_europeen: "Porteur",
    enjeux_directive: [
      "Conditionner la participation aux missions diplomatiques communes à une formation approfondie (2-5C).",
      "Promouvoir la diplomatie climatique, environnementale et la justice internationale.",
      "Garantir la primauté du droit international, des droits humains et du désarmement dans l'action extérieure.",
      "Assurer la transparence, le contrôle démocratique et l'exemplarité éthique des représentations de l'Union."
    ],
    impacts_directive: [
      "La directive favorisera l'émergence d'une diplomatie européenne fondée sur les valeurs démocratiques et écologiques.",
      "Elle assurera une professionnalisation accrue et une culture partagée du droit international."
    ],
    stratégie: "Les Verts/ALE portent l'amendement 2-5C visant à instaurer une académie diplomatique européenne commune obligatoire pour participer aux missions conjointes. Ils veulent une diplomatie européenne de transformation, engagée dans les négociations climatiques mondiales, le respect strict des traités internationaux et la défense des libertés fondamentales. Ils soutiennent le fonds de diplomatie préventive (2-5B) et la représentation unique (2-5A), tout en réclamant un contrôle parlementaire rigoureux.",
    alliances: [
      "Socialistes et Démocrates (front commun sur la prévention des crises et les droits humains)",
      "Renouveau Européen (accord sur la formation diplomatique commune et le multilatéralisme)",
      "Suède (sensibilité commune à la rigueur démocratique et aux droits de l'homme)"
    ],
    oppositions: [
      "Hongrie (dénonciation du recul des standards démocratiques et de l'obstruction multilatérale)",
      "Conservateurs et Réformistes (rejet de l'affaiblissement des engagements climatiques et du droit international)"
    ],
    éléments_d_argumentaire: [
      "La crédibilité internationale de l'UE dépend du professionnalisme et des valeurs éthiques de ses représentants.",
      "La formation diplomatique commune (2-5C) est la garantie que chaque diplomate européen défendra avec compétence le droit international et la transition écologique.",
      "La diplomatie préventive (2-5B) doit intégrer l'anticipation des crises climatiques et environnementales, sources majeures de conflits futurs.",
      "Une représentation unie permet à l'Union d'imposer des normes environnementales et éthiques ambitieuses dans les traités mondiaux."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "S'assurer que le cursus de formation commune intègre des modules obligatoires sur la diplomatie climatique, les droits de l'homme et la médiation non-violente.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Une voix européenne unie renforce le poids des combats pour le climat et les droits humains à l'ONU et dans les agences mondiales.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Outil fondamental pour prévenir pacifiquement les crises et soutenir les sociétés civiles en danger.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "Amendement initié par les Verts/ALE pour fonder les missions communes sur un socle irréprochable de droit international et de valeurs démocratiques.",
        priorite: "très_haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La protection et la solidarité doivent s'étendre à tous les citoyens et défenseurs des droits humains en situation d'urgence.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Cette proposition freinerait l'influence de l'UE dans les négociations écologiques et humanitaires mondiales.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "Les Verts/ALE privilégient une action collective et transparente sans passe-droit national.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE",
        justification: "Le repli bilatéral favorise les compromis au rabais et affaiblit les règles multilatérales.",
        priorite: "haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Comprend le besoin de formation initiale mais souhaite une mise en œuvre rapide des piliers clés.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Parti",
    nom: "Conservateurs et Réformistes Européens (ECR)",
    actor_id: "ecr",
    role_europeen: "Non-porteur - Défense de la souveraineté nationale et subsidiarité diplomatique.",
    enjeux_directive: [
      "Préserver la souveraineté diplomatique exclusive des États membres.",
      "Refuser la création d'un service diplomatique fédéral supranational contraignant.",
      "Préserver la liberté des alliances bilatérales directes et le lien transatlantique.",
      "Défendre le principe de subsidiarité stricte dans la politique étrangère."
    ],
    impacts_directive: [
      "Le groupe s'inquiète du risque d'effacement des voix nationales au profit de positions bruxelloises uniformisées.",
      "Il cherchera à introduire des clauses de flexibilité et des dérogations souveraines."
    ],
    stratégie: "L'ECR combat toute tentative de dessaisir les capitales nationales de leur diplomatie souveraine. Favorable à la coopération intergouvernementale pragmatique mais fermement opposé au fédéralisme diplomatique, il appuie les amendements de subsidiarité (2-5E, 2-5G) et le report d'application (2-5H), tout en s'opposant vivement à l'élargissement de la représentation unique (2-5A) et aux formations contraignantes (2-5C).",
    alliances: [
      "Pologne (soutien total à l'amendement 2-5G sur le bilatéralisme)",
      "Hongrie (appui à l'amendement 2-5E sur la limitation de la représentation unique)",
      "Énergies Fossiles (préservation des relations diplomatiques énergétiques bilatérales)"
    ],
    oppositions: [
      "Renouveau Européen (rejet frontal de toute intégration diplomatique fédérale)",
      "Commission européenne (opposition à la centralisation supranationale)"
    ],
    éléments_d_argumentaire: [
      "La politique étrangère touche au cœur de la souveraineté nationale et doit demeurer une compétence exclusive des États.",
      "Une diplomatie unique affaiblira l'Europe en l'obligeant à des compromis lents et insipides fondés sur le plus petit dénominateur commun.",
      "Les alliances bilatérales fortes (notamment avec les États-Unis) garantissent notre sécurité bien plus efficacement qu'un super-service diplomatique bruxellois.",
      "La subsidiarité et le respect des traditions diplomatiques de chaque nation doivent être rigoureusement préservés."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Coordonner les votes avec les députés polonais et hongrois pour maximiser le soutien aux amendements 2-5E et 2-5G.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "DEFAVORABLE",
        justification: "Rejet catégorique de toute centralisation diplomatique supranationale.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Réticence face à la création de nouveaux fonds gérés par les institutions européennes.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "DEFAVORABLE",
        justification: "Chaque nation souveraine doit former librement ses propres diplomates.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable à l'entraide consulaire entre États membres sans transfert de souveraineté.",
        priorite: "moyenne",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "FAVORABLE",
        justification: "Soutien plein à la limitation du champ de la représentation unique pour protéger les diplomaties d'État.",
        priorite: "très_haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE",
        justification: "Soutient toute exception préservant les prérogatives souveraines des capitales.",
        priorite: "haute",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "FAVORABLE",
        justification: "Position cardinale de l'ECR réaffirmant la primauté légitime des relations diplomatiques bilatérales directes.",
        priorite: "très_haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE",
        justification: "Tout report permet de freiner l'intégration supranationale et de préserver l'autonomie des États.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Parti",
    nom: "Gauche Unitaire Européenne/Gauche Verte Nordique (GUE/NGL)",
    actor_id: "gue_ngl",
    role_europeen: "Non-porteur - Pacifisme, droit international et coopération solidaire.",
    enjeux_directive: [
      "Promouvoir une diplomatie universelle de paix, de désarmement et de respect mutuel des souverainetés.",
      "Refuser que la diplomatie européenne ne serve de caution à des politiques d'ingérence ou d'alignement atlantiste.",
      "Renforcer le multilatéralisme universel sous l'égide de l'ONU et le respect du droit international humanitaire.",
      "Défendre les droits des peuples, la justice climatique et la solidarité Nord-Sud."
    ],
    impacts_directive: [
      "Le groupe veillera à ce que l'action diplomatique commune ne soit pas militarisée ni subordonnée à des intérêts géopolitiques agressifs.",
      "Il soutiendra les volets de médiation de paix et de prévention des conflits."
    ],
    stratégie: "La Gauche Unitaire soutient les initiatives diplomatiques axées sur la paix, la médiation pacifique et la diplomatie préventive (2-5B). Elle s'oppose en revanche à une politique étrangère européenne qui favoriserait une logique de blocs ou servirait d'instrument géopolitique hégémonique. Elle demande une transparence démocratique totale et le respect absolu de la charte de l'ONU.",
    alliances: [
      "Socialistes et Démocrates (convergence sur le fonds de diplomatie préventive et le désarmement)",
      "Verts/ALE (soutien commun au droit international et aux droits humains)"
    ],
    oppositions: [
      "Conservateurs et Réformistes (rejet de l'alignement belliciste)",
      "Parti Populaire Européen (critique de la diplomatie axée sur la puissance militaire)"
    ],
    éléments_d_argumentaire: [
      "La diplomatie doit servir la paix, la solidarité internationale et le respect de tous les peuples, non les intérêts impériaux des grandes puissances.",
      "Le fonds pour la diplomatie préventive (2-5B) doit être prioritairement mobilisé pour le désarmement et la résolution pacifique des différends.",
      "L'Union européenne doit être une voix indépendante et pacifique dans le monde, fidèle aux principes fondateurs de l'ONU.",
      "La formation des diplomates (2-5C) doit mettre l'accent sur les droits économiques, sociaux et culturels et la justice climatique mondiale."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Voter résolument pour l'amendement 2-5B et exiger que les missions conjointes soient systématiquement soumises au respect du droit international humanitaire.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "parti",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable si la représentation unifiée défend la paix et le multilatéralisme universel à l'ONU.",
        priorite: "moyenne",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Soutien plein et entier à un fonds orienté vers la médiation pacifique et la prévention des conflits.",
        priorite: "très_haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La formation commune doit inculquer le respect scrupuleux du droit international humanitaire et de la paix.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "La solidarité diplomatique doit protéger les populations et les travailleurs humanitaires en zone de crise.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "NEUTRE",
        justification: "Préfère juger au cas par cas selon la nature des organisations internationales concernées.",
        priorite: "faible",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "Opposée aux privilèges diplomatiques exclusifs d'une seule nation.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "NEUTRE",
        justification: "Admet le droit à une diplomatie nationale souveraine mais prône le multilatéralisme universel.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Ouverte à un délai pour consolider les garde-fous démocratiques et pacifiques.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  }
];

// -------------------------------------------------------------
// 5. directives/fiches-acteurs/s2/d5/lob_s2-d5.json
// -------------------------------------------------------------
const lobS2D5 = [
  {
    type: "Lobby",
    nom: "Big Tech",
    actor_id: "tech",
    role_europeen: "Représente les acteurs majeurs des technologies de l'information et des plateformes numériques, défendant un cadre mondial harmonisé pour l'économie de la donnée et la cyber-diplomatie.",
    enjeux_directive: [
      "Participer activement à la cyber-diplomatie européenne et aux négociations mondiales sur la gouvernance de l'internet.",
      "Promouvoir des traités internationaux multilatéraux sur la libre circulation transfrontalière des données et les standards éthiques de l'IA.",
      "Assurer la protection coordonnée des infrastructures numériques critiques mondiales face aux cyberattaques et aux menaces hybrides.",
      "Éviter la fragmentation réglementaire internationale et les cyber-frontières numériques."
    ],
    impacts_directive: [
      "Une représentation diplomatique européenne unifiée facilitera la négociation de traités numériques internationaux cohérents.",
      "Le secteur technologique pourra s'appuyer sur le réseau diplomatique du SEAE pour défendre des normes numériques ouvertes à l'échelle mondiale."
    ],
    stratégie: "Big Tech privilégie une représentation diplomatique européenne forte et unifiée pour peser dans les instances multilatérales de normalisation numérique (UIT, ONU, OCDE). Elle soutient l'élargissement de la représentation unique (2-5A) et la solidarité diplomatique face aux cybercrises (2-5D), tout en proposant d'associer des experts technologiques aux missions diplomatiques conjointes et à la formation du SEAE (2-5C).",
    alliances: [
      "Renouveau Européen (partage de l'ambition d'une souveraineté numérique et diplomatique mondiale)",
      "Parti Populaire Européen (coopération sur la cybersécurité et la résilience stratégique)",
      "France (collaboration sur la régulation de l'IA et la diplomatie technologique)",
      "Banque et Finance (convergence sur la sécurité des transactions numériques mondiales)"
    ],
    oppositions: [
      "Conservateurs et Réformistes (crainte de fragmentations bilatérales des normes numériques)",
      "Hongrie (méfiance face aux restrictions d'accès aux forums technologiques internationaux)"
    ],
    éléments_d_argumentaire: [
      "La cyber-diplomatie est devenue un champ géopolitique majeur qui nécessite une présence européenne unifiée et hautement qualifiée.",
      "Une représentation unique de l'UE à l'UIT et à l'ONU garantit que les standards éthiques européens de l'IA prévaudront au niveau mondial.",
      "Les mécanismes de solidarité diplomatique (2-5D) doivent intégrer l'assistance immédiate en cas de cyberattaques massives déstabilisatrices.",
      "La formation diplomatique commune (2-5C) doit inclure la compréhension des enjeux numériques mondiaux et de la gouvernance des données."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Veiller à ce que la directive valorise les partenariats public-privé en matière de veille technologique et de cyber-diplomatie.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Big Tech soutient cette proposition pour assurer une voix européenne forte et harmonisée dans toutes les instances internationales de normalisation technologique.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable si le fonds intègre la prévention des cyber-conflits et la surveillance des menaces numériques hybrides.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "La formation commune est l'opportunité de former les diplomates européens aux enjeux de cyber-sécurité et de souveraineté numérique.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Renforce la réponse coordonnée en cas de cyber-crise internationale touchant les infrastructures critiques européennes.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Restreindre la représentation unique risquerait d'exclure les agences internationales de régulation technologique où l'Europe doit parler d'une seule voix.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "Préfère un cadre commun homogène pour éviter la divergence des positions technologiques européennes.",
        priorite: "faible",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "NEUTRE",
        justification: "Comprend les partenariats bilatéraux mais privilégie une régulation multilatérale harmonisée.",
        priorite: "faible",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE",
        justification: "La vitesse de l'innovation technologique mondiale exige une diplomatie européenne immédiatement opérationnelle.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Lobby",
    nom: "Énergies Fossiles",
    actor_id: "fossiles",
    role_europeen: "Représente les acteurs des approvisionnements énergétiques, des infrastructures gazières et pétrolières et des partenariats internationaux de ressources.",
    enjeux_directive: [
      "Sécuriser les corridors d'approvisionnement énergétique internationaux et la stabilité des pays producteurs partenaires.",
      "Anticiper et gérer l'impact des régimes de sanctions diplomatiques internationales sur les contrats et approvisionnements à long terme.",
      "Veiller à ce que la diplomatie européenne protège la sécurité énergétique et la continuité des flux en période de crise géopolitique.",
      "Maintenir des canaux de dialogue diplomatique bilatéraux avec les grands pays exportateurs de ressources énergétiques."
    ],
    impacts_directive: [
      "Une diplomatie européenne coordonnée peut renforcer le poids des acheteurs européens face aux grands cartels de producteurs.",
      "Les décisions diplomatiques collectives sur les sanctions ou partenariats auront un impact direct sur la sécurité d'approvisionnement du continent."
    ],
    stratégie: "Le secteur des énergies fossiles privilégie la continuité et la sécurité des approvisionnements. Il soutient les mécanismes de solidarité diplomatique en cas de crise extérieure (2-5D) qui peuvent aider à surmonter les ruptures d'approvisionnement, mais tient à préserver la souplesse des diplomaties bilatérales (2-5G) pour sécuriser des contrats énergétiques vitaux. Il soutient un report (2-5H) pour laisser le temps d'adapter les contrats internationaux aux nouvelles règles de sanctions.",
    alliances: [
      "Pologne (priorité commune à la sécurité d'approvisionnement et à la flexibilité bilatérale)",
      "Hongrie (défense de la liberté contractuelle et des relations énergétiques spécifiques)",
      "Conservateurs et Réformistes (soutien à la flexibilité et au réalisme géopolitique)",
      "Parti Populaire Européen (partage du souci de sécurité énergétique)"
    ],
    oppositions: [
      "Verts/ALE (désaccord sur l'intégration exclusive de critères écologiques restrictifs dans la diplomatie)",
      "Renouveau Européen (crainte d'une centralisation diplomatique trop rigide)"
    ],
    éléments_d_argumentaire: [
      "La sécurité d'approvisionnement énergétique est une composante vitale de la sécurité nationale et européenne qui exige une diplomatie pragmatique.",
      "Les mécanismes de solidarité diplomatique (2-5D) sont indispensables pour faire face solidairement aux chantages énergétiques extérieurs.",
      "La flexibilité bilatérale (2-5G) permet de négocier des accords d'approvisionnement d'urgence adaptés aux spécificités géographiques de chaque État.",
      "Les sanctions diplomatiques doivent être minutieusement calibrées pour ne pas pénaliser la compétitivité et le pouvoir d'achat des citoyens européens."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Veiller à ce que les missions diplomatiques conjointes incluent des attachés spécialisés dans la sécurité des approvisionnements stratégiques.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable si la représentation unifiée renforce le pouvoir de négociation de l'UE auprès des pays producteurs de ressources.",
        priorite: "haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "La prévention des crises dans les pays producteurs et le long des corridors d'approvisionnement est un facteur clé de stabilité énergétique.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "NEUTRE",
        justification: "N'affecte pas directement les opérations énergétiques mais soutient la professionnalisation générale.",
        priorite: "faible",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Permet de répondre solidairement aux ruptures d'approvisionnement et aux pressions géopolitiques extérieures.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "FAVORABLE",
        justification: "Permet de préserver la marge de manœuvre des États dans les enceintes bilatérales ou régionales dédiées à l'énergie.",
        priorite: "haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Comprend le besoin de flexibilité spécifique pour certains pays stratégiques.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "FAVORABLE",
        justification: "Les canaux bilatéraux sont cruciaux pour signer et renouveler rapidement les contrats de fourniture d'énergie.",
        priorite: "très_haute",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "FAVORABLE",
        justification: "Accorde le délai nécessaire pour sécuriser les contrats d'approvisionnement en cours et adapter les cadres juridiques.",
        priorite: "haute",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Lobby",
    nom: "Banque et Finance",
    actor_id: "finance",
    role_europeen: "Représente les institutions bancaires et financières européennes, promouvant la stabilité monétaire, la sécurité des flux de capitaux et l'harmonisation des régulations financières mondiales.",
    enjeux_directive: [
      "Assurer une voix européenne forte et influente au sein des institutions financières mondiales (FMI, Banque mondiale, G20, BRI).",
      "Coordonner efficacement l'application des régimes de sanctions financières internationales pour garantir la sécurité juridique.",
      "Promouvoir le rôle international de l'euro et protéger le système financier européen contre les mesures extraterritoriales de pays tiers.",
      "Faciliter la diplomatie économique et les investissements transfrontaliers sécurisés."
    ],
    impacts_directive: [
      "Une représentation unique de l'UE au FMI et au G20 renforcera considérablement l'influence monétaire et financière européenne.",
      "La coordination diplomatique améliorera la prévisibilité juridique lors de l'application de sanctions économiques internationales."
    ],
    stratégie: "Le secteur bancaire et financier soutient activement l'élargissement de la représentation unique (2-5A) dans les enceintes financières multilatérales. Il valorise la solidarité diplomatique (2-5D) comme élément stabilisateur face aux chocs géopolitiques globaux, et appuie la formation diplomatique commune (2-5C) pour que les délégations européennes maîtrisent parfaitement les subtilités de la diplomatie financière et monétaire.",
    alliances: [
      "Allemagne (partage d'intérêts sur la stabilité financière et la discipline budgétaire)",
      "Parti Populaire Européen (défense de la compétitivité et de la sécurité des investissements)",
      "Renouveau Européen (soutien au rôle international de l'euro et à la représentation unie)",
      "Big Tech (coopération sur la sécurité des paiements internationaux et la fintech)"
    ],
    oppositions: [
      "Hongrie (méfiance face aux restrictions d'accès aux institutions financières internationales)",
      "Conservateurs et Réformistes (réserves sur la perte d'influence bilatérale des places financières nationales)"
    ],
    éléments_d_argumentaire: [
      "L'Union européenne représente la première puissance commerciale du monde : elle doit parler d'une seule voix forte au FMI et au G20.",
      "Une diplomatie financière unifiée permet de contrer efficacement l'extraterritorialité des législations de puissances rivales.",
      "Le mécanisme de solidarité diplomatique (2-5D) renforce la confiance des investisseurs internationaux dans la stabilité européenne.",
      "La bonne coordination des sanctions financières évite les failles de conformité et protège les banques européennes de risques légaux disproportionnés."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Pousser pour que la représentation unique s'étende prioritairement aux comités de Bâle et aux enceintes multilatérales de réglementation prudentielle.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Renforce l'influence de l'UE sur les politiques monétaires et financières globales (FMI, Banque mondiale, BRI).",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "La prévention des crises géopolitiques protège la stabilité des marchés financiers et évite la volatilité extrême.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE",
        justification: "Les diplomates de l'UE doivent être rigoureusement formés aux enjeux macrofinanciers et aux régimes de sanctions.",
        priorite: "haute",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Rassure les marchés et renforce la résilience économique collective des États membres.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Affaiblirait la voix européenne dans les enceintes multilatérales économiques stratégiques.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Préfère une cohérence globale pour éviter les distorsions de concurrence entre places financières.",
        priorite: "faible",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Une coordination européenne collective est indispensable pour peser face aux grands blocs financiers mondiaux.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "NEUTRE",
        justification: "Un délai d'adaptation technique est acceptable mais l'urgence des réformes financières internationales demeure.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Lobby",
    nom: "Agrochimie",
    actor_id: "agrochimie",
    role_europeen: "Représente les industries des intrants agricoles, de la protection des cultures et des biotechnologies exportatrices.",
    enjeux_directive: [
      "Défendre les intérêts exportateurs européens dans les négociations commerciales internationales et à l'OMC.",
      "Harmoniser les normes sanitaires et phytosanitaires (SPS) à l'international pour lever les barrières non tarifaires.",
      "Sécuriser les chaînes d'approvisionnement en matières premières agricoles et intrants sur les marchés mondiaux.",
      "Assurer une diplomatie commerciale proactive pour ouvrir de nouveaux marchés aux produits agroalimentaires européens."
    ],
    impacts_directive: [
      "Une diplomatie commerciale unifiée donnera plus de poids à l'Union dans les comités SPS et les différends commerciaux à l'OMC.",
      "Les missions diplomatiques conjointes faciliteront la promotion des normes de qualité et d'exportation européennes."
    ],
    stratégie: "Le secteur de l'agrochimie soutient l'élargissement de la représentation unique à l'OMC et à la FAO (2-5A) pour défendre avec force les standards européens et lutter contre le protectionnisme déguisé. Il accueille favorablement la solidarité diplomatique (2-5D) pour protéger les chaînes logistiques en cas de crise géopolitique, tout en appréciant la flexibilité bilatérale (2-5G) pour les accords phytosanitaires ciblés.",
    alliances: [
      "Italie (défense des exportations et reconnaissance des signes de qualité)",
      "Socialistes et Démocrates (accord sur la sécurité alimentaire mondiale et la prévention des crises)",
      "Pharmaceutique (synergies sur les normes biotechnologiques et la propriété intellectuelle)"
    ],
    oppositions: [
      "Hongrie (désaccord sur la limitation de l'action commerciale multilatérale)",
      "Verts/ALE (vigilance face aux exigences environnementales unilatérales dans les accords)"
    ],
    éléments_d_argumentaire: [
      "La diplomatie commerciale européenne unifiée est essentielle pour faire reconnaître nos normes à l'OMC face à la concurrence déloyale.",
      "L'accès sécurisé aux marchés internationaux et aux matières premières agricoles est une composante clé de la souveraineté alimentaire.",
      "La formation des diplomates (2-5C) doit inclure la maîtrise des barrières non tarifaires et des règles SPS internationales.",
      "Le mécanisme de solidarité diplomatique (2-5D) permet de riposter collectivement contre les embargos commerciaux injustifiés."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Encourager le SEAE à nommer des conseillers agricoles dans les représentations diplomatiques communes au sein des pays émergents clés.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Permet de défendre d'une seule voix forte les intérêts commerciaux et les normes SPS européennes à l'OMC et à la FAO.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "La stabilisation des zones rurales et des routes commerciales prévient les ruptures d'approvisionnement.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Soutient la formation à condition qu'elle intègre les compétences en négociation commerciale et scientifique.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Protège les exportations et les investissements européens face aux mesures de rétorsion ou sanctions arbitraires.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Affaiblirait l'Union dans les comités multilatéraux spécialisés en commerce et agriculture.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "Préfère un front uni pour éviter la concurrence entre exportateurs agricoles européens sur les marchés tiers.",
        priorite: "faible",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Utile pour des protocoles phytosanitaires bilatéraux spécifiques, mais complémentaire du multilatéralisme.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "NEUTRE",
        justification: "Ouvert à un calendrier progressif si cela garantit la stabilité des flux commerciaux.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Lobby",
    nom: "Pharmaceutique",
    actor_id: "pharma",
    role_europeen: "Représente les industries de santé, de biotechnologie et de recherche pharmaceutique innovante.",
    enjeux_directive: [
      "Renforcer la diplomatie sanitaire mondiale et la présence européenne au sein de l'Organisation mondiale de la santé (OMS).",
      "Défendre les droits de propriété intellectuelle (accords ADPIC/TRIPS) dans les traités et négociations internationales.",
      "Sécuriser les chaînes d'approvisionnement mondiales en principes actifs et biomédicaments face aux crises sanitaires.",
      "Promouvoir la reconnaissance mutuelle des autorisations de mise sur le marché et des bonnes pratiques de fabrication."
    ],
    impacts_directive: [
      "Une représentation unique à l'OMS et à l'OMC assurera une défense unifiée des standards d'innovation et de propriété intellectuelle.",
      "La solidarité diplomatique permettra une coordination rapide en cas de crise sanitaire transfrontalière majeure."
    ],
    stratégie: "Le secteur pharmaceutique soutient la représentation unique (2-5A) pour renforcer l'Europe dans la gouvernance sanitaire mondiale à l'OMS. Il valorise le mécanisme de solidarité diplomatique (2-5D) qui sécurise la logistique et l'acheminement des traitements en zone de crise, et soutient le fonds préventif (2-5B) pour anticiper les urgences épidémiques mondiales.",
    alliances: [
      "France (collaboration sur l'innovation thérapeutique et la diplomatie sanitaire)",
      "Renouveau Européen (soutien à la représentation unifiée à l'OMS et à l'OMC)",
      "Parti Populaire Européen (défense de la propriété intellectuelle et des investissements de recherche)",
      "Big Tech (coopération sur la santé numérique et les données biomédicales mondiales)"
    ],
    oppositions: [
      "Hongrie (crainte d'une marginalisation dans les instances sanitaires internationales)",
      "Gauche Unitaire (tensions sur les flexibilités des brevets et licences obligatoires)"
    ],
    éléments_d_argumentaire: [
      "La diplomatie sanitaire européenne doit parler d'une seule voix forte à l'OMS pour anticiper les futures pandémies mondiales.",
      "La défense de la propriété intellectuelle dans les traités internationaux est la condition indispensable pour financer la recherche biomédicale de pointe.",
      "Le mécanisme de solidarité diplomatique (2-5D) garantit la protection des corridors d'approvisionnement en médicaments essentiels en temps de crise.",
      "Les missions diplomatiques conjointes facilitent les accords de reconnaissance mutuelle réglementaire avec les grandes agences internationales (FDA, PMDA)."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "S'assurer que la représentation unique de l'UE à l'OMS et à l'OMC préserve fermement le cadre des brevets pharmaceutiques face aux demandes de dérogations excessives.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Renforce considérablement la position européenne à l'OMS, à l'OMC et à l'OMPI pour défendre l'innovation et les standards de santé.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "Permet d'intégrer la diplomatie sanitaire préventive et la détection précoce des menaces biologiques mondiales.",
        priorite: "haute",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Favorable si la formation intègre la gestion des crises sanitaires et les traités sur la propriété intellectuelle.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Crucial pour coordonner l'aide médicale d'urgence et sécuriser les chaînes d'approvisionnement en santé.",
        priorite: "très_haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Pourrait exclure les agences sanitaires et de propriété intellectuelle clés de l'action coordonnée européenne.",
        priorite: "haute",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "Privilégie un cadre réglementaire sanitaire unifié sans divisions entre États membres.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "NEUTRE",
        justification: "Ouvert aux coopérations bilatérales mais défend la primauté de la coordination européenne sur les normes mondiales.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "DEFAVORABLE",
        justification: "Les défis sanitaires mondiaux requièrent une coordination immédiate de l'UE sur la scène internationale.",
        priorite: "moyenne",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  },
  {
    type: "Lobby",
    nom: "Automobile",
    actor_id: "auto",
    role_europeen: "Représente les constructeurs automobiles et équipementiers européens, défendant le libre-échange, la réduction des barrières douanières et la sécurisation des chaînes de valeur mondiales.",
    enjeux_directive: [
      "Faciliter la conclusion d'accords commerciaux multilatéraux et bilatéraux pour ouvrir les marchés d'exportation de véhicules et pièces.",
      "Prévenir et lever les barrières tarifaires et non tarifaires pesant sur l'industrie automobile européenne dans le monde.",
      "Protéger les chaînes d'approvisionnement mondiales face aux tensions diplomatiques et risques d'embargos commerciaux.",
      "Harmoniser les normes techniques automobiles internationales dans le cadre de la CEE-ONU (Forum mondial WP.29)."
    ],
    impacts_directive: [
      "Une diplomatie commerciale unifiée donnera plus de poids à l'Union dans les négociations bilatérales avec les grandes puissances économiques.",
      "Les représentations diplomatiques conjointes faciliteront la résolution rapide des différends douaniers ou d'homologation technique."
    ],
    stratégie: "Le secteur automobile soutient résolument une voix européenne forte et unifiée pour négocier des accords de libre-échange ambitieux et faire tomber les barrières protectionnistes. Il appuie l'élargissement de la représentation unique (2-5A) dans les enceintes commerciales et de normalisation technique (CEE-ONU), et accueille favorablement la solidarité diplomatique (2-5D) pour protéger les chaînes logistiques en cas de crise extérieure.",
    alliances: [
      "Allemagne (défense de la compétitivité et des exportations industrielles mondiales)",
      "Parti Populaire Européen (appui au libre-échange fondé sur des règles et à la protection industrielle)",
      "Banque et Finance (soutien au financement des échanges internationaux)",
      "Big Tech (coopération sur les normes des véhicules autonomes et connectés)"
    ],
    oppositions: [
      "Hongrie (désaccord sur la limitation de l'action diplomatique commerciale)",
      "Conservateurs et Réformistes (crainte de positions frileuses sur les accords de libre-échange)"
    ],
    éléments_d_argumentaire: [
      "L'industrie automobile européenne emploie des millions de personnes et dépend directement de l'accès aux marchés mondiaux d'exportation.",
      "Une diplomatie européenne unifiée est indispensable pour résister aux mesures protectionnistes et guerres tarifaires des grands blocs concurrents.",
      "La présence conjointe dans les enceintes de normalisation mondiale (CEE-ONU) garantit que les standards européens de sécurité et d'émissions deviennent les standards mondiaux.",
      "Le mécanisme de solidarité diplomatique (2-5D) permet d'intervenir rapidement lors de blocages logistiques ou douaniers pénalisant les flux industriels."
    ],
    références: [
      "s2d5.json",
      "scenario2.json"
    ],
    notes_internes: "Inciter le SEAE à mobiliser son réseau pour faciliter l'accès des constructeurs européens aux matières premières critiques indispensables aux composants électroniques.",
    scenario_id: 2,
    directive_id: 5,
    actor_type: "lobby",
    generated_at: "2026-10-10T17:30:00.000000",
    version: "4.8",
    positions_amendements: [
      {
        amendement: "2-5A",
        titre: "Élargir la représentation unique à toutes les organisations internationales",
        position: "FAVORABLE",
        justification: "Renforce la capacité de l'UE à négocier des accords commerciaux ambitieux et à imposer ses normes techniques à l'échelle mondiale.",
        priorite: "très_haute",
        origine: "Renouveau Européen",
        description: "Élargir la représentation unique à toutes les organisations internationales"
      },
      {
        amendement: "2-5B",
        titre: "Créer un fonds européen pour la diplomatie préventive",
        position: "FAVORABLE",
        justification: "La stabilité internationale et la prévention des conflits sont indispensables à la fluidité des chaînes d'approvisionnement industrielles.",
        priorite: "moyenne",
        origine: "Socialistes & Démocrates",
        description: "Créer un fonds européen pour la diplomatie préventive"
      },
      {
        amendement: "2-5C",
        titre: "Conditionner la participation aux missions à la formation diplomatique commune",
        position: "FAVORABLE_CONDITIONNEL",
        justification: "Soutient la formation à condition qu'elle renforce les compétences des diplomates en diplomatie économique et industrielle.",
        priorite: "moyenne",
        origine: "Verts/ALE",
        description: "Conditionner la participation aux missions à la formation diplomatique commune"
      },
      {
        amendement: "2-5D",
        titre: "Instaurer un mécanisme de solidarité diplomatique en cas de crise",
        position: "FAVORABLE",
        justification: "Garantit un soutien diplomatique collectif d'urgence en cas de mesures discriminatoires ou d'embargos visant les exportations européennes.",
        priorite: "haute",
        origine: "Parti Populaire Européen",
        description: "Instaurer un mécanisme de solidarité diplomatique en cas de crise"
      },
      {
        amendement: "2-5E",
        titre: "Limiter la représentation unique à certaines organisations",
        position: "DEFAVORABLE",
        justification: "Une telle limitation affaiblirait l'impact de l'Europe dans les négociations commerciales et techniques multilatérales.",
        priorite: "moyenne",
        origine: "Hongrie",
        description: "Limiter la représentation unique à certaines organisations"
      },
      {
        amendement: "2-5F",
        titre: "Exclure certains États membres de la représentation unique",
        position: "DEFAVORABLE",
        justification: "L'industrie automobile européenne fonctionne comme une chaîne de valeur intégrée transfrontalière qui requiert une voix européenne unie.",
        priorite: "moyenne",
        origine: "France",
        description: "Exclure certains États membres de la représentation unique"
      },
      {
        amendement: "2-5G",
        titre: "Soutenir prioritairement la diplomatie bilatérale nationale",
        position: "DEFAVORABLE_PARTIEL",
        justification: "Préfère une négociation commerciale européenne collective, bien plus puissante face aux superpuissances.",
        priorite: "moyenne",
        origine: "Pologne",
        description: "Soutenir prioritairement la diplomatie bilatérale nationale"
      },
      {
        amendement: "2-5H",
        titre: "Reporter l’application de la directive de deux ans",
        position: "NEUTRE",
        justification: "Pragmatique sur le calendrier si cela permet de consolider les instruments de diplomatie économique.",
        priorite: "faible",
        origine: "Suède",
        description: "Reporter l’application de la directive de deux ans"
      }
    ]
  }
];

// -------------------------------------------------------------
// 6. Consolidated s2-d5.json
// -------------------------------------------------------------
// Helper to clean actor for consolidated embedding (removing individual metadata wrapper keys)
function cleanActor(actor) {
  const { actor_id, metadata, scenario_id, directive_id, actor_type, generated_at, version, ...rest } = actor;
  return rest;
}

const consolidatedS2D5 = {
  directive: {
    id: "2-5",
    title: "Coopération diplomatique européenne",
    description: "Missions diplomatiques communes et représentation unique. Instaurer une représentation unique de l’UE dans les organisations internationales et déployer des missions diplomatiques conjointes pour renforcer la voix de l’Union, améliorer la cohérence extérieure et promouvoir la paix et la stabilité.",
    commission: cleanActor(comS2D5),
    countries: couS2D5.map(cleanActor),
    parties: parS2D5.map(cleanActor),
    lobbies: lobS2D5.map(cleanActor)
  }
};

// -------------------------------------------------------------
// Write all files
// -------------------------------------------------------------
writeDual('directives/enjeux/s2/s2d5.json', s2d5Enjeux);
writeDual('directives/fiches-acteurs/s2/d5/com_s2-d5.json', comS2D5);
writeDual('directives/fiches-acteurs/s2/d5/cou_s2-d5.json', couS2D5);
writeDual('directives/fiches-acteurs/s2/d5/par_s2-d5.json', parS2D5);
writeDual('directives/fiches-acteurs/s2/d5/lob_s2-d5.json', lobS2D5);
writeDual('directives/fiches-acteurs/s2/d5/s2-d5.json', consolidatedS2D5);

console.log('Finished updating all S2 D5 files successfully.');
