/**
 * Générateur de schémas explicatifs vectoriels (SVG) pour la transparence pédagogique.
 */

export function renderScenario1Schema(): string {
  return `
    <div class="causal-schema" role="region" aria-label="Schéma causal du Scénario 1">
      <div class="schema-legend">
        <span class="legend-badge plus">+ Augmente</span>
        <span class="legend-badge minus">− Diminue</span>
        <span class="legend-badge feedback">↺ Boucle d'impact</span>
      </div>
      <svg viewBox="0 0 760 360" class="schema-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0052cc" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#00875a" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#de350b" />
          </marker>
        </defs>

        <!-- Nœud 1 : Directive Européenne -->
        <g class="schema-node" transform="translate(20, 140)">
          <rect width="180" height="70" rx="8" fill="#e6fcff" stroke="#00a3bf" stroke-width="2"/>
          <text x="90" y="30" text-anchor="middle" font-weight="700" font-size="14" fill="#004953">Directive & Décisions</text>
          <text x="90" y="50" text-anchor="middle" font-size="11" fill="#42526e">Impulsion commune</text>
        </g>

        <!-- Nœud 2 : Croissance -->
        <g class="schema-node" transform="translate(260, 40)">
          <rect width="180" height="65" rx="8" fill="#e3fcef" stroke="#00875a" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#006644">Croissance du PIB</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Emploi & Activité (%)</text>
        </g>

        <!-- Nœud 3 : CO2 -->
        <g class="schema-node" transform="translate(540, 40)">
          <rect width="180" height="65" rx="8" fill="#ffebe6" stroke="#de350b" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#bf2600">Émissions de CO₂</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Pression carbone</text>
        </g>

        <!-- Nœud 4 : Bien-être VEB -->
        <g class="schema-node" transform="translate(540, 240)">
          <rect width="180" height="65" rx="8" fill="#e3fcef" stroke="#00875a" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#006644">Bien-être & Végétalisation</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Indice VEB (0-100)</text>
        </g>

        <!-- Nœud 5 : Gini (Inégalités) -->
        <g class="schema-node" transform="translate(260, 240)">
          <rect width="180" height="65" rx="8" fill="#fff0b3" stroke="#ffab00" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#172b4d">Inégalités (Gini)</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Justice redistributive</text>
        </g>

        <!-- Flèches -->
        <!-- Directive -> Croissance -->
        <path d="M 200 160 L 260 85" stroke="#0052cc" stroke-width="2" fill="none" marker-end="url(#arrow)" />
        <!-- Croissance -> CO2 (+) -->
        <path d="M 440 72 L 530 72" stroke="#de350b" stroke-width="2" fill="none" marker-end="url(#arrow-red)" />
        <text x="485" y="62" font-size="12" font-weight="700" fill="#bf2600" text-anchor="middle">+ Émissions</text>

        <!-- CO2 -> VEB (-) -->
        <path d="M 630 105 L 630 230" stroke="#de350b" stroke-width="2" fill="none" marker-end="url(#arrow-red)" />
        <text x="645" y="170" font-size="12" font-weight="700" fill="#bf2600">− Bien-être</text>

        <!-- VEB -> Gini (-) -->
        <path d="M 540 272 L 450 272" stroke="#00875a" stroke-width="2" fill="none" marker-end="url(#arrow-green)" />
        <text x="495" y="262" font-size="12" font-weight="700" fill="#006644" text-anchor="middle">− Inégalités</text>

        <!-- VEB -> Croissance (Rétroaction) -->
        <path d="M 320 240 L 320 115" stroke="#00875a" stroke-width="2" fill="none" marker-end="url(#arrow-green)" />
        <text x="280" y="180" font-size="12" font-weight="700" fill="#006644">+ Climat sain</text>
      </svg>
      <div class="schema-textual">
        <h4>Explication textuelle de la dynamique :</h4>
        <p>1. L'impulsion politique européenne oriente les investissements dans les 6 États membres.</p>
        <p>2. La hausse d'activité économique accroît mécaniquement les émissions si les technologies restent carbonées.</p>
        <p>3. Les émissions dégradent l'indice de bien-être (VEB), ce qui accentue les disparités sociales (Gini).</p>
        <p>4. Inversement, une amélioration du bien-être et de l'environnement stabilise la croissance à long terme.</p>
      </div>
    </div>
  `;
}

export function renderScenario2Schema(): string {
  return `
    <div class="causal-schema" role="region" aria-label="Schéma causal du Scénario 2">
      <div class="schema-legend">
        <span class="legend-badge plus">+ Renforce</span>
        <span class="legend-badge minus">− Fragilise</span>
      </div>
      <svg viewBox="0 0 760 360" class="schema-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0052cc" />
          </marker>
          <marker id="arrow2-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#00875a" />
          </marker>
        </defs>

        <!-- Directive -->
        <g class="schema-node" transform="translate(20, 140)">
          <rect width="180" height="70" rx="8" fill="#e6fcff" stroke="#00a3bf" stroke-width="2"/>
          <text x="90" y="30" text-anchor="middle" font-weight="700" font-size="14" fill="#004953">Sécurité & Défense</text>
          <text x="90" y="50" text-anchor="middle" font-size="11" fill="#42526e">Directives stratégiques</text>
        </g>

        <!-- Sécurité Normandie -->
        <g class="schema-node" transform="translate(260, 40)">
          <rect width="180" height="65" rx="8" fill="#deebff" stroke="#0052cc" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#0747a6">Indice Normandie</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Sécurité & Souveraineté</text>
        </g>

        <!-- Démocratie V-Dem -->
        <g class="schema-node" transform="translate(540, 40)">
          <rect width="180" height="65" rx="8" fill="#eae6ff" stroke="#6554c0" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#403294">Démocratie (V-Dem)</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">État de droit & Libertés</text>
        </g>

        <!-- PIB -->
        <g class="schema-node" transform="translate(260, 240)">
          <rect width="180" height="65" rx="8" fill="#e3fcef" stroke="#00875a" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#006644">Croissance Économique</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Résilience productive</text>
        </g>

        <!-- IDH -->
        <g class="schema-node" transform="translate(540, 240)">
          <rect width="180" height="65" rx="8" fill="#e3fcef" stroke="#00875a" stroke-width="2"/>
          <text x="90" y="28" text-anchor="middle" font-weight="700" font-size="14" fill="#006644">Développement Humain</text>
          <text x="90" y="48" text-anchor="middle" font-size="11" fill="#42526e">Santé, Éducation, Revenu</text>
        </g>

        <!-- Liaisons -->
        <path d="M 200 160 L 260 85" stroke="#0052cc" stroke-width="2" fill="none" marker-end="url(#arrow2)" />
        <path d="M 440 72 L 530 72" stroke="#6554c0" stroke-width="2" fill="none" marker-end="url(#arrow2)" />
        <text x="485" y="62" font-size="12" font-weight="700" fill="#403294" text-anchor="middle">Confiance mutuelle</text>

        <path d="M 350 105 L 350 230" stroke="#00875a" stroke-width="2" fill="none" marker-end="url(#arrow2-green)" />
        <text x="360" y="170" font-size="12" font-weight="700" fill="#006644">+ Stabilité marché</text>

        <path d="M 440 272 L 530 272" stroke="#00875a" stroke-width="2" fill="none" marker-end="url(#arrow2-green)" />
        <text x="485" y="262" font-size="12" font-weight="700" fill="#006644" text-anchor="middle">+ Niveau de vie</text>

        <path d="M 630 105 L 630 230" stroke="#6554c0" stroke-width="2" fill="none" marker-end="url(#arrow2)" />
        <text x="640" y="170" font-size="12" font-weight="700" fill="#403294">+ Justice sociale</text>
      </svg>
      <div class="schema-textual">
        <h4>Explication textuelle de la dynamique :</h4>
        <p>1. Les décisions de sécurité commune protègent l'espace européen des chocs externes.</p>
        <p>2. Une sécurité consolidée crée un climat propice aux échanges économiques et à l'investissement serein.</p>
        <p>3. L'État de droit garantit une répartition équitable des gains et élève l'Indice de Développement Humain (IDH).</p>
      </div>
    </div>
  `;
}

export function renderCausalSchemaSVG(scenarioId: number): string {
  return scenarioId === 1 ? renderScenario1Schema() : renderScenario2Schema();
}
