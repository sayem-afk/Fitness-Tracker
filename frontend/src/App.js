import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Statistics from './components/Statistics';
import Gyms from './components/Gyms';
import Tutorials from './components/Tutorials';
import Blogs from './components/Blogs';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

// Component to handle redirect logic
const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

// Layout component for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Workouts />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Statistics />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gyms" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Gyms />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutorials" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Tutorials />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blogs" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Blogs />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AdminPanel />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
