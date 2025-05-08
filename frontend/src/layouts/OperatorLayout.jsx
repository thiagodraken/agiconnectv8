import { Link, Outlet } from 'react-router-dom';
import { useOperatorAuth } from '../contexts/OperatorAuthContext';

export default function OperatorLayout() {
  const { logout } = useOperatorAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Painel do Operador
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/operador/dashboard" className="block px-2 py-1 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link to="/operador/atendimento" className="block px-2 py-1 hover:bg-gray-700 rounded">
            Atendimento
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
