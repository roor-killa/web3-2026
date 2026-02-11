

"use client";

import { useEffect, useState } from "react";
// Import the Bootstrap Table component
import { Container, Card, Button, Form } from "react-bootstrap";

interface Product {
  id: number;
  titre: string;
  description: string;
  prix: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <Container className="d-flex justify-content-column align-items-center">
      <Card className="d-flex flex-column align-items-center p-3">
        <Card.Title>Ajouter un produit</Card.Title>
        <Card.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Titre</Form.Label>
                    <Form.Control 
                        required
                        type="text"
                        placeholder="Ex: Laptop Pro" 
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        required
                        type="text"
                        placeholder="Ex: Laptop Pro" 
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        required
                        type="text"
                        placeholder="Ex: Laptop Pro" 
                    />
                </Form.Group>
            </Form>
        </Card.Body>
        <Card.Footer>
            <Button>Ajouter</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}