import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, StaarkError } from '../src/http.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('HttpClient', () => {
  const client = new HttpClient('https://api.example.com', 'test-key');

  it('GET trimite Authorization header', async () => {
    mockFetch.mockResolvedValue(makeResponse({ ok: true, data: {} }));
    await client.get('/test');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-key' }) }),
    );
  });

  it('POST trimite body JSON', async () => {
    mockFetch.mockResolvedValue(makeResponse({ ok: true, data: {} }));
    await client.post('/test', { foo: 'bar' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ foo: 'bar' }) }),
    );
  });

  it('PATCH trimite method PATCH', async () => {
    mockFetch.mockResolvedValue(makeResponse({ ok: true, data: {} }));
    await client.patch('/test', { name: 'new' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('postWithToken suprascrie Authorization header', async () => {
    mockFetch.mockResolvedValue(makeResponse({ ok: true }));
    await client.postWithToken('/auth/logout', { refreshToken: 'rt' }, 'user-access-token');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/auth/logout',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer user-access-token' }) }),
    );
  });

  it('postPublic nu trimite Authorization header', async () => {
    mockFetch.mockResolvedValue(makeResponse({ ok: true }));
    await client.postPublic('/auth/login', {});
    const call = mockFetch.mock.calls[0][1];
    expect(call.headers).not.toHaveProperty('Authorization');
  });

  it('arunca StaarkError la raspuns cu eroare JSON', async () => {
    mockFetch.mockResolvedValue(makeResponse({ error: { code: 'NOT_FOUND', message: 'Not found' } }, 404));
    await expect(client.get('/missing')).rejects.toThrow(StaarkError);
    await expect(client.get('/missing')).rejects.toMatchObject({ code: 'NOT_FOUND', status: 404 });
  });

  it('arunca StaarkError cu PARSE_ERROR la raspuns non-JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => { throw new SyntaxError('Unexpected token'); },
    } as unknown as Response);
    await expect(client.get('/bad')).rejects.toMatchObject({ code: 'PARSE_ERROR', status: 502 });
  });

  it('elimina slash-ul trailing din baseUrl', () => {
    const c = new HttpClient('https://api.example.com/', 'key');
    expect((c as any).baseUrl).toBe('https://api.example.com');
  });

  it('arunca Error daca apiKey lipseste din Staark', async () => {
    const { Staark } = await import('../src/index.js');
    expect(() => new Staark({ apiKey: '' })).toThrow('Staark: apiKey is required');
  });
});
