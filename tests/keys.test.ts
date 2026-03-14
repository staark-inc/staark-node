import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

describe('KeysResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('generate apeleaza POST /keys', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: {} }));
    await sdk.keys.generate({ user_id: 'u1' });
    expect(mockFetch.mock.calls[0][0]).toContain('/keys');
    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });

  it('list apeleaza GET /keys/:userId', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [] }));
    await sdk.keys.list('u1');
    expect(mockFetch.mock.calls[0][0]).toContain('/keys/u1');
  });

  it('revoke apeleaza DELETE /keys/:id cu user_id in body', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { revoked: true } }));
    await sdk.keys.revoke(42, 'u1');
    expect(mockFetch.mock.calls[0][0]).toContain('/keys/42');
    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchObject({ user_id: 'u1' });
  });
});
