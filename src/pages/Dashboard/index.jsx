import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { styles } from "./styles";
import UserView from "./userView";
import EventoForm from "./eventos";
import CadastroSeguranca from "./cadastroSeguranca";

export default function Dashboard({ setLogado }) {
  const [tabAtiva, setTabAtiva] = useState("Inicio");

  const abas = [
    { id: "Inicio", titulo: "Início", icon: "🏠" },
    { id: "Eventos", titulo: "Eventos", icon: "🗓️" },
    { id: "Seguranca", titulo: "Segurança", icon: "🛡️" },
    { id: "Motorista1", titulo: "Motos", icon: "🏍️" },
    { id: "Motorista2", titulo: "Uber", icon: "🚗" },
    { id: "Motorista3", titulo: "Táxi", icon: "🚕" },
    { id: "Motorista4", titulo: "Van", icon: "🚐" },
    { id: "Motorista5", titulo: "Mudança", icon: "🚚" },
  ];

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLogado(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel de Mobilidade</Text>

        <TouchableOpacity onPress={logout}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* ABAS */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {abas.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, tabAtiva === tab.id && styles.tabAtiva]}
              onPress={() => setTabAtiva(tab.id)}
            >
              <Text
                style={[
                  styles.tabTitle,
                  tabAtiva === tab.id && styles.tabTitleAtivo,
                ]}
              >
                {tab.icon} {tab.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTEÚDO */}
      <View style={{ flex: 1 }}>
        {tabAtiva === "Inicio" && (
          <View style={styles.homeWelcomeContainer}>
            <Text style={styles.homeTitle}>Bem-vindo</Text>
          </View>
        )}

        {tabAtiva === "Eventos" && <EventoForm />}
        {tabAtiva === "Seguranca" && <CadastroSeguranca />}

        {tabAtiva.startsWith("Motorista") && <UserView categoria={tabAtiva} />}
      </View>
    </View>
  );
}
