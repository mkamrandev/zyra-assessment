import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

// Stamp every incoming request with a unique ID so logs and error responses
// can be correlated without needing an external tracing system.
export function attachRequestId(req: Request, res: Response, next: NextFunction) {
    const id = (req.headers["x-request-id"] as string) || randomUUID();
    req.headers["x-request-id"] = id;
    res.setHeader("X-Request-Id", id);
    next();
}
