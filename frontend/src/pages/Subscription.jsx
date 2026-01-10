import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      id: 1,
      name: "Discovery",
      price: "3.99€",
      duration: "/ week",
      tagline: "Just passing through?",
      description: "Perfect for short-term access. Unlock all articles for 7 days. Cancel anytime.", // Texte légèrement raccourci
      savingsText: null,
      isHighlight: false
    },
    {
      id: 2,
      name: "Regular",
      price: "9.99€",
      duration: "/ month",
      tagline: "Stay ahead of the curve.",
      description: "The flexible choice. Enjoy full access with significant savings vs weekly.",
      savingsText: "Save 37% vs Weekly",
      isHighlight: false
    },
    {
      id: 3,
      name: "Premium",
      price: "99.99€",
      duration: "/ year",
      tagline: "Best Value - All Access",
      description: "For the serious reader. Uninterrupted access all year round.",
      savingsText: "Save 52% vs Weekly",
      isHighlight: true
    }
  ];

  const handleSubscribe = (plan) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/payment', { state: { plan: plan } });
    }
  };

  // --- STYLES COMPACTS ---
  const styles = {
    pageContainer: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      // ON RÉDUIT ICI : Moins de padding en haut (10px au lieu de 40px)
      padding: '0px 20px 40px 20px', 
      color: '#5A4A42', 
      // On retire minHeight pour laisser le contenu dicter la hauteur si besoin, 
      // mais sur un grand écran ça n'impacte pas.
    },
    header: { 
      textAlign: 'center', 
      // ON RÉDUIT ICI : Marge drastiquement réduite (20px au lieu de 50px)
      marginBottom: '20px' 
    },
    title: { 
      // ON RÉDUIT ICI : Titre un peu plus petit
      fontSize: '2rem', 
      fontWeight: 'bold', 
      marginBottom: '5px' 
    },
    subtitle: { 
      fontSize: '1rem', 
      opacity: 0.8 
    },
    cardsContainer: {
      display: 'flex', justifyContent: 'center', alignItems: 'stretch',
      gap: '20px', // Gap un peu plus serré
      flexWrap: 'wrap', width: '100%', maxWidth: '1100px', // Max width un peu réduit
    },
    card: (isHighlight) => ({
      backgroundColor: isHighlight ? '#5A4A42' : '#FFF',
      color: isHighlight ? '#E8DCC0' : '#5A4A42',
      border: isHighlight ? 'none' : '1px solid #E8DCC0',
      borderRadius: '20px', 
      // ON RÉDUIT ICI : Padding interne de la carte (25px au lieu de 40px)
      padding: '25px 20px', 
      width: '300px', 
      // ON RÉDUIT ICI : Hauteur minimale réduite (420px au lieu de 520px)
      minHeight: '420px', 
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)', position: 'relative',
      transition: 'transform 0.2s',
    }),
    planName: { 
      fontSize: '1.3rem', // Légèrement réduit
      fontWeight: 'bold', 
      marginBottom: '5px', 
      textTransform: 'uppercase', 
      letterSpacing: '1px' 
    },
    savingBadge: (isHighlight) => ({
      fontSize: '0.85rem',
      fontWeight: 'bold',
      color: isHighlight ? '#FFF' : '#27ae60',
      marginBottom: '5px', // Réduit
      display: 'block',
      minHeight: '20px'
    }),
    priceContainer: { 
      marginBottom: '15px', // Réduit
      borderBottom: '1px solid currentColor', 
      paddingBottom: '15px' // Réduit
    },
    price: { 
      fontSize: '2.5rem', // ON RÉDUIT ICI : (2.5rem au lieu de 3rem)
      fontWeight: '700' 
    },
    duration: { fontSize: '0.9rem', opacity: 0.7 },
    tagline: { 
      fontSize: '1rem', 
      fontStyle: 'italic', 
      fontWeight: '600', 
      marginBottom: '15px', 
      minHeight: '25px' 
    },
    description: { 
      fontSize: '0.95rem', 
      lineHeight: '1.4', // Interligne un peu plus serré
      flexGrow: 1, 
      marginBottom: '20px', // Marge avant le bouton réduite
      opacity: 0.9 
    },
    button: (isHighlight) => ({
      padding: '12px', // Bouton un peu moins haut
      borderRadius: '50px', border: 'none',
      fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer',
      backgroundColor: isHighlight ? '#E8DCC0' : '#2C2C2C',
      color: isHighlight ? '#5A4A42' : '#DDD',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)', marginTop: 'auto',
    }),
    badge: {
      position: 'absolute', top: '-12px', right: '15px',
      backgroundColor: '#D4AF37', color: 'white', padding: '5px 12px',
      borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Access</h1>
        <p style={styles.subtitle}>Unlock the full potential of our news platform.</p>
      </div>

      <div style={styles.cardsContainer}>
        {plans.map((plan) => (
          <div key={plan.id} style={styles.card(plan.isHighlight)}>
            
            {plan.isHighlight && <div style={styles.badge}>RECOMMENDED</div>}

            <div style={styles.planName}>{plan.name}</div>
            
            <span style={styles.savingBadge(plan.isHighlight)}>
              {plan.savingsText}
            </span>

            <div style={styles.priceContainer}>
              <span style={styles.price}>{plan.price}</span>
              <span style={styles.duration}>{plan.duration}</span>
            </div>

            <div style={styles.tagline}>{plan.tagline}</div>
            <div style={styles.description}>{plan.description}</div>

            <button 
              style={styles.button(plan.isHighlight)}
              onClick={() => handleSubscribe(plan)}
            >
              Get Subscription
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}