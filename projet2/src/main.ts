import './styles/main.css';
import { store } from './state/store';
import { initTheme } from './state/theme';
import { audioPlayer } from './state/audioPlayer';
import { renderAudioDock } from './ui/components/audioDock';
import {
  renderHeader,
  renderMobileNav,
  renderLandingView,
  renderIntroView,
  renderScenarioView,
  renderSimulatorView,
  renderActorsView,
  renderPedagogyView,
  renderInstitutionsView,
  renderVoteView,
  renderFinanceView
} from './ui';

function initApp(): void {
  initTheme();

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div id="headerContainer"></div>
    <main id="mainContainer" role="main"></main>
    <div id="audioDockContainer"></div>
    <div id="mobileNavContainer"></div>
  `;

  const headerContainer = document.getElementById('headerContainer')!;
  const mainContainer = document.getElementById('mainContainer')!;
  const audioDockContainer = document.getElementById('audioDockContainer')!;
  const mobileNavContainer = document.getElementById('mobileNavContainer')!;

  audioPlayer.subscribe(() => {
    renderAudioDock(audioDockContainer);
  });

  const renderActiveTab = () => {
    const state = store.getState();

    renderHeader(headerContainer);
    renderMobileNav(mobileNavContainer);

    switch (state.activeTab) {
      case 'landing':
        renderLandingView(mainContainer);
        break;
      case 'intro':
        renderIntroView(mainContainer);
        break;
      case 'scenario':
        renderScenarioView(mainContainer);
        break;
      case 'actors':
        renderActorsView(mainContainer);
        break;
      case 'vote':
        renderVoteView(mainContainer);
        break;
      case 'finance':
        renderFinanceView(mainContainer);
        break;
      case 'simulator':
        renderSimulatorView(mainContainer);
        break;
      case 'pedagogy':
        renderPedagogyView(mainContainer);
        break;
      case 'institutions':
        renderInstitutionsView(mainContainer);
        break;
      default:
        renderLandingView(mainContainer);
    }
  };

  store.subscribe(() => {
    renderActiveTab();
  });

  store.initScenario(1).then(() => {
    renderActiveTab();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
