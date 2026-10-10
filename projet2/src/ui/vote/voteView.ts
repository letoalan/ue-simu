import { store, type VoteChoice, type VoteStepData, type VoteCalculationResult } from '../../state/store';
import { renderCouncilCardHtml } from './voteCouncilView';
import { renderParliamentCardHtml, initParliamentHemicycle } from './voteParliamentView';
import { renderPackageSummaryHtml } from './voteSummaryView';

export function renderVoteView(container: HTMLElement): void {
  const state = store.getState();
  const vState = state.voteState;
  const directive = state.selectedDirective;

  if (!directive) {
    container.innerHTML = `
      <div class="main-layout">
        <div class="card" style="text-align:center; padding:30px;">
          <h2 style="color:var(--color-danger); margin-bottom:10px;">Aucune directive sélectionnée</h2>
          <p style="color:var(--color-text-muted); margin-bottom:20px;">Veuillez d'abord choisir un grand enjeu et une directive dans l'onglet Directives.</p>
          <button class="btn btn-primary" id="btnGoToDirectives">Choisir une directive 📜</button>
        </div>
      </div>`;
    container.querySelector('#btnGoToDirectives')?.addEventListener('click', () => store.setActiveTab('scenario'));
    return;
  }

  const steps = store.buildVoteSteps(directive);
  const currentStep = steps.find(s => s.id === vState.currentStepId) || steps[0];
  const currentStepId = currentStep.id;
  const isPackageStep = currentStepId === 'package';
  const calc = store.calculateVoteStepResult(currentStepId);
  const currentStatus = vState.stepStatus[currentStepId] || {
    validated: false, councilPassed: calc.councilPassed, parliamentPassed: calc.parliamentPassed, passed: calc.stepPassed
  };

  container.innerHTML = `
    <div class="main-layout">
      <!-- En-tête de session de vote -->
      <div class="card" style="background:linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%); border-left:4px solid var(--color-primary);">
        <div class="card-header" style="margin-bottom:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span class="badge badge-commission">Co-législation Européenne</span>
              <span class="badge badge-parlement">Parlement & Conseil</span>
              ${vState.appliedToSimulation ? '<span class="badge" style="background:#10b981; color:#fff;">✓ Résultats transmis au simulateur</span>' : ''}
            </div>
            <h1 class="card-title" style="font-size:1.35rem; color:var(--color-primary-dark);">Séance de Vote : ${directive.nom}</h1>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="btnSwitchToSim">Voir le Simulateur 📊</button>
            <button class="btn btn-secondary btn-sm" id="btnBackToDirectives">Changer de Directive 📜</button>
          </div>
        </div>
        <p style="font-size:0.88rem; color:var(--color-text-muted); margin:0;">
          Chaque proposition doit réunir la <b>Majorité Qualifiée du Conseil des ministres</b> (≥ 55% des États et ≥ 65% de la population) et la <b>Majorité Absolue du Parlement</b> (≥ 306 voix) pour être adoptée.
        </p>
      </div>

      <!-- Stepper / Barres de navigation d'étapes de vote -->
      <div class="card" style="padding:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <span style="font-size:0.82rem; font-weight:700; text-transform:uppercase; color:var(--color-text-muted);">Déroulement du vote (10 étapes)</span>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Étape active : <b>${currentStep.name}</b></span>
        </div>
        <div class="vote-stepper-scroll" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px;">
          ${steps.map((st, idx) => {
            const stStatus = vState.stepStatus[st.id];
            const isValidated = stStatus?.validated;
            const isPassed = stStatus?.passed;
            const isCurrent = st.id === currentStepId;
            let badgeHtml = isCurrent && !isValidated ? '<span style="color:var(--color-primary); font-size:0.75rem; margin-left:4px;">⏳</span>' : '';
            let btnClass = `vote-step-pill ${isCurrent ? 'active' : ''}`;
            if (isValidated) {
              btnClass += isPassed ? ' passed' : ' rejected';
              badgeHtml = `<span style="color:${isPassed ? '#10b981' : '#ef4444'}; font-weight:bold; margin-left:4px;">${isPassed ? '✓' : '✗'}</span>`;
            }
            const shortLabel = idx === 0 ? 'Directive' : idx === steps.length - 1 ? 'Package' : `Amd ${idx}`;
            return `<button class="${btnClass}" data-step-id="${st.id}" title="${st.name} — ${st.description}">
              <span class="step-num">${idx === 0 ? '📜' : idx === steps.length - 1 ? '📦' : idx}</span>
              <span class="step-label">${shortLabel}</span>${badgeHtml}
            </button>`;
          }).join('')}
        </div>
      </div>

      ${isPackageStep ? renderPackageSummaryHtml(directive, steps, vState, currentStatus) : ''}
      ${renderSingleStepVotingHtml(currentStep, calc, currentStatus, vState)}
    </div>`;

  setupVoteEvents(container, currentStepId);
  initParliamentHemicycle(calc);
}

function renderSingleStepVotingHtml(
  step: VoteStepData,
  calc: VoteCalculationResult,
  status: any,
  vState: any
): string {
  const badgeOrigineClass = step.amendType === 'parlement' ? 'badge-parlement' : step.amendType === 'conseil' ? 'badge-conseil' : 'badge-commission';
  return `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <span class="badge ${badgeOrigineClass}">${step.amendOrigine || 'Commission européenne'}</span>
            <span class="badge" style="background:#e2e8f0; color:#334155;">Étape : ${step.name}</span>
            ${status.validated ? `<span class="badge" style="background:${status.passed ? '#ecfdf5' : '#fef2f2'}; color:${status.passed ? '#065f46' : '#991b1b'}; border:1px solid ${status.passed ? '#10b981' : '#ef4444'};">${status.passed ? '✓ Validé : Adopté' : '✗ Validé : Rejeté'}</span>` : '<span class="badge" style="background:#eff6ff; color:#1e40af;">En cours de délibération</span>'}
          </div>
          <h2 style="font-size:1.15rem; font-weight:700; color:var(--color-primary);">${step.description}</h2>
        </div>
        ${step.impact ? `<div style="display:flex; gap:6px; flex-wrap:wrap; font-size:0.8rem;">${Object.entries(step.impact).map(([k, v]) => `<span class="impact-chip">${k}: <b>${v}</b></span>`).join('')}</div>` : ''}
      </div>

      <div class="vote-verdict-banner ${calc.stepPassed ? 'verdict-passed' : 'verdict-pending'}">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">${calc.stepPassed ? '🎉' : '⚖️'}</span>
          <div>
            <strong style="font-size:0.95rem;">${calc.stepPassed ? 'Accord institutionnel atteint (Le texte sera adopté)' : 'Majorités requises non réunies'}</strong>
            <p style="font-size:0.82rem; margin:0; opacity:0.9;">
              Conseil : <b>${calc.councilPassed ? '✓ Majorité Qualifiée atteinte' : '✗ Seuil non atteint'}</b> •
              Parlement : <b>${calc.parliamentPassed ? '✓ Majorité Absolue atteinte' : '✗ Seuil non atteint'}</b>
            </p>
          </div>
        </div>
        <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; align-items:center;">
          <button class="btn btn-sm ${vState.realisticActive?.[step.id] ? 'btn-realistic-active' : 'btn-secondary'}" id="btnAutoRealistic" title="${vState.realisticActive?.[step.id] ? 'Cliquez pour inverser et annuler le vote réaliste' : 'Simuler l\'alignement réaliste'}">
            ${vState.realisticActive?.[step.id] ? '↩️ Inverser / Rétablir le vote' : '🤖 Vote réaliste des acteurs'}
          </button>
          <button class="btn btn-secondary btn-sm" id="btnInvertVotes" title="Inverser tous les votes">↕️ Inverser Pour ⇄ Contre</button>
          <button class="btn btn-secondary btn-sm" id="btnResetVotes" title="Remettre tous les votes à neutre">🔄 Réinitialiser</button>
          <button class="btn ${calc.stepPassed ? 'btn-primary' : 'btn-secondary'} btn-sm" id="btnValidateStep">
            ${status.validated ? 'Mettre à jour la validation ✓' : 'Valider ce vote & Suivant ➡️'}
          </button>
        </div>
      </div>
    </div>

    <div class="grid-2">
      ${renderCouncilCardHtml(calc, step, vState)}
      ${renderParliamentCardHtml(calc, step, vState)}
    </div>`;
}

function setupVoteEvents(container: HTMLElement, currentStepId: string): void {
  container.querySelectorAll('.vote-step-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = btn.getAttribute('data-step-id');
      if (stepId) store.setStepCurrent(stepId);
    });
  });
  container.querySelectorAll('.vote-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type') as 'state' | 'party';
      const actor = btn.getAttribute('data-actor');
      const choice = btn.getAttribute('data-choice') as VoteChoice;
      if (type && actor && choice) store.setActorVote(type, actor, currentStepId, choice);
    });
  });
  container.querySelector('#btnCouncilAllPour')?.addEventListener('click', () => store.setAllVotesForStep(currentStepId, 'state', 'pour'));
  container.querySelector('#btnCouncilAllContre')?.addEventListener('click', () => store.setAllVotesForStep(currentStepId, 'state', 'contre'));
  container.querySelector('#btnPartyAllPour')?.addEventListener('click', () => store.setAllVotesForStep(currentStepId, 'party', 'pour'));
  container.querySelector('#btnPartyAllContre')?.addEventListener('click', () => store.setAllVotesForStep(currentStepId, 'party', 'contre'));
  container.querySelector('#btnAutoRealistic')?.addEventListener('click', () => store.toggleRealisticVotesForStep(currentStepId));
  container.querySelector('#btnInvertVotes')?.addEventListener('click', () => store.invertVotesForStep(currentStepId));
  container.querySelector('#btnResetVotes')?.addEventListener('click', () => store.resetVotesForStep(currentStepId));
  container.querySelector('#btnValidateStep')?.addEventListener('click', () => store.validateVoteStep(currentStepId));
  container.querySelector('#btnApplyToSimLarge')?.addEventListener('click', () => {
    store.applyVoteToSimulation();
    store.setActiveTab('simulator');
  });
  container.querySelector('#btnGoToFinance')?.addEventListener('click', async () => {
    store.applyVoteToSimulation();
    await store.initFinance();
    store.setActiveTab('finance');
  });
  container.querySelector('#btnSwitchToSim')?.addEventListener('click', () => store.setActiveTab('simulator'));
  container.querySelector('#btnBackToDirectives')?.addEventListener('click', () => store.setActiveTab('scenario'));
}
