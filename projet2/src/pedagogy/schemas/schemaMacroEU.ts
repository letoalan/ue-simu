import type { AppStoreState } from '../../state/storeTypes';

export function generateSchemaMacroEUHtml(state: AppStoreState): string {
  const sim = state.simulationResult;
  if (!sim) return '<p>Simulation non disponible.</p>';

  const pibInit = sim.euSeries.croiss?.[0] ?? sim.euSeries.pib?.[0] ?? 1.5;
  const pibFin = sim.euSeries.croiss?.[9] ?? sim.euSeries.pib?.[9] ?? 1.5;
  const co2Init = sim.euSeries.co2?.[0] ?? 6.5;
  const co2Fin = sim.euSeries.co2?.[9] ?? 6.5;
  const giniFin = sim.euSeries.gini?.[9] ?? 0.35;
  const vebFin = sim.euSeries.veb?.[9] ?? 75;

  const inputs = state.inputs;
  const invVert = inputs['inv_vert'] ?? inputs['transition_eco'] ?? 50;
  const taxeCarb = inputs['taxe_carbone'] ?? inputs['climat_normes'] ?? 40;
  const depSociale = inputs['depenses_sociales'] ?? inputs['redistribution'] ?? 50;

  return `
    <div class="explanatory-schema" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <strong style="color: var(--color-primary); font-size: 0.95rem;">🧭 Schéma des Pondérations & Flux (Trajectoire UE)</strong>
        <span class="badge badge-commission" style="font-size: 0.75rem;">Moteur Macroéconomique</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; font-size: 0.85rem;">
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #2563eb;">
          <div style="font-weight: 700; color: #2563eb; margin-bottom: 8px;">1. Leviers & Pondérations</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Investissement :</span>
            <strong style="float: right;">${invVert} / 100</strong>
            <div style="font-size: 0.72rem; color: #10b981;">(Poids sur PIB : 35%)</div>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Normes Carbone :</span>
            <strong style="float: right;">${taxeCarb} / 100</strong>
            <div style="font-size: 0.72rem; color: #ef4444;">(Poids sur CO₂ : 35%)</div>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Redistribution :</span>
            <strong style="float: right;">${depSociale} / 100</strong>
            <div style="font-size: 0.72rem; color: #f59e0b;">(Poids sur Gini : 25%)</div>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #10b981;">
          <div style="font-weight: 700; color: #10b981; margin-bottom: 8px;">2. Mécanismes du Moteur</div>
          <div style="margin-bottom: 6px;">
            <strong>⏳ Règle du Paquebot :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Inertie de 2 ans avant plein effet industriel.</div>
          </div>
          <div style="margin-bottom: 6px;">
            <strong>🔄 Boucle Rétroactive :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Moins de CO₂ = + de santé et bien-être (VEB).</div>
          </div>
          <div>
            <strong>⚠️ Seuil Gini 0.44 :</strong>
            <div style="font-size: 0.75rem; color: ${giniFin > 0.44 ? '#ef4444' : '#10b981'};">
              ${giniFin > 0.44 ? 'Alerte dépassée : pénalité active' : 'Zone saine préservée'}
            </div>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #8b5cf6;">
          <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">3. Résultats Mesurés (2034)</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">PIB :</span>
            <strong style="float: right; font-family: var(--font-mono);">${pibFin.toFixed(2)}% (${pibFin >= pibInit ? '+' : ''}${(pibFin - pibInit).toFixed(2)})</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">CO₂ :</span>
            <strong style="float: right; font-family: var(--font-mono);">${co2Fin.toFixed(2)} t (${(co2Fin - co2Init).toFixed(2)})</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Bien-être :</span>
            <strong style="float: right; font-family: var(--font-mono);">${vebFin.toFixed(1)} / 100</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Inégalités Gini :</span>
            <strong style="float: right; font-family: var(--font-mono);">${giniFin.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
