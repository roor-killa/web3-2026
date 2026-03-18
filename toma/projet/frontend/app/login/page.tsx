"use client";

import { Container, Card, Form, Button } from "react-bootstrap";

export default function LoginPage() {

  function Login(){
    console.log('Essayer de log in')
    fetch('http://http://127.0.0.1:8000/auth/login',)
    .then(response => response.json())
    .then(data => {console.log(data)})
  }
 
  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ minWidth: 400 }} className="p-3">
        <Card.Title className="text-center">Login</Card.Title>
        <Card.Body>
          <Form onSubmit={Login}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="nom@main.com"

              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
              />
            </Form.Group>
          </Form>

          <Button type="submit">Login</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
