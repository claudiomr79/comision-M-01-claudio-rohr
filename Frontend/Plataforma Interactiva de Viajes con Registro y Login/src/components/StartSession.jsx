import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLoginService } from '../services/authService'; // Renamed service import
import { useAuth } from '../context/AuthContext';

function StartSession() {
  const { authState, login: contextLogin } = useAuth(); // Renamed context login to avoid conflict
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/'); // Redirect if already authenticated
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authLoginService({ email, password });
      contextLogin(data.token, data.user); // Use context login
      // Navigation is now handled by useEffect watching authState.isAuthenticated
      // or can be explicitly done here if preferred: navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      // console.error('Login error:', err); // Already logged by service
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering form if user becomes authenticated during submission/redirect
  if (authState.isAuthenticated && !loading) {
    return null;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default StartSession;
