import type { Directive, CountryCode, PartyCode, LobbyCode } from '../../domain/types';
import { store } from '../../state/store';
import {
  computeSandboxComparison,
  computeActorKPIDeltas,
  type SandboxComparisonResult,
  type SandboxScope,
  type SandboxActorType
} from '../../simulation/sandboxEngine';
import { renderSandboxComparisonChart } from '../charts/chartsSandbox';
import { renderSandboxPartySatisfactionChart } from '../charts/chartsSandboxParty';
import { renderHemicycle } from '../charts/hemicycleChart';
import { setActorViewFocus } from '../actors/actorsView';
import { renderSandboxModalHtml } from './amendmentSandboxModalHtml';

let currentScope: SandboxScope = {
  actorType: 'eu',
  countryCode: 'FR',
  partyCode: 'PPE',
  lobbyCode: 'BIG_TECH'
};

let currentFocusMetric = 'all';

/**
 * Ouvre la modale interactive de Bac à Sable (Sandbox) pour la directive courante
 */
export function openAmendmentSandboxModal(directive: Directive): void {
  document.getElementById('amendmentSandboxModalContainer')?.remove();

  const container = document.createElement('div');
  container.id = 'amendmentSandboxModalContainer';
  document.body.appendChild(container);

  const state = store.getState();
  currentScope = {
    actorType: 'eu',
    countryCode: state.selectedCountry || 'FR',
    partyCode: state.selectedParty || 'PPE',
    lobbyCode: state.selectedLobby || 'BIG_TECH'
  };
  currentFocusMetric = 'all';

  renderModal(container, directive);
}

function renderModal(container: HTMLElement, directive: Directive): void {
  const state = store.getState();
  const comparison: SandboxComparisonResult = computeSandboxComparison(
    directive,
    state.selectedAmendments,
    state.scenarioId,
    state.seed
  );

  const actorSummary = computeActorKPIDeltas(comparison, currentScope);

  container.innerHTML = renderSandboxModalHtml(
    state,
    comparison,
    actorSummary,
    currentScope,
    currentFocusMetric,
    directive
  );

  // Tracer les graphiques / hémicycle
  if (currentScope.actorType === 'party') {
    renderHemicycle(
      'sandboxHemicycleContainer',
      comparison.amendedResult,
      currentScope.partyCode,
      (newPartyCode) => {
        currentScope.partyCode = newPartyCode;
        renderModal(container, directive);
      },
      comparison.baselineResult
    );
    renderSandboxPartySatisfactionChart('chartSandboxPartySatisfaction', comparison, currentScope.partyCode);
  } else {
    renderSandboxComparisonChart('chartSandboxComparison', comparison, currentScope, currentFocusMetric);
  }

  // Attacher les écouteurs d'événements
  attachModalEvents(container, directive);
}

function attachModalEvents(container: HTMLElement, directive: Directive): void {
  const close = () => { container.remove(); };

  container.querySelector('#btnSandboxCloseHeader')?.addEventListener('click', close);
  container.querySelector('#sandboxOverlay')?.addEventListener('click', (e) => {
    if (e.target === container.querySelector('#sandboxOverlay')) close();
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // Onglets acteurs (UE, Pays, Partis, Lobbies)
  container.querySelectorAll('.sandbox-actor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const actorType = tab.getAttribute('data-actor-type') as SandboxActorType;
      if (actorType && actorType !== currentScope.actorType) {
        currentScope.actorType = actorType;
        currentFocusMetric = 'all';
        renderModal(container, directive);
      }
    });
  });

  // Sélecteurs d'entité
  const countrySelect = container.querySelector('#sandboxCountrySelect') as HTMLSelectElement | null;
  countrySelect?.addEventListener('change', () => {
    currentScope.countryCode = countrySelect.value as CountryCode;
    renderModal(container, directive);
  });

  const partySelect = container.querySelector('#sandboxPartySelect') as HTMLSelectElement | null;
  partySelect?.addEventListener('change', () => {
    currentScope.partyCode = partySelect.value as PartyCode;
    renderModal(container, directive);
  });

  const lobbySelect = container.querySelector('#sandboxLobbySelect') as HTMLSelectElement | null;
  lobbySelect?.addEventListener('change', () => {
    currentScope.lobbyCode = lobbySelect.value as LobbyCode;
    renderModal(container, directive);
  });

  // Liens rapides vers simulateur ou fiche rôle
  container.querySelector('#btnJumpToActorSim')?.addEventListener('click', () => {
    close();
    if (currentScope.actorType === 'country') store.selectCountry(currentScope.countryCode);
    else if (currentScope.actorType === 'party') store.selectParty(currentScope.partyCode);
    else if (currentScope.actorType === 'lobby') store.selectLobby(currentScope.lobbyCode);
    store.setActiveTab('simulator');
  });

  container.querySelector('#btnJumpToActorSheet')?.addEventListener('click', () => {
    close();
    if (currentScope.actorType === 'country') setActorViewFocus('states', currentScope.countryCode);
    else if (currentScope.actorType === 'party') setActorViewFocus('parties', currentScope.partyCode);
    else if (currentScope.actorType === 'lobby') setActorViewFocus('lobbies', currentScope.lobbyCode);
    store.setActiveTab('actors');
  });

  // Filtres métriques
  container.querySelectorAll('.sandbox-metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFocusMetric = btn.getAttribute('data-metric') || 'all';
      renderModal(container, directive);
    });
  });

  // Toggles amendements en direct
  container.querySelectorAll('input[data-modal-amd-id]').forEach(input => {
    input.addEventListener('change', (e) => {
      const aId = (e.target as HTMLInputElement).getAttribute('data-modal-amd-id');
      if (aId) {
        store.toggleAmendment(aId);
        renderModal(container, directive);
      }
    });
  });

  // Boutons de contrôle
  container.querySelector('#btnSandboxReset')?.addEventListener('click', () => {
    store.clearAmendments();
    renderModal(container, directive);
  });

  container.querySelector('#btnSandboxGoToSimulator')?.addEventListener('click', () => {
    close();
    store.setActiveTab('simulator');
  });

  container.querySelector('#btnSandboxGoToVote')?.addEventListener('click', () => {
    close();
    store.setActiveTab('vote');
  });
}
