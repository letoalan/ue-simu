import type { AppStoreState } from '../state/storeTypes';
import { generateSchemaMacroEUHtml } from './schemas/schemaMacroEU';
import { generateSchemaParliamentHtml } from './schemas/schemaParliament';
import { generateSchemaCountryHtml } from './schemas/schemaCountry';
import { generateSchemaLobbiesHtml } from './schemas/schemaLobbies';

export function getChartExplanatorySchema(chartKey: string, state: AppStoreState): string {
  const normKey = chartKey.toLowerCase();

  if (normKey.includes('eu') || normKey.includes('macro')) {
    return generateSchemaMacroEUHtml(state);
  }
  if (normKey.includes('party') || normKey.includes('parlement') || normKey.includes('hemicycle')) {
    return generateSchemaParliamentHtml(state);
  }
  if (normKey.includes('country') || normKey.includes('pays')) {
    return generateSchemaCountryHtml(state);
  }
  if (normKey.includes('lobby') || normKey.includes('lobbies')) {
    return generateSchemaLobbiesHtml(state);
  }

  return generateSchemaMacroEUHtml(state);
}
