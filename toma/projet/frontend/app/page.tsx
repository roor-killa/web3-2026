"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
// Import the Bootstrap Table component
import { Container, Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  titre: string;
  description: string;
  prix: number;
  commune: string;
  categorie: string;
  proprietaire_id: number;
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const API_BASE_URL = "http://localhost:8000";
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isAuthenticated = isClient && localStorage.getItem("isAuthenticated") === "true";
  const currentUserId = isClient
    ? (() => {
        const raw = localStorage.getItem("currentUserId");
        if (raw) {
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) return parsed;
        }

        const rawUser = localStorage.getItem("currentUser");
        if (rawUser) {
          try {
            const parsedUser = JSON.parse(rawUser) as { id?: number | string | null };
            if (parsedUser?.id !== undefined && parsedUser?.id !== null) {
              const parsed = Number(parsedUser.id);
              if (!Number.isNaN(parsed)) {
                localStorage.setItem("currentUserId", String(parsed));
                return parsed;
              }
            }
          } catch {
            // ignore malformed stored data
          }
        }

        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const [, payloadPart] = token.split(".");
            if (payloadPart) {
              const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
              const payload = JSON.parse(atob(normalized)) as {
                user_id?: number | string;
                id?: number | string;
                sub?: number | string;
              };
              const candidate = payload.user_id ?? payload.id ?? payload.sub;
              if (candidate !== undefined && candidate !== null) {
                const parsed = Number(candidate);
                if (!Number.isNaN(parsed)) {
                  localStorage.setItem("currentUserId", String(parsed));
                  return parsed;
                }
              }
            }
          } catch {
            // ignore token decode errors
          }
        }

        return null;
      })()
    : null;

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/annonces`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.data ?? []))
      .catch((err) => console.error("Error:", err));
  }, [API_BASE_URL, isAuthenticated, isClient, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      localStorage.removeItem("isAuthenticated");
      router.push("/login");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/annonces/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message ?? "Suppression impossible");
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (!isClient) {
    return null;
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Les produits</h1>
        <Button variant="primary" onClick={() => router.push("/formulaire")}>
          Ajouter
        </Button>
      </div>

      <Table striped bordered hover responsive variant="light">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Commune</th>
            <th>Categorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.titre}</td>
              <td>{product.description}</td>
              <td>{product.prix}€</td>
              <td>{product.commune}</td>
              <td>{product.categorie}</td>
              <td>
                {localStorage.getItem('currentUserId') !== null && product.proprietaire_id === Number(localStorage.getItem('currentUserId')) ? 
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                    Supprimer
                  </Button> 
                : ""}
                
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}