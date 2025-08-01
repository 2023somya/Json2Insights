import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AILandingPage = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiChatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user question to history immediately
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      
      const response = await axios.post('http://localhost:8000/ask-ai', {
        prompt: prompt
      });
      
      // Add AI response to history
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.answer,
        timestamp: new Date().toISOString(),
        contextUsed: response.data.context_used
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setPrompt('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get AI analysis');
      console.error('AI analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setChatHistory([]);
      localStorage.removeItem('aiChatHistory');
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 100px)'
    }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>💰 AI Financial Analyst</h1>
      
      {/* Chat History Display */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        {chatHistory.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#6c757d'
          }}>
            No chat history yet. Ask your first question!
          </div>
        ) : (
          chatHistory.map((message) => (
            <div 
              key={message.id}
              style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: message.type === 'user' ? '#e2f0fd' : '#e8f5e9',
                borderLeft: `4px solid ${message.type === 'user' ? '#2196f3' : '#4caf50'}`,
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                marginLeft: message.type === 'user' ? 'auto' : '0',
                marginRight: message.type === 'user' ? '0' : 'auto'
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                {message.type === 'user' ? 'You' : 'AI Analyst'}
              </div>
              <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
              {message.type === 'ai' && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6c757d', 
                  marginTop: '0.5rem',
                  fontStyle: 'bold'
                }}>
                  {message.contextUsed ? '✓ Used financial data' : '⚠ No context available'} • {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                minHeight: '80px',
                resize: 'none'
              }}
              placeholder="Ask about revenue trends, variances, or comparisons..."
              disabled={isLoading}
            />
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {chatHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '0.5rem'
                  }}
                >
                  Clear History
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                opacity: isLoading || !prompt.trim() ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <span 
                    style={{
                      display: 'inline-block',
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.5rem'
                    }}
                  />
                  Analyzing...
                </>
              ) : 'Ask AI'}
            </button>
          </div>
        </form>
        
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #6c757d',
            color: '#6c757d',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Quarterly Analysis
        </button>
      </div>
    </div>
  );
};

export default AILandingPage;