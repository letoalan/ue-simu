import type { CostAssessment } from '../../domain/financeTypes';
import { COUNTRIES_META } from '../../data/countries';
import type { CountryCode } from '../../domain/types';

export function renderFinanceAssessmentHtml(assessment: CostAssessment, directiveTitle: string): string {
  const codes: CountryCode[] = ['DE', 'FR', 'IT', 'PL', 'SE', 'HU'];

  return `
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-header" style="flex-wrap: wrap; gap: 8px;">
        <div>
          <span class="badge badge-commission" style="font-size: 0.75rem;">Phase B — Étape 1 : Évaluation des Besoins</span>
          <h2 class="card-title" style="font-size: 1.25rem; margin-top: 4px;">
            Coûts des Actions & Besoins Restants : ${directiveTitle}
          </h2>
        </div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-mono);">
          Besoin restant à mutualiser : ${assessment.besoinRestantTotal.toFixed(1)} Mds €
        </div>
      </div>

      <!-- Explication pédagogique dépliable -->
      <details style="background: var(--color-surface-hover); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: 14px; border-left: 3px solid var(--color-primary);">
        <summary style="font-weight: 700; color: var(--color-primary); cursor: pointer; font-size: 0.88rem;">
          💡 Comprendre comment cette estimation a été construite
        </summary>
        <p style="margin: 8px 0 0 0; font-size: 0.84rem; color: var(--color-text-muted); line-height: 1.5;">
          Chaque directive votée engage des actions précises (infrastructures, R&D, reconversion, équipements).
          Le coût total <b>K</b> est calculé pays par pays. On déduit ensuite les moyens nationaux ordinaires <b>N<sub>ref</sub></b> déjà prévus.
          Le besoin restant <b>G = max(0, K − N<sub>ref</sub>)</b> est la somme qui nécessite la création d'un fonds de soutien européen.
        </p>
      </details>

      <!-- Grille des 4 actions concrètes -->
      <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 10px;">Actions concrètes prévues par le texte adopté</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px;">
        ${assessment.actions.map(act => `
          <div style="background: var(--color-surface-hover); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--color-text-main); margin-bottom: 4px;">
              ${act.nom}
            </div>
            <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-bottom: 6px;">
              Catégorie : <b>${act.categorie}</b> • Coût fixe : ${act.coutFixe} Mds €
            </div>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-mono);">
              ${act.coutTotalGlobal.toFixed(1)} Mds €
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Tableau récapitulatif par État membre -->
      <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 10px;">Besoins bruts vs Moyens nationaux de référence</h3>
      <div style="overflow-x: auto;">
        <table class="table" style="font-size: 0.82rem; margin: 0; text-align: center;">
          <thead>
            <tr>
              <th style="text-align: left;">État membre</th>
              <th>Coût Total Brut (K)</th>
              <th>Moyens Nationaux (N<sub>ref</sub>)</th>
              <th style="font-weight: 800; color: var(--color-primary);">Besoin Restant (G)</th>
            </tr>
          </thead>
          <tbody>
            ${codes.map(c => {
              const meta = COUNTRIES_META[c];
              const need = assessment.actions.reduce((sum, a) => sum + (a.coutTotalParPays[c] ?? 0), 0);
              const ref = assessment.moyensNationauxRef[c] ?? 0;
              const rem = assessment.besoinRestant[c] ?? 0;
              return `
                <tr>
                  <td style="text-align: left; font-weight: 700;">
                    <img src="${meta.flagUrl}" alt="${c}" style="width:14px; height:10px; border-radius:1px; object-fit:cover; display:inline-block; margin-right:4px;" /> ${meta.name}
                  </td>
                  <td>${need.toFixed(1)} Mds €</td>
                  <td style="color: var(--color-text-muted);">${ref.toFixed(1)} Mds €</td>
                  <td style="font-weight: 800; color: var(--color-primary); font-family: var(--font-mono);">
                    ${rem.toFixed(1)} Mds €
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
