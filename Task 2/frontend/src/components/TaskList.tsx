import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api";
import type { Task, TaskStatus } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { StatusSelect } from "./StatusSelect";

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(dateStr: string, status: TaskStatus) {
    if (status === "completed") return false;
    return new Date(dateStr) < new Date();
}

interface Props {
    tasks: Task[];
    studentId: string;
}

export function TaskList({ tasks, studentId }: Props) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
            updateTaskStatus(taskId, status),
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(["action-center", studentId], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    tasks: old.tasks.map((t: Task) =>
                        t.id === updatedTask.id ? updatedTask : t
                    ),
                    urgentTaskCount: old.tasks
                        .map((t: Task) => (t.id === updatedTask.id ? updatedTask : t))
                        .filter((t: Task) => t.priority === "urgent" && t.status !== "completed")
                        .length,
                };
            });
        },
    });

    const sorted = [...tasks].sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const statusOrder = { todo: 0, in_progress: 1, completed: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return statusOrder[a.status] - statusOrder[b.status];
    });

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Tasks</h3>
                <p className="text-sm text-gray-500">No tasks assigned.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Tasks</h3>
                <span className="text-xs text-gray-400">{tasks.length} total</span>
            </div>
            <ul className="space-y-3">
                {sorted.map((task) => {
                    const overdue = isOverdue(task.dueDate, task.status);
                    const isPending = mutation.isPending && mutation.variables?.taskId === task.id;
                    return (
                        <li
                            key={task.id}
                            className={`rounded-lg border p-3 transition-opacity ${
                                task.status === "completed"
                                    ? "border-gray-100 bg-gray-50 opacity-60"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-sm font-medium ${
                                            task.status === "completed"
                                                ? "line-through text-gray-400"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {task.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <PriorityBadge priority={task.priority} />
                                        <span
                                            className={`text-xs ${overdue ? "text-red-500 font-medium" : "text-gray-400"}`}
                                        >
                                            {overdue ? "Overdue · " : "Due "}
                                            {formatDate(task.dueDate)}
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <StatusSelect
                                        value={task.status}
                                        disabled={isPending}
                                        onChange={(status) =>
                                            mutation.mutate({ taskId: task.id, status })
                                        }
                                    />
                                </div>
                            </div>
                            {isPending && (
                                <p className="text-xs text-indigo-500 mt-1">Saving...</p>
                            )}
                            {mutation.isError && mutation.variables?.taskId === task.id && (
                                <p className="text-xs text-red-500 mt-1">
                                    Failed to update. Try again.
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
