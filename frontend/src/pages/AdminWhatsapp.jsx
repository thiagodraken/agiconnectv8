import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminWhatsapp() {
  const { tenantId } = useAdminAuth();

  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [numeroDestino, setNumeroDestino] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const carregarConfig = async () => {
      try {
        const res = await api.get(`/whatsapp/config/${tenantId}`);
        if (res.data) {
          setAccessToken(res.data.accessToken);
          setPhoneNumberId(res.data.phoneNumberId);
        }
      } catch (err) {
        console.error('Erro ao carregar config do WhatsApp:', err);
      }
    };

    if (tenantId) {
      carregarConfig();
    }
  }, [tenantId]);

  const salvarConfig = async () => {
    try {
      await api.post('/whatsapp/config', {
        tenant: { id: tenantId },
        accessToken,
        phoneNumberId,
      });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar config:', err);
      setErro('Erro ao salvar configurações.');
    }
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    try {
      const res = await api.post('/whatsapp/enviar', {
        accessToken,
        phoneNumberId,
        numeroDestino,
        mensagem,
      });
      setResultado(res.data);
    } catch (err) {
      setErro('Erro ao enviar mensagem. Verifique o token e o número.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">WhatsApp Cloud API</h1>

      <div className="grid grid-cols-1 gap-3 max-w-lg mb-6">
        <input
          className="border p-2"
          placeholder="Access Token"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Phone Number ID"
          value={phoneNumberId}
          onChange={(e) => setPhoneNumberId(e.target.value)}
          required
        />
        <button
          onClick={salvarConfig}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Salvar Configuração
        </button>
        {salvo && <p className="text-green-600 text-sm">✅ Configuração salva com sucesso.</p>}
      </div>

      <form onSubmit={enviar} className="grid grid-cols-1 gap-3 max-w-lg mb-6">
        <input
          className="border p-2"
          placeholder="Número de Destino (ex: 5511999999999)"
          value={numeroDestino}
          onChange={(e) => setNumeroDestino(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </form>

      {resultado && (
        <pre className="bg-green-100 text-green-800 p-4 rounded text-sm whitespace-pre-wrap">
          ✅ Mensagem enviada:
          {"\n"}{JSON.stringify(resultado, null, 2)}
        </pre>
      )}

      {erro && <p className="text-red-600">{erro}</p>}
    </div>
  );
}
