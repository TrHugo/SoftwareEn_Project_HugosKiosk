import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- STYLES (Inspirés du Header et Footer) ---
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh', // Prend de la place verticalement pour centrer
      padding: '20px',
      fontFamily: 'inherit',
      color: '#5A4A42', // Couleur texte du Header
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '10px',
      fontWeight: '600',
    },
    subtext: {
      fontSize: '1.1rem',
      marginBottom: '40px',
      opacity: 0.8,
      textAlign: 'center',
      maxWidth: '400px',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '300px', // Largeur max des boutons
    },
    // BOUTON LOGIN : Style "Header" (Beige)
    loginBtn: {
      backgroundColor: '#E8DCC0', // Couleur fond Navbar
      color: '#5A4A42',           // Couleur texte Navbar
      border: 'none',
      padding: '18px',
      borderRadius: '50px',       // Forme arrondie Navbar
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.1s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    // BOUTON REGISTER : Style "Footer" (Dark)
    registerBtn: {
      backgroundColor: '#2C2C2C', // Couleur fond Footer
      color: '#DDD',              // Couleur texte Footer
      border: 'none',
      padding: '18px',
      borderRadius: '50px',       // On garde la forme arrondie du Header pour la cohérence
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    logoutBtn: {
      marginTop: '20px',
      backgroundColor: 'transparent',
      border: '2px solid #5A4A42',
      color: '#5A4A42',
      padding: '10px 20px',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  // --- ETAT CONNECTÉ ---
  if (user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome, {user.name}!</h1>
        <p style={styles.subtext}>
          You are currently logged in with: <br/> 
          <strong>{user.email}</strong>
        </p>
        
        <button onClick={logout} style={styles.logoutBtn}>
          Log Out
        </button>
      </div>
    );
  }

  // --- ETAT DÉCONNECTÉ (Login / Register) ---
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Profile</h1>
      <p style={styles.subtext}>
        Access your personal space to manage your subscription and preferences.
      </p>
      
      <div style={styles.buttonGroup}>
        {/* Bouton style Header */}
        <button 
          onClick={() => navigate('/login')} 
          style={styles.loginBtn}
        >
          {/* Petite icône SVG pour le style */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          Log In
        </button>

        {/* Bouton style Footer */}
        <button 
          onClick={() => navigate('/register')} 
          style={styles.registerBtn}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Create Account
        </button>
      </div>
    </div>
  );
}