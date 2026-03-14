declare class StaarkError extends Error {
    code: string;
    status: number;
    field?: string;
    constructor(error: {
        code: string;
        message: string;
        field?: string;
    }, status: number);
}
declare class HttpClient {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    /** Headers pentru endpoint-uri protejate (projects, tasks, keys) */
    private headers;
    /** Headers pentru endpoint-uri publice (auth) — fără Authorization */
    private publicHeaders;
    get<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    postPublic<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string, body?: unknown): Promise<T>;
    private parse;
}

interface ApiResponse<T> {
    ok: boolean;
    data: T;
}
interface PaginatedResponse<T> {
    ok: boolean;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}
interface ApiError {
    code: string;
    message: string;
    field?: string;
    docs?: string;
}
interface StaarkConfig {
    apiKey: string;
    baseUrl?: string;
}
interface RegisterParams {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}
interface LoginParams {
    email: string;
    password: string;
}
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    email_verified: number;
    created_at: number;
    updated_at: number;
}
interface LoginResult {
    ok: boolean;
    user: User;
    accessToken: string;
    refreshToken: string;
}
interface RefreshResult {
    ok: boolean;
    accessToken: string;
    refreshToken: string;
}
type Plan = 'free' | 'pro';
interface GenerateKeyParams {
    user_id: string;
    name?: string;
    plan?: Plan;
    ttl_days?: number;
}
interface ApiKey {
    id: number;
    name: string;
    key_prefix: string;
    plan: Plan;
    expires_at: number | null;
    last_used: number | null;
    revoked: number;
    created_at: number;
}
interface GeneratedKey extends ApiKey {
    key: string;
}
type ProjectStatus = 'active' | 'completed' | 'archived';
type ProjectVisibility = 'private' | 'public';
interface Project {
    id: string;
    workspace_id: string;
    name: string;
    description: string | null;
    color: string | null;
    status: ProjectStatus;
    visibility: ProjectVisibility;
    task_count: number;
    created_at: number;
    updated_at: number;
}
interface ListProjectsParams {
    workspace_id: string;
    status?: ProjectStatus;
    limit?: number;
    page?: number;
}
interface CreateProjectParams {
    workspace_id: string;
    name: string;
    description?: string;
    color?: string;
    visibility?: ProjectVisibility;
}
interface UpdateProjectParams {
    name?: string;
    description?: string;
    color?: string;
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
}
type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
interface Task {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assignee_id: string | null;
    due_date: string | null;
    tags: string[];
    created_at: number;
    updated_at: number;
}
interface ListTasksParams {
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee_id?: string;
    limit?: number;
    page?: number;
}
interface CreateTaskParams {
    title: string;
    description?: string;
    priority?: TaskPriority;
    assignee_id?: string;
    due_date?: string;
    tags?: string[];
}
interface UpdateTaskParams {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee_id?: string;
    due_date?: string;
    tags?: string[];
}
interface ServiceStatus {
    name: string;
    status: 'Operational' | 'Degraded' | 'Down';
    latencyMs: number;
}
interface StatusResult {
    ok: boolean;
    generatedAt: string;
    services: ServiceStatus[];
}
interface StatusHistoryResult {
    ok: boolean;
    days: number;
    history: Array<{
        service_name: string;
        day: string;
        total_checks: number;
        ok_checks: number;
        uptime_percent: number;
    }>;
}

declare class AuthResource {
    private http;
    constructor(http: HttpClient);
    /** Înregistrare cont nou — public, fără API key */
    register(params: RegisterParams): Promise<ApiResponse<{
        user: object;
        verifyToken?: string;
    }>>;
    /** Login — public, fără API key */
    login(params: LoginParams): Promise<LoginResult>;
    /** Logout — necesită Bearer token (access token) */
    logout(refreshToken: string): Promise<ApiResponse<{
        ok: boolean;
    }>>;
    /** Refresh access token — necesită Bearer token */
    refresh(refreshToken: string): Promise<RefreshResult>;
    /** Verificare email — public, fără API key */
    verifyEmail(token: string): Promise<ApiResponse<{
        verified: boolean;
    }>>;
    /** Forgot password — public, fără API key */
    forgotPassword(email: string): Promise<ApiResponse<{
        sent: boolean;
    }>>;
    /** Reset password — public, fără API key */
    resetPassword(token: string, password: string, confirmPassword: string): Promise<ApiResponse<{
        reset: boolean;
    }>>;
}

declare class ProjectsResource {
    private http;
    constructor(http: HttpClient);
    list(params: ListProjectsParams): Promise<PaginatedResponse<Project>>;
    create(params: CreateProjectParams): Promise<ApiResponse<Project>>;
    get(id: string): Promise<ApiResponse<Project>>;
    update(id: string, params: UpdateProjectParams): Promise<ApiResponse<Project>>;
    delete(id: string): Promise<ApiResponse<{
        deleted: boolean;
    }>>;
}

declare class TasksResource {
    private http;
    constructor(http: HttpClient);
    list(projectId: string, params?: ListTasksParams): Promise<PaginatedResponse<Task>>;
    create(projectId: string, params: CreateTaskParams): Promise<ApiResponse<Task>>;
    get(id: string): Promise<ApiResponse<Task>>;
    update(id: string, params: UpdateTaskParams): Promise<ApiResponse<Task>>;
    delete(id: string): Promise<ApiResponse<{
        deleted: boolean;
    }>>;
}

declare class KeysResource {
    private http;
    constructor(http: HttpClient);
    generate(params: GenerateKeyParams): Promise<ApiResponse<GeneratedKey>>;
    list(userId: string): Promise<ApiResponse<ApiKey[]>>;
    revoke(id: number, userId: string): Promise<ApiResponse<{
        revoked: boolean;
    }>>;
}

declare class StatusResource {
    private http;
    constructor(http: HttpClient);
    get(): Promise<StatusResult>;
    history(days?: number): Promise<StatusHistoryResult>;
}

declare class Staark {
    readonly auth: AuthResource;
    readonly projects: ProjectsResource;
    readonly tasks: TasksResource;
    readonly keys: KeysResource;
    readonly status: StatusResource;
    constructor(config: StaarkConfig);
}

export { type ApiError, type ApiKey, type ApiResponse, type CreateProjectParams, type CreateTaskParams, type GenerateKeyParams, type GeneratedKey, type ListProjectsParams, type ListTasksParams, type LoginParams, type LoginResult, type PaginatedResponse, type Plan, type Project, type ProjectStatus, type ProjectVisibility, type RefreshResult, type RegisterParams, type ServiceStatus, Staark, type StaarkConfig, StaarkError, type StatusHistoryResult, type StatusResult, type Task, type TaskPriority, type TaskStatus, type UpdateProjectParams, type UpdateTaskParams, type User, Staark as default };
