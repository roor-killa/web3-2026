"use client";

import { useEffect, useState } from "react";
// Import the Bootstrap Table component
import { Container, Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  titre: string;
  description: string;
  prix: number;
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`http://localhost:8000/api/products/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}