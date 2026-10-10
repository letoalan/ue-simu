import { renderJourneyCardsHtml } from './introJourneyCards';
import type { UserJourney } from '../../state/store';

/**
 * Sous-onglet 1 : Immersion Vidéo Europa, 3 Cartes de Parcours UX, 4 piliers d'acteurs et schéma
 */
export function renderImmersionSubTab(userJourney: UserJourney = 'participant'): string {
  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <!-- Portails de Parcours UX (ux.md) & Gestion de Session -->
      ${renderJourneyCardsHtml(userJourney)}

      <!-- Hero Banner Vidéo Europa -->
      <div class="card" style="padding:20px;">
        <div class="hero-media-wrapper" style="margin-bottom:16px;">
          <video
            id="introHeroVideo"
            class="hero-video"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            poster="./medias/images/euro/instiue.jpg"
            aria-label="Vidéo d'immersion européenne"
          >
            <source src="./medias/video/Europa.mp4" type="video/mp4" />
          </video>
          <div class="hero-overlay">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.2); backdrop-filter:blur(6px); padding:4px 12px; border-radius:var(--radius-full); width:fit-content; font-size:0.78rem; font-weight:700; margin-bottom:4px;">
              <span>🇪🇺</span>
              <span>Immersion Institutionnelle</span>
            </div>
            <h2 style="font-size:clamp(1.1rem, 2.6vw, 1.6rem); font-weight:800; line-height:1.2; text-shadow:0 2px 4px rgba(0,0,0,0.5);">
              Au Cœur des Décisions de l'Union Européenne
            </h2>
          </div>
          <button id="btnToggleVideoPlay" class="hero-video-toggle" type="button" aria-label="Pause ou lecture de la vidéo">
            <span id="videoPlayIcon">⏸️</span>
            <span id="videoPlayText">Pause</span>
          </button>
        </div>

        <div style="max-width:860px; margin:0 auto; text-align:center;">
          <h1 style="font-size:clamp(1.25rem, 2.8vw, 1.75rem); font-weight:800; color:var(--color-primary); line-height:1.3; margin-bottom:8px;">
            Simulation de Négociation & Codécision Européenne
          </h1>
          <p style="font-size:0.95rem; color:var(--color-text-main); line-height:1.6; margin-bottom:18px;">
            Incarnez l'un des 19 acteurs clés de l'Union (Commission, 6 États membres, 6 partis politiques, 6 lobbies). 
            Proposez des amendements, bâtissez des alliances transpartisanes et tentez d'atteindre la majorité qualifiée tout en préservant vos objectifs stratégiques.
          </p>

          <div class="grid-3" style="text-align:left;">
            <div style="background:var(--color-surface-hover); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--color-primary);">
              <div style="font-weight:700; font-size:0.9rem; margin-bottom:3px; color:var(--color-primary);">🏛️ Trilogue & Codécision</div>
              <div style="font-size:0.82rem; color:var(--color-text-muted); line-height:1.4;">
                Dialogue permanent entre la Commission européenne, le Parlement et les États membres au Conseil.
              </div>
            </div>

            <div style="background:var(--color-surface-hover); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--color-success);">
              <div style="font-weight:700; font-size:0.9rem; margin-bottom:3px; color:var(--color-success);">⚡ Modélisation Causale</div>
              <div style="font-size:0.82rem; color:var(--color-text-muted); line-height:1.4;">
                Impacts chiffrés sur 10 ans : Croissance PIB, Climat (CO₂), Inégalités (Gini), Sécurité et Démocratie.
              </div>
            </div>

            <div style="background:var(--color-surface-hover); padding:14px; border-radius:var(--radius-md); border-left:4px solid #b45309;">
              <div style="font-weight:700; font-size:0.9rem; margin-bottom:3px; color:#b45309;">🤝 Consensus & Lignes Rouges</div>
              <div style="font-size:0.82rem; color:var(--color-text-muted); line-height:1.4;">
                Proposez des compromis, défendez votre mandat et mesurez en direct le taux de succès politique de chaque acteur.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Les 4 Piliers d'Acteurs -->
      <div class="card" style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--color-primary);">
              Les 4 Piliers d'Acteurs du Pouvoir Européen
            </h3>
            <p style="font-size:0.85rem; color:var(--color-text-muted);">
              L'équilibre institutionnel reproduit fidèlement la réalité des négociations de Bruxelles et Strasbourg :
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btnGoToSubTabRoles">
            Consulter les 19 fiches détaillées 🎭 →
          </button>
        </div>

        <div class="grid-2">
          <!-- 1. Commission -->
          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/eurocomm.jpg" alt="Commission Européenne" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-commission">Initiative Législative</span>
                <span style="font-size:0.75rem; font-weight:700; color:#166534;">Berlaymont</span>
              </div>
              <h4 class="media-card-title">1. Commission Européenne</h4>
              <p class="media-card-desc">
                Rédige la proposition initiale, arbitre les amendements et veille à l'intérêt général européen.
              </p>
            </div>
          </div>

          <!-- 2. Conseil des États -->
          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/ETATSUE.jpg" alt="Conseil de l'UE" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-conseil">Majorité Qualifiée</span>
                <span style="font-size:0.75rem; font-weight:700; color:#92400e;">27 Gouvernements</span>
              </div>
              <h4 class="media-card-title">2. États Membres (Conseil)</h4>
              <p class="media-card-desc">
                Défendent la souveraineté et les économies nationales (Allemagne, France, Italie, Pologne, Suède, Hongrie).
              </p>
            </div>
          </div>

          <!-- 3. Parlement Européen -->
          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/parlement.jpg" alt="Parlement Européen" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-parlement">Suffrage Universel</span>
                <span style="font-size:0.75rem; font-weight:700; color:#0369a1;">720 Députés</span>
              </div>
              <h4 class="media-card-title">3. Parlement Européen</h4>
              <p class="media-card-desc">
                Portent la voix démocratique des citoyens via 6 groupes politiques (PPE, S&D, Renew, Verts/ALE, ECR, GUE).
              </p>
            </div>
          </div>

          <!-- 4. Lobbies -->
          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/lobbies.jpg" alt="Lobbies et Société Civile" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-lobby">Plaidoyer & Expertise</span>
                <span style="font-size:0.75rem; font-weight:700; color:#6b21a8;">6 Secteurs Clés</span>
              </div>
              <h4 class="media-card-title">4. Lobbies & Société Civile</h4>
              <p class="media-card-desc">
                Mobilisent analyses et contre-propositions d'amendements (Tech, Finance, Énergies, Agrochimie, Pharma, Auto).
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Schéma du Processus Législatif Ordinaire -->
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="font-weight:700; color:var(--color-primary); font-size:0.95rem;">
              📜 Schéma Officiel : Le Processus Législatif Ordinaire (Codécision)
            </h4>
            <p style="font-size:0.82rem; color:var(--color-text-muted);">
              Comment une directive est proposée, amendée et adoptée par le Parlement et le Conseil.
            </p>
          </div>
          <button class="role-sheet-preview-btn" id="btnToggleProcessusImage">
            🔍 Déplier le schéma
          </button>
        </div>
        <div id="processusImageContainer" style="display:none; margin-top:12px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--color-border); background:#fff;">
          <img src="./medias/images/euro/processus-legislatif.jpg" alt="Processus législatif européen" style="width:100%; height:auto;" loading="lazy" decoding="async" />
        </div>
      </div>

      <!-- Pied de page de l'étape 1 -->
      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-primary" id="btnNextToGroups">
          Étape suivante : Attribution des Groupes (Élèves) 👥 →
        </button>
      </div>
    </div>
  `;
}
