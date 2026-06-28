(function (global) {
  const modules = global.OnboardingModules = global.OnboardingModules || {};

  function renderRoleStep(container, state, onComplete) {
    if (!container) {
      return;
    }

    container.innerHTML = `
      <section class="onboarding-step">
        <div class="step-heading">
          <p class="eyebrow">Step 2</p>
          <h2>What is your role?</h2>
          <p>Pick the role that fits you best right now.</p>
        </div>

        <div class="option-grid">
          <button type="button" class="option-card ${state.role === 'Helper' ? 'selected' : ''}" data-role-option="Helper">
            <strong>Helper</strong>
            <span>You help others in your community.</span>
          </button>
          <button type="button" class="option-card ${state.role === 'Helped' ? 'selected' : ''}" data-role-option="Helped">
            <strong>Helped</strong>
            <span>You need help with some tasks.</span>
          </button>
          <button type="button" class="option-card ${state.role === 'Both' ? 'selected' : ''}" data-role-option="Both">
            <strong>Both</strong>
            <span>You can help and be helped.</span>
          </button>
        </div>

        <div class="step-actions">
          <button type="button" class="primary-btn" data-role-continue disabled>Continue</button>
        </div>
      </section>
    `;

    const options = Array.from(container.querySelectorAll('[data-role-option]'));
    const button = container.querySelector('[data-role-continue]');

    const updateButtonState = () => {
      button.disabled = !state.role;
    };

    options.forEach((option) => {
      option.addEventListener('click', () => {
        state.role = option.dataset.roleOption;
        options.forEach((item) => item.classList.toggle('selected', item === option));
        updateButtonState();
      });
    });

    updateButtonState();

    button.addEventListener('click', () => {
      if (!state.role) {
        return;
      }

      onComplete(state.role);
    });
  }

  modules.role = { renderRoleStep };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = modules.role;
  }
})(typeof window !== 'undefined' ? window : globalThis);
