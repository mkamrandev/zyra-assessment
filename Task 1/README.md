# Counselor Student Action Center

A mini full-stack feature that lets a counselor quickly review a student's tasks, messages, and urgency level.

## Stack

- **Frontend:** React 18, TypeScript, Vite, TanStack React Query, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, tsx (dev)

---

## Setup & Run

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:5173`

Vite proxies `/students` and `/tasks` to the backend, so no CORS issues in dev.

---

## API Contract

### `GET /students/:id/action-center`

Returns a combined view for a single student.

**Response `200`**
```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [ ...Task[] ],
  "messages": [ ...Message[] ],
  "unreadCount": 2,
  "urgentTaskCount": 2
}
```

**Error `404`**
```json
{ "error": "Student not found" }
```

---

### `PATCH /tasks/:taskId/status`

Updates the status of a single task.

**Request body**
```json
{ "status": "in_progress" }
```

Valid values: `"todo"` | `"in_progress"` | `"completed"`

**Response `200`** — returns the full updated task object.

**Error `400`**
```json
{ "error": "Invalid status. Must be one of: todo, in_progress, completed" }
```

**Error `404`**
```json
{ "error": "Task not found" }
```

---

## Architecture Note

The project is split into two independent packages under a single repo.

### Backend (`/backend`)

Express app with two route files:

- `routes/students.ts` — handles `GET /students/:id/action-center`. Looks up the student, filters tasks and messages by `studentId`, computes `unreadCount` and `urgentTaskCount` server-side so the frontend doesn't have to.
- `routes/tasks.ts` — handles `PATCH /tasks/:taskId/status`. Validates the incoming status against the allowed enum before writing, returns the updated task.

All data lives in `data/mockData.ts`. The `tasks` array is exported as `let` so the PATCH route can mutate it in-memory (no database for this exercise — swap in Mongoose calls in the same spot for production).

### Frontend (`/frontend`)

Single-page app built around three concerns:

- **Data fetching** — `useQuery` from TanStack React Query fetches the action-center endpoint once per student. The query key is `["action-center", studentId]`, so switching students triggers a fresh fetch and the old data stays cached.
- **Mutations** — `useMutation` calls `PATCH /tasks/:taskId/status`, then does an optimistic-style cache update via `queryClient.setQueryData` so the UI reflects the new status instantly without a full refetch.
- **UI** — Components are kept small and single-purpose: `StudentProfile`, `TaskList`, `TaskItem` (inline in TaskList), `MessageList`, `PriorityBadge`, `StatusSelect`. Loading state uses skeleton placeholders; error state shows the server error message.

Tasks are sorted by priority (urgent → low) then by status (todo → completed) before rendering, so the most pressing items always appear at the top.
