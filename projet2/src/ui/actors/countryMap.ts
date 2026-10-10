import type { CountryCode } from '../../domain/types';
import { EURO_MAP_CONFIG } from '../../data/countryGeoData';

const COUNTRY_NAMES: Record<CountryCode, string> = {
  FR: 'France',
  DE: 'Allemagne',
  IT: 'Italie',
  PL: 'Pologne',
  SE: 'Suède',
  HU: 'Hongrie'
};

/**
 * Génère le fragment SVG illustratif de l'Europe avec le pays ciblé en couche (layer) active.
 * Cet élément est purement illustratif, au même titre que le drapeau national.
 */
export function renderEuropeCountryMapHtml(
  countryCode: CountryCode,
  options: { compact?: boolean } = { compact: true }
): string {
  const { viewBox, width, height, surroundingPaths, capitals, countriesPaths } = EURO_MAP_CONFIG;
  const activePaths = countriesPaths[countryCode] || [];
  const activeCap = capitals[countryCode];
  const countryName = COUNTRY_NAMES[countryCode] || countryCode;

  // Tracés des 5 autres pays membres partenaires (contexte européen)
  const otherCountries = (Object.keys(countriesPaths) as CountryCode[])
    .filter(c => c !== countryCode)
    .map(c => ({
      code: c,
      paths: countriesPaths[c] || []
    }));

  return `
    <svg
      viewBox="${viewBox}"
      class="europe-locator-svg"
      style="width:100%; height:100%; display:block; user-select:none; background:#070d1e;"
      role="img"
      aria-label="Situation de ${countryName} au sein de l'Union européenne"
    >
      <defs>
        <!-- Dégradé océanique de fond -->
        <linearGradient id="euroSeaGrad_${countryCode}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#070d1e" />
          <stop offset="60%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#070d1e" />
        </linearGradient>

        <!-- Dégradé lumineux pour le layer du pays actif -->
        <linearGradient id="activeCountryGrad_${countryCode}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="40%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>

        <!-- Lueur douce pour faire ressortir le pays actif au sein de l'Europe -->
        <filter id="countryGlow_${countryCode}" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.6" />
        </filter>
      </defs>

      <!-- Fond océanique européen -->
      <rect width="${width}" height="${height}" fill="url(#euroSeaGrad_${countryCode})" />

      <!-- Méridiens et parallèles discrets -->
      <g stroke="#334155" stroke-dasharray="2,3" stroke-width="0.5" opacity="0.35">
        <line x1="15" y1="130" x2="${width - 15}" y2="130" />
        <line x1="15" y1="230" x2="${width - 15}" y2="230" />
        <line x1="15" y1="330" x2="${width - 15}" y2="330" />
        <line x1="100" y1="15" x2="100" y2="${height - 15}" />
        <line x1="200" y1="15" x2="200" y2="${height - 15}" />
        <line x1="300" y1="15" x2="300" y2="${height - 15}" />
      </g>

      <!-- Silhouette du continent européen (Ibéries, Grande-Bretagne, Norvège, Balkans) -->
      <g class="surrounding-europe" fill="#141f36" stroke="#1e293b" stroke-width="0.7" opacity="0.7">
        ${surroundingPaths.map(d => `<path d="${d}" />`).join('\n        ')}
      </g>

      <!-- Autres pays membres partenaires de l'UE (contexte d'alliance) -->
      <g class="partner-countries" fill="#1e293b" stroke="#334155" stroke-width="0.8" opacity="0.85">
        ${otherCountries.flatMap(oc => oc.paths).map(d => `<path d="${d}" />`).join('\n        ')}
      </g>

      <!-- COUCHE DU PAYS ACTIF (générée fidèlement depuis ses coordonnées GeoJSON) -->
      <g class="active-country-layer" filter="url(#countryGlow_${countryCode})">
        ${activePaths.map(d => `
          <path
            d="${d}"
            fill="url(#activeCountryGrad_${countryCode})"
            stroke="#93c5fd"
            stroke-width="1.8"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        `).join('\n        ')}
      </g>

      ${activeCap ? `
        <!-- Repère illustratif de la capitale -->
        <g class="capital-marker">
          <circle cx="${activeCap.x}" cy="${activeCap.y}" r="6" fill="#fbbf24" opacity="0.3">
            <animate attributeName="r" values="5;9;5" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${activeCap.x}" cy="${activeCap.y}" r="3.2" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
          ${!options.compact ? `
            <rect x="${activeCap.x + 5}" y="${activeCap.y - 8}" width="${activeCap.name.length * 6.5 + 10}" height="14" rx="3" fill="#0f172a" fill-opacity="0.88" stroke="#475569" stroke-width="0.6" />
            <text x="${activeCap.x + 9}" y="${activeCap.y + 2}" fill="#f8fafc" font-size="8.5" font-weight="700" font-family="Inter, system-ui, sans-serif">★ ${activeCap.name}</text>
          ` : ''}
        </g>
      ` : ''}

      <!-- Badge discret d'identification européenne -->
      <g transform="translate(10, 10)">
        <rect width="${options.compact ? 100 : 140}" height="18" rx="4" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="0.8" />
        <text x="6" y="12.5" fill="#f8fafc" font-size="${options.compact ? 8 : 9}" font-weight="700" font-family="Inter, system-ui, sans-serif">
          🇪🇺 Situation : <tspan fill="#60a5fa">${countryCode}</tspan>
        </text>
      </g>
    </svg>
  `;
}

/**
 * Attache les interactions légères (survol, zoom modal optionnel) sur la carte illustrative
 */
export function attachCountryMapEvents(container: HTMLElement, _countryCode: CountryCode): void {
  const thumb = container.querySelector('.actor-europe-map-thumb') as HTMLElement | null;
  if (!thumb) return;

  thumb.addEventListener('mouseenter', () => {
    thumb.style.transform = 'scale(1.04)';
    thumb.style.boxShadow = '0 6px 14px rgba(2, 132, 199, 0.25)';
  });

  thumb.addEventListener('mouseleave', () => {
    thumb.style.transform = 'scale(1)';
    thumb.style.boxShadow = 'var(--shadow-sm)';
  });
}
