import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Header = () => {
  return (
    <div style={styles.headerContainer}>
      <nav style={styles.navbar}>
        
        {/* 1. Menu -> Pointe vers l'accueil "/" */}
        <Link to="/" style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span style={styles.navText}>Menu</span>
        </Link>

        {/* 2. Profile -> Pointe vers "/profile" (Route: MyProfile) */}
        <Link to="/profile" style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span style={styles.navText}>Profile</span>
        </Link>

        {/* 3. Subscribing -> Pointe vers "/subscribe" (Route: Subscription) */}
        <Link to="/subscribe" style={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span style={styles.navText}>Subscribing</span>
        </Link>

        {/* 4. Search -> Pointe vers "/search" (Route: Search) */}
        <Link to="/search" style={styles.navItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span style={styles.navText}>Search</span>
        </Link>

      </nav>
    </div>
  );
};

const styles = {
  headerContainer: {
    position: 'sticky',
    top: '20px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px',
    marginBottom: '40px',
  },
  navbar: {
    backgroundColor: '#E8DCC0',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '50px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#5A4A42',
    textDecoration: 'none',
    gap: '4px',
  },
  navText: {
    fontSize: '12px',
    fontWeight: '500',
  }
};

export default Header;