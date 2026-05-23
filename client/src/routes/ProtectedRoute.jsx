import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
  const { user, booting } = useAuth();

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <Spinner label="Opening workspace" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
