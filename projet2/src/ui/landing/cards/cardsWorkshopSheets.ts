import type { ActorCardDefinition } from './cardsTypes';
import type { Sheet } from './cardsWorkshopTypes';
import { renderCardRectoHtml, renderCardVersoHtml } from './cardsWorkshopCardRenderers';

export function buildSheets(cards: ActorCardDefinition[]): Sheet[] {
  const sheets: Sheet[] = [];
  const chunkSize = 4;

  for (let i = 0; i < cards.length; i += chunkSize) {
    const chunk = cards.slice(i, i + chunkSize);
    const recto: (ActorCardDefinition | null)[] = [
      chunk[0] || null,
      chunk[1] || null,
      chunk[2] || null,
      chunk[3] || null
    ];

    // Miroir horizontal strict pour le verso
    // Recto : [0, 1]      Verso : [1, 0]
    //         [2, 3]              [3, 2]
    const verso: (ActorCardDefinition | null)[] = [
      chunk[1] || null,
      chunk[0] || null,
      chunk[3] || null,
      chunk[2] || null
    ];

    sheets.push({ recto, verso });
  }

  return sheets;
}

export function calculateSummary(cards: ActorCardDefinition[]) {
  const actors = new Set(cards.map(c => c.actorCode));
  const negCount = cards.filter(c => c.type === 'neg').length;
  const infCount = cards.filter(c => c.type === 'inf').length;
  const totalCards = cards.length;
  const sheetCount = Math.ceil(totalCards / 4);

  return {
    actorCount: actors.size,
    negCount,
    infCount,
    totalCards,
    sheetCount
  };
}

export function renderSheetsViewerHtml(cards: ActorCardDefinition[]): string {
  const sheets = buildSheets(cards);

  return `
    <div class="sheets-viewer-container">
      <div class="sheets-viewer-header">
        <p>Aperçu réel d’impression A4 portrait (2x2 cartes A7 par feuille). Les versos sont automatiquement orientés en <strong>miroir horizontal</strong> pour coïncider avec les rectos lors de l'impression recto-verso bord long.</p>
      </div>
      <div class="sheets-list">
        ${sheets.map((sheet, sheetIndex) => `
          <div class="sheet-pair-container">
            <!-- Feuille RECTO -->
            <div class="sheet-paper recto">
              <div class="sheet-caption">Feuille ${sheetIndex + 1}/${sheets.length} · RECTO</div>
              <div class="sheet-grid">
                ${sheet.recto.map(c => c ? renderCardRectoHtml(c) : '<article class="ue-card empty"></article>').join('')}
              </div>
            </div>

            <!-- Feuille VERSO (Miroir) -->
            <div class="sheet-paper verso">
              <div class="sheet-caption">Feuille ${sheetIndex + 1}/${sheets.length} · VERSO (Miroir horizontal)</div>
              <div class="sheet-grid">
                ${sheet.verso.map(c => c ? renderCardVersoHtml(c) : '<article class="ue-card empty"></article>').join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
