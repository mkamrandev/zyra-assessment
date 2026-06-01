export type TaskStatus = "todo" | "in_progress" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type EnrollmentStatus = "active" | "at_risk" | "inactive";

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: number;
    gpa: number;
    counselorId: string;
    enrollmentStatus: EnrollmentStatus;
}

export interface Task {
    id: string;
    studentId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    studentId: string;
    from: string;
    subject: string;
    preview: string;
    read: boolean;
    receivedAt: string;
}

export interface ActionCenterData {
    student: Student;
    tasks: Task[];
    messages: Message[];
    unreadCount: number;
    urgentTaskCount: number;
}
