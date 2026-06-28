(function (global) {
  const modules = global.OnboardingModules = global.OnboardingModules || {};

  function createInitialState() {
    return {
      currentStep: 0,
      started: false,
      age: '',
      role: '',
      helpNeeds: ['', '', '', '', '']
    };
  }

  function buildSummary(state) {
    const needs = (state.helpNeeds || []).filter(Boolean);
    const helpText = needs.length ? needs.join(', ') : 'No help needs shared yet';

    return [
      `Age: ${state.age || 'Not shared'}`,
      `Role: ${state.role || 'Not chosen'}`,
      `Help needs: ${helpText}`
    ].join('\n');
  }

  function initOnboarding(root) {
    const state = createInitialState();

    const render = () => {
      if (!root) {
        return;
      }

      const progressValue = state.started ? Math.min(100, (state.currentStep / 3) * 100) : 0;
      const stepLabel = !state.started
        ? 'Start here'
        : state.currentStep === 3
          ? 'Complete'
          : `Step ${state.currentStep + 1} of 3`;

      root.innerHTML = `
        <section class="onboarding-shell">
          <div class="onboarding-hero">
            <p class="eyebrow">Onboarding</p>
            <h1>Let's get you sorted out.</h1>
            <p>It's time to make everything feel like it was made for <i>you</i>.</p>
            ${state.started ? '' : '<button type="button" class="primary-btn" data-begin-onboarding>Begin</button>'}
          </div>

          ${state.started ? `
            <div class="onboarding-card">
              <div class="progress-row">
                <div class="progress-bar" aria-hidden="true">
                  <div class="progress-fill" style="width: ${progressValue}%;"></div>
                </div>
                <span class="progress-text">${stepLabel}</span>
              </div>
              <div class="step-panel" data-step-panel></div>
            </div>
          ` : ''}
        </section>
      `;

      const stepPanel = root.querySelector('[data-step-panel]');
      if (!state.started) {
        const button = root.querySelector('[data-begin-onboarding]');
        button.addEventListener('click', () => {
          state.started = true;
          render();
          renderCurrentStep(stepPanel, state);
        });
        return;
      }

      renderCurrentStep(stepPanel, state);
    };

    const renderCurrentStep = (stepPanel, currentState) => {
      if (currentState.currentStep === 3) {
        const needs = (currentState.helpNeeds || []).filter(Boolean);
        stepPanel.innerHTML = `
          <section class="onboarding-step summary-card">
            <div class="step-heading">
              <p class="eyebrow">You are all set</p>
              <h2>Here is your onboarding summary</h2>
              <p>Everything looks ready for your first experience.</p>
            </div>
            <div class="summary-list">
              <div><strong>Age</strong><span>${currentState.age || 'Not shared'}</span></div>
              <div><strong>Role</strong><span>${currentState.role || 'Not chosen'}</span></div>
              <div><strong>Help needs</strong><span>${needs.length ? needs.join(', ') : 'No help needs shared yet'}</span></div>
            </div>
            <div class="step-actions">
              <button type="button" class="primary-btn" data-finish-onboarding>Return home</button>
            </div>
          </section>
        `;

        const finishButton = stepPanel.querySelector('[data-finish-onboarding]');
        finishButton.addEventListener('click', () => {
          window.location.href = "../../../index.html";
        });
        return;
      }

      if (currentState.currentStep === 0) {
        modules.age.renderAgeStep(stepPanel, currentState, () => {
          currentState.currentStep = 1;
          render();
        });
        return;
      }

      if (currentState.currentStep === 1) {
        modules.role.renderRoleStep(stepPanel, currentState, () => {
          currentState.currentStep = 2;
          render();
        });
        return;
      }

      modules.interests.renderInterestsStep(stepPanel, currentState, () => {
        currentState.currentStep = 3;
        render();
      });
    };

    render();
  }

  const moduleApi = {
    createInitialState,
    buildSummary,
    initOnboarding
  };

  global.OnboardingModule = moduleApi;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = moduleApi;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const target = document.querySelector('[data-onboarding-root]');
      if (target) {
        initOnboarding(target);
      }
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
