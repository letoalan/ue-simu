import { describe, it, expect } from 'vitest';
import { loadActorSheetsForDirective, getSingleActorSheet } from '../src/data/actorSheets';

describe('Actor Sheets Loader & Parser', () => {
  it('charge correctement l’ensemble des fiches acteurs pour Scénario 1 Directive 1', async () => {
    const sheets = await loadActorSheetsForDirective(1, 1);

    expect(sheets).toBeDefined();
    expect(sheets.scenarioId).toBe(1);
    expect(sheets.directiveId).toBe(1);

    // 1. Commission
    expect(sheets.commission).toBeDefined();
    expect(sheets.commission.nom).toContain('Commission');
    expect(sheets.commission.enjeuxDirective.length).toBeGreaterThan(0);
    expect(sheets.commission.strategie.length).toBeGreaterThan(10);
    expect(sheets.commission.arguments.length).toBeGreaterThan(0);

    // 2. Les 6 États Membres
    const stateKeys = Object.keys(sheets.states);
    expect(stateKeys).toContain('FR');
    expect(stateKeys).toContain('DE');
    expect(stateKeys).toContain('IT');
    expect(stateKeys).toContain('PL');
    expect(stateKeys).toContain('SE');
    expect(stateKeys).toContain('HU');
    expect(stateKeys.length).toBe(6);

    // Vérification de la France
    const france = sheets.states['FR'];
    expect(france.nom).toBe('France');
    expect(france.alliances.length).toBeGreaterThan(0);
    expect(france.oppositions.length).toBeGreaterThan(0);
    expect(france.positionsAmendements.length).toBeGreaterThan(0);

    // 3. Les 6 Partis Politiques
    const partyKeys = Object.keys(sheets.parties);
    expect(partyKeys).toContain('PPE');
    expect(partyKeys).toContain('SDE');
    expect(partyKeys).toContain('RENEW');
    expect(partyKeys).toContain('VERT');
    expect(partyKeys).toContain('ECR');
    expect(partyKeys).toContain('GUE');
    expect(partyKeys.length).toBe(6);

    // 4. Les 6 Lobbies
    const lobbyKeys = Object.keys(sheets.lobbies);
    expect(lobbyKeys).toContain('BIG_TECH');
    expect(lobbyKeys).toContain('ENERGIES_FOSSILES');
    expect(lobbyKeys).toContain('BANQUES_FINANCE');
    expect(lobbyKeys).toContain('AGROCHIMIE');
    expect(lobbyKeys).toContain('PHARMA');
    expect(lobbyKeys).toContain('AUTOMOBILE');
    expect(lobbyKeys.length).toBe(6);
  });

  it('récupère une fiche individuelle via getSingleActorSheet', async () => {
    const ppeSheet = await getSingleActorSheet(1, 1, 'parties', 'PPE');
    expect(ppeSheet).not.toBeNull();
    expect(ppeSheet?.nom).toContain('Populaire');
    expect(ppeSheet?.category).toBe('parties');

    const techSheet = await getSingleActorSheet(1, 1, 'lobbies', 'BIG_TECH');
    expect(techSheet).not.toBeNull();
    expect(techSheet?.nom).toContain('Tech');
  });

  it('fournit un fallback robuste si un scénario est introuvable', async () => {
    const fallback = await loadActorSheetsForDirective(99, 99);
    expect(fallback).toBeDefined();
    expect(fallback.commission).toBeDefined();
    expect(fallback.commission.nom).toContain('Commission');
    expect(Object.keys(fallback.states).length).toBe(6);
  });

  it('garantit que pour toutes les directives de tous les scénarios, les amendements de la Commission ont un nom valide', async () => {
    for (const scenarioId of [1, 2]) {
      for (let directiveId = 1; directiveId <= 8; directiveId++) {
        const sheets = await loadActorSheetsForDirective(scenarioId, directiveId);
        expect(sheets.commission).toBeDefined();
        expect(sheets.commission.positionsAmendements.length).toBeGreaterThan(0);
        for (const pos of sheets.commission.positionsAmendements) {
          expect(pos.amendement).toBeTruthy();
          expect(pos.titre).toBeDefined();
          expect(pos.titre?.trim()).not.toBe('');
          expect(pos.titre).not.toBe('Sans titre');
        }
      }
    }
  });
});
