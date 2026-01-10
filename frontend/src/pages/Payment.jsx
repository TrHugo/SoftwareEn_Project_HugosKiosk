import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // MODIFICATION 1 : On récupère 'login' pour mettre à jour l'app après paiement
  const { user, login } = useAuth();
  
  const plan = location.state?.plan;
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!plan) {
      navigate('/subscribe');
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Récupération du token actuel (pour prouver qu'on est connecté)
      const currentToken = localStorage.getItem('token');
      if (!currentToken) throw new Error("Vous devez être connecté");

      // 2. Appel au Backend (Route créée précédemment)
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` // On envoie le token dans le header
        },
        body: JSON.stringify({ 
          planName: plan.name // "Discovery", "Regular" ou "Premium"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du paiement");
      }

      // --- SIMULATION VISUELLE (Pour garder l'effet d'attente pro) ---
      setTimeout(() => {
        
        // 3. MISE À JOUR CRITIQUE
        // On remplace le vieux token par le nouveau (qui contient la nouvelle date d'expiration)
        localStorage.setItem('token', data.token);
        
        // On met à jour le contexte React avec le nouvel utilisateur (pour que la Profile page soit verte)
        login(data.user);

        setIsLoading(false);
        setSuccess(true);
        
        // Redirection
        setTimeout(() => {
          navigate('/profile');
        }, 2000);

      }, 1500); // On garde 1.5s de "Processing..." pour l'effet réaliste

    } catch (error) {
      console.error("Erreur paiement:", error);
      setIsLoading(false);
      alert("Le paiement a échoué : " + error.message);
    }
  };

  // --- STYLES (Identiques à avant) ---
  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '20px', color: '#5A4A42',
    },
    wrapper: {
      display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px'
    },
    summaryCard: {
      backgroundColor: '#E8DCC0',
      padding: '30px', borderRadius: '20px', flex: '1', minWidth: '300px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    },
    planTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' },
    divider: { height: '1px', backgroundColor: '#5A4A42', opacity: 0.2, margin: '20px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' },
    
    formCard: {
      backgroundColor: '#fff', padding: '30px', borderRadius: '20px', flex: '1.5', minWidth: '320px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee'
    },
    formTitle: { marginBottom: '25px', fontSize: '1.3rem', fontWeight: '600' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold', color: '#888' },
    input: {
      width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd',
      fontSize: '1rem', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s',
      backgroundColor: '#f9f9f9'
    },
    row: { display: 'flex', gap: '15px' },
    
    payButton: {
      width: '100%', padding: '18px', marginTop: '20px',
      backgroundColor: '#2C2C2C', color: '#fff', border: 'none', borderRadius: '50px',
      fontSize: '1rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
      opacity: isLoading ? 0.7 : 1,
    },
    
    successOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 2000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    },
    successIcon: { width: '80px', height: '80px', marginBottom: '20px', color: '#27ae60' }
  };

  if (success) {
    return (
      <div style={styles.successOverlay}>
        <svg style={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2>Payment Successful!</h2>
        <p>Your {plan.name} subscription is now active.</p>
        <p>Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{marginBottom: '40px'}}>Secure Checkout</h1>
      
      <div style={styles.wrapper}>
        
        {/* RECAP */}
        <div style={styles.summaryCard}>
          <div>
            <div style={styles.planTitle}>{plan.name} Plan</div>
            <div style={{opacity: 0.8}}>News Platform Access</div>
          </div>
          <div>
            <div style={styles.divider}></div>
            <div style={styles.totalRow}>
              <span>Total due</span>
              <span>{plan.price}</span>
            </div>
            <div style={{fontSize: '0.8rem', marginTop: '10px', opacity: 0.7}}>
              Recurring billing. Cancel anytime.
            </div>
          </div>
        </div>

        {/* FORMULAIRE */}
        <div style={styles.formCard}>
          <div style={styles.formTitle}>Payment Details</div>
          <form onSubmit={handlePayment}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cardholder Name</label>
              {/* MODIFICATION 2 : Pré-remplissage du nom */}
              <input 
                type="text" 
                placeholder="Hugo ..." 
                defaultValue={user?.name}
                required 
                style={styles.input} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required style={styles.input} />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Expiry Date</label>
                <input type="text" placeholder="MM/YY" maxLength="5" required style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>CVC</label>
                <input type="text" placeholder="123" maxLength="3" required style={styles.input} />
              </div>
            </div>

            <button type="submit" style={styles.payButton}>
              {isLoading ? 'Processing...' : `Pay ${plan.price}`}
            </button>
            
            <div style={{textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Encrypted & Secure Transaction
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}