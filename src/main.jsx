import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmailConfirmado from "./pages/email_confirm/EmailConfimado";
import RedefinirSenha from "./pages/alterar_senha/senha";

function App() {
  const [logado, setLogado] = useState(false);

  // 1. Capturamos o caminho completo
  const fullPath = window.location.pathname;

  // 2. Limpeza total: remove a subpasta E o nome do arquivo
  // Se a URL for /Painel-Mobilidade/login.html, o 'path' vira apenas '/'
  const path =
    fullPath.replace("/Painel-Mobilidade", "").replace("/login.html", "") ||
    "/";

  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);

  console.log("Path processado:", path); // Adicione esse log para depurar no F12

  // Verificação para Redefinir Senha
  const isRecuperacao =
    hash.includes("type=recovery") ||
    path === "/alterar-senha" ||
    params.get("alterar-senha") === "true";

  if (isRecuperacao) {
    return <RedefinirSenha />;
  }

  // Verificação para Confirmação de E-mail
  const isConfirmacao =
    params.get("confirmado") === "true" || path === "/email-confirmado";

  if (isConfirmacao) {
    return <EmailConfirmado />;
  }

  // Se nada acima for verdade, cai no fluxo padrão
  return logado ? (
    <Dashboard setLogado={setLogado} />
  ) : (
    <Login onLoginSuccess={() => setLogado(true)} />
  );
}

// --- A PARTE QUE ESTAVA FALTANDO ---
// Isso faz o React "acordar" e desenhar o App dentro da div 'root'
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
