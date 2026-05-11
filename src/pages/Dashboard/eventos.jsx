import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";

const API_URL =
  "https://pilgrimatic-nita-scenographically.ngrok-free.dev/api/auth";

export default function Eventos() {
  // Estados do Formulário
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Estados da Lista
  const [eventos, setEventos] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  // Estados do Modal (Pop-up)
  const [modalVisivel, setModalVisivel] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    buscarEventos();
  }, []);

  const buscarEventos = async () => {
    try {
      setCarregandoLista(true);
      const res = await fetch(`${API_URL}/notifications/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      const listaBruta = Array.isArray(data) ? data : data.data || [];

      // Filtra apenas eventos gerais (driver_id nulo)
      const apenasEventosGerais = listaBruta.filter(
        (item) => item.driver_id === null || item.driver_id === undefined,
      );
      setEventos(apenasEventosGerais);
    } catch (e) {
      console.error("Erro ao buscar:", e);
    } finally {
      setCarregandoLista(false);
    }
  };

  const salvarEvento = async () => {
    if (!titulo || !mensagem) {
      Alert.alert("Aviso", "Preencha todos os campos!");
      return;
    }

    setEnviando(true);
    try {
      // Define se é criação (POST) ou atualização (POST na rota /update)
      const url = editandoId
        ? `${API_URL}/notifications/update/${editandoId}`
        : `${API_URL}/notifications`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          driver_id: null,
          title: titulo,
          message: mensagem,
          type: "EVENTO",
        }),
      });

      if (res.ok) {
        Alert.alert(
          "Sucesso",
          editandoId ? "Evento atualizado!" : "Evento publicado!",
        );
        limparFormulario();
        buscarEventos();
      } else {
        Alert.alert("Erro", "Falha ao salvar no banco.");
      }
    } catch (e) {
      Alert.alert("Erro de Rede", "Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  };

  const confirmarExclusao = async () => {
    if (!eventoSelecionado) return;

    try {
      const res = await fetch(
        `${API_URL}/notifications/${eventoSelecionado.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      if (res.ok) {
        setModalVisivel(false);
        Alert.alert("Sucesso", "Evento excluído.");
        buscarEventos();
      } else {
        Alert.alert("Erro", "Falha ao excluir.");
      }
    } catch (e) {
      Alert.alert("Erro", "Erro de conexão.");
    }
  };

  const prepararEdicao = () => {
    setEditandoId(eventoSelecionado.id);
    setTitulo(eventoSelecionado.title);
    setMensagem(eventoSelecionado.message);
    setModalVisivel(false);
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setTitulo("");
    setMensagem("");
  };

  const abrirOpcoes = (item) => {
    setEventoSelecionado(item);
    setModalVisivel(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* CARD DE ENTRADA (CRIAÇÃO/EDIÇÃO) */}
        <View style={localStyles.card}>
          <Text style={localStyles.cardTitle}>
            {editandoId ? "✏️ Editando Evento" : "📢 Novo Evento Geral"}
          </Text>

          <TextInput
            style={localStyles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Título do Evento"
          />

          <TextInput
            style={[
              localStyles.input,
              { height: 100, textAlignVertical: "top" },
            ]}
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            placeholder="Descrição da mensagem..."
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[
                localStyles.btnPrincipal,
                {
                  flex: 1,
                  backgroundColor: editandoId ? "#E67E22" : "#007A33",
                },
              ]}
              onPress={salvarEvento}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={localStyles.btnText}>
                  {editandoId ? "SALVAR ALTERAÇÕES" : "PUBLICAR AGORA"}
                </Text>
              )}
            </TouchableOpacity>

            {editandoId && (
              <TouchableOpacity
                style={[
                  localStyles.btnPrincipal,
                  { backgroundColor: "#666", paddingHorizontal: 20 },
                ]}
                onPress={limparFormulario}
              >
                <Text style={localStyles.btnText}>CANCELAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* LISTA DE HISTÓRICO */}
        <View style={[localStyles.card, { marginTop: 20 }]}>
          <Text style={localStyles.cardTitle}>Histórico de Eventos</Text>
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 15 }}>
            Toque em um evento para editar ou excluir
          </Text>

          {carregandoLista ? (
            <ActivityIndicator color="#007A33" size="large" />
          ) : eventos.length === 0 ? (
            <Text style={localStyles.emptyText}>Nenhum evento registrado.</Text>
          ) : (
            eventos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={localStyles.itemLista}
                onPress={() => abrirOpcoes(item)}
              >
                <View>
                  <Text style={localStyles.itemTitulo}>{item.title}</Text>
                  <Text style={localStyles.itemMensagem}>{item.message}</Text>
                  <Text style={localStyles.itemData}>
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL DE OPÇÕES */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalHeader}>Opções do Evento</Text>

            <TouchableOpacity
              style={[localStyles.modalBtn, { backgroundColor: "#3498db" }]}
              onPress={prepararEdicao}
            >
              <Text style={localStyles.btnText}>EDITAR CONTEÚDO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                localStyles.modalBtn,
                { backgroundColor: "#e74c3c", marginTop: 12 },
              ]}
              onPress={confirmarExclusao}
            >
              <Text style={localStyles.btnText}>EXCLUIR DO BANCO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={{ color: "#666", fontWeight: "bold" }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fafafa",
  },
  btnPrincipal: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  itemLista: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  itemMensagem: {
    color: "#666",
    marginTop: 3,
  },
  itemData: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  modalBtn: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
