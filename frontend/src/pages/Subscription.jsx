import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. VÉRIFICATION DU STATUT D'ABONNEMENT
  // On regarde si l'user existe ET s'il a une date dans le futur
  const isSubscribed = user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();

  const plans = [
    {
      id: 1,
      name: "Discovery",
      price: "3.99€",
      duration: "/ week",
      tagline: "Just passing through?",
      description: "Perfect for short-term access. Unlock all articles for 7 days. Cancel anytime.",
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
    // Sécurité supplémentaire : si abonné, on ne fait rien
    if (isSubscribed) return;

    if (!user) {
      navigate('/login');
    } else {
      navigate('/payment', { state: { plan: plan } });
    }
  };

  // --- STYLES ---
  const styles = {
    pageContainer: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0px 20px 40px 20px', 
      color: '#5A4A42', 
    },
    header: { 
      textAlign: 'center', 
      marginBottom: '20px' 
    },
    title: { 
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
      gap: '20px', 
      flexWrap: 'wrap', width: '100%', maxWidth: '1100px', 
    },
    card: (isHighlight) => ({
      backgroundColor: isHighlight ? '#5A4A42' : '#FFF',
      color: isHighlight ? '#E8DCC0' : '#5A4A42',
      border: isHighlight ? 'none' : '1px solid #E8DCC0',
      borderRadius: '20px', 
      padding: '25px 20px', 
      width: '300px', 
      minHeight: '420px', 
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)', position: 'relative',
      transition: 'transform 0.2s',
      // Si abonné, on réduit un peu l'opacité des cartes pour montrer qu'elles sont inactives
      opacity: isSubscribed ? 0.8 : 1 
    }),
    planName: { 
      fontSize: '1.3rem', 
      fontWeight: 'bold', 
      marginBottom: '5px', 
      textTransform: 'uppercase', 
      letterSpacing: '1px' 
    },
    savingBadge: (isHighlight) => ({
      fontSize: '0.85rem',
      fontWeight: 'bold',
      color: isHighlight ? '#FFF' : '#27ae60',
      marginBottom: '5px', 
      display: 'block',
      minHeight: '20px'
    }),
    priceContainer: { 
      marginBottom: '15px', 
      borderBottom: '1px solid currentColor', 
      paddingBottom: '15px' 
    },
    price: { 
      fontSize: '2.5rem', 
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
      lineHeight: '1.4', 
      flexGrow: 1, 
      marginBottom: '20px', 
      opacity: 0.9 
    },
    // 2. MODIFICATION DU STYLE DU BOUTON
    button: (isHighlight, disabled) => ({
      padding: '12px', 
      borderRadius: '50px', border: 'none',
      fontSize: '0.95rem', fontWeight: 'bold', 
      marginTop: 'auto',
      boxShadow: disabled ? 'none' : '0 4px 10px rgba(0,0,0,0.2)',
      
      // Gestion des couleurs : Actif vs Désactivé
      backgroundColor: disabled 
        ? '#ccc' // Gris si désactivé
        : (isHighlight ? '#E8DCC0' : '#2C2C2C'),
        
      color: disabled 
        ? '#666' // Gris foncé texte si désactivé
        : (isHighlight ? '#5A4A42' : '#DDD'),
        
      cursor: disabled ? 'not-allowed' : 'pointer', // Curseur interdit
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

            {/* 3. LOGIQUE D'AFFICHAGE DU BOUTON */}
            <button 
              style={styles.button(plan.isHighlight, isSubscribed)}
              onClick={() => handleSubscribe(plan)}
              disabled={isSubscribed} // Désactive le clic HTML
            >
              {isSubscribed ? "Already Subscribed" : "Get Subscription"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}