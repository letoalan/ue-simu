import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getInitialTheme, setTheme, toggleTheme, initTheme } from '../src/state/theme';

describe('Thème Mode Clair / Sombre', () => {
  let mockStorage: Record<string, string> = {};
  let rootAttributes: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    rootAttributes = {};

    // Mock localStorage
    (globalThis as any).localStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; }
    };

    // Mock document
    (globalThis as any).document = {
      documentElement: {
        getAttribute: (attr: string) => rootAttributes[attr] ?? null,
        setAttribute: (attr: string, val: string) => { rootAttributes[attr] = val; },
        removeAttribute: (attr: string) => { delete rootAttributes[attr]; }
      },
      querySelectorAll: () => []
    };

    // Mock window
    (globalThis as any).window = {
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {}
      })
    };
  });

  afterEach(() => {
    delete (globalThis as any).localStorage;
    delete (globalThis as any).document;
    delete (globalThis as any).window;
  });

  it('détermine le thème par défaut quand aucun thème n est enregistré', () => {
    const theme = getInitialTheme();
    expect(theme).toBe('light');
  });

  it('récupère le thème depuis localStorage si présent', () => {
    mockStorage['ue_simu_theme'] = 'dark';
    expect(getInitialTheme()).toBe('dark');
  });

  it('applique et sauvegarde le mode sombre', () => {
    setTheme('dark');
    expect(rootAttributes['data-theme']).toBe('dark');
    expect(mockStorage['ue_simu_theme']).toBe('dark');
  });

  it('applique et sauvegarde le mode clair', () => {
    setTheme('light');
    expect(rootAttributes['data-theme']).toBe('light');
    expect(mockStorage['ue_simu_theme']).toBe('light');
  });

  it('bascule entre mode clair et mode sombre avec toggleTheme', () => {
    setTheme('light');
    const next1 = toggleTheme();
    expect(next1).toBe('dark');
    expect(rootAttributes['data-theme']).toBe('dark');

    const next2 = toggleTheme();
    expect(next2).toBe('light');
    expect(rootAttributes['data-theme']).toBe('light');
  });

  it('initialise le thème au démarrage sans erreur', () => {
    mockStorage['ue_simu_theme'] = 'dark';
    initTheme();
    expect(rootAttributes['data-theme']).toBe('dark');
  });
});
