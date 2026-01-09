import React from 'react';

const Contacts = () => {
  const teamMembers = [
    { name: "Thomas STOLTZ", email: "thomas.stoltz@edu.devinci.fr" },
    { name: "Hugo TRAN", email: "hugo.tran@edu.devinci.fr" },
    { name: "Thomas WARTELLE", email: "thomas.wartelle@edu.devinci.fr" },
    { name: "Léo WINTER", email: "leo.winter@edu.devinci.fr" }
  ];

  return (
    <main style={styles.container}>
      {/* Le titre avec la petite barre en dessous */}
      <div style={styles.headerWrapper}>
        <h1 style={styles.pageTitle}>Our group</h1>
      </div>

      <div style={styles.grid}>
        {teamMembers.map((member, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.name}>{member.name}</h3>
            <a href={`mailto:${member.email}`} style={styles.email}>
              {member.email}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
};

const styles = {
  container: {
    padding: '0 20px',
    maxWidth: '1200px', // Plus large pour faire tenir 4 cartes
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '60vh', // Pour centrer verticalement si l'écran est grand
  },
  headerWrapper: {
    marginBottom: '40px',
    textAlign: 'left', // Titre aligné à gauche comme sur la Home
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #333',
    display: 'inline-block',
    paddingBottom: '5px',
    margin: 0,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap', // Permet de passer à la ligne si l'écran est trop petit
    gap: '20px',
    justifyContent: 'space-between', // Répartit l'espace
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: '1 1 200px', // Flex: grow, shrink, base width (min 200px)
    minWidth: '220px', // Largeur minimum pour que l'email ne dépasse pas
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.02)',
    transition: 'transform 0.2s',
  },
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    marginTop: 0,
  },
  email: {
    fontSize: '13px',
    color: '#666',
    textDecoration: 'none',
    wordBreak: 'break-all', // Coupe l'email si vraiment trop long
  }
};

export default Contacts;