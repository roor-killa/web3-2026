export default function Home() {
    return (
        <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1>Hello World!</h1>
            <h2>Frontend Next.js - Web3 2026</h2>
            <p>Bienvenue sur le frontend du projet!</p>

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
