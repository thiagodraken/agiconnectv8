import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';

export default function Chat() {
  const { id } = useParams(); // conversa ID
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [conversaInfo, setConversaInfo] = useState(null);
  const chatRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    const carregarConversa = async () => {
      const res = await api.get(`/conversations/${id}`);
      setConversaInfo(res.data);
      setMensagens(res.data.mensagens || []);
    };

    carregarConversa();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('mensagem', (msg) => {
      if (msg.conversation.id === id) {
        setMensagens((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('mensagem');
    };
  }, [socket, id]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    const mensagem = {
      texto,
      autor: 'operador',
      conversation: { id },
    };

    socket.emit('mensagem', mensagem);
    setTexto('');
  };

  return (
    <div className="h-full flex flex-col max-h-screen">
      <div className="p-4 border-b font-bold flex justify-between items-center">
        <span>Conversa #{id}</span>
        {conversaInfo?.operador?.nome && (
          <span className="text-sm text-gray-600">Operador: {conversaInfo.operador.nome}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {mensagens.map((m, i) => (
          <div
            key={m.id || i}
            className={`max-w-sm p-2 rounded ${
              m.autor === 'operador'
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-white text-gray-800 self-start mr-auto'
            }`}
          >
            {m.texto}
          </div>
        ))}
        <div ref={chatRef} />
      </div>

      <form onSubmit={enviar} className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enviar</button>
      </form>
    </div>
  );
}
