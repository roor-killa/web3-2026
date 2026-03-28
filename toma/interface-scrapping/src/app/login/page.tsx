

"use client";

import { useState, type FormEvent } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";


export default function LoginPage() {

const [email,setEmail] = useState('')
  const [mdp,setMdp] = useState('')
  const API_BASE_URL = "http://localhost:8000";
  const router = useRouter();


  function Login(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    console.log('Essayer de log in')
    console.log('TESTESGA')
    console.log(email,mdp)
    const formBody = new URLSearchParams({
      username: email,
      password: mdp,
    }).toString();

    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
    .then(async (response) => {
      const data = await response.json().catch(() => null);
      console.log("status", response.status, data);

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        if (data?.access_token) {
          localStorage.setItem("accessToken", data.access_token);
        }
        // router.push("/");
      }

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

            <Form.Group className="mb-3 flex-column flex gap-2">
              <Button type="submit">Login</Button>
              <Button type="button" onClick={() => {router.push('/register')}}>Register</Button>  
            </Form.Group>
          </Form>
          
        </Card.Body>
      </Card>
    </Container>
  );
}