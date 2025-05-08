import { useOperatorAuth } from '../contexts/OperatorAuthContext';
import { useEffect, useState } from 'react';

export default function Atendimento() {
  const { operatorId } = useOperatorAuth();
  const [conversas, setConversas] = useState([]);

  useEffect(() => {
    // Em breve: puxar da API real
    setConversas([
      {
        id: 1,
        cliente: 'João Silva',
        ultimaMensagem: 'Preciso de ajuda com o pedido...',
        horario: '10:32',
      },
      {
        id: 2,
        cliente: 'Maria Souza',
        ultimaMensagem: 'Obrigado pela resposta!',
        horario: '10:45',
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Atendimentos</h1>
      <p className="text-sm text-gray-600 mb-4">Operador ID: {operatorId}</p>

      <ul className="space-y-4">
        {conversas.map((conv) => (
          <li key={conv.id} className="border rounded p-4 shadow-sm hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <strong>{conv.cliente}</strong>
              <span className="text-sm text-gray-500">{conv.horario}</span>
            </div>
            <p className="text-gray-700 mt-1 text-sm">{conv.ultimaMensagem}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
