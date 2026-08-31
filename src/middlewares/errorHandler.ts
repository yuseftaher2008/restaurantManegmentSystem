import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../lib/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  logger.error({ err }, "Unhandled error");

  const statusCode = 500;
  const message = process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message;

  res.status(statusCode).json({
    message,
    statusCode,
  });
}
