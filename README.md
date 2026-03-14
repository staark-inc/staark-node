# @staark-inc/node

Official Node.js SDK for the [Staark API](https://api.staark-app.cloud).

## Installation

```bash
npm install @staark-inc/node
```

## Setup

```typescript
import Staark from '@staark-inc/node';

const staark = new Staark({
  apiKey: process.env.STAARK_API_KEY,
});
```

Add your API key in a `.env` file:

```bash
STAARK_API_KEY=sk_live_staark_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Usage

### Auth

```typescript
// Register
const { data } = await staark.auth.register({
  email:           'ion@example.com',
  password:        'parola123',
  confirmPassword: 'parola123',
  firstName:       'Ion',
  lastName:        'Popescu',
});

// Login
const { accessToken, refreshToken } = await staark.auth.login({
  email:    'ion@example.com',
  password: 'parola123',
});

// Refresh tokens
const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
  await staark.auth.refresh(accessToken, refreshToken);

// Logout
await staark.auth.logout(accessToken, refreshToken);

// Verify email
await staark.auth.verifyEmail(token);

// Forgot password
await staark.auth.forgotPassword('ion@example.com');

// Reset password
await staark.auth.resetPassword(token, 'newParola123', 'newParola123');
```

### Projects

```typescript
// List
const { data, meta } = await staark.projects.list({
  workspace_id: 'ws_001',
  status:       'active',
  limit:        20,
  page:         1,
});

// Create
const { data: project } = await staark.projects.create({
  workspace_id: 'ws_001',
  name:         'Q2 Launch',
  visibility:   'private',
});

// Get
const { data: project } = await staark.projects.get('proj_abc123');

// Update (PATCH — partial update)
await staark.projects.update('proj_abc123', { status: 'completed' });

// Delete
await staark.projects.delete('proj_abc123');
```

### Tasks

```typescript
// List tasks in a project
const { data: tasks, meta } = await staark.tasks.list('proj_abc123', {
  priority: 'high',
  status:   'in_progress',
  limit:    10,
  page:     1,
});

// Create
const { data: task } = await staark.tasks.create('proj_abc123', {
  title:    'Design onboarding flow',
  priority: 'high',
  tags:     ['design', 'ux'],
});

// Get
const { data: task } = await staark.tasks.get('task_xyz');

// Update (PATCH — partial update)
await staark.tasks.update('task_xyz', { status: 'done' });

// Delete
await staark.tasks.delete('task_xyz');
```

### API Keys

```typescript
// Generate
const { data } = await staark.keys.generate({
  user_id:  'usr_123',
  name:     'Production Key',
  plan:     'pro',
  ttl_days: 90,
});
console.log(data.key); // shown once only

// List
const { data: keys } = await staark.keys.list('usr_123');

// Revoke
await staark.keys.revoke(keyId, 'usr_123');
```

### Status

```typescript
// Current status
const status = await staark.status.get();
console.log(status.services); // ServiceStatus[]

// Uptime history (default: last 90 days)
const history = await staark.status.history(30); // last 30 days
```

---

## Error Handling

All errors thrown by the SDK are instances of `StaarkError`:

```typescript
import Staark, { StaarkError } from '@staark-inc/node';

try {
  await staark.projects.get('proj_nonexistent');
} catch (err) {
  if (err instanceof StaarkError) {
    console.log(err.code);    // e.g. 'NOT_FOUND', 'UNAUTHORIZED', 'PARSE_ERROR'
    console.log(err.status);  // HTTP status code, e.g. 404
    console.log(err.message); // Human-readable message
    console.log(err.field);   // Field name for validation errors (optional)
  }
}
```

| `code`        | `status` | Description                                      |
|---------------|----------|--------------------------------------------------|
| `NOT_FOUND`   | 404      | Resource not found                               |
| `UNAUTHORIZED`| 401      | Invalid or missing API key                       |
| `FORBIDDEN`   | 403      | Insufficient permissions                         |
| `PARSE_ERROR` | any      | Server returned a non-JSON response (e.g. 502)   |

---

## TypeScript

The SDK is written in TypeScript and exports all types:

```typescript
import type {
  Project, ProjectStatus, ProjectVisibility,
  Task, TaskStatus, TaskPriority,
  ApiKey, Plan,
  User, LoginResult, RefreshResult,
  ApiResponse, PaginatedResponse,
  StaarkConfig,
} from '@staark-inc/node';
```

---

## Development

```bash
# Install dependencies
npm install

# Build (CJS + ESM + types)
npm run build

# Watch mode
npm run dev

# Type check
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## License

MIT
