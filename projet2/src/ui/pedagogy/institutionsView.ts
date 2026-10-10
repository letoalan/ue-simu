export function renderInstitutionsView(container: HTMLElement): void {
  container.innerHTML = `
    <div class="main-layout">
      <!-- Le Triangle Institutionnel -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Le Triangle Institutionnel Européen</h2>
        </div>
        <p style="font-size:0.9rem; color:var(--color-text-muted); margin-bottom:16px;">
          L'adoption d'une directive européenne repose sur la coopération et l'accord équilibré entre trois institutions fondamentales :
        </p>

        <!-- Illustration Schéma Triangle Institutionnel -->
        <div style="margin-bottom:20px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--color-border); max-height:280px; background:#f1f5f9; display:flex; justify-content:center; align-items:center;">
          <img
            src="./medias/images/euro/triangle-institutionnel.jpg"
            alt="Schéma du Triangle Institutionnel"
            loading="lazy"
            decoding="async"
            style="width:100%; max-height:280px; object-fit:contain;"
          />
        </div>

        <div class="grid-3">
          <div class="card" style="border-top:4px solid #16a34a; display:flex; flex-direction:column; gap:8px;">
            <div style="border-radius:var(--radius-sm); overflow:hidden; max-height:140px; margin-bottom:4px;">
              <img
                src="./medias/images/euro/eurocomm.jpg"
                alt="Commission Européenne"
                loading="lazy"
                decoding="async"
                style="width:100%; height:140px; object-fit:cover;"
              />
            </div>
            <h3 style="font-size:1.05rem; font-weight:700; color:#166534;">1. La Commission Européenne</h3>
            <p style="font-size:0.82rem; font-weight:600; color:var(--color-text-muted);">Monopole de l'initiative législative</p>
            <p style="font-size:0.85rem; line-height:1.5;">
              Elle rédige et propose les projets de directives. Elle agit dans l'intérêt général de l'Union et veille à l'application des traités.
            </p>
          </div>

          <div class="card" style="border-top:4px solid #2563eb; display:flex; flex-direction:column; gap:8px;">
            <div style="border-radius:var(--radius-sm); overflow:hidden; max-height:140px; margin-bottom:4px;">
              <img
                src="./medias/images/euro/parlement.jpg"
                alt="Parlement Européen"
                loading="lazy"
                decoding="async"
                style="width:100%; height:140px; object-fit:cover;"
              />
            </div>
            <h3 style="font-size:1.05rem; font-weight:700; color:#1e40af;">2. Le Parlement Européen</h3>
            <p style="font-size:0.82rem; font-weight:600; color:var(--color-text-muted);">Voix des 450 millions de citoyens</p>
            <p style="font-size:0.85rem; line-height:1.5;">
              Composé de 720 députés élus au suffrage universel direct tous les 5 ans. Il amende, approuve ou rejette les propositions en codécision avec le Conseil.
            </p>
          </div>

          <div class="card" style="border-top:4px solid #d97706; display:flex; flex-direction:column; gap:8px;">
            <div style="border-radius:var(--radius-sm); overflow:hidden; max-height:140px; margin-bottom:4px;">
              <img
                src="./medias/images/euro/ETATSUE.jpg"
                alt="Conseil de l'Union Européenne"
                loading="lazy"
                decoding="async"
                style="width:100%; height:140px; object-fit:cover;"
              />
            </div>
            <h3 style="font-size:1.05rem; font-weight:700; color:#92400e;">3. Le Conseil de l'Union</h3>
            <p style="font-size:0.82rem; font-weight:600; color:var(--color-text-muted);">Gouvernements des États membres</p>
            <p style="font-size:0.85rem; line-height:1.5;">
              Réunit les ministres des 27 États. Il défend les intérêts nationaux et vote selon la majorité qualifiée (55% des États représentant 65% de la population).
            </p>
          </div>
        </div>
      </div>

      <!-- Le Processus de négociation -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Comment s'élabore un compromis ?</h2>
        </div>
        <div class="grid-2" style="align-items:center;">
          <div style="font-size:0.88rem; line-height:1.6; color:var(--color-text-muted);">
            <p><b>1. Phase préparatoire :</b> La Commission consulte les experts, la société civile et les lobbies industriels avant de publier sa proposition initiale.</p>
            <p style="margin-top:8px;"><b>2. Première lecture :</b> Le Parlement et le Conseil examinent le texte en parallèle et déposent des amendements reflétant leurs sensibilités.</p>
            <p style="margin-top:8px;"><b>3. Trilogue :</b> Négociations informelles entre la Commission, le Parlement et le Conseil pour converger vers un compromis acceptable par tous.</p>
            <p style="margin-top:8px;"><b>4. Vote final :</b> Le texte harmonisé doit être formellement adopté par les deux co-législateurs pour entrer en vigueur.</p>
          </div>
          <div style="border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--color-border);">
            <img
              src="./medias/images/euro/processus-legislatif.jpg"
              alt="Processus législatif européen"
              loading="lazy"
              decoding="async"
              style="width:100%; height:auto; display:block;"
            />
          </div>
        </div>
      </div>

      <!-- La Négociation en Session & la Concertation -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">La Négociation en Session & la Concertation</h2>
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Immersion dans les salles de discussion</span>
        </div>
        <div class="grid-3">
          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/conseilnego.jpg" alt="Négociation au Conseil" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <h3 class="media-card-title">1. Au Conseil : Les Coalitions</h3>
              <p class="media-card-desc">
                Les ministres bâtissent des minorités de blocage ou des compromis pour atteindre le seuil de 65% de la population.
              </p>
            </div>
          </div>

          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/parlnego.jpg" alt="Débats au Parlement" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <h3 class="media-card-title">2. Au Parlement : Les Amendements</h3>
              <p class="media-card-desc">
                Les rapporteurs des commissions parlementaires négocient des amendements de compromis entre groupes politiques.
              </p>
            </div>
          </div>

          <div class="media-card">
            <div class="media-card-thumb-container">
              <img src="./medias/images/euro/lobbiesnego.jpg" alt="Concertation avec les acteurs" class="media-card-thumb" loading="lazy" decoding="async" />
            </div>
            <div class="media-card-body">
              <h3 class="media-card-title">3. Avec les Lobbies : L'Audition</h3>
              <p class="media-card-desc">
                Les parties prenantes transmettent des études d'impact économique et environnemental pour éclairer les décideurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
