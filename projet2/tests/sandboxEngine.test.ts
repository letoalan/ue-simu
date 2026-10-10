import { describe, it, expect } from 'vitest';
import { computeSandboxComparison, computeActorKPIDeltas } from '../src/simulation/sandboxEngine';
import type { Directive } from '../src/domain/types';

describe('Moteur Différentiel Sandbox (Baseline vs Amendements)', () => {
  const dummyDirectiveS1: Directive = {
    id: 1,
    nom: 'Pacte vert innovant',
    orientation: 'Investir 2% du PIB dans les renouvelables',
    proposition: 'Financement massif',
    description: 'Réduire le CO2 de 50%',
    declaration_intention: 'Action climatique',
    statistiques_depart: {
      pib_eu: 2.0,
      gini_eu: 0.30,
      co2_eu: 8.0,
      veb_eu: 80.0
    },
    amendements: [
      {
        id: '1-1A',
        type: 'parlement',
        origine: 'Verts/ALE',
        description: 'Augmenter la part du PIB à 2,5%',
        impact: {
          pib_eu: 2.5,
          gini_eu: 0.28,
          co2_eu: 6.0,
          veb_eu: 85.0
        }
      },
      {
        id: '1-1B',
        type: 'conseil',
        origine: 'DE',
        description: 'Compromis modéré',
        impact: {
          co2_eu: 7.2
        }
      }
    ]
  };

  const dummyDirectiveS2: Directive = {
    id: 1,
    nom: 'Sécurité énergétique',
    orientation: 'Diversification des approvisionnements',
    proposition: 'Stocks communs',
    description: 'Sécurité de l Union',
    declaration_intention: 'Indépendance',
    statistiques_depart: {
      normandie_eu: 5.0,
      vdem_eu: 7.0,
      pib_eu: 1.5,
      idh_eu: 8.5
    },
    amendements: [
      {
        id: '2-1A',
        type: 'parlement',
        origine: 'PPE',
        description: 'Renforcer la protection des infrastructures critiques',
        impact: {
          normandie_eu: 7.5,
          vdem_eu: 7.5
        }
      }
    ]
  };

  it('calcule une variation nulle lorsque aucun amendement n est sélectionné (Baseline pure)', () => {
    const comp = computeSandboxComparison(dummyDirectiveS1, new Set(), 1, 42);

    expect(comp.selectedAmendmentsCount).toBe(0);
    expect(comp.scoreDelta).toBe(0);
    expect(comp.scoreBaseline).toBe(comp.scoreAmended);

    comp.kpiDeltas.forEach(kpi => {
      expect(kpi.delta).toBeCloseTo(0, 5);
      expect(kpi.baselineVal).toBeCloseTo(kpi.amendedVal, 5);
    });
  });

  it('calcule fidèlement l impact différentiel d un amendement sur S1', () => {
    const comp = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 42);

    expect(comp.selectedAmendmentsCount).toBe(1);
    expect(comp.baselineInputs.pib_eu).toBe(2.0);
    expect(comp.amendedInputs.pib_eu).toBe(2.5);
    expect(comp.amendedInputs.co2_eu).toBe(6.0);

    const co2Delta = comp.kpiDeltas.find(k => k.key === 'co2');
    expect(co2Delta).toBeDefined();
    // La baisse de CO2 doit être reconnue comme positive pour l'UE
    expect(co2Delta!.delta).toBeLessThan(0);
    expect(co2Delta!.isPositiveForEU).toBe(true);

    const pibDelta = comp.kpiDeltas.find(k => k.key === 'pib');
    expect(pibDelta).toBeDefined();
    expect(pibDelta!.delta).toBeGreaterThan(0);
    expect(pibDelta!.isPositiveForEU).toBe(true);
  });

  it('gère correctement les indicateurs géopolitiques du Scénario 2', () => {
    const comp = computeSandboxComparison(dummyDirectiveS2, new Set(['2-1A']), 2, 42);

    expect(comp.scenarioId).toBe(2);
    expect(comp.kpiDeltas.map(k => k.key)).toEqual(['normandie', 'vdem', 'pib', 'idh']);

    const normandieDelta = comp.kpiDeltas.find(k => k.key === 'normandie');
    expect(normandieDelta).toBeDefined();
    expect(normandieDelta!.delta).toBeGreaterThan(0);
    expect(normandieDelta!.isPositiveForEU).toBe(true);
  });

  it('est déterministe et reproductible avec la même graine', () => {
    const comp1 = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 12345);
    const comp2 = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 12345);

    expect(comp1.scoreAmended).toBe(comp2.scoreAmended);
    expect(comp1.scoreDelta).toBe(comp2.scoreDelta);
    expect(comp1.kpiDeltas).toEqual(comp2.kpiDeltas);
  });

  describe('Sélecteur et extraction des KPI actoriels (computeActorKPIDeltas)', () => {
    it('extrait les indicateurs agrégés pour le scope UE', () => {
      const comp = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 42);
      const summary = computeActorKPIDeltas(comp, {
        actorType: 'eu',
        countryCode: 'FR',
        partyCode: 'PPE',
        lobbyCode: 'BIG_TECH'
      });

      expect(summary.actorType).toBe('eu');
      expect(summary.actorKey).toBe('EU');
      expect(summary.actorName).toContain('Union Européenne');
      expect(summary.scoreLabel).toBe('Score Global UE');
      expect(summary.kpiDeltas.length).toBe(4);
    });

    it('extrait les métriques spécifiques d un État Membre (Conseil)', () => {
      const comp = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 42);
      const summary = computeActorKPIDeltas(comp, {
        actorType: 'country',
        countryCode: 'FR',
        partyCode: 'PPE',
        lobbyCode: 'BIG_TECH'
      });

      expect(summary.actorType).toBe('country');
      expect(summary.actorKey).toBe('FR');
      expect(summary.actorName).toBe('France');
      expect(summary.scoreLabel).toContain('France');
      // Contient les métriques S1 + Gain Net Relatif
      expect(summary.kpiDeltas.some(k => k.key === 'croiss')).toBe(true);
      expect(summary.kpiDeltas.some(k => k.key === 'gain')).toBe(true);
    });

    it('extrait les métriques d un groupe politique (Parlement)', () => {
      const comp = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 42);
      const summary = computeActorKPIDeltas(comp, {
        actorType: 'party',
        countryCode: 'DE',
        partyCode: 'VERT',
        lobbyCode: 'BIG_TECH'
      });

      expect(summary.actorType).toBe('party');
      expect(summary.actorKey).toBe('VERT');
      expect(summary.actorName).toContain('Verts');
      expect(summary.scoreLabel).toContain('Score Victoire');
      expect(summary.kpiDeltas.some(k => k.key === 'meps')).toBe(true);
      expect(summary.kpiDeltas.some(k => k.key === 'sat')).toBe(true);
    });

    it('extrait les métriques d un lobby sectoriel (Société Civile)', () => {
      const comp = computeSandboxComparison(dummyDirectiveS1, new Set(['1-1A']), 1, 42);
      const summary = computeActorKPIDeltas(comp, {
        actorType: 'lobby',
        countryCode: 'IT',
        partyCode: 'PPE',
        lobbyCode: 'BIG_TECH'
      });

      expect(summary.actorType).toBe('lobby');
      expect(summary.actorKey).toBe('BIG_TECH');
      expect(summary.actorName).toContain('Big Tech');
      expect(summary.scoreLabel).toContain('Score Réussite');
      expect(summary.kpiDeltas.some(k => k.key === 'rep')).toBe(true);
      expect(summary.kpiDeltas.some(k => k.key === 'etats')).toBe(true);
      expect(summary.kpiDeltas.some(k => k.key === 'parl')).toBe(true);
      expect(summary.kpiDeltas.some(k => k.key === 'comm')).toBe(true);
    });
  });
});

