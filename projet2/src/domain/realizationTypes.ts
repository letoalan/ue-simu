import type { CountryCode } from './types';

/**
 * Conditions de réalisation annuelle d'une action ou instrument de politique publique.
 * Prépare l'interface interne de la Phase A sans dépendance aux flux monétaires de la Phase B.
 */
export interface ActionRealization {
  country: CountryCode;
  actionKey: string;
  year: number; // Index 0..9 (correspondant à 2025..2034)
  realizationRate: number; // Taux de réalisation effectif [0.0, 1.0]
  delayYears: number; // Délai d'inertie / retard de démarrage (en années)
  maintenanceRate: number; // Entretien de l'acquis et pérennité [0.0, 1.0]
  sourceVersion: string; // Origine / version des hypothèses
}

/**
 * Contrat du fournisseur de conditions de réalisation.
 * En Phase A, le fournisseur de référence utilise les conventions nationales standard.
 * En Phase B, un fournisseur financier pourra enrichir ce contrat sans altérer le moteur.
 */
export interface ImplementationProvider {
  readonly name: string;
  readonly version: string;
  getRealization(country: CountryCode, actionKey: string, year: number): ActionRealization;
}
