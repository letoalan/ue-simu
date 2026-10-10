import type { CountryFinancialBreakdown } from '../../domain/financeTypes';
import { COUNTRIES_META } from '../../data/countries';
import type { CountryCode } from '../../domain/types';

export function renderFinanceChartsHtml(
  breakdown: Record<CountryCode, CountryFinancialBreakdown>,
  totalFund: number,
  reserveFund: number
): string {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];
  const allocatedFund = totalFund - reserveFund;

  // Trouver le max pour échelle graphique
  const maxVal = Math.max(...codes.map(c => Math.max(breakdown[c].contribution, breakdown[c].allocation)), 1);
  const maxBalance = Math.max(...codes.map(c => Math.abs(breakdown[c].netBalance)), 1);

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      
      <!-- Graphique 1 : Contributions versées vs Allocations reçues -->
      <div class="card">
        <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>1. Contributions vs Allocations du Fonds</span>
          <span style="font-size: 0.8rem; color: var(--color-text-muted);">
            Total : ${totalFund} Mds € (Alloué : ${allocatedFund.toFixed(1)} Mds € • Réserve : ${reserveFund.toFixed(1)} Mds €)
          </span>
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${codes.map(c => {
            const b = breakdown[c];
            const meta = COUNTRIES_META[c];
            const contribW = Math.round((b.contribution / maxVal) * 100);
            const allocW = Math.round((b.allocation / maxVal) * 100);

            return `
              <div style="display: grid; grid-template-columns: 80px 1fr 1fr 90px; gap: 8px; align-items: center; font-size: 0.82rem;">
                <span style="font-weight: 700;"><img src="${meta.flagUrl}" alt="${c}" style="width:13px; height:9px; border-radius:1px; object-fit:cover; display:inline-block; margin-right:4px;" />${c}</span>
                <!-- Barre Contribution (bleue) -->
                <div style="background: var(--color-surface-hover); height: 16px; border-radius: 4px; overflow: hidden; display: flex;">
                  <div style="width: ${contribW}%; background: #2563eb; height: 100%;" title="Contribution : ${b.contribution} Mds €"></div>
                </div>
                <!-- Barre Allocation (verte) -->
                <div style="background: var(--color-surface-hover); height: 16px; border-radius: 4px; overflow: hidden; display: flex;">
                  <div style="width: ${allocW}%; background: #10b981; height: 100%;" title="Allocation : ${b.allocation} Mds €"></div>
                </div>
                <!-- Chiffres -->
                <div style="font-family: var(--font-mono); font-size: 0.75rem; text-align: right;">
                  <span style="color: #2563eb; font-weight: 700;">${b.contribution}</span> / <span style="color: #10b981; font-weight: 700;">${b.allocation}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 10px; font-size: 0.75rem;">
          <span style="display: flex; align-items: center; gap: 4px;">
            <span style="width: 10px; height: 10px; background: #2563eb; border-radius: 2px;"></span> Contribution versée
          </span>
          <span style="display: flex; align-items: center; gap: 4px;">
            <span style="width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span> Allocation perçue
          </span>
        </div>
      </div>

      <!-- Graphique 2 : Barres divergentes du Solde Net -->
      <div class="card">
        <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px;">
          2. Soldes Financiers Nets (Contributeurs vs Bénéficiaires)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${codes.map(c => {
            const b = breakdown[c];
            const meta = COUNTRIES_META[c];
            const isBenefit = b.netBalance >= 0;
            const barW = Math.round((Math.abs(b.netBalance) / maxBalance) * 50);

            return `
              <div style="display: grid; grid-template-columns: 80px 1fr 1fr 80px; gap: 8px; align-items: center; font-size: 0.82rem;">
                <span style="font-weight: 700;"><img src="${meta.flagUrl}" alt="${c}" style="width:13px; height:9px; border-radius:1px; object-fit:cover; display:inline-block; margin-right:4px;" />${c}</span>
                <!-- Côté négatif (gauche de l'axe central) -->
                <div style="display: flex; justify-content: flex-end; height: 16px;">
                  ${!isBenefit ? `<div style="width: ${barW * 2}%; background: #ef4444; border-radius: 4px 0 0 4px;" title="Contributeur net : ${b.netBalance} Mds €"></div>` : ''}
                </div>
                <!-- Côté positif (droite de l'axe central) -->
                <div style="display: flex; justify-content: flex-start; height: 16px;">
                  ${isBenefit ? `<div style="width: ${barW * 2}%; background: #10b981; border-radius: 0 4px 4px 0;" title="Bénéficiaire net : +${b.netBalance} Mds €"></div>` : ''}
                </div>
                <!-- Solde chiffré -->
                <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.78rem; text-align: right; color: ${isBenefit ? '#10b981' : '#ef4444'};">
                  ${isBenefit ? '+' : ''}${b.netBalance.toFixed(1)} Mds
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Graphique 3 : Taux de Couverture du Besoin -->
      <div class="card">
        <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px;">
          3. Couverture Finale du Besoin Restant par Pays
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${codes.map(c => {
            const b = breakdown[c];
            const meta = COUNTRIES_META[c];
            const covPct = Math.round(b.coverageRate * 100);
            const covColor = covPct >= 75 ? '#10b981' : covPct >= 50 ? '#f59e0b' : '#ef4444';

            return `
              <div style="display: grid; grid-template-columns: 80px 1fr 60px; gap: 8px; align-items: center; font-size: 0.82rem;">
                <span style="font-weight: 700;"><img src="${meta.flagUrl}" alt="${c}" style="width:13px; height:9px; border-radius:1px; object-fit:cover; display:inline-block; margin-right:4px;" />${c}</span>
                <div style="background: var(--color-surface-hover); height: 16px; border-radius: 4px; overflow: hidden; display: flex;">
                  <div style="width: ${covPct}%; background: ${covColor}; height: 100%;"></div>
                </div>
                <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.78rem; text-align: right; color: ${covColor};">
                  ${covPct}%
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
