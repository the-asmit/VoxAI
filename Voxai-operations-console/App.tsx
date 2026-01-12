
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Profiles from './pages/Profiles';
import OutboundCalls from './pages/OutboundCalls';
import CallHistory from './pages/CallHistory';
import Complaints from './pages/Complaints';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/outbound" element={<OutboundCalls />} />
          <Route path="/history" element={<CallHistory />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
