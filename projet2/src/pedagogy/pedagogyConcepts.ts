/**
 * Notions et didactique vulgarisée pour élèves de lycée général et professionnel.
 * Utilise des analogies de la vie quotidienne et l'arithmétique courante.
 */

export interface ConceptItem {
  id: string;
  nom: string;
  analogie: string;
  enClair: string;
  pourquoiImportant: string;
  unite: string;
}

export const DIDACTIC_CONCEPTS_S1: ConceptItem[] = [
  {
    id: 'croiss',
    nom: 'Croissance économique (PIB)',
    analogie: 'Le compteur de vitesse du train (et non la distance parcourue).',
    enClair: 'Mesure la vitesse à laquelle l’économie produit des richesses d’une année sur l’autre.',
    pourquoiImportant: 'Crée des emplois et finance les services publics, mais consomme des ressources si elle n’est pas verte.',
    unite: '% par an (cible : 1 à 3 %)'
  },
  {
    id: 'co2',
    nom: 'Émissions de CO₂ (Gaz à effet de serre)',
    analogie: 'La fumée d’un pot d’échappement par habitant.',
    enClair: 'Quantité de gaz rejetée dans l’atmosphère par chaque citoyen pour se déplacer, se chauffer et consommer.',
    pourquoiImportant: 'Le moteur du réchauffement climatique. L’UE vise la neutralité carbone à l’horizon 2050.',
    unite: 'tonnes par habitant et par an (cible : < 4 t)'
  },
  {
    id: 'veb',
    nom: 'Bien-être & Environnement (VEB)',
    analogie: 'La jauge de santé et de qualité de vie de la population.',
    enClair: 'Combine la surface de forêts protégées, la propreté de l’air et la santé des habitants.',
    pourquoiImportant: 'Une population en bonne santé et un cadre sain renforcent l’économie à long terme.',
    unite: 'Note sur 100 (cible : > 80/100)'
  },
  {
    id: 'gini',
    nom: 'Indice d’inégalités (Gini)',
    analogie: 'Le partage du gâteau : 0 = chacun a la même part exacte, 1 = une seule personne mange tout.',
    enClair: 'Mesure l’écart de revenus entre les plus riches et les plus modestes.',
    pourquoiImportant: 'Au-delà de 0.44 (44%), les tensions sociales et le sentiment d’injustice explosent.',
    unite: 'Indice de 0.20 à 0.60 (cible : < 0.30)'
  }
];

export const DIDACTIC_CONCEPTS_S2: ConceptItem[] = [
  {
    id: 'normandie',
    nom: 'Sécurité & Paix (Indice Normandie)',
    analogie: 'La solidité des remparts et des boucliers face aux tempêtes extérieures.',
    enClair: 'Évalue la capacité de l’Union à protéger ses frontières, son énergie et ses citoyens des crises.',
    pourquoiImportant: 'Sans sécurité et paix, impossible d’investir ou d’avoir une économie stable.',
    unite: 'Score de 0 à 100 (cible : > 80/100)'
  },
  {
    id: 'vdem',
    nom: 'Démocratie & Libertés (V-Dem)',
    analogie: 'Les règles équitables d’un match et la présence d’un arbitre indépendant.',
    enClair: 'Vérifie que la justice est indépendante, la presse libre et que les citoyens ont leur mot à dire.',
    pourquoiImportant: 'Protège contre l’arbitraire et garantit la confiance des partenaires.',
    unite: 'Indice de 0 à 1 (cible : > 0.85)'
  },
  {
    id: 'idh',
    nom: 'Développement humain (IDH)',
    analogie: 'Le carnet de santé global d’un pays : santé, éducation et niveau de vie décent.',
    enClair: 'Ne regarde pas seulement l’argent, mais si les gens vivent longtemps et ont accès à l’école.',
    pourquoiImportant: 'C’est la finalité humaine réelle de toute politique publique.',
    unite: 'Indice de 0 à 1 (cible : > 0.90)'
  }
];

export const DIDACTIC_RULES = [
  {
    titre: '1. La règle du paquebot (Inertie)',
    desc: 'Une loi européenne votée aujourd’hui prend 2 à 3 ans pour faire sentir ses pleins effets sur le terrain.'
  },
  {
    titre: '2. L’effet domino (Interactions)',
    desc: 'Agir sur le climat modifie le bien-être, qui modifie les inégalités, qui modifie la croissance. Tout est relié !'
  },
  {
    titre: '3. L’art du compromis (Évaluation)',
    desc: 'Personne ne gagne à 100%. Le meilleur score est celui qui protège l’avenir sans laisser personne de côté.'
  }
];
