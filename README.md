# @staark/node

Official Node.js SDK for the [Staark API](https://api.staark-app.cloud).

## Installation

```bash
npm install @staark-dev/staark-node
```

## Setup

```typescript
import Staark from '@staark-dev/staark-node';

const staark = new Staark.default({
  apiKey: process.env.STAARK_API_KEY!,
});
```

Or with a `.env` file:
```bash
STAARK_API_KEY=sk_live_staark_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Usage

### Auth

```typescript
// Register
const { data: user } = await staark.auth.register({
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
const { accessToken: newToken } = await staark.auth.refresh(refreshToken);

// Logout
await staark.auth.logout(refreshToken);

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

// Update
await staark.projects.update('proj_abc123', { status: 'completed' });

// Delete
await staark.projects.delete('proj_abc123');
```

### Tasks

```typescript
// List tasks in a project
const { data: tasks } = await staark.tasks.list('proj_abc123', {
  priority: 'high',
  status:   'in_progress',
});

// Create
const { data: task } = await staark.tasks.create('proj_abc123', {
  title:    'Design onboarding flow',
  priority: 'high',
  tags:     ['design', 'ux'],
});

// Update
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
const status = await staark.status.get();
console.log(status.services); // array of ServiceStatus

const history = await staark.status.history(30); // last 30 days
```

---

## Error handling

```typescript
import Staark, { StaarkError } from '@staark/node';

try {
  await staark.projects.get('proj_nonexistent');
} catch (err) {
  if (err instanceof StaarkError) {
    console.log(err.code);    // 'NOT_FOUND'
    console.log(err.status);  // 404
    console.log(err.message); // 'Project not found'
  }
}
```
