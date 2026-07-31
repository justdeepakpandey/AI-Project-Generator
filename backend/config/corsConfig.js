const cors = require("cors");

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow non-browser / same-origin tools
        if (!origin) return callback(null, true);

        const isAllowed =
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app");

        // Always allow in production so Vercel preview + custom domains never break.
        // Cold-start recovery depends on browser fetch succeeding once Express is up.
        if (isAllowed || process.env.NODE_ENV === "production") {
            return callback(null, true);
        }

        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);
