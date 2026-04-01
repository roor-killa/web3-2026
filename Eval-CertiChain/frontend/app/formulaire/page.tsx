"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";

export default function FormulairePage() {
  const router = useRouter();
  const API_BASE_URL = "http://localhost:8001/api";
  const [newCertificat, setNewCertificat] = useState({
    identifiant: "",
    nom_etudiant: "",
    intitule: "",
    date_emission: "",
    hash_blockchain: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/certificats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifiant: newCertificat.identifiant,
          nom_etudiant: newCertificat.nom_etudiant,
          intitule: newCertificat.intitule,
          date_emission: newCertificat.date_emission,
          hash_blockchain: newCertificat.hash_blockchain,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 422 && data?.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError) && firstError[0]) {
            throw new Error(String(firstError[0]));
          }
        }
        throw new Error(data?.message ?? "Erreur lors de la creation");
      }
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ minWidth: 400 }} className="p-3">
        <Card.Title className="text-center">Ajouter un certificat</Card.Title>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Identifiant</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: CERT-2026-001"
                value={newCertificat.identifiant}
                onChange={(e) => setNewCertificat((prev) => ({ ...prev, identifiant: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nom etudiant</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: Jean Dupont"
                value={newCertificat.nom_etudiant}
                onChange={(e) => setNewCertificat((prev) => ({ ...prev, nom_etudiant: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Intitule</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: Certification Blockchain"
                value={newCertificat.intitule}
                onChange={(e) => setNewCertificat((prev) => ({ ...prev, intitule: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date emission</Form.Label>
              <Form.Control
                required
                type="date"
                value={newCertificat.date_emission}
                onChange={(e) => setNewCertificat((prev) => ({ ...prev, date_emission: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hash blockchain</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: 0xabc123..."
                value={newCertificat.hash_blockchain}
                onChange={(e) => setNewCertificat((prev) => ({ ...prev, hash_blockchain: e.target.value }))}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" type="button" onClick={() => router.push("/")}>
                Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Envoi..." : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
