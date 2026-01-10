import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: "NomInutile", 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      localStorage.setItem('token', data.token);
      login(data.user);
      navigate('/profile');

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message); 
    }
  };

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '20px', color: '#5A4A42',
    },
    card: {
      backgroundColor: '#fff', padding: '40px', borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px',
      border: '1px solid #E8DCC0'
    },
    title: { marginBottom: '20px', textAlign: 'center' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' },
    input: {
      width: '100%', padding: '12px', borderRadius: '8px',
      border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box'
    },
    errorMessage: {
      color: '#d9534f',
      backgroundColor: '#f9d6d5',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '14px',
      textAlign: 'center'
    },
    button: {
      width: '100%', padding: '15px', marginTop: '10px',
      backgroundColor: '#E8DCC0',
      color: '#5A4A42', border: 'none', borderRadius: '50px',
      fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
      transition: 'opacity 0.2s'
    },
    link: { display: 'block', marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#5A4A42', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Log In</h2>
        
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              required 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              required 
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" style={styles.button}>Access my Account</button>
        </form>
        <span style={styles.link} onClick={() => navigate('/register')}>
          No account? Create one here.
        </span>
      </div>
    </div>
  );
}
