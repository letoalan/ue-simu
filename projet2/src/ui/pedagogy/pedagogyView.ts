import { renderCausalSchemaSVG } from '../../pedagogy/schemas';
import { DIDACTIC_CONCEPTS_S1, DIDACTIC_CONCEPTS_S2, DIDACTIC_RULES } from '../../pedagogy/pedagogyConcepts';
import { renderQuizHtml, attachQuizEvents } from './pedagogyQuiz';
import { store } from '../../state/store';

let selectedPedagogyScenario: 1 | 2 = 1;

export function renderPedagogyView(container: HTMLElement): void {
  const state = store.getState();
  selectedPedagogyScenario = (state.scenarioId === 2 ? 2 : 1);

  renderPedagogyContent(container);
}

function renderPedagogyContent(container: HTMLElement): void {
  const concepts = selectedPedagogyScenario === 1 ? DIDACTIC_CONCEPTS_S1 : DIDACTIC_CONCEPTS_S2;
  const scenarioTitle = selectedPedagogyScenario === 1
    ? 'Scénario 1 : Transition Écologique & Climat'
    : 'Scénario 2 : Sécurité Commune & Démocratie';

  container.innerHTML = `
    <div class="main-layout pedagogy-view">
      <!-- En-tête pédagogique -->
      <div class="card" style="background: linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06));">
        <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 class="card-title" style="font-size: 1.4rem;">💡 Décryptage du Simulateur</h1>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 4px;">
              Comprendre comment une directive européenne transforme l'économie, la planète et la société.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" id="btnGoToSim">
            Tester dans le Simulateur 📊
          </button>
        </div>

        <!-- Sélecteur de scénario didactique -->
        <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
          <button class="btn btn-sm ${selectedPedagogyScenario === 1 ? 'btn-primary' : 'btn-secondary'}" id="btnPedaS1">
            🌿 Scénario 1 : Climat & Bien-être
          </button>
          <button class="btn btn-sm ${selectedPedagogyScenario === 2 ? 'btn-primary' : 'btn-secondary'}" id="btnPedaS2">
            🛡️ Scénario 2 : Sécurité & Démocratie
          </button>
        </div>
      </div>

      <!-- Les 3 Règles d'Or du Simulateur -->
      <div class="grid-3">
        ${DIDACTIC_RULES.map(r => `
          <div class="card" style="padding: 16px; border-left: 4px solid var(--color-primary);">
            <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); margin-bottom: 6px;">
              ${r.titre}
            </h3>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5; margin: 0;">
              ${r.desc}
            </p>
          </div>
        `).join('')}
      </div>

      <!-- Schéma Causal Interactif -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Schéma des Relations de Causalité</h2>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">${scenarioTitle}</span>
          </div>
          <span class="badge badge-commission">Système Vivant</span>
        </div>
        ${renderCausalSchemaSVG(selectedPedagogyScenario)}
      </div>

      <!-- Dictionnaire des Notions Clés -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Dictionnaire des Notions Clés</h2>
          <span class="badge badge-commission">Vulgarisation Lycée</span>
        </div>
        
        <div class="grid-2" style="margin-top: 12px; gap: 14px;">
          ${concepts.map(c => `
            <div style="background: var(--color-surface-hover); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); margin: 0;">${c.nom}</h4>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono);">${c.unite}</span>
              </div>
              <div style="font-size: 0.84rem; background: rgba(37,99,235,0.06); padding: 6px 10px; border-radius: var(--radius-sm); color: var(--color-primary); font-weight: 600;">
                💡 <b>Analogie :</b> ${c.analogie}
              </div>
              <p style="font-size: 0.84rem; color: var(--color-text-main); margin: 0; line-height: 1.45;">
                <b>En clair :</b> ${c.enClair}
              </p>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">
                <b>Pourquoi c'est capital :</b> ${c.pourquoiImportant}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quiz Express -->
      ${renderQuizHtml()}
    </div>
  `;

  attachPedagogyEvents(container);
}

function attachPedagogyEvents(container: HTMLElement): void {
  container.querySelector('#btnGoToSim')?.addEventListener('click', () => {
    store.setActiveTab('simulator');
  });

  container.querySelector('#btnPedaS1')?.addEventListener('click', () => {
    selectedPedagogyScenario = 1;
    renderPedagogyContent(container);
  });

  container.querySelector('#btnPedaS2')?.addEventListener('click', () => {
    selectedPedagogyScenario = 2;
    renderPedagogyContent(container);
  });

  attachQuizEvents(container);
}
