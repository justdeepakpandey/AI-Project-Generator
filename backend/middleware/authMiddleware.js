const { verifyToken } = require("../utils/jwtUtils");

// Require authentication middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login to continue."
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session token. Please login again."
        });
    }

    req.user = decoded;
    next();
};

// Optional authentication middleware (allows guests while attaching user if token present)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }
    next();
};

module.exports = {
    requireAuth,
    optionalAuth
};
