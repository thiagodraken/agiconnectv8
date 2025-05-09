import { useOperatorAuth } from '../contexts/OperatorAuthContext';
import { useState } from 'react';
import api from '../services/api';

export default function OperatorDashboard() {
  const { logout } = useOperatorAuth();
  const [novaSenha, setNovaSenha] = useState('');

  const trocarSenha = async () => {
    const nova = prompt('Nova senha:');
    if (!nova) return;

    try {
      await api.patch('/auth/alterar-senha', { novaSenha: nova });
      alert('✅ Senha alterada com sucesso.');
    } catch (err) {
      alert('❌ Erro ao alterar senha.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Painel do Operador</h1>
        <div className="flex gap-2">
          <button onClick={trocarSenha} className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700">
            Alterar Senha
          </button>
          <button onClick={logout} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
            Sair
          </button>
        </div>
      </div>
      <p className="text-gray-700">Bem-vindo ao painel do operador.</p>
    </div>
  );
}
