(function (global) {
  const modules = global.OnboardingModules = global.OnboardingModules || {};

  function renderInterestsStep(container, state, onComplete) {
    if (!container) {
      return;
    }

    const helpNeeds = state.helpNeeds || ['', '', '', '', ''];

    container.innerHTML = `
      <section class="onboarding-step">
        <div class="step-heading">
          <p class="eyebrow">Step 3</p>
          <h2>What do you need help with?</h2>
          <p>Share up to five things you want support with or what you want to help with. You can leave the rest blank.</p>
        </div>

        <div class="input-stack">
          ${helpNeeds.map((value, index) => `
            <label class="input-group" for="help-${index + 1}">
              <span>Need ${index + 1}</span>
              <input id="help-${index + 1}" data-help-input type="text" placeholder="e.g. Homework help" value="${value || ''}" />
            </label>
          `).join('')}
        </div>

        <div class="step-actions">
          <button type="button" class="primary-btn" data-interests-continue disabled>Finish</button>
        </div>
      </section>
    `;

    const inputs = Array.from(container.querySelectorAll('[data-help-input]'));
    const button = container.querySelector('[data-interests-continue]');

    const updateButtonState = () => {
      const hasValue = inputs.some((input) => input.value.trim());
      button.disabled = !hasValue;
    };

    inputs.forEach((input) => {
      input.addEventListener('input', updateButtonState);
    });

    updateButtonState();

    button.addEventListener('click', () => {
      const needs = inputs.map((input) => input.value.trim()).filter(Boolean);
      if (!needs.length) {
        return;
      }

      state.helpNeeds = needs.concat(Array(5 - needs.length).fill(''));
      onComplete(needs);
    });
  }

  modules.interests = { renderInterestsStep };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = modules.interests;
  }
})(typeof window !== 'undefined' ? window : globalThis);
