export function errorHandler(err, _req, res, _next) {
    console.error(`[ERROR] ${err.message}`, err.stack);
    res.status(500).json({
        message: "Internal server error",
    });
}
