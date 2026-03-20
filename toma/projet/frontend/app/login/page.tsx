"use client";

import { useState, type FormEvent } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

export default function LoginPage() {

  const [email,setEmail] = useState('')
  const [mdp,setMdp] = useState('')

  function Login(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    console.log('Essayer de log in')
    console.log(email,mdp)
    const formBody = new URLSearchParams({
      username: email,
      password: mdp,
    }).toString();

    fetch('http://127.0.0.1:8000/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
    .then(async (response) => {
      const data = await response.json().catch(() => null);
      console.log("status", response.status, data);
      return data;
    })
    .catch((error) => {
      console.error("Login request failed:", error);
    })
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={(e) => setMdp(e.target.value)}
              />
            </Form.Group>

            <Button type="submit">Login</Button>
          </Form>
          
        </Card.Body>
      </Card>
    </Container>
  );
}
