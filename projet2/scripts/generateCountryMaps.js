import fs from 'fs';
import path from 'path';

const CAPITALS = {
  FR: { name: 'Paris', lon: 2.3522, lat: 48.8566 },
  DE: { name: 'Berlin', lon: 13.4050, lat: 52.5200 },
  IT: { name: 'Rome', lon: 12.4964, lat: 41.9028 },
  PL: { name: 'Varsovie', lon: 21.0122, lat: 52.2297 },
  SE: { name: 'Stockholm', lon: 18.0686, lat: 59.3293 },
  HU: { name: 'Budapest', lon: 19.0402, lat: 47.4979 }
};

const FILES = {
  FR: { file: 'france.json', name: 'France' },
  DE: { file: 'allemagne.json', name: 'Allemagne' },
  IT: { file: 'italie.json', name: 'Italie' },
  PL: { file: 'pologne.json', name: 'Pologne' },
  SE: { file: 'suede.json', name: 'Suède' },
  HU: { file: 'hongrie.json', name: 'Hongrie' }
};

function project([lon, lat]) {
  const rad = Math.PI / 180;
  const x = lon * rad;
  const latRad = Math.max(-85, Math.min(85, lat)) * rad;
  const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return [x, y];
}

// Emprise européenne globale pour la carte de situation
const euroMinLon = -11.0;
const euroMaxLon = 27.5;
const euroMinLat = 34.5;
const euroMaxLat = 70.5;

const [pMinX, pMinY] = project([euroMinLon, euroMinLat]);
const [pMaxX, pMaxY] = project([euroMaxLon, euroMaxLat]);

const width = 360;
const height = 440;
const padding = 12;

const rangeX = pMaxX - pMinX;
const rangeY = pMaxY - pMinY;
const scale = Math.min((width - 2 * padding) / rangeX, (height - 2 * padding) / rangeY);
const offsetX = padding + ((width - 2 * padding) - rangeX * scale) / 2;
const offsetY = padding + ((height - 2 * padding) - rangeY * scale) / 2;

function toScreen([lon, lat]) {
  const [px, py] = project([lon, lat]);
  const sx = offsetX + (px - pMinX) * scale;
  const sy = height - (offsetY + (py - pMinY) * scale);
  return [Number(sx.toFixed(1)), Number(sy.toFixed(1))];
}

// Silhouettes des terres continentales européennes voisines pour situer l'ensemble
const surroundingLands = [
  // Péninsule ibérique (Espagne / Portugal)
  [ [-9.5, 37.0], [-9.0, 43.0], [-1.8, 43.4], [-3.0, 43.0], [3.2, 42.4], [0.0, 40.0], [-0.5, 38.0], [-2.0, 36.7], [-5.4, 36.0], [-6.5, 36.5], [-9.0, 37.0] ],
  // Îles britanniques (Grande-Bretagne)
  [ [-5.5, 50.0], [-4.0, 50.3], [1.4, 51.1], [1.8, 52.5], [0.2, 53.5], [-1.5, 55.5], [-2.0, 57.5], [-3.5, 58.6], [-5.0, 58.0], [-6.0, 56.5], [-4.5, 54.5], [-4.5, 52.5], [-5.0, 51.5] ],
  // Irlande
  [ [-10.5, 51.5], [-6.0, 52.2], [-5.5, 54.0], [-6.5, 55.3], [-10.0, 54.2], [-10.5, 52.0] ],
  // Norvège
  [ [5.0, 58.0], [10.0, 59.0], [12.0, 64.0], [14.0, 68.0], [24.0, 71.0], [31.0, 70.4], [28.0, 69.5], [20.0, 68.5], [12.0, 63.0], [7.0, 62.0], [5.0, 60.0] ],
  // Balkans & Grèce
  [ [14.0, 45.0], [19.0, 42.0], [20.0, 39.5], [22.0, 37.0], [24.0, 38.0], [24.0, 40.5], [26.0, 40.0], [28.0, 42.0], [29.5, 45.0], [24.0, 45.0], [20.0, 45.0] ]
];

const surroundingPaths = surroundingLands.map(ring => {
  return 'M ' + ring.map(pt => toScreen(pt).join(',')).join(' L ') + ' Z';
});

export function generateAllCountryMaps() {
  const p2Public = path.resolve('projet2/public');
  const paysDir = path.join(p2Public, 'json/directives/fiches-acteurs/pays');
  const outMapsDir = path.join(p2Public, 'medias/images/maps');
  const p2MirrorDir = path.resolve('projet2/medias/images/maps');
  const p1MapsDir = path.resolve('projet1/medias/images/maps');

  fs.mkdirSync(outMapsDir, { recursive: true });
  fs.mkdirSync(p2MirrorDir, { recursive: true });
  fs.mkdirSync(p1MapsDir, { recursive: true });

  // 1. Charger et projeter les tracés de tous les 6 pays sur la même carte d'Europe
  const allCountriesSvgPaths = {};
  const countryMetadata = {};

  for (const [code, { file, name }] of Object.entries(FILES)) {
    const filePath = path.join(paysDir, file);
    if (!fs.existsSync(filePath)) continue;

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const svgPaths = [];

    raw.features.forEach(f => {
      const geom = f.geometry;
      const renderRing = (ring) => {
        if (ring.length < 3) return '';
        return 'M ' + ring.map(pt => toScreen(pt).join(',')).join(' L ') + ' Z';
      };

      if (geom.type === 'Polygon') {
        const d = geom.coordinates.map(renderRing).join(' ');
        if (d.trim()) svgPaths.push(d);
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(poly => {
          const d = poly.map(renderRing).join(' ');
          if (d.trim()) svgPaths.push(d);
        });
      }
    });

    const cap = CAPITALS[code];
    const capPos = toScreen([cap.lon, cap.lat]);

    allCountriesSvgPaths[code] = svgPaths;
    countryMetadata[code] = {
      code,
      name,
      capital: { name: cap.name, lon: cap.lon, lat: cap.lat, x: capPos[0], y: capPos[1] }
    };
  }

  // 2. Générer chaque SVG à l'échelle européenne avec le pays ciblé en layer mis en valeur
  for (const [code, { file, name }] of Object.entries(FILES)) {
    const activeCap = countryMetadata[code].capital;

    // Contexte : autres 5 pays en layer discret d'arrière-plan
    const otherCountriesPaths = Object.entries(allCountriesSvgPaths)
      .filter(([c]) => c !== code)
      .flatMap(([, paths]) => paths);

    const activeCountryPaths = allCountriesSvgPaths[code] || [];

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <!-- Dégradé océanique européen -->
    <linearGradient id="euroOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070d1e" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#070d1e" />
    </linearGradient>

    <!-- Dégradé pour le pays actif -->
    <linearGradient id="activeCountryGrad_${code}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <!-- Ombre portée lumineuse pour faire ressortir le pays actif -->
    <filter id="activeCountryGlow_${code}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Fond océanique européen -->
  <rect width="${width}" height="${height}" rx="12" fill="url(#euroOceanGrad)" stroke="#1e293b" stroke-width="1.5" />

  <!-- Quadrillage discret de méridiens et parallèles -->
  <g class="euro-grid" stroke="#334155" stroke-dasharray="2,3" stroke-width="0.6" opacity="0.4">
    <line x1="15" y1="130" x2="${width - 15}" y2="130" />
    <line x1="15" y1="230" x2="${width - 15}" y2="230" />
    <line x1="15" y1="330" x2="${width - 15}" y2="330" />
    <line x1="100" y1="15" x2="100" y2="${height - 15}" />
    <line x1="200" y1="15" x2="200" y2="${height - 15}" />
    <line x1="300" y1="15" x2="300" y2="${height - 15}" />
  </g>

  <!-- Terres européennes voisines (Ibéries, Grande-Bretagne, Norvège, Balkans) -->
  <g class="surrounding-europe" fill="#131e33" stroke="#1e293b" stroke-width="0.8" opacity="0.75">
    ${surroundingPaths.map(d => `<path d="${d}" />`).join('\n    ')}
  </g>

  <!-- Autres États membres partenaires de la simulation (contexte UE) -->
  <g class="partner-countries" fill="#1e293b" stroke="#334155" stroke-width="0.9" opacity="0.85">
    ${otherCountriesPaths.map(d => `<path d="${d}" />`).join('\n    ')}
  </g>

  <!-- LAYER DU PAYS SÉLECTIONNÉ : Tracé exact et surbrillance -->
  <g class="active-country-layer" filter="url(#activeCountryGlow_${code})">
    ${activeCountryPaths.map(d => `
      <path
        d="${d}"
        fill="url(#activeCountryGrad_${code})"
        stroke="#93c5fd"
        stroke-width="1.6"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    `).join('\n    ')}
  </g>

  <!-- Repère de la capitale nationale -->
  <g class="capital-pin">
    <circle cx="${activeCap.x}" cy="${activeCap.y}" r="6.5" fill="#fbbf24" opacity="0.3" />
    <circle cx="${activeCap.x}" cy="${activeCap.y}" r="3.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2" />
    <rect x="${activeCap.x + 6}" y="${activeCap.y - 9}" width="${activeCap.name.length * 6.8 + 12}" height="15" rx="3" fill="#0f172a" fill-opacity="0.9" stroke="#475569" stroke-width="0.7" />
    <text x="${activeCap.x + 11}" y="${activeCap.y + 2}" fill="#f8fafc" font-size="9" font-weight="700" font-family="Inter, system-ui, sans-serif">★ ${activeCap.name}</text>
  </g>

  <!-- Badge d'identification illustratif -->
  <g transform="translate(14, 14)">
    <rect width="165" height="26" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#334155" stroke-width="0.9" />
    <text x="8" y="17" fill="#f8fafc" font-size="10.5" font-weight="700" font-family="Inter, system-ui, sans-serif">🇪🇺 Union Européenne · <tspan fill="#60a5fa">${name}</tspan></text>
  </g>

  <!-- Boussole Nord discrète -->
  <g transform="translate(${width - 24}, 25)">
    <polygon points="0,-8 3,0 0,-1 -3,0" fill="#ef4444" />
    <polygon points="0,7 3,0 0,-1 -3,0" fill="#64748b" />
    <text x="0" y="-10" text-anchor="middle" fill="#ef4444" font-size="7.5" font-weight="800" font-family="Inter, system-ui, sans-serif">N</text>
  </g>
</svg>
`;

    const svgFileName = `${file.replace('.json', '')}.svg`;
    fs.writeFileSync(path.join(outMapsDir, svgFileName), svgContent, 'utf8');
    fs.writeFileSync(path.join(p2MirrorDir, svgFileName), svgContent, 'utf8');
    fs.writeFileSync(path.join(p1MapsDir, svgFileName), svgContent, 'utf8');
    if (code === 'SE') {
      fs.writeFileSync(path.join(outMapsDir, 'suède.svg'), svgContent, 'utf8');
      fs.writeFileSync(path.join(p2MirrorDir, 'suède.svg'), svgContent, 'utf8');
      fs.writeFileSync(path.join(p1MapsDir, 'suède.svg'), svgContent, 'utf8');
    }
    console.log(`Carte européenne générée pour ${name} (${code}): ${svgFileName}`);
  }

  // 3. Module TypeScript partagé avec tous les tracés vectoriels à l'échelle européenne
  const tsContent = `// Données vectorielles et tracés à l'échelle européenne pour les 6 États membres
import type { CountryCode } from '../domain/types';

export interface EuroMapConfig {
  viewBox: string;
  width: number;
  height: number;
  surroundingPaths: string[];
  capitals: Record<CountryCode, { name: string; lon?: number; lat?: number; x: number; y: number }>;
  countriesPaths: Record<CountryCode, string[]>;
}

export const EURO_MAP_CONFIG: EuroMapConfig = {
  viewBox: '0 0 ${width} ${height}',
  width: ${width},
  height: ${height},
  surroundingPaths: ${JSON.stringify(surroundingPaths)},
  capitals: ${JSON.stringify(Object.fromEntries(Object.entries(countryMetadata).map(([c, d]) => [c, d.capital])), null, 2)},
  countriesPaths: ${JSON.stringify(allCountriesSvgPaths, null, 2)}
};
`;

  const tsFilePath = path.resolve('projet2/src/data/countryGeoData.ts');
  fs.writeFileSync(tsFilePath, tsContent, 'utf8');
  console.log(`Module TypeScript généré: ${tsFilePath}`);
}

generateAllCountryMaps();
