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
    <div>
      <h2>Painel do Operador</h2>
      <div>
        <button onClick={trocarSenha}>Alterar Senha</button>
        <button onClick={logout}>Sair</button>
      </div>
      <p>Bem-vindo ao painel do operador.</p>
    </div>
  );
}
