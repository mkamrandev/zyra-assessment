import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students";
import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
