-- SQL Schema for AI Project Generator (Aiven MySQL / Local MySQL)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    provider VARCHAR(50) DEFAULT 'email',
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Projects Table (with user_id foreign key)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    language VARCHAR(100) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    difficulty VARCHAR(100) NOT NULL,
    skills TEXT NOT NULL,
    project LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Migration statement if 'projects' table already exists without 'user_id'
-- Run this block if your existing table does not have user_id:
/*
ALTER TABLE projects ADD COLUMN user_id INT NULL;
ALTER TABLE projects ADD CONSTRAINT fk_projects_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
*/
