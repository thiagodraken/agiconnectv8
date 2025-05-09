import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminCanais() {
  const { tenantId } = useAdminAuth();
  const [canais, setCanais] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    ativo: true,
  });

  const carregar = async () => {
    try {
      const res = await api.get(`/channels/tenant/${tenantId}`);
      setCanais(res.data);
    } catch (err) {
      alert('Erro ao carregar canais');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/channels', {
        ...form,
        tenant: { id: tenantId },
      });
      setForm({ nome: '', tipo: '', ativo: true });
      carregar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao criar canal';
      alert(`❌ ${msg}`);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este canal?')) return;
    try {
      await api.delete(`/channels/${id}`);
      carregar();
    } catch (err) {
      alert('Erro ao excluir canal');
    }
  };

  useEffect(() => {
    if (tenantId) carregar();
  }, [tenantId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Canais</h1>

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
        {canais.map((canal) => (
          <li key={canal.id} className="py-2 border-b flex justify-between items-center">
            <div>
              <strong>{canal.nome}</strong> — {canal.tipo} — {canal.ativo ? 'Ativo' : 'Inativo'}
            </div>
            <button
              onClick={() => excluir(canal.id)}
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
