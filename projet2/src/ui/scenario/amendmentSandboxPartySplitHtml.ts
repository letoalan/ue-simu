import type { PartyCode } from '../../domain/types';
import type { SandboxComparisonResult } from '../../simulation/sandboxEngine';
import { PARTIES_PROFILES } from '../../data/parties';

/**
 * Génère le balisage HTML de la vue dédoublée (split-view) pour les partis dans la Sandbox :
 * - D'un côté : Hémicycle SVG des 720 sièges avec nombre de sièges et progression
 * - De l'autre : Graphique Chart.js de satisfaction 2025-2034
 */
export function renderSandboxPartySplitHtml(
  partyCode: PartyCode,
  comparison: SandboxComparisonResult
): string {
  const pKey = partyCode as keyof typeof comparison.baselineResult.parties;
  const pProf = PARTIES_PROFILES[partyCode];
  const partyName = pProf?.code || partyCode;
  const partyColor = pProf?.couleur || '#10b981';

  const baseSat = comparison.baselineResult.parties[pKey]?.satisfactionArr?.[9] ?? 0;
  const amdSat = comparison.amendedResult.parties[pKey]?.satisfactionArr?.[9] ?? 0;
  const satDelta = Math.round(amdSat - baseSat);
  const satSign = satDelta > 0 ? '+' : '';
  const satClass = satDelta > 0 ? 'positive' : satDelta < 0 ? 'negative' : 'neutral';

  const baseMeps = comparison.baselineResult.parties[pKey]?.mepsArr?.[9] ?? 0;
  const amdMeps = comparison.amendedResult.parties[pKey]?.mepsArr?.[9] ?? 0;
  const mepsDelta = amdMeps - baseMeps;
  const mepsSign = mepsDelta > 0 ? '+' : '';

  return `
    <div class="sandbox-party-split-view">
      <!-- Colonne 1 : Hémicycle, Sièges et Progression -->
      <div class="sandbox-party-col-hemicycle card" style="margin:0; padding:12px;">
        <div class="sandbox-split-col-header">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1.05rem;">🏛️</span>
            <strong style="font-size:0.9rem; color:var(--color-text-main);">
              Hémicycle & Sièges (720s)
            </strong>
          </div>
          <span class="badge" style="background:${partyColor}20; color:${partyColor}; font-weight:700; font-size:0.75rem;">
            ${partyName} : ${amdMeps} sièges (${mepsSign}${mepsDelta} vs réf.)
          </span>
        </div>
        <div id="sandboxHemicycleContainer" class="sandbox-hemicycle-box"></div>
      </div>

      <!-- Colonne 2 : Graphique de Satisfaction -->
      <div class="sandbox-party-col-satisfaction card" style="margin:0; padding:12px;">
        <div class="sandbox-split-col-header">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1.05rem;">📈</span>
            <strong style="font-size:0.9rem; color:var(--color-text-main);">
              Satisfaction du Groupe (2025-2034)
            </strong>
          </div>
          <span class="sandbox-delta-pill ${satClass}" style="font-size:0.75rem;">
            ${satDelta > 0 ? '▲' : satDelta < 0 ? '▼' : '•'} ${Math.round(amdSat)}% (${satSign}${satDelta} pts)
          </span>
        </div>
        <div class="sandbox-chart-wrapper" style="height:220px; position:relative;">
          <canvas id="chartSandboxPartySatisfaction"></canvas>
        </div>
      </div>
    </div>
  `;
}
