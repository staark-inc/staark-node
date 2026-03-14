import type { HttpClient } from '../http.js';
import type {
  Project,
  ListProjectsParams,
  CreateProjectParams,
  UpdateProjectParams,
  ApiResponse,
  PaginatedResponse,
} from '../types.js';

export class ProjectsResource {
  constructor(private http: HttpClient) {}

  list(params: ListProjectsParams): Promise<PaginatedResponse<Project>> {
    return this.http.get('/projects', params as Record<string, string | number | undefined>);
  }

  create(params: CreateProjectParams): Promise<ApiResponse<Project>> {
    return this.http.post('/projects', params);
  }

  get(id: string): Promise<ApiResponse<Project>> {
    return this.http.get(`/projects/${id}`);
  }

  update(id: string, params: UpdateProjectParams): Promise<ApiResponse<Project>> {
    return this.http.patch(`/projects/${id}`, params);
  }

  delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.http.delete(`/projects/${id}`);
  }
}
