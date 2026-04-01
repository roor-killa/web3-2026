-- CertiChain — schéma PostgreSQL (exécuté au premier démarrage du volume)
-- Aligné avec le modèle SQLAlchemy / sujet d’évaluation

CREATE TABLE IF NOT EXISTS certificates (
    id              SERIAL PRIMARY KEY,
    student_name    VARCHAR(255) NOT NULL,
    certification_title VARCHAR(500) NOT NULL,
    issued_at       DATE NOT NULL,
    blockchain_hash TEXT
);

-- Données d’exemple (idempotentes si relancé manuellement sans les lignes)
INSERT INTO certificates (student_name, certification_title, issued_at, blockchain_hash)
SELECT 'Marie Martin', 'Certification Web3 — Licence', '2026-03-15', '0xdeadbeef01'
WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_name = 'Marie Martin' AND certification_title LIKE 'Certification Web3%');

INSERT INTO certificates (student_name, certification_title, issued_at, blockchain_hash)
SELECT 'Jean Ngoma', 'Développement API REST', '2026-03-20', NULL
WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_name = 'Jean Ngoma');
