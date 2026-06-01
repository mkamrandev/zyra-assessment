import { Router, Request, Response } from "express";
import { students, tasks, messages } from "../data/mockData";

const router = Router();

router.get("/:id/action-center", (req: Request, res: Response) => {
    const { id } = req.params;

    const student = students.find((s) => s.id === id);
    if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
    }

    const studentTasks = tasks.filter((t) => t.studentId === id);
    const studentMessages = messages.filter((m) => m.studentId === id);

    const unreadCount = studentMessages.filter((m) => !m.read).length;
    const urgentTaskCount = studentTasks.filter(
        (t) => t.priority === "urgent" && t.status !== "completed"
    ).length;

    res.json({
        student,
        tasks: studentTasks,
        messages: studentMessages,
        unreadCount,
        urgentTaskCount,
    });
});

export default router;
