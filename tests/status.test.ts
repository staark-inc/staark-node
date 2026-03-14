import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

describe('StatusResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('get apeleaza GET /status', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, generatedAt: '2024-01-01', services: [] }));
    await sdk.status.get();
    expect(mockFetch.mock.calls[0][0]).toContain('/status');
  });

  it('history apeleaza GET /status/history cu days=90 implicit', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, days: 90, history: [] }));
    await sdk.status.history();
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('/status/history');
    expect(url).toContain('days=90');
  });

  it('history accepta days custom', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, days: 30, history: [] }));
    await sdk.status.history(30);
    expect(mockFetch.mock.calls[0][0]).toContain('days=30');
  });
});
