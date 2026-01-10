import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ArticleReader = () => {
  const { id } = useParams(); // Récupère le numéro depuis l'URL (ex: /article/1)
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Appel à la route backend publique de lecture
    fetch(`/api/read/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Article introuvable");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={styles.loading}>Chargement de l'article...</div>;
  
  if (error || !article) return (
    <div style={styles.container}>
      <h2>Article introuvable 😕</h2>
      <Link to="/" style={styles.backButton}>Retour à l'accueil</Link>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Bouton retour */}
      <Link to="/" style={styles.backLink}>
        ← Back to the news
      </Link>

      {/* En-tête de l'article */}
      <div style={styles.header}>
        <h1 style={styles.title}>{article.title}</h1>
        <div style={styles.meta}>
          <span>Published  {new Date(article.createdAt).toLocaleDateString()}</span>
          {/* Si tu as le nom du publisher un jour, tu peux l'ajouter ici */}
        </div>
      </div>

      {/* Image principale (la même seed que sur la home pour la cohérence) */}
      <div style={styles.imageWrapper}>
         <img 
            src={`https://picsum.photos/seed/${article.id}/800/400`} 
            alt={article.title} 
            style={styles.heroImage}
         />
      </div>

      {/* Contenu du texte */}
      <div style={styles.content}>
        {/* Cette fonction gère les sauts de ligne stockés en BDD pour créer des paragraphes */}
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} style={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#fff',
    minHeight: '80vh',
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '20px',
    color: '#555',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    textDecoration: 'none',
    color: '#666',
    fontWeight: '500',
    fontSize: '14px',
    border: '1px solid #ddd',
    padding: '5px 15px',
    borderRadius: '20px',
    transition: 'background 0.2s',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '36px', // Gros titre
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: '1.2',
    marginBottom: '15px',
  },
  meta: {
    fontSize: '14px',
    color: '#888',
    borderLeft: '3px solid #E8DCC0', // Rappel de la couleur du header bois
    paddingLeft: '10px',
  },
  imageWrapper: {
    width: '100%',
    height: '300px', // Hauteur de la bannière
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '40px',
    backgroundColor: '#eee',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    fontSize: '18px',
    lineHeight: '1.8', // Bonne hauteur de ligne pour la lecture
    color: '#333',
    textAlign: 'justify', // Justifié pour faire "Journal"
  },
  paragraph: {
    marginBottom: '20px', // Espace entre les paragraphes
  }
};

export default ArticleReader;