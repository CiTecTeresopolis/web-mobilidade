import React from 'react';

export default function EmailConfirmado() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.checkIcon}>✓</span>
        </div>
        <h1 style={styles.title}>E-mail Confirmado!</h1>
        <p style={styles.message}>
          Sua conta no <strong>TereMobilidade</strong> foi ativada com sucesso.
        </p>
        <button onClick={() => window.close()} style={styles.button}>
          Fechar esta página
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f9',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '400px'
  },
  iconContainer: {
    width: '60px',
    height: '60px',
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px'
  },
  checkIcon: { fontSize: '30px', color: '#22c55e' },
  title: { fontSize: '24px', color: '#1e293b', marginBottom: '10px' },
  message: { color: '#64748b', marginBottom: '20px' },
  button: {
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};