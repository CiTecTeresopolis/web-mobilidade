import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { styles } from './styles';

const API_URL = 'https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth';

export default function CadastroSeguranca() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  
  // ESTADO PARA O POP-UP DE SUCESSO
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !matricula || !senha) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/security/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify({ 
          name: nome, 
          matricula: Number(matricula), 
          password: senha 
        })
      });

      if (res.ok) {
        // EM VEZ DO ALERT, ATIVAMOS O MODAL
        setMostrarSucesso(true);
        setNome(''); setMatricula(''); setSenha('');
      } else {
        alert("❌ Erro ao cadastrar. Verifique os dados.");
      }
    } catch (e) {
      alert("📡 Erro de conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      
      {/* CARD PRINCIPAL */}
      <View style={[styles.mainActionCard, { 
        width: '100%', 
        maxWidth: 500, 
        borderRadius: 15, 
        padding: 30,
        backgroundColor: '#fff'
      }]}>
        
        <Text style={[styles.modalTitle, { fontSize: 22, color: '#003366', marginBottom: 5 }]}>
          🛡️ Novo Agente
        </Text>
        <Text style={{ color: '#666', marginBottom: 25, fontSize: 14 }}>
          Cadastre as credenciais de acesso para a equipe de segurança.
        </Text>

        <Text style={{ fontWeight: '600', color: '#333', marginBottom: 8 }}>Nome Completo</Text>
        <TextInput 
          style={[styles.input, { height: 45, borderRadius: 10, backgroundColor: '#F8F9FA' }]} 
          value={nome} 
          onChangeText={setNome} 
          placeholder="Ex: João Silva" 
        />

        <Text style={{ fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 8 }}>Matrícula</Text>
        <TextInput 
          style={[styles.input, { height: 45, borderRadius: 10, backgroundColor: '#F8F9FA' }]} 
          value={matricula} 
          onChangeText={setMatricula} 
          keyboardType="numeric" 
          placeholder="00000" 
        />

        <Text style={{ fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 8 }}>Senha de Acesso</Text>
        <TextInput 
          style={[styles.input, { height: 45, borderRadius: 10, backgroundColor: '#F8F9FA' }]} 
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry 
          placeholder="••••••" 
        />

        <TouchableOpacity 
          style={[
            styles.actionBtn, 
            { backgroundColor: '#003366', marginTop: 35, height: 55, borderRadius: 12, justifyContent: 'center' }
          ]} 
          onPress={handleCadastro}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.btnText, { fontSize: 16, color: '#fff' }]}>SALVAR AGENTE</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* POP-UP (MODAL) DE SUCESSO */}
      <Modal
        visible={mostrarSucesso}
        transparent={true}
        animationType="fade"
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <View style={{ 
            width: 300, 
            backgroundColor: '#fff', 
            borderRadius: 20, 
            padding: 25, 
            alignItems: 'center',
            elevation: 10 // Sombra no Android
          }}>
            <Text style={{ fontSize: 50, marginBottom: 15 }}>✅</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
              Cadastro Realizado!
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
              O agente de segurança já pode acessar o sistema com as novas credenciais.
            </Text>
            
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#007A33', 
                paddingVertical: 12, 
                paddingHorizontal: 30, 
                borderRadius: 10 
              }}
              onPress={() => setMostrarSucesso(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}