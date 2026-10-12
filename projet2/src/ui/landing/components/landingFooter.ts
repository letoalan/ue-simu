export function renderLandingFooterHtml(): string {
  return `
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-brand-col">
          <div class="footer-brand">
            <span class="footer-flag">🇪🇺</span>
            <span class="footer-title">UE-SIMU</span>
          </div>
          <p class="footer-desc">
            Simulateur pédagogique de négociation et de décision au sein de l'Union européenne. Modélisation unifiée des transitions écologiques, géopolitiques et démocratiques.
          </p>
        </div>

        <div class="footer-links-col">
          <h5>Navigation</h5>
          <ul>
            <li><a href="#heroSection">Accueil</a></li>
            <li><a href="#journeysSection">Les 3 Parcours</a></li>
            <li><a href="#materialSection">Atelier des Cartes</a></li>
            <li><a href="#workflowSectionWrapper">Déroulement</a></li>
            <li><a href="#guidesSection">Guides</a></li>
          </ul>
        </div>

        <div class="footer-credits-col">
          <h5>Crédits & Partenaires</h5>
          <p>
            Libre adaptation numérique du jeu de rôle <strong>« Panique à la Commission ! »</strong> créé par l'association <strong>Électeurs en herbe</strong>.
          </p>
          <p class="footer-copy">
            Version 2.0.0-UX • Modèle actualisé au 11 octobre 2026.
          </p>
        </div>
      </div>
    </footer>
  `;
}
