import type { SimulationResult } from '../../domain/types';
import { COUNTRIES_META, COUNTRIES_PROFILES } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';

/**
 * Vue synoptique comparative de tous les acteurs (Conseil, Parlement, Lobbies)
 */
export function renderDashboardViewHtml(sim: SimulationResult): string {
  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <!-- Section 1 : États Membres -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">1. Les 6 États Membres du Conseil</h2>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Pondérations démographiques & Trajectoires</span>
        </div>
        <div class="grid-3">
          ${Object.values(COUNTRIES_META).map(c => {
            const prof = COUNTRIES_PROFILES[c.code];
            const cResult = sim.countries[c.code];
            return `
              <div class="card" style="border: 1px solid var(--color-border);">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${c.flagUrl}" alt="${c.name}" style="width:28px; height:18px; border-radius:2px; object-fit:cover;" loading="lazy" decoding="async" />
                    <h3 style="font-size:1rem; font-weight:700;">${c.name}</h3>
                  </div>
                  <span style="font-size:0.8rem; color:var(--color-text-muted);">${c.population} M hab</span>
                </div>
                <div style="font-size:0.82rem; color:var(--color-text-muted); margin-bottom:12px;">
                  <div>Croissance : ${prof.dev.init.croiss}% | CO₂ : ${prof.dev.init.co2}t</div>
                  <div>Sécurité : ${prof.geo.init.normandie} | V-Dem : ${prof.geo.init.vdem}</div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;">Score : <b>${cResult?.scoreSucces ?? 0}/100</b></span>
                  <button class="btn btn-secondary btn-sm btn-open-sheet" data-cat="states" data-id="${c.code}">
                    Voir la fiche 📑
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Section 2 : Partis Politiques -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">2. Les Groupes Politiques au Parlement</h2>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Équilibres et Sièges 2034</span>
        </div>
        <div class="grid-3">
          ${Object.values(PARTIES_PROFILES).map(p => {
            const pResult = sim.parties[p.code];
            return `
              <div class="card" style="border-left: 5px solid ${p.couleur};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    ${p.logoUrl ? `<img src="${p.logoUrl}" alt="${p.nom}" style="width:24px; height:24px; object-fit:contain;" loading="lazy" decoding="async" />` : ''}
                    <h3 style="font-size:0.95rem; font-weight:700;">${p.nom}</h3>
                  </div>
                  <span style="font-size:0.75rem; font-weight:700; color:${p.couleur};">${p.code}</span>
                </div>
                <div style="font-size:0.82rem; color:var(--color-text-muted); margin-bottom:10px;">
                  <div>Sièges initiaux : <b>${p.base.meps} MEPs</b></div>
                  <div>Projection : <b>${pResult?.mepsArr[9] ?? p.base.meps} MEPs</b></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;">Victoire : <b>${pResult?.scoreVictoire ?? 0}/100</b></span>
                  <button class="btn btn-secondary btn-sm btn-open-sheet" data-cat="parties" data-id="${p.code}">
                    Voir la fiche 📑
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Section 3 : Lobbies -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">3. Les Lobbies & Société Civile</h2>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Forces d'influence sectorielle</span>
        </div>
        <div class="grid-3">
          ${Object.values(LOBBIES_PROFILES).map(l => {
            const lResult = sim.lobbies[l.code];
            return `
              <div class="card" style="border-left: 5px solid ${l.couleur};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    ${l.logoUrl ? `<img src="${l.logoUrl}" alt="${l.nom}" style="width:24px; height:24px; object-fit:contain;" loading="lazy" decoding="async" />` : ''}
                    <h3 style="font-size:0.95rem; font-weight:700;">${l.nom}</h3>
                  </div>
                  <span class="badge badge-lobby">${l.code}</span>
                </div>
                <div style="font-size:0.82rem; color:var(--color-text-muted); margin-bottom:10px;">
                  <div>Influence globale : <b>${Math.round((l.base.infEtats + l.base.infParlement + l.base.infCommission) / 3)}/100</b></div>
                  <div>Réputation : <b>${l.base.reputation}/100</b></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.85rem;">Réussite : <b>${lResult?.scoreDeReussite ?? 0}/100</b></span>
                  <button class="btn btn-secondary btn-sm btn-open-sheet" data-cat="lobbies" data-id="${l.code}">
                    Voir la fiche 📑
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
