

"use client";

import { useState } from "react";
// Import the Bootstrap Table component
import { Container, Card, Button, Form } from "react-bootstrap";


export default function Formulaire() {
  const [newProduct, setNewProduct] = useState({
    titre: '',
    description: '',
    prix:'',
  });

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
                        value={newProduct.titre}
                        onChange={(e) => {setNewProduct(prev => ({...prev, "titre":e.target.value}))}}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        required
                        type="text"
                        placeholder="Ex: Laptop Pro" 
                        onChange={(e) => {setNewProduct(prev => ({...prev, "description":e.target.value}))}}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        required
                        type="number"
                        min={0}
                        onChange={(e) => {setNewProduct(prev => ({...prev, "prix":e.target.value}))}}
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