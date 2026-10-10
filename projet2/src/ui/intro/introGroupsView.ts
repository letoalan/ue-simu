import type { AllocationResult } from './groupAllocator';

/**
 * Sous-onglet 2 : Paramétrage de la classe et répartition aléatoire des participants
 */
export function renderGroupsSubTab(currentAllocation: AllocationResult | null): string {
  const currentCount = currentAllocation
    ? (currentAllocation.commission.members.length +
       currentAllocation.states.reduce((acc, s) => acc + s.members.length, 0) +
       currentAllocation.parties.reduce((acc, p) => acc + p.members.length, 0) +
       currentAllocation.lobbies.reduce((acc, l) => acc + l.members.length, 0))
    : 24;

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <div class="card" style="padding:20px;">
        <div style="margin-bottom:16px;">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--color-primary); margin-bottom:4px;">
            Configuration des Groupes & Attribution des Rôles
          </h2>
          <p style="font-size:0.88rem; color:var(--color-text-muted);">
            Répartissez automatiquement vos participants entre les 19 acteurs de la négociation (Commission, 6 États membres, 6 Partis politiques et 6 Lobbies).
          </p>
        </div>

        <!-- Paramétrage de la classe -->
        <div style="background:var(--color-surface-hover); padding:16px; border-radius:var(--radius-md); border:1px solid var(--color-border); margin-bottom:18px;">
          <div class="grid-2" style="align-items:flex-end; gap:16px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="numParticipantsInput" style="font-weight:700;">
                Nombre de participants ou élèves :
              </label>
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="number" id="numParticipantsInput" class="form-input" min="3" max="150" value="${currentCount}" style="max-width:120px;" />
                <div style="display:flex; gap:4px; flex-wrap:wrap;">
                  ${[12, 18, 24, 30, 36].map(cnt => `
                    <button type="button" class="btn btn-secondary btn-sm btn-quick-count" data-count="${cnt}" style="padding:4px 8px; font-size:0.78rem;">
                      ${cnt}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btn-primary" id="btnGenerateAutoGroups">
                👥 Générer les groupes
              </button>
              <button class="btn btn-secondary" id="btnDownloadCsv" ${currentAllocation ? '' : 'disabled'}>
                📥 Télécharger CSV
              </button>
            </div>
          </div>

          <!-- Liste personnalisée optionnelle -->
          <details style="margin-top:14px; font-size:0.85rem; color:var(--color-text-muted);">
            <summary style="cursor:pointer; font-weight:600; color:var(--color-primary);">
              📝 Personnaliser avec la liste des noms des élèves (optionnel)
            </summary>
            <textarea id="customStudentNames" class="form-input" rows="3" placeholder="Exemple : Thomas, Léa, Maxime, Sarah... (un nom par ligne ou séparés par des virgules)" style="margin-top:8px; font-family:inherit;"></textarea>
          </details>
        </div>

        <!-- Tirage au sort pédagogique rapide -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:12px 16px; background:#f8fafc; border:1px dashed var(--color-border); border-radius:var(--radius-md); margin-bottom:18px;">
          <div>
            <div style="font-weight:700; font-size:0.88rem; color:var(--color-text-main);">
              🎲 Tirage au sort pédagogique de séance
            </div>
            <div style="font-size:0.8rem; color:var(--color-text-muted);">
              Attribuez un scénario ou une directive au hasard pour la classe.
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnDrawScenarioQuick">
              🎲 Scénario au sort
            </button>
            <button class="btn btn-secondary btn-sm" id="btnDrawDirectiveQuick">
              🎯 Directive au sort
            </button>
          </div>
        </div>

        <!-- Affichage des Groupes Alloués -->
        <div id="allocationDisplayContainer">
          ${renderAllocationPreview(currentAllocation)}
        </div>
      </div>

      <!-- Pied de page de l'étape 2 -->
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-secondary" id="btnBackToImmersion">
          ← Retour à l'Immersion
        </button>
        <button class="btn btn-primary" id="btnNextToRoles">
          Consulter les 19 Rôles & Mandats 🎭 →
        </button>
      </div>
    </div>
  `;
}

export function renderAllocationPreview(allocation: AllocationResult | null): string {
  if (!allocation) {
    return `
      <div style="text-align:center; padding:32px 14px; background:var(--color-surface); border:1px dashed var(--color-border); border-radius:var(--radius-md); color:var(--color-text-muted); font-size:0.9rem;">
        <span style="font-size:1.6rem; display:block; margin-bottom:6px;">👥</span>
        Cliquez sur <b>« Générer les groupes »</b> pour créer la répartition équilibrée de vos participants sur les 19 acteurs.
      </div>
    `;
  }

  return `
    <div style="display:flex; flex-direction:column; gap:14px; margin-top:10px;">
      <!-- Commission -->
      <div class="card" style="border-left:4px solid #16a34a; padding:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <img src="./medias/images/euro/eurocomm.jpg" alt="Commission" style="width:28px; height:20px; object-fit:cover; border-radius:3px;" />
          <h4 style="font-size:0.95rem; font-weight:700; color:#166534;">
            ${allocation.commission.name} (${allocation.commission.members.length} membres)
          </h4>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; font-size:0.82rem;">
          ${allocation.commission.members.map(m => `
            <span style="background:var(--color-surface); padding:3px 9px; border-radius:4px; border:1px solid var(--color-border); font-weight:600;">
              ${m.fullName}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- États Membres -->
      <div class="card" style="border-left:4px solid #d97706; padding:12px;">
        <h4 style="font-size:0.95rem; font-weight:700; color:#92400e; margin-bottom:8px;">
          🌍 États Membres (Conseil)
        </h4>
        <div class="grid-3" style="gap:8px;">
          ${allocation.states.map(s => `
            <div style="background:var(--color-surface); padding:8px; border-radius:4px; border:1px solid var(--color-border); font-size:0.8rem;">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                ${s.icon ? `<img src="${s.icon}" alt="${s.name}" style="width:18px; height:12px; object-fit:cover;" />` : ''}
                <strong style="color:var(--color-text-main);">${s.name}</strong> (${s.members.length})
              </div>
              <div style="color:var(--color-text-muted);">
                ${s.members.map(m => m.fullName).join(', ') || 'Aucun'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Partis Politiques -->
      <div class="card" style="border-left:4px solid #2563eb; padding:12px;">
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e40af; margin-bottom:8px;">
          🇪🇺 Parlement Européen
        </h4>
        <div class="grid-3" style="gap:8px;">
          ${allocation.parties.map(p => `
            <div style="background:var(--color-surface); padding:8px; border-radius:4px; border:1px solid var(--color-border); font-size:0.8rem;">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                ${p.icon ? `<img src="${p.icon}" alt="${p.id}" style="width:18px; height:18px; object-fit:contain;" />` : ''}
                <span style="color:${p.color}; font-weight:700;">${p.id}</span> (${p.members.length})
              </div>
              <div style="color:var(--color-text-muted);">
                ${p.members.map(m => m.fullName).join(', ') || 'Aucun'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Lobbies -->
      <div class="card" style="border-left:4px solid #7c3aed; padding:12px;">
        <h4 style="font-size:0.95rem; font-weight:700; color:#5b21b6; margin-bottom:8px;">
          💼 Lobbies & Société Civile
        </h4>
        <div class="grid-3" style="gap:8px;">
          ${allocation.lobbies.map(l => `
            <div style="background:var(--color-surface); padding:8px; border-radius:4px; border:1px solid var(--color-border); font-size:0.8rem;">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                ${l.icon ? `<img src="${l.icon}" alt="${l.name}" style="width:18px; height:18px; object-fit:contain;" />` : ''}
                <strong style="color:var(--color-text-main); font-size:0.78rem;">${l.name}</strong> (${l.members.length})
              </div>
              <div style="color:var(--color-text-muted);">
                ${l.members.map(m => m.fullName).join(', ') || 'Aucun'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
