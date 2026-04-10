import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Image, Linking } from 'react-native';
import { styles } from './styles';

export default function UserView({ categoria }) {
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // ESTADO PARA PESQUISA
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // --- ESTADOS PARA EVENTOS ---
  const [eventos, setEventos] = useState([
    { id: '1', titulo: 'Workshop Direção Defensiva', data: '12/05/2026', local: 'Auditório', descricao: 'Treinamento focado em segurança.', status: 'Ativo', imagem: null, link: '', criadoPor: 'Admin Master' }
  ]);
  const [historicoEventos, setHistoricoEventos] = useState([
    { id: '99', titulo: 'Evento Exemplo Excluído', data: '01/01/2026', local: 'Sede', status: 'Excluiu', criadoPor: 'Sistema' }
  ]);
  
  const [abaInternaEventos, setAbaInternaEventos] = useState('ativos');
  const [modalConfirmarExclusao, setModalConfirmarExclusao] = useState(null);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [modalCriarEvento, setModalCriarEvento] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ titulo: '', data: '', local: '', descricao: '', imagem: null, link: '', criadoPor: 'Admin Atual' });

  // --- ESTADOS PARA MOTORISTAS ---
  const [abaAtiva, setAbaAtiva] = useState('pendentes');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [escrevendoMotivo, setEscrevendoMotivo] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [dados, setDados] = useState({ pendentes: [], aprovados: [], recusados: [] });
  const [visualizandoDoc, setVisualizandoDoc] = useState(null);
  const [docExiste, setDocExiste] = useState(false);

  // --- LÓGICA DE DATA E AUTO-ENCERRAMENTO ---
  const parseData = (str) => {
    if (!str) return null;
    const [dia, mes, ano] = str.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  };

  useEffect(() => {
    if (categoria === 'Eventos' && eventos.length > 0) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const paraMover = [];
      const ativosFicam = eventos.filter(ev => {
        const dataEv = parseData(ev.data);
        if (dataEv && dataEv < hoje && ev.status === 'Ativo') {
          paraMover.push({ ...ev, status: 'Encerrado' });
          return false;
        }
        return true;
      });

      if (paraMover.length > 0) {
        setEventos(ativosFicam);
        setHistoricoEventos(prev => [...paraMover, ...prev]);
      }
    }
  }, [categoria, eventos]);

  // FETCH MOCKADO
  useEffect(() => {
    if (categoria === 'Eventos') { setLoading(false); return; }
    setLoading(true);
    setTermoPesquisa('');
    setTimeout(() => {
      const mockDB = {
        Motorista1: [{ id: '101', nome: 'Ana Silva', email: 'ana@email.com', data: '08/04/2026', status: 'PENDENTE', docsEnviados: ['DOCUMENTO_1'] }],
        Motorista2: [{ id: '201', nome: 'Maria Souza', email: 'maria@email.com', data: '10/04/2026', status: 'PENDENTE', docsEnviados: ['DOCUMENTO_1'] }],
        Motorista3: [{ id: '301', nome: 'Marcia Lima', email: 'marcia@email.com', data: '07/04/2026', status: 'PENDENTE', docsEnviados: [] }],
        Motorista4: [{ id: '401', nome: 'Jorge Oliveira', email: 'jorge@email.com', data: '06/04/2026', status: 'PENDENTE', docsEnviados: ['DOCUMENTO_1'] }]
      };
      setDados({ pendentes: mockDB[categoria] || [], aprovados: [], recusados: [] });
      setLoading(false);
    }, 400);
  }, [categoria]);

  // LOGICA FECHAR COM ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [eventoSelecionado, modalCriarEvento, usuarioSelecionado, modalConfirmarExclusao]);

  const fecharModal = () => {
    setUsuarioSelecionado(null); setEventoSelecionado(null);
    setVisualizandoDoc(null); setModalConfirmarExclusao(null);
    setEscrevendoMotivo(false); setMotivoRecusa('');
    setModalCriarEvento(false);
  };

  const processarExclusaoEvento = () => {
    const ev = eventos.find(e => e.id === modalConfirmarExclusao);
    if (ev) {
      setHistoricoEventos([{ ...ev, status: 'Excluiu' }, ...historicoEventos]);
      setEventos(eventos.filter(e => e.id !== modalConfirmarExclusao));
    }
    setModalConfirmarExclusao(null);
  };

  const moverUsuario = (novoStatus) => {
    if (!usuarioSelecionado) return;
    if (novoStatus === 'Recusado' && motivoRecusa.trim() === '') {
        alert("Por favor, descreva o motivo da recusa.");
        return;
    }
    const userModificado = { ...usuarioSelecionado, status: novoStatus, motivoRecusa: novoStatus === 'Recusado' ? motivoRecusa : '' };
    setDados(prev => {
      const p = prev.pendentes.filter(u => u.id !== usuarioSelecionado.id);
      const a = prev.aprovados.filter(u => u.id !== usuarioSelecionado.id);
      const r = prev.recusados.filter(u => u.id !== usuarioSelecionado.id);
      return {
        pendentes: novoStatus === 'Pendente' ? [...p, userModificado] : p,
        aprovados: novoStatus === 'Aprovado' ? [...a, userModificado] : a,
        recusados: novoStatus === 'Recusado' ? [...r, userModificado] : r,
      };
    });
    fecharModal();
  };

  const cadastrarNovoEvento = () => {
    if (!novoEvento.titulo || !novoEvento.data || !novoEvento.local || !novoEvento.descricao) {
      alert("Título, Data, Local e Mensagem são obrigatórios.");
      return;
    }
    setEventos([...eventos, { ...novoEvento, id: Date.now().toString().slice(-4), status: 'Ativo' }]);
    setNovoEvento({ titulo: '', data: '', local: '', descricao: '', imagem: null, link: '', criadoPor: 'Admin Atual' });
    setModalCriarEvento(false);
  };

  const filtrarItens = (lista) => {
    const termo = termoPesquisa.toLowerCase();
    return lista.filter(item => 
      (item.nome?.toLowerCase().includes(termo)) || 
      (item.titulo?.toLowerCase().includes(termo)) || 
      (item.email?.toLowerCase().includes(termo)) || 
      (item.id?.toString().includes(termo)) ||
      (item.local?.toLowerCase().includes(termo))
    ).sort((a, b) => parseData(a.data) - parseData(b.data));
  };

  if (categoria === 'Eventos') {
    const listaExibida = filtrarItens(abaInternaEventos === 'ativos' ? eventos : historicoEventos);
    return (
      <ScrollView style={styles.content}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setNovoEvento({ ...novoEvento, imagem: reader.result });
                  reader.readAsDataURL(file);
              }
        }} />
        <View style={styles.tableHeaderRow}>
          <View style={{flexDirection: 'row', gap: 20}}>
            <TouchableOpacity onPress={() => {setAbaInternaEventos('ativos'); setTermoPesquisa('');}}><Text style={[styles.TopText, { color: abaInternaEventos === 'ativos' ? '#007A33' : '#999' }]}>Ativos</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {setAbaInternaEventos('historico'); setTermoPesquisa('');}}><Text style={[styles.TopText, { color: abaInternaEventos === 'historico' ? '#007A33' : '#999' }]}>Histórico</Text></TouchableOpacity>
          </View>
          {abaInternaEventos === 'ativos' && <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#007A33'}]} onPress={() => setModalCriarEvento(true)}><Text style={styles.btnText}>ADICIONAR EVENTO</Text></TouchableOpacity>}
        </View>

        <View style={styles.mainActionCard}>
          <TextInput style={[styles.inputRecusa, {borderRadius: 6, marginBottom: 15, marginTop: 0, color: '#666', backgroundColor: '#F8F9FA'}]} placeholder="Pesquisar..." value={termoPesquisa} onChangeText={setTermoPesquisa} />
          <View style={styles.tableHeader}>
            <Text style={[styles.columnLabel, { flex: 2 }]}>TÍTULO</Text>
            <Text style={[styles.columnLabel, { flex: 1 }]}>DATA</Text>
            <Text style={[styles.columnLabel, { flex: 1 }]}>LOCAL</Text>
            <Text style={[styles.columnLabel, { flex: 0.5, textAlign: 'right' }]}>STATUS</Text>
          </View>
          {listaExibida.map(ev => (
            <TouchableOpacity key={ev.id} style={[styles.tableRow, ev.status === 'Excluiu' && { backgroundColor: '#FFEBEE' }]} onPress={() => setEventoSelecionado(ev)}>
              <View style={{ flex: 2 }}><Text style={{fontWeight: 'bold'}}>{ev.titulo}</Text></View>
              <View style={{ flex: 1 }}><Text style={{color: ev.status === 'Ativo' ? '#007A33' : '#333', fontWeight: 'bold'}}>{ev.data}</Text></View>
              <View style={{ flex: 1 }}><Text style={{color: '#333', fontWeight: 'bold'}}>{ev.local}</Text></View>
              <View style={{ flex: 0.5, alignItems: 'flex-end' }}><Text style={{ fontWeight: 'bold', color: ev.status === 'Excluiu' ? '#D32F2F' : '#333' }}>{ev.status === 'Excluiu' ? 'Excluído' : ev.status === 'Encerrado' ? 'ENCERRADO' : 'Ativo'}</Text></View>
            </TouchableOpacity>
          ))}
        </View>

        <Modal visible={eventoSelecionado !== null} transparent animationType="fade">
          <View style={styles.modalOverlay}><View style={[styles.modalContent, { maxWidth: 700 }]}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Detalhes do Evento</Text><TouchableOpacity onPress={fecharModal}><Text style={{fontSize: 22, fontWeight: 'bold'}}>×</Text></TouchableOpacity></View>
            <ScrollView>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{eventoSelecionado?.titulo}</Text>
              <Text style={{ color: '#007A33', fontWeight: 'bold', marginVertical: 10 }}>📅 {eventoSelecionado?.data} - 📍 {eventoSelecionado?.local}</Text>
              <Text style={{ lineHeight: 22, fontSize: 16 }}>{eventoSelecionado?.descricao}</Text>
              {eventoSelecionado?.link && <TouchableOpacity onPress={() => window.open(eventoSelecionado.link, '_blank')} style={{ marginTop: 20, padding: 15, backgroundColor: '#F0F2F5', borderRadius: 6, borderLeftWidth: 5, borderLeftColor: '#007A33' }}><Text style={{ color: '#007A33', fontWeight: 'bold' }}>🔗 Link Anexado: {eventoSelecionado.link}</Text></TouchableOpacity>}
              {eventoSelecionado?.imagem && <Image source={{ uri: eventoSelecionado.imagem }} style={{ width: '100%', height: 250, borderRadius: 6, marginTop: 15 }} resizeMode="contain" />}
            </ScrollView>
            <View style={[styles.modalFooterButtons, { justifyContent: 'flex-end', gap: 10 }]}>
              {eventoSelecionado?.status === 'Ativo' && <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#D32F2F'}]} onPress={() => { const id = eventoSelecionado.id; setEventoSelecionado(null); setModalConfirmarExclusao(id); }}><Text style={styles.btnText}>EXCLUIR</Text></TouchableOpacity>}
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#666'}]} onPress={fecharModal}><Text style={styles.btnText}>FECHAR</Text></TouchableOpacity>
            </View>
          </View></View>
        </Modal>

        <Modal visible={modalCriarEvento} transparent animationType="fade">
          <View style={styles.modalOverlay}><View style={[styles.modalContent, { maxWidth: 600 }]}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Novo Evento</Text><TouchableOpacity onPress={fecharModal}><Text style={{fontSize: 22, fontWeight: 'bold'}}>×</Text></TouchableOpacity></View>
            <ScrollView>
              <TextInput style={styles.inputRecusa} placeholder="Título *" onChangeText={(t)=>setNovoEvento({...novoEvento, titulo:t})} />
              <TextInput style={styles.inputRecusa} placeholder="Data (dd/mm/aaaa) *" onChangeText={(t)=>setNovoEvento({...novoEvento, data:t})} />
              <TextInput style={styles.inputRecusa} placeholder="Local *" onChangeText={(t)=>setNovoEvento({...novoEvento, local:t})} />
              <TextInput style={[styles.inputRecusa, {height:80}]} multiline placeholder="Mensagem *" onChangeText={(t)=>setNovoEvento({...novoEvento, descricao:t})} />
              <TextInput style={styles.inputRecusa} placeholder="Link (Opcional)" onChangeText={(t)=>setNovoEvento({...novoEvento, link:t})} />
              <TouchableOpacity style={{padding:15, backgroundColor:'#EEE', borderRadius: 8, marginTop:10}} onPress={()=>fileInputRef.current.click()}><Text>{novoEvento.imagem ? "✅ Imagem Selecionada" : "📁 Selecionar Imagem (Opcional)"}</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#007A33', marginTop:20}]} onPress={cadastrarNovoEvento}><Text style={styles.btnText}>SALVAR</Text></TouchableOpacity>
            </ScrollView>
          </View></View>
        </Modal>

        <Modal visible={modalConfirmarExclusao !== null} transparent animationType="fade">
          <View style={styles.modalOverlay}><View style={[styles.modalContent, { maxWidth: 400, alignItems: 'center' }]}>
            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Deseja realmente excluir este evento e mover para o histórico?</Text>
            <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#666'}]} onPress={() => setModalConfirmarExclusao(null)}><Text style={styles.btnText}>NÃO</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#D32F2F'}]} onPress={processarExclusaoEvento}><Text style={styles.btnText}>SIM, EXCLUIR</Text></TouchableOpacity>
            </View>
          </View></View>
        </Modal>
      </ScrollView>
    );
  }

  // --- MOTORISTAS ---
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#007A33" /></View>;
  const motoristasExibidos = filtrarItens(abaAtiva === 'nenhuma' ? [] : dados[abaAtiva]);

  return (
    <ScrollView style={styles.content}>
      <Text style={styles.welcomeText}>{categoria}</Text>
      <View style={styles.row}>
        {['pendentes', 'aprovados', 'recusados'].map(cat => (
          <TouchableOpacity key={cat} style={[styles.card, { borderLeftColor: cat === 'pendentes' ? '#F9B233' : cat === 'aprovados' ? '#007A33' : '#D32F2F' }]} onPress={() => {setAbaAtiva(cat); setTermoPesquisa('');}}>
            <Text style={styles.cardLabel}>{cat.toUpperCase()}</Text>
            <Text style={styles.cardNumber}>{dados[cat].length.toString().padStart(2, '0')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.mainActionCard}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.actionTitle}>LISTAGEM: {abaAtiva.toUpperCase()}</Text>
          {abaAtiva !== 'nenhuma' && <TouchableOpacity onPress={() => setAbaAtiva('nenhuma')}><Text style={{color: '#D32F2F', fontWeight: 'bold'}}>Fechar X</Text></TouchableOpacity>}
        </View>
        <TextInput style={[styles.inputRecusa, {borderRadius: 6, marginBottom: 15, marginTop: 0, color: '#666', backgroundColor: '#F8F9FA'}]} placeholder="Pesquisar..." value={termoPesquisa} onChangeText={setTermoPesquisa} />
        <View style={styles.tableHeader}>
          <Text style={[styles.columnLabel, { flex: 0.5 }]}>ID</Text>
          <Text style={[styles.columnLabel, { flex: 2 }]}>NOME</Text>
          <Text style={[styles.columnLabel, { flex: 2 }]}>E-MAIL</Text>
          <Text style={[styles.columnLabel, { flex: 1 }]}>DATA</Text>
          <Text style={[styles.columnLabel, { flex: 0.5 }]}></Text>
        </View>
        {motoristasExibidos.map(u => (
          <TouchableOpacity key={u.id} style={styles.tableRow} onPress={()=>setUsuarioSelecionado(u)}>
            <Text style={{flex:0.5, color: '#666'}}>#{u.id}</Text>
            <View style={{ flex: 2 }}><Text style={{color: '#333', fontWeight: 'bold'}}>{u.nome}</Text></View>
            <View style={{ flex: 2 }}><Text style={{color: '#333', fontWeight: 'bold'}}>{u.email}</Text></View>
            <View style={{ flex: 1 }}><Text style={{color: '#333', fontWeight: 'bold'}}>{u.data}</Text></View>
            <Text style={{flex:0.5, textAlign:'right', color:'#007A33', fontWeight:'bold'}}>ABRIR {'>'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={usuarioSelecionado !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}><View style={[styles.modalContent, { height: '80%' }]}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{escrevendoMotivo ? "Motivo da Recusa" : "Painel do Usuário"}</Text>
              <Text style={{color: usuarioSelecionado?.status === 'Recusado' ? '#D32F2F' : '#F9B233', fontWeight: 'bold', fontSize: 12}}>STATUS: {usuarioSelecionado?.status}</Text>
            </View>
            <TouchableOpacity onPress={fecharModal}><Text style={{fontSize: 22, fontWeight: 'bold'}}>×</Text></TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {escrevendoMotivo ? (
              <TextInput style={[styles.inputRecusa, {height: 150, textAlignVertical: 'top'}]} multiline placeholder="Descreva o motivo da recusa..." onChangeText={setMotivoRecusa} />
            ) : (
              <>
                <Text style={styles.infoText}>ID do Registro: {usuarioSelecionado?.id}</Text>
                <Text style={styles.infoText}>Nome: {usuarioSelecionado?.nome}</Text>
                <Text style={styles.infoText}>E-mail: {usuarioSelecionado?.email}</Text>
                <Text style={styles.infoText}>Data: {usuarioSelecionado?.data}</Text>

                {usuarioSelecionado?.status === 'Recusado' && usuarioSelecionado?.motivoRecusa && (
                  <View style={{backgroundColor: '#FFEBEE', padding: 15, borderRadius: 6, marginVertical: 15, borderLeftWidth: 4, borderLeftColor: '#D32F2F'}}>
                    <Text style={{fontWeight: 'bold', color: '#D32F2F', marginBottom: 5}}>MOTIVO DA RECUSA:</Text>
                    <Text style={{color: '#333'}}>{usuarioSelecionado.motivoRecusa}</Text>
                  </View>
                )}

                <Text style={[styles.modalSectionTitle, {marginTop: 25}]}>Documentos Enviados</Text>
                {['DOCUMENTO_1', 'DOCUMENTO_2'].map(doc => (
                  <View key={doc} style={styles.docItem}><Text style={styles.docText}>📄 {doc}.pdf</Text>
                    <TouchableOpacity onPress={() => { setVisualizandoDoc(doc); setDocExiste(usuarioSelecionado?.docsEnviados?.includes(doc)); }}><Text style={styles.viewDocLink}>Visualizar</Text></TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
          <View style={[styles.modalFooterButtons, { justifyContent: 'flex-end', gap: 10, paddingTop: 15 }]}>
            {escrevendoMotivo ? (
              <><TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#666'}]} onPress={() => setEscrevendoMotivo(false)}><Text style={styles.btnText}>CANCELAR</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#D32F2F'}]} onPress={() => moverUsuario('Recusado')}><Text style={styles.btnText}>CONFIRMAR RECUSA</Text></TouchableOpacity></>
            ) : (
              <><TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#666'}]} onPress={fecharModal}><Text style={styles.btnText}>FECHAR</Text></TouchableOpacity>
                {usuarioSelecionado?.status === 'PENDENTE' && (
                  <><TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#D32F2F'}]} onPress={() => setEscrevendoMotivo(true)}><Text style={styles.btnText}>RECUSAR</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#007A33'}]} onPress={() => moverUsuario('Aprovado')}><Text style={styles.btnText}>APROVAR</Text></TouchableOpacity></>
                )}
              </>
            )}
          </View>
        </View></View>
      </Modal>

      <Modal visible={visualizandoDoc !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}><View style={[styles.modalContent, { width: '85%', height: '85%' }]}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>Visualizando: {visualizandoDoc}</Text><TouchableOpacity onPress={() => setVisualizandoDoc(null)}><Text style={{fontSize: 22, fontWeight: 'bold'}}>×</Text></TouchableOpacity></View>
          <View style={{ flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#DDD' }}>
            {docExiste ? <Text>📄 Documento Carregado</Text> : <Text style={{color: 'red'}}>🚫 Não Anexado</Text>}
          </View>
        </View></View>
      </Modal>
    </ScrollView>
  );
}