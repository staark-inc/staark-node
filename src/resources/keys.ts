import type { HttpClient } from '../http.js';
import type {
  ApiKey,
  GeneratedKey,
  GenerateKeyParams,
  ApiResponse,
} from '../types.js';

export class KeysResource {
  constructor(private http: HttpClient) {}

  generate(params: GenerateKeyParams): Promise<ApiResponse<GeneratedKey>> {
    return this.http.post('/keys', params);
  }

  /**
   * Listeaza cheile API ale unui utilizator.
   * URL: GET /keys/:userId
   * Nota: Pattern conventional alternativ ar fi GET /users/:userId/keys sau GET /keys?user_id=xxx
   */
  list(userId: string): Promise<ApiResponse<ApiKey[]>> {
    return this.http.get(`/keys/${userId}`);
  }

  revoke(id: number, userId: string): Promise<ApiResponse<{ revoked: boolean }>> {
    return this.http.delete(`/keys/${id}`, { user_id: userId });
  }
}
