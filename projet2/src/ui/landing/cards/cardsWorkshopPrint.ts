import type { ActorCardDefinition } from './cardsTypes';
import type { PrintFilter } from './cardsWorkshopTypes';
import { buildSheets } from './cardsWorkshopSheets';
import { renderCardRectoHtml, renderCardVersoHtml } from './cardsWorkshopCardRenderers';

export function triggerPrint(cards: ActorCardDefinition[], filter: PrintFilter): void {
  let printContainer = document.getElementById('uePrintCardsContainer');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'uePrintCardsContainer';
    document.body.appendChild(printContainer);
  }

  const sheets = buildSheets(cards);
  const targetSheets = filter === 'test-sheet' ? sheets.slice(0, 1) : sheets;

  let sheetsHtml = '';
  targetSheets.forEach((sheet, idx) => {
    if (filter !== 'verso-only') {
      sheetsHtml += `
        <div class="print-page print-recto">
          <div class="print-caption">UE-SIMU · Feuille ${idx + 1}/${sheets.length} · RECTO</div>
          <div class="print-grid">
            ${sheet.recto.map(c => c ? renderCardRectoHtml(c) : '<article class="ue-card empty"></article>').join('')}
          </div>
        </div>
      `;
    }
    if (filter !== 'recto-only') {
      sheetsHtml += `
        <div class="print-page print-verso">
          <div class="print-caption">UE-SIMU · Feuille ${idx + 1}/${sheets.length} · VERSO · Miroir horizontal</div>
          <div class="print-grid">
            ${sheet.verso.map(c => c ? renderCardVersoHtml(c) : '<article class="ue-card empty"></article>').join('')}
          </div>
        </div>
      `;
    }
  });

  printContainer.innerHTML = sheetsHtml;

  document.body.classList.add('is-printing-cards');
  window.print();
  window.setTimeout(() => {
    document.body.classList.remove('is-printing-cards');
  }, 1000);
}

export function downloadAutonomousHtml(cards: ActorCardDefinition[]): void {
  const sheets = buildSheets(cards);
  const totalSheets = sheets.length;

  let sheetsHtml = '';
  sheets.forEach((sheet, idx) => {
    sheetsHtml += `
      <div class="page"><div class="caption">UE-SIMU · Feuille ${idx + 1}/${totalSheets} · RECTO</div>
      <div class="grid">${sheet.recto.map(c => c ? renderCardRectoHtml(c) : '<article class="ue-card empty"></article>').join('')}</div></div>
      <div class="page"><div class="caption">UE-SIMU · Feuille ${idx + 1}/${totalSheets} · VERSO · miroir horizontal</div>
      <div class="grid">${sheet.verso.map(c => c ? renderCardVersoHtml(c) : '<article class="ue-card empty"></article>').join('')}</div></div>
    `;
  });

  const fullHtml = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>UE-SIMU — ${cards.length} cartes de séance</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #172237; margin: 0; background: #fafafa; }
    .toolbar { padding: 20px; background: #edf2f8; text-align: center; border-bottom: 1px solid #ccc; }
    .toolbar button { padding: 10px 18px; margin: 5px; font-weight: bold; background: #003399; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .page { height: auto; min-height: 0; break-after: page; page-break-after: always; padding-top: 5mm; margin: 15px auto; width: 210mm; background: white; border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.1); break-inside: avoid; page-break-inside: avoid; }
    .page:last-child { break-after: auto; page-break-after: auto; }
    .caption { text-align: center; font-size: 9px; margin-bottom: 5mm; font-weight: bold; color: #666; }
    .grid { display: grid; grid-template-columns: 74mm 74mm; grid-template-rows: 105mm 105mm; gap: 8mm; margin: 0 auto; width: 156mm; break-inside: avoid; page-break-inside: avoid; }
    .ue-card { border: 1px dashed #777; width: 74mm; height: 105mm; overflow: hidden; background: white; position: relative; box-sizing: border-box; display: flex; flex-direction: column; margin: 0; padding: 0; border-radius: 0; break-inside: avoid; page-break-inside: avoid; }
    .ue-card.empty { opacity: 0.25; border: 1px dashed #ccc; }
    .ue-card-header { height: 11mm; padding: 2mm 3mm; color: white; font-weight: bold; font-size: 9px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; box-sizing: border-box; }
    .neg .ue-card-header, .neg .ue-score-box { background: #174d87; color: white; }
    .inf .ue-card-header, .inf .ue-score-box { background: #713a8c; color: white; }
    .card-id-badge { font-family: monospace; font-size: 9px; font-weight: bold; background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 2px; }
    .ue-card-identity { display: flex; align-items: center; gap: 2.5mm; height: 16mm; padding: 2mm 3mm; font-size: 11px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; box-sizing: border-box; }
    .ue-card-logo { width: 18mm; height: 12mm; object-fit: contain; }
    .ue-card-body { padding: 1.5mm 3mm 2mm; font-size: 9.5px; line-height: 1.2; display: flex; flex-direction: column; flex-grow: 1; box-sizing: border-box; overflow: hidden; }
    .ue-field-label { font-weight: bold; font-size: 8.5px; margin: 1.2mm 0 0.4mm; color: #1e293b; }
    .ue-field-value { margin: 0 0 1mm; font-size: 9px; }
    .ue-field-desc { margin: 0.8mm 0 1.2mm; font-size: 8.5px; }
    .ue-field-line { border-bottom: 1px solid #8892a3; height: 3.8mm; margin-bottom: 0.5mm; }
    .ue-score-box { text-align: center; font-weight: bold; padding: 1.5mm 2mm; margin: 1.5mm 0; font-size: 12px; border-radius: 3px; }
    .ue-score-sub { font-size: 8.5px; font-weight: normal; }
    .ue-card-notice { font-size: 7px; color: #555; display: block; text-align: center; margin-top: 1mm; }
    .ue-status-box { font-size: 8px; margin: 1.2mm 0 0.8mm; border: 1px solid #cbd5e1; padding: 1mm 1.5mm; border-radius: 2px; background: #f8fafc; }
    @media print {
      .toolbar { display: none; }
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { margin: 0; border: none; box-shadow: none; width: auto; height: auto; padding-top: 4mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>UE-SIMU — ${cards.length} cartes prêtes pour impression</h1>
    <p>A4 portrait · 4 cartes A7 par feuille · Impression à 100%, recto-verso bord long.</p>
    <button onclick="window.print()">🖨️ Ouvrir la boîte d'impression</button>
  </div>
  ${sheetsHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ue-simu-cartes-${cards.length}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
