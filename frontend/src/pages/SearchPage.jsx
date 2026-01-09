import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../component/NewsCard'; // On réutilise tes cartes existantes !

const SearchPage = () => {
  const [query, setQuery] = useState(''); // Ce que l'utilisateur tape
  const [results, setResults] = useState([]); // Les articles trouvés
  const [hasSearched, setHasSearched] = useState(false); // Pour savoir si on affiche "Aucun résultat"
  const [loading, setLoading] = useState(false);

  // Fonction appelée quand on clique sur la loupe ou qu'on tape Entrée
  const handleSearch = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (!query.trim()) return; // Ne cherche pas si vide

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Search</h1>
      
      {/* --- Barre de recherche --- */}
      <form onSubmit={handleSearch} style={styles.searchBarContainer}>
        <input 
          type="text" 
          placeholder="Search for articles, topics..." 
          style={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" style={styles.searchButton}>
          {/* Icône Loupe SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {/* --- Résultats --- */}
      <div style={styles.resultsArea}>
        {loading && <p style={styles.message}>Recherche en cours...</p>}

        {!loading && hasSearched && results.length === 0 && (
          <p style={styles.message}>Aucun résultat trouvé pour "{query}" 😕</p>
        )}

        <div style={styles.grid}>
          {results.map((article) => (
            <Link 
              key={article.id || article._id} 
              to={`/article/${article.id}`} 
              style={{ textDecoration: 'none' }}
            >
              <NewsCard 
                title={article.title}
                description={article.content.substring(0, 100) + "..."} 
                image={`https://picsum.photos/seed/${article.id}/500/300`}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

const styles = {
  container: {
    padding: '0 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centre tout horizontalement
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  searchBarContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: '50px', // Très arrondi (pill shape)
    padding: '10px 20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', // Belle ombre douce
    width: '100%',
    maxWidth: '600px',
    marginBottom: '50px',
    border: '1px solid #eee',
    transition: 'box-shadow 0.3s',
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    flex: 1, // Prend toute la place disponible
    color: '#333',
    backgroundColor: 'transparent',
  },
  searchButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    transition: 'color 0.2s',
  },
  resultsArea: {
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    width: '100%',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: '18px',
    marginTop: '20px',
  }
};

export default SearchPage;