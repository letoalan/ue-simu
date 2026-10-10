/**
 * Mini-quiz d'auto-évaluation didactique pour élèves de lycée général et pro.
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; correct: boolean; explanation: string }[];
}

export const PEDAGOGY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Si l’Union européenne augmente fortement la production industrielle sans imposer de normes vertes, que se passe-t-il ?",
    options: [
      {
        label: "Le CO₂ augmente et dégrade le bien-être (VEB) à moyen terme.",
        correct: true,
        explanation: "Exact ! C'est l'effet domino : plus d'activité carbonée entraîne plus de pollution, ce qui nuit à la santé et au cadre de vie."
      },
      {
        label: "Les émissions diminuent automatiquement par magie technologique.",
        correct: false,
        explanation: "Faux. Sans investissement vert ni réglementation stricte, l'augmentation d'activité brûle davantage d'énergie fossile."
      }
    ]
  },
  {
    id: 2,
    question: "Pourquoi une directive votée à Bruxelles ne règle-t-elle pas tous les problèmes dès la première année (2025) ?",
    options: [
      {
        label: "Parce que le simulateur applique une pénalité arbitraire.",
        correct: false,
        explanation: "Non, le modèle reproduit la réalité du déploiement des investissements et des infrastructures."
      },
      {
        label: "C’est la règle du paquebot (inertie) : les usines et lois mettent 2 à 3 ans à se transformer.",
        correct: true,
        explanation: "Bravo ! Construire des parcs éoliens ou moderniser des réseaux électriques demande du temps et des moyens concrets."
      }
    ]
  },
  {
    id: 3,
    question: "Que signifie un indice d'inégalités (Gini) qui dépasse 0.44 ?",
    options: [
      {
        label: "Une alerte rouge : les écarts de richesse menacent la cohésion sociale.",
        correct: true,
        explanation: "Tout à fait ! Au-delà de 0.44, les partis politiques de gauche et la société civile sanctionnent l'absence de redistribution."
      },
      {
        label: "Une excellente nouvelle pour la justice sociale.",
        correct: false,
        explanation: "Non ! Pour le Gini, plus le chiffre est bas, plus la société est juste et égalitaire."
      }
    ]
  }
];

export function renderQuizHtml(): string {
  return `
    <div class="card quiz-card" style="margin-top: 16px;">
      <div class="card-header">
        <div>
          <h2 class="card-title" style="font-size: 1.15rem;">🎯 Vérifie ta compréhension (Quiz Express)</h2>
          <span style="font-size: 0.82rem; color: var(--color-text-muted);">3 questions rapides pour tester tes réflexes de négociateur</span>
        </div>
        <span class="badge badge-commission">Lycée & Pro</span>
      </div>

      <div class="quiz-container" style="display: flex; flex-direction: column; gap: 14px; margin-top: 12px;">
        ${PEDAGOGY_QUIZ.map(q => `
          <div class="quiz-item" data-qid="${q.id}" style="background: var(--color-surface-hover); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px; color: var(--color-text-main);">
              ${q.id}. ${q.question}
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${q.options.map((opt, oIdx) => `
                <button class="btn btn-secondary btn-sm btn-quiz-opt" data-qid="${q.id}" data-oidx="${oIdx}" style="text-align: left; justify-content: flex-start; padding: 8px 12px; font-size: 0.85rem; line-height: 1.4; white-space: normal;">
                  👉 ${opt.label}
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="feedback-q${q.id}" style="display: none; margin-top: 10px; padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem;"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function attachQuizEvents(container: HTMLElement): void {
  container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = Number(btn.getAttribute('data-qid'));
      const oidx = Number(btn.getAttribute('data-oidx'));
      const question = PEDAGOGY_QUIZ.find(q => q.id === qid);
      if (!question) return;

      const opt = question.options[oidx];
      const feedbackEl = container.querySelector(`#feedback-q${qid}`) as HTMLElement;
      if (!feedbackEl) return;

      feedbackEl.style.display = 'block';
      if (opt.correct) {
        feedbackEl.style.background = 'rgba(16, 185, 129, 0.12)';
        feedbackEl.style.color = '#065f46';
        feedbackEl.style.border = '1px solid #10b981';
        feedbackEl.innerHTML = `✅ <b>Correct !</b> ${opt.explanation}`;
      } else {
        feedbackEl.style.background = 'rgba(239, 68, 68, 0.12)';
        feedbackEl.style.color = '#991b1b';
        feedbackEl.style.border = '1px solid #ef4444';
        feedbackEl.innerHTML = `❌ <b>Essaie encore :</b> ${opt.explanation}`;
      }
    });
  });
}
