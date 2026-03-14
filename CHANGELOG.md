# Changelog

All notable changes to `@staark/node` will be documented here.

## [2.0.0] — 2026-03-14

### Breaking Changes

- **`auth.logout(accessToken, refreshToken)`** — adaugat parametrul `accessToken` (primul argument). Anterior metoda folosea API key-ul SDK ca Bearer token, ceea ce era incorect. Acum foloseste access token-ul utilizatorului.
- **`auth.refresh(accessToken, refreshToken)`** — acelasi comportament ca `logout`: adaugat `accessToken` ca prim argument.
- **`projects.update()` si `tasks.update()`** — schimbat de la `PUT` la `PATCH` pentru update partial.

### New Features

- **`HttpClient.patch()`** — metoda noua pentru request-uri `PATCH`.
- **`HttpClient.postWithToken(path, body, token)`** — permite suprascrierea header-ului `Authorization` cu un token custom (util pentru operatii autentificate cu token user, nu API key).

### Bug Fixes

- **`HttpClient.parse()`** — acum gestioneaza corect raspunsurile non-JSON (ex: HTML 502 de la nginx/proxy). Anterior arunca un `SyntaxError` brut; acum arunca `StaarkError` cu `code: 'PARSE_ERROR'` si statusul HTTP corect.

### Improvements

- Codul sursa TypeScript (`src/`) este acum inclus in repository.
- Adaugat suite completa de teste cu `vitest`.
- Adaugat JSDoc pe `KeysResource.list()` pentru a documenta pattern-ul URL folosit.
