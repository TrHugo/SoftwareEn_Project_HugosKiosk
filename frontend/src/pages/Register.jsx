import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions générales.");
      return;
    }

    try {
      const response = await fetch('/api/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mdp: formData.password,
          role: 'user'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      navigate('/login');

    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '20px', color: '#5A4A42',
    },
    card: {
      backgroundColor: '#fff', padding: '40px', borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
      border: '1px solid #ccc'
    },
    title: { marginBottom: '20px', textAlign: 'center' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' },
    input: {
      width: '100%', padding: '12px', borderRadius: '8px',
      border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box'
    },
    checkboxGroup: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginBottom: '15px' },
    errorMessage: { color: 'red', fontSize: '14px', marginBottom: '15px', textAlign: 'center' },
    button: {
      width: '100%', padding: '15px', marginTop: '10px',
      backgroundColor: '#2C2C2C', 
      color: '#DDD', border: 'none', borderRadius: '50px',
      fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
    },
    link: { display: 'block', marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#5A4A42', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input name="name" type="text" required style={styles.input} onChange={handleChange} />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input name="email" type="email" required style={styles.input} onChange={handleChange} />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" required style={styles.input} onChange={handleChange} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input name="confirmPassword" type="password" required style={styles.input} onChange={handleChange} />
          </div>

          <div style={styles.checkboxGroup}>
            <input 
              name="acceptTerms" 
              type="checkbox" 
              id="terms"
              onChange={handleChange} 
            />
            <label htmlFor="terms" style={{cursor: 'pointer'}}>
              I accept the <span style={{textDecoration: 'underline'}} onClick={() => navigate('/legal')}>Terms of Service</span>
            </label>
          </div>

          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        
        <span style={styles.link} onClick={() => navigate('/login')}>
          Already have an account? Log In.
        </span>
      </div>
    </div>
  );
}
