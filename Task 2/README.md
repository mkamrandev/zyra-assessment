# Counselor Student Action Center — Task 2: Production Hardening

This builds on Task 1 by adding request logging, structured error handling, and a full test suite.

## Stack

- **Frontend:** React 18, TypeScript, Vite, TanStack React Query, Tailwind CSS, Vitest, Testing Library
- **Backend:** Node.js, Express, TypeScript, Morgan, Vitest, Supertest

---

## Setup & Run

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Backend

```bash
cd backend
npm install
npm run dev       # dev server on http://localhost:3001
npm test          # run integration tests
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # dev server on http://localhost:5173
npm test          # run component tests
```

---

## What's New in Task 2

### Request Logging

Every request is logged via `morgan` with a custom token that includes the request ID:

```
59c16a60 GET /students/stu_001/action-center 200 2272 bytes - 2.789 ms
```

Format: `<request-id> <method> <url> <status> <bytes> - <response-time>`

This makes it straightforward to grep logs for a specific request across the full lifecycle.

### Request IDs (`X-Request-Id`)

A `attachRequestId` middleware runs before all routes. It either reads the `X-Request-Id` header from the caller (useful when a frontend or upstream service sends one) or generates a UUID v4 via `crypto.randomUUID`. The ID is:

- Attached to the request object so downstream middleware can read it
- Echoed back in the `X-Request-Id` response header
- Included in every error response body so clients can report it for support

### Error Middleware

A central `errorHandler` is registered after all routes. It:

- Reads the request ID from the request headers
- Returns a consistent `{ error, requestId }` JSON shape for all failures
- Logs the full stack trace server-side only for 5xx errors (4xx errors are expected, not noise)
- Hides internal details from the client on 500s (returns "Internal server error")

---

## Tests

### Backend Integration Tests (`backend/src/tests/actionCenter.test.ts`)

Uses **Supertest** to fire real HTTP requests against the Express app (no mocking).

| Test | What it covers |
|---|---|
| GET returns student + tasks + messages | Happy path, data shape |
| Tasks filtered to correct student | Data isolation |
| `unreadCount` computed correctly | Derived field accuracy |
| `urgentTaskCount` excludes completed tasks | Business logic edge case |
| 404 for unknown student | Error handling |
| `X-Request-Id` header present on response | Middleware wiring |
| Caller-supplied request ID is echoed back | Header passthrough |
| PATCH updates status + `updatedAt` | Mutation happy path |
| PATCH 400 on invalid status string | Input validation |
| PATCH 400 when body is empty | Missing field validation |
| PATCH 404 for unknown task | Not found handling |

Run: `npm test` inside `/backend`

### Frontend Component Tests (`frontend/src/tests/`)

Uses **Vitest + Testing Library** with jsdom.

**PriorityBadge** — renders correct label for all four priority levels; applies red styles for urgent, not for low.

**StatusSelect** — reflects current value; calls `onChange` with new value on selection; disables correctly; renders all three options.

**StudentProfile** — renders name, email, grade, GPA; shows correct enrollment badge; displays unread and urgent counts; renders initials avatar.

Run: `npm test` inside `/frontend`

---

## Performance Decisions & Tradeoffs

### Server-side derived fields (`unreadCount`, `urgentTaskCount`)

These are computed on the backend rather than sent as raw arrays for the client to count. The tradeoff is a small amount of server CPU per request, but it means the API surface is stable — if the counting logic changes (e.g. "urgent" definition expands), the frontend doesn't need to update.

For the current data size this is negligible. At scale you'd materialise these counts in the database and update them on write, rather than computing them on read.

### TanStack Query caching

The frontend uses a `staleTime` of 30 seconds. A counselor switching between students repeatedly won't hammer the backend — cached data is served immediately and re-fetched in the background only after 30 seconds. The tradeoff is brief staleness, acceptable here since task statuses change on explicit user action (which invalidates the cache via `setQueryData`).

### Optimistic-style cache update on PATCH

When a task status is changed, `queryClient.setQueryData` updates the local cache immediately instead of waiting for a background refetch. The UI responds instantly. If the PATCH fails, the error is shown inline and the next query refetch corrects the state. This is a deliberate UX choice over a full refetch, which would cause a visible flicker on every status change.

### In-memory mock data

Task state is held in a module-level `let tasks` array. This is fine for the assessment but has an obvious limitation: restarts reset state, and it's not safe under concurrent writes at scale. The replacement path is straightforward — swap the array lookups in `routes/students.ts` and `routes/tasks.ts` for MongoDB queries using the same IDs.

### Morgan logging overhead

Morgan adds a small per-request overhead (a few microseconds) to format and write the log line. In production you'd pipe this to a structured logger (e.g. Winston with JSON output) and ship logs to a log aggregation service. The current setup writes to stdout, which is suitable for containerised deployments where the platform captures stdout.
