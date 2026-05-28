import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Debate from './pages/Debate';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import Topics from './pages/Topics';
import Communities from './pages/Communities';

// Layout
import Layout from './components/Layout';
import Loader from './components/Loader';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/arena" element={
            <ProtectedRoute><Arena /></ProtectedRoute>
          } />
          <Route path="/debate/:id" element={<Debate />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/marketplace" element={
            <ProtectedRoute><Marketplace /></ProtectedRoute>
          } />
          <Route path="/topics" element={
            <ProtectedRoute><Topics /></ProtectedRoute>
          } />
          <Route path="/communities" element={
            <ProtectedRoute><Communities /></ProtectedRoute>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
