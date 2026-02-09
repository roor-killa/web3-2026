export default function Home() {
    return (
        <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Hello World!</h1>
            <h2>Frontend Next.js - Web3 2026</h2>
            <p>Bienvenue sur le frontend du projet!</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>Pages disponibles:</h2>
                <ul>
                    <li><a href="/login" style={{ color: '#667eea', textDecoration: 'underline' }}>Formulaire de connexion</a></li>
                    <li><a href="/products" style={{ color: '#667eea', textDecoration: 'underline' }}>Liste des produits</a></li>
                </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Services disponibles:</h2>
                <ul>
                    <li>Backend Laravel: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></li>
                    <li>Backend FastAPI: <a href="http://localhost:8001" target="_blank">http://localhost:8001</a></li>
                    <li>pgAdmin: <a href="http://localhost:8081" target="_blank">http://localhost:8081</a></li>
                </ul>
            </div>
        </main>
    );
}
