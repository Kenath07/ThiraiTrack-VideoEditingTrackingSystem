import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import api from '../api/axios';

// Floating AI chatbot component for task assistance
const Chatbot = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');
  const messagesEndRef              = useRef(null);

  // Load chat history on mount
  useEffect(() => { loadChatHistory(); }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/api/chat/history');
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/api/chat', { message: inputValue });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      const errorDetails = err.response?.data?.details || err.response?.data?.error || err.message;
      setError(`Error: ${errorDetails}`);
      console.error('Chat error details:', err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear chat history?')) return;
    try {
      await api.delete('/api/chat');
      setMessages([]);
      setError('');
    } catch (err) {
      setError('Failed to clear history');
      console.error('Clear history error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">

      {/* Chat window */}
      {isOpen && (
        <div
          className="mb-4 w-96 bg-card border border-border rounded-2xl flex flex-col h-[420px] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-glow)' }}
        >
          {/* Header */}
          <div
            className="text-primary-foreground px-5 py-4 flex justify-between items-center flex-shrink-0"
            style={{ background: 'var(--gradient-hero)' }}
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <h3 className="font-bold text-sm">ThiraiTrack Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-40" />
                <p className="font-medium">Hi! I'm ThiraiTrack Assistant.</p>
                <p className="text-xs mt-1">Ask me about your tasks, projects, or deadlines.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm break-words ${
                    msg.role === 'user'
                      ? 'text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                  }`}
                  style={msg.role === 'user' ? { background: 'var(--gradient-hero)' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: 'var(--primary)', animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-destructive text-xs p-2 bg-destructive/10 rounded-xl">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clear history */}
          {messages.length > 0 && (
            <div className="border-t border-border px-4 py-2 bg-secondary/30 flex-shrink-0">
              <button
                onClick={clearHistory}
                className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} />
                Clear history
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 bg-card flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything…"
                disabled={isLoading}
                className="flex-1 px-3 py-2.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="text-primary-foreground p-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: 'var(--gradient-hero)' }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full text-primary-foreground flex items-center justify-center transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{
          background: isOpen ? 'oklch(0.4 0.04 265)' : 'var(--gradient-hero)',
          boxShadow: 'var(--shadow-glow)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default Chatbot;
