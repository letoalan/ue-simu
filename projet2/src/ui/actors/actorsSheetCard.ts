import type { ActorSheet } from '../../data/actorSheets';
import type { CountryCode } from '../../domain/types';
import { renderEuropeCountryMapHtml } from './countryMap';

/**
 * Génère le fragment HTML pour une fiche d'acteur détaillée
 */
export function renderSingleActorSheetHtml(sheet: ActorSheet | null): string {
  if (!sheet) {
    return `
      <div class="card" style="text-align:center; padding:30px;">
        <h3 style="color:var(--color-danger); margin-bottom:8px;">Fiche acteur introuvable</h3>
        <p style="color:var(--color-text-muted);">Veuillez sélectionner un autre acteur ou une autre directive.</p>
      </div>
    `;
  }

  const isState = sheet.category === 'states';

  return `
    <div class="card" style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- En-tête de la fiche acteur avec éléments visuels illustratifs (Drapeau + Carte d'Europe) -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-bottom:1px solid var(--color-border); padding-bottom:16px;">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          
          <!-- Visuels illustratifs : Drapeau & Carte d'Europe -->
          <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
            ${sheet.icon ? `
              <img
                src="${sheet.icon}"
                alt="${sheet.nom}"
                style="width:54px; height:38px; border-radius:var(--radius-sm); object-fit:cover; box-shadow:var(--shadow-sm); border:1px solid var(--color-border); display:block;"
                loading="lazy"
                decoding="async"
              />
            ` : `
              <div style="width:48px; height:48px; border-radius:var(--radius-sm); background:var(--color-surface-hover); display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                👤
              </div>
            `}

            ${isState ? `
              <!-- Carte illustrative à l'échelle européenne avec layer du pays actif -->
              <div
                class="actor-europe-map-thumb"
                style="width:125px; height:78px; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--color-border); box-shadow:var(--shadow-sm); flex-shrink:0; cursor:pointer;"
                title="Situation géographique de ${sheet.nom} au sein de l'Union européenne"
              >
                ${renderEuropeCountryMapHtml(sheet.id as CountryCode, { compact: true })}
              </div>
            ` : ''}
          </div>

          <div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="badge ${sheet.category === 'commission' ? 'badge-commission' : sheet.category === 'states' ? 'badge-conseil' : sheet.category === 'parties' ? 'badge-parlement' : 'badge-lobby'}">
                ${sheet.categoryLabel}
              </span>
              <h2 style="font-size:1.3rem; font-weight:800; color:var(--color-text-main); margin:0;">
                ${sheet.nom}
              </h2>
            </div>
            <p style="font-size:0.86rem; color:var(--color-text-muted); margin-top:2px;">
              <b>Rôle européen :</b> ${sheet.roleEuropeen}
            </p>
          </div>
        </div>

        <!-- Actions rapides de négociation -->
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" id="btnCopyBriefing">
            📋 Copier le briefing
          </button>
          <button class="btn btn-primary btn-sm" id="btnSelectInSim" data-category="${sheet.category}" data-id="${sheet.id}">
            📊 Sélectionner dans le simulateur
          </button>
        </div>
      </div>

      <!-- Bloc 1 : Enjeux de la Directive -->
      <div>
        <div class="actor-sheet-section-title">
          <span>🎯</span>
          <span>Enjeux de la Directive pour cet Acteur</span>
        </div>
        <div style="background:var(--color-surface-hover); padding:14px; border-radius:var(--radius-md); font-size:0.88rem; line-height:1.5;">
          <ul style="padding-left:20px; display:flex; flex-direction:column; gap:6px; color:var(--color-text-main);">
            ${sheet.enjeuxDirective.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Bloc 2 : Stratégie & Équilibres Politiques (Alliances vs Oppositions) -->
      <div>
        <div class="actor-sheet-section-title">
          <span>🤝</span>
          <span>Stratégie de Négociation & Équilibres de Pouvoir</span>
        </div>
        <div style="background:var(--color-surface-hover); padding:14px; border-radius:var(--radius-md); font-size:0.88rem; line-height:1.5; margin-bottom:12px;">
          <p style="color:var(--color-text-main); font-weight:500;">${sheet.strategie}</p>
        </div>

        <div class="grid-2">
          <!-- Alliances -->
          <div class="card" style="border-left:4px solid var(--color-success); padding:14px;">
            <div style="font-weight:700; font-size:0.9rem; color:var(--color-success); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
              <span>✓</span>
              <span>Alliés Potentiels & Convergences</span>
            </div>
            <ul style="padding-left:18px; font-size:0.84rem; display:flex; flex-direction:column; gap:4px; color:var(--color-text-muted);">
              ${sheet.alliances.length > 0
                ? sheet.alliances.map(a => `<li>${a}</li>`).join('')
                : '<li style="font-style:italic;">Aucune alliance naturelle identifiée</li>'}
            </ul>
          </div>

          <!-- Oppositions -->
          <div class="card" style="border-left:4px solid var(--color-danger); padding:14px;">
            <div style="font-weight:700; font-size:0.9rem; color:var(--color-danger); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
              <span>✗</span>
              <span>Opposants Probables & Lignes Rouges</span>
            </div>
            <ul style="padding-left:18px; font-size:0.84rem; display:flex; flex-direction:column; gap:4px; color:var(--color-text-muted);">
              ${sheet.oppositions.length > 0
                ? sheet.oppositions.map(o => `<li>${o}</li>`).join('')
                : '<li style="font-style:italic;">Aucune opposition majeure déclarée</li>'}
            </ul>
          </div>
        </div>
      </div>

      <!-- Bloc 3 : Arguments Clés pour la Négociation -->
      <div>
        <div class="actor-sheet-section-title">
          <span>💬</span>
          <span>Arguments Clés à Porter dans le Débat</span>
        </div>
        <div class="grid-2">
          ${sheet.arguments.map((arg, idx) => `
            <div style="background:var(--color-surface-hover); padding:12px; border-radius:var(--radius-md); font-size:0.85rem; border-left:3px solid var(--color-primary); line-height:1.45;">
              <strong style="color:var(--color-primary); display:block; margin-bottom:3px;">Argument ${idx + 1}</strong>
              <span style="color:var(--color-text-main);">${arg}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bloc 4 : Positions détaillées sur les 8 Amendements -->
      <div>
        <div class="actor-sheet-section-title">
          <span>📜</span>
          <span>Mandats de Vote sur les 8 Amendements Proposés</span>
        </div>
        <div class="grid-2">
          ${sheet.positionsAmendements.map(pos => {
            const posClass = pos.position.includes('FAVORABLE') && !pos.position.includes('DEFAVORABLE')
              ? (pos.position.includes('CONDITIONNEL') ? 'badge-pos-conditionnel' : 'badge-pos-favorable')
              : (pos.position.includes('DEFAVORABLE') ? 'badge-pos-defavorable' : 'badge-pos-neutre');

            const label = pos.position === 'FAVORABLE' ? 'Favorable ✓'
              : pos.position === 'FAVORABLE_CONDITIONNEL' ? 'Favorable sous conditions ⚠️'
              : pos.position === 'DEFAVORABLE' ? 'Défavorable ✗'
              : pos.position === 'DEFAVORABLE_PARTIEL' ? 'Partiellement défavorable ✗'
              : pos.position;

            return `
              <div class="position-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="font-size:0.9rem; color:var(--color-text-main);">${pos.amendement}</strong>
                  <span class="badge ${posClass}" style="font-size:0.75rem;">
                    ${label}
                  </span>
                </div>
                <p style="font-size:0.82rem; color:var(--color-text-muted); margin:0; line-height:1.4;">
                  ${pos.justification}
                </p>
                ${pos.priorite ? `
                  <div style="margin-top:auto; padding-top:4px;">
                    <span class="badge ${pos.priorite.toLowerCase().includes('haute') ? 'badge-priorite-haute' : 'badge-priorite-moyenne'}" style="font-size:0.7rem;">
                      Priorité : ${pos.priorite}
                    </span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Bloc 5 : Note Interne Confidentielle -->
      ${sheet.notesInternes ? `
        <div class="internal-note-box">
          <div style="font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
            <span>🔒</span>
            <span>Note Interne & Stratégie Secrète (Réservé à l'Acteur)</span>
          </div>
          <p style="margin:0;">${sheet.notesInternes}</p>
        </div>
      ` : ''}

    </div>
  `;
}
