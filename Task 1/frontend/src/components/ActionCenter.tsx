import { useQuery } from "@tanstack/react-query";
import { fetchActionCenter } from "../api";
import { StudentProfile } from "./StudentProfile";
import { TaskList } from "./TaskList";
import { MessageList } from "./MessageList";

interface Props {
    studentId: string;
}

export function ActionCenter({ studentId }: Props) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["action-center", studentId],
        queryFn: () => fetchActionCenter(studentId),
    });

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-36 bg-gray-100 rounded-xl" />
                <div className="h-64 bg-gray-100 rounded-xl" />
                <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="text-red-600 font-medium">Failed to load student data</p>
                <p className="text-sm text-red-400 mt-1">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-4">
            <StudentProfile
                student={data.student}
                unreadCount={data.unreadCount}
                urgentTaskCount={data.urgentTaskCount}
            />
            <TaskList tasks={data.tasks} studentId={studentId} />
            <MessageList messages={data.messages} />
        </div>
    );
}
