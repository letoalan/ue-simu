import { describe, it, expect } from 'vitest';
import { EURO_MAP_CONFIG } from '../src/data/countryGeoData';
import { renderEuropeCountryMapHtml } from '../src/ui/actors/countryMap';
import type { CountryCode } from '../src/domain/types';

describe('European Locator Map & Illustrative Country Layers', () => {
  const codes: CountryCode[] = ['FR', 'DE', 'IT', 'PL', 'SE', 'HU'];

  it('fournit la configuration cartographique européenne pour les 6 pays membres', () => {
    expect(EURO_MAP_CONFIG.surroundingPaths.length).toBeGreaterThan(0);
    codes.forEach(code => {
      const paths = EURO_MAP_CONFIG.countriesPaths[code];
      expect(paths).toBeDefined();
      expect(paths.length).toBeGreaterThan(0);
      expect(EURO_MAP_CONFIG.capitals[code]).toBeDefined();
      expect(EURO_MAP_CONFIG.capitals[code].name).toBeTruthy();
    });
  });

  it('génère une carte SVG illustrative à l échelle européenne avec le layer du pays actif', () => {
    codes.forEach(code => {
      const html = renderEuropeCountryMapHtml(code);
      expect(html).toContain('<svg');
      expect(html).toContain('europe-locator-svg');
      expect(html).toContain('active-country-layer');
      expect(html).toContain(`Situation : <tspan fill="#60a5fa">${code}</tspan>`);

      // Vérifie l'absence absolue des 4 éléments techniques retirés
      expect(html).not.toContain('Emprise Nord / Sud');
      expect(html).not.toContain('Emprise Ouest / Est');
      expect(html).not.toContain('Capitale & Coordonnées');
      expect(html).not.toContain('Résolution Vectorielle');
    });
  });
});
