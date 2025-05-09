import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [info, setInfo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setInfo(res.data);
      } catch (err) {
        setErro('Erro ao carregar informações do painel do cliente.');
      }
    };

    carregar();
  }, []);

  if (erro) {
    return <p className="text-red-600 text-center mt-10">{erro}</p>;
  }

  if (!info) {
    return <p className="text-center mt-10">Carregando painel do cliente...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Painel do Cliente</h1>
      <div className="bg-white rounded shadow p-4 space-y-2 max-w-md">
        <p><strong>Email:</strong> {info.user.email}</p>
        <p><strong>ID do Tenant:</strong> {info.user.tenantId}</p>
        <p><strong>Perfil:</strong> {info.user.role}</p>
        <p className="text-sm text-gray-500">
          Essa conta está vinculada ao seu ambiente de cliente. Você pode configurar canais, operadores e WhatsApp API.
        </p>
      </div>
    </div>
  );
}
