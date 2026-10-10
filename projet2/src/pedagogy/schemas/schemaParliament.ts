import type { AppStoreState } from '../../state/storeTypes';
import type { PartyCode } from '../../domain/types';
import type { ParliamentCoalition } from '../../domain/parliamentTypes';
import { PARTIES_PROFILES } from '../../data/parties';

export function generateSchemaParliamentHtml(state: AppStoreState): string {
  const sim = state.simulationResult;
  if (!sim || !sim.parliament) return '<p>Données parlementaires indisponibles.</p>';

  const partyCode: PartyCode = state.selectedParty || 'PPE';
  const group = sim.parliament.groups[partyCode] || sim.parliament.groupList[4];
  const profile = PARTIES_PROFILES[partyCode];
  const coalitions = sim.parliament.coalitions;
  const majorCoalition = coalitions.find((c: ParliamentCoalition) => c.hasMajority) || coalitions[0];

  const deltaSign = group.delta > 0 ? '+' : '';
  const deltaColor = group.delta > 0 ? '#10b981' : group.delta < 0 ? '#ef4444' : '#64748b';

  return `
    <div class="explanatory-schema" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <strong style="color: var(--color-primary); font-size: 0.95rem;">🧭 Schéma Électoral des 720 Sièges (Hémicycle UE)</strong>
        <span class="badge badge-parlement" style="font-size: 0.75rem;">Algorithme Électoral</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; font-size: 0.85rem;">
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid ${group.couleur};">
          <div style="font-weight: 700; color: ${group.couleur}; margin-bottom: 8px;">1. Priorités de ${group.nomCourt}</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Poids Climat CO₂ :</span>
            <strong style="float: right;">${Math.round((profile?.pond.co2 ?? 0.1) * 100)}%</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Poids Économie PIB :</span>
            <strong style="float: right;">${Math.round((profile?.pond.pib ?? 0.25) * 100)}%</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Poids Social Gini :</span>
            <strong style="float: right;">${Math.round((profile?.pond.gini ?? 0.15) * 100)}%</strong>
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--color-border); font-size: 0.75rem;">
            Satisfaction finale : <strong style="color: ${group.couleur};">${group.satisfaction}%</strong>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
          <div style="font-weight: 700; color: #f59e0b; margin-bottom: 8px;">2. Algorithme de Vote</div>
          <div style="margin-bottom: 6px;">
            <strong>🗳️ Transfert de voix :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Élasticité de ±35% selon la satisfaction relative.</div>
          </div>
          <div style="margin-bottom: 6px;">
            <strong>⚖️ Règle des 720 sièges :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Méthode des plus forts restes : total constant garanti.</div>
          </div>
          <div>
            <strong>🚩 Seuil de Majorité :</strong>
            <div style="font-size: 0.75rem; color: #ef4444; font-weight: 700;">361 sièges sur 720 requis pour légiférer.</div>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #10b981;">
          <div style="font-weight: 700; color: #10b981; margin-bottom: 8px;">3. Bilan Hémicycle (2034)</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Sièges :</span>
            <strong style="float: right; font-family: var(--font-mono);">${group.currentSeats} / 720</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Évolution :</span>
            <strong style="float: right; color: ${deltaColor}; font-weight: 800;">${deltaSign}${group.delta} sièges</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Part de l'Hémicycle :</span>
            <strong style="float: right;">${group.percent}%</strong>
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--color-border); font-size: 0.75rem;">
            Coalition : <strong>${majorCoalition ? `${majorCoalition.nom.split('(')[0].trim()} (${majorCoalition.seats} s.)` : 'En attente'}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
