import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperatorAuth } from '../contexts/OperatorAuthContext';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';

export default function FilaConversas() {
  const { tenantId, operatorId } = useOperatorAuth();
  const [conversas, setConversas] = useState([]);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await api.get(`/conversations/tenant/${tenantId}`);
        const ordenadas = res.data.map((conv) => {
          const ultimaMensagem = conv.mensagens?.slice(-1)[0] || null;
          return { ...conv, ultimaMensagem };
        });
        setConversas(ordenadas);
      } catch (err) {
        console.error('Erro ao carregar conversas:', err);
      }
    };

    if (tenantId) carregar();
  }, [tenantId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('mensagem', (msg) => {
      setConversas((prev) => {
        const index = prev.findIndex(c => c.id === msg.conversation.id);
        if (index >= 0) {
          const atualizada = [...prev];
          atualizada[index] = {
            ...atualizada[index],
            ultimaMensagem: msg,
          };
          return atualizada;
        } else {
          return [
            {
              id: msg.conversation.id,
              cliente_nome: msg.conversation.cliente_nome || 'Novo Cliente',
              operador: null,
              ultimaMensagem: msg,
            },
            ...prev,
          ];
        }
      });
    });

    return () => {
      socket.off('mensagem');
    };
  }, [socket]);

  const atender = async (conversaId) => {
    await api.patch(`/conversations/${conversaId}/atribuir`, {
      operadorId: operatorId,
    });
    navigate(`/operador/chat/${conversaId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fila de Atendimento</h1>
      <ul className="space-y-3">
        {conversas.map((conv) => (
          <li key={conv.id} className="border rounded p-4 flex justify-between items-center bg-white">
            <div>
              <strong>{conv.cliente_nome}</strong>
              <p className="text-sm text-gray-600 mt-1">
                Última: {conv.ultimaMensagem?.texto || '—'}
              </p>
              {conv.operador?.nome && (
                <p className="text-xs text-blue-600 mt-1">Atribuído a: {conv.operador.nome}</p>
              )}
            </div>
            <button
              onClick={() => atender(conv.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Atender
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
