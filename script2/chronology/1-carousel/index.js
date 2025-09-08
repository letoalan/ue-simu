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

// SOLUTION CORRIGÉE pour loadScenarioData()

async function loadScenarioData() {
    try {
        // Fonction pour détecter l'environnement et construire le bon chemin
        function getBasePath() {
            const pathname = window.location.pathname;
            const hostname = window.location.hostname;

            console.log('Pathname:', pathname);
            console.log('Hostname:', hostname);

            // Si on est sur GitHub Pages
            if (hostname.includes('github.io')) {
                // Pour GitHub Pages, le format est généralement /nom-du-repo/
                if (pathname.includes('/ue-simu/')) {
                    return '/ue-simu';
                } else if (pathname !== '/') {
                    // Extraire le nom du repo du pathname
                    const pathParts = pathname.split('/').filter(part => part !== '');
                    return pathParts.length > 0 ? `/${pathParts[0]}` : '';
                }
                return '';
            }

            // Si on est en local (WebStorm, Live Server, etc.)
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168')) {
                // En local, utiliser un chemin relatif
                return '.';
            }

            // Cas par défaut
            return '.';
        }

        const basePath = getBasePath();
        console.log('Base path calculé:', basePath);

        // Construire les URLs complètes
        const scenario1Url = `${basePath}/json/scenario1.json`;
        const scenario2Url = `${basePath}/json/scenario2.json`;

        console.log('URLs de chargement:');
        console.log('- Scénario 1:', scenario1Url);
        console.log('- Scénario 2:', scenario2Url);

        // Fonction helper pour fetch avec diagnostic
        async function fetchWithDiagnostic(url, name) {
            console.log(`🔄 Tentative de chargement de ${name}...`);

            const response = await fetch(url);
            console.log(`📡 ${name} - Statut: ${response.status} ${response.statusText}`);
            console.log(`📡 ${name} - Content-Type: ${response.headers.get('content-type')}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} pour ${url}`);
            }

            const text = await response.text();
            console.log(`📄 ${name} - Contenu reçu (${text.length} caractères)`);
            console.log(`📄 ${name} - Début du contenu:`, text.substring(0, 100));

            // Vérifier que c'est bien du JSON
            if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
                console.error(`❌ ${name} - Le contenu ne semble pas être du JSON valide`);
                console.error('Contenu complet:', text);
                throw new Error(`Le fichier ${url} ne contient pas du JSON valide`);
            }

            try {
                const data = JSON.parse(text);
                console.log(`✅ ${name} - JSON parsé avec succès`);
                return data;
            } catch (parseError) {
                console.error(`❌ ${name} - Erreur de parsing JSON:`, parseError);
                console.error('Contenu problématique:', text);
                throw parseError;
            }
        }

        // Charger les deux fichiers avec diagnostic
        const [data1, data2] = await Promise.all([
            fetchWithDiagnostic(scenario1Url, 'Scénario 1'),
            fetchWithDiagnostic(scenario2Url, 'Scénario 2')
        ]);

        console.log("✅ Données chargées avec succès:");
        console.log("- Scénario 1:", data1);
        console.log("- Scénario 2:", data2);

        scenario1Data = data1;
        scenario2Data = data2;

    } catch (error) {
        console.error('❌ Erreur chargement JSON:', error);

        // Essayer des chemins alternatifs
        await tryAlternativePaths();
    }
}

// Fonction pour essayer des chemins alternatifs en cas d'échec
async function tryAlternativePaths() {
    console.log('🔄 Tentative de chemins alternatifs...');

    const alternativePaths = [
        // Chemins relatifs possibles
        { scenario1: './json/scenario1.json', scenario2: './json/scenario2.json' },
        { scenario1: '../json/scenario1.json', scenario2: '../json/scenario2.json' },
        { scenario1: '/json/scenario1.json', scenario2: '/json/scenario2.json' },
        { scenario1: './data/scenario1.json', scenario2: './data/scenario2.json' },
        { scenario1: '/data/scenario1.json', scenario2: '/data/scenario2.json' },
        // Chemin GitHub Pages spécifique
        { scenario1: '/ue-simu/json/scenario1.json', scenario2: '/ue-simu/json/scenario2.json' },
        { scenario1: '/ue-simu/data/scenario1.json', scenario2: '/ue-simu/data/scenario2.json' }
    ];

    for (let i = 0; i < alternativePaths.length; i++) {
        const paths = alternativePaths[i];
        console.log(`🔄 Essai ${i + 1}/${alternativePaths.length}:`, paths);

        try {
            const [data1, data2] = await Promise.all([
                fetch(paths.scenario1).then(async r => {
                    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`);
                    return r.json();
                }),
                fetch(paths.scenario2).then(async r => {
                    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`);
                    return r.json();
                })
            ]);

            console.log(`✅ Succès avec les chemins alternatifs ${i + 1}:`, paths);
            scenario1Data = data1;
            scenario2Data = data2;
            return; // Sortir de la fonction si succès

        } catch (error) {
            console.log(`❌ Échec avec les chemins ${i + 1}:`, error.message);
        }
    }

    // Si tous les chemins ont échoué, utiliser des données de fallback
    console.warn('⚠️ Tous les chemins ont échoué, utilisation de données de fallback');
    useFailsafeData();
}

// Données de secours en cas d'échec complet
function useFailsafeData() {
    scenario1Data = {
        id: 1,
        nom: "Développement Durable (Fallback)",
        directive: [
            {
                id: "fallback-1",
                nom: "Directive de test - Développement Durable",
                description: "Données de secours pour les tests"
            }
        ]
    };

    scenario2Data = {
        id: 2,
        nom: "Stabilité Géopolitique (Fallback)",
        directive: [
            {
                id: "fallback-2",
                nom: "Directive de test - Géopolitique",
                description: "Données de secours pour les tests"
            }
        ]
    };

    console.log('📋 Données de fallback chargées');
}

// VERSION SIMPLIFIÉE ALTERNATIVE (si la version complexe pose problème)
async function loadScenarioDataSimple() {
    const paths = [
        // Essayer d'abord les chemins les plus probables
        './json/',
        '../json/',
        '/json/',
        '/ue-simu/json/',
        './data/',
        '/data/',
        '/ue-simu/data/'
    ];

    for (const basePath of paths) {
        try {
            console.log(`🔄 Essai du chemin de base: ${basePath}`);

            const [data1, data2] = await Promise.all([
                fetch(`${basePath}scenario1.json`).then(r => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))),
                fetch(`${basePath}scenario2.json`).then(r => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))
            ]);

            console.log(`✅ Succès avec le chemin: ${basePath}`);
            scenario1Data = data1;
            scenario2Data = data2;
            return;

        } catch (error) {
            console.log(`❌ Échec avec ${basePath}:`, error.message);
        }
    }

    // Fallback
    useFailsafeData();
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