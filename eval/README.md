# CertiChain - Digital Certificates Application

A Web3 application for publishing and verifying digital certificates using blockchain technology.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│    Database     │
│    (Next.js)    │     │    (Laravel)    │     │  (PostgreSQL)   │
│    Port: 3000   │     │    Port: 8000   │     │    Port: 5432   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Technologies

- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS
- **Backend**: Laravel 13 (PHP 8.3)
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## Project Structure

```
eval/
├── docker-compose.yml          # Docker orchestration
├── frontend/
│   └── certichain/             # Next.js application
│       └── Dockerfile
├── backend/
│   └── certichain-api/         # Laravel API
│       └── Dockerfile
└── database/
    └── init/                   # PostgreSQL initialization scripts
        └── 01_create_certificates.sql
```

## Getting Started

### Prerequisites

- Docker Desktop installed and running
- Docker Compose v2+

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

### API Endpoints

| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | /api/certificates              | Get list of all certificates   |
| POST   | /api/certificates              | Create a new certificate       |
| GET    | /api/certificates/{id}         | Get a specific certificate     |
| GET    | /api/certificates/verify/{hash}| Verify certificate by hash     |

## Database Schema

### certificates table

| Column              | Type         | Description                          |
|--------------------|--------------|--------------------------------------|
| id                 | SERIAL       | Primary key                          |
| student_name       | VARCHAR(255) | Name of the student                  |
| certification_title| VARCHAR(255) | Title of the certification           |
| issue_date         | DATE         | Date of certificate issuance         |
| blockchain_hash    | VARCHAR(66)  | Blockchain hash/proof identifier     |
| created_at         | TIMESTAMP    | Record creation timestamp            |
| updated_at         | TIMESTAMP    | Record update timestamp              |

## Web3 Concept

This application demonstrates Web3 principles:
- **Decentralized Verification**: Certificate hashes are stored on blockchain
- **Immutability**: Once issued, certificates cannot be altered
- **Public Verifiability**: Anyone can verify a certificate's authenticity

## Environment Variables

### Backend (.env)
```env
DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=certichain
DB_USERNAME=certichain_user
DB_PASSWORD=certichain_secret
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
