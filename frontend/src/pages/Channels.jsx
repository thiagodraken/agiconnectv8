import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Channels() {
  const { id } = useParams(); // id do tenant
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    ativo: true,
  });

  const carregar = async () => {
    try {
      const res = await api.get(`/channels/tenant/${id}`);
      setChannels(res.data);
    } catch (err) {
      console.error('Erro ao carregar canais:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/channels', { ...form, tenant: { id } });
      setForm({ nome: '', tipo: '', ativo: true });
      carregar();
    } catch (err) {
      console.error('Erro ao criar canal:', err);
    }
  };

  const excluir = async (canalId) => {
    if (!window.confirm('Deseja excluir este canal?')) return;
    try {
      await api.delete(`/channels/${canalId}`);
      carregar();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Voltar ao painel
      </button>

      <h1 className="text-2xl font-bold mb-4">Canais do Cliente</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 max-w-md mb-6">
        <input
          className="border p-2"
          placeholder="Nome do Canal"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          className="border p-2"
          placeholder="Tipo (ex: whatsapp)"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          required
        />
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Criar Canal
        </button>
      </form>

      <ul className="border-t">
        {channels.map((ch) => (
          <li key={ch.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <strong>{ch.nome}</strong> — {ch.tipo} — {ch.ativo ? 'Ativo' : 'Inativo'}
            </div>
            <button
              onClick={() => excluir(ch.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
