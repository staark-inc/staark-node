// src/http.ts
var StaarkError = class extends Error {
  constructor(error, status) {
    super(error.message);
    this.name = "StaarkError";
    this.code = error.code;
    this.status = status;
    this.field = error.field;
  }
};
var HttpClient = class {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }
  /** Headers pentru endpoint-uri protejate (projects, tasks, keys) */
  headers(extra) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`,
      ...extra
    };
  }
  /** Headers pentru endpoint-uri publice (auth) — fără Authorization */
  publicHeaders(extra) {
    return {
      "Content-Type": "application/json",
      ...extra
    };
  }
  async get(path, query) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== void 0) url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url.toString(), { headers: this.headers() });
    return this.parse(res);
  }
  async post(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.headers(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  /** POST cu Authorization: Bearer <token> suprascris — pentru logout/refresh */
  async postWithToken(path, body, token) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: token ? this.headers({ Authorization: `Bearer ${token}` }) : this.headers(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  async postPublic(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.publicHeaders(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  async patch(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: this.headers(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  async put(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.headers(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  async delete(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: this.headers(),
      body: body ? JSON.stringify(body) : void 0
    });
    return this.parse(res);
  }
  async parse(res) {
    let data;
    try {
      data = await res.json();
    } catch {
      throw new StaarkError(
        { code: "PARSE_ERROR", message: `Server returned non-JSON response (HTTP ${res.status})` },
        res.status
      );
    }
    if (!res.ok) {
      const err = data.error ?? { code: "UNKNOWN_ERROR", message: "Unknown error" };
      throw new StaarkError(err, res.status);
    }
    return data;
  }
};

// src/resources/auth.ts
var AuthResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Inregistrare cont nou — public, fara API key */
  register(params) {
    return this.http.postPublic("/auth/register", params);
  }
  /** Login — public, fara API key */
  login(params) {
    return this.http.postPublic("/auth/login", params);
  }
  /**
   * Logout — necesita Bearer token (access token al utilizatorului, nu API key)
   * @param accessToken  Token-ul de acces primit la login
   * @param refreshToken Token-ul de refresh care va fi invalidat
   */
  logout(accessToken, refreshToken) {
    return this.http.postWithToken("/auth/logout", { refreshToken }, accessToken);
  }
  /**
   * Refresh access token — necesita Bearer token (access token al utilizatorului)
   * @param accessToken  Token-ul de acces (poate fi expirat)
   * @param refreshToken Token-ul de refresh
   */
  refresh(accessToken, refreshToken) {
    return this.http.postWithToken("/auth/refresh", { refreshToken }, accessToken);
  }
  /** Verificare email — public, fara API key */
  verifyEmail(token) {
    return this.http.postPublic("/auth/verify-email", { token });
  }
  /** Forgot password — public, fara API key */
  forgotPassword(email) {
    return this.http.postPublic("/auth/forgot-password", { email });
  }
  /** Reset password — public, fara API key */
  resetPassword(token, password, confirmPassword) {
    return this.http.postPublic("/auth/reset-password", { token, password, confirmPassword });
  }
};

// src/resources/projects.ts
var ProjectsResource = class {
  constructor(http) {
    this.http = http;
  }
  list(params) {
    return this.http.get("/projects", params);
  }
  create(params) {
    return this.http.post("/projects", params);
  }
  get(id) {
    return this.http.get(`/projects/${id}`);
  }
  update(id, params) {
    return this.http.patch(`/projects/${id}`, params);
  }
  delete(id) {
    return this.http.delete(`/projects/${id}`);
  }
};

// src/resources/tasks.ts
var TasksResource = class {
  constructor(http) {
    this.http = http;
  }
  list(projectId, params) {
    return this.http.get(`/projects/${projectId}/tasks`, params);
  }
  create(projectId, params) {
    return this.http.post(`/projects/${projectId}/tasks`, params);
  }
  get(id) {
    return this.http.get(`/tasks/${id}`);
  }
  update(id, params) {
    return this.http.patch(`/tasks/${id}`, params);
  }
  delete(id) {
    return this.http.delete(`/tasks/${id}`);
  }
};

// src/resources/keys.ts
var KeysResource = class {
  constructor(http) {
    this.http = http;
  }
  generate(params) {
    return this.http.post("/keys", params);
  }
  /**
   * Listeaza cheile API ale unui utilizator.
   * URL: GET /keys/:userId
   * Nota: Pattern conventional alternativ ar fi GET /users/:userId/keys sau GET /keys?user_id=xxx
   */
  list(userId) {
    return this.http.get(`/keys/${userId}`);
  }
  revoke(id, userId) {
    return this.http.delete(`/keys/${id}`, { user_id: userId });
  }
};

// src/resources/status.ts
var StatusResource = class {
  constructor(http) {
    this.http = http;
  }
  get() {
    return this.http.get("/status");
  }
  history(days = 90) {
    return this.http.get("/status/history", { days });
  }
};

// src/index.ts
var DEFAULT_BASE_URL = "https://api.staark-app.cloud/v1";
var Staark = class {
  constructor(config) {
    if (!config.apiKey) {
      throw new Error("Staark: apiKey is required");
    }
    const http = new HttpClient(
      config.baseUrl ?? DEFAULT_BASE_URL,
      config.apiKey
    );
    this.auth = new AuthResource(http);
    this.projects = new ProjectsResource(http);
    this.tasks = new TasksResource(http);
    this.keys = new KeysResource(http);
    this.status = new StatusResource(http);
  }
};
var index_default = Staark;
export {
  Staark,
  StaarkError,
  index_default as default
};
