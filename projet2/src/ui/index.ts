// Layout & Landing
export { renderHeader, renderMobileNav } from './layout/navigation';
export { renderLandingView } from './landing/landingView';

// Immersion & Rôles
export { renderIntroView } from './intro/introCarouselView';
export { renderImmersionSubTab } from './intro/introImmersionView';
export { renderGroupsSubTab, renderAllocationPreview } from './intro/introGroupsView';
export { renderRolesSubTab, getFilteredRoles } from './intro/introRolesView';
export { allocateStudents, exportGroupsToCSV } from './intro/groupAllocator';

// Scénarios & Directives
export { renderScenarioView } from './scenario/scenarioView';

// Fiches Acteurs & Négociation
export { renderActorsView, setActorViewFocus } from './actors/actorsView';
export { renderSingleActorSheetHtml } from './actors/actorsSheetCard';
export { renderDashboardViewHtml } from './actors/actorsDashboard';

// Vote & Codécision
export { renderVoteView } from './vote/voteView';
export { renderCouncilCardHtml } from './vote/voteCouncilView';
export { renderParliamentCardHtml, initParliamentHemicycle } from './vote/voteParliamentView';
export { renderPackageSummaryHtml } from './vote/voteSummaryView';

// Négociation Financière (Phase B)
export { renderFinanceView } from './finance/financeView';

// Simulateur
export { renderSimulatorView } from './simulator/simulatorView';
export { renderSimulatorControls } from './simulator/simulatorControls';

// Graphiques
export {
  renderEUChart,
  renderCountryChart,
  renderPartyChart,
  renderLobbyChart,
  generateDataTableHtml,
  destroyChart,
  registerChart
} from './charts/charts';

// Pédagogie & Institutions
export { renderPedagogyView } from './pedagogy/pedagogyView';
export { openPedagogyModal } from './pedagogy/pedagogyModal';
export { renderInstitutionsView } from './pedagogy/institutionsView';
