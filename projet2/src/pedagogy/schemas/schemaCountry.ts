import type { AppStoreState } from '../../state/storeTypes';
import type { CountryCode } from '../../domain/types';
import { COUNTRIES_PROFILES } from '../../data/countries';

export function generateSchemaCountryHtml(state: AppStoreState): string {
  const sim = state.simulationResult;
  if (!sim) return '<p>Données nationales indisponibles.</p>';

  const countryCode: CountryCode = state.selectedCountry || 'DE';
  const cData = sim.countries[countryCode];
  const profile = COUNTRIES_PROFILES[countryCode];

  const satInit = cData ? Math.round(cData.satisfaction[0] * 100) : 50;
  const satFin = cData ? Math.round(cData.satisfaction[9] * 100) : 50;
  const netGain = cData?.netGainVsReference !== undefined ? Math.round(cData.netGainVsReference * 100) : 0;
  const netGainSign = netGain > 0 ? '+' : '';

  return `
    <div class="explanatory-schema" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <strong style="color: var(--color-primary); font-size: 0.95rem;">🧭 Schéma d'Impact National (${profile?.name ?? countryCode})</strong>
        <span class="badge badge-conseil" style="font-size: 0.75rem;">Convergence Nationale</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; font-size: 0.85rem;">
        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #2563eb;">
          <div style="font-weight: 700; color: #2563eb; margin-bottom: 8px;">1. Profil Structurel de Départ</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Population :</span>
            <strong style="float: right;">${profile ? `${profile.population} M hab` : 'N/A'}</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Croissance départ :</span>
            <strong style="float: right;">${profile?.dev.init.croiss ?? 1.5}%</strong>
          </div>
          <div>
            <span style="color: var(--color-text-muted);">Émissions CO₂ :</span>
            <strong style="float: right;">${profile?.dev.init.co2 ?? 6.0} t/hab</strong>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
          <div style="font-weight: 700; color: #f59e0b; margin-bottom: 8px;">2. Filtre & Sensibilités</div>
          <div style="margin-bottom: 6px;">
            <strong>🏭 Tissu Industriel :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Coût d'adaptation dépendant de l'intensité carbone locale.</div>
          </div>
          <div style="margin-bottom: 6px;">
            <strong>🛡️ Résilience Budgétaire :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Capacité à cofinancer les investissements verts.</div>
          </div>
          <div>
            <strong>🇪🇺 Effet d'Échelle UE :</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Le marché commun amortit les chocs asymétriques.</div>
          </div>
        </div>

        <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid #10b981;">
          <div style="font-weight: 700; color: #10b981; margin-bottom: 8px;">3. Trajectoire Locale (2034)</div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Satisfaction :</span>
            <strong style="float: right; font-family: var(--font-mono);">${satFin}% (départ : ${satInit}%)</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Score de Succès :</span>
            <strong style="float: right;">${cData?.scoreSucces ?? 50} / 100</strong>
          </div>
          <div style="margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Gain net vs statu quo :</span>
            <strong style="float: right; color: ${netGain >= 0 ? '#10b981' : '#ef4444'};">${netGainSign}${netGain}%</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
