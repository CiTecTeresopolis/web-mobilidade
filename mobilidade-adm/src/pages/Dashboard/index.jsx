import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import UserView from './userView';

export default function Dashboard({ onLogout }) {
  const abasFixas = [
    { id: 'Inicio', titulo: 'Início', icon: '🏠' },
    { id: 'Eventos', titulo: 'Eventos', icon: '🗓️'},
    { id: 'Motorista1', titulo: 'Motorista 1', icon: '🏍️' },
    { id: 'Motorista2', titulo: 'Motorista 2', icon: '🚗' },
    { id: 'Motorista3', titulo: 'Motorista 3', icon: '🚐' },
    { id: 'Motorista4', titulo: 'Motorista 4', icon: '🚛' }
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

      {/* ABAS FIXAS */}
      <View style={styles.tabContainer}>
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
      </View>

      {/* ÁREA DINÂMICA */}
      <View style={{flex: 1}}>
        {tabAtiva === 'Inicio' ? (
          <View style={styles.homeWelcomeContainer}>
             <Text style={styles.homeTitle}>Bem-vindo ao Painel de Mobilidade</Text>
             <Text style={styles.homeSubtitle}>Selecione uma categoria acima para gerenciar os motoristas.</Text>
          </View>
        ) : (
          <UserView key={tabAtiva} categoria={tabAtiva} />
        )}
      </View>
    </View>
  );
}