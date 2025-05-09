// 📁 frontend/src/pages/ChatAtivo.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

export default function ChatAtivo() {
  const { conversaId } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [nova, setNova] = useState('');

  useEffect(() => {
    carregarMensagens();
    const socket = io('http://localhost:3000', {
      query: { conversaId },
    });

    socket.on('nova-mensagem', (msg) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversaId]);

  const carregarMensagens = async () => {
    const res = await api.get(`/conversas/${conversaId}`);
    setMensagens(res.data);
  };

  const enviar = async () => {
    if (!nova.trim()) return;

    // Envio via WhatsApp Cloud API
    await fetch('https://graph.facebook.com/v17.0/PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer SUA_TOKEN_DO_META',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '5511999999999', // cliente real
        type: 'text',
        text: { body: nova },
      }),
    });

    setNova('');
  };

  return (
    <div>
      <h2>Atendimento Ativo</h2>
      <p>Conversa: <strong>{conversaId}</strong></p>
      <Link to="/atendimento">← Voltar para Fila</Link>

      <div style={{ border: '1px solid #ccc', padding: 10, marginTop: 20 }}>
        {mensagens.map((msg, i) => (
          <p key={i}><strong>{msg.de === 'operador' ? 'Você' : 'Cliente'}:</strong> {msg.texto}</p>
        ))}
        <input
          type="text"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}
