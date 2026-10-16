import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { addPushToken, login, register, removePushToken, updateProfile } from '../src/services/api/authApi.ts';

const originalFetch = globalThis.fetch;
const user = { _id: 'citizen-1', name: 'Citizen', email: 'citizen@example.lk', role: 'Citizen', district: 'Colombo', riverBasins: [], phoneNumber: '+94770000000' };
const okJson = (payload, status = 200) => ({ ok: true, status, json: async () => payload });

describe('mobile auth, area profile, and push-token API', () => {
  beforeEach(() => { process.env.EXPO_PUBLIC_API_URL = 'http://localhost:5000'; });
  afterEach(() => { globalThis.fetch = originalFetch; });

  it('submits login and registration to the backend and returns the session', async () => {
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return okJson({ success: true, data: { token: 'jwt-1', user } });
    };
    const session = await login({ email: user.email, password: 'password123' });
    const registered = await register({ name: user.name, email: user.email, password: 'password123', district: 'Colombo', riverBasins: ['Kelani River Basin'], phoneNumber: user.phoneNumber });
    assert.equal(session.token, 'jwt-1');
    assert.equal(registered.user.district, 'Colombo');
    assert.deepEqual(calls.map(({ url }) => url), ['http://localhost:5000/api/auth/login', 'http://localhost:5000/api/auth/register']);
    assert.deepEqual(JSON.parse(calls[1].options.body).riverBasins, ['Kelani River Basin']);
  });

  it('registers and removes a device push token using the signed-in bearer token', async () => {
    const calls = [];
    globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, status: 200 }; };
    await addPushToken('jwt-citizen', 'ExpoPushToken[device]');
    await removePushToken('jwt-citizen', 'ExpoPushToken[device]');
    assert.deepEqual(calls.map(({ options }) => options.method), ['PUT', 'DELETE']);
    assert.ok(calls.every(({ url }) => url.endsWith('/api/auth/push-token')));
    assert.ok(calls.every(({ options }) => options.headers.Authorization === 'Bearer jwt-citizen'));
    assert.deepEqual(JSON.parse(calls[0].options.body), { pushToken: 'ExpoPushToken[device]' });
  });

  it('updates the registered district, basin subscriptions, and SMS phone', async () => {
    let call;
    globalThis.fetch = async (url, options) => { call = { url, options }; return okJson({ success: true, data: { user } }); };
    const updated = await updateProfile('jwt-citizen', { district: 'Colombo', riverBasins: ['Kelani River Basin'], phoneNumber: '+94770000000' });
    assert.equal(updated._id, 'citizen-1');
    assert.equal(call.url, 'http://localhost:5000/api/auth/profile');
    assert.equal(call.options.method, 'PATCH');
    assert.equal(call.options.headers.Authorization, 'Bearer jwt-citizen');
    assert.deepEqual(JSON.parse(call.options.body), { district: 'Colombo', riverBasins: ['Kelani River Basin'], phoneNumber: '+94770000000' });
  });

  it('passes backend registration errors through to the caller', async () => {
    globalThis.fetch = async () => ({ ok: false, status: 400, json: async () => ({ message: 'Choose a supported district.' }) });
    await assert.rejects(register({ name: 'Citizen', email: user.email, password: 'password123' }), { message: 'Choose a supported district.', status: 400 });
  });
});
