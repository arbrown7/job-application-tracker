-- Database seed file
-- This file creates tables and inserts all initial data

BEGIN;

-- Create roles table for role-based access control
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL REFERENCES roles(role_name) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    url TEXT NOT NULL, 
    category VARCHAR(100) NOT NULL,
    owner_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
); 

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    owner_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(company_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    location VARCHAR(255),
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    source VARCHAR(255),
    category VARCHAR(255),
    comp_range VARCHAR(255),
    status VARCHAR(100) NOT NULL,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed roles
INSERT INTO roles (role_name, role_description) 
VALUES 
    ('job_seeker', 'Standard user with basic access'),
    ('supporter', 'User with access limited to sending jobs'),
    ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- Seed users
INSERT INTO users (email, password, first_name, last_name, role)
VALUES 
    ('admin@test.com', '$2a$12$anN3TNwz2jj.851R/fAWN./TRG.pnq9vk2rrOIn8Xe7A3ynXJX6I.', 'Admin', 'User', 'admin'), 
    ('seeker@test.com', '$2a$12$anN3TNwz2jj.851R/fAWN./TRG.pnq9vk2rrOIn8Xe7A3ynXJX6I.', 'Job', 'Seeker', 'job_seeker'),
    ('supporter@test.com', '$2a$12$anN3TNwz2jj.851R/fAWN./TRG.pnq9vk2rrOIn8Xe7A3ynXJX6I.', 'Supporter', 'User', 'supporter')
ON CONFLICT (email) DO NOTHING;

COMMIT;