import { store, type UserJourney } from '../../state/store';
import { renderCardsWorkshopHtml, attachCardsWorkshopEvents } from './cards/cardsWorkshopView';
import {
  renderGuideReaderHtml,
  attachGuideReaderEvents,
  setGuideReaderActive,
  type GuideId
} from './guides/guideReaderView';
import { renderWorkflowViewHtml } from './components/workflowView';
import { renderLandingHeroHtml } from './components/landingHero';
import { renderLandingJourneysHtml } from './components/landingJourneys';
import { renderLandingFooterHtml } from './components/landingFooter';
import { renderLandingResourcesHtml, attachLandingResourcesEvents } from './components/landingResources';

export function renderLandingView(container: HTMLElement): void {
  const state = store.getState();
  const directiveId = state.selectedDirective?.id ?? 1;
  const directiveName = state.selectedDirective?.nom ?? 'Pacte vert innovant';

  const hasSessionActivity =
    state.selectedAmendments.size > 0 ||
    state.voteState.appliedToSimulation ||
    state.financialAgreement !== null ||
    state.scenarioId !== 1 ||
    directiveId !== 1;

  container.innerHTML = `
    <div class="landing-page-root">
      ${renderLandingHeroHtml(directiveId, directiveName, state.userJourney, hasSessionActivity)}
      ${renderLandingJourneysHtml(state.userJourney)}

      <!-- BLOC 2 : ATELIER DES CARTES -->
      <section class="landing-section workshop-section" id="materialSection">
        <div class="section-container">
          ${renderCardsWorkshopHtml()}
        </div>
      </section>

      <!-- BLOC 3 : DÉROULEMENT DU JEU -->
      <section class="landing-section workflow-section" id="workflowSectionWrapper">
        <div class="section-container">
          ${renderWorkflowViewHtml()}
        </div>
      </section>

      <!-- BLOC 4 : GUIDES ET RESSOURCES -->
      <section class="landing-section guides-section" id="guidesSection">
        <div class="section-container">
          <div class="section-header-block">
            <span class="section-kicker">📚 Référentiel Intégré</span>
            <h2 class="section-title">Guides & Ressources Officielles</h2>
            <p class="section-lead">
              Consultez l'intégralité des guides Markdown dans un lecteur fluide avec sommaire, 3 niveaux de lecture et téléchargement du document source.
            </p>
          </div>

          ${renderGuideReaderHtml()}
          ${renderLandingResourcesHtml()}
        </div>
      </section>

      ${renderLandingFooterHtml()}
    </div>
  `;

  attachLandingEvents(container);
}

function attachLandingEvents(container: HTMLElement): void {
  const rerender = () => renderLandingView(container);

  attachCardsWorkshopEvents(container, rerender);
  attachGuideReaderEvents(container, rerender);
  attachLandingResourcesEvents(container);

  // Hero: Enter simulation
  container.querySelector('#btnEnterSimulation')?.addEventListener('click', () => {
    const journey = store.getState().userJourney;
    if (journey === 'participant') {
      store.setActiveTab('actors');
    } else {
      store.setActiveTab('intro');
    }
  });

  // Hero: Resume session
  container.querySelector('#btnResumeSession')?.addEventListener('click', () => {
    const state = store.getState();
    if (state.voteState.appliedToSimulation) {
      store.setActiveTab('simulator');
    } else if (state.userJourney === 'participant') {
      store.setActiveTab('actors');
    } else if (state.userJourney === 'animateur') {
      store.setActiveTab('vote');
    } else {
      store.setActiveTab('intro');
    }
  });

  // Hero: Navigation scrolls
  container.querySelector('#btnConsultRules')?.addEventListener('click', () => {
    container.querySelector('#workflowSectionWrapper')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#btnPrepareCards')?.addEventListener('click', () => {
    container.querySelector('#materialSection')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Journey cards: Read guide
  container.querySelectorAll('[data-read-guide]').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-read-guide') as GuideId;
      if (g) {
        setGuideReaderActive(g, 'essentials');
        renderLandingView(container);
        container.querySelector('#guidesSection')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Journey cards: Launch journey
  container.querySelectorAll('[data-launch-journey]').forEach(btn => {
    btn.addEventListener('click', () => {
      const journey = btn.getAttribute('data-launch-journey') as UserJourney;
      if (journey) {
        store.setUserJourney(journey);
        if (journey === 'participant') {
          store.setActiveTab('actors');
        } else {
          store.setActiveTab('intro');
        }
      }
    });
  });
}
