import { GUIDES_DATA } from './guidesData';
import { store } from '../../../state/store';
import { renderEssentials, renderFullWithToc, renderResources } from './guideReaderRenderers';
import { downloadRegistryCsvTemplate, downloadGuideMarkdown } from './guideReaderExport';

export type GuideId = 'joueur' | 'animateur' | 'master';
export type ReadingLevel = 'essentials' | 'full' | 'resources';

export { downloadRegistryCsvTemplate };

interface ReaderState {
  currentGuideId: GuideId;
  readingLevel: ReadingLevel;
  searchFilter: string;
}

const readerState: ReaderState = {
  currentGuideId: 'joueur',
  readingLevel: 'essentials',
  searchFilter: ''
};

export function setGuideReaderActive(guideId: GuideId, level: ReadingLevel = 'essentials'): void {
  readerState.currentGuideId = guideId;
  readerState.readingLevel = level;
}

export function renderGuideReaderHtml(): string {
  const guide = GUIDES_DATA[readerState.currentGuideId] || GUIDES_DATA.joueur;

  return `
    <div class="guide-reader" id="guideReaderSection">
      <!-- En-tête du lecteur -->
      <div class="reader-header-bar">
        <div class="reader-guide-tabs">
          <button class="reader-guide-btn ${readerState.currentGuideId === 'joueur' ? 'active' : ''}" data-guide="joueur">
            🎓 Guide Participant
          </button>
          <button class="reader-guide-btn ${readerState.currentGuideId === 'animateur' ? 'active' : ''}" data-guide="animateur">
            🎙️ Guide Animateur
          </button>
          <button class="reader-guide-btn ${readerState.currentGuideId === 'master' ? 'active' : ''}" data-guide="master">
            ⚙️ Guide Maître du Jeu
          </button>
        </div>

        <div class="reader-version-badge" title="Statut éditorial">
          <span>🏷️ ${guide.version}</span> • <span>📅 ${guide.revisionDate}</span> • <span>🏛️ ${guide.model}</span>
        </div>
      </div>

      <!-- Barre des 3 niveaux de lecture -->
      <div class="reading-levels-bar">
        <div class="levels-switcher">
          <button class="level-btn ${readerState.readingLevel === 'essentials' ? 'active' : ''}" data-level="essentials">
            ⚡ 1. L’Essentiel en 2 min
          </button>
          <button class="level-btn ${readerState.readingLevel === 'full' ? 'active' : ''}" data-level="full">
            📖 2. Guide Complet
          </button>
          <button class="level-btn ${readerState.readingLevel === 'resources' ? 'active' : ''}" data-level="resources">
            📦 3. Ressources & Téléchargement
          </button>
        </div>

        <div class="reader-quick-actions">
          <button class="btn btn-sm btn-outline" id="btnDownloadMarkdown" title="Télécharger le fichier .md d'origine">
            📥 Télécharger le .MD
          </button>
          <button class="btn btn-sm btn-outline" id="btnPrintGuide" title="Imprimer le guide">
            🖨️ Imprimer
          </button>
          <button class="btn btn-sm btn-primary" id="btnStartWithJourney">
            🚀 ${guide.actionLaunchText} →
          </button>
        </div>
      </div>

      <!-- Contenu du guide selon le niveau -->
      <div class="reader-body-layout">
        ${readerState.readingLevel === 'full' ? renderFullWithToc(guide) : readerState.readingLevel === 'essentials' ? renderEssentials(guide) : renderResources(guide)}
      </div>

      <!-- Pied du lecteur pour retour facile ou lancement -->
      <div class="reader-footer-bar">
        <div class="footer-info">
          <span>Vous consultez : <strong>${guide.title}</strong></span>
          <span class="footer-sep">•</span>
          <span>${guide.shortDesc}</span>
        </div>
        <div class="footer-actions">
          <a href="#cardsWorkshopSection" class="btn btn-sm btn-outline" id="btnJumpToCards">
            🃏 Aller aux règles des cartes
          </a>
          <button class="btn btn-sm btn-primary" id="btnFooterStartJourney">
            ${guide.actionLaunchText} 🚀
          </button>
        </div>
      </div>
    </div>
  `;
}

export function attachGuideReaderEvents(container: HTMLElement, onRerender: () => void): void {
  // Guide switching
  container.querySelectorAll('.reader-guide-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-guide') as GuideId;
      if (g) {
        readerState.currentGuideId = g;
        onRerender();
      }
    });
  });

  // Level switching
  container.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const l = btn.getAttribute('data-level') as ReadingLevel;
      if (l) {
        readerState.readingLevel = l;
        onRerender();
      }
    });
  });

  // Switch to full from essentials
  container.querySelector('#btnSwitchToFullGuide')?.addEventListener('click', () => {
    readerState.readingLevel = 'full';
    onRerender();
  });

  // Download Markdown
  const triggerMdDownload = () => {
    const guide = GUIDES_DATA[readerState.currentGuideId];
    downloadGuideMarkdown(guide);
  };

  container.querySelector('#btnDownloadMarkdown')?.addEventListener('click', triggerMdDownload);
  container.querySelector('#btnDownloadMdFile')?.addEventListener('click', triggerMdDownload);

  // Print Guide
  container.querySelector('#btnPrintGuide')?.addEventListener('click', () => window.print());
  container.querySelector('#btnPrintGuideAction')?.addEventListener('click', () => window.print());

  // Download CSV registry
  container.querySelector('#btnDownloadRegistryCsv')?.addEventListener('click', () => {
    downloadRegistryCsvTemplate();
  });

  // Launch Journey
  const launchJourney = () => {
    const guide = GUIDES_DATA[readerState.currentGuideId];
    store.setUserJourney(guide.journey);
    if (guide.journey === 'participant') {
      store.setActiveTab('actors');
    } else {
      store.setActiveTab('intro');
    }
  };

  container.querySelector('#btnStartWithJourney')?.addEventListener('click', launchJourney);
  container.querySelector('#btnFooterStartJourney')?.addEventListener('click', launchJourney);

  // Smooth TOC clicks
  container.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        const el = container.querySelector(`#${targetId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
