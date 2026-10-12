import type { ActorCardDefinition } from './cardsTypes';
import type { WorkshopState, WorkshopMode, PreviewTab, PrintFilter } from './cardsWorkshopTypes';
import { ACTORS_CATALOG } from './cardsData';
import { triggerPrint, downloadAutonomousHtml } from './cardsWorkshopPrint';

export function attachCardsWorkshopEvents(
  container: HTMLElement,
  state: WorkshopState,
  getActiveCards: () => ActorCardDefinition[],
  onRerender: () => void
): void {
  // Mode selection
  container.querySelectorAll('input[name="workshopMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.mode = (e.target as HTMLInputElement).value as WorkshopMode;
      state.currentCardIndex = 0;
      onRerender();
    });
  });

  // Single Actor
  const singleSelect = container.querySelector('#singleActorSelect') as HTMLSelectElement;
  if (singleSelect) {
    singleSelect.addEventListener('change', () => {
      state.singleActorCode = singleSelect.value;
      state.currentCardIndex = 0;
      onRerender();
    });
  }

  // Replacement
  const repSelect = container.querySelector('#replacementCardSelect') as HTMLSelectElement;
  if (repSelect) {
    repSelect.addEventListener('change', () => {
      state.replacementCardId = repSelect.value;
      state.currentCardIndex = 0;
      onRerender();
    });
  }

  // Custom actors checkboxes
  container.querySelectorAll('.actor-check').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const code = (e.target as HTMLElement).getAttribute('data-actor');
      if (!code) return;
      const checked = (e.target as HTMLInputElement).checked;
      if (checked) {
        if (!state.selectedActorCodes.includes(code)) state.selectedActorCodes.push(code);
      } else {
        state.selectedActorCodes = state.selectedActorCodes.filter(c => c !== code);
      }
      state.currentCardIndex = 0;
      onRerender();
    });
  });

  // Quick custom buttons
  container.querySelector('#btnSelectAllActors')?.addEventListener('click', () => {
    state.selectedActorCodes = ACTORS_CATALOG.map(a => a.code);
    onRerender();
  });
  container.querySelector('#btnSelectStates')?.addEventListener('click', () => {
    state.selectedActorCodes = ACTORS_CATALOG.filter(a => a.category === 'states').map(a => a.code);
    onRerender();
  });
  container.querySelector('#btnSelectParties')?.addEventListener('click', () => {
    state.selectedActorCodes = ACTORS_CATALOG.filter(a => a.category === 'parties').map(a => a.code);
    onRerender();
  });
  container.querySelector('#btnSelectLobbies')?.addEventListener('click', () => {
    state.selectedActorCodes = ACTORS_CATALOG.filter(a => a.category === 'lobbies').map(a => a.code);
    onRerender();
  });
  container.querySelector('#btnSelectNone')?.addEventListener('click', () => {
    state.selectedActorCodes = [];
    onRerender();
  });

  // Preview tabs
  container.querySelectorAll('.preview-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.previewTab = btn.getAttribute('data-preview') as PreviewTab;
      onRerender();
    });
  });

  // Print filter select
  const printFilterSelect = container.querySelector('#printFilterSelect') as HTMLSelectElement;
  if (printFilterSelect) {
    printFilterSelect.addEventListener('change', () => {
      state.printFilter = printFilterSelect.value as PrintFilter;
    });
  }

  // Card flip button and card click
  container.querySelector('#btnFlipCard')?.addEventListener('click', () => {
    state.currentCardFlipped = !state.currentCardFlipped;
    onRerender();
  });

  container.querySelector('#interactiveFlipCard')?.addEventListener('click', () => {
    state.currentCardFlipped = !state.currentCardFlipped;
    onRerender();
  });

  // Card navigation
  const activeCards = getActiveCards();
  container.querySelector('#btnPrevCard')?.addEventListener('click', () => {
    if (state.currentCardIndex > 0) {
      state.currentCardIndex--;
      state.currentCardFlipped = false;
      onRerender();
    }
  });

  container.querySelector('#btnNextCard')?.addEventListener('click', () => {
    if (state.currentCardIndex < activeCards.length - 1) {
      state.currentCardIndex++;
      state.currentCardFlipped = false;
      onRerender();
    }
  });

  // Print trigger
  container.querySelector('#btnPrintCards')?.addEventListener('click', () => {
    triggerPrint(getActiveCards(), state.printFilter);
  });

  // Download autonomous HTML
  container.querySelector('#btnDownloadHtml')?.addEventListener('click', () => {
    downloadAutonomousHtml(getActiveCards());
  });
}
