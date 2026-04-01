"use client";

import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Certificat {
  id: number;
  identifiant: string;
  nom_etudiant: string;
  intitule: string;
  date_emission: string;
  hash_blockchain: string;
}

export default function Home() {
  const router = useRouter();
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const API_BASE_URL = "http://localhost:8000/api";
  
        

  useEffect(() => {
    fetch(`${API_BASE_URL}/certificats`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setCertificats(Array.isArray(data) ? data : data.data ?? []))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/certificats/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message ?? "Suppression impossible");
    }

    setCertificats((prev) => prev.filter((p) => p.id !== id));
  };


  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Les certificats</h1>
        <Button variant="primary" onClick={() => router.push("/formulaire")}>
          Ajouter
        </Button>
      </div>

      <Table striped bordered hover responsive variant="light">
        <thead>
          <tr>
            <th>ID</th>
            <th>Identifiant</th>
            <th>nom_etudiant</th>
            <th>intitule</th>
            <th>date_emission</th>
            <th>hash_blockchain</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificats.map((certificat) => (
            <tr key={certificat.id}>
              <td>{certificat.id}</td>
              <td>{certificat.identifiant}</td>
              <td>{certificat.nom_etudiant}</td>
              <td>{certificat.intitule}</td>
              <td>{certificat.date_emission}</td>
              <td>{certificat.hash_blockchain}</td>
              <td> 
                  <Button variant="danger" size="sm" onClick={() => handleDelete(certificat.id)}>
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