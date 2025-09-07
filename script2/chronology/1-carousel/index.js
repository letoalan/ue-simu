/* ===========================================================
   chronology/1-carousel/index.js
   Montage de l’écran 1 : landing, groupes, sélection scénario & directive
   =========================================================== */

import { state } from '../../state/index.js';
import { populateDirectivesTable } from './directives-table.js';
import { handleFile, allocateManualGroups } from './groups.js';

/* -----------------------------------------------------------
   1.  Références DOM (lazy, après injection du HTML)
----------------------------------------------------------- */
function getRefs() {
    return {
        carousel:      document.getElementById('carouselContainer'),
        slides:        document.querySelectorAll('.carousel-slide'),
        dots:          document.querySelectorAll('.carousel-dot'),
        prevBtn:       document.querySelector('.carousel-btn.prev'),
        nextBtn:       document.querySelector('.carousel-btn.next'),
        scenario1Tbody:document.querySelector('#scenario1Table tbody'),
        scenario2Tbody:document.querySelector('#scenario2Table tbody'),
        selectBtns:    document.querySelectorAll('.select-scenario-btn'),
        drawScenario:  document.getElementById('drawScenarioBtn'),
        drawDirective: document.getElementById('drawDirectiveBtn'),
        launchBtn:     document.getElementById('launchSimulationBtn'),
        numInput:      document.getElementById('numParticipants'),
        generateBtn:   document.getElementById('generateGroupsBtn'),
        downloadBtn:   document.getElementById('downloadCsvBtn'),
        excelInput:    document.getElementById('excelFile')
    };
}

/* -----------------------------------------------------------
   2.  Navigation du carrousel
----------------------------------------------------------- */
function updateCarousel(index, { slides, dots, prevBtn, nextBtn }) {
    const total = slides.length;
    index = Math.max(0, Math.min(index, total - 1));
    slides.forEach((s, i) => s.style.display = i === index ? 'block' : 'none');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
}

/* -----------------------------------------------------------
   3.  Gestion scénario / directive
----------------------------------------------------------- */
function setScenarioSelectionState(scenarioId) {
    const { selectBtns, drawDirective, launchBtn } = getRefs();
    state.set.scenario(scenarioId);
    state.set.scenarioName(scenarioId === 1 ? 'Développement Durable' : 'Stabilité Géopolitique');
    state.set.directiveId(null);
    selectBtns.forEach(b => b.classList.toggle('active', +b.dataset.scenarioId === scenarioId));
    drawDirective.disabled = false;
    launchBtn.disabled = true;
}

function handleDirectiveSelection(scenarioId, directiveId, description) {
    state.set.directiveId(directiveId);
    state.set.directiveDesc(description);
    getRefs().launchBtn.disabled = false;
}

/* -----------------------------------------------------------
   4.  Initialisation unique
----------------------------------------------------------- */
export async function mountCarousel() {
    /* 4.1  Injection HTML déjà faite par loadComponent */
    const refs = getRefs();

    /* 4.2  Remplissage des tables directives */
    await Promise.all([
        fetch('/json/scenario1.json').then(r => r.json()).then(d => populateDirectivesTable(refs.scenario1Tbody, d)),
        fetch('/json/scenario2.json').then(r => r.json()).then(d => populateDirectivesTable(refs.scenario2Tbody, d))
    ]);

    /* 4.3  Carrousel navigation */
    let currentSlide = 0;
    const elements   = { slides: refs.slides, dots: refs.dots, prevBtn: refs.prevBtn, nextBtn: refs.nextBtn };
    updateCarousel(currentSlide, elements);

    refs.prevBtn.addEventListener('click', () => updateCarousel(--currentSlide, elements));
    refs.nextBtn.addEventListener('click', () => updateCarousel(++currentSlide, elements));
    refs.dots.forEach((dot, idx) => dot.addEventListener('click', () => updateCarousel(idx, elements)));

    /* 4.4  Choix scénario / directive */
    refs.selectBtns.forEach(btn =>
        btn.addEventListener('click', () => setScenarioSelectionState(+btn.dataset.scenarioId))
    );
    refs.drawScenario.addEventListener('click', () => {
        const rnd = Math.random() < 0.5 ? 1 : 2;
        setScenarioSelectionState(rnd);
        alert(`Scénario ${rnd} tiré : ${state.get.scenarioName()}`);
    });

    refs.drawDirective.addEventListener('click', () => {
        const scenario = state.get.scenario();
        const table   = scenario === 1 ? refs.scenario1Tbody : refs.scenario2Tbody;
        const rows    = Array.from(table.querySelectorAll('tr'));
        if (!rows.length) return;
        const row     = rows[Math.floor(Math.random() * rows.length)];
        handleDirectiveSelection(scenario, row.dataset.directiveId, row.dataset.directiveDescription);
        alert(`Directive tirée : ${row.dataset.directiveDescription}`);
    });

    /* 4.5  Groupes élèves */
    refs.excelInput.addEventListener('change', handleFile);
    refs.numInput.addEventListener('input', () => refs.generateBtn.disabled = false);
    refs.generateBtn.addEventListener('click', allocateManualGroups);
    refs.downloadBtn.addEventListener('click', () => import('./groups.js').then(m => m.prepareAndDownloadGroupsCSV()));

    /* 4.6  Affichage initial */
    refs.carousel.style.display = 'flex';
}