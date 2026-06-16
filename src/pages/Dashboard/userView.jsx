import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { styles } from "./styles";

const API_URL = "https://api-mobilidade.vercel.app/api/auth";
const SUPABASE_PROJECT_URL = "https://dqxlyhdmfrmucelgweko.supabase.co";
const BUCKET_NAME = "uploads";

export default function UserView({ categoria }) {
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [dados, setDados] = useState({
    pendentes: [],
    aprovados: [],
    recusados: [],
  });
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  // Estados para o Modal de Sucesso
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState({
    titulo: "",
    desc: "",
  });

  const DOCUMENTOS_POR_CATEGORIA = {
  Motorista1: ["cnh_url", "selfie_url", "crlv_url", "cmc_url", "curso_url"], // Exemplo: Moto
  Motorista2: ["cnh_url", "selfie_url", "crlv_url", "print_p_url", "print_s_url", "comp_url"], // Exemplo: Uber
  Motorista3: ["cnh_url", "selfie_url", "crlv_url", "tacografo_url", "inmetro_url", "cmd_url", "ccf_url", "consta_url"], // Exemplo: Táxi
  Motorista4: ["cnh_url", "selfie_url", "crlv_url", "tacografo_url", "inmetro_url", "cmd_url", "ccf_url"], // Exemplo: Van
  Motorista5: ["cnh_url", "selfie_url", "crlv_url", "consta_url", "comp_url"], // Exemplo: Frete
};

  const TITULOS_DOCUMENTOS = {
  cnh_url: "CNH (Carteira de Motorista)",
  selfie_url: "Selfie com o Documento",
  alvara_url: "Alvará de Circulação",
  crlv_url: "CRLV (Doc. do Veículo)",
  curso_url: "Certificado de Curso",
  cmc_url: "Inscrição Municipal (CMC)",
  cmd_url: "Certidão Municipal de débitos",
  ccf_url: "Certidão Criminal Federal e Estadual",
  consta_url: "Certidão de Nada Consta",
  print_p_url: "Print do Perfil do APP",
  print_s_url: "Print do seguro APP",
  inmetro_url: "Certificado do Inmetro",
  comp_url: "Comprovante de Residência",
  tacografo_url: "Foto do Tacógrafo"
};

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/drivers/category/${categoria}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          Accept: "application/json",
        },
      });
      const lista = await response.json();

      if (response.ok) {
        setDados({
          pendentes: lista.filter(
            (u) => u.status === "ANALYSIS" || u.status === "PENDING",
          ),
          aprovados: lista.filter((u) => u.status === "APPROVED"),
          recusados: lista.filter((u) => u.status === "REJECTED"),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [categoria]);

  // Função para fechar o modal e SÓ ENTÃO atualizar a lista
  const finalizarEAtualizar = () => {
    setMostrarSucesso(false);
    carregarDados();
  };

  const gerenciarStatus = async (id, novoStatus, valorAtivo, motivo = "") => {
    if (novoStatus === "REJECTED" && !motivo.trim()) {
      setUsuarioSelecionado(null);
      setTimeout(() => {
        setMostrarSucesso(true);
      }, 300);
      setMensagemSucesso({
        titulo: "Erro",
        desc: "Por favor, informe o motivo da recusa.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/drivers/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: novoStatus, ativo: valorAtivo }),
      });

      if (res.ok) {
        // Preparar mensagem do Modal
        if (novoStatus === "REJECTED") {
          setMensagemSucesso({
            titulo: "Motorista Recusado!",
            desc: "O motorista foi notificado sobre os problemas nos documentos.",
          });

          // Envia a notificação de recusa
          await fetch(`${API_URL}/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              driver_id: id,
              title: "Documentos Recusados",
              message: motivo,
              type: "AVISO",
            }),
          });
        } else if (novoStatus === "APPROVED") {
          setMensagemSucesso({
            titulo: "Motorista Aprovado!",
            desc: "O cadastro foi ativado e o motorista já pode acessar o sistema.",
          });
        } else {
          setMensagemSucesso({
            titulo: "Status Alterado",
            desc: "O motorista voltou para a fila de análise.",
          });
        }

        // Fecha o modal de análise e limpa campos
        setUsuarioSelecionado(null);
        setMotivoRejeicao("");

        // Abre o modal de sucesso com um pequeno delay para não conflitar com o fechamento do anterior
        setTimeout(() => {
          setMostrarSucesso(true);
        }, 300);
      } else {
        Alert.alert("Erro", "Falha ao atualizar status no servidor.");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    }
  };

  const obterCamposDocumentos = (driver) => {
  if (!driver) return [];

  // 2. Filtra a lista garantindo que o motorista possui esse dado preenchido no banco
  return DOCUMENTOS_POR_CATEGORIA[categoria] || [
    "cnh_url", "selfie_url", "alvara_url", "crlv_url", "curso_url",
    "cmc_url", "cmd_url", "ccf_url", "consta_url", "print_p_url",
    "print_s_url", "inmentro_url", "comp_url", "tacografo_url"
  ];
};

  const obterUrlDoc = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  if (loading && !mostrarSucesso)
    return (
      <ActivityIndicator
        size="large"
        color="#007A33"
        style={{ marginTop: 50 }}
      />
    );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.welcomeText}>Gestão: {categoria}</Text>

      {/* Abas de Filtro */}
      <View style={styles.row}>
        {["pendentes", "aprovados", "recusados"].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.card,
              {
                borderLeftColor:
                  tipo === "pendentes"
                    ? "#F9B233"
                    : tipo === "aprovados"
                      ? "#007A33"
                      : "#D32F2F",
                backgroundColor: abaAtiva === tipo ? "#F0F0F0" : "#FFF",
              },
            ]}
            onPress={() => setAbaAtiva(tipo)}
          >
            <Text style={styles.cardLabel}>{tipo.toUpperCase()}</Text>
            <Text style={styles.cardNumber}>{dados[tipo]?.length || 0}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <ScrollView style={styles.mainActionCard}>
        {dados[abaAtiva]?.map((u) => (
          <TouchableOpacity
            key={u.id}
            style={styles.tableRow}
            onPress={() => setUsuarioSelecionado(u)}
          >
            <Text style={{ flex: 2 }}>{u.name}</Text>
            <Text style={{ flex: 1, textAlign: "right", color: "#007A33" }}>
              Analisar
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de Análise */}
      <Modal visible={!!usuarioSelecionado} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { width: "95%", maxHeight: "90%" }]}
          >
            <Text style={styles.modalTitle}>Análise de Documentos</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontWeight: "bold" }}>
                Nome:{" "}
                <Text style={{ fontWeight: "normal" }}>
                  {usuarioSelecionado?.name}
                </Text>
              </Text>

              <View style={{ gap: 15, marginTop: 15 }}>
                {obterCamposDocumentos(usuarioSelecionado).map((campo) => (
                  <View
                    key={campo}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      paddingBottom: 10,
                    }}
                  >
                    {/* LINHA MODIFICADA ABAIXO */}
                    <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 16, color: "#000" }}>
                      {TITULOS_DOCUMENTOS[campo] || campo.split("_")[0].toUpperCase()}:
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(obterUrlDoc(usuarioSelecionado[campo]))
                      }
                    >
                      <Image
                        source={{ uri: obterUrlDoc(usuarioSelecionado[campo]) }}
                        style={{ width: "100%", height: 220, borderRadius: 8 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {abaAtiva === "pendentes" && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "bold", color: "#D32F2F" }}>
                    Motivo da Recusa:
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#D32F2F",
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                      textAlignVertical: "top",
                    }}
                    placeholder="Descreva o problema..."
                    value={motivoRejeicao}
                    onChangeText={setMotivoRejeicao}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              )}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 25 }}>
                {abaAtiva === "pendentes" ? (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        { backgroundColor: "#D32F2F", flex: 1 },
                      ]}
                      onPress={() =>
                        gerenciarStatus(
                          usuarioSelecionado.id,
                          "REJECTED",
                          false,
                          motivoRejeicao,
                        )
                      }
                    >
                      <Text style={styles.btnText}>RECUSAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        { backgroundColor: "#007A33", flex: 1 },
                      ]}
                      onPress={() =>
                        gerenciarStatus(usuarioSelecionado.id, "APPROVED", true)
                      }
                    >
                      <Text style={styles.btnText}>APROVAR</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      { backgroundColor: "#F9B233", width: "100%" },
                    ]}
                    onPress={() =>
                      gerenciarStatus(usuarioSelecionado.id, "PENDING", null)
                    }
                  >
                    <Text style={styles.btnText}>REVERTER PARA PENDENTE</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => setUsuarioSelecionado(null)}
              >
                <Text style={{ textAlign: "center", color: "#666" }}>
                  FECHAR
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Sucesso */}
      <Modal visible={mostrarSucesso} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 25,
              alignItems: "center",
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 50, marginBottom: 15 }}>✅</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              {mensagemSucesso.titulo}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              {mensagemSucesso.desc}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#007A33",
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 10,
              }}
              onPress={finalizarEAtualizar}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                ENTENDIDO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
