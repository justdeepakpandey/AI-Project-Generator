const db = require("../config/db");

class UserModel {
    static async findByEmail(email) {
        if (!email) return null;
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
        return rows[0] || null;
    }

    static async findById(id) {
        if (!id) return null;
        const [rows] = await db.query("SELECT id, name, email, provider, created_at FROM users WHERE id = ?", [id]);
        return rows[0] || null;
    }

    static async createUser({ name, email, password = null, provider = "local" }) {
        const cleanName = name ? name.trim() : "User";
        const cleanEmail = email.toLowerCase().trim();
        const cleanProvider = provider || "local";

        const [result] = await db.query(
            "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, ?)",
            [cleanName, cleanEmail, password, cleanProvider]
        );

        return {
            id: result.insertId,
            name: cleanName,
            email: cleanEmail,
            provider: cleanProvider
        };
    }

    static async setResetToken(email, token, expiresAt) {
        await db.query(
            "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
            [token, expiresAt, email.toLowerCase().trim()]
        );
    }

    static async findByResetToken(token) {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token]
        );
        return rows[0] || null;
    }

    static async updatePassword(id, hashedPassword) {
        await db.query(
            "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
            [hashedPassword, id]
        );
    }
}

module.exports = UserModel;
