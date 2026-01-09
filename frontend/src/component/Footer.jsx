import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div style={styles.footer}>
      {/* 1. Lien vers Contacts */}
      <Link to="/contacts" style={styles.link}>Contacts</Link>
      
      {/* 2. Lien vers Legal */}
      <Link to="/legal" style={styles.link}>Legal</Link>
      
      <Link to="/version" style={styles.link}>Version</Link>
      <Link to="/info" style={styles.link}>Infos</Link>
    </div>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2C2C2C',
    color: '#DDD',
    padding: '20px',
    
    /* Marges latérales et collage en bas */
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '0px',
    
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '14px',
    
    borderTopLeftRadius: '20px', 
    borderTopRightRadius: '20px',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  link: {
    cursor: 'pointer',
    opacity: 0.8,
    fontWeight: '500',
    textDecoration: 'none', // Pas de soulignement
    color: 'inherit',       // Garde la couleur du parent
    transition: 'opacity 0.2s', // Petit effet au survol
  }
};

export default Footer;