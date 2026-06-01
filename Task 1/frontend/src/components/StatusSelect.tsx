import type { TaskStatus } from "../types";

const options: { value: TaskStatus; label: string }[] = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

interface Props {
    value: TaskStatus;
    onChange: (status: TaskStatus) => void;
    disabled?: boolean;
}

export function StatusSelect({ value, onChange, disabled }: Props) {
    return (
        <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as TaskStatus)}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
