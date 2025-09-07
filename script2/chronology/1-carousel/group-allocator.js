import { euStatesData, politicalPartiesData, lobbyGroupsData } from '../../state/index.js';

// --- État local du module ---
let students = [];
let groups = {};
let groupedDataForCsv = {};
let dataSource = 'manual';

/**
 * Point d'entrée du module : attache les écouteurs d'événements aux boutons de la slide 3.
 * @param {object} DOMRefs - Les références DOM collectées globalement.
 */
export function init(DOMRefs) {
    console.log("Initialisation du module d'allocation de groupes.");
    if (DOMRefs.excelFile) {
        DOMRefs.excelFile.addEventListener('change', (event) => handleFile(event, DOMRefs));
    }
    if (DOMRefs.generateGroupsBtn) {
        DOMRefs.generateGroupsBtn.addEventListener('click', () => allocateManualGroups(DOMRefs));
    }
    if (DOMRefs.downloadCsvBtn) {
        DOMRefs.downloadCsvBtn.addEventListener('click', prepareAndDownloadGroupsCSV);
        DOMRefs.downloadCsvBtn.disabled = true; // État initial
    }
}

// --- Fonctions de logique (non exportées) ---

function handleFile(event, DOMRefs) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            students = jsonData.slice(1) // Ignorer l'en-tête
                .map((row, index) => ({
                    id: index + 1,
                    fullName: `${row[0] || ''} ${row[1] || ''}`.trim()
                }))
                .filter(s => s.fullName !== '');

            dataSource = 'excel';
            if (DOMRefs.numParticipants) {
                DOMRefs.numParticipants.value = students.length;
            }

            // C'est ici que la magie opère : on lance l'allocation automatiquement.
            if (students.length > 0) {
                allocateManualGroups(DOMRefs);
            } else {
                alert("Le fichier Excel semble vide ou mal formaté.");
                displayGroups(DOMRefs); // Affiche les groupes vides
            }

        } catch (error) {
            console.error("Erreur lors du traitement du fichier Excel:", error);
            alert("Erreur lors de la lecture du fichier. Assurez-vous qu'il s'agit d'un fichier Excel valide.");
        }
    };
    reader.readAsArrayBuffer(file);
}

function allocateManualGroups(DOMRefs) {
    const numParticipants = parseInt(DOMRefs.numParticipants.value, 10);

    if (dataSource === 'manual') {
        if (isNaN(numParticipants) || numParticipants < 3) {
            alert("Veuillez entrer un nombre valide de participants (au moins 3).");
            return;
        }
        students = Array.from({ length: numParticipants }, (_, i) => ({
            id: i + 1,
            fullName: `Participant ${i + 1}`
        }));
    }

    if (!students || students.length === 0) {
        alert("Aucun participant à répartir.");
        return;
    }

    // Réinitialiser les groupes
    groups = {
        commission: { name: "Commission Européenne", members: [] },
        states: euStatesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        parties: politicalPartiesData.slice(0, 6).map(data => ({ ...data, members: [] })),
        lobbies: lobbyGroupsData.slice(0, 6).map(data => ({ ...data, members: [] }))
    };

    let shuffledStudents = shuffleArray([...students]);

    // Allouer à la commission
    const commissionSize = Math.max(1, Math.floor(shuffledStudents.length * 0.05));
    groups.commission.members = shuffledStudents.splice(0, commissionSize);

    // Allouer aux autres sous-groupes
    let availableSubGroups = [...groups.states, ...groups.parties, ...groups.lobbies];
    if (availableSubGroups.length === 0) return;

    let subGroupIndex = 0;
    while (shuffledStudents.length > 0) {
        const member = shuffledStudents.shift();
        availableSubGroups[subGroupIndex % availableSubGroups.length].members.push(member);
        subGroupIndex++;
    }

    displayGroups(DOMRefs);
    if (DOMRefs.downloadCsvBtn) {
        DOMRefs.downloadCsvBtn.disabled = false;
    }
}

function displayGroups(DOMRefs) {
    const { commissionMembers, statesMembers, partiesMembers, lobbiesMembers } = DOMRefs;
    if (!commissionMembers || !statesMembers || !partiesMembers || !lobbiesMembers) {
        console.error("Conteneurs d'affichage des groupes manquants.");
        return;
    }

    // Vider les conteneurs
    [commissionMembers, statesMembers, partiesMembers, lobbiesMembers].forEach(el => el.innerHTML = '');

    // Afficher la commission
    groups.commission.members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.fullName;
        commissionMembers.appendChild(li);
    });

    // Afficher les autres groupes
    const displaySubGroup = (groupArray, container) => {
        groupArray.forEach(group => {
            const div = document.createElement('div');
            div.className = 'sub-group-card';
            const memberList = group.members.length > 0
                ? `<ul>${group.members.map(m => `<li>${m.fullName}</li>`).join('')}</ul>`
                : `<ul><li>Aucun membre</li></ul>`;
            div.innerHTML = `
                <img src="${group.icon}" alt="${group.name} Icon" class="sub-group-icon">
                <h4>${group.name} (${group.members.length} membres)</h4>
                ${memberList}
            `;
            container.appendChild(div);
        });
    };

    displaySubGroup(groups.states, statesMembers);
    displaySubGroup(groups.parties, partiesMembers);
    displaySubGroup(groups.lobbies, lobbiesMembers);
}

function prepareAndDownloadGroupsCSV() {
    // Préparer les données pour le CSV
    groupedDataForCsv = {
        commission: groups.commission.members,
        states: groups.states,
        parties: groups.parties,
        lobbies: groups.lobbies
    };

    let csvString = 'Groupe Principal,Sous-Groupe,Membre\n';
    groupedDataForCsv.commission.forEach(m => { csvString += `Commission Européenne,Commission,"${m.fullName}"\n`; });
    groupedDataForCsv.states.forEach(g => g.members.forEach(m => { csvString += `États Membres,${g.name},"${m.fullName}"\n`; }));
    groupedDataForCsv.parties.forEach(g => g.members.forEach(m => { csvString += `Partis Politiques,${g.name},"${m.fullName}"\n`; }));
    groupedDataForCsv.lobbies.forEach(g => g.members.forEach(m => { csvString += `Lobbies,${g.name},"${m.fullName}"\n`; }));

    downloadCSV(csvString, "groupes_simulation.csv");
}

// --- Fonctions utilitaires ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}