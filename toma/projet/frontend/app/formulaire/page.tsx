"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";

export default function FormulairePage() {
  const router = useRouter();
  const [newProduct, setNewProduct] = useState({ titre: "", description: "", prix: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...newProduct, prix: parseFloat(newProduct.prix) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Erreur lors de la creation");
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
        <Card.Title className="text-center">Ajouter un produit</Card.Title>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: Laptop Pro"
                value={newProduct.titre}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, titre: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ex: Ordinateur haute performance"
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix (euro)</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                step="0.01"
                placeholder="Ex: 999.99"
                value={newProduct.prix}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, prix: e.target.value }))}
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
