'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './scraper.module.css';

const API_BASE = 'http://localhost:8000/api';

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatbotTab({ getAuthHeaders, showMessage }: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      text: '👋 Bonjour! Je suis le chatbot du scraper Kiprix. Comment puis-je vous aider?\n\nVoici quelques questions que vous pouvez me poser:\n• Comment va le système?\n• Quelles sont les configurations?\n• Quels sont les horaires planifiés?\n• Montre-moi l\'historique des exécutions\n• Quels sont les territoires disponibles?',
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chatbot/ask`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ question: inputText }),
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        type: 'bot',
        text: data.response || 'Je n\'ai pas compris votre question. Pouvez-vous reformuler?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: ChatMessage = {
        type: 'bot',
        text: '❌ Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'bot',
        text: '👋 Bonjour! Je suis le chatbot du scraper Kiprix. Comment puis-je vous aider?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className={styles.tabContent}>
      <h2>🤖 Chatbot - Questions sur le Scraper</h2>

      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.chatMessage} ${
                msg.type === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageContent}>
                {msg.type === 'bot' && <span className={styles.botIcon}>🤖</span>}
                <div className={styles.messageText}>
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                {msg.type === 'user' && <span className={styles.userIcon}>👤</span>}
              </div>
              <div className={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.chatMessage} ${styles.botMessage}`}>
              <div className={styles.messageContent}>
                <span className={styles.botIcon}>🤖</span>
                <div className={styles.messageText}>
                  <span className={styles.typingIndicator}>
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              className={styles.chatInput}
              placeholder="Posez votre question ici... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className={styles.chatActions}>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? '⏳ Traitement...' : '📤 Envoyer'}
            </button>
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={clearChat}
              disabled={isLoading}
            >
              🗑️ Effacer Chat
            </button>
          </div>
        </div>
      </div>

      <div className={styles.helpBox}>
        <h3>💡 Suggestions de Questions</h3>
        <div className={styles.suggestionGrid}>
          {[
            'Comment va le système?',
            'Quelles sont les configurations actuelles?',
            'Quels horaires sont planifiés?',
            'Montre-moi le dernier historique',
            'Quel est le statut des territoires?',
            'Aide du chatbot',
          ].map((question, idx) => (
            <button
              key={idx}
              className={styles.suggestionButton}
              onClick={() => {
                setInputText(question);
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
