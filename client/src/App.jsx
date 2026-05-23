import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#101525',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.18)'
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
