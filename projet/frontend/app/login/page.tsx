"use client";

import { useState, type FormEvent } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [email,setEmail] = useState('')
  const [mdp,setMdp] = useState('')
  const API_BASE_URL = "http://localhost:8000";
  const router = useRouter();

  function decodeJwtUserId(token?: string): number | null {
    if (!token) return null;

    try {
      const [, payloadPart] = token.split(".");
      if (!payloadPart) return null;

      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(normalized)) as {
        user_id?: number | string;
        id?: number | string;
        sub?: number | string;
      };

      const candidate = payload.user_id ?? payload.id ?? payload.sub;
      if (candidate === undefined || candidate === null) return null;

      const parsed = Number(candidate);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  }

  function storeCurrentUserId(data: unknown) {
    const authData = (data ?? {}) as {
      user?: { id?: number | string };
      id?: number | string;
      user_id?: number | string;
      sub?: number | string;
      access_token?: string;
    };

    const userId =
      authData.user?.id ??
      authData.id ??
      authData.user_id ??
      authData.sub ??
      decodeJwtUserId(authData.access_token) ??
      null;

    if (userId !== null && userId !== undefined) {
      localStorage.setItem("currentUserId", String(userId));
      const rawCurrentUser = localStorage.getItem("currentUser");
      if (rawCurrentUser) {
        try {
          const parsedCurrentUser = JSON.parse(rawCurrentUser) as {
            id?: number | string | null;
            nom?: string | null;
            email?: string | null;
          };
          parsedCurrentUser.id = userId;
          localStorage.setItem("currentUser", JSON.stringify(parsedCurrentUser));
        } catch {
          // ignore malformed stored data
        }
      }
    }
  }

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
        storeCurrentUserId(data);
        const currentUser = {
          id: data?.user?.id ?? data?.id ?? data?.user_id ?? data?.sub ?? null,
          nom: data?.user?.nom ?? data?.nom ?? null,
          email: data?.user?.email ?? data?.email ?? email,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        router.push("/");
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

            <Button type="submit">Login</Button>
          </Form>
          
        </Card.Body>
      </Card>
    </Container>
  );
}
