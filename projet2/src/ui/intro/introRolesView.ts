import { COUNTRIES_META } from '../../data/countries';
import { PARTIES_PROFILES } from '../../data/parties';
import { LOBBIES_PROFILES } from '../../data/lobbies';

export interface RoleCardItem {
  key: string;
  category: 'commission' | 'states' | 'parties' | 'lobbies';
  categoryLabel: string;
  name: string;
  icon?: string;
  badgeColor: string;
  description: string;
  tag: string;
}

export function getFilteredRoles(filter: string): RoleCardItem[] {
  const roles: RoleCardItem[] = [];

  if (filter === 'all' || filter === 'commission') {
    roles.push({
      key: 'commission',
      category: 'commission',
      categoryLabel: 'Commission',
      name: 'Commission européenne',
      icon: './medias/images/euro/eurocomm.jpg',
      badgeColor: '#16a34a',
      description: 'Monopole de proposition et gardienne des traités. Recherche le consensus et la cohérence de l’UE.',
      tag: 'Berlaymont • Arbitre'
    });
  }

  if (filter === 'all' || filter === 'states') {
    Object.values(COUNTRIES_META).forEach(c => {
      roles.push({
        key: c.code,
        category: 'states',
        categoryLabel: 'Conseil',
        name: c.name,
        icon: c.flagUrl,
        badgeColor: '#d97706',
        description: `Défend les intérêts de sa population (${c.population}M hab.) et la compétitivité de son économie nationale.`,
        tag: `Pop. : ${c.population}M hab.`
      });
    });
  }

  if (filter === 'all' || filter === 'parties') {
    Object.values(PARTIES_PROFILES).forEach(p => {
      roles.push({
        key: p.code,
        category: 'parties',
        categoryLabel: 'Parlement',
        name: `${p.code} (${p.nom})`,
        icon: p.logoUrl,
        badgeColor: p.couleur,
        description: 'Sensibilité politique transnationale. Porte les revendications citoyennes et idéologiques dans l’hémicycle.',
        tag: `${p.base.meps} Sièges au Parlement`
      });
    });
  }

  if (filter === 'all' || filter === 'lobbies') {
    Object.values(LOBBIES_PROFILES).forEach(l => {
      roles.push({
        key: l.code,
        category: 'lobbies',
        categoryLabel: 'Société Civile',
        name: l.nom,
        icon: l.logoUrl,
        badgeColor: l.couleur,
        description: 'Expertise sectorielle pointue. Propose des amendements techniques pour sécuriser son secteur.',
        tag: `Influence : ${l.base.infCommission}%`
      });
    });
  }

  return roles;
}

export function renderRolesSubTab(rolesCategoryFilter: string): string {
  const filteredRoles = getFilteredRoles(rolesCategoryFilter);

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <div class="card" style="padding:20px;">
        <div style="margin-bottom:16px;">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--color-primary); margin-bottom:4px;">
            Annuaire des 19 Acteurs de la Négociation
          </h2>
          <p style="font-size:0.88rem; color:var(--color-text-muted);">
            Consultez les mandats, priorités et lignes rouges de chaque rôle. Cliquez sur « Voir la fiche » pour ouvrir la vue détaillée.
          </p>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; border-bottom:1px solid var(--color-border); padding-bottom:12px;">
          <button class="btn btn-sm ${rolesCategoryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" data-role-filter="all">Tous les rôles (19)</button>
          <button class="btn btn-sm ${rolesCategoryFilter === 'commission' ? 'btn-primary' : 'btn-secondary'}" data-role-filter="commission">🏛️ Commission (1)</button>
          <button class="btn btn-sm ${rolesCategoryFilter === 'states' ? 'btn-primary' : 'btn-secondary'}" data-role-filter="states">🌍 États Membres (6)</button>
          <button class="btn btn-sm ${rolesCategoryFilter === 'parties' ? 'btn-primary' : 'btn-secondary'}" data-role-filter="parties">🇪🇺 Parlement (6)</button>
          <button class="btn btn-sm ${rolesCategoryFilter === 'lobbies' ? 'btn-primary' : 'btn-secondary'}" data-role-filter="lobbies">💼 Lobbies & Société Civile (6)</button>
        </div>

        <div class="grid-3">
          ${filteredRoles.map(role => `
            <div class="role-card" style="border-top:3px solid ${role.badgeColor};">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  ${role.icon ? `<img src="${role.icon}" alt="${role.name}" style="width:26px; height:20px; object-fit:contain; border-radius:3px;" />` : ''}
                  <strong style="font-size:0.95rem; color:var(--color-text-main);">${role.name}</strong>
                </div>
                <span class="badge" style="background:${role.badgeColor}20; color:${role.badgeColor}; border:1px solid ${role.badgeColor}40; font-size:0.72rem;">
                  ${role.categoryLabel}
                </span>
              </div>
              <p style="font-size:0.82rem; color:var(--color-text-muted); line-height:1.45; flex:1;">${role.description}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:6px;">
                <span style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted);">${role.tag}</span>
                <button class="btn btn-secondary btn-sm btn-open-actor-sheet" data-actor-cat="${role.category}" data-actor-key="${role.key}" style="font-size:0.78rem; padding:4px 10px;">
                  Voir la fiche 📑
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-secondary" id="btnBackToGroups">← Retour à l'attribution des groupes</button>
        <button class="btn btn-primary" id="btnLaunchFromRoles">Lancer la négociation sur la directive active 📜 →</button>
      </div>
    </div>
  `;
}
