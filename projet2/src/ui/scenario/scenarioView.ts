import { store } from '../../state/store';
import { audioPlayer, type AudioType } from '../../state/audioPlayer';
import { openAmendmentSandboxModal } from './amendmentSandboxModal';
import { renderDirectiveAudioBarHtml, renderDirectiveDetailCardHtml } from './scenarioDetailView';

export function renderScenarioView(container: HTMLElement): void {
  const state = store.getState();
  const scenarioData = state.scenarioData;
  const currentDirective = state.selectedDirective;
  const audioState = audioPlayer.getState();

  container.innerHTML = `
    <div class="main-layout">
      <!-- Choix du scénario -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Choix du grand enjeu européen</h2>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <button class="btn ${state.scenarioId === 1 ? 'btn-primary' : 'btn-secondary'}" id="btnSelectS1">
            🌱 Scénario 1 : Développement Durable & Climat
          </button>
          <button class="btn ${state.scenarioId === 2 ? 'btn-primary' : 'btn-secondary'}" id="btnSelectS2">
            🛡️ Scénario 2 : Géopolitique & État de Droit
          </button>
        </div>
        <p style="margin-top:10px; font-size:0.9rem; color:var(--color-text-muted);">
          ${scenarioData?.description || ''}
        </p>
      </div>

      <!-- Liste des Directives -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Directives disponibles (${scenarioData?.directive.length || 0})</h2>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnDrawDirectiveInTab">
              🎲 Tirer au sort une directive
            </button>
            <button class="btn btn-secondary btn-sm" id="btnBackToIntro">
              🇪🇺 Guide & Groupes
            </button>
          </div>
        </div>
        <div class="grid-2">
          ${(scenarioData?.directive || []).map(d => `
            <div class="directive-card ${currentDirective?.id === d.id ? 'active' : ''}" data-directive-id="${d.id}">
              <div style="height:70px; width:100%; border-radius:var(--radius-sm); overflow:hidden; margin-bottom:8px; background:var(--color-surface-hover);">
                <img
                  src="./medias/images/fiches-acteurs/s${state.scenarioId}/${state.scenarioId}-${d.id}.png"
                  alt="${d.nom}"
                  style="width:100%; height:100%; object-fit:cover;"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                <h3 style="font-size:1.02rem; font-weight:700; color:var(--color-primary);">${d.nom}</h3>
                <span class="badge ${currentDirective?.id === d.id ? 'badge-commission' : ''}">
                  ${currentDirective?.id === d.id ? 'Active' : 'Choisir'}
                </span>
              </div>
              <p style="font-size:0.85rem; font-weight:600; color:var(--color-text-main); margin-bottom:4px;">
                ${d.orientation}
              </p>
              <p style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.4; margin-bottom:10px; flex:1;">
                ${d.description}
              </p>
              ${renderDirectiveAudioBarHtml(state.scenarioId, d, audioState)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Détail de la Directive Sélectionnée & Amendements -->
      ${currentDirective ? renderDirectiveDetailCardHtml(state, currentDirective, audioState) : ''}
    </div>
  `;

  attachScenarioEvents(container);
}

function attachScenarioEvents(container: HTMLElement): void {
  const state = store.getState();
  const currentDirective = state.selectedDirective;

  container.querySelector('#btnSelectS1')?.addEventListener('click', () => store.initScenario(1));
  container.querySelector('#btnSelectS2')?.addEventListener('click', () => store.initScenario(2));
  container.querySelector('#btnDrawDirectiveInTab')?.addEventListener('click', () => store.drawRandomDirective());
  container.querySelector('#btnBackToIntro')?.addEventListener('click', () => store.setActiveTab('intro'));

  container.querySelectorAll('.directive-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.directive-audio-bar')) return;
      const dId = parseInt(card.getAttribute('data-directive-id') || '0', 10);
      if (dId > 0) store.selectDirective(dId);
    });
  });

  container.querySelectorAll('button[data-action="play-audio"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sId = parseInt(btn.getAttribute('data-scenario') || '1', 10);
      const dId = parseInt(btn.getAttribute('data-directive') || '1', 10);
      const type = (btn.getAttribute('data-type') || 'podcast') as AudioType;
      const name = btn.getAttribute('data-name') || `Directive ${dId}`;
      audioPlayer.togglePlay({ scenarioId: sId, directiveId: dId, directiveName: name, type });
    });
  });

  container.querySelector('#btnOpenSandboxHeader')?.addEventListener('click', () => {
    if (currentDirective) openAmendmentSandboxModal(currentDirective);
  });

  container.querySelectorAll('input[data-amendment-id]').forEach(input => {
    input.addEventListener('change', (e) => {
      const aId = (e.target as HTMLInputElement).getAttribute('data-amendment-id');
      if (aId) store.toggleAmendment(aId);
    });
  });

  container.querySelector('#btnGoToActorsFromDirective')?.addEventListener('click', () => store.setActiveTab('actors'));
  container.querySelector('#btnGoToVoteFromDirective')?.addEventListener('click', () => store.setActiveTab('vote'));
}
