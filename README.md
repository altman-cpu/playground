# Nexus Engine Core

A standalone, client-first operations dashboard inspired by database deployment and model registry workflows. It is a **demo**, not Bytebase or ModelScope: it does not deploy anything, run models, connect to a backend, or provide an API proxy.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. No build step or dependencies are required. A direct file URL can display the dashboard, but service workers require HTTPS or localhost. The dashboard uses system font fallbacks and makes no third-party requests.

## What's included

- Overview, deployment search, sample model registry, and activity views.
- Create local deployment records, export workspace data as JSON, clear activity, and reset sample data in Privacy settings. Records do not represent real infrastructure.
- The persistent profile saves records in localStorage and refreshes other open tabs on the same origin. The session-only profile stores records in sessionStorage for the current tab and removes the persistent copy; other tabs have separate session data. The profile choice itself is stored in localStorage. There is no conflict resolution or cross-device sync.
- On a supported secure origin, `sw.js` precaches only the application shell and serves it offline after a successful initial load. It does not proxy or cache API requests. Bump the cache name when changing shell assets; old Nexus shell caches are removed on activation.

## Privacy and security

Workspace records remain in this browser's localStorage or sessionStorage, depending on the selected profile, unless you export them. They are **not encrypted**, can be accessed by scripts running on the same origin, and may be cleared by browser settings. Do not enter credentials, sensitive information, or production data. The browser's online indicator is only a network hint, not a backend health check. A production system requires a real backend, authentication, authorization, secure storage, and a threat-reviewed proxy; none are provided here.

The original experiments remain in their respective subdirectories, including `poems/junkyard-gate`.
