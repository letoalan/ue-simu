import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';
import { loadActorSheetsForDirective, type ActorSheet, type DirectiveActorSheets } from '../../data/actorSheets';
import { store } from '../../state/store';
import type { CountryCode, PartyCode, LobbyCode } from '../../domain/types';
import { renderSingleActorSheetHtml } from './actorsSheetCard';
import { renderDashboardViewHtml } from './actorsDashboard';
import { attachCountryMapEvents } from './countryMap';

let currentCategory: 'commission' | 'states' | 'parties' | 'lobbies' = 'states';
let currentActorKey = 'FR';
let currentDirectiveId = 1;
let currentSheets: DirectiveActorSheets | null = null;
let currentViewMode: 'sheet' | 'dashboard' = 'sheet';

export function setActorViewFocus(category: 'commission' | 'states' | 'parties' | 'lobbies', key: string): void {
  currentCategory = category;
  currentActorKey = key;
  currentViewMode = 'sheet';
}

export async function renderActorsView(container: HTMLElement): Promise<void> {
  const state = store.getState();
  currentDirectiveId = state.selectedDirective?.id || currentDirectiveId || 1;
  container.innerHTML = `
    <div class="main-layout" id="actorsViewMainLayout">
      <div style="display:flex; justify-content:center; align-items:center; min-height:240px; color:var(--color-text-muted);">
        <span>Chargement des fiches acteurs en cours... ⏳</span>
      </div>
    </div>`;

  try {
    currentSheets = await loadActorSheetsForDirective(state.scenarioId, currentDirectiveId);
  } catch (err) {
    console.error('Erreur chargement fiches acteurs:', err);
  }
  renderActorsContent(container);
}

function renderActorsContent(container: HTMLElement): void {
  const state = store.getState();
  const sim = state.simulationResult;
  const activeSheet = getActiveSheet();

  container.innerHTML = `
    <div class="main-layout" id="actorsViewMainLayout">
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-commission">Scénario ${state.scenarioId}</span>
              <h2 style="font-size:1.2rem; font-weight:800; color:var(--color-primary); margin:0;">
                Fiches de Négociation & Rôles des Acteurs
              </h2>
            </div>
            <p style="font-size:0.85rem; color:var(--color-text-muted); margin-top:2px;">
              Directives, mandats institutionnels, arguments et positions secrètes pour le jeu de rôle.
            </p>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm ${currentViewMode === 'sheet' ? 'btn-primary' : 'btn-secondary'}" id="btnModeSheet">📑 Fiche Acteur</button>
            <button class="btn btn-sm ${currentViewMode === 'dashboard' ? 'btn-primary' : 'btn-secondary'}" id="btnModeDashboard">📊 Vue Synoptique</button>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; padding-top:10px; border-top:1px solid var(--color-border);">
          <div style="font-size:0.83rem; font-weight:600; color:var(--color-text-muted);">
            Directive de référence : <b>${state.scenarioData?.directive.find(d => d.id === currentDirectiveId)?.nom || `Directive ${currentDirectiveId}`}</b>
          </div>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${Array.from({ length: 8 }, (_, i) => i + 1).map(num => `
              <button class="btn btn-sm btn-select-directive ${currentDirectiveId === num ? 'btn-primary' : 'btn-secondary'}" data-directive-num="${num}" style="padding:4px 8px; min-height:30px; font-size:0.78rem;">D${num}</button>
            `).join('')}
          </div>
        </div>
      </div>

      ${currentViewMode === 'sheet' ? `
        <div class="card" style="padding:14px;">
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; border-bottom:1px solid var(--color-border); padding-bottom:10px;">
            <button class="btn btn-sm ${currentCategory === 'commission' ? 'btn-primary' : 'btn-secondary'}" data-category="commission">🏛️ Commission (1)</button>
            <button class="btn btn-sm ${currentCategory === 'states' ? 'btn-primary' : 'btn-secondary'}" data-category="states">🌍 États Membres (6)</button>
            <button class="btn btn-sm ${currentCategory === 'parties' ? 'btn-primary' : 'btn-secondary'}" data-category="parties">🇪🇺 Parlement Européen (6)</button>
            <button class="btn btn-sm ${currentCategory === 'lobbies' ? 'btn-primary' : 'btn-secondary'}" data-category="lobbies">💼 Lobbies & Société Civile (6)</button>
          </div>
          <div class="actor-pills-bar">${renderActorPills()}</div>
        </div>
        ${renderSingleActorSheetHtml(activeSheet)}
      ` : renderDashboardViewHtml(sim)}
    </div>`;

  attachActorsEvents(container);
}

function getActiveSheet(): ActorSheet | null {
  if (!currentSheets) return null;
  if (currentCategory === 'commission') return currentSheets.commission;
  if (currentCategory === 'states') return currentSheets.states[currentActorKey] || Object.values(currentSheets.states)[0];
  if (currentCategory === 'parties') return currentSheets.parties[currentActorKey] || Object.values(currentSheets.parties)[0];
  if (currentCategory === 'lobbies') return currentSheets.lobbies[currentActorKey] || Object.values(currentSheets.lobbies)[0];
  return null;
}

function renderActorPills(): string {
  if (currentCategory === 'commission') {
    return `<button class="actor-pill-btn active" data-actor-key="commission">
      <img src="./medias/images/euro/eurocomm.jpg" alt="Commission" class="actor-pill-icon" />
      <span>Commission Européenne</span>
    </button>`;
  }
  if (currentCategory === 'states') {
    return Object.values(COUNTRIES_META).map(c => `
      <button class="actor-pill-btn ${currentActorKey === c.code ? 'active' : ''}" data-actor-key="${c.code}">
        <img src="${c.flagUrl}" alt="${c.name}" class="actor-pill-icon" /><span>${c.name}</span>
      </button>`).join('');
  }
  if (currentCategory === 'parties') {
    return Object.values(PARTIES_PROFILES).map(p => `
      <button class="actor-pill-btn ${currentActorKey === p.code ? 'active' : ''}" data-actor-key="${p.code}">
        ${p.logoUrl ? `<img src="${p.logoUrl}" alt="${p.code}" class="actor-pill-icon" style="object-fit:contain;" />` : ''}
        <span>${p.code} — ${p.nom.split('(')[0].trim()}</span>
      </button>`).join('');
  }
  return Object.values(LOBBIES_PROFILES).map(l => `
    <button class="actor-pill-btn ${currentActorKey === l.code ? 'active' : ''}" data-actor-key="${l.code}">
      ${l.logoUrl ? `<img src="${l.logoUrl}" alt="${l.code}" class="actor-pill-icon" style="object-fit:contain;" />` : ''}
      <span>${l.nom}</span>
    </button>`).join('');
}

function attachActorsEvents(container: HTMLElement): void {
  container.querySelector('#btnModeSheet')?.addEventListener('click', () => { currentViewMode = 'sheet'; renderActorsContent(container); });
  container.querySelector('#btnModeDashboard')?.addEventListener('click', () => { currentViewMode = 'dashboard'; renderActorsContent(container); });
  container.querySelectorAll('.btn-select-directive').forEach(btn => {
    btn.addEventListener('click', async () => {
      const num = Number(btn.getAttribute('data-directive-num'));
      if (num >= 1 && num <= 8) {
        currentDirectiveId = num;
        try { currentSheets = await loadActorSheetsForDirective(store.getState().scenarioId, currentDirectiveId); } catch (e) { console.error(e); }
        renderActorsContent(container);
      }
    });
  });
  container.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') as any;
      if (cat) {
        currentCategory = cat;
        currentActorKey = cat === 'commission' ? 'commission' : cat === 'states' ? 'FR' : cat === 'parties' ? 'PPE' : 'BIG_TECH';
        renderActorsContent(container);
      }
    });
  });
  container.querySelectorAll('.actor-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-actor-key');
      if (key) { currentActorKey = key; renderActorsContent(container); }
    });
  });
  container.querySelectorAll('.btn-open-sheet').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat') as any;
      const id = btn.getAttribute('data-id') as string;
      if (cat && id) { currentCategory = cat; currentActorKey = id; currentViewMode = 'sheet'; renderActorsContent(container); }
    });
  });
  container.querySelector('#btnSelectInSim')?.addEventListener('click', () => {
    const sheet = getActiveSheet();
    if (!sheet) return;
    if (sheet.category === 'states') store.selectCountry(sheet.id as CountryCode);
    else if (sheet.category === 'parties') store.selectParty(sheet.id as PartyCode);
    else if (sheet.category === 'lobbies') store.selectLobby(sheet.id as LobbyCode);
    store.setActiveTab('simulator');
  });

  const activeSheet = getActiveSheet();
  if (currentViewMode === 'sheet' && activeSheet && activeSheet.category === 'states') {
    attachCountryMapEvents(container, activeSheet.id as CountryCode);
  }
}
