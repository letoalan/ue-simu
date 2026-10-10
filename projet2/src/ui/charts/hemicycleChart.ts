import type { SimulationResult, PartyCode } from '../../domain/types';
import { store } from '../../state/store';

export function renderHemicycle(
  containerId: string,
  result: SimulationResult,
  selectedParty?: PartyCode,
  onPartySelect?: (partyCode: PartyCode) => void,
  baselineResult?: SimulationResult
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const parliament = result.parliament;
  if (!parliament) return;

  const groups = parliament.groupList;
  const totalSeats = parliament.totalSeats; // 720
  const activeCode = selectedParty || 'PPE';

  // Calcul géométrique des arcs de cercle (180° à gauche -> 0° à droite)
  const cx = 250;
  const cy = 200;
  const rOuter = 160;
  const rInner = 90;

  let currentAngleDeg = 180;
  const paths: string[] = [];

  for (const g of groups) {
    const sweepDeg = (g.currentSeats / totalSeats) * 180;
    const startRad = (Math.PI * currentAngleDeg) / 180;
    const endRad = (Math.PI * (currentAngleDeg - sweepDeg)) / 180;

    const x1 = cx + rOuter * Math.cos(startRad);
    const y1 = cy - rOuter * Math.sin(startRad);
    const x2 = cx + rOuter * Math.cos(endRad);
    const y2 = cy - rOuter * Math.sin(endRad);
    const x3 = cx + rInner * Math.cos(endRad);
    const y3 = cy - rInner * Math.sin(endRad);
    const x4 = cx + rInner * Math.cos(startRad);
    const y4 = cy - rInner * Math.sin(startRad);

    const isSelected = g.code === activeCode;
    const strokeAttr = isSelected ? 'stroke="#ffffff" stroke-width="3"' : 'stroke="var(--color-surface)" stroke-width="1.5"';
    const filterAttr = isSelected ? 'style="filter: drop-shadow(0 0 6px rgba(0,0,0,0.4)); opacity: 1;"' : 'style="opacity: 0.9;"';

    paths.push(`
      <path d="M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z"
            fill="${g.couleur}" ${strokeAttr} ${filterAttr}
            class="hemicycle-slice" data-code="${g.code}"
            cursor="pointer">
        <title>${g.nom} : ${g.currentSeats} sièges (${g.delta >= 0 ? '+' : ''}${g.delta})</title>
      </path>
    `);
    currentAngleDeg -= sweepDeg;
  }

  // Informations sur le parti actif
  const activeGroup = groups.find(g => g.code === activeCode) || groups[4]; // PPE par défaut
  const deltaBadgeColor = activeGroup.delta > 0 ? '#10b981' : activeGroup.delta < 0 ? '#ef4444' : '#64748b';
  const deltaSign = activeGroup.delta > 0 ? '+' : '';

  // Comparaison éventuelle avec la référence (mode sandbox)
  const baseGroup = baselineResult?.parliament?.groupList?.find(g => g.code === activeCode);
  const diffSeatsVsBase = baseGroup ? activeGroup.currentSeats - baseGroup.currentSeats : 0;
  const diffBaseSign = diffSeatsVsBase > 0 ? '+' : '';
  const diffBaseCol = diffSeatsVsBase > 0 ? '#10b981' : diffSeatsVsBase < 0 ? '#ef4444' : '#64748b';

  container.innerHTML = `
    <div class="hemicycle-container" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <!-- SVG Hémicycle -->
      <svg viewBox="0 0 500 220" style="width: 100%; max-height: 200px; overflow: visible;">
        <!-- Seuil de majorité (repère vertical à 90°) -->
        <line x1="${cx}" y1="${cy - rOuter - 8}" x2="${cx}" y2="${cy - rInner + 8}"
              stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
        <text x="${cx}" y="${cy - rOuter - 14}" text-anchor="middle" font-size="9" font-weight="700" fill="#ef4444">
          Majorité (361)
        </text>

        <!-- Tranches des partis -->
        ${paths.join('')}

        <!-- Affichage central interactif -->
        <circle cx="${cx}" cy="${cy}" r="${rInner - 8}" fill="var(--color-surface)" />
        <text x="${cx}" y="${cy - 48}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--color-text-main)">
          ${activeGroup.nomCourt}
        </text>
        <text x="${cx}" y="${cy - 26}" text-anchor="middle" font-size="20" font-weight="900" fill="${activeGroup.couleur}" font-family="var(--font-mono)">
          ${activeGroup.currentSeats} <tspan font-size="10" font-weight="600" fill="var(--color-text-muted)">/ 720</tspan>
        </text>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${deltaBadgeColor}">
          ${deltaSign}${activeGroup.delta} sièges (${activeGroup.percent}%)
        </text>
        ${baselineResult ? `
          <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="9" font-weight="700" fill="${diffBaseCol}">
            ${diffBaseSign}${diffSeatsVsBase} sièges vs réf.
          </text>
        ` : ''}
      </svg>

      <!-- Grille de sélection des partis avec delta et sièges -->
      <div class="hemicycle-legend" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 6px; width: 100%;">
        ${groups.map(g => {
          const isSel = g.code === activeCode;
          const dSign = g.delta > 0 ? '+' : '';
          const dCol = g.delta > 0 ? '#10b981' : g.delta < 0 ? '#ef4444' : '#64748b';
          return `
            <button class="btn btn-sm hemicycle-party-btn" data-code="${g.code}"
                    style="display: flex; align-items: center; gap: 4px; padding: 3px 6px; font-size: 0.75rem; border-radius: var(--radius-sm); border: 1px solid ${isSel ? g.couleur : 'var(--color-border)'}; background: ${isSel ? 'var(--color-surface-hover)' : 'var(--color-surface)'}; cursor: pointer;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${g.couleur};"></span>
              <strong style="color: var(--color-text-main);">${g.nomCourt}</strong>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-text-muted);">${g.currentSeats}</span>
              <span style="font-size: 0.68rem; font-weight: 700; color: ${dCol};">(${dSign}${g.delta})</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Événements de clic sur les boutons et les tranches
  container.querySelectorAll('.hemicycle-party-btn, .hemicycle-slice').forEach(el => {
    el.addEventListener('click', (e) => {
      const code = (e.currentTarget as HTMLElement).getAttribute('data-code');
      if (code && code !== 'OTHERS') {
        if (onPartySelect) {
          onPartySelect(code as PartyCode);
        } else {
          store.selectParty(code as PartyCode);
        }
      }
    });
  });
}
