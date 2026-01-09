import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../component/NewsCard';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel à ta nouvelle route backend publique
    fetch('/api/latest')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur réseau lors de la récupération des articles');
        }
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.centerMessage}>Chargement des dernières news...</div>;
  if (error) return <div style={styles.centerMessage}>Oups ! Impossible de charger les articles.</div>;

  return (
    <main style={styles.mainContent}>
      <h1 style={styles.pageTitle}>Latest news</h1>
      
      {articles.length === 0 ? (
        <p>Aucun article publié pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {articles.map((article) => (
            // IMPORTANT : On utilise le Link pour aller vers /article/ID
            // Note: On utilise article.id (ton ID numérique) et pas _id
            <Link 
              key={article.id || article._id} 
              to={`/article/${article.id}`} 
              style={{ textDecoration: 'none' }}
            >
              <NewsCard 
                title={article.title}
                // On prend les 100 premiers caractères pour l'aperçu si pas de description dédiée
                description={article.content ? article.content.substring(0, 120) + "..." : "Lire l'article"}
                // Génération d'image pseudo-aléatoire basée sur l'ID de l'article
                image={`https://picsum.photos/seed/${article.id}/600/400`}
              />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    padding: '0 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '60vh',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    borderBottom: '3px solid #333',
    display: 'inline-block',
    paddingBottom: '5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Responsive automatique
    gap: '30px',
    paddingBottom: '40px',
  },
  centerMessage: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '18px',
    color: '#666',
  }
};

export default Home;