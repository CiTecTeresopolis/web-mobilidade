import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import axios from "axios";

export default function AlterarSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ tipo: "", msg: "" });

  // Limpa mensagens após 5 segundos
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ tipo: "", msg: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      return setStatus({
        tipo: "erro",
        msg: "A senha deve ter pelo menos 6 caracteres.",
      });
    }
    if (novaSenha !== confirmarSenha) {
      return setStatus({ tipo: "erro", msg: "As senhas não coincidem." });
    }

    setLoading(true);
    try {
      // 2. Captura o token que você enviou no link do e-mail (?token=...)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        throw new Error("Token de recuperação não encontrado na URL.");
      }

      // 3. Chamada para o SEU BACKEND (NestJS)
      // Substitua pela URL do seu servidor ou ngrok
      const API_URL =
        "https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth/confirm-reset-password";

      const response = await axios.post(API_URL, {
        token: token,
        newPass: novaSenha,
      });

      // Se chegou aqui, deu certo!
      setStatus({
        tipo: "sucesso",
        msg: "Senha alterada com sucesso! Você já pode voltar ao App e fazer login.",
      });
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      // Trata erros da API ou de rede
      const mensagemErro =
        error.response?.data?.message ||
        error.message ||
        "Erro ao atualizar senha.";
      setStatus({ tipo: "erro", msg: `Erro: ${mensagemErro}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>🔐</div>
          <h1 style={styles.title}>Redefinir Senha</h1>
          <p style={styles.subtitle}>
            Digite sua nova senha de acesso para o{" "}
            <strong>TereMobilidade</strong>.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nova Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Processando..." : "ATUALIZAR SENHA"}
          </button>
        </form>

        {status.msg && (
          <div
            style={{
              ...styles.alert,
              backgroundColor: status.tipo === "erro" ? "#fee2e2" : "#dcfce7",
              color: status.tipo === "erro" ? "#991b1b" : "#166534",
              border: `1px solid ${status.tipo === "erro" ? "#fecaca" : "#bbf7d0"}`,
            }}
          >
            {status.msg}
          </div>
        )}
      </div>
      <p style={styles.footer}>© 2026 TereMobilidade - Gestão Urbana</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0f172a", // Azul Marinho Profundo
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  iconCircle: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "24px",
    color: "#1e293b",
    fontWeight: "700",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "left",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#003366",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
    marginTop: "10px",
  },
  alert: {
    marginTop: "25px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    marginTop: "20px",
    color: "#94a3b8",
    fontSize: "12px",
  },
};
