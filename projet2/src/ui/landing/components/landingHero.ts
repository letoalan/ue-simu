import type { UserJourney } from '../../../state/store';

export function formatJourneyName(journey: UserJourney): string {
  switch (journey) {
    case 'participant':
      return '🎓 Participant';
    case 'animateur':
      return '🎙️ Animateur';
    case 'maitre_du_jeu':
      return '⚙️ Maître du Jeu';
    default:
      return '🎓 Participant';
  }
}

export function renderLandingHeroHtml(
  directiveId: number,
  directiveName: string,
  userJourney: UserJourney,
  hasSessionActivity: boolean
): string {
  return `
    <section class="landing-hero" id="heroSection">
      <!-- Vidéo d'ambiance en arrière-plan avec calque transparent -->
      <div class="hero-video-wrapper" aria-hidden="true">
        <iframe
          class="hero-video-iframe"
          src="https://www.youtube-nocookie.com/embed/_k5MnY859Wo?autoplay=1&mute=1&controls=0&loop=1&playlist=_k5MnY859Wo&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
          title="Ambiance vidéo UE-SIMU"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabindex="-1"
        ></iframe>
        <div class="hero-video-layer"></div>
      </div>

      <div class="hero-inner">
        <!-- 1. Encart d'accroche -->
        <div class="hero-eyebrow">
          <span class="hero-flag-icon">🇪🇺</span>
          <span class="hero-eyebrow-text">Plateforme Pédagogique Institutionnelle & Négociation</span>
        </div>

        <!-- 2. Titre et sous-titre de la simulation -->
        <h1 class="hero-title">
          <span class="hero-title-main">UE-SIMU</span>
          <span class="hero-title-sub">Négocier l’Europe, comprendre les conséquences</span>
        </h1>

        <!-- 3. Pitch narratif -->
        <p class="hero-narrative">
          Plongez au cœur de la démocratie européenne : incarnez <strong>19 acteurs décisionnels</strong> (États membres, groupes du Parlement européen, Commission et lobbies de la société civile), forgez des compromis historiques et simulez en temps réel les trajectoires socio-écologiques sur 10 ans (2025–2034).
        </p>

        <!-- 4. Barre d'actions principales (CTA) -->
        <div class="hero-actions-bar">
          <button class="btn btn-primary btn-hero-main" id="btnEnterSimulation">
            🚀 Entrer dans la simulation
          </button>

          ${hasSessionActivity ? `
            <button class="btn btn-warning btn-hero-resume" id="btnResumeSession" title="Reprendre votre travail sur D${directiveId} (${directiveName}) sans perte de votes">
              🔄 Reprendre ma session (${formatJourneyName(userJourney)})
            </button>
          ` : ''}

          <button class="btn btn-secondary btn-hero-sec" id="btnConsultRules">
            📜 Découvrir les règles
          </button>

          <button class="btn btn-outline btn-hero-cards" id="btnPrepareCards">
            🎴 Préparer le matériel (89 cartes)
          </button>
        </div>

        <!-- 5. Mention d'adaptation légale & partenariat en pied de hero -->
        <div class="hero-adaptation-mention">
          <span>🤝 Libre adaptation pédagogique du jeu</span>
          <a href="https://www.electeursenherbe.fr/jeu-pedagogique-panique-a-la-commission-un-jeu-de-role-pour-comprendre-leurope/" target="_blank" rel="noopener noreferrer">
            « Panique à la Commission : un jeu de rôle pour comprendre l’Europe »
          </a>
          <span>conçu par l'association <em>Électeurs en herbe</em>.</span>
        </div>
      </div>
    </section>
  `;
}
