import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StudentProfile } from "../components/StudentProfile";
import type { Student } from "../types";

const baseStudent: Student = {
    id: "stu_001",
    name: "Maya Patel",
    email: "maya.patel@school.edu",
    grade: 11,
    gpa: 3.2,
    counselorId: "csl_001",
    enrollmentStatus: "at_risk",
};

describe("StudentProfile", () => {
    it("renders the student name and email", () => {
        render(<StudentProfile student={baseStudent} unreadCount={2} urgentTaskCount={1} />);
        expect(screen.getByText("Maya Patel")).toBeInTheDocument();
        expect(screen.getByText("maya.patel@school.edu")).toBeInTheDocument();
    });

    it("shows grade and GPA", () => {
        render(<StudentProfile student={baseStudent} unreadCount={0} urgentTaskCount={0} />);
        expect(screen.getByText("11")).toBeInTheDocument();
        expect(screen.getByText("3.2")).toBeInTheDocument();
    });

    it("shows the At Risk enrollment badge for at_risk students", () => {
        render(<StudentProfile student={baseStudent} unreadCount={0} urgentTaskCount={0} />);
        expect(screen.getByText("At Risk")).toBeInTheDocument();
    });

    it("shows the Active badge for active students", () => {
        const active: Student = { ...baseStudent, enrollmentStatus: "active" };
        render(<StudentProfile student={active} unreadCount={0} urgentTaskCount={0} />);
        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("displays unread message count", () => {
        render(<StudentProfile student={baseStudent} unreadCount={3} urgentTaskCount={0} />);
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("displays urgent task count", () => {
        render(<StudentProfile student={baseStudent} unreadCount={0} urgentTaskCount={2} />);
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("renders initials avatar from student name", () => {
        render(<StudentProfile student={baseStudent} unreadCount={0} urgentTaskCount={0} />);
        expect(screen.getByText("MP")).toBeInTheDocument();
    });
});
