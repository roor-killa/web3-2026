import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Liste des produits</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Titre</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Prix</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date Création</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date Update</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.titre}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.prix.toFixed(2)} €</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.date_create}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.date_update}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
