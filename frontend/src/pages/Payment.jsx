import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Récupérer le plan choisi depuis la page précédente
  const plan = location.state?.plan;

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Rediriger si on arrive ici sans avoir choisi de plan
  useEffect(() => {
    if (!plan) {
      navigate('/subscribe');
    }
  }, [plan, navigate]);

  if (!plan) return null; // Sécurité visuelle

  const handlePayment = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- SIMULATION DU VIREMENT SÉCURISÉ ---
    // Ici, dans la vraie vie, on appellerait Stripe ou ton Backend
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Après 2 secondes de succès, on redirige vers le profil
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }, 2000); // On simule 2 secondes de "traitement bancaire"
  };

  // --- STYLES ---
  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '20px', color: '#5A4A42',
    },
    wrapper: {
      display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px'
    },
    // COLONNE GAUCHE : RÉCAP
    summaryCard: {
      backgroundColor: '#E8DCC0', // Beige Header
      padding: '30px', borderRadius: '20px', flex: '1', minWidth: '300px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    },
    planTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' },
    priceBig: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' },
    divider: { height: '1px', backgroundColor: '#5A4A42', opacity: 0.2, margin: '20px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' },
    
    // COLONNE DROITE : FORMULAIRE
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
    
    // BOUTON PAYER
    payButton: {
      width: '100%', padding: '18px', marginTop: '20px',
      backgroundColor: '#2C2C2C', color: '#fff', border: 'none', borderRadius: '50px',
      fontSize: '1rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
      opacity: isLoading ? 0.7 : 1,
    },
    
    // ÉCRAN DE SUCCÈS
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
        
        {/* RECAP DE LA COMMANDE */}
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

        {/* FORMULAIRE DE PAIEMENT */}
        <div style={styles.formCard}>
          <div style={styles.formTitle}>Payment Details</div>
          <form onSubmit={handlePayment}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cardholder Name</label>
              <input type="text" placeholder="Hugo ..." required style={styles.input} />
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