import { useEffect, useState } from 'react';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
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

  const editarLimites = async (cliente) => {
    const canais = prompt('Canais máximos:', cliente.canais_maximos);
    const operadores = prompt('Operadores máximos:', cliente.operadores_maximos);
    const disco = prompt('Espaço em disco (MB):', cliente.espaco_em_disco_mb);
    const expiracao = prompt('Data de expiração (formato ISO ex: 2025-12-31T23:59):', cliente.expiracao?.slice(0, 16));

    if (canais && operadores && disco && expiracao) {
      await api.put(`/tenants/${cliente.id}`, {
        canais_maximos: parseInt(canais),
        operadores_maximos: parseInt(operadores),
        espaco_em_disco_mb: parseInt(disco),
        expiracao,
      });
      carregarClientes();
    }
  };

  const alterarSenha = async (cliente) => {
    const novaSenha = prompt('Nova senha para o admin deste cliente:');
    if (novaSenha) {
      await api.patch(`/tenants/${cliente.id}/senha`, { novaSenha });
    }
  };

  const bloquearCliente = async (cliente) => {
    const motivo = prompt('Motivo do bloqueio:');
    if (motivo) {
      await api.patch(`/tenants/${cliente.id}/bloquear`, { motivo });
    }
  };

  const excluirCliente = async (cliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome_empresa}"?`)) {
      await api.delete(`/tenants/${cliente.id}`);
      carregarClientes();
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
                <div className="text-xs text-gray-600 mt-1">
                  Canais: {c.canais_maximos} | Operadores: {c.operadores_maximos} | Espaço: {c.espaco_em_disco_mb} MB | Expira: {c.expiracao?.slice(0, 10)}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => editarLimites(c)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Editar Limites
                </button>
                <button
                  onClick={() => alterarSenha(c)}
                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={() => bloquearCliente(c)}
                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                >
                  Bloquear
                </button>
                <button
                  onClick={() => excluirCliente(c)}
                  className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
