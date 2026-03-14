import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

const fakeProject = { id: 'p1', workspace_id: 'ws1', name: 'Test', description: null, color: null, status: 'active', visibility: 'private', task_count: 0, created_at: 0, updated_at: 0 };

describe('ProjectsResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('list apeleaza GET /projects cu query params', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [fakeProject], meta: { total: 1, page: 1, limit: 20 } }));
    await sdk.projects.list({ workspace_id: 'ws1', status: 'active' });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('/projects');
    expect(url).toContain('workspace_id=ws1');
  });

  it('create apeleaza POST /projects', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeProject }));
    await sdk.projects.create({ workspace_id: 'ws1', name: 'New Project' });
    expect(mockFetch.mock.calls[0][0]).toContain('/projects');
    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });

  it('get apeleaza GET /projects/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeProject }));
    await sdk.projects.get('p1');
    expect(mockFetch.mock.calls[0][0]).toContain('/projects/p1');
  });

  it('update apeleaza PATCH /projects/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeProject }));
    await sdk.projects.update('p1', { name: 'Updated' });
    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH');
    expect(mockFetch.mock.calls[0][0]).toContain('/projects/p1');
  });

  it('delete apeleaza DELETE /projects/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { deleted: true } }));
    await sdk.projects.delete('p1');
    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
  });
});
