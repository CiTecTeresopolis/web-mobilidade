import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmailConfirmado from './pages/email_confirm/EmailConfimado'; 
import RedefinirSenha from './pages/alterar_senha/senha';

function App() {
  const [logado, setLogado] = useState(false);

  // Verifica se já existe um usuário logado ao abrir o site
  React.useEffect(() => {
    const user = localStorage.getItem('user_admin'); // ou o nome que você deu ao salvar
    if (user) {
      setLogado(true);
    }
  }, []);

  const path = window.location.pathname;
  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);

  if (hash.includes('type=recovery') || path === '/alterar-senha') {
    return <RedefinirSenha />;
  }

  if (params.get('confirmado') === 'true' || path === '/email-confirmado') {
    return <EmailConfirmado />;
  }

  // PASSO IMPORTANTE: Passar setLogado para o componente Login
  return logado ? (
    <Dashboard setLogado={setLogado} /> 
  ) : (
    <Login onLoginSuccess={() => setLogado(true)} />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);