import type { ActorCardDefinition } from './cardsTypes';
import type { WorkshopState } from './cardsWorkshopTypes';
import { ALL_89_CARDS, filterCardsByActors } from './cardsData';
import { renderCardRectoHtml, renderCardVersoHtml } from './cardsWorkshopCardRenderers';
import { buildSheets, calculateSummary, renderSheetsViewerHtml } from './cardsWorkshopSheets';
import { renderModeSubPanel, renderSingleCardViewerHtml } from './cardsWorkshopSubPanels';
import { triggerPrint, downloadAutonomousHtml } from './cardsWorkshopPrint';
import { attachCardsWorkshopEvents as attachEvents } from './cardsWorkshopEvents';

export {
  renderCardRectoHtml,
  renderCardVersoHtml,
  buildSheets,
  calculateSummary,
  triggerPrint,
  downloadAutonomousHtml
};

const state: WorkshopState = {
  mode: 'all',
  singleActorCode: 'COM',
  selectedActorCodes: ['COM', 'DE', 'FR', 'PPE', 'SD', 'TECH'],
  replacementCardId: 'COM-N1',
  previewTab: 'cards',
  currentCardIndex: 0,
  currentCardFlipped: false,
  printFilter: 'duplex'
};

export function getActiveCards(): ActorCardDefinition[] {
  if (state.mode === 'all') {
    return ALL_89_CARDS;
  }
  if (state.mode === 'single') {
    return filterCardsByActors([state.singleActorCode]);
  }
  if (state.mode === 'custom') {
    return filterCardsByActors(state.selectedActorCodes);
  }
  if (state.mode === 'replacement') {
    const card = ALL_89_CARDS.find(c => c.id === state.replacementCardId) || ALL_89_CARDS[0];
    return [{ ...card, isReplacement: true }];
  }
  return ALL_89_CARDS;
}

export function renderCardsWorkshopHtml(): string {
  const activeCards = getActiveCards();
  const summary = calculateSummary(activeCards);
  const totalCards = activeCards.length;
  const currentCard = activeCards[state.currentCardIndex] || activeCards[0] || ALL_89_CARDS[0];

  return `
    <div class="cards-workshop" id="cardsWorkshopSection">
      <!-- En-tête de section -->
      <div class="section-header-block">
        <span class="section-kicker">🎴 Matériel de Séance Pédagogique</span>
        <h2 class="section-title">L’Atelier des 89 Cartes</h2>
        <p class="section-lead">
          Visualisez, personnalisez et imprimez les cartes de jeu au format standard A7 (4 cartes par feuille A4 portrait, recto-verso bord long avec repérage strict en miroir).
        </p>
      </div>

      <!-- Étape 1 : Choix du tirage -->
      <div class="workshop-step-box">
        <div class="step-box-header">
          <div class="step-num">1</div>
          <div>
            <h3 class="step-title">Configuration du Tirage</h3>
            <p class="step-desc">Sélectionnez le jeu complet officiel, le lot d’un acteur spécifique ou une carte perdue à remplacer.</p>
          </div>
        </div>

        <div class="material-mode-selector">
          <label class="mode-radio-card ${state.mode === 'all' ? 'active' : ''}">
            <input type="radio" name="workshopMode" value="all" ${state.mode === 'all' ? 'checked' : ''} />
            <div>
              <div class="radio-card-title">📦 Jeu Complet (89 cartes)</div>
              <div class="radio-card-sub">Stock officiel de séance pour les 19 acteurs (23 planches recto-verso A4).</div>
            </div>
          </label>

          <label class="mode-radio-card ${state.mode === 'single' ? 'active' : ''}">
            <input type="radio" name="workshopMode" value="single" ${state.mode === 'single' ? 'checked' : ''} />
            <div>
              <div class="radio-card-title">👤 Par Acteur Spécifique</div>
              <div class="radio-card-sub">Imprimez uniquement le jeu individuel d’un élève (4 ou 5 cartes).</div>
            </div>
          </label>

          <label class="mode-radio-card ${state.mode === 'custom' ? 'active' : ''}">
            <input type="radio" name="workshopMode" value="custom" ${state.mode === 'custom' ? 'checked' : ''} />
            <div>
              <div class="radio-card-title">🎯 Sélection Sur Mesure</div>
              <div class="radio-card-sub">Cochez les entités présentes à votre séance (ex. 6 États uniquement).</div>
            </div>
          </label>

          <label class="mode-radio-card ${state.mode === 'replacement' ? 'active' : ''}">
            <input type="radio" name="workshopMode" value="replacement" ${state.mode === 'replacement' ? 'checked' : ''} />
            <div>
              <div class="radio-card-title">🔄 Carte de Remplacement</div>
              <div class="radio-card-sub">Réimprimez une carte égarée ou détériorée avec mention officielle.</div>
            </div>
          </label>
        </div>

        ${renderModeSubPanel(state)}
      </div>

      <!-- Étape 2 : Prévisualisation & Impression -->
      <div class="workshop-step-box">
        <div class="step-box-header">
          <div class="step-num">2</div>
          <div>
            <h3 class="step-title">Prévisualisation Réelle & Impression</h3>
            <p class="step-desc">Consultez chaque carte en 3D interactive ou affichez la planche de découpe prête pour l'imprimante.</p>
          </div>
        </div>

        <!-- Métriques du lot actif -->
        <div class="active-batch-metrics">
          <div class="metric-chip">
            <span class="chip-val">${summary.totalCards}</span>
            <span class="chip-lbl">Cartes à imprimer</span>
          </div>
          <div class="metric-chip">
            <span class="chip-val">${summary.actorCount}</span>
            <span class="chip-lbl">Acteurs concernés</span>
          </div>
          <div class="metric-chip">
            <span class="chip-val">${summary.negCount}</span>
            <span class="chip-lbl">Négociations (+10 / −20)</span>
          </div>
          <div class="metric-chip">
            <span class="chip-val">${summary.infCount}</span>
            <span class="chip-lbl">Influences (+5)</span>
          </div>
          <div class="metric-chip highlight">
            <span class="chip-val">${summary.sheetCount}</span>
            <span class="chip-lbl">Feuilles A4 (Recto-Verso)</span>
          </div>
        </div>

        <div class="preview-toolbar">
          <div class="preview-tabs">
            <button class="preview-tab-btn ${state.previewTab === 'cards' ? 'active' : ''}" data-preview="cards">
              🎴 Voir les cartes (Unitaire)
            </button>
            <button class="preview-tab-btn ${state.previewTab === 'sheets' ? 'active' : ''}" data-preview="sheets">
              📄 Voir les planches (Impression réelle)
            </button>
          </div>

          <div class="preview-actions">
            <select class="print-filter-select" id="printFilterSelect" aria-label="Mode d'impression">
              <option value="duplex" ${state.printFilter === 'duplex' ? 'selected' : ''}>Jeu sélectionné (Recto & Verso)</option>
              <option value="recto-only" ${state.printFilter === 'recto-only' ? 'selected' : ''}>Rectos uniquement</option>
              <option value="verso-only" ${state.printFilter === 'verso-only' ? 'selected' : ''}>Versos uniquement</option>
              <option value="test-sheet" ${state.printFilter === 'test-sheet' ? 'selected' : ''}>Feuille test (1ère feuille recto-verso)</option>
            </select>

            <button class="btn btn-primary btn-print" id="btnPrintCards">
              🖨️ Imprimer / Enregistrer en PDF
            </button>

            <button class="btn btn-secondary" id="btnDownloadHtml">
              📥 Télécharger le jeu HTML
            </button>
          </div>
        </div>

        <!-- Zone d'aperçu dynamique -->
        <div class="preview-display-area" id="previewDisplayArea">
          ${state.previewTab === 'cards' ? renderSingleCardViewerHtml(currentCard, state.currentCardIndex, totalCards, state) : renderSheetsViewerHtml(activeCards)}
        </div>

        <!-- Guide d'aide à l'impression -->
        <div class="print-guide-banner">
          <h4>💡 Guide pour une impression recto-verso parfaite</h4>
          <ol class="print-guide-steps">
            <li><strong>Format du papier :</strong> Sélectionnez <code>A4 Portrait</code> dans les paramètres d'impression.</li>
            <li><strong>Échelle :</strong> Choisissez <code>100%</code> (Taille réelle, désactivez « Ajuster à la page »).</li>
            <li><strong>En-têtes et pieds de page :</strong> Décochez les en-têtes/pieds de page du navigateur pour préserver les marges.</li>
            <li><strong>Recto-verso :</strong> Activez le recto-verso avec <code>Retourner sur les bords longs</code> (Long-edge binding).</li>
            <li><strong>Feuille test :</strong> Utilisez l'option « Feuille test » pour imprimer la première feuille et vérifier le repérage avant le tirage complet.</li>
          </ol>
        </div>
      </div>
    </div>
  `;
}

export function attachCardsWorkshopEvents(container: HTMLElement, onRerender: () => void): void {
  attachEvents(container, state, getActiveCards, onRerender);
}
