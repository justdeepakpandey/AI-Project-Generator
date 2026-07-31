const mysql = require("mysql2/promise");

// Use createPool instead of createConnection:
//   - Pool auto-reconnects if the connection drops (important for Render/Aiven)
//   - Pool supports concurrent queries from multiple controllers
//   - db.query() returns a Promise — works with async/await directly
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
});

// Verify connection on startup
pool.getConnection()
    .then(conn => {
        console.log("MySQL Connected ✅");
        conn.release();
    })
    .catch(err => {
        console.error("Database Connection Failed ❌", err.message);
    });

module.exports = pool;