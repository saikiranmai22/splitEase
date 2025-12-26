import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import JoinGroup from './pages/JoinGroup';
import Navbar from './components/Navbar';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/new"
                element={
                  <PrivateRoute>
                    <CreateGroup />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/:id"
                element={
                  <PrivateRoute>
                    <GroupDetails />
                  </PrivateRoute>
                }
              />
              <Route path="/join/:token" element={<JoinGroup />} />
              {/* Add more routes here */}
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
