const UserModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const { generateToken } = require("../utils/jwtUtils");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new OAuth2Client(googleClientId);

// 1. User Signup / Registration
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your name."
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email address."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        // Duplicate email validation
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists."
            });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await UserModel.createUser({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            provider: "local"
        });

        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: "Account created successfully! 🎉",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                provider: newUser.provider
            }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete signup: " + error.message
        });
    }
};

// 2. User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter both email and password."
            });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email address or password."
            });
        }

        if (user.provider === "google" && !user.password) {
            return res.status(400).json({
                success: false,
                message: "This account was created with Google. Please use 'Continue with Google'."
            });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email address or password."
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                provider: user.provider
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed: " + error.message
        });
    }
};

// 3. Google OAuth Login & Account Creation
const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google OAuth credential is missing."
            });
        }

        let email, name;

        // Try standard OAuth2 verification if Client ID is configured
        try {
            if (process.env.GOOGLE_CLIENT_ID) {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name;
            }
        } catch (verifyErr) {
            // Fallback decode for development / direct JWT payload parsing
        }

        // Direct payload decode if google-auth-library check didn't extract email
        if (!email) {
            try {
                const base64Url = credential.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
                const payload = JSON.parse(jsonPayload);
                email = payload.email;
                name = payload.name || payload.email.split("@")[0];
            } catch (decodeErr) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Google credential token format."
                });
            }
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Could not read email from Google profile."
            });
        }

        let user = await UserModel.findByEmail(email);

        if (!user) {
            // First time login -> create account automatically
            user = await UserModel.createUser({
                name: name || "Google User",
                email: email,
                password: null,
                provider: "google"
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Google sign-in successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                provider: user.provider
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed: " + error.message
        });
    }
};

// 4. Get Current User Profile
const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user profile."
        });
    }
};

// 5. Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email address."
            });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If an account exists with that email, password reset instructions have been sent."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await UserModel.setResetToken(user.email, resetToken, expiresAt);

        return res.status(200).json({
            success: true,
            message: "Password reset token generated.",
            resetToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Forgot password request failed: " + error.message
        });
    }
};

// 6. Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password (min 6 chars) are required."
            });
        }

        const user = await UserModel.findByResetToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token."
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        await UserModel.updatePassword(user.id, hashedPassword);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully. You can now login."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Reset password failed: " + error.message
        });
    }
};

module.exports = {
    register,
    login,
    googleAuth,
    getMe,
    forgotPassword,
    resetPassword
};
