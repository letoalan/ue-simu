import fs from 'fs';
import path from 'path';

const outDirs = [
  path.resolve(process.cwd(), 'public/json/finance'),
  path.resolve(process.cwd(), 'json/finance')
];

const indicators = {
  envelope: { nom: "Enveloppe globale du fonds", unite: "Mds €", description: "Volume total de mutualisation sur la période décennale" },
  contribution: { nom: "Contribution nationale", unite: "Mds €", description: "Versement de l'État membre au budget commun" },
  allocation: { nom: "Allocation reçue", unite: "Mds €", description: "Dotation perçue par l'État membre pour ses projets" },
  net_balance: { nom: "Solde financier net", unite: "Mds €", description: "Différence entre allocation reçue et contribution versée" },
  cofinancing_rate: { nom: "Taux de cofinancement", unite: "%", description: "Part des projets financée par le budget national" },
  coverage_rate: { nom: "Taux de couverture du besoin", unite: "%", description: "Part du besoin restant couverte par l'UE et le cofinancement" }
};

const tierDefinitions = {
  P1: { id: "P1", min: 0.0, max: 0.25, label: "Faible", description: "Effort ou dotation modeste, en deçà des ambitions moyennes" },
  P2: { id: "P2", min: 0.25, max: 0.50, label: "Modéré", description: "Niveau intermédiaire assurant un compromis réaliste" },
  P3: { id: "P3", min: 0.50, max: 0.75, label: "Élevé", description: "Engagement financier substantiel pour une accélération marquée" },
  P4: { id: "P4", min: 0.75, max: 1.0, label: "Très élevé", description: "Mobilisation maximale à la limite des capacités contributives" }
};

const manifest = {
  version: "1.0.0",
  currency: "Mds €",
  periodYears: 10,
  countries: ["DE", "FR", "IT", "PL", "SE", "HU"],
  parties: ["PPE", "SDE", "RENEW", "VERT", "ECR", "GUE"],
  lobbies: ["AUTO", "AGRI", "ENERG", "TECH", "FINA", "CHIM"],
  scenarios: {
    "1": { directives: [1, 2, 3, 4, 5, 6, 7, 8] },
    "2": { directives: [1, 2, 3, 4, 5, 6, 7, 8] }
  }
};

const directiveActionThemes = {
  s1: {
    1: ["Parcs éoliens & solaires", "R&D Hydrogène vert", "Réseaux électriques interconnectés", "Fonds de reconversion ouvrière"],
    2: ["Infrastructures Cloud & Data Centers", "Plan souveraineté IA européenne", "Numérisation des PME & formation", "Cybersécurité des réseaux"],
    3: ["Transition agroécologique & sols", "Modernisation des exploitations", "Rémunération des services écosystémiques", "Soutien jeunes agriculteurs"],
    4: ["Formation continue & reconversion", "Socle européen des droits sociaux", "Assurance chômage transfrontalière", "Santé et sécurité au travail"],
    5: ["Standardisation reporting extra-financier", "Audit et traçabilité carbone", "Accompagnement administratif PME", "Plateforme européenne ESG"],
    6: ["Robotique & usines intelligentes", "Recyclage des matières critiques", "Compétences ingénierie de pointe", "Efficacité énergétique industrielle"],
    7: ["Rénovation thermique globale", "Construction logements bas carbone", "Lutte contre la précarité énergétique", "Matériaux biosourcés"],
    8: ["Harmonisation fiscale des multinationales", "Taxation carbone aux frontières (MACF)", "Lutte contre l'évasion fiscale", "Budget européen autonome"]
  },
  s2: {
    1: ["Stockage stratégique gaz & H2", "Terminaux GNL & gazoducs réversibles", "Bouclier électrique résilient", "Achats groupés d'énergie"],
    2: ["Bouclier anti-aérien européen", "Interopérabilité des forces & blindés", "R&D drones & systèmes autonomes", "Cyber-défense militaire conjointe"],
    3: ["Surveillance intégrée des frontières", "Centres d'accueil aux normes humaines", "Aide aux pays de première ligne", "Voies d'immigration qualifiée"],
    4: ["Réserves céréalières stratégiques", "Autonomie en engrais & protéines", "Protection des terres agricoles", "Résilience face aux sécheresses"],
    5: ["Corps diplomatique européen unifié", "Fonds d'urgence crise extérieure", "Partenariats stratégiques mondiaux", "Contre-mesures sanctions"],
    6: ["Police judiciaire conjointe", "Équipes d'enquête transfrontalières", "Lutte contre le trafic d'armes", "Sécurisation des infrastructures critiques"],
    7: ["Bourses étudiantes & mobilité Erasmus+", "Plateforme numérique du patrimoine", "Protection de la liberté académique", "Résilience face à la désinformation"],
    8: ["Cloud souverain sécurisé UE", "Semi-conducteurs & puces de défense", "Protection des câbles sous-marins", "Audit des technologies critiques"]
  }
};

function writeJson(relPath, data) {
  for (const base of outDirs) {
    const fullPath = path.join(base, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// 1. Shared files
writeJson('manifest.json', manifest);
writeJson('shared/indicators.json', indicators);
writeJson('shared/tier-definitions.json', tierDefinitions);

// 2. Directives s1 & s2
for (const s of [1, 2]) {
  const sKey = `s${s}`;
  for (let d = 1; d <= 8; d++) {
    const dKey = `d${d}`;
    const themes = directiveActionThemes[sKey][d];
    const baseEnvelope = 40 + d * 5 + s * 10;
    const actions = themes.map((themeName, idx) => {
      const q = { DE: 12 + idx * 2, FR: 10 + idx * 2, IT: 9 + idx, PL: 8 + idx, SE: 4 + idx, HU: 3 + idx };
      const uCost = 0.5 + idx * 0.3;
      const fCost = 1.0 + idx * 0.5;
      const cTot = {};
      let gTot = 0;
      for (const [c, count] of Object.entries(q)) {
        const cost = Math.round((count * uCost + fCost * (c === 'DE' || c === 'FR' ? 1.5 : 1.0)) * 10) / 10;
        cTot[c] = cost;
        gTot += cost;
      }
      return {
        id: `act-${s}-${d}-${idx + 1}`,
        nom: themeName,
        categorie: idx === 0 ? 'infrastructure' : idx === 1 ? 'r_d' : idx === 2 ? 'equipement' : 'accompagnement',
        coutUnitaire: uCost,
        coutFixe: fCost,
        quantiteParPays: q,
        coutTotalParPays: cTot,
        coutTotalGlobal: Math.round(gTot * 10) / 10,
        source: "Évaluation préliminaire conjointe Commission-États membres"
      };
    });

    const coutTotalGlobal = actions.reduce((sum, a) => sum + a.coutTotalGlobal, 0);
    const moyensNationauxRef = { DE: 18 + d, FR: 14 + d, IT: 10 + d, PL: 6 + d, SE: 5 + d, HU: 3 + d };
    const besoinRestant = {};
    let besoinRestantTotal = 0;
    for (const [c, mRef] of Object.entries(moyensNationauxRef)) {
      const need = actions.reduce((sum, a) => sum + a.coutTotalParPays[c], 0);
      const rem = Math.max(0, Math.round((need - mRef) * 10) / 10);
      besoinRestant[c] = rem;
      besoinRestantTotal += rem;
    }

    const evaluation = {
      directiveId: d,
      scenarioId: s,
      actions,
      coutTotalGlobal: Math.round(coutTotalGlobal * 10) / 10,
      moyensNationauxRef,
      besoinRestant,
      besoinRestantTotal: Math.round(besoinRestantTotal * 10) / 10,
      propositionReference: {
        enveloppeProposee: Math.round(besoinRestantTotal * 0.65),
        reservePourcentage: 0.05,
        tauxCofinancementDefaut: 0.25,
        cleContributionDefaut: "pib",
        cleAllocationDefaut: "besoins"
      },
      bornes: {
        enveloppeMin: Math.round(besoinRestantTotal * 0.30),
        enveloppeMax: Math.round(besoinRestantTotal * 1.05),
        cofinancementMin: 0.15,
        cofinancementMax: 0.40
      }
    };

    const commission = {
      directiveId: d,
      scenarioId: s,
      propositionInitiale: `Enveloppe cible de ${evaluation.propositionReference.enveloppeProposee} Mds € garantissant 65% de couverture du besoin restant.`,
      justification: "Compromis équilibré entre discipline budgétaire des contributeurs nets et convergence solidaire des pays de l'Est et du Sud.",
      tiersAnalysis: {
        P1: { position: "Insuffisant", argument: "Risque de retard critique dans les investissements stratégiques." },
        P2: { position: "Acceptable a minima", argument: "Permet les projets pilotes mais freine le déploiement de masse." },
        P3: { position: "Optimal (Recommandé)", argument: "Atteint le seuil d'efficacité sans déstabiliser les budgets nationaux." },
        P4: { position: "Risqué", argument: "Risque de surchauffe et refus catégorique des pays frugaux." }
      }
    };

    const countries = {
      DE: { mandat: "Frugal vigilant", prefContribution: "population", prefAllocation: "besoins", accepteP4: false },
      FR: { mandat: "Moteur d'intégration", prefContribution: "pib", prefAllocation: "besoins", accepteP4: true },
      IT: { mandat: "Bénéficiaire en relance", prefContribution: "pib", prefAllocation: "convergence", accepteP4: true },
      PL: { mandat: "Convergence prioritaire", prefContribution: "pib", prefAllocation: "convergence", accepteP4: true },
      SE: { mandat: "Discipline budgétaire", prefContribution: "population", prefAllocation: "besoins", accepteP4: false },
      HU: { mandat: "Soutien territorial sans contrainte", prefContribution: "pib", prefAllocation: "convergence", accepteP4: true }
    };

    const parties = {
      PPE: { souhaite: "P2-P3", priorite: "Investissements productifs et cofinancement exigeant" },
      SDE: { souhaite: "P3-P4", priorite: "Solidarité sociale et compensation territoriale" },
      RENEW: { souhaite: "P3", priorite: "Efficacité du marché unique et technologies d'avenir" },
      VERT: { souhaite: "P4", priorite: "Accélération maximale sans compromis carbone" },
      ECR: { souhaite: "P1-P2", priorite: "Respect strict des souverainetés nationales et budget minimal" },
      GUE: { souhaite: "P4", priorite: "Service public européen et égalité régionale" }
    };

    const lobbies = {
      AUTO: { interet: "Soutien à la reconversion industrielle et aides à la transition" },
      AGRI: { interet: "Maintien des aides directes et subventions sans charges administratives" },
      ENERG: { interet: "Garanties d'emprunt pour les infrastructures lourdes" },
      TECH: { interet: "Marché unique numérique et investissements R&D d'excellence" },
      FINA: { interet: "Stabilité monétaire et opportunités de co-investissements publics-privés" },
      CHIM: { interet: "Calendrier réaliste évitant la perte de compétitivité" }
    };

    writeJson(`${sKey}/${dKey}/evaluation.json`, evaluation);
    writeJson(`${sKey}/${dKey}/commission.json`, commission);
    writeJson(`${sKey}/${dKey}/countries.json`, countries);
    writeJson(`${sKey}/${dKey}/parties.json`, parties);
    writeJson(`${sKey}/${dKey}/lobbies.json`, lobbies);
  }
}

console.log('Fichiers JSON financiers générés avec succès pour les 16 directives !');
