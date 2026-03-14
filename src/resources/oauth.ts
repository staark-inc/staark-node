import type { HttpClient } from '../http.js';
import type {
  ApiResponse,
  ConnectedProvider,
  LoginResult,
  OAuthAuthorizeParams,
  OAuthAuthorizeResult,
  OAuthProvider,
  OAuthSetupCard,
} from '../types.js';

export class OAuthResource {
  constructor(private http: HttpClient) {}

  /** Obtine URL-ul de redirect catre provider — public, fara API key */
  authorize(provider: OAuthProvider, params: OAuthAuthorizeParams): Promise<ApiResponse<OAuthAuthorizeResult>> {
    return this.http.postPublic(`/auth/oauth/${provider}/authorize`, params);
  }

  /** Schimba codul OAuth cu tokens Staark — public, fara API key */
  callback(provider: OAuthProvider, code: string, state?: string): Promise<LoginResult> {
    return this.http.postPublic(`/auth/oauth/${provider}/callback`, { code, state });
  }

  /** Listeaza providerii OAuth conectati la contul utilizatorului */
  connected(accessToken: string): Promise<ApiResponse<ConnectedProvider[]>> {
    return this.http.getWithToken('/auth/oauth/connected', accessToken);
  }

  /** Deconecteaza un provider OAuth de la contul utilizatorului */
  disconnect(accessToken: string, provider: OAuthProvider): Promise<ApiResponse<{ disconnected: boolean }>> {
    return this.http.postWithToken(`/auth/oauth/${provider}/disconnect`, undefined, accessToken);
  }

  /**
   * Creeaza automat carduri (task-uri) intr-un proiect pentru configurarea login-ului social.
   * Genereaza un task pentru fiecare provider specificat (ex: "Setup GitHub OAuth").
   */
  setupProjectCards(accessToken: string, projectId: string, providers: OAuthProvider[]): Promise<ApiResponse<OAuthSetupCard[]>> {
    return this.http.postWithToken(`/projects/${projectId}/oauth-cards`, { providers }, accessToken);
  }
}
