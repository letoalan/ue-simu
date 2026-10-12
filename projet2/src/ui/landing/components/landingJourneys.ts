import type { UserJourney } from '../../../state/store';

export function renderLandingJourneysHtml(currentJourney: UserJourney): string {
  return `
    <section class="landing-section journeys-section" id="journeysSection">
      <div class="section-container">
        <div class="section-header-block">
          <span class="section-kicker">🧭 3 Entrées Pédagogiques Dédiées</span>
          <h2 class="section-title">Je Choisis mon Parcours</h2>
          <p class="section-lead">
            Chaque protagoniste dispose d'une interface adaptée à ses responsabilités. Consultez le guide pour vous préparer, ou entrez directement dans l'action.
          </p>
        </div>

        <div class="journeys-grid">
          <!-- Parcours Participant -->
          <div class="journey-card ${currentJourney === 'participant' ? 'journey-current' : ''}" data-journey-card="participant">
            <div class="journey-card-top">
              <span class="journey-icon">🎓</span>
              <span class="journey-role-badge">Élève / Délégué</span>
            </div>
            <h3 class="journey-title">Participant</h3>
            <p class="journey-quote">« Je prépare mon rôle, mes arguments et mes engagements. »</p>
            <ul class="journey-perks">
              <li>🎭 Fiche d’acteur confidentielle et lignes rouges</li>
              <li>📜 Dépôt et négociation des amendements</li>
              <li>🤝 Échange de cartes de négociation et d’influence</li>
              <li>📊 Suivi de la satisfaction de son entité</li>
            </ul>
            <div class="journey-card-buttons">
              <button class="btn btn-secondary btn-journey-prep" data-read-guide="joueur">
                📖 Lire le guide joueur
              </button>
              <button class="btn btn-primary btn-journey-launch" data-launch-journey="participant">
                Commencer comme participant 🚀
              </button>
            </div>
          </div>

          <!-- Parcours Animateur -->
          <div class="journey-card ${currentJourney === 'animateur' ? 'journey-current' : ''}" data-journey-card="animateur">
            <div class="journey-card-top">
              <span class="journey-icon">🎙️</span>
              <span class="journey-role-badge">Enseignant / Présidence</span>
            </div>
            <h3 class="journey-title">Animateur</h3>
            <p class="journey-quote">« Je conduis les échanges, les votes et le débriefing. »</p>
            <ul class="journey-perks">
              <li>⏱️ Conduite de séance et maîtrise du temps</li>
              <li>🗳️ Contrôle des quorums (Conseil & Parlement)</li>
              <li>⚖️ Tenue du Registre officiel des 89 cartes</li>
              <li>📽️ Projection des courbes comparatives sur 10 ans</li>
            </ul>
            <div class="journey-card-buttons">
              <button class="btn btn-secondary btn-journey-prep" data-read-guide="animateur">
                📖 Lire le guide animateur
              </button>
              <button class="btn btn-primary btn-journey-launch" data-launch-journey="animateur">
                Ouvrir la conduite de séance 🚀
              </button>
            </div>
          </div>

          <!-- Parcours Maître du Jeu -->
          <div class="journey-card ${currentJourney === 'maitre_du_jeu' ? 'journey-current' : ''}" data-journey-card="maitre_du_jeu">
            <div class="journey-card-top">
              <span class="journey-icon">⚙️</span>
              <span class="journey-role-badge">Superviseur / Organisateur</span>
            </div>
            <h3 class="journey-title">Maître du Jeu</h3>
            <p class="journey-quote">« Je prépare la session, les règles et le matériel. »</p>
            <ul class="journey-perks">
              <li>👥 Attribution automatique des 19 rôles au groupe</li>
              <li>🎲 Contrôle de la graine du simulateur (PRNG)</li>
              <li>💾 Sauvegarde et restauration locale de session</li>
              <li>📑 Superviseur de l'intégrité et arbitrage des cartes</li>
            </ul>
            <div class="journey-card-buttons">
              <button class="btn btn-secondary btn-journey-prep" data-read-guide="master">
                📖 Lire le guide maître du jeu
              </button>
              <button class="btn btn-primary btn-journey-launch" data-launch-journey="maitre_du_jeu">
                Ouvrir la configuration 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
