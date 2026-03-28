

export default function ChatbotPage() {
  return (
    <div className="container py-4 d-flex flex-column" style={{ minHeight: "calc(100vh - 96px)" }}>
      <header className="mb-3">
        <h1 className="h4 mb-1">Chatbot</h1>
        <p className="text-body-secondary mb-0">Pose tes questions ici.</p>
      </header>

      <section className="card flex-grow-1 mb-3 overflow-hidden">
        <div className="card-body d-flex flex-column gap-3 overflow-auto">

            #EXAMPLE
            <div className="align-self-start bg-light rounded-3 px-3 py-2" style={{ maxWidth: "80%" }}>
                Bonjour, comment je peux t&apos;aider ?
            </div>
            <div className="align-self-end bg-primary text-white rounded-3 px-3 py-2" style={{ maxWidth: "80%" }}>
                Montre-moi les dernieres donnees scrapees.
            </div>
        </div>
      </section>

      <form className="mt-auto">
        <div className="input-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label="Ajouter une piece jointe"
            title="Ajouter"
          >
            +
          </button>
          <input
            type="text"
            className="form-control"
            placeholder="Ecris un message..."
            aria-label="Message"
          />
          <button type="submit" className="btn btn-primary">
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
