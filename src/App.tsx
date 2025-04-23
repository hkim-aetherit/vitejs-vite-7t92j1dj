import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Main } from './components/Main';
import { VideoChat } from './components/VideoChat';
import { WelcomePage } from './components/WelcomePage';

const AUTH_KEY = 'isAuthenticated';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route
        path="/main"
        element={
          isAuthenticated ? (
            <Main
              onLogin={() => setIsAuthenticated(true)}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/talk/:id"
        element={isAuthenticated ? <VideoChat /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/main" replace />
          ) : (
            <WelcomePage
              isAuthenticated={isAuthenticated}
              onAuthenticate={() => setIsAuthenticated(true)}
            />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}