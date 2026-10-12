import type { GuideDefinition } from './guideTypes';

export function renderEssentials(guide: GuideDefinition): string {
  return `
    <div class="essentials-view">
      <div class="essentials-hero">
        <div class="essentials-badge">${guide.badge}</div>
        <h3 class="essentials-title">${guide.title}</h3>
        <p class="essentials-desc">${guide.subtitle}</p>
      </div>

      <div class="essentials-list">
        ${guide.essentials.map((item, index) => `
          <div class="essential-card">
            <div class="essential-num">${index + 1}</div>
            <div class="essential-text">${item}</div>
          </div>
        `).join('')}
      </div>

      <div class="essentials-call-to-action">
        <button class="btn btn-secondary" id="btnSwitchToFullGuide">
          📖 Lire le guide complet détaillé avec tous les tableaux et sections →
        </button>
      </div>
    </div>
  `;
}

export function renderFullWithToc(guide: GuideDefinition): string {
  return `
    <div class="full-guide-container">
      <!-- Sommaire latéral à gauche (Desktop) -->
      <aside class="guide-toc-sidebar" aria-label="Sommaire du guide">
        <div class="toc-title">📋 Sommaire</div>
        <nav class="toc-nav">
          ${guide.sections.map(s => `
            <a href="#${s.id}" class="toc-link" data-target="${s.id}">
              ${s.title}
            </a>
          `).join('')}
        </nav>
      </aside>

      <!-- Contenu lisible à droite -->
      <article class="guide-content-article">
        <div class="guide-content-header">
          <span class="guide-content-badge">${guide.badge}</span>
          <h2 class="guide-article-title">${guide.title}</h2>
          <p class="guide-article-subtitle">${guide.subtitle}</p>
        </div>

        <div class="guide-sections-list">
          ${guide.sections.map(s => `
            <section class="guide-section-block" id="${s.id}">
              <h3 class="section-heading">${s.title}</h3>
              <div class="section-html-body">${s.contentHtml}</div>
            </section>
          `).join('')}
        </div>
      </article>
    </div>
  `;
}

export function renderResources(guide: GuideDefinition): string {
  return `
    <div class="resources-view">
      <div class="resources-grid">
        <div class="resource-card">
          <div class="resource-icon">📥</div>
          <h4>Fichier Markdown Source</h4>
          <p>Consultez ou intégrez le document source <code>${guide.id}.md</code> dans vos propres supports ou plateformes scolaires.</p>
          <button class="btn btn-sm btn-primary" id="btnDownloadMdFile">
            Télécharger ${guide.id}.md (UTF-8)
          </button>
        </div>

        <div class="resource-card">
          <div class="resource-icon">🖨️</div>
          <h4>Impression & Export PDF</h4>
          <p>Feuille de style adaptée <code>@media print</code> pour imprimer ce guide sur papier A4 ou l'exporter au format PDF propre.</p>
          <button class="btn btn-sm btn-secondary" id="btnPrintGuideAction">
            Imprimer le guide du ${guide.badge}
          </button>
        </div>

        <div class="resource-card">
          <div class="resource-icon">📊</div>
          <h4>Modèle de Registre des Cartes</h4>
          <p>Modèle officiel de tableau CSV pour consigner l'ensemble des 89 cartes de négociation et d'influence distribuées.</p>
          <button class="btn btn-sm btn-secondary" id="btnDownloadRegistryCsv">
            Télécharger le registre type (CSV)
          </button>
        </div>

        <div class="resource-card">
          <div class="resource-icon">🎧</div>
          <h4>Podcasts & Synthèses audio</h4>
          <p>Accédez aux épisodes immersifs et aux synthèses des directives via le lecteur persistant de l'application.</p>
          <a href="#resourcesSection" class="btn btn-sm btn-outline">
            Écouter les épisodes
          </a>
        </div>
      </div>
    </div>
  `;
}
