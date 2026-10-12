import type { GuideDefinition } from './guideTypes';

export function downloadRegistryCsvTemplate(): void {
  const headers = [
    'Identifiant_Carte',
    'Acteur_Emetteur',
    'Type_Carte',
    'Receveur_Groupe',
    'Phase_Directive',
    'Action_Promise',
    'Condition_Echeance',
    'Statut_Denonciation',
    'Points_Receveur'
  ];
  const sampleRows = [
    ['COM-N1', 'Commission européenne', 'Négociation', 'France', 'D1 - Amendement 2', 'Soutenir l’enveloppe de transition', 'Adoption du compromis', 'Non dénoncée', '10'],
    ['DE-N1', 'Allemagne', 'Négociation', 'PPE', 'D1 - Directive', 'Vote pour au Conseil', 'Avant clôture Phase A', 'Non dénoncée', '10'],
    ['FR-I1', 'France', 'Influence', 'Agrochimie', 'D1 - Discussion', 'Note technique sur les engrais', 'Phase de négociation', 'Transfert vérifié', '5'],
    ['TECH-I1', 'Big Tech & IA', 'Influence', 'Renew Europe', 'D1 - Amendement 4', 'Plaidoyer pour l’innovation', 'Avant vote Parlement', 'Transfert vérifié', '5']
  ];

  const csvContent = '\uFEFF' + [headers.join(';'), ...sampleRows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UE-SIMU-registre-cartes-modele.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadGuideMarkdown(guide: GuideDefinition): void {
  const blob = new Blob([guide.markdownContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UE-SIMU-guide-${guide.id}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
