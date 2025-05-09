// 📁 frontend/src/pages/AtendimentoOperador.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AtendimentoOperador() {
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarFila();
  }, []);

  const carregarFila = async () => {
    try {
      const res = await api.get('/fila');
      setFila(res.data);
    } catch (err) {
      setErro('Erro ao carregar fila de atendimento.');
    } finally {
      setLoading(false);
    }
  };

  const atenderCliente = async (id) => {
    try {
      const res = await api.put(`/fila/${id}/atender`);
      const conversa = res.data;
      navigate(`/chat/${conversa.conversaId}`);
    } catch (err) {
      alert('Erro ao atender cliente.');
    }
  };

  if (loading) return <p>Carregando fila...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div>
      <h2>Fila de Atendimento</h2>
      {fila.length === 0 ? (
        <p>Nenhum cliente aguardando.</p>
      ) : (
        <ul>
          {fila.map((cliente) => (
            <li key={cliente.id}>
              <strong>{cliente.nome}</strong> - {cliente.mensagem}{' '}
              <button onClick={() => atenderCliente(cliente.id)}>Atender</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}