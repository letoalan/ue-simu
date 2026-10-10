export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ue_simu_theme';

/**
 * Récupère le thème initial (depuis localStorage ou préférence système)
 */
export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Applique le thème au document et synchronise le stockage local
 */
export function setTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Synchronise les éléments graphiques Chart.js si disponible
  try {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

    // Import dynamique optionnel pour ne pas bloquer si hors contexte Chart
    if ((window as any).Chart) {
      (window as any).Chart.defaults.color = textColor;
      (window as any).Chart.defaults.borderColor = gridColor;
    }
  } catch {
    // Poursuite normale
  }

  // Notifie les boutons de basculement de thème
  updateThemeToggleButtons(theme);
}

/**
 * Bascule entre mode clair et mode sombre
 */
export function toggleTheme(): ThemeMode {
  const current = (document.documentElement.getAttribute('data-theme') as ThemeMode) || getInitialTheme();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Met à jour l'icône et l'état des boutons de thème dans l'interface
 */
function updateThemeToggleButtons(theme: ThemeMode): void {
  const isDark = theme === 'dark';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
    btn.setAttribute('title', isDark ? 'Passer en mode clair (☀️)' : 'Passer en mode sombre (🌙)');
    const icon = btn.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
  });
}

/**
 * Initialise le thème au démarrage de l'application
 */
export function initTheme(): void {
  const theme = getInitialTheme();
  setTheme(theme);

  // Écoute les changements de préférences système
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Ne changer que si l'utilisateur n'a pas défini de préférence explicite
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
