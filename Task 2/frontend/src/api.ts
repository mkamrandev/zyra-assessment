import type { ActionCenterData, Task, TaskStatus } from "./types";

const BASE_URL = "/students";
const TASKS_URL = "/tasks";

export async function fetchActionCenter(studentId: string): Promise<ActionCenterData> {
    const res = await fetch(`${BASE_URL}/${studentId}/action-center`);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to load student data (${res.status})`);
    }
    return res.json();
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const res = await fetch(`${TASKS_URL}/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to update task (${res.status})`);
    }
    return res.json();
}
