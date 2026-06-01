import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../index";
import { tasks } from "../data/mockData";

// Reset task statuses before each test so mutations don't bleed between cases
beforeEach(() => {
    tasks.forEach((t) => {
        if (t.id === "tsk_001") t.status = "todo";
    });
});

describe("GET /students/:id/action-center", () => {
    it("returns student profile with tasks and messages for a valid ID", async () => {
        const res = await request(app).get("/students/stu_001/action-center");

        expect(res.status).toBe(200);
        expect(res.body.student.id).toBe("stu_001");
        expect(res.body.student.name).toBe("Maya Patel");
        expect(Array.isArray(res.body.tasks)).toBe(true);
        expect(Array.isArray(res.body.messages)).toBe(true);
    });

    it("includes only tasks that belong to the requested student", async () => {
        const res = await request(app).get("/students/stu_002/action-center");

        expect(res.status).toBe(200);
        const allBelongToStudent = res.body.tasks.every(
            (t: { studentId: string }) => t.studentId === "stu_002"
        );
        expect(allBelongToStudent).toBe(true);
    });

    it("computes unreadCount correctly", async () => {
        const res = await request(app).get("/students/stu_001/action-center");

        // stu_001 has msg_001 and msg_002 unread
        expect(res.status).toBe(200);
        expect(res.body.unreadCount).toBe(2);
    });

    it("computes urgentTaskCount — only counts non-completed urgent tasks", async () => {
        const res = await request(app).get("/students/stu_001/action-center");

        // tsk_001 (urgent/todo) and tsk_003 (urgent/todo) = 2
        // tsk_008 (urgent/completed) for stu_002 should NOT count
        expect(res.status).toBe(200);
        expect(res.body.urgentTaskCount).toBe(2);
    });

    it("returns 404 for an unknown student ID", async () => {
        const res = await request(app).get("/students/stu_999/action-center");

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Student not found");
    });

    it("attaches a request ID header to the response", async () => {
        const res = await request(app).get("/students/stu_001/action-center");

        expect(res.headers["x-request-id"]).toBeDefined();
        expect(typeof res.headers["x-request-id"]).toBe("string");
    });

    it("echoes back a caller-supplied X-Request-Id", async () => {
        const customId = "test-request-abc123";
        const res = await request(app)
            .get("/students/stu_001/action-center")
            .set("X-Request-Id", customId);

        expect(res.headers["x-request-id"]).toBe(customId);
    });
});

describe("PATCH /tasks/:taskId/status", () => {
    it("updates a task status and returns the updated task", async () => {
        const res = await request(app)
            .patch("/tasks/tsk_001/status")
            .send({ status: "in_progress" });

        expect(res.status).toBe(200);
        expect(res.body.id).toBe("tsk_001");
        expect(res.body.status).toBe("in_progress");
        expect(res.body.updatedAt).not.toBe("2026-05-13T14:00:00Z");
    });

    it("returns 400 for an invalid status value", async () => {
        const res = await request(app)
            .patch("/tasks/tsk_001/status")
            .send({ status: "done" });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/invalid status/i);
    });

    it("returns 400 when status field is missing", async () => {
        const res = await request(app)
            .patch("/tasks/tsk_001/status")
            .send({});

        expect(res.status).toBe(400);
    });

    it("returns 404 for an unknown task ID", async () => {
        const res = await request(app)
            .patch("/tasks/tsk_999/status")
            .send({ status: "completed" });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Task not found");
    });
});
