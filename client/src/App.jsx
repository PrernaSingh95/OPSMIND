import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import CaseIntakeModal from './components/cases/CaseIntakeModal';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import KnowledgeBase from './pages/KnowledgeBase';
import AgentsWorkbench from './pages/AgentsWorkbench';
import Approvals from './pages/Approvals';
import PromptsEvaluation from './pages/PromptsEvaluation';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

const ProtectedLayout = ({ children, onOpenIntake }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#080B14] text-gray-100 font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenIntake={onOpenIntake} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const navigate = useNavigate();

  const handleCaseCreated = (createdCase) => {
    if (createdCase && createdCase._id) {
      navigate(`/cases/${createdCase._id}`);
    } else {
      navigate('/cases');
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <Dashboard onOpenIntake={() => setIsIntakeOpen(true)} />
            </ProtectedLayout>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <Cases onOpenIntake={() => setIsIntakeOpen(true)} />
            </ProtectedLayout>
          }
        />
        <Route
          path="/cases/:id"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <CaseDetail />
            </ProtectedLayout>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <KnowledgeBase />
            </ProtectedLayout>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <AgentsWorkbench />
            </ProtectedLayout>
          }
        />
        <Route
          path="/approvals"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <Approvals />
            </ProtectedLayout>
          }
        />
        <Route
          path="/prompts-evaluation"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <PromptsEvaluation />
            </ProtectedLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <Analytics />
            </ProtectedLayout>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <AuditLogs />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout onOpenIntake={() => setIsIntakeOpen(true)}>
              <Settings />
            </ProtectedLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Case Intake Modal */}
      <CaseIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onCaseCreated={handleCaseCreated}
      />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
