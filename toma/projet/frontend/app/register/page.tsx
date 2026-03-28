

"use client";

import { useState, type FormEvent } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const [nom,setNom] = useState('')
  const [telephone,setTelephone] = useState('')
  const [email,setEmail] = useState('')
  const [mdp,setMdp] = useState('')
	const API_BASE_URL = "http://localhost:8000";

  const router = useRouter()

  function Register(e: FormEvent<HTMLFormElement>){
	e.preventDefault()
	console.log('Essayer de log in')
	console.log(nom,telephone,email,mdp)

	fetch(`${API_BASE_URL}/auth/register`, {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
	  },
	  body: JSON.stringify({
		nom: nom,
		telephone: telephone,
		email: email,
		mot_de_passe: mdp,
	  }),
	})
	.then(async (response) => {
	  const data = await response.json().catch(() => null);
	  console.log("status", response.status, data);
	  if (response.status === 201) {
		router.push('/login')
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
		<Card.Title className="text-center">Register</Card.Title>
		<Card.Body>
		  <Form onSubmit={Register}>

			<Form.Group className="mb-3">
			  <Form.Label>Nom</Form.Label>
			  <Form.Control
				required
				type="text"
				onChange={(e) => setNom(e.target.value)}
			  />
			</Form.Group>

			<Form.Group className="mb-3">
			  <Form.Label>Telephone</Form.Label>
			  <Form.Control
				required
				type="text"
				onChange={(e) => setTelephone(e.target.value)}
			  />
			</Form.Group>

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

			<Button type="submit">Register</Button>
		  </Form>
		  
		</Card.Body>
	  </Card>
	</Container>
  );
}
