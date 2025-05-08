import { useEffect, useState } from 'react';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalTipo, setModalTipo] = useState(null);
  const [input, setInput] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      const res = await api.get('/tenants');
      setClientes(res.data);
    } catch (err) {
      logout();
      navigate('/');
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const abrirModal = (tipo, cliente) => {
    setModalTipo(tipo);
    setClienteSelecionado(cliente);
    setInput(tipo === 'editar' ? cliente.nome_empresa : '');
  };

  const fecharModal = () => {
    setModalTipo(null);
    setClienteSelecionado(null);
    setInput('');
  };

  const confirmarAcao = async () => {
    try {
      if (modalTipo === 'editar') {
        await api.put(`/tenants/${clienteSelecionado.id}`, { nome_empresa: input });
      } else if (modalTipo === 'bloquear') {
        await api.patch(`/tenants/${clienteSelecionado.id}/bloquear`, { motivo: input });
      } else if (modalTipo === 'excluir') {
        await api.delete(`/tenants/${clienteSelecionado.id}`);
      }
      carregarClientes();
      fecharModal();
    } catch (err) {
      console.error('Erro ao executar ação:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      <ClienteForm onCriado={carregarClientes} />

      <ul className="mt-4 border-t">
        {clientes.map((c) => (
          <li key={c.id} className="py-3 border-b">
            <div className="flex justify-between items-center">
              <div>
                <strong>{c.nome_empresa}</strong> — {c.status}
                <div className="text-sm text-gray-500">{c.email_admin}</div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => navigate(`/clientes/${c.id}/canais`)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Canais
                </button>
                <button
                  onClick={() => navigate(`/clientes/${c.id}/operadores`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Operadores
                </button>
                <button
                  onClick={() => abrirModal('editar', c)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => abrirModal('bloquear', c)}
                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                >
                  Bloquear
                </button>
                <button
                  onClick={() => abrirModal('excluir', c)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {modalTipo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {modalTipo === 'editar'
                ? 'Editar Nome da Empresa'
                : modalTipo === 'bloquear'
                ? 'Motivo do Bloqueio'
                : 'Confirmar Exclusão'}
            </h2>

            {modalTipo !== 'excluir' && (
              <input
                className="w-full p-2 border rounded mb-4"
                placeholder={modalTipo === 'editar' ? 'Novo nome' : 'Motivo'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            )}

            {modalTipo === 'excluir' && (
              <p className="mb-4 text-red-600">
                Tem certeza que deseja excluir o cliente <strong>{clienteSelecionado?.nome_empresa}</strong>?
                Esta ação não pode ser desfeita.
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={fecharModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAcao}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
