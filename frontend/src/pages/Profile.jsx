import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '20px', fontFamily: 'inherit', color: '#5A4A42',
    },
    heading: { fontSize: '2.5rem', marginBottom: '10px', fontWeight: '600' },
    subtext: { fontSize: '1.1rem', marginBottom: '40px', opacity: 0.8, textAlign: 'center', maxWidth: '400px' },
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '300px' },

    loginBtn: {
      backgroundColor: '#E8DCC0', color: '#5A4A42', border: 'none', padding: '18px',
      borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
    },
    registerBtn: {
      backgroundColor: '#2C2C2C', color: '#DDD', border: 'none', padding: '18px',
      borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
    },
    logoutBtn: {
      marginTop: '30px', backgroundColor: 'transparent', border: '2px solid #5A4A42',
      color: '#5A4A42', padding: '10px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold',
    },

    subscriptionBox: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#fdfbf7',
      border: '1px solid #E8DCC0',
      borderRadius: '15px',
      textAlign: 'center',
      width: '100%',
      maxWidth: '350px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    },
    statusLabel: { fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#888', marginBottom: '5px' },
    statusValue: { fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' },
    statusValueInactive: { fontSize: '1.2rem', fontWeight: 'bold', color: '#c0392b' }
  };

  if (user) {
    const formattedDate = formatDate(user.subscriptionExpiresAt);
    const isActive = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();

    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome, {user.name}!</h1>
        <p style={styles.subtext}>
          Logged in as: <strong>{user.email}</strong>
        </p>

        <div style={styles.subscriptionBox}>
          <div style={styles.statusLabel}>Subscription Status</div>

          {isActive ? (
            <>
              <div style={styles.statusValue}>Active Premium Access</div>
              <div style={{marginTop: '5px', fontSize: '0.9rem', opacity: 0.8}}>
                Expires on: {formattedDate}
              </div>
            </>
          ) : (
            <>
              <div style={styles.statusValueInactive}>No Active Subscription</div>
              <div style={{marginTop: '10px', fontSize: '0.9rem'}}>
                Unlock full access now.
              </div>
              <button 
                onClick={() => navigate('/subscribe')}
                style={{...styles.loginBtn, padding: '10px 20px', marginTop: '15px', fontSize: '0.9rem', width: '100%'}}
              >
                Get Subscription
              </button>
            </>
          )}
        </div>

        <button onClick={logout} style={styles.logoutBtn}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Profile</h1>
      <p style={styles.subtext}>
        Access your personal space to manage your subscription and preferences.
      </p>

      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/login')} style={styles.loginBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          Log In
        </button>

        <button onClick={() => navigate('/register')} style={styles.registerBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Create Account
        </button>
      </div>
    </div>
  );
}
