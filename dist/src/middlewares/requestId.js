import { randomUUID } from "crypto";
// [M-12] Request ID tracking middleware
export const requestId = (req, res, next) => {
    const id = req.headers["x-request-id"] || randomUUID();
    req.id = id;
    res.setHeader("X-Request-Id", id);
    next();
};
