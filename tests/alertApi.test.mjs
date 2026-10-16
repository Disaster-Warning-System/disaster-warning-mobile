import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { getCitizenAlertFeed } from '../src/services/api/alertApi.ts';

describe('citizen alert feed API', () => {
  const previousBaseUrl = process.env.EXPO_PUBLIC_API_URL;
  beforeEach(() => { process.env.EXPO_PUBLIC_API_URL = 'http://localhost:5000'; });
  afterEach(() => {
    if (previousBaseUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = previousBaseUrl;
  });

  it('calls the citizen feed with the signed-in bearer token and parses alerts', async () => {
    let actualUrl;
    let actualOptions;
    const fetchImpl = async (url, options) => {
      actualUrl = url;
      actualOptions = options;
      return { ok: true, json: async () => ({ count: 1, alerts: [{ alertId: 'ALT-1', headline: 'Flood', instructions: 'Move now', severity: 'Warning' }] }) };
    };
    const alerts = await getCitizenAlertFeed('citizen-jwt', fetchImpl);
    assert.equal(actualUrl, 'http://localhost:5000/api/alerts/feed');
    assert.equal(actualOptions.method, 'GET');
    assert.equal(actualOptions.headers.Authorization, 'Bearer citizen-jwt');
    assert.equal(alerts[0].instructions, 'Move now');
  });

  it('rejects an empty auth token without making a network request', async () => {
    let called = false;
    await assert.rejects(getCitizenAlertFeed('', async () => { called = true; }), { status: 401 });
    assert.equal(called, false);
  });

  it('surfaces feed authorization and server errors', async () => {
    await assert.rejects(getCitizenAlertFeed('expired', async () => ({ ok: false, status: 401 })), { status: 401 });
    await assert.rejects(getCitizenAlertFeed('valid', async () => ({ ok: false, status: 500 })), { status: 500 });
  });

  it('returns an empty list for a malformed alerts payload', async () => {
    const alerts = await getCitizenAlertFeed('valid', async () => ({ ok: true, json: async () => ({ alerts: null }) }));
    assert.deepEqual(alerts, []);
  });
});
