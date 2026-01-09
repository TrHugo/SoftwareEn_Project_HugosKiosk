import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // SIMULATION BACKEND : On crée un faux utilisateur
    const fakeUser = {
      name: "Utilisateur Test",
      email: email,
      token: "123456"
    };
    
    // On appelle la fonction du AuthContext
    login(fakeUser);
    
    // On redirige vers le profil
    navigate('/profile');
  };

  // --- STYLES ---
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
      border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' // Important pour ne pas dépasser
    },
    button: {
      width: '100%', padding: '15px', marginTop: '10px',
      backgroundColor: '#E8DCC0', // BEIGE (Header)
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