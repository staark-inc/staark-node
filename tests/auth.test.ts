import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

describe('AuthResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('login apeleaza /auth/login fara Authorization header', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, user: {}, accessToken: 'at', refreshToken: 'rt' }));
    await sdk.auth.login({ email: 'a@b.com', password: 'pass' });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/login');
    expect(call[1].headers).not.toHaveProperty('Authorization');
  });

  it('register apeleaza /auth/register fara Authorization header', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { user: {} } }));
    await sdk.auth.register({ email: 'a@b.com', password: 'p', confirmPassword: 'p', firstName: 'A', lastName: 'B' });
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/register');
    expect(call[1].headers).not.toHaveProperty('Authorization');
  });

  it('logout trimite accessToken ca Bearer header', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { ok: true } }));
    await sdk.auth.logout('my-access-token', 'my-refresh-token');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/logout');
    expect(call[1].headers.Authorization).toBe('Bearer my-access-token');
    expect(JSON.parse(call[1].body)).toMatchObject({ refreshToken: 'my-refresh-token' });
  });

  it('refresh trimite accessToken ca Bearer header', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, accessToken: 'new-at', refreshToken: 'new-rt' }));
    await sdk.auth.refresh('my-access-token', 'my-refresh-token');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/refresh');
    expect(call[1].headers.Authorization).toBe('Bearer my-access-token');
  });

  it('forgotPassword apeleaza fara Authorization header', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { sent: true } }));
    await sdk.auth.forgotPassword('a@b.com');
    const call = mockFetch.mock.calls[0];
    expect(call[0]).toContain('/auth/forgot-password');
    expect(call[1].headers).not.toHaveProperty('Authorization');
  });
});
