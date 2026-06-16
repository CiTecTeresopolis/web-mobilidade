import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({

  // CONTAINER PRINCIPAL
  container: { 
    flex: 1, 
    backgroundColor: '#F0F2F5', 
    height: '100vh' 
  },

  // HEADER SUPERIOR
  header: { 
    height: 55, 
    backgroundColor: '#007A33', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25,
    zIndex: 10,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }
    })
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  logoutButton: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 6 
  },
  logoutText: { 
    color: '#FFF', 
    fontWeight: '600' 
  },

  // BARRA DE ABAS FIXAS
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E0E0E0', 
    paddingHorizontal: 10,
    gap: 5,
  },
  tabItem: { 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    marginTop: 1,
    borderBottomColor: 'transparent',
  },
  tabAtiva: { 
    backgroundColor: '#F0F2F5', 
    borderBottomColor: '#007A33' 
  },
  tabTitle: { 
    fontSize: 14, 
    color: '#666', 
    fontWeight: '500' 
  },
  tabTitleAtivo: { 
    color: '#007A33', 
    fontWeight: 'bold' 
  },

  // ÁREA DE CONTEÚDO
  content: { 
    flex: 1, 
    padding: 25 
  },
  welcomeText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  TopText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    margin: 2
  },

  // CARDS DE ESTATÍSTICA
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: '#FFF', 
    width: '32%', 
    padding: 20, 
    borderRadius: 6, 
    borderLeftWidth: 5, 
    elevation: 3 
  },
  cardLabel: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  cardNumber: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 5 
  },

  // ÁREA DA TABELA
  mainActionCard: { 
    backgroundColor: '#FFF', 
    padding: 30, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  tableHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  actionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },

  // TABELA ESTILO PLANILHA
  tableHeader: { 
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: '#F8F9FA', 
    borderBottomWidth: 2, 
    borderBottomColor: '#EEE' 
  },
  columnLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#999' 
  },
  tableRow: { 
    flexDirection: 'row', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F2F5', 
    alignItems: 'center' 
  },
  tableCell: { 
    fontSize: 14, 
    color: '#444' 
  },
  emptyText: { 
    textAlign: 'center', 
    padding: 40, 
    color: '#999' 
  },

  // MODAL
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '90%', 
    maxWidth: 600, 
    backgroundColor: '#FFF', 
    borderRadius: 6, 
    padding: 25, 
    maxHeight: '85%' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    paddingBottom: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#007A33' 
  },
  statusTag: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginTop: 4, 
    textTransform: 'uppercase' 
  },
  modalSectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  infoText: { 
    fontSize: 14, 
    marginBottom: 5, 
    color: '#555' 
  },
  inputRecusa: { 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    padding: 12, 
    marginTop: 10, 
    fontSize: 14,
    backgroundColor: '#FAFAFA' // Opcional, para dar um destaque
  },
  docItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 12, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 6, 
    marginBottom: 10 
  },
  docText: { 
    fontSize: 13, 
    color: '#444' 
  },
  viewDocLink: { 
    color: '#007A33', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  modalFooterButtons: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 30, 
    gap: 10 
  },
  actionBtn: { 
    padding: 12, 
    borderRadius: 6 
  },
  btnText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  finalizedContainer: { 
    marginTop: 30, 
    padding: 20, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  finalizedText: { 
    color: '#999', 
    fontSize: 14, 
    fontStyle: 'italic' 
  },

  // HOME
  homeWelcomeContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  homeTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#007A33' 
  },
  homeSubtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 10 
  },
});