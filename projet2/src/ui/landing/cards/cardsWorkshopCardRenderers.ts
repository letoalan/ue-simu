import type { ActorCardDefinition } from './cardsTypes';

export function renderCardRectoHtml(card: ActorCardDefinition): string {
  return `
    <article class="ue-card ${card.type} ${card.isReplacement ? 'replacement' : ''}">
      <header class="ue-card-header">
        <span>${card.typeLabel}</span>
        <span class="card-id-badge">${card.id}${card.isReplacement ? ' · REP' : ''}</span>
      </header>
      <div class="ue-card-identity">
        <img src="${card.image}" alt="${card.actorName}" class="ue-card-logo" />
        <strong>${card.actorName}</strong>
      </div>
      <section class="ue-card-body">
        <p class="ue-field-label">Destinataire autorisé</p>
        <p class="ue-field-value">${card.authorizedRecipient}</p>
        
        <p class="ue-field-label">Receveur de la carte</p>
        <div class="ue-field-line"></div>
        <p class="ue-field-desc">${card.transferRule}</p>

        <div class="ue-score-box">
          ${card.scoreText}<br>
          <span class="ue-score-sub">${card.scoreSubtext}</span>
        </div>

        <small class="ue-card-notice">
          Une seule utilisation · pas d'auto-attribution<br>
          La carte reçue ne peut pas être redistribuée.
        </small>
      </section>
    </article>
  `;
}

export function renderCardVersoHtml(card: ActorCardDefinition): string {
  const isNeg = card.type === 'neg';
  return `
    <article class="ue-card ${card.type} verso ${card.isReplacement ? 'replacement' : ''}">
      <header class="ue-card-header">
        <span>${card.typeLabel}</span>
        <span class="card-id-badge">${card.id}${card.isReplacement ? ' · RÉIMPRESSION' : ''}</span>
      </header>
      <div class="ue-card-identity">
        <img src="${card.image}" alt="${card.actorName}" class="ue-card-logo" />
        <strong>${card.actorName}</strong>
      </div>
      <section class="ue-card-body">
        <p class="ue-field-label">Directive / Phase</p>
        <div class="ue-field-line"></div>

        <p class="ue-field-label">Receveur</p>
        <div class="ue-field-line"></div>

        <p class="ue-field-label">${isNeg ? 'Action promise par le receveur' : 'Objet de l’échange'}</p>
        <div class="ue-field-line"></div>
        <div class="ue-field-line"></div>

        <p class="ue-field-label">${isNeg ? 'Condition / Échéance' : 'Information, expertise ou soutien'}</p>
        <div class="ue-field-line"></div>

        <p class="ue-field-label">Accord des deux groupes</p>
        <div class="ue-field-line"></div>

        ${isNeg ? `
          <div class="ue-status-box">
            <span class="status-item">□ Non dénoncée</span> &nbsp; <span class="status-item">□ En examen</span><br>
            <span class="status-item">□ Dénoncée</span> &nbsp; <span class="status-item">□ Sans objet*</span>
          </div>
          <small class="ue-card-notice">* Selon règle annoncée. −20 remplace +10.</small>
        ` : `
          <div class="ue-status-box">
            <span class="status-item">□ Transfert vérifié · +5 au receveur</span>
          </div>
        `}

        <p class="ue-field-label">Référence du registre</p>
        <div class="ue-field-line"></div>
      </section>
    </article>
  `;
}
