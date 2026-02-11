async function getProducts() {
  const res = await fetch("http://localhost:8000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur API Laravel");
  }

  return res.json();
}

// Petite fonction pour formater les dates
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR");
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Produits</h1>

      <div>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "10px",
              background: "#000000",
            }}
          >
            <p><strong>ID :</strong> {p.id}</p>

            <h3>{p.titre}</h3>
            <p>{p.description}</p>

            <p><strong>Prix :</strong> {p.prix} €</p>

            <hr />

            <p style={{ fontSize: "0.85rem", color: "#ffffff" }}>
              <strong>Créé le :</strong> {formatDate(p.date_create)}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#ffffff" }}>
              <strong>Mis à jour le :</strong> {formatDate(p.date_update)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

