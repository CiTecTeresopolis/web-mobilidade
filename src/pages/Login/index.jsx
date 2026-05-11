import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";

import logoPrefeitura from "../../assets/logo_tere.png";
import iconeMob from "../../assets/icone_mob.png";

const API_URL =
  "https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth";

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // 🔐 checa sessão
  useEffect(() => {
    const check = async () => {
      const token = await AsyncStorage.getItem("admin_token");
      if (token) onLoginSuccess();
    };
    check();
  }, []);

  const realizarLogin = async () => {
    setErro("");

    if (!usuario || !senha) {
      setErro("Preencha usuário e senha.");
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: usuario.trim(),
          password: senha.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao logar");
      }

      await AsyncStorage.setItem("admin_token", data.token);
      await AsyncStorage.setItem("admin_user", JSON.stringify(data.user));

      onLoginSuccess();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Image source={iconeMob} style={styles.logoPlaceholder} />

        <View style={styles.header}>
          <Text style={styles.title}>Mobilidade</Text>
          <Text style={styles.subtitle}>Portal do Administrador</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Usuário / E-mail</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {erro ? <Text style={{ color: "red" }}>{erro}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={realizarLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Image source={logoPrefeitura} style={styles.logoFooterImage} />
        </View>
      </View>
    </View>
  );
}
