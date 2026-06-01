import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    status?: number;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    const requestId = req.headers["x-request-id"] as string ?? "unknown";
    const status = err.status ?? 500;

    // Always log unexpected errors server-side with the request ID
    if (status >= 500) {
        console.error(`[${requestId}] Unhandled error:`, err);
    }

    res.status(status).json({
        error: status >= 500 ? "Internal server error" : err.message,
        requestId,
    });
}
