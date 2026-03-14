import type { HttpClient } from '../http.js';
import type {
  RegisterParams,
  LoginParams,
  LoginResult,
  RefreshResult,
  ApiResponse,
} from '../types.js';

export class AuthResource {
  constructor(private http: HttpClient) {}

  /** Inregistrare cont nou — public, fara API key */
  register(params: RegisterParams): Promise<ApiResponse<{ user: object; verifyToken?: string }>> {
    return this.http.postPublic('/auth/register', params);
  }

  /** Login — public, fara API key */
  login(params: LoginParams): Promise<LoginResult> {
    return this.http.postPublic('/auth/login', params);
  }

  /**
   * Logout — necesita Bearer token (access token al utilizatorului, nu API key)
   * @param accessToken  Token-ul de acces primit la login
   * @param refreshToken Token-ul de refresh care va fi invalidat
   */
  logout(accessToken: string, refreshToken: string): Promise<ApiResponse<{ ok: boolean }>> {
    return this.http.postWithToken('/auth/logout', { refreshToken }, accessToken);
  }

  /**
   * Refresh access token — necesita Bearer token (access token al utilizatorului)
   * @param accessToken  Token-ul de acces (poate fi expirat)
   * @param refreshToken Token-ul de refresh
   */
  refresh(accessToken: string, refreshToken: string): Promise<RefreshResult> {
    return this.http.postWithToken('/auth/refresh', { refreshToken }, accessToken);
  }

  /** Verificare email — public, fara API key */
  verifyEmail(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    return this.http.postPublic('/auth/verify-email', { token });
  }

  /** Forgot password — public, fara API key */
  forgotPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    return this.http.postPublic('/auth/forgot-password', { email });
  }

  /** Reset password — public, fara API key */
  resetPassword(token: string, password: string, confirmPassword: string): Promise<ApiResponse<{ reset: boolean }>> {
    return this.http.postPublic('/auth/reset-password', { token, password, confirmPassword });
  }
}
