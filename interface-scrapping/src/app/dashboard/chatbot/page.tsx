

"use client";

import { type FormEvent, useEffect, useState } from "react";
import { karibFetch, readErrorMessage } from "@/lib/karibdocs-api";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  created_at?: string;
};

type AskResponse = {
  session_id: number;
  answer: string;
  sources: string[];
  chunks_used: number;
};

type ChatSession = {
  id: number;
  title: string;
  created_at: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[] | string;
  created_at: string;
};

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: "assistant", content: "Bonjour, je suis connecte a KaribDocs. Pose ta question." },
  ]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      setIsLoadingSessions(true);

      try {
        const response = await karibFetch("/chat/sessions");

        if (!response.ok) {
          throw new Error(await readErrorMessage(response, "Impossible de charger les sessions."));
        }

        const data = (await response.json()) as ChatSession[];
        setSessions(Array.isArray(data) ? data : []);

        if (!sessionId && Array.isArray(data) && data.length > 0) {
          setSessionId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les sessions.");
      } finally {
        setIsLoadingSessions(false);
      }
    }

    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    async function loadMessages() {
      try {
        const response = await karibFetch(`/chat/sessions/${sessionId}/messages`);

        if (!response.ok) {
          throw new Error(await readErrorMessage(response, "Impossible de charger l'historique."));
        }

        const data = (await response.json()) as ChatMessage[];
        const history = Array.isArray(data)
          ? data.map((entry) => ({
              role: entry.role,
              content: entry.content,
              sources: Array.isArray(entry.sources)
                ? entry.sources
                : typeof entry.sources === "string" && entry.sources
                  ? JSON.parse(entry.sources)
                  : undefined,
              created_at: entry.created_at,
            }))
          : [];

        setMessages(
          history.length > 0
            ? history
            : [{ role: "assistant", content: "Cette session ne contient pas encore de messages." }],
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger l'historique.");
      }
    }

    loadMessages();
  }, [sessionId]);

  function startNewSession() {
    setSessionId(null);
    setMessages([{ role: "assistant", content: "Nouvelle conversation. Pose ta question a KaribDocs." }]);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ConversationMessage = { role: "user", content: trimmed };
    setMessages((previous) => [...previous, userMessage]);
    setMessage("");
    setError(null);
    setIsSending(true);

    try {
      const response = await karibFetch("/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmed,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
      }

      const data = (await response.json()) as AskResponse;
      setSessionId(data.session_id);
      setSessions((previous) => {
        const remaining = previous.filter((entry) => entry.id !== data.session_id);
        return [
          {
            id: data.session_id,
            title: trimmed.slice(0, 50),
            created_at: new Date().toISOString(),
          },
          ...remaining,
        ];
      });
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur pendant l'envoi du message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="container py-4 d-flex flex-column" style={{ minHeight: "calc(100vh - 96px)" }}>
      <header className="mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h1 className="h4 mb-1">Chatbot KaribDocs</h1>
            <p className="text-body-secondary mb-0">Connecte a /chat/ask, avec historique des sessions et messages.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={startNewSession}>
            Nouvelle session
          </button>
        </div>
      </header>

      <div className="row g-3 flex-grow-1 mb-3">
        <aside className="col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column gap-3">
              <div>
                <h2 className="h6 mb-1">Sessions</h2>
                <p className="text-body-secondary small mb-0">Historique des conversations KaribDocs.</p>
              </div>

              {isLoadingSessions && <div className="text-body-secondary small">Chargement des sessions...</div>}

              <div className="d-grid gap-2 overflow-auto" style={{ maxHeight: 420 }}>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`btn text-start ${session.id === sessionId ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSessionId(session.id)}
                  >
                    <div className="fw-semibold">{session.title || `Session ${session.id}`}</div>
                    <div className="small opacity-75">#{session.id}</div>
                  </button>
                ))}

                {!isLoadingSessions && sessions.length === 0 && (
                  <div className="text-body-secondary small">Aucune session pour le moment.</div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <section className="col-lg-9">
          <div className="card h-100 overflow-hidden">
            <div className="card-body d-flex flex-column gap-3 overflow-auto" style={{ minHeight: 420 }}>
              {messages.map((entry, index) => (
                <div
                  key={`${entry.role}-${index}`}
                  className={
                    entry.role === "user"
                      ? "align-self-end bg-primary text-white rounded-3 px-3 py-2"
                      : "align-self-start bg-light rounded-3 px-3 py-2"
                  }
                  style={{ maxWidth: "85%", whiteSpace: "pre-wrap" }}
                >
                  {entry.content}
                  {entry.role === "assistant" && entry.sources && entry.sources.length > 0 && (
                    <div className="mt-2 small text-body-secondary">
                      Sources: {entry.sources.join(", ")}
                    </div>
                  )}
                </div>
              ))}
              {isSending && <div className="text-body-secondary small">Generation de la reponse...</div>}
            </div>
          </div>
        </section>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form className="mt-auto" onSubmit={sendMessage}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Ecris un message..."
            aria-label="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSending}
          />
          <button type="submit" className="btn btn-primary" disabled={isSending || !message.trim()}>
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
