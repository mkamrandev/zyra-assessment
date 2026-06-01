import type { Priority } from "../types";

const styles: Record<Priority, string> = {
    urgent: "bg-red-100 text-red-700 border border-red-200",
    high: "bg-orange-100 text-orange-700 border border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    low: "bg-gray-100 text-gray-600 border border-gray-200",
};

const labels: Record<Priority, string> = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[priority]}`}>
            {labels[priority]}
        </span>
    );
}
