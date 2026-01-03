import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FlashcardsList } from './pages/FlashcardsList';
import { StudyMode } from './pages/StudyMode';
import { Login } from './pages/Login';
import { Documentation } from './pages/Documentation';
import { FlashcardFilters } from './types';
import { Header } from './components/Header';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { checkAuth } from './api/auth';
import styles from './App.module.scss';

function AppContent() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FlashcardFilters>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);


  async function checkAuthStatus() {
    try {
      await checkAuth();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true);
  }


  function handleBackToList() {
    navigate('/');
  }

  async function handleLogout() {
    try {
      const { logout } = await import('./api/auth');
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still set to false even if logout fails
      setIsAuthenticated(false);
    }
  }

  // Show loading while checking auth (very brief)
  if (isAuthenticated === null) {
    return (
      <div className={styles.app}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          Loading...
        </div>
      </div>
    );
  }

  // Show app (public viewing allowed)
  return (
      <div className={styles.app}>
        <Routes>
          <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
              path="/"
              element={
                <>
                  <Header
                      isAuthenticated={isAuthenticated}
                      onLogout={handleLogout}
                  />
                  <FlashcardsList
                      filters={filters}
                      setFilters={setFilters}
                      isAuthenticated={isAuthenticated}
                  />
                </>
              }
          />
          <Route
              path="/study-mode"
              element={<StudyMode onBack={handleBackToList} />}
          />
          <Route
              path="/documentation"
              element={
                <Documentation 
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                />
              }
          />
        </Routes>
      </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;