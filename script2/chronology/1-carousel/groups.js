import { DOMRefs, euStatesData, politicalPartiesData, lobbyGroupsData } from '../../state/index.js';

export let groups = {};
export let groupedDataForCsv = {
    commission: [],
    states: [],
    parties: [],
    lobbies: []
};
export let dataSource = 'manual';
export let students = [];

export function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                throw new Error("Aucune feuille trouvée");
            }

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            students = processExcelData(jsonData);
            dataSource = 'excel';

            updateStudentCount();
            initializeGroups();
            allocateManualGroups();

        } catch (error) {
            console.error("Erreur traitement Excel:", error);
            handleExcelError();
        }
    };
    reader.readAsArrayBuffer(file);
}

function processExcelData(jsonData) {
    return jsonData.slice(1)
        .filter(row => {
            const col0 = String(row[0] || '').trim();
            const col1 = String(row[1] || '').trim();
            return col0 !== '' || col1 !== '';
        })
        .map((row, index) => ({
            id: index + 1,
            fullName: `${String(row[0] || '').trim()} ${String(row[1] || '').trim()}`.trim(),
            originalExcelName: `${String(row[0] || '').trim()} ${String(row[1] || '').trim()}`.trim()
        }));
}

function updateStudentCount() {
    const numParticipantsInput = document.getElementById('numParticipants');
    if (numParticipantsInput) {
        numParticipantsInput.value = students.length;
    }
}

function initializeGroups() {
    groups = {
        commission: {name: "Commission Européenne", members: []},
        states: euStatesData.slice(0, 6).map(data => ({...data, members: []})),
        parties: politicalPartiesData.slice(0, 6).map(data => ({...data, members: []})),
        lobbies: lobbyGroupsData.slice(0, 6).map(data => ({...data, members: []}))
    };

    groupedDataForCsv = JSON.parse(JSON.stringify(groups));
}

export function allocateManualGroups() {
    const numParticipantsInput = document.getElementById('numParticipants');
    const numParticipants = parseInt(numParticipantsInput?.value || students.length, 10);

    if (isNaN(numParticipants) || numParticipants < 3) {
        alert("Veuillez entrer au moins 3 participants");
        return;
    }

    if (dataSource === 'manual') {
        students = Array.from({length: numParticipants}, (_, i) => ({
            id: i + 1,
            fullName: `Participant ${i + 1}`,
            originalExcelName: ''
        }));
    }

    initializeGroups();
    distributeStudents();
    displayGroups();
    updateDownloadButton();
}

function distributeStudents() {
    let shuffledStudents = shuffleArray([...students]);

    // Distribuer la commission
    const commissionSize = Math.max(1, Math.min(Math.floor(numParticipants * 0.05), shuffledStudents.length));
    for (let i = 0; i < commissionSize; i++) {
        if (shuffledStudents.length > 0) {
            const member = shuffledStudents.shift();
            groups.commission.members.push(member);
            groupedDataForCsv.commission.push(member);
        }
    }

    // Distribuer les autres groupes
    const availableSubGroups = getAllSubGroups();
    shuffleArray(availableSubGroups);

    let subGroupIndex = 0;
    while (shuffledStudents.length > 0) {
        const member = shuffledStudents.shift();
        const targetSubGroup = availableSubGroups[subGroupIndex % availableSubGroups.length];

        targetSubGroup.displayGroup.members.push(member);
        targetSubGroup.csvGroup.members.push(member);

        subGroupIndex++;
    }
}

function getAllSubGroups() {
    const subGroups = [];

    for (let i = 0; i < groups.states.length; i++) {
        subGroups.push({
            displayGroup: groups.states[i],
            csvGroup: groupedDataForCsv.states[i]
        });
    }

    for (let i = 0; i < groups.parties.length; i++) {
        subGroups.push({
            displayGroup: groups.parties[i],
            csvGroup: groupedDataForCsv.parties[i]
        });
    }

    for (let i = 0; i < groups.lobbies.length; i++) {
        subGroups.push({
            displayGroup: groups.lobbies[i],
            csvGroup: groupedDataForCsv.lobbies[i]
        });
    }

    return subGroups;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function displayGroups() {
    // Implémentation de l'affichage des groupes
    const commissionMembersEl = document.getElementById('commissionMembers');
    const statesMembersEl = document.getElementById('statesMembers');
    const partiesMembersEl = document.getElementById('partiesMembers');
    const lobbiesMembersEl = document.getElementById('lobbiesMembers');

    if (!commissionMembersEl || !statesMembersEl || !partiesMembersEl || !lobbiesMembersEl) return;

    // Afficher les membres de chaque groupe
    displayGroupMembers(commissionMembersEl, groups.commission.members);
    displaySubGroups(statesMembersEl, groups.states);
    displaySubGroups(partiesMembersEl, groups.parties);
    displaySubGroups(lobbiesMembersEl, groups.lobbies);
}

function displayGroupMembers(container, members) {
    container.innerHTML = '';
    if (members.length === 0) {
        container.innerHTML = '<li>Aucun membre</li>';
        return;
    }

    members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.fullName;
        container.appendChild(li);
    });
}

function displaySubGroups(container, subGroups) {
    container.innerHTML = '';
    subGroups.forEach(subGroup => {
        const div = document.createElement('div');
        div.className = 'sub-group-card';
        div.innerHTML = `
            <img src="${subGroup.icon}" alt="${subGroup.name}" class="sub-group-icon">
            <h4>${subGroup.name} (${subGroup.members.length} membres)</h4>
            <ul>${subGroup.members.map(m => `<li>${m.fullName}</li>`).join('') || '<li>Aucun membre</li>'}</ul>
        `;
        container.appendChild(div);
    });
}

function updateDownloadButton() {
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    if (downloadCsvBtn) {
        downloadCsvBtn.disabled = students.length === 0;
    }
}

export function prepareAndDownloadGroupsCSV() {
    const hasData = groupedDataForCsv.commission.length > 0 ||
        groupedDataForCsv.states.some(s => s.members.length > 0) ||
        groupedDataForCsv.parties.some(p => p.members.length > 0) ||
        groupedDataForCsv.lobbies.some(l => l.members.length > 0);

    if (!hasData) {
        alert("Aucune donnée à télécharger");
        return;
    }

    let csvContent = 'Groupe Principal,Sous-Groupe,Membre\n';

    // Commission
    groupedDataForCsv.commission.forEach(member => {
        csvContent += `Commission Européenne,Commission,"${member.fullName}"\n`;
    });

    // États
    groupedDataForCsv.states.forEach(state => {
        state.members.forEach(member => {
            csvContent += `États Membres,${state.name},"${member.fullName}"\n`;
        });
    });

    // Partis
    groupedDataForCsv.parties.forEach(party => {
        party.members.forEach(member => {
            csvContent += `Partis Politiques,${party.name},"${member.fullName}"\n`;
        });
    });

    // Lobbies
    groupedDataForCsv.lobbies.forEach(lobby => {
        lobby.members.forEach(member => {
            csvContent += `Lobbies,${lobby.name},"${member.fullName}"\n`;
        });
    });

    downloadCSV(csvContent, "groupes_simulation.csv");
}

function downloadCSV(data, filename) {
    const blob = new Blob([data], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}