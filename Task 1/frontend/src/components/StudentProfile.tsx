import type { Student } from "../types";

const enrollmentStyles = {
    active: "bg-green-100 text-green-700",
    at_risk: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-600",
};

const enrollmentLabels = {
    active: "Active",
    at_risk: "At Risk",
    inactive: "Inactive",
};

interface Props {
    student: Student;
    unreadCount: number;
    urgentTaskCount: number;
}

export function StudentProfile({ student, unreadCount, urgentTaskCount }: Props) {
    const initials = student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${enrollmentStyles[student.enrollmentStatus]}`}
                        >
                            {enrollmentLabels[student.enrollmentStatus]}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{student.email}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span>
                            Grade <strong className="text-gray-900">{student.grade}</strong>
                        </span>
                        <span>
                            GPA <strong className="text-gray-900">{student.gpa.toFixed(1)}</strong>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex-1 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-center">
                    <p className="text-2xl font-bold text-red-600">{urgentTaskCount}</p>
                    <p className="text-xs text-red-500 mt-0.5">Urgent Tasks</p>
                </div>
                <div className="flex-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center">
                    <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                    <p className="text-xs text-blue-500 mt-0.5">Unread Messages</p>
                </div>
            </div>
        </div>
    );
}
