import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import NurseDashboard from './pages/NurseDashboard';
import AgentDashboard from './pages/AgentDashboard';
import LabDashboard from './pages/LabDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { user } = useAuth();

  if (!user) return <Login />;

  const renderPage = () => {
    switch (user.role) {
      case 'doctor': return <DoctorDashboard />;
      case 'nurse': return <NurseDashboard />;
      case 'agent': return <AgentDashboard />;
      case 'lab': return <LabDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <DoctorDashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}
