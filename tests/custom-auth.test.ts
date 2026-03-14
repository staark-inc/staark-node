import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

describe('CustomAuthResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('register apeleaza POST /auth/custom/methods cu user token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: {} }));
    await sdk.auth.custom.register('user-access-token', { name: 'magic-link', handler_url: 'https://myapp.com/auth' });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/custom/methods');
    expect(call[1].headers.Authorization).toBe('Bearer user-access-token');
    expect(JSON.parse(call[1].body)).toMatchObject({ name: 'magic-link' });
  });

  it('login apeleaza /auth/custom/:methodId/login fara Authorization', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, user: {}, accessToken: 'at', refreshToken: 'rt' }));
    await sdk.auth.custom.login('magic-link', { email: 'ion@example.com' });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/custom/magic-link/login');
    expect(call[1].headers).not.toHaveProperty('Authorization');
  });

  it('list apeleaza GET /auth/custom/methods cu user token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [] }));
    await sdk.auth.custom.list('user-access-token');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/custom/methods');
    expect(call[1].headers.Authorization).toBe('Bearer user-access-token');
  });

  it('delete apeleaza /auth/custom/methods/:methodId/delete cu user token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { deleted: true } }));
    await sdk.auth.custom.delete('user-access-token', 'magic-link');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/custom/methods/magic-link/delete');
    expect(call[1].headers.Authorization).toBe('Bearer user-access-token');
  });
});
