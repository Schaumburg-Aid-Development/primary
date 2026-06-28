(function (global) {
  const modules = global.OnboardingModules = global.OnboardingModules || {};

  function renderAgeStep(container, state, onComplete) {
    if (!container) {
      return;
    }

    container.innerHTML = `
      <section class="onboarding-step">
        <div class="step-heading">
          <p class="eyebrow">Step 1</p>
          <h2>What is your age?</h2>
          <p>We use this to keep the experience friendly, welcoming, and age-appropriate.</p>
        </div>

        <label class="input-group" for="onboarding-age">
          <span>Your age</span>
          <input id="onboarding-age" name="age" type="number" min="13" max="100" inputmode="numeric" placeholder="e.g. 16" value="${state.age || ''}" />
        </label>

        <div class="step-actions">
          <button type="button" class="primary-btn" data-age-continue>Continue</button>
        </div>
      </section>
    `;

    const input = container.querySelector('#onboarding-age');
    const button = container.querySelector('[data-age-continue]');

    const updateButtonState = () => {
      button.disabled = !input.value.trim();
    };

    input.addEventListener('input', updateButtonState);
    updateButtonState();

    button.addEventListener('click', () => {
      const age = input.value.trim();
      if (!age) {
        return;
      }

      state.age = age;
      onComplete(age);
    });
  }

  modules.age = { renderAgeStep };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = modules.age;
  }
})(typeof window !== 'undefined' ? window : globalThis);
