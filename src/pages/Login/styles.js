import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    height: "100vh",
    width: "100vw",
    backgroundColor: "#F2F5F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    padding: 30,
    borderTopWidth: 5,
    borderTopColor: "#007A33",
  },
  logoPlaceholder: {
    width: 160,
    height: 210,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  placeholderText: {
    // TEXTO Q TA NO LUGAR DA IMAGEM
    fontSize: 10,
    color: "#007A33",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 25, // MOBILIDADE
    fontWeight: "800",
    color: "#007A33",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12, // PORTAL ADMINISTRADOR
    color: "#666",
    fontWeight: "500",
    marginBottom: 15,
  },
  label: {
    fontSize: 14, // USUARIO/EMAIL e SENHA
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    // CAIXA DE INSERIR DADOS
    height: 35,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    outlineStyle: "#666", // BORDA DA CAIXA
  },
  button: {
    // BOTAO DE ENTRAR
    height: 35,
    backgroundColor: "#007A33",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    // ENTRAR
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  errorText: {
    // MENSAGEM DE ERRO
    color: "#D32F2F",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  logoFooterImage: {
    // LOGO DA PREFEITURA
    width: 210,
    height: 60,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 1,
  },
  footerText: {
    // SMCT
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  forgotPassContainer: {
    //alignItems: 'center',
    marginTop: 4,
  },
  forgotText: {
    // ESQUECI MINHA SENHA
    fontSize: 12,
    color: "#007A33",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
