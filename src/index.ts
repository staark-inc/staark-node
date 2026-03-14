import { HttpClient, StaarkError } from './http.js';
import { AuthResource }     from './resources/auth.js';
import { ProjectsResource } from './resources/projects.js';
import { TasksResource }    from './resources/tasks.js';
import { KeysResource }     from './resources/keys.js';
import { StatusResource }   from './resources/status.js';
import type { StaarkConfig } from './types.js';

export { StaarkError };
export * from './types.js';

const DEFAULT_BASE_URL = 'https://api.staark-app.cloud/v1';

export class Staark {
  readonly auth:     AuthResource;
  readonly projects: ProjectsResource;
  readonly tasks:    TasksResource;
  readonly keys:     KeysResource;
  readonly status:   StatusResource;

  constructor(config: StaarkConfig) {
    if (!config.apiKey) {
      throw new Error('Staark: apiKey is required');
    }

    const http = new HttpClient(
      config.baseUrl ?? DEFAULT_BASE_URL,
      config.apiKey,
    );

    this.auth     = new AuthResource(http);
    this.projects = new ProjectsResource(http);
    this.tasks    = new TasksResource(http);
    this.keys     = new KeysResource(http);
    this.status   = new StatusResource(http);
  }
}

export default Staark;
