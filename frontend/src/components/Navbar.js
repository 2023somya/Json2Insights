import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ 
      padding: '1rem', 
      borderBottom: '1px solid #ccc', 
      display: 'flex', 
      gap: '1rem',
      backgroundColor: '#f8f9fa'
    }}>
      <Link 
        to="/dashboard" 
        style={{ 
          fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal',
          color: location.pathname === '/dashboard' ? '#1890ff' : '#333'
        }}
      >
        QoQ Analysis
      </Link>
      <Link 
        to="/dashboard/ask-ai"
        style={{ 
          fontWeight: location.pathname === '/dashboard/ask-ai' ? 'bold' : 'normal',
          color: location.pathname === '/dashboard/ask-ai' ? '#1890ff' : '#333'
        }}
      >
        Ask-AI
      </Link>

      <Link 
        to="/"
        style={{ 
          fontWeight: location.pathname === '/' ? 'bold' : 'normal',
          color: location.pathname === '/' ? '#1890ff' : '#333'
        }}
      >
        Upload-Again
      </Link>
    </nav>
  );
};

export default Navbar;