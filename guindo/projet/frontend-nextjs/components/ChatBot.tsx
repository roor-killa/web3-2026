"use client";

import { useState, useRef, useEffect } from "react";
import { getFastapiToken } from "@/lib/fastapi";

const FASTAPI = "http://localhost:8000/api/v1";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  intent?: string;
}

const TERRITORIES = [
  { value: "", label: "Tous les territoires" },
  { value: "mq", label: "🇲🇶 Martinique" },
  { value: "gp", label: "🇬🇵 Guadeloupe" },
  { value: "re", label: "🇷🇪 Réunion" },
  { value: "gf", label: "🇬🇫 Guyane" },
];

const SUGGESTIONS = [
  "Produits les moins chers en Martinique ?",
  "Quels produits ont le plus grand écart de prix ?",
  "Résumé des données disponibles",
  "Comparer les prix de l'huile",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant Kiprix 🌺\nPosez-moi des questions sur les prix des produits en France et dans les DOM.",
    },
  ]);
  const [input, setInput] = useState("");
  const [territory, setTerritory] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question?: string) => {
    const text = (question || input).trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${FASTAPI}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getFastapiToken()}`,
        },
        body: JSON.stringify({
          question: text,
          territory: territory || null,
          provider: "ollama",
          model: "llama3",
        }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          provider: data.provider,
          intent: data.intent,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Erreur : ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[640px] rounded-xl overflow-hidden"
      style={{
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 40px rgba(2, 9, 27, 0.5)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <p className="font-bold text-white text-sm">Assistant Kiprix</p>
            <p className="text-xs text-indigo-200">Comparateur DOM / France</p>
          </div>
        </div>
        <select
          value={territory}
          onChange={(e) => setTerritory(e.target.value)}
          className="text-xs rounded-lg px-3 py-1.5 font-medium"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "white",
          }}
        >
          {TERRITORIES.map((t) => (
            <option key={t.value} value={t.value} style={{ background: "#1e293b" }}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                🤖
              </div>
            )}
            <div className="max-w-[80%]">
              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "white",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "rgba(30, 41, 59, 0.9)",
                        border: "1px solid rgba(148,163,184,0.15)",
                        color: "#e2e8f0",
                        borderBottomLeftRadius: "4px",
                      }
                }
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.provider && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  {msg.intent === "analytical" && (
                    <span className="badge-info text-xs px-2 py-0.5 rounded-full">
                      🔍 SQL
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    via {msg.provider}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              🤖
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-sm"
              style={{
                background: "rgba(30, 41, 59, 0.9)",
                border: "1px solid rgba(148,163,184,0.15)",
                color: "#94a3b8",
                borderBottomLeftRadius: "4px",
              }}
            >
              <span className="animate-pulse">⏳ Analyse en cours...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap"
          style={{ borderTop: "1px solid rgba(148,163,184,0.1)" }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs rounded-full px-3 py-1.5 transition-all"
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#a5b4fc",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 flex gap-2"
        style={{ borderTop: "1px solid rgba(148,163,184,0.15)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Posez votre question sur les prix..."
          disabled={loading}
          className="flex-1 input-field text-sm"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
