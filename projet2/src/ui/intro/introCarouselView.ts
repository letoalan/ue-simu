import { store } from '../../state/store';
import { allocateStudents, exportGroupsToCSV, type AllocationResult } from './groupAllocator';
import { setActorViewFocus } from '../actors/actorsView';
import { renderImmersionSubTab } from './introImmersionView';
import { renderGroupsSubTab } from './introGroupsView';
import { renderRolesSubTab } from './introRolesView';
import { attachJourneyCardsEvents } from './introJourneyCards';

type IntroSubTab = 'immersion' | 'groups' | 'roles';

let currentSubTab: IntroSubTab = 'immersion';
let currentAllocation: AllocationResult | null = null;
let rolesCategoryFilter: 'all' | 'commission' | 'states' | 'parties' | 'lobbies' = 'all';

export function renderIntroView(container: HTMLElement): void {
  const state = store.getState();
  const directiveId = state.selectedDirective?.id ?? 1;
  const defaultDir = state.scenarioId === 1 ? 'Pacte vert innovant' : 'Initiative sécurité énergétique';
  const directiveName = state.selectedDirective?.nom ?? defaultDir;

  container.innerHTML = `
    <div class="main-layout">
      <!-- Barre de sous-navigation d'Immersion & Rôles -->
      <div class="intro-subnav-bar">
        <div class="intro-subnav" role="tablist" aria-label="Sections d'immersion">
          <button class="intro-subnav-btn ${currentSubTab === 'immersion' ? 'active' : ''}" data-subtab="immersion">
            <span>🎬</span><span>1. Immersion & Institutions</span>
          </button>
          <button class="intro-subnav-btn ${currentSubTab === 'groups' ? 'active' : ''}" data-subtab="groups">
            <span>👥</span><span>2. Attribution des Groupes</span>
          </button>
          <button class="intro-subnav-btn ${currentSubTab === 'roles' ? 'active' : ''}" data-subtab="roles">
            <span>🎭</span><span>3. Fiches de Rôles (19)</span>
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-primary btn-sm" id="btnQuickLaunchFromIntro">
            Directive ${directiveId} : ${directiveName} 📜 →
          </button>
        </div>
      </div>

      <div id="introSubTabContent">
        ${currentSubTab === 'immersion' ? renderImmersionSubTab(state.userJourney) : currentSubTab === 'groups' ? renderGroupsSubTab(currentAllocation) : renderRolesSubTab(rolesCategoryFilter)}
      </div>
    </div>`;

  attachIntroEvents(container);
}

function attachIntroEvents(container: HTMLElement): void {
  attachJourneyCardsEvents(container, () => renderIntroView(container));

  container.querySelectorAll('.intro-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-subtab') as IntroSubTab;
      if (tab) { currentSubTab = tab; renderIntroView(container); }
    });
  });

  container.querySelector('#btnQuickLaunchFromIntro')?.addEventListener('click', () => store.setActiveTab('scenario'));
  container.querySelector('#btnNextToGroups')?.addEventListener('click', () => { currentSubTab = 'groups'; renderIntroView(container); });
  container.querySelector('#btnGoToSubTabRoles')?.addEventListener('click', () => { currentSubTab = 'roles'; renderIntroView(container); });
  container.querySelector('#btnBackToImmersion')?.addEventListener('click', () => { currentSubTab = 'immersion'; renderIntroView(container); });
  container.querySelector('#btnNextToRoles')?.addEventListener('click', () => { currentSubTab = 'roles'; renderIntroView(container); });
  container.querySelector('#btnBackToGroups')?.addEventListener('click', () => { currentSubTab = 'groups'; renderIntroView(container); });
  container.querySelector('#btnLaunchFromRoles')?.addEventListener('click', () => store.setActiveTab('scenario'));

  // Vidéo Hero
  const video = container.querySelector('#introHeroVideo') as HTMLVideoElement | null;
  const toggleBtn = container.querySelector('#btnToggleVideoPlay');
  toggleBtn?.addEventListener('click', () => {
    if (!video) return;
    if (video.paused) {
      video.play();
      const icon = toggleBtn.querySelector('#videoPlayIcon');
      const text = toggleBtn.querySelector('#videoPlayText');
      if (icon) icon.textContent = '⏸️';
      if (text) text.textContent = 'Pause';
    } else {
      video.pause();
      const icon = toggleBtn.querySelector('#videoPlayIcon');
      const text = toggleBtn.querySelector('#videoPlayText');
      if (icon) icon.textContent = '▶️';
      if (text) text.textContent = 'Lecture';
    }
  });

  // Schéma dépliable
  container.querySelector('#btnToggleProcessusImage')?.addEventListener('click', () => {
    const imgCont = container.querySelector('#processusImageContainer') as HTMLElement | null;
    const btn = container.querySelector('#btnToggleProcessusImage');
    if (imgCont) {
      const isVisible = imgCont.style.display !== 'none';
      imgCont.style.display = isVisible ? 'none' : 'block';
      if (btn) btn.textContent = isVisible ? '🔍 Déplier le schéma' : '▲ Replier le schéma';
    }
  });

  // Allocation de participants
  container.querySelectorAll('.btn-quick-count').forEach(btn => {
    btn.addEventListener('click', () => {
      const countInput = container.querySelector('#numParticipantsInput') as HTMLInputElement | null;
      if (countInput) countInput.value = btn.getAttribute('data-count') || '24';
    });
  });

  container.querySelector('#btnGenerateAutoGroups')?.addEventListener('click', () => {
    const countInput = container.querySelector('#numParticipantsInput') as HTMLInputElement | null;
    const customNamesArea = container.querySelector('#customStudentNames') as HTMLTextAreaElement | null;
    let names: string[] = [];
    if (customNamesArea && customNamesArea.value.trim().length > 0) {
      names = customNamesArea.value.split(/[\n,;]+/).map(n => n.trim()).filter(Boolean);
    } else {
      const count = Math.max(3, Math.min(150, Number(countInput?.value) || 24));
      names = Array.from({ length: count }, (_, i) => `Élève ${i + 1}`);
    }
    currentAllocation = allocateStudents(names);
    renderIntroView(container);
  });

  container.querySelector('#btnDownloadCsv')?.addEventListener('click', () => {
    if (currentAllocation) exportGroupsToCSV(currentAllocation);
  });

  container.querySelector('#btnDrawScenarioQuick')?.addEventListener('click', async () => {
    await store.drawRandomScenario();
    renderIntroView(container);
  });

  container.querySelector('#btnDrawDirectiveQuick')?.addEventListener('click', () => {
    store.drawRandomDirective();
    renderIntroView(container);
  });

  // Filtres de rôles & Fiches d'acteurs
  container.querySelectorAll('[data-role-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-role-filter') as any;
      if (filter) { rolesCategoryFilter = filter; renderIntroView(container); }
    });
  });

  container.querySelectorAll('.btn-open-actor-sheet').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-actor-cat') as any;
      const key = btn.getAttribute('data-actor-key') as string;
      if (cat && key) {
        setActorViewFocus(cat, key);
        store.setActiveTab('actors');
      }
    });
  });
}
