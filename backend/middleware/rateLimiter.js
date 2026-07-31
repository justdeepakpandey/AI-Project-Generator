const rateLimit = require("express-rate-limit");

// Rate limiter for authentication routes (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication requests from this IP. Please try again after 15 minutes."
    }
});

// Rate limiter for AI project generation routes (prevent abuse)
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // max 10 generations per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Generation rate limit reached. Please wait a minute before generating more projects."
    }
});

module.exports = {
    authLimiter,
    aiLimiter
};
