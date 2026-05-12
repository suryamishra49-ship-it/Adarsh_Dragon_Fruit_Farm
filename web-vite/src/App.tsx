import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Guide from './pages/Guide';
import Marketplace from './pages/Marketplace';
import Scanner from './pages/Scanner';
import History from './pages/History';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/scanner" element={<Scanner />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
