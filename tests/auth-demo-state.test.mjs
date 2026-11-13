import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoUseLiveSession } from '../auth-demo-state.mjs';

const mockGoogleUser = Object.freeze({
  uid: 'mock-user-id', emailVerified: true,
  providerData: [{ providerId: 'google.com' }],
  getIdToken: async () => 'mock-id-token'
});

function mockBridge() {
  const requests = [];
  return { requests, async getProjects() { requests.push('projects'); return []; } };
}

async function applyAuthCallback({ user, selectedDemo, initialDemo }) {
  let demoMode = initialDemo;
  let userSelectedDemo = selectedDemo;
  const bridge = mockBridge();
  if (shouldAutoUseLiveSession(user, userSelectedDemo)) {
    demoMode = false;
    userSelectedDemo = false;
    await bridge.getProjects();
  }
  return { demoMode, userSelectedDemo, requests: bridge.requests };
}

test('restored Google session auto-clears URL demo mode and starts live request', async () => {
  const result = await applyAuthCallback({ user: mockGoogleUser, selectedDemo: false, initialDemo: true });
  assert.equal(result.demoMode, false);
  assert.deepEqual(result.requests, ['projects']);
});

test('explicit demo choice wins over a pending auth callback and makes no bridge request', async () => {
  const result = await applyAuthCallback({ user: mockGoogleUser, selectedDemo: true, initialDemo: true });
  assert.equal(result.demoMode, true);
  assert.equal(result.userSelectedDemo, true);
  assert.deepEqual(result.requests, []);
});

test('unauthenticated demo stays offline', async () => {
  const result = await applyAuthCallback({ user: null, selectedDemo: false, initialDemo: true });
  assert.equal(result.demoMode, true);
  assert.deepEqual(result.requests, []);
});

test('unverified or non-Google users do not auto-switch to live mode', async () => {
  const unverified = { ...mockGoogleUser, emailVerified: false };
  const nonGoogle = { ...mockGoogleUser, providerData: [{ providerId: 'password' }] };
  assert.equal(shouldAutoUseLiveSession(unverified, false), false);
  assert.equal(shouldAutoUseLiveSession(nonGoogle, false), false);
});

test('a later explicit Google popup login can leave a previously selected demo', async () => {
  const afterDemo = await applyAuthCallback({ user: mockGoogleUser, selectedDemo: true, initialDemo: true });
  assert.equal(afterDemo.demoMode, true);
  const popupLogin = await applyAuthCallback({ user: mockGoogleUser, selectedDemo: false, initialDemo: true });
  assert.equal(popupLogin.demoMode, false);
  assert.deepEqual(popupLogin.requests, ['projects']);
});
