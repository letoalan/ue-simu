import { scenario1Data, scenario2Data, DOMRefs } from '../../state/index.js';

export function populateDirectivesTable() {
    console.log("Remplissage des tables de directives");

    DOMRefs.scenario1TableBody = document.querySelector('#scenario1Table tbody');
    DOMRefs.scenario2TableBody = document.querySelector('#scenario2Table tbody');

    // Charger les données JSON
    loadScenarioData().then(() => {
        populateTable(DOMRefs.scenario1TableBody, scenario1Data);
        populateTable(DOMRefs.scenario2TableBody, scenario2Data);
    });
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

function populateTable(tableBody, scenarioData) {
    if (!scenarioData?.directive) return;

    const activeDirective = scenarioData.directive.find(d => d.id === 1);
    if (!activeDirective?.amendements) return;

    const directivesToShow = activeDirective.amendements.filter(
        a => a.type === 'parlement' || a.type === 'conseil'
    );

    tableBody.innerHTML = '';

    directivesToShow.forEach(amendement => {
        const row = tableBody.insertRow();
        row.dataset.directiveId = amendement.id;
        row.dataset.directiveDescription = amendement.description;
        row.dataset.directiveType = amendement.type;

        const nameCell = row.insertCell(0);
        nameCell.textContent = amendement.description.length > 60
            ? amendement.description.substring(0, 57) + '...'
            : amendement.description;

        const typeCell = row.insertCell(1);
        typeCell.textContent = amendement.type === 'parlement' ? 'Parlement' : 'Conseil';

        const selectCell = row.insertCell(2);
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Choisir';
        selectBtn.className = 'select-directive-btn';
        selectCell.appendChild(selectBtn);

        selectBtn.addEventListener('click', e => {
            e.stopPropagation();
            handleDirectiveSelection(amendement.id, amendement.description);
        });
    });
}

function handleDirectiveSelection(directiveId, description) {
    window.selectedDirectiveId = directiveId;
    window.selectedDirectiveDescription = description;
    updateLaunchButtonState();
}