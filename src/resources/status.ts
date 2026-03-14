import { HttpClient } from '../http.js';
import type { StatusResult, StatusHistoryResult } from '../types.js';

export class StatusResource {
  constructor(private http: HttpClient) {}

  get(): Promise<StatusResult> {
    return this.http.get('/status');
  }

  history(days = 90): Promise<StatusHistoryResult> {
    return this.http.get('/status/history', { days });
  }
}
