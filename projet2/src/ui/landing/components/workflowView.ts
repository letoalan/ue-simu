export function renderWorkflowViewHtml(): string {
  return `
    <section class="workflow-section" id="workflowSection">
      <div class="workflow-header-group">
        <span class="workflow-badge">🔄 Mécanique du jeu</span>
        <h2 class="workflow-title">Je Comprends le Déroulement</h2>
        <p class="workflow-subtitle">
          De la première étincelle du débat jusqu'à la simulation des conséquences sur 10 ans : le cycle de décision européenne en 3 temps forts.
        </p>
      </div>

      <div class="workflow-steps-container">
        <!-- Étape 1 -->
        <div class="workflow-card">
          <div class="workflow-card-top">
            <span class="workflow-step-badge">Phase A</span>
            <span class="workflow-step-icon">📜</span>
          </div>
          <h3 class="workflow-step-name">1. Négocier le texte</h3>
          <p class="workflow-step-summary">
            Directive, amendements et engagements réciproques.
          </p>
          <ul class="workflow-details-list">
            <li><strong>Initiative :</strong> La Commission européenne propose une directive cadre.</li>
            <li><strong>Débat parlementaire & Conseil :</strong> Jusqu'à 8 amendements déposés et âprement négociés.</li>
            <li><strong>Scellement d'alliances :</strong> Échangez vos cartes de négociation (+10/-20) et d'influence (+5) pour sécuriser des promesses de vote.</li>
            <li><strong>Double majorité requise :</strong> Conseil (55% des États + 65% de la pop) et Parlement (361 voix / 720).</li>
          </ul>
          <div class="workflow-step-footer">
            <span class="step-tag">Vote de codécision</span>
          </div>
        </div>

        <!-- Flèche connecteur -->
        <div class="workflow-arrow" aria-hidden="true">➔</div>

        <!-- Étape 2 -->
        <div class="workflow-card">
          <div class="workflow-card-top">
            <span class="workflow-step-badge">Phase B</span>
            <span class="workflow-step-icon">💶</span>
          </div>
          <h3 class="workflow-step-name">2. Négocier les moyens</h3>
          <p class="workflow-step-summary">
            Enveloppe budgétaire, contributions et redistribution.
          </p>
          <ul class="workflow-details-list">
            <li><strong>Déverrouillage :</strong> Accessible dès que le compromis politique du texte est validé et adopté.</li>
            <li><strong>Paramètres clés :</strong> Fixation de l'enveloppe globale et de la réserve de précaution.</li>
            <li><strong>Clé de contribution :</strong> Qui finance l'effort (PIB, population ou parts égales) ?</li>
            <li><strong>Clé d'allocation :</strong> Qui reçoit le soutien (besoins sectoriels ou convergence) ?</li>
          </ul>
          <div class="workflow-step-footer warning-footer">
            <span>ℹ️ Calcul algorithmique vs votes humains</span>
          </div>
        </div>

        <!-- Flèche connecteur -->
        <div class="workflow-arrow" aria-hidden="true">➔</div>

        <!-- Étape 3 -->
        <div class="workflow-card">
          <div class="workflow-card-top">
            <span class="workflow-step-badge">Simulation</span>
            <span class="workflow-step-icon">📊</span>
          </div>
          <h3 class="workflow-step-name">3. Comprendre les conséquences</h3>
          <p class="workflow-step-summary">
            Réalisation systémique, indicateurs macro et grand débriefing.
          </p>
          <ul class="workflow-details-list">
            <li><strong>Projection sur 10 ans :</strong> Modélisation dynamique 2025–2034 comparée à la trajectoire de référence.</li>
            <li><strong>4 piliers d'impact :</strong> PIB européen, Émissions de CO₂, Inégalités (Gini) et Bien-être (VEB).</li>
            <li><strong>Équilibre politique :</strong> Évolution de la satisfaction des pays et des équilibres parlementaires.</li>
            <li><strong>Dénouement des cartes :</strong> Vérification des engagements, arbitrage des dénonciations et bilan.</li>
          </ul>
          <div class="workflow-step-footer">
            <span class="step-tag">Débriefing & Enseignements</span>
          </div>
        </div>
      </div>

      <!-- Encart méthodologique sur la finance -->
      <div class="workflow-methodology-box">
        <div class="methodology-icon">💡</div>
        <div class="methodology-content">
          <h4>Précision essentielle sur le vote financier pour les protagonistes :</h4>
          <p>
            Le bouton <em>« Mettre aux Voix l'Accord Financier »</em> dans le simulateur évalue automatiquement un <strong>soutien théorique algorithmique</strong> des États (selon leur solde net et leur taux de couverture) et du Parlement (selon l'enveloppe et la solidarité).
          </p>
          <p>
            Ce calcul fournit une estimation objective de viabilité financière. <strong>Vos engagements humains scellés par des cartes de négociation sont jugés par l'animateur et la classe</strong>, indépendamment de ce moteur prévisionnel.
          </p>
        </div>
      </div>
    </section>
  `;
}
