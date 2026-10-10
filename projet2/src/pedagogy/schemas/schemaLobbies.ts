import type { AppStoreState } from '../../state/storeTypes';
import type { LobbyCode } from '../../domain/types';
import { LOBBIES_PROFILES } from '../../data/lobbies';

export function generateSchemaLobbiesHtml(state: AppStoreState): string {
  const sim = state.simulationResult;
  if (!sim) return '<p>Données des lobbies indisponibles.</p>';

  const lobbyCode: LobbyCode = state.selectedLobby || 'AUTO';
  const lData = sim.lobbies[lobbyCode];
  const profile = LOBBIES_PROFILES[lobbyCode];

  const repFin = lData ? lData.reputationArr[9].toFixed(1) : '50';
  const infEtatsFin = lData ? lData.infEtatsArr[9].toFixed(1) : '50';
  const infParlFin = lData ? lData.infParlementArr[9].toFixed(1) : '50';
  const scoreSucces = lData ? lData.scoreDeReussite : 50;

  return `
    <div class="explanatory-schema" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <strong style="color: var(--color-primary); font-size: 0.95rem;">🧭 Schéma d'Influence (${profile?.nom ?? lobbyCode})</strong>
        <span class="badge badge-lobby" style="font-size: 0.75rem;">Groupes d'Intérêt</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; font-size: 0.85rem;">
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
          <div style="font-weight: 700; color: #f59e0b; margin-bottom: 8px;">1. Intérêts du Secteur</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Secteur clé :</span>
            <strong style="float: right;">${profile?.nom.split('(')[0].trim() ?? lobbyCode}</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Réputation départ :</span>
            <strong style="float: right;">${profile?.base.reputation ?? 50} / 100</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Influence Conseil :</span>
            <strong style="float: right;">${profile?.base.infEtats ?? 50} / 100</strong>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #2563eb;">
          <div style="font-weight: 700; color: #2563eb; margin-bottom: 8px;">2. Canaux de Pression</div>
          <div style="margin-bottom: 6px;">
            <strong>🏛️ Le Conseil (États) :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Plaide auprès des ministres la défense de l'emploi local.</div>
          </div>
          <div style="margin-bottom: 6px;">
            <strong>🇪🇺 Le Parlement :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Négocie des amendements de transition avec les députés.</div>
          </div>
          <div>
            <strong>⚖️ Équilibre de force :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">La réputation baisse si le lobby s'oppose à l'intérêt général.</div>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #10b981;">
          <div style="font-weight: 700; color: #10b981; margin-bottom: 8px;">3. Bilan d'Influence (2034)</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Réputation finale :</span>
            <strong style="float: right; font-family: var(--font-mono);">${repFin} / 100</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Influence Conseil :</span>
            <strong style="float: right; font-family: var(--font-mono);">${infEtatsFin} / 100</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Influence Parlement :</span>
            <strong style="float: right; font-family: var(--font-mono);">${infParlFin} / 100</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Score de Réussite :</span>
            <strong style="float: right; font-weight: 800; color: #2563eb;">${scoreSucces} / 100</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
