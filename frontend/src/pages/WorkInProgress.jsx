import React from 'react';

// Ce composant accepte une "prop" (pageName) pour afficher le titre correct
const WorkInProgress = ({ pageName }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{pageName}</h1>
      <div style={styles.icon}>🚧</div>
      <p style={styles.text}>Cette page est en cours de construction.</p>
      <p style={styles.subtext}>Revenez plus tard !</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh', // Prend 60% de la hauteur de l'écran pour être bien centré
    textAlign: 'center',
    color: '#333',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    fontWeight: '500',
  },
  subtext: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  }
};

export default WorkInProgress;