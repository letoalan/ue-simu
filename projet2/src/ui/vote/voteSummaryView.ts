import type { Directive } from '../../domain/types';
import type { VoteStepData, VoteStoreState, VoteStepStatus } from '../../state/store';
import { store } from '../../state/store';

/**
 * Rendu de l'étape finale du Package : Bilan des amendements adoptés et impacts sur les paramètres
 */
export function renderPackageSummaryHtml(
  directive: Directive,
  steps: VoteStepData[],
  vState: VoteStoreState,
  pkgStatus?: VoteStepStatus
): string {
  const amdSteps = steps.filter(s => s.id.startsWith('amend-'));
  const passedAmendments = amdSteps.filter(s => vState.stepStatus[s.id]?.passed && vState.stepStatus[s.id]?.validated);
  const isScenario1 = store.getState().scenarioId === 1;

  const isPackageVoted = Boolean(pkgStatus?.validated);
  const isPackagePassed = Boolean(pkgStatus?.validated && pkgStatus?.passed);

  const baseStats = directive.statistiques_depart || {};
  const simulatedStats: Record<string, number> = { ...baseStats };

  if (passedAmendments.length > 0) {
    const impactSum: Record<string, number> = {};
    const impactCount: Record<string, number> = {};

    for (const a of passedAmendments) {
      if (a.impact) {
        for (const [key, val] of Object.entries(a.impact)) {
          impactSum[key] = (impactSum[key] || 0) + (val as number);
          impactCount[key] = (impactCount[key] || 0) + 1;
        }
      }
    }

    for (const [key, count] of Object.entries(impactCount)) {
      if (count > 0) simulatedStats[key] = Math.round((impactSum[key] / count) * 100) / 100;
    }
  }

  const indicatorLabels: Record<string, { name: string; unit: string; goodIsHigher: boolean }> = isScenario1
    ? {
        pib_eu: { name: 'Croissance du PIB', unit: '%', goodIsHigher: true },
        gini_eu: { name: 'Inégalités (Gini)', unit: '', goodIsHigher: false },
        co2_eu: { name: 'Émissions de CO₂', unit: 't/hab', goodIsHigher: false },
        veb_eu: { name: 'Bien-être & Végétalisation (VEB)', unit: '%', goodIsHigher: true }
      }
    : {
        normandie_eu: { name: 'Indice Normandie Sécurité', unit: 'score', goodIsHigher: true },
        vdem_eu: { name: 'État de droit (V-Dem)', unit: '', goodIsHigher: true },
        pib_growth_eu: { name: 'Croissance économique', unit: '%', goodIsHigher: true },
        idh_eu: { name: 'Développement humain (IDH)', unit: '', goodIsHigher: true }
      };

  const statusBannerHtml = !isPackageVoted
    ? `<div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:0.85rem; color:#92400e;">⏳ <b>Vote solennel requis :</b> Délibérez sur le Package Final. Sans vote et adoption, <b>le besoin de financement n'existe pas</b>.</div>`
    : !isPackagePassed
    ? `<div style="background:#fef2f2; border-left:4px solid #ef4444; padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:0.85rem; color:#991b1b;">❌ <b>Package final rejeté :</b> La directive est caduque. Sans texte adopté, <b>aucun besoin de financement n'existe</b>.</div>`
    : `<div style="background:#ecfdf5; border-left:4px solid #10b981; padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:0.85rem; color:#065f46;">🎉 <b>Package final adopté :</b> La directive entre en vigueur ! Le besoin de financement est activé pour la Phase B.</div>`;

  const buttonsHtml = isPackagePassed
    ? `<button class="btn btn-primary" id="btnGoToFinance" style="background:var(--color-primary); box-shadow:var(--shadow-md);">💶 Négocier le Financement (Phase B) →</button><button class="btn btn-secondary" id="btnApplyToSimLarge">🚀 Appliquer au Simulateur</button>`
    : isPackageVoted
    ? `<button class="btn btn-secondary" id="btnGoToFinance" disabled style="opacity:0.6; cursor:not-allowed;" title="Le package a été rejeté. Sans directive adoptée, aucun besoin de financement n'existe.">🔒 Financement indisponible (Package rejeté)</button>`
    : `<button class="btn btn-secondary" id="btnGoToFinance" disabled style="opacity:0.6; cursor:not-allowed;" title="Veuillez voter et valider le package ci-dessous avant d'ouvrir le financement.">🔒 Financement verrouillé (Vote du package requis)</button>`;

  return `
    <div class="card" style="border-top:4px solid ${isPackagePassed ? 'var(--color-success)' : isPackageVoted ? 'var(--color-danger)' : '#f59e0b'};">
      <div class="card-header" style="margin-bottom:12px;">
        <div>
          <span class="badge" style="background:${isPackagePassed ? '#ecfdf5' : isPackageVoted ? '#fef2f2' : '#fffbeb'}; color:${isPackagePassed ? '#065f46' : isPackageVoted ? '#991b1b' : '#92400e'}; border:1px solid ${isPackagePassed ? '#10b981' : isPackageVoted ? '#ef4444' : '#f59e0b'};">
            ${isPackagePassed ? 'Compromis Législatif Adopté' : isPackageVoted ? 'Compromis Rejeté' : 'Bilan de la séance de vote'}
          </span>
          <h2 class="card-title" style="font-size:1.25rem; margin-top:4px;">
            Consolidation du Compromis Législatif Final
          </h2>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          ${buttonsHtml}
        </div>
      </div>

      ${statusBannerHtml}

      <p style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:16px;">
        Sur les <b>${amdSteps.length} amendements</b> débattus, <b>${passedAmendments.length} ont franchi la double majorité</b> du Conseil et du Parlement et sont intégrés au texte légal définitif.
      </p>

      <div class="grid-2">
        <!-- 1. Tableau des amendements -->
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:8px;">Statut des propositions d'amendements</h4>
          <div class="vote-table-container">
            <table class="vote-mini-table">
              <thead>
                <tr>
                  <th>Amendement</th>
                  <th>Origine</th>
                  <th style="text-align:right;">Résultat</th>
                </tr>
              </thead>
              <tbody>
                ${amdSteps.map(amd => {
                  const st = vState.stepStatus[amd.id];
                  const isValidated = st?.validated;
                  const isPassed = st?.passed && isValidated;
                  return `
                    <tr>
                      <td>
                        <b>${amd.name}</b>
                        <div style="font-size:0.75rem; color:var(--color-text-muted);">${amd.description.slice(0, 45)}...</div>
                      </td>
                      <td style="font-size:0.78rem;">
                        <span class="badge ${amd.amendType === 'parlement' ? 'badge-parlement' : 'badge-conseil'}">
                          ${amd.amendOrigine || 'Amendement'}
                        </span>
                      </td>
                      <td style="text-align:right;">
                        ${!isValidated
                          ? '<span class="badge" style="background:#f1f5f9; color:#64748b;">Non validé</span>'
                          : isPassed
                          ? '<span class="badge badge-success-solid">Adopté ✓</span>'
                          : '<span class="badge badge-danger-solid">Rejeté ✗</span>'
                        }
                      </td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Comparatif des Indicateurs avant / après -->
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:8px;">Impact sur les paramètres de simulation</h4>
          <div class="vote-table-container">
            <table class="vote-mini-table">
              <thead>
                <tr>
                  <th>Indicateur</th>
                  <th>Proposition</th>
                  <th>Texte Voté</th>
                  <th style="text-align:right;">Variation Δ</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(indicatorLabels).map(([key, meta]) => {
                  const vInitial = baseStats[key] ?? 0;
                  const vFinal = simulatedStats[key] ?? 0;
                  const delta = Math.round((vFinal - vInitial) * 100) / 100;
                  const isPositive = delta > 0.001;
                  const isNegative = delta < -0.001;
                  const isGood = (isPositive && meta.goodIsHigher) || (isNegative && !meta.goodIsHigher);

                  let deltaBadge = '<span style="color:#64748b;">= 0.00</span>';
                  if (isPositive) {
                    deltaBadge = `<span style="color:${isGood ? '#10b981' : '#ef4444'}; font-weight:bold;">+${delta.toFixed(2)}</span>`;
                  } else if (isNegative) {
                    deltaBadge = `<span style="color:${isGood ? '#10b981' : '#ef4444'}; font-weight:bold;">${delta.toFixed(2)}</span>`;
                  }

                  return `
                    <tr>
                      <td><b>${meta.name}</b></td>
                      <td style="color:var(--color-text-muted);">${vInitial.toFixed(2)} ${meta.unit}</td>
                      <td><b>${vFinal.toFixed(2)} ${meta.unit}</b></td>
                      <td style="text-align:right;">${deltaBadge}</td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:12px; margin-top:14px;">
            <p style="font-size:0.8rem; color:var(--color-text-muted); margin:0;">
              💡 <b>Note pédagogique :</b> En appliquant ces résultats, les curseurs de l'Union européenne dans le simulateur seront automatiquement ajustés à ces valeurs de compromis.
            </p>
          </div>
        </div>
      </div>
    </div>`;
}
