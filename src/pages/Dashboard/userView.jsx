import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  Modal, ActivityIndicator, Linking, Alert, Image,
  TextInput 
} from 'react-native';
import { styles } from './styles';

const API_URL = 'https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth'; 
const SUPABASE_PROJECT_URL = 'https://dqxlyhdmfrmucelgweko.supabase.co'; 
const BUCKET_NAME = 'uploads'; 

export default function UserView({ categoria }) {
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('pendentes');
  const [dados, setDados] = useState({ pendentes: [], aprovados: [], recusados: [] });
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/drivers/category/${categoria}`, {
        headers: { 'ngrok-skip-browser-warning': 'true', 'Accept': 'application/json' },
      });
      const lista = await response.json();
      
      if (response.ok) {
        setDados({
          // O backend agora salva como 'ANALYSIS' após o motorista enviar
          pendentes: lista.filter(u => u.status === 'ANALYSIS' || u.status === 'PENDING'),
          aprovados: lista.filter(u => u.status === 'APPROVED'),
          recusados: lista.filter(u => u.status === 'REJECTED'),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, [categoria]);

  // Função para identificar quais documentos exibir no modal baseada na categoria do motorista
  const obterCamposDocumentos = (driver) => {
    const base = ['cnh_url', 'selfie_url'];
    if (driver?.tipo_servico === 'Moto') {
      return [...base, 'crlv_url', 'curso_url', 'cmc_url'];
    }
    return [...base, 'alvara_url'];
  };

  const gerenciarStatus = async (id, novoStatus, valorAtivo, motivo = "") => {
    try {
      const res = await fetch(`${API_URL}/drivers/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: novoStatus, ativo: valorAtivo })
      });

      if (res.ok) {
        if (novoStatus === 'REJECTED') {
          await fetch(`${API_URL}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              driver_id: id, 
              title: "Documentos Recusados", 
              message: motivo || "Sua análise foi recusada. Verifique os dados e reenvie.", 
              type: "AVISO" 
            })
          });
        }
        
        Alert.alert("Sucesso", "Status atualizado!");
        setUsuarioSelecionado(null);
        setMotivoRejeicao('');
        carregarDados();
      }
    } catch (e) { 
      Alert.alert("Erro", "Falha na comunicação."); 
    }
  };

  const obterUrlDoc = (path) => {
    if (!path) return null;
    // Se o path já for uma URL completa (publicUrl), retorna ela. 
    // Caso contrário, monta com a URL do projeto.
    return path.startsWith('http') 
      ? path 
      : `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  if (loading) return <ActivityIndicator size="large" color="#007A33" style={{marginTop: 50}} />;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.welcomeText}>Gestão: {categoria}</Text>
      
      {/* Abas */}
      <View style={styles.row}>
        {['pendentes', 'aprovados', 'recusados'].map(tipo => (
          <TouchableOpacity 
            key={tipo}
            style={[styles.card, { 
                borderLeftColor: tipo === 'pendentes' ? '#F9B233' : tipo === 'aprovados' ? '#007A33' : '#D32F2F',
                backgroundColor: abaAtiva === tipo ? '#F0F0F0' : '#FFF' 
            }]} 
            onPress={() => setAbaAtiva(tipo)}
          >
            <Text style={styles.cardLabel}>{tipo.toUpperCase()}</Text>
            <Text style={styles.cardNumber}>{dados[tipo]?.length || 0}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tabela */}
      <ScrollView style={styles.mainActionCard}>
        {dados[abaAtiva]?.map(u => (
          <TouchableOpacity key={u.id} style={styles.tableRow} onPress={() => setUsuarioSelecionado(u)}>
            <Text style={{flex: 2}}>{u.name}</Text>
            <Text style={{flex: 1, textAlign: 'right', color: '#007A33'}}>Analisar</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!usuarioSelecionado} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '95%', maxHeight: '90%' }]}>
            <Text style={styles.modalTitle}>Análise de Documentos</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginBottom: 15}}>
                <Text style={{fontWeight: 'bold'}}>Nome: <Text style={{fontWeight: 'normal'}}>{usuarioSelecionado?.name}</Text></Text>
                <Text style={{fontWeight: 'bold'}}>Categoria: <Text style={{fontWeight: 'normal'}}>{usuarioSelecionado?.tipo_servico}</Text></Text>
              </View>

              <View style={{gap: 15}}>
                {obterCamposDocumentos(usuarioSelecionado).map((campo) => (
                  <View key={campo} style={{borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 5, color: '#555'}}>{campo.split('_')[0].toUpperCase()}:</Text>
                    {usuarioSelecionado?.[campo] ? (
                      <TouchableOpacity onPress={() => Linking.openURL(obterUrlDoc(usuarioSelecionado[campo]))}>
                        <Image 
                          source={{ uri: obterUrlDoc(usuarioSelecionado[campo]) }} 
                          style={{ width: '100%', height: 220, borderRadius: 8, backgroundColor: '#f9f9f9' }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text style={{color: '#999', fontStyle: 'italic'}}>Não enviado</Text>
                    )}
                  </View>
                ))}
              </View>

              {abaAtiva === 'pendentes' && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', color: '#D32F2F' }}>Motivo se for recusar:</Text>
                  <TextInput
                    style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginTop: 5 }}
                    placeholder="Ex: CNH vencida..."
                    value={motivoRejeicao}
                    onChangeText={setMotivoRejeicao}
                  />
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 25 }}>
                {abaAtiva === 'pendentes' ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, {backgroundColor: '#D32F2F', flex: 1}]}
                      onPress={() => gerenciarStatus(usuarioSelecionado.id, 'REJECTED', false, motivoRejeicao)}
                    >
                      <Text style={styles.btnText}>RECUSAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, {backgroundColor: '#007A33', flex: 1}]}
                      onPress={() => gerenciarStatus(usuarioSelecionado.id, 'APPROVED', true)}
                    >
                      <Text style={styles.btnText}>APROVAR</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={[styles.actionBtn, {backgroundColor: '#F9B233', width: '100%'}]}
                    onPress={() => gerenciarStatus(usuarioSelecionado.id, 'PENDING', null)}
                  >
                    <Text style={styles.btnText}>REVERTAR PARA PENDENTE</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={{padding: 20}} onPress={() => setUsuarioSelecionado(null)}>
                <Text style={{textAlign: 'center', color: '#666'}}>FECHAR</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}