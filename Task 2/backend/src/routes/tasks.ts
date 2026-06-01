import { Router, Request, Response } from "express";
import { tasks } from "../data/mockData";
import { TaskStatus } from "../types";

const router = Router();

const validStatuses: TaskStatus[] = ["todo", "in_progress", "completed"];

router.patch("/:taskId/status", (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status } = req.body as { status: TaskStatus };

    if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
            error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
        return;
    }

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        res.status(404).json({ error: "Task not found" });
        return;
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        status,
        updatedAt: new Date().toISOString(),
    };

    res.json(tasks[taskIndex]);
});

export default router;
