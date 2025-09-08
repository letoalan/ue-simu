import { AppState } from '../../state/index.js';
import { init as initGroupAllocator } from './group-allocator.js';

// Variables locales au module
let scenario1Data = null;
let scenario2Data = null;
let currentSlide = 0;

/**
 * Initialise le module du carrousel.
 * @param {object} DOMRefs - Les références DOM collectées globalement.
 */
export async function init(DOMRefs) {
    console.log("Module Carrousel: Initialisation...");

    // 1. Attacher les écouteurs spécifiques au carrousel
    attachCarouselListeners(DOMRefs); // Attache les écouteurs aux points et flèches
    updateCarouselView(0, DOMRefs); // Affiche la première diapositive

    // 2. Initialiser les modules internes au carrousel (comme la gestion des groupes)
    initGroupAllocator(DOMRefs);

    // 3. Initialiser l'état de la sélection de scénario
    setScenarioSelectionState(null, DOMRefs);
    updateLaunchButtonState(DOMRefs);

    // 4. Charger les données et peupler les tables
    await loadScenarioData();
    const scenario1TableBody = document.querySelector('#scenario1Table tbody');
    const scenario2TableBody = document.querySelector('#scenario2Table tbody');
    populateTable(scenario1TableBody, scenario1Data, DOMRefs);
    populateTable(scenario2TableBody, scenario2Data, DOMRefs);

    console.log("Module Carrousel: Prêt.");
}

async function loadScenarioData() {
    try {
        const [data1, data2] = await Promise.all([
            fetch('/json/scenario1.json').then(r => r.json()),
            fetch('/json/scenario2.json').then(r => r.json())
        ]);
        scenario1Data = data1;
        scenario2Data = data2;
    } catch (e) {
        console.error('Erreur chargement JSON', e);
    }
}

function attachCarouselListeners(DOMRefs) {
    if (DOMRefs.dots) {
        DOMRefs.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateCarouselView(i, DOMRefs));
        });
    }
    if (DOMRefs.prevBtn) {
        DOMRefs.prevBtn.addEventListener('click', () => updateCarouselView(currentSlide - 1, DOMRefs));
    }
    if (DOMRefs.nextBtn) {
        DOMRefs.nextBtn.addEventListener('click', () => updateCarouselView(currentSlide + 1, DOMRefs));
    }
    // Attacher les écouteurs pour les boutons de sélection de scénario
    if (DOMRefs.selectScenarioBtns) {
        DOMRefs.selectScenarioBtns.forEach(btn => {
            btn.addEventListener('click', (e) => handleScenarioButtonClick(e, DOMRefs));
        });
    }
    // Attacher les écouteurs pour les boutons de tirage au sort
    if (DOMRefs.drawScenarioBtn) {
        DOMRefs.drawScenarioBtn.addEventListener('click', () => handleDrawScenario(DOMRefs));
    }
    if (DOMRefs.drawDirectiveBtn) {
        DOMRefs.drawDirectiveBtn.addEventListener('click', () => handleDrawDirective(DOMRefs));
    }
}

function populateTable(tableBody, scenarioData, DOMRefs) {
    // La source de vérité est l'array `directive` dans le fichier JSON du scénario.
    if (!scenarioData?.directive || !Array.isArray(scenarioData.directive)) {
        console.error("Données de directive invalides ou absentes pour le scénario.", scenarioData);
        return;
    }

    const directivesToShow = scenarioData.directive; // On affiche les directives, pas les amendements.

    tableBody.innerHTML = '';

    directivesToShow.forEach(directive => {
        const row = tableBody.insertRow();
        // L'ID et la description sont ceux de la directive.
        row.dataset.directiveId = directive.id;
        row.dataset.directiveDescription = directive.nom;
        // Le type n'est plus pertinent au niveau de la directive, on met une valeur générique.
        row.dataset.directiveType = 'Directive';

        const nameCell = row.insertCell(0);
        // On affiche le nom de la directive.
        nameCell.textContent = directive.nom.length > 60
            ? directive.nom.substring(0, 57) + '...'
            : directive.nom;

        const typeCell = row.insertCell(1);
        // La colonne "Type" n'a plus de sens dynamique, on met une valeur statique.
        typeCell.textContent = 'Globale';

        const selectCell = row.insertCell(2);
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Choisir';
        selectBtn.className = 'select-directive-btn';
        // Le bouton est désactivé par défaut, activé lors de la sélection du scénario.
        selectBtn.disabled = true;
        selectCell.appendChild(selectBtn);

        selectBtn.addEventListener('click', e => {
            e.stopPropagation();
            // On passe l'ID et le nom de la directive, ainsi que la colonne pour la mise en évidence.
            handleDirectiveSelection(directive.id, directive.nom, tableBody.closest('.scenario-column'), DOMRefs);
        });
    });
}

function handleScenarioButtonClick(e, DOMRefs) {
    const id = parseInt(e.target.dataset.scenarioId);
    const name = id === 1 ? "Développement Durable" : "Stabilité Géopolitique";
    const data = id === 1 ? scenario1Data : scenario2Data;

    AppState.setScenario(id, name, data);
    AppState.selectDirective(null, ''); // Réinitialiser la directive

    setScenarioSelectionState(id, DOMRefs);
    updateLaunchButtonState(DOMRefs);
}

function handleDirectiveSelection(directiveId, description, columnElement, DOMRefs) {
    AppState.selectDirective(directiveId, description);

    // Mettre à jour l'UI pour montrer la sélection
    document.querySelectorAll('.scenario-table tbody tr').forEach(row => row.classList.remove('selected')); // Retire la sélection de toutes les lignes
    const selectedRow = columnElement.querySelector(`tbody tr[data-directive-id="${directiveId}"]`); // Utilise directiveId
    if (selectedRow) {
        selectedRow.classList.add('selected');
    }

    updateLaunchButtonState(DOMRefs);
}

function handleDrawScenario(DOMRefs) {
    const randomScenarioId = Math.random() < 0.5 ? 1 : 2;
    const name = randomScenarioId === 1 ? "Développement Durable" : "Stabilité Géopolitique";
    const data = randomScenarioId === 1 ? scenario1Data : scenario2Data;

    AppState.setScenario(randomScenarioId, name, data);
    AppState.selectDirective(null, ''); // Réinitialiser la directive

    setScenarioSelectionState(randomScenarioId, DOMRefs);
    updateLaunchButtonState(DOMRefs);

    alert(`Scénario ${randomScenarioId} sélectionné au hasard : ${name}`);
}

function handleDrawDirective(DOMRefs) {
    const currentScenarioData = AppState.currentScenarioData;
    if (!currentScenarioData || !currentScenarioData.directive || currentScenarioData.directive.length === 0) {
        alert("Aucune directive disponible pour le scénario actuel.");
        return;
    }

    const directives = currentScenarioData.directive;
    if (directives.length === 0) {
        alert("Aucune directive à tirer.");
        return;
    }

    const randomDirective = directives[Math.floor(Math.random() * directives.length)];
    handleDirectiveSelection(randomDirective.id, randomDirective.nom, DOMRefs.scenarioColumns[AppState.currentScenarioId - 1], DOMRefs);

    alert(`Directive tirée au sort : ${randomDirective.nom}`);
}

function updateLaunchButtonState(DOMRefs) {
    if (!DOMRefs.launchSimulationBtn) return;
    const scenarioId = AppState.currentScenarioId;
    const directiveId = AppState.selectedDirectiveId;
    const enabled = scenarioId !== null && directiveId !== null;

    DOMRefs.launchSimulationBtn.disabled = !enabled;

    if (enabled) {
        DOMRefs.launchSimulationBtn.textContent = `Lancer la simulation (Scénario ${scenarioId} - Directive ${directiveId})`;
    } else {
        DOMRefs.launchSimulationBtn.textContent = 'Lancer la simulation';
    }
}

function setScenarioSelectionState(scenarioToEnableId, DOMRefs) {
    if (!DOMRefs.scenarioColumns) return;

    DOMRefs.scenarioColumns.forEach(col => {
        const scenarioId = parseInt(col.dataset.scenarioId);
        const isEnabled = (scenarioId === scenarioToEnableId);
        col.classList.toggle('selected', isEnabled);
        col.classList.toggle('disabled', !isEnabled && scenarioToEnableId !== null);

        col.querySelectorAll('.select-directive-btn').forEach(btn => btn.disabled = !isEnabled);
    });

    if (DOMRefs.drawDirectiveBtn) {
        DOMRefs.drawDirectiveBtn.disabled = (scenarioToEnableId === null);
    }
}

function updateCarouselView(index, DOMRefs) {
    const totalSlides = DOMRefs.slides.length;
    if (index < 0 || index >= totalSlides) return;

    currentSlide = index;

    if (DOMRefs.carousel && DOMRefs.slides[currentSlide]) {
        DOMRefs.carousel.scrollTo({
            left: DOMRefs.slides[currentSlide].offsetLeft,
            behavior: 'smooth'
        });
    }

    DOMRefs.dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    if (DOMRefs.prevBtn) DOMRefs.prevBtn.disabled = (currentSlide === 0);
    if (DOMRefs.nextBtn) DOMRefs.nextBtn.disabled = (currentSlide === totalSlides - 1);
}