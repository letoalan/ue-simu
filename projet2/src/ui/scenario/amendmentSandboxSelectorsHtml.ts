import type { SandboxScope } from '../../simulation/sandboxEngine';
import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';

export function renderEntitySelectorHtml(currentScope: SandboxScope): string {
  if (currentScope.actorType === 'eu') {
    return `<span class="sandbox-entity-help-text">Agrégation des 27 États et 720 députés</span>`;
  }
  if (currentScope.actorType === 'country') {
    return `
      <div class="sandbox-entity-picker-group">
        <label for="sandboxCountrySelect" class="sandbox-entity-picker-label">État :</label>
        <select id="sandboxCountrySelect" class="form-select form-select-sm sandbox-entity-select">
          ${Object.values(COUNTRIES_META).map(c => `
            <option value="${c.code}" ${currentScope.countryCode === c.code ? 'selected' : ''}>
              ${c.name} (${c.population} M hab)
            </option>
          `).join('')}
        </select>
        <div class="sandbox-entity-actions">
          <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSim" title="Ouvrir dans le Simulateur">📊 Simuler</button>
          <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSheet" title="Consulter la fiche rôle">📑 Fiche</button>
        </div>
      </div>
    `;
  }
  if (currentScope.actorType === 'party') {
    return `
      <div class="sandbox-entity-picker-group">
        <label for="sandboxPartySelect" class="sandbox-entity-picker-label">Groupe :</label>
        <select id="sandboxPartySelect" class="form-select form-select-sm sandbox-entity-select">
          ${Object.values(PARTIES_PROFILES).map(p => `
            <option value="${p.code}" ${currentScope.partyCode === p.code ? 'selected' : ''}>
              ${p.code} — ${p.nom.split('(')[0].trim()} (${p.base.meps} s.)
            </option>
          `).join('')}
        </select>
        <div class="sandbox-entity-actions">
          <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSim" title="Ouvrir dans le Simulateur">📊 Simuler</button>
          <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSheet" title="Consulter la fiche rôle">📑 Fiche</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="sandbox-entity-picker-group">
      <label for="sandboxLobbySelect" class="sandbox-entity-picker-label">Lobby :</label>
      <select id="sandboxLobbySelect" class="form-select form-select-sm sandbox-entity-select">
        ${Object.values(LOBBIES_PROFILES).map(l => `
          <option value="${l.code}" ${currentScope.lobbyCode === l.code ? 'selected' : ''}>${l.nom}</option>
        `).join('')}
      </select>
      <div class="sandbox-entity-actions">
        <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSim" title="Ouvrir dans le Simulateur">📊 Simuler</button>
        <button class="btn btn-secondary btn-sm sandbox-actor-link-btn" id="btnJumpToActorSheet" title="Consulter la fiche rôle">📑 Fiche</button>
      </div>
    </div>
  `;
}

export function renderMetricFilterButtons(currentScope: SandboxScope, currentFocusMetric: string, isS1: boolean): string {
  if (currentScope.actorType === 'eu' || currentScope.actorType === 'country') {
    return `
      <button class="sandbox-metric-btn ${currentFocusMetric === 'all' ? 'active' : ''}" data-metric="all">Tous</button>
      ${isS1 ? `
        <button class="sandbox-metric-btn ${currentFocusMetric === 'croiss' ? 'active' : ''}" data-metric="croiss">PIB</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'co2' ? 'active' : ''}" data-metric="co2">CO₂</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'gini' ? 'active' : ''}" data-metric="gini">Inégalités</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'veb' ? 'active' : ''}" data-metric="veb">Bien-être</button>
      ` : `
        <button class="sandbox-metric-btn ${currentFocusMetric === 'normandie' ? 'active' : ''}" data-metric="normandie">Sécurité</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'vdem' ? 'active' : ''}" data-metric="vdem">Démocratie</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'pib' ? 'active' : ''}" data-metric="pib">PIB</button>
        <button class="sandbox-metric-btn ${currentFocusMetric === 'idh' ? 'active' : ''}" data-metric="idh">IDH</button>
      `}
    `;
  }
  if (currentScope.actorType === 'party') {
    return `
      <button class="sandbox-metric-btn ${currentFocusMetric === 'all' ? 'active' : ''}" data-metric="all">Tous</button>
      <button class="sandbox-metric-btn ${currentFocusMetric === 'meps' ? 'active' : ''}" data-metric="meps">Sièges</button>
      <button class="sandbox-metric-btn ${currentFocusMetric === 'sat' ? 'active' : ''}" data-metric="sat">Satisfaction</button>
    `;
  }
  return `
    <button class="sandbox-metric-btn ${currentFocusMetric === 'all' ? 'active' : ''}" data-metric="all">Tous</button>
    <button class="sandbox-metric-btn ${currentFocusMetric === 'rep' ? 'active' : ''}" data-metric="rep">Réputation</button>
    <button class="sandbox-metric-btn ${currentFocusMetric === 'etats' ? 'active' : ''}" data-metric="etats">Conseil</button>
    <button class="sandbox-metric-btn ${currentFocusMetric === 'parl' ? 'active' : ''}" data-metric="parl">Parlement</button>
    <button class="sandbox-metric-btn ${currentFocusMetric === 'comm' ? 'active' : ''}" data-metric="comm">Commission</button>
  `;
}
