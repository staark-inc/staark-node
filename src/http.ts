import type { ApiError } from './types.js';

export class StaarkError extends Error {
  code:   string;
  status: number;
  field?: string;

  constructor(error: { code: string; message: string; field?: string }, status: number) {
    super(error.message);
    this.name   = 'StaarkError';
    this.code   = error.code;
    this.status = status;
    this.field  = error.field;
  }
}

export class HttpClient {
  private baseUrl: string;
  private apiKey:  string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey  = apiKey;
  }

  /** Headers pentru endpoint-uri protejate (projects, tasks, keys) */
  private headers(extra?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...extra,
    };
  }

  /** Headers pentru endpoint-uri publice (auth) — fără Authorization */
  private publicHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  async get<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url.toString(), { headers: this.headers() });
    return this.parse(res);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'POST',
      headers: this.headers(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse(res);
  }

  /** POST cu Authorization: Bearer <token> suprascris — pentru logout/refresh */
  async postWithToken<T>(path: string, body?: unknown, token?: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'POST',
      headers: token
        ? this.headers({ Authorization: `Bearer ${token}` })
        : this.headers(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse<T>(res);
  }

  async postPublic<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'POST',
      headers: this.publicHeaders(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse(res);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'PATCH',
      headers: this.headers(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse(res);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'PUT',
      headers: this.headers(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse(res);
  }

  async delete<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'DELETE',
      headers: this.headers(),
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.parse(res);
  }

  private async parse<T>(res: Response): Promise<T> {
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new StaarkError(
        { code: 'PARSE_ERROR', message: `Server returned non-JSON response (HTTP ${res.status})` },
        res.status,
      );
    }
    if (!res.ok) {
      const err = (data as { error?: ApiError }).error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error' };
      throw new StaarkError(err, res.status);
    }
    return data as T;
  }
}
