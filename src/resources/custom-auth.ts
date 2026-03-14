import type { HttpClient } from '../http.js';
import type { ApiResponse, CustomAuthMethod, LoginResult, RegisterCustomMethodParams } from '../types.js';

export class CustomAuthResource {
  constructor(private http: HttpClient) {}

  /** Inregistreaza o metoda de autentificare custom */
  register(accessToken: string, params: RegisterCustomMethodParams): Promise<ApiResponse<CustomAuthMethod>> {
    return this.http.postWithToken('/auth/custom/methods', params, accessToken);
  }

  /**
   * Login cu o metoda custom — public, fara API key.
   * @param methodId  ID-ul metodei custom (ex: 'magic-link', 'sso-company')
   * @param payload   Date specifice metodei (ex: { email }, { token }, etc.)
   */
  login(methodId: string, payload: Record<string, unknown>): Promise<LoginResult> {
    return this.http.postPublic(`/auth/custom/${methodId}/login`, payload);
  }

  /** Listeaza metodele custom inregistrate */
  list(accessToken: string): Promise<ApiResponse<CustomAuthMethod[]>> {
    return this.http.getWithToken('/auth/custom/methods', accessToken);
  }

  /** Sterge o metoda custom */
  delete(accessToken: string, methodId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.http.postWithToken(`/auth/custom/methods/${methodId}/delete`, undefined, accessToken);
  }
}
