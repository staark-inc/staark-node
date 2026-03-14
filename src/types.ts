// ─── Common ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  ok:   boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  ok:   boolean;
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export interface ApiError {
  code:    string;
  message: string;
  field?:  string;
  docs?:   string;
}

export interface StaarkConfig {
  apiKey:   string;
  baseUrl?: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface RegisterParams {
  email:           string;
  password:        string;
  confirmPassword: string;
  firstName:       string;
  lastName:        string;
}

export interface LoginParams {
  email:    string;
  password: string;
}

export interface User {
  id:             string;
  email:          string;
  first_name:     string;
  last_name:      string;
  display_name:   string;
  email_verified: number;
  created_at:     number;
  updated_at:     number;
}

export interface LoginResult {
  ok:           boolean;
  user:         User;
  accessToken:  string;
  refreshToken: string;
}

export interface RefreshResult {
  ok:           boolean;
  accessToken:  string;
  refreshToken: string;
}

// ─── API Keys ──────────────────────────────────────────────────────────────

export type Plan = 'free' | 'pro';

export interface GenerateKeyParams {
  user_id:   string;
  name?:     string;
  plan?:     Plan;
  ttl_days?: number;
}

export interface ApiKey {
  id:         number;
  name:       string;
  key_prefix: string;
  plan:       Plan;
  expires_at: number | null;
  last_used:  number | null;
  revoked:    number;
  created_at: number;
}

export interface GeneratedKey extends ApiKey {
  key: string;
}

// ─── Projects ──────────────────────────────────────────────────────────────

export type ProjectStatus     = 'active' | 'completed' | 'archived';
export type ProjectVisibility = 'private' | 'public';

export interface Project {
  id:           string;
  workspace_id: string;
  name:         string;
  description:  string | null;
  color:        string | null;
  status:       ProjectStatus;
  visibility:   ProjectVisibility;
  task_count:   number;
  created_at:   number;
  updated_at:   number;
}

export interface ListProjectsParams {
  workspace_id: string;
  status?:      ProjectStatus;
  limit?:       number;
  page?:        number;
}

export interface CreateProjectParams {
  workspace_id: string;
  name:         string;
  description?: string;
  color?:       string;
  visibility?:  ProjectVisibility;
}

export interface UpdateProjectParams {
  name?:        string;
  description?: string;
  color?:       string;
  status?:      ProjectStatus;
  visibility?:  ProjectVisibility;
}

// ─── Tasks ─────────────────────────────────────────────────────────────────

export type TaskStatus   = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id:          string;
  project_id:  string;
  title:       string;
  description: string | null;
  status:      TaskStatus;
  priority:    TaskPriority;
  assignee_id: string | null;
  due_date:    string | null;
  tags:        string[];
  created_at:  number;
  updated_at:  number;
}

export interface ListTasksParams {
  status?:      TaskStatus;
  priority?:    TaskPriority;
  assignee_id?: string;
  limit?:       number;
  page?:        number;
}

export interface CreateTaskParams {
  title:        string;
  description?: string;
  priority?:    TaskPriority;
  assignee_id?: string;
  due_date?:    string;
  tags?:        string[];
}

export interface UpdateTaskParams {
  title?:       string;
  description?: string;
  status?:      TaskStatus;
  priority?:    TaskPriority;
  assignee_id?: string;
  due_date?:    string;
  tags?:        string[];
}

// ─── OAuth ─────────────────────────────────────────────────────────────────

export type OAuthProvider = 'github' | 'google' | 'discord' | 'microsoft';

export interface OAuthAuthorizeParams {
  redirect_uri: string;
  scope?: string[];
  state?: string;
}

export interface OAuthAuthorizeResult {
  url: string;
  state: string;
}

export interface ConnectedProvider {
  provider: OAuthProvider;
  provider_user_id: string;
  email: string | null;
  connected_at: number;
}

export interface OAuthSetupCard {
  provider: OAuthProvider;
  task_id: string;
  title: string;
  created: boolean;
}

// ─── Custom Auth ────────────────────────────────────────────────────────────

export interface CustomAuthMethod {
  id: string;
  name: string;
  handler_url: string;
  active: boolean;
  created_at: number;
}

export interface RegisterCustomMethodParams {
  name: string;
  handler_url: string;
}

// ─── Status ────────────────────────────────────────────────────────────────

export interface ServiceStatus {
  name:      string;
  status:    'Operational' | 'Degraded' | 'Down';
  latencyMs: number;
}

export interface StatusResult {
  ok:          boolean;
  generatedAt: string;
  services:    ServiceStatus[];
}

export interface StatusHistoryResult {
  ok:      boolean;
  days:    number;
  history: Array<{
    service_name:    string;
    day:             string;
    total_checks:    number;
    ok_checks:       number;
    uptime_percent:  number;
  }>;
}
