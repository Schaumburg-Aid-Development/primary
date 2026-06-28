import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const onboardingModule = require('./onboarding.module.js');
const { createInitialState, buildSummary } = onboardingModule;

test('creates an initial onboarding state', () => {
  const state = createInitialState();

  assert.equal(state.currentStep, 0);
  assert.equal(state.age, '');
  assert.equal(state.role, '');
  assert.deepEqual(state.helpNeeds, ['', '', '', '', '']);
});

test('builds a summary from collected responses', () => {
  const state = createInitialState();
  state.age = '16';
  state.role = 'Helper';
  state.helpNeeds = ['Homework help', 'Transport'];

  const summary = buildSummary(state);

  assert.match(summary, /16/);
  assert.match(summary, /Helper/);
  assert.match(summary, /Homework help/);
  assert.match(summary, /Transport/);
});
