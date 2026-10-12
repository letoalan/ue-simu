import type { ActorCardDefinition } from './cardsTypes';
import type { WorkshopState } from './cardsWorkshopTypes';
import { ACTORS_CATALOG, ALL_89_CARDS } from './cardsData';
import { renderCardRectoHtml, renderCardVersoHtml } from './cardsWorkshopCardRenderers';

export function renderModeSubPanel(state: WorkshopState): string {
  if (state.mode === 'single') {
    return `
      <div class="mode-subpanel">
        <label class="subpanel-label" for="singleActorSelect">Choisir l’acteur à préparer :</label>
        <select class="form-select" id="singleActorSelect">
          ${ACTORS_CATALOG.map(a => `
            <option value="${a.code}" ${a.code === state.singleActorCode ? 'selected' : ''}>
              ${a.name} (${a.categoryLabel} — ${a.totalCards} cartes)
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  if (state.mode === 'custom') {
    const selectedSet = new Set(state.selectedActorCodes);
    return `
      <div class="mode-subpanel">
        <div class="custom-actions-bar">
          <span class="custom-hint">Cochez les acteurs à imprimer :</span>
          <div class="custom-btn-group">
            <button class="btn btn-sm btn-outline" id="btnSelectAllActors">Tous (19)</button>
            <button class="btn btn-sm btn-outline" id="btnSelectStates">6 États</button>
            <button class="btn btn-sm btn-outline" id="btnSelectParties">6 Partis</button>
            <button class="btn btn-sm btn-outline" id="btnSelectLobbies">6 Lobbies</button>
            <button class="btn btn-sm btn-outline" id="btnSelectNone">Aucun</button>
          </div>
        </div>

        <div class="custom-actors-grid">
          ${ACTORS_CATALOG.map(actor => {
            const isChecked = selectedSet.has(actor.code);
            return `
              <label class="actor-checkbox-card ${isChecked ? 'selected' : ''}">
                <input type="checkbox" class="actor-check" data-actor="${actor.code}" ${isChecked ? 'checked' : ''} />
                <img src="${actor.image}" alt="${actor.name}" class="actor-thumb" />
                <div class="actor-info">
                  <div class="actor-title">${actor.name}</div>
                  <div class="actor-meta">${actor.negCount} négoc. · ${actor.infCount} influ.</div>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  if (state.mode === 'replacement') {
    return `
      <div class="mode-subpanel">
        <label class="subpanel-label" for="replacementCardSelect">Sélectionner la carte spécifique à réimprimer :</label>
        <select class="form-select" id="replacementCardSelect">
          ${ALL_89_CARDS.map(c => `
            <option value="${c.id}" ${c.id === state.replacementCardId ? 'selected' : ''}>
              [${c.id}] ${c.actorName} — ${c.typeLabel}
            </option>
          `).join('')}
        </select>
        <p class="replacement-note">
          ⚠️ La carte de remplacement conservera son identifiant unique avec la mention officielle <strong>« Réimpression »</strong>. Elle ne crée pas de carte supplémentaire dans le stock légal.
        </p>
      </div>
    `;
  }

  return '';
}

export function renderSingleCardViewerHtml(
  card: ActorCardDefinition,
  index: number,
  total: number,
  state: WorkshopState
): string {
  const isFlipped = state.currentCardFlipped;

  return `
    <div class="single-card-viewer">
      <div class="viewer-nav">
        <button class="btn btn-sm btn-outline" id="btnPrevCard" ${index === 0 ? 'disabled' : ''}>◀ Précédente</button>
        <span class="viewer-counter">Carte <strong>${index + 1}</strong> sur <strong>${total}</strong> — <code>${card.id}</code></span>
        <button class="btn btn-sm btn-outline" id="btnNextCard" ${index >= total - 1 ? 'disabled' : ''}>Suivante ▶</button>
      </div>

      <div class="card-flip-stage">
        <div class="interactive-card ${isFlipped ? 'flipped' : ''}" id="interactiveFlipCard" title="Cliquez pour tourner la carte (Recto / Verso)">
          <!-- Face Recto -->
          <div class="card-face card-recto ${card.type}">
            ${renderCardRectoHtml(card)}
          </div>

          <!-- Face Verso -->
          <div class="card-face card-verso ${card.type}">
            ${renderCardVersoHtml(card)}
          </div>
        </div>
      </div>

      <div class="viewer-controls">
        <button class="btn btn-secondary btn-sm" id="btnFlipCard">
          🔄 Tourner la carte (${isFlipped ? 'Afficher le Recto' : 'Afficher le Verso'})
        </button>
      </div>
    </div>
  `;
}
