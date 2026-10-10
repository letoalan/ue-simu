/**
 * Textes et explications pédagogiques structurés pour les panneaux « Comprendre ce graphique ».
 */

export interface ChartPedagogy {
  title: string;
  whatItShows: string;
  unitDetails: string;
  mechanisms: string[];
  whyDifferences: string;
  limits: string;
}

export const CHART_PEDAGOGY: Record<string, ChartPedagogy> = {
  euChart: {
    title: "Comprendre le graphique de l'Union Européenne",
    whatItShows: "Ce graphique retrace l'évolution sur 10 ans des indicateurs stratégiques de l'ensemble de l'Union européenne.",
    unitDetails: "Chaque série utilise son unité propre (% pour la croissance, indice 0-1 pour Gini/V-Dem, t/hab pour le CO2, score 0-100 pour VEB/Normandie).",
    mechanisms: [
      "La directive et les amendements adoptés donnent l'impulsion de départ pour la politique commune.",
      "Chaque État membre réagit selon son tissu économique et ses sensibilités sectorielles.",
      "L'indicateur européen affiché est la résultante pondérée par la population des États membres représentatifs."
    ],
    whyDifferences: "La courbe européenne ne fluctue pas au hasard : elle est le miroir direct des efforts et des fragilités cumulés des pays.",
    limits: "Le modèle synthétise l'UE à partir des 6 États membres représentatifs couvrant les différents profils socio-économiques de l'Union."
  },
  countryChart: {
    title: "Comprendre le graphique national",
    whatItShows: "Ce graphique illustre la trajectoire spécifique de l'État membre sélectionné face aux orientations européennes.",
    unitDetails: "Un score de satisfaction national (0 à 100%) est calculé chaque année selon les priorités politiques du pays.",
    mechanisms: [
      "Chaque pays possède une matrice de sensibilité unique (ex: élasticité CO₂/croissance ou interdépendance sécurité/démocratie).",
      "Certains pays réagissent vite aux réformes vertes mais subissent des tensions de court terme sur le PIB ou le Gini.",
      "Le score de réussite final récompense l'atteinte d'un équilibre harmonieux entre croissance, équité et transition."
    ],
    whyDifferences: "Les pays industriels ou en rattrapage (ex: Pologne) ont des coûts d'adaptation plus élevés que les pays aux infrastructures déjà décarbonées (ex: Suède).",
    limits: "Les chocs extérieurs imprévus (guerres, pandémies) sont modélisés comme des micro-variations contrôlées."
  },
  partyChart: {
    title: "Comprendre le graphique des partis politiques européens",
    whatItShows: "Mesure la satisfaction des familles politiques au Parlement européen et l'évolution de leur poids électoral.",
    unitDetails: "Satisfaction en pourcentage (0-100%) et projection du nombre de sièges (MEPs) sur une base de réélection quinquennale.",
    mechanisms: [
      "Chaque groupe politique privilégie des indicateurs conformes à sa doctrine (ex: CO₂/VEB pour les Verts, PIB/Stabilité pour le PPE, Gini pour la Gauche).",
      "Une satisfaction élevée sur 5 ans entraîne un gain électoral lors du renouvellement du Parlement européen.",
      "Le score de victoire combine la satisfaction moyenne, les députés élus et les commissaires européens obtenus."
    ],
    whyDifferences: "Un compromis ambitieux sur le climat réjouit les Verts mais peut crisper les groupes conservateurs si la croissance faiblit.",
    limits: "Les dynamiques de politique nationale intérieure influencent les élections réelles mais sont ici centrées sur le bilan européen."
  },
  lobbyChart: {
    title: "Comprendre le graphique des groupes d'intérêt (Lobbies)",
    whatItShows: "Suit l'influence auprès du Conseil, du Parlement et de la Commission ainsi que la réputation publique de chaque lobby.",
    unitDetails: "Scores d'influence et de réputation gradués de 0 (nulle) à 100 (maximale).",
    mechanisms: [
      "La réputation d'un secteur progresse lorsque les indicateurs associés à son activité sont favorables.",
      "L'influence réelle est le produit de la capacité de persuasion et du coefficient de réputation sociétale.",
      "Des rivalités directes existent : la progression de normes écologiques fortes érode l'influence des énergies fossiles."
    ],
    whyDifferences: "Les secteurs fortement régulés ou perçus comme stratégiques disposent de relais d'influence différenciés selon les institutions.",
    limits: "Modèle stylisé représentant les grands équilibres d'influence sans intégrer les campagnes de lobbying opaques."
  }
};

// Alias de clés pour compatibilité
CHART_PEDAGOGY.eu = CHART_PEDAGOGY.euChart;
CHART_PEDAGOGY.country = CHART_PEDAGOGY.countryChart;
CHART_PEDAGOGY.party = CHART_PEDAGOGY.partyChart;
CHART_PEDAGOGY.lobby = CHART_PEDAGOGY.lobbyChart;

