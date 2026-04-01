-- CertiChain Database Initialization Script
-- Creates the certificates table for storing digital certificates

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    certification_title VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    blockchain_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on blockchain_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificates_blockchain_hash ON certificates(blockchain_hash);

-- Create index on student_name for search functionality
CREATE INDEX IF NOT EXISTS idx_certificates_student_name ON certificates(student_name);

-- Insert sample data for testing
INSERT INTO certificates (student_name, certification_title, issue_date, blockchain_hash) VALUES
    ('Jean Dupont', 'Licence Informatique', '2024-06-15', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890'),
    ('Marie Martin', 'Master Web Development', '2024-07-20', '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab'),
    ('Pierre Bernard', 'Certification Blockchain', '2024-08-10', '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd');

COMMENT ON TABLE certificates IS 'Table storing digital certificates with blockchain verification hashes';
COMMENT ON COLUMN certificates.blockchain_hash IS 'Hash or proof identifier stored on blockchain for verification';
