import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ActivityIndicator, Alert, ScrollView, FlatList 
} from 'react-native';
import { styles } from './styles';

const API_URL = 'https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth';

export default function Eventos() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [eventos, setEventos] = useState([]); // Estado para a lista
  const [carregandoLista, setCarregandoLista] = useState(true);

  useEffect(() => {
    buscarEventos();
  }, []);


  // Função para buscar eventos do banco
  const buscarEventos = async () => {

    try {
        
        setCarregandoLista(true);
        // Usamos a nova rota 'all' para trazer tudo do banco
        const res = await fetch(`${API_URL}/notifications/all`, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true' // CRUCIAL para ngrok não bloquear a lista
        },
        });

        if (!res.ok) throw new Error("Erro ao buscar dados");

        const data = await res.json();
        
        // Filtramos para mostrar apenas o que é Evento Geral (driver_id nulo)
        const apenasEventosGerais = data.filter(item => item.driver_id === null);
        
        setEventos(apenasEventosGerais);
    } catch (e) {
        console.error("Erro na busca:", e);
        // Opcional: mostrar um alerta se falhar muito
    } finally {
        setCarregandoLista(false);
    }
    };

  const enviarEvento = async () => {
    if (!titulo || !mensagem) {
      Alert.alert("Aviso", "Preencha todos os campos!");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ 
          driver_id: null, // Evento geral
          title: titulo, 
          message: mensagem, 
          type: 'EVENTO' 
        })
      });

      if (res.ok) {
        Alert.alert("Sucesso", "📢 Evento criado e enviado para todos!");
        setTitulo(''); 
        setMensagem('');
        buscarEventos(); // Atualiza a lista automaticamente após criar
      } else {
        Alert.alert("Erro", "Falha ao salvar no banco.");
      }
    } catch (e) { 
      Alert.alert("Erro de Rede", "Verifique sua conexão."); 
    } finally { 
      setEnviando(false); 
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* FORMULÁRIO DE CRIAÇÃO */}
      <View style={styles.mainActionCard}>
        <Text style={[styles.modalTitle, { textAlign: 'left' }]}>📢 Novo Evento Geral</Text>
        
        <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Título</Text>
        <TextInput 
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 5, backgroundColor: '#fff' }}
          value={titulo} 
          onChangeText={setTitulo} 
          placeholder="Ex: Manutenção no Sistema"
        />

        <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Mensagem</Text>
        <TextInput 
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 5, height: 80, textAlignVertical: 'top', backgroundColor: '#fff' }}
          value={mensagem} 
          onChangeText={setMensagem} 
          multiline 
          placeholder="Descreva o evento..."
        />

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#007A33', marginTop: 20, width: '100%', height: 50, justifyContent: 'center' }]} 
          onPress={enviarEvento}
          disabled={enviando}
        >
          {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>PUBLICAR AGORA</Text>}
        </TouchableOpacity>
      </View>

      {/* LISTA DE EVENTOS CRIADOS */}
      <View style={[styles.mainActionCard, { marginTop: 20, marginBottom: 50 }]}>
        <Text style={[styles.modalTitle, { textAlign: 'left', marginBottom: 15 }]}>Histórico de Eventos</Text>
        
        {carregandoLista ? (
          <ActivityIndicator color="#007A33" />
        ) : eventos.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666' }}>Nenhum evento criado ainda.</Text>
        ) : (
          eventos.map((item) => (
            <View key={item.id} style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>{item.title}</Text>
              <Text style={{ color: '#666', marginTop: 4 }}>{item.message}</Text>
              <Text style={{ fontSize: 10, color: '#999', marginTop: 8 }}>
                Criado em: {new Date(item.created_at).toLocaleString('pt-BR')}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}