import type { AppStoreState } from '../state/storeTypes';
import { COUNTRIES_META } from '../data/countries';
import { PARTIES_PROFILES } from '../data/parties';
import { LOBBIES_PROFILES } from '../data/lobbies';

export interface DynamicChartAnalysis {
  title: string;
  badge: string;
  summary: string;
  keyFigure: string;
  behindTheScenes: string;
  mechanisms: string[];
  studentTip: string;
}

export function analyzeChartContext(chartKey: string, state: AppStoreState): DynamicChartAnalysis {
  const sim = state.simulationResult;
  const isS1 = state.scenarioId === 1;
  const normalizedKey = chartKey.replace('Chart', '').toLowerCase();

  if (normalizedKey === 'eu') {
    const initSat = Math.round((sim.euSatisfaction[0] ?? 0.5) * 100);
    const finSat = Math.round((sim.euSatisfaction[9] ?? 0.5) * 100);
    const diff = finSat - initSat;
    const gainRef = sim.euNetGainVsReference !== undefined ? Math.round(sim.euNetGainVsReference * 100) : null;

    return {
      title: "Décryptage de la Trajectoire Européenne",
      badge: isS1 ? "Pacte Vert & Climat" : "Sécurité & Démocratie",
      summary: `Sur 10 ans, l'Union européenne passe d'une satisfaction de ${initSat}% à ${finSat}% (${diff >= 0 ? '+' : ''}${diff} points).`,
      keyFigure: gainRef !== null ? `Gain net face au statu quo : ${gainRef >= 0 ? '+' : ''}${gainRef}%` : `Score global : ${sim.euScoreSucces}/100`,
      behindTheScenes: isS1
        ? "La directive impulse une réduction du carbone et un soutien au bien-être. Les 6 pays pivots réagissent selon leurs capacités industrielles."
        : "La directive harmonise la réponse sécuritaire et l'État de droit. La confiance mutuelle stimule l'économie et le développement humain.",
      mechanisms: [
        "Chaque pays pèse selon sa démographie (l'Allemagne 31.7%, la France 24.3%, etc.).",
        "L'effet cumulé des actions stabilise les courbes après 2 à 3 ans de déploiement.",
        "Le score synthétique valorise l'équilibre entre toutes les dimensions, sans en sacrifier une."
      ],
      studentTip: diff < 0
        ? "⚠️ Attention : Les tensions sociales ou environnementales pèsent trop lourd. Tente d'ajouter un amendement compensateur !"
        : "✅ Belle trajectoire collective ! Regarde maintenant si un pays en particulier n'a pas été pénalisé."
    };
  }

  if (normalizedKey === 'country') {
    const cCode = state.selectedCountry;
    const cData = sim.countries[cCode];
    const cMeta = COUNTRIES_META[cCode];
    const initSat = Math.round((cData?.satisfaction[0] ?? 0.5) * 100);
    const finSat = Math.round((cData?.satisfaction[9] ?? 0.5) * 100);
    const netGain = cData?.netGainVsReference !== undefined ? Math.round(cData.netGainVsReference * 100) : 0;

    return {
      title: `Décryptage national : ${cMeta.name}`,
      badge: `${cMeta.population} millions d'habitants`,
      summary: `${cMeta.name} termine avec ${finSat}% de satisfaction (départ à ${initSat}%).`,
      keyFigure: `Gain net de la réforme : ${netGain >= 0 ? '+' : ''}${netGain} points`,
      behindTheScenes: `Chaque pays a son profil historique : la Pologne a beaucoup de charbon, la France son nucléaire, l'Allemagne une industrie puissante et l'Italie une dette vigilante.`,
      mechanisms: [
        `Taux de mise en œuvre national : le pays déploie les investissements avec son propre rythme administratif.`,
        `Sensibilités locales : si le VEB chute, la croissance nationale freine plus ou moins vite.`,
        `Le score national (${cData.scoreSucces}/100) récompense la progression et le résultat final.`
      ],
      studentTip: `Compare avec un autre pays (par exemple Suède vs Hongrie) pour comprendre pourquoi une même loi européenne ne produit pas le même effet partout !`
    };
  }

  if (normalizedKey === 'party') {
    const pCode = state.selectedParty;
    const pData = sim.parties[pCode];
    const pProf = PARTIES_PROFILES[pCode];
    const parlGroup = sim.parliament?.groups[pCode];
    const initMeps = parlGroup?.baseSeats ?? pData?.mepsArr[0] ?? 100;
    const finMeps = parlGroup?.currentSeats ?? pData?.mepsArr[9] ?? 100;
    const diffMeps = finMeps - initMeps;
    const dSign = diffMeps >= 0 ? '+' : '';
    const percent = parlGroup?.percent ?? Math.round((finMeps / 720) * 100);

    return {
      title: `Décryptage Parlementaire : ${pProf.nom}`,
      badge: `${pCode} — Hémicycle 720 sièges`,
      summary: `${pProf.nom} compte ${finMeps} sièges sur 720 (${percent}% de l'hémicycle), soit ${dSign}${diffMeps} sièges par rapport au point de départ (${initMeps} sièges).`,
      keyFigure: `Évolution : ${dSign}${diffMeps} sièges (Satisfaction : ${Math.round(pData?.satisfactionMoyenne ?? 50)}%)`,
      behindTheScenes: `Les députés européens sont réélus tous les 5 ans par les citoyens. L'algorithme calcule le transfert de voix vers les partis dont les priorités sont servies par les résultats économiques et sociaux.`,
      mechanisms: [
        `Priorités doctrinales : le climat pour les Verts, la croissance pour le PPE, le social et Gini pour S&D et La Gauche.`,
        `Règle des 720 sièges : la progression d'un groupe se fait proportionnellement au détriment de ceux dont les électeurs sont déçus.`,
        `Seuil critique de majorité : 361 sièges sur 720 pour faire adopter la directive.`
      ],
      studentTip: `Pour faire voter ta directive, tu as besoin d'une majorité absolue (361 voix sur 720). Aucun parti ne gouverne seul : forme une coalition pro-européenne ou de compromis !`
    };
  }

  // Lobby
  const lCode = state.selectedLobby;
  const lData = sim.lobbies[lCode];
  const lProf = LOBBIES_PROFILES[lCode];
  const finRep = Math.round(lData?.reputationArr[9] ?? 50);
  const finInfEtats = Math.round(lData?.infEtatsArr[9] ?? 30);

  return {
    title: `Décryptage d'Influence : ${lProf.nom}`,
    badge: `Secteur d'intérêt économique`,
    summary: `Réputation finale : ${finRep}/100. Influence auprès des capitales : ${finInfEtats}/100.`,
    keyFigure: `Score de réussite du secteur : ${lData.scoreDeReussite}/100`,
    behindTheScenes: `Un lobby ne vote pas, mais tente de convaincre les ministres et les eurodéputés d'amender les textes pour protéger ses intérêts.`,
    mechanisms: [
      `Lien réputation/influence : plus un secteur est apprécié de l'opinion, plus ses arguments sont écoutés.`,
      `Aléas et scandales : un problème d'image peut faire chuter brutalement la réputation de 25 points.`,
      `Rivalités sectorielles : les victoires des normes vertes réduisent le poids des lobbies fossiles.`
    ],
    studentTip: `Un lobby très puissant peut bloquer un accord au Conseil. Essaie de négocier des délais de transition pour apaiser les tensions !`
  };
}
