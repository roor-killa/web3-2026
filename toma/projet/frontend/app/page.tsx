"use client";

import { useEffect, useState } from "react";
// Import the Bootstrap Table component
import { Form, Container, Table } from "react-bootstrap";

interface Product {
  id: number;
  titre: string;
  description: string;
  prix: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Les produits</h1>
      
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Titre</Form.Label>
          </Form.Group>
        </Form>
      </div>

      <div>
      {/* Use React-Bootstrap Table with styling props */}
        <Table striped bordered hover responsive variant="light">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.titre}</td>
                <td>{product.description}</td>
                <td>{product.prix}€</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}