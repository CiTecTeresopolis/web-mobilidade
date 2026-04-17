import React, { useState } from 'react';
// ADICIONADO: ScrollView importado do react-native (ou react-native-web)
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'; 
import { styles } from './styles';
import UserView from './userView';
import EventoForm from './eventos'; 
import CadastroSeguranca from './cadastroSeguranca'; 

export default function Dashboard({ onLogout }) {
  const abasFixas = [
    { id: 'Inicio', titulo: 'Início', icon: '🏠' },
    { id: 'Eventos', titulo: 'Eventos', icon: '🗓️'},
    { id: 'Seguranca', titulo: 'Segurança', icon: '🛡️'}, 
    { id: 'Motorista1', titulo: 'Moto', icon: '🏍️' },
    { id: 'Motorista2', titulo: 'Uber', icon: '🚗' },
    { id: 'Motorista3', titulo: 'Taxi', icon: '🚐' },
    { id: 'Motorista4', titulo: 'Van', icon: '🚛' }
  ];

  const [tabAtiva, setTabAtiva] = useState('Inicio');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel de Mobilidade</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* ABAS FIXAS (Menu Superior) */}
      <View style={styles.tabContainer}>
        {/* Adicionado style fixo para garantir visibilidade no Web */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', paddingBottom: 5 }}
        >
          {abasFixas.map(tab => (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tabItem, tabAtiva === tab.id && styles.tabAtiva]}
              onPress={() => setTabAtiva(tab.id)}
            >
              <Text style={[styles.tabTitle, tabAtiva === tab.id && styles.tabTitleAtivo]}>
                {tab.icon} {tab.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ÁREA DINÂMICA */}
      <View style={{ flex: 1 }}>
        {tabAtiva === 'Inicio' ? (
          <View style={styles.homeWelcomeContainer}>
            <Text style={styles.homeTitle}>Bem-vindo ao Painel de Mobilidade</Text>
            <Text style={styles.homeSubtitle}>Selecione uma categoria acima para gerenciar os motoristas ou seguranças.</Text>
          </View>
        ) : tabAtiva === 'Eventos' ? (
          <EventoForm /> 
        ) : tabAtiva === 'Seguranca' ? (
          <CadastroSeguranca /> 
        ) : (
          <UserView key={tabAtiva} categoria={tabAtiva} />
        )}
      </View>
    </View>
  );
}