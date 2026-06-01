import express from "express";
import cors from "cors";
import { attachRequestId } from "./middleware/requestId";
import requestLogger from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import studentRoutes from "./routes/students";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());
app.use(attachRequestId);
app.use(requestLogger);

app.use("/students", studentRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// Must be registered after all routes
app.use(errorHandler);

export { app };

if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
