"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";

export default function FormulairePage() {
  const router = useRouter();
  const API_BASE_URL = "http://localhost:8000";
  const [newAnnonce, setNewAnnonce] = useState({
    titre: "",
    description: "",
    prix: "",
    commune: "",
    categorie: "autre",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        localStorage.removeItem("isAuthenticated");
        router.push("/login");
        return;
      }

      const prix = parseFloat(newAnnonce.prix);
      if (Number.isNaN(prix)) {
        throw new Error("Le prix doit etre un nombre valide");
      }

      const res = await fetch(`${API_BASE_URL}/annonces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titre: newAnnonce.titre,
          description: newAnnonce.description,
          prix,
          commune: newAnnonce.commune,
          categorie: newAnnonce.categorie,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 422 && data?.detail) {
          const detailText = Array.isArray(data.detail)
            ? data.detail.map((d: { loc?: unknown[]; msg?: string }) => `${(d.loc ?? []).join(".")}: ${d.msg ?? "invalide"}`).join(" | ")
            : String(data.detail);
          throw new Error(`Erreur de validation (422): ${detailText}`);
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
        <Card.Title className="text-center">Ajouter une annonce</Card.Title>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: Vente de mangues Julie bio"
                value={newAnnonce.titre}
                onChange={(e) => setNewAnnonce((prev) => ({ ...prev, titre: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ex: string"
                value={newAnnonce.description}
                onChange={(e) => setNewAnnonce((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix (euro)</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                step="0.01"
                placeholder="Ex: 3.5"
                value={newAnnonce.prix}
                onChange={(e) => setNewAnnonce((prev) => ({ ...prev, prix: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commune</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ex: Le Lamentin"
                value={newAnnonce.commune}
                onChange={(e) => setNewAnnonce((prev) => ({ ...prev, commune: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Select
                required
                value={newAnnonce.categorie}
                onChange={(e) => setNewAnnonce((prev) => ({ ...prev, categorie: e.target.value }))}
              >
                <option value="autre">autre</option>
                <option value="loisirs">loisirs</option>
                <option value="maison">maison</option>
                <option value="transport">transport</option>
                <option value="emploi">emploi</option>
                <option value="services">services</option>
                <option value="immobilier">immobilier</option>
                <option value="mode">mode</option>
              </Form.Select>
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
