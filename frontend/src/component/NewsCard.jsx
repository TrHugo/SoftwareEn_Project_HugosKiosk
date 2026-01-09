import React from 'react';

const NewsCard = ({ title, description, image }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {/* L'image est passée en prop, ou une image par défaut si vide */}
        <img 
          src={image || "https://placehold.co/600x400/EEE/31343C?text=No+Image"} 
          alt={title} 
          style={styles.image} 
        />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>
          {description}
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', 
    border: '1px solid rgba(0,0,0,0.02)', // Légère bordure subtile
  },
  imageContainer: {
    height: '160px', // Hauteur fixe pour l'image
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // L'image remplit la zone sans être déformée
    transition: 'transform 0.5s ease',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#222',
    lineHeight: '1.3',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    // Technique CSS pour limiter à 3 lignes et mettre "..."
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }
};

export default NewsCard;