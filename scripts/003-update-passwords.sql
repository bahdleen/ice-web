-- Update passwords to sha256 hashes for demo
-- admin123 sha256 = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- user123  sha256 = 96cae35ce8a9874e1fdd10b69cfe23c51b51b26c34335a31e0e535aec9061b2b
UPDATE users SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' WHERE email = 'admin@ice-portal.gov';
UPDATE users SET password_hash = '96cae35ce8a9874e1fdd10b69cfe23c51b51b26c34335a31e0e535aec9061b2b' WHERE email = 'user@example.com';
