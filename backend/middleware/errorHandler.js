const errorHandler = (err, req, res, next) => {
    console.error("🔥 Global Error Handler Caught Exception:", err);

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "An internal server error occurred.",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
};

module.exports = errorHandler;
