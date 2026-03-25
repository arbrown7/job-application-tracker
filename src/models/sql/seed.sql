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

-- Create job status table
CREATE TABLE IF NOT EXISTS job_status (
    status_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create job type table
CREATE TABLE IF NOT EXISTS job_type (
    type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    owner_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    status_id INTEGER NOT NULL DEFAULT 1 REFERENCES job_status(status_id) ON DELETE RESTRICT,
    type_id INTEGER NOT NULL REFERENCES job_type(type_id) ON DELETE RESTRICT,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Seed job_status
INSERT INTO job_status (name)
VALUES 
    ('new'),
    ('applied'),
    ('initial review'),
    ('interviewing'),
    ('under consideration'),
    ('offer extended'),
    ('accepted'),
    ('withdrawn'),
    ('rejected')
ON CONFLICT (name) DO NOTHING;

-- Seed job_type 
INSERT INTO job_type (name)
VALUES
    ('suggestion'),
    ('potential'),
    ('application')
ON CONFLICT (name) DO NOTHING;

INSERT INTO jobs (
    owner_user_id, company, title, url, city, state,
    contact_name, contact_email, salary_min, salary_max,
    status_id, type_id, posted_date, created_at, last_changed
) VALUES

-- User 2 (seeker) - active pipeline
(2, 'Stackrift', 'Software Engineer II', 'https://www.stackrift-fake.test/careers/software-engineer-ii', 'San Francisco', 'CA', 'Jamie Liu', 'jamie.liu@stackrift-fake.test', 130000, 160000, 4, 3, '2025-03-01', '2025-03-02', '2025-03-10'),
(2, 'Lunarplex', 'Senior Frontend Engineer', 'https://www.lunarplex-fake.test/jobs/senior-frontend', 'Remote', NULL, NULL, NULL, 140000, 175000, 3, 3, '2025-03-05', '2025-03-06', '2025-03-09'),
(2, 'Grovebit', 'Product Engineer', 'https://www.grovebit-fake.test/careers/product-engineer', 'New York', 'NY', 'Taylor Brooks', 'tbrooks@grovebit-fake.test', 125000, 155000, 2, 3, '2025-02-20', '2025-02-21', '2025-02-21'),
(2, 'Nexloft', 'Staff Engineer', 'https://www.nexloft-fake.test/careers/staff-engineer', 'Remote', NULL, NULL, NULL, 160000, 200000, 5, 3, '2025-02-15', '2025-02-16', '2025-03-08'),
(2, 'Driftmark', 'Full Stack Engineer', 'https://www.driftmark-fake.test/careers/full-stack', 'San Francisco', 'CA', 'Morgan Chen', 'morgan@driftmark-fake.test', 135000, 165000, 6, 3, '2025-02-10', '2025-02-12', '2025-03-07'),
(2, 'Cobaltyne', 'Backend Engineer', 'https://www.cobaltyne-fake.test/careers/backend-engineer', 'San Francisco', 'CA', NULL, NULL, 120000, 150000, 8, 3, '2025-01-28', '2025-01-29', '2025-03-01'),
(2, 'Veltura', 'DevOps Engineer', 'https://www.veltura-fake.test/jobs/devops', 'Austin', 'TX', NULL, NULL, 115000, 140000, 9, 3, '2025-01-15', '2025-01-16', '2025-02-28'),

-- User 2 - suggestions and potentials
(2, 'Orbfield', 'Senior Backend Engineer', 'https://www.orbfield-fake.test/careers/senior-backend', 'Remote', NULL, NULL, NULL, 130000, 160000, 1, 2, '2025-03-10', '2025-03-10', '2025-03-10'),
(2, 'Patchwave', 'Platform Engineer', 'https://www.patchwave-fake.test/careers/platform-engineer', 'Remote', NULL, NULL, NULL, 125000, 155000, 1, 1, '2025-03-11', '2025-03-11', '2025-03-11'),
(2, 'Ironveil', 'Infrastructure Engineer', 'https://www.ironveil-fake.test/careers', 'Remote', NULL, NULL, NULL, 110000, 140000, 1, 1, '2025-03-12', '2025-03-12', '2025-03-12'),

-- User 1 (admin)
(1, 'Synthetiq', 'ML Engineer', 'https://www.synthetiq-fake.test/careers/ml-engineer', 'San Francisco', 'CA', 'Alex Rivera', 'arivera@synthetiq-fake.test', 180000, 240000, 7, 3, '2025-01-10', '2025-01-11', '2025-02-20'),
(1, 'Neuraloft', 'Research Engineer', 'https://www.neuraloft-fake.test/careers/research-engineer', 'San Francisco', 'CA', NULL, NULL, 200000, 275000, 4, 3, '2025-02-28', '2025-03-01', '2025-03-09'),
(1, 'Mosaicly', 'Applied ML Engineer', 'https://www.mosaicly-fake.test/careers/applied-ml', 'Toronto', 'ON', NULL, NULL, 150000, 190000, 1, 2, '2025-03-08', '2025-03-08', '2025-03-08'),

COMMIT;