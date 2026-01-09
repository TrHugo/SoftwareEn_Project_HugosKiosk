import React from 'react';

const Legal = () => {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Legal Information</h1>
      <div style={styles.card}>
        <p style={styles.text}>
          Whatever legal informations we need to publish, to continue later.
        </p>
        <ul style ={styles.text}>
          <li>When you buy there is no refund.</li>
          <li>Do not share your account.</li>
          <li>We are not responsible once you lose your account.</li>
        </ul> 
      </div>
    </main>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  text: {
    fontSize: '18px',
    color: '#555',
  }
};

export default Legal;