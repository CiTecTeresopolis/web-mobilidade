import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // Estado que controla qual tela aparece
  const [logado, setLogado] = useState(false);

  return (
    <>
      {logado ? (
        // Se estiver logado, mostra o Dashboard
        <Dashboard onLogout={() => setLogado(false)} />
      ) : (
        // Se NÃO estiver logado, mostra o Login e passa a função de entrar
        <Login onLoginSuccess={() => setLogado(true)} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);