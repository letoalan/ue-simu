import { store, isFinanceUnlocked, type TabId, type UserJourney } from '../../state/store';
import { toggleTheme } from '../../state/theme';

export function renderHeader(container: HTMLElement): void {
  const state = store.getState();
  const scenarioTitle = state.scenarioId === 1 ? 'S1 : Écologie & Climat' : 'S2 : Sécurité & Géopolitique';
  const defaultDirNom = state.scenarioId === 1 ? 'Pacte vert innovant' : 'Sécurité énergétique';
  const directiveId = state.selectedDirective?.id ?? 1;
  const directiveNom = state.selectedDirective?.nom ?? defaultDirNom;
  const directiveLabel = `D${directiveId} : ${directiveNom}`;
  const unlocked = isFinanceUnlocked(state);
  const j = state.userJourney;
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  container.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <!-- Ligne 1 : Marque à gauche, Navigation principale au centre, Thème à droite -->
        <div class="header-top-row">
          <a href="#" class="brand" id="brandLogo">
            <img src="./medias/images/flags/ue.jpg" alt="Drapeau UE" class="brand-flag" />
            <span class="brand-title">UE-SIMU</span>
          </a>

          <nav class="desktop-nav" aria-label="Navigation principale">
            ${renderDesktopNavItems(state, unlocked)}
          </nav>

          <div class="header-top-actions">
            <button class="theme-toggle-btn" id="btnThemeToggle" aria-label="${isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}" title="${isDark ? 'Passer en mode clair (☀️)' : 'Passer en mode sombre (🌙)'}">
              <span class="theme-toggle-icon">${isDark ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        <!-- Ligne 2 : Barre de contexte (Sélecteur de parcours + Cartouche actif côte à côte) -->
        <div class="header-context-bar">
          <div class="journey-switcher" role="group" aria-label="Sélecteur de parcours UX">
            <button class="journey-btn ${j === 'participant' ? 'active' : ''}" data-journey="participant" title="Mon rôle, négocier, comprendre, résultats">
              🎓 Participant
            </button>
            <button class="journey-btn ${j === 'animateur' ? 'active' : ''}" data-journey="animateur" title="Conduite de séance, ordre du jour, votes, projection">
              🎙️ Animateur
            </button>
            <button class="journey-btn ${j === 'maitre_du_jeu' ? 'active' : ''}" data-journey="maitre_du_jeu" title="Configuration, attribution des groupes, sauvegardes">
              ⚙️ Maître du Jeu
            </button>
          </div>

          <div class="active-context-cartouche" id="activeContextCartouche" role="button" tabindex="0" title="Cliquer pour changer de scénario ou de directive">
            <div class="cartouche-body">
              <span class="cartouche-icon">🏛️</span>
              <span class="cartouche-pill">Actif</span>
              <span class="cartouche-scenario"><strong>${scenarioTitle}</strong></span>
              <span class="cartouche-sep">•</span>
              <span class="cartouche-directive"><strong>${directiveLabel}</strong></span>
            </div>
            <span class="cartouche-action">Changer ✏️</span>
          </div>
        </div>
      </div>
    </header>
  `;

  attachHeaderEvents(container);
}

function renderDesktopNavItems(state: any, unlocked: boolean): string {
  const t = state.activeTab;
  const j: UserJourney = state.userJourney;

  if (j === 'participant') {
    return `
      <button class="nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing">📖 Aide & Matériel</button>
      <button class="nav-btn ${t === 'actors' ? 'active' : ''}" data-tab="actors">Mon Rôle 🎭</button>
      <button class="nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote">Négocier 📜</button>
      <button class="nav-btn ${t === 'pedagogy' ? 'active' : ''}" data-tab="pedagogy">Comprendre 💡</button>
      <button class="nav-btn nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator">Mes Résultats 📊</button>
      <button class="nav-btn ${t === 'finance' ? 'active' : ''} ${!unlocked ? 'nav-btn-locked' : ''}" data-tab="finance">Finances ${unlocked ? '💶' : '🔒'}</button>
    `;
  }
  if (j === 'animateur') {
    return `
      <button class="nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing">📖 Aide & Matériel</button>
      <button class="nav-btn ${t === 'intro' ? 'active' : ''}" data-tab="intro">Séance 📋</button>
      <button class="nav-btn ${t === 'scenario' ? 'active' : ''}" data-tab="scenario">Propositions 📜</button>
      <button class="nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote">Votes 🗳️</button>
      <button class="nav-btn nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator">Projection 📽️</button>
      <button class="nav-btn ${t === 'finance' ? 'active' : ''} ${!unlocked ? 'nav-btn-locked' : ''}" data-tab="finance">Finances ${unlocked ? '💶' : '🔒'}</button>
    `;
  }
  return `
    <button class="nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing">📖 Aide & Matériel</button>
    <button class="nav-btn ${t === 'intro' ? 'active' : ''}" data-tab="intro">Accueil 🇪🇺</button>
    <button class="nav-btn ${t === 'scenario' ? 'active' : ''}" data-tab="scenario">Directives 📜</button>
    <button class="nav-btn ${t === 'actors' ? 'active' : ''}" data-tab="actors">Rôles 👥</button>
    <button class="nav-btn ${t === 'institutions' ? 'active' : ''}" data-tab="institutions">Institutions</button>
    <button class="nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote">Vote 🗳️</button>
    <button class="nav-btn ${t === 'finance' ? 'active' : ''} ${!unlocked ? 'nav-btn-locked' : ''}" data-tab="finance">Finances ${unlocked ? '💶' : '🔒'}</button>
    <button class="nav-btn nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator">📊 Simulateur</button>
  `;
}

export function renderMobileNav(container: HTMLElement): void {
  const state = store.getState();
  const unlocked = isFinanceUnlocked(state);
  const t = state.activeTab;
  const j: UserJourney = state.userJourney;

  container.innerHTML = `
    <nav class="mobile-nav" aria-label="Navigation mobile">
      ${j === 'participant' ? `
        <button class="mobile-nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing"><span class="mobile-nav-icon">📖</span><span>Aide</span></button>
        <button class="mobile-nav-btn ${t === 'actors' ? 'active' : ''}" data-tab="actors"><span class="mobile-nav-icon">🎭</span><span>Rôle</span></button>
        <button class="mobile-nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote"><span class="mobile-nav-icon">📜</span><span>Négocier</span></button>
        <button class="mobile-nav-btn ${t === 'pedagogy' ? 'active' : ''}" data-tab="pedagogy"><span class="mobile-nav-icon">💡</span><span>Comprendre</span></button>
        <button class="mobile-nav-btn mobile-nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator"><span class="mobile-nav-icon">📊</span><span>Résultats</span></button>
        <button class="mobile-nav-btn ${t === 'finance' ? 'active' : ''} ${!unlocked ? 'locked' : ''}" data-tab="finance"><span class="mobile-nav-icon">${unlocked ? '💶' : '🔒'}</span><span>Finances</span></button>
      ` : j === 'animateur' ? `
        <button class="mobile-nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing"><span class="mobile-nav-icon">📖</span><span>Aide</span></button>
        <button class="mobile-nav-btn ${t === 'intro' ? 'active' : ''}" data-tab="intro"><span class="mobile-nav-icon">📋</span><span>Séance</span></button>
        <button class="mobile-nav-btn ${t === 'scenario' ? 'active' : ''}" data-tab="scenario"><span class="mobile-nav-icon">📜</span><span>Propositions</span></button>
        <button class="mobile-nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote"><span class="mobile-nav-icon">🗳️</span><span>Votes</span></button>
        <button class="mobile-nav-btn mobile-nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator"><span class="mobile-nav-icon">📽️</span><span>Projection</span></button>
        <button class="mobile-nav-btn ${t === 'finance' ? 'active' : ''} ${!unlocked ? 'locked' : ''}" data-tab="finance"><span class="mobile-nav-icon">${unlocked ? '💶' : '🔒'}</span><span>Finances</span></button>
      ` : `
        <button class="mobile-nav-btn ${t === 'landing' ? 'active' : ''}" data-tab="landing"><span class="mobile-nav-icon">📖</span><span>Aide</span></button>
        <button class="mobile-nav-btn ${t === 'intro' ? 'active' : ''}" data-tab="intro"><span class="mobile-nav-icon">🇪🇺</span><span>Accueil</span></button>
        <button class="mobile-nav-btn ${t === 'scenario' ? 'active' : ''}" data-tab="scenario"><span class="mobile-nav-icon">📜</span><span>Directives</span></button>
        <button class="mobile-nav-btn ${t === 'actors' ? 'active' : ''}" data-tab="actors"><span class="mobile-nav-icon">👥</span><span>Rôles</span></button>
        <button class="mobile-nav-btn ${t === 'vote' ? 'active' : ''}" data-tab="vote"><span class="mobile-nav-icon">🗳️</span><span>Vote</span></button>
        <button class="mobile-nav-btn mobile-nav-btn-simulator ${t === 'simulator' ? 'active' : ''}" data-tab="simulator"><span class="mobile-nav-icon">📊</span><span>Simu</span></button>
      `}
    </nav>
  `;

  container.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as TabId;
      if (tab) store.setActiveTab(tab);
    });
  });
}

function attachHeaderEvents(container: HTMLElement): void {
  container.querySelector('#brandLogo')?.addEventListener('click', (e) => {
    e.preventDefault();
    store.setActiveTab('landing');
  });

  container.querySelector('#btnThemeToggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  const cartouche = container.querySelector('#activeContextCartouche');
  cartouche?.addEventListener('click', () => {
    store.setActiveTab('scenario');
  });
  cartouche?.addEventListener('keydown', (e: Event) => {
    const ke = e as KeyboardEvent;
    if (ke.key === 'Enter' || ke.key === ' ') {
      ke.preventDefault();
      store.setActiveTab('scenario');
    }
  });

  container.querySelectorAll('.journey-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const journey = btn.getAttribute('data-journey') as UserJourney;
      if (journey) store.setUserJourney(journey);
    });
  });

  container.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as TabId;
      if (tab) store.setActiveTab(tab);
    });
  });
}
