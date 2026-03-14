import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

describe('OAuthResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('authorize apeleaza /auth/oauth/:provider/authorize fara Authorization', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { url: 'https://github.com/oauth', state: 'abc' } }));
    await sdk.auth.oauth.authorize('github', { redirect_uri: 'https://myapp.com/callback' });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/oauth/github/authorize');
    expect(call[1].headers).not.toHaveProperty('Authorization');
  });

  it('callback apeleaza /auth/oauth/:provider/callback fara Authorization', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, user: {}, accessToken: 'at', refreshToken: 'rt' }));
    await sdk.auth.oauth.callback('google', 'auth-code-123', 'state-xyz');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/oauth/google/callback');
    expect(call[1].headers).not.toHaveProperty('Authorization');
    expect(JSON.parse(call[1].body)).toMatchObject({ code: 'auth-code-123', state: 'state-xyz' });
  });

  it('connected apeleaza GET /auth/oauth/connected cu user token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [] }));
    await sdk.auth.oauth.connected('user-access-token');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/oauth/connected');
    expect(call[1].headers.Authorization).toBe('Bearer user-access-token');
  });

  it('disconnect apeleaza /auth/oauth/:provider/disconnect cu user token', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { disconnected: true } }));
    await sdk.auth.oauth.disconnect('user-access-token', 'discord');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/oauth/discord/disconnect');
    expect(call[1].headers.Authorization).toBe('Bearer user-access-token');
  });

  it('setupProjectCards apeleaza /projects/:id/oauth-cards cu providerii specificati', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [] }));
    await sdk.auth.oauth.setupProjectCards('user-access-token', 'proj_123', ['github', 'google']);
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/projects/proj_123/oauth-cards');
    expect(JSON.parse(call[1].body)).toMatchObject({ providers: ['github', 'google'] });
  });
});
