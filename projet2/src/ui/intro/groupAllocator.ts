import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';

export interface AllocatedStudent {
  id: string;
  fullName: string;
  category: 'commission' | 'states' | 'parties' | 'lobbies';
  roleId: string;
  roleName: string;
}

export interface GroupDetails {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  members: AllocatedStudent[];
}

export interface AllocationResult {
  commission: GroupDetails;
  states: GroupDetails[];
  parties: GroupDetails[];
  lobbies: GroupDetails[];
}

export function allocateStudents(studentNames: string[]): AllocationResult {
  const shuffled = [...studentNames].sort(() => Math.random() - 0.5);

  const commissionGroup: GroupDetails = {
    id: 'commission',
    name: 'Commission Européenne',
    color: '#16a34a',
    icon: './medias/images/euro/eurocomm.jpg',
    members: []
  };

  const statesGroups: GroupDetails[] = Object.values(COUNTRIES_META).map(c => ({
    id: c.code,
    name: c.name,
    color: '#d97706',
    icon: c.flagUrl,
    members: []
  }));

  const partiesGroups: GroupDetails[] = Object.values(PARTIES_PROFILES).map(p => ({
    id: p.code,
    name: `${p.code} (${p.nom.split('(')[0].trim()})`,
    color: p.couleur,
    icon: p.logoUrl,
    members: []
  }));

  const lobbiesGroups: GroupDetails[] = Object.values(LOBBIES_PROFILES).map(l => ({
    id: l.code,
    name: l.nom,
    color: l.couleur,
    icon: l.logoUrl,
    members: []
  }));

  const allTargetGroups: { group: GroupDetails; cat: 'commission' | 'states' | 'parties' | 'lobbies' }[] = [
    { group: commissionGroup, cat: 'commission' },
    ...statesGroups.map(g => ({ group: g, cat: 'states' as const })),
    ...partiesGroups.map(g => ({ group: g, cat: 'parties' as const })),
    ...lobbiesGroups.map(g => ({ group: g, cat: 'lobbies' as const }))
  ];

  let targetIndex = 0;
  shuffled.forEach((name, idx) => {
    const target = allTargetGroups[targetIndex % allTargetGroups.length];
    target.group.members.push({
      id: `student-${idx + 1}`,
      fullName: name,
      category: target.cat,
      roleId: target.group.id,
      roleName: target.group.name
    });
    targetIndex++;
  });

  return {
    commission: commissionGroup,
    states: statesGroups,
    parties: partiesGroups,
    lobbies: lobbiesGroups
  };
}

export function exportGroupsToCSV(allocation: AllocationResult, filename: string = 'repartition-groupes-ue-simu.csv'): void {
  const allGroups = [
    allocation.commission,
    ...allocation.states,
    ...allocation.parties,
    ...allocation.lobbies
  ];

  let csvContent = 'data:text/csv;charset=utf-8,ID,Nom Eleve,Categorie,Role,Identifiant Role\n';

  allGroups.forEach(grp => {
    grp.members.forEach(m => {
      const row = `"${m.id}","${m.fullName}","${m.category}","${m.roleName}","${m.roleId}"`;
      csvContent += row + '\n';
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
