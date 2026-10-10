/**
 * Dictionnaire exhaustif des indicateurs, unités, domaines de valeur et objectifs.
 */

export interface IndicatorMeta {
  key: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  invertScore?: boolean; // Vrai si une valeur plus basse est meilleure (ex: CO2, Gini)
  description: string;
  pedagogicalTip: string;
}

export const SCENARIO_1_INDICATORS: Record<string, IndicatorMeta> = {
  pib: {
    key: 'pib',
    name: 'Croissance du PIB',
    unit: '%',
    min: 0,
    max: 4,
    step: 0.1,
    description: "Taux de croissance annuel de l'activité économique marchande.",
    pedagogicalTip: "Une forte croissance stimule l'emploi mais tend à accélérer la consommation de ressources et les émissions sans régulation."
  },
  gini: {
    key: 'gini',
    name: 'Indice d’inégalités (Gini)',
    unit: 'indice (0-1)',
    min: 0.20,
    max: 0.60,
    step: 0.01,
    invertScore: true,
    description: "Mesure de la dispersion des revenus. 0 représente l'égalité absolue, 1 l'inégalité totale.",
    pedagogicalTip: "Un indice plus bas indique une meilleure justice redistributive et une cohésion sociale renforcée."
  },
  co2: {
    key: 'co2',
    name: 'Émissions de CO₂',
    unit: 't/hab/an',
    min: 2,
    max: 10,
    step: 0.1,
    invertScore: true,
    description: "Intensité des émissions de gaz à effet de serre par habitant.",
    pedagogicalTip: "La réduction des émissions constitue le cœur de la décarbonation européenne et de l'Accord de Paris."
  },
  veb: {
    key: 'veb',
    name: 'Bien-être & Végétalisation (VEB)',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    description: "Indice composite combinant végétalisation, espaces protégés et santé environnementale.",
    pedagogicalTip: "Une note élevée protège la biodiversité et améliore directement le cadre de vie et la santé publique."
  }
};

export const SCENARIO_2_INDICATORS: Record<string, IndicatorMeta> = {
  normandie: {
    key: 'normandie',
    name: 'Indice Normandie (Sécurité)',
    unit: 'score (0-100)',
    min: 0,
    max: 100,
    step: 1,
    description: "Indice mesurant le niveau de paix, de résilience et de sécurité stratégique face aux menaces extérieures.",
    pedagogicalTip: "Plus l'indice est haut, plus l'Union et ses États membres sont stables et protégés des chocs géopolitiques."
  },
  vdem: {
    key: 'vdem',
    name: 'État de droit & Démocratie (V-Dem)',
    unit: 'indice (0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    description: "Indice évaluant la robustesse des contre-pouvoirs, la liberté de la presse et l'indépendance de la justice.",
    pedagogicalTip: "Garantit les droits fondamentaux et prévient les dérives autoritaires au sein des institutions."
  },
  pib: {
    key: 'pib',
    name: 'Croissance économique',
    unit: '%',
    min: -2,
    max: 4,
    step: 0.1,
    description: "Dynamique d'activité économique en contexte de tensions géopolitiques.",
    pedagogicalTip: "Permet de financer la défense et l'autonomie stratégique tout en maintenant le niveau de vie."
  },
  idh: {
    key: 'idh',
    name: 'Développement humain (IDH)',
    unit: 'indice (0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    description: "Indice composite mesurant la santé/espérance de vie, le niveau d'éducation et le niveau de vie décent.",
    pedagogicalTip: "Indicateur universel d'émancipation humaine et de progrès socio-économique réel."
  }
};

/**
 * Normalise une valeur numérique entre 0 et 1 selon ses bornes min/max.
 */
export function normalizeValue(val: number, min: number, max: number): number {
  if (max === min) return 0.5;
  const clamped = Math.max(min, Math.min(max, val));
  return (clamped - min) / (max - min);
}

export const INDICATORS_META: Record<string, IndicatorMeta> = {
  ...SCENARIO_1_INDICATORS,
  ...SCENARIO_2_INDICATORS,
  pib_eu: SCENARIO_1_INDICATORS.pib,
  gini_eu: SCENARIO_1_INDICATORS.gini,
  co2_eu: SCENARIO_1_INDICATORS.co2,
  veb_eu: SCENARIO_1_INDICATORS.veb,
  normandie_eu: SCENARIO_2_INDICATORS.normandie,
  vdem_eu: SCENARIO_2_INDICATORS.vdem,
  pib_growth_eu: SCENARIO_2_INDICATORS.pib,
  idh_eu: SCENARIO_2_INDICATORS.idh
};
