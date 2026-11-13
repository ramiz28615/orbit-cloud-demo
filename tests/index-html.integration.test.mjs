import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { shouldAutoUseLiveSession } from '../auth-demo-state.mjs';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appScript = html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(appScript, 'real inline application script exists');

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset; this.classList = { add() {}, remove() {}, toggle() {} };
    this.listeners = {}; this.style = {}; this.value = ''; this.textContent = '';
  }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  setAttribute() {} removeAttribute() {} focus() {}
  click(event = {}) { return this.listeners.click?.({ target: this, ...event }); }
}

async function boot({ search = '', responseStatus = 200, authUser = null, callbackDelay = false } = {}) {
  const elements = new Map();
  const get = (id) => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  const document = {
    getElementById: get,
    querySelectorAll: () => [], querySelector: () => new Element(),
    addEventListener(type, fn) { this.listeners ||= {}; this.listeners[type] = fn; }
  };
  let callback;
  const requests = [];
  const fakeFetch = async (url, options) => {
    requests.push({ url, options });
    return { status: responseStatus, ok: responseStatus >= 200 && responseStatus < 300,
      async json() { return url.endsWith('/projects') ? { projects: [{ name: 'TEST_PROJECT', framework: 'test' }] } : { deployments: [{ project: 'TEST_PROJECT', status: 'READY' }] }; } };
  };
  const location = { href: `https://offline.invalid/${search}` , search };
  const history = { replaceState(_s, _t, url) { location.href = String(url); location.search = new URL(url).search; } };
  const auth = { currentUser: null };
  const mocks = `
    const initializeFirebaseMocks={
      initializeApp:()=>({}), getAuth:()=>providedAuth,
      GoogleAuthProvider:class { setCustomParameters(){} },
      signInWithPopup:async()=>({user:providedPopupUser}),
      onAuthStateChanged:(_auth,fn)=>registerCallback(fn), signOut:async()=>{},
      setPersistence:async()=>{}, browserLocalPersistence:{}
    };
  `;
  let source = appScript.replace(/^\s*import \{ shouldAutoUseLiveSession \} from '\.\/auth-demo-state\.mjs';\s*$/m, '');
  source = source.replace(/const \[appSdk,authSdk,configModule\]=await Promise\.all\(\[[\s\S]*?\]\);/, `const appSdk={initializeApp:initializeFirebaseMocks.initializeApp}; const authSdk=initializeFirebaseMocks; const configModule={firebaseConfig:{apiKey:'offline',authDomain:'offline.invalid',projectId:'offline'}};`);
  const context = vm.createContext({ document, location, history, URL, URLSearchParams, setTimeout: (fn) => 0, clearTimeout() {}, console, fetch: fakeFetch,
    window: { scrollTo() {} }, shouldAutoUseLiveSession, providedAuth: auth,
    providedPopupUser: null, registerCallback(fn) { callback = fn; },
    // Keep each test's Firebase identity synthetic and local.
  });
  vm.runInContext(mocks + source, context, { filename: 'index.html:inline-script' });
  await new Promise(resolve => setImmediate(resolve));
  if (!callbackDelay && authUser) { auth.currentUser = authUser; callback(authUser); }
  await new Promise(resolve => setImmediate(resolve));
  return { context, elements, requests, auth, callback: async user => { auth.currentUser = user; callback(user); await new Promise(resolve => setImmediate(resolve)); },
    clickDocument: async selector => document.listeners.click({ target: { closest: s => s === selector ? new Element({ 'open-dashboard': '' }) : null } }) };
}

function syntheticGoogleUser(uid = 'offline-user') {
  return { uid, emailVerified: true, providerData: [{ providerId: 'google.com' }], async getIdToken() { return 'offline-id-token'; }, displayName: 'Offline Test', email: 'offline@example.invalid' };
}
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

test('restored Google user with ?demo=1 clears URL, requests projects and deployments, and renders live UI', async () => {
  const app = await boot({ search: '?demo=1', authUser: syntheticGoogleUser() }); await settle();
  assert.equal(new URL(app.context.location.href).searchParams.has('demo'), false);
  assert.deepEqual(app.requests.map(r => new URL(r.url).pathname.split('/').pop()).sort(), ['analytics','deployments','domains','projects']);
  assert.ok(app.requests.every(r => r.options.method === 'GET' && r.options.credentials === 'omit' && r.options.cache === 'no-store'));
  assert.match(app.elements.get('viewContent').innerHTML, /CANLI · SALT OKUNUR/);
  assert.equal(app.elements.get('dashboard').classList, app.elements.get('dashboard').classList);
});

test('explicit demo click before Firebase callback keeps demo mode and sends no bridge requests', async () => {
  const app = await boot({ search: '?demo=1', callbackDelay: true });
  app.context.document.listeners.click({ target: { closest: selector => selector === '[data-open-dashboard]' ? { dataset: {} } : null } });
  await app.callback(syntheticGoogleUser()); await settle();
  assert.equal(app.requests.length, 0);
  assert.match(app.elements.get('viewContent').innerHTML, /DEMO MODU/);
  assert.equal(new URL(app.context.location.href).searchParams.get('demo'), '1');
});

test('Google popup login exits a selected demo and starts real bridge GETs', async () => {
  const user = syntheticGoogleUser();
  const app = await boot({ search: '?demo=1', callbackDelay: true });
  app.context.providedPopupUser = user;
  app.context.document.getElementById('googleSignIn').click();
  await settle(); await settle();
  assert.equal(new URL(app.context.location.href).searchParams.has('demo'), false);
  assert.ok(app.requests.some(r => r.url.endsWith('/projects')));
  assert.ok(app.requests.some(r => r.url.endsWith('/deployments')));
});

test('bridge 403 renders safe forbidden state without exposing response body', async () => {
  const app = await boot({ authUser: syntheticGoogleUser(), responseStatus: 403 }); await settle();
  assert.match(app.elements.get('viewContent').innerHTML, /Bu hesaba erişim izni verilmedi/);
  assert.doesNotMatch(app.elements.get('viewContent').innerHTML, /TEST_PROJECT|offline-id-token/);
});

test('no authenticated user makes no live request and displays no live data', async () => {
  const app = await boot({ search: '?demo=1' }); await settle();
  assert.equal(app.requests.length, 0);
  assert.match(app.elements.get('viewContent').innerHTML, /DEMO MODU|OTURUM GEREKLİ/);
  assert.doesNotMatch(app.elements.get('viewContent').innerHTML, /CANLI · SALT OKUNUR/);
});
