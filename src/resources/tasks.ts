import type { HttpClient } from '../http.js';
import type {
  Task,
  ListTasksParams,
  CreateTaskParams,
  UpdateTaskParams,
  ApiResponse,
  PaginatedResponse,
} from '../types.js';

export class TasksResource {
  constructor(private http: HttpClient) {}

  list(projectId: string, params?: ListTasksParams): Promise<PaginatedResponse<Task>> {
    return this.http.get(`/projects/${projectId}/tasks`, params as Record<string, string | number | undefined>);
  }

  create(projectId: string, params: CreateTaskParams): Promise<ApiResponse<Task>> {
    return this.http.post(`/projects/${projectId}/tasks`, params);
  }

  get(id: string): Promise<ApiResponse<Task>> {
    return this.http.get(`/tasks/${id}`);
  }

  update(id: string, params: UpdateTaskParams): Promise<ApiResponse<Task>> {
    return this.http.patch(`/tasks/${id}`, params);
  }

  delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.http.delete(`/tasks/${id}`);
  }
}
