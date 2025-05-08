import { useOperatorAuth } from '../contexts/OperatorAuthContext';

export default function OperatorDashboard() {
  const { logout, operatorId } = useOperatorAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Painel do Operador</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Sair
        </button>
      </div>
      <p className="text-gray-700">Bem-vindo operador ID: <strong>{operatorId}</strong></p>
      <p className="mt-2 text-sm">Recursos como atendimento e mensagens aparecerão aqui.</p>
    </div>
  );
}
