import React, { useState, useEffect } from 'react'; // Adicionado useEffect aqui
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { styles } from './styles';
import logoPrefeitura from '../../assets/logo_tere.png';
import iconeMob from '../../assets/icone_mob.png';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const realizarLogin = () => {
    setErro('');
    
    if (usuario === 'admin' && senha === '123') {
      setCarregando(true);
      setTimeout(() => {
        setCarregando(false);
        onLoginSuccess(); 
      }, 1000);
    } else {
      setErro('Usuário ou senha incorretos.');
      // LIMPA OS CAMPOS EM CASO DE ERRO
      setUsuario('');
      setSenha('');
    }
  };

  // LÓGICA DO ENTER
  useEffect(() => {
    const escutarTeclado = (event) => {
      if (event.key === 'Enter') {
        realizarLogin();
      }
    };
    window.addEventListener('keydown', escutarTeclado);
    // Limpeza ao sair da tela
    return () => window.removeEventListener('keydown', escutarTeclado);
  }, [usuario, senha]); 

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        
          <Image 
            source={iconeMob} 
            style={styles.logoPlaceholder} 
            resizeMode="contain" 
          />

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
          
          <TouchableOpacity style={styles.forgotPassContainer} onPress={() => alert('PENDENTE')}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>          

          {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

          <TouchableOpacity 
            style={styles.button} 
            onPress={realizarLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Image 
            source={logoPrefeitura} 
            style={styles.logoFooterImage} 
            resizeMode="contain" 
          />
          <Text style={styles.footerText}>Secretaria Municipal de Ciência e Tecnologia</Text>
        </View>
      </View>
    </View>
  );
}