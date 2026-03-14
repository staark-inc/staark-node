import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Staark } from '../src/index.js';

const mockFetch = vi.fn();
beforeEach(() => { vi.stubGlobal('fetch', mockFetch); });
afterEach(() => { vi.restoreAllMocks(); });

function makeOkResponse(data: unknown): Response {
  return { ok: true, status: 200, json: async () => data } as Response;
}

const fakeTask = { id: 't1', project_id: 'p1', title: 'Task', description: null, status: 'todo', priority: 'medium', assignee_id: null, due_date: null, tags: [], created_at: 0, updated_at: 0 };

describe('TasksResource', () => {
  const sdk = new Staark({ apiKey: 'test-key' });

  it('list apeleaza GET /projects/:projectId/tasks', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: [fakeTask], meta: { total: 1, page: 1, limit: 20 } }));
    await sdk.tasks.list('p1');
    expect(mockFetch.mock.calls[0][0]).toContain('/projects/p1/tasks');
  });

  it('create apeleaza POST /projects/:projectId/tasks', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeTask }));
    await sdk.tasks.create('p1', { title: 'New Task' });
    expect(mockFetch.mock.calls[0][0]).toContain('/projects/p1/tasks');
    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });

  it('get apeleaza GET /tasks/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeTask }));
    await sdk.tasks.get('t1');
    expect(mockFetch.mock.calls[0][0]).toContain('/tasks/t1');
  });

  it('update apeleaza PATCH /tasks/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: fakeTask }));
    await sdk.tasks.update('t1', { status: 'done' });
    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH');
    expect(mockFetch.mock.calls[0][0]).toContain('/tasks/t1');
  });

  it('delete apeleaza DELETE /tasks/:id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ ok: true, data: { deleted: true } }));
    await sdk.tasks.delete('t1');
    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
  });
});
