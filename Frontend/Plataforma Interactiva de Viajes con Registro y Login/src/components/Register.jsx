import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { authState, login: contextLogin } = useAuth(); // Renamed to avoid conflict
  const [username, setUsername] = useState('');
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
      const data = await signup({ username, email, password });
      contextLogin(data.token, data.user); // Use context login
      // Navigation is now handled by useEffect watching authState.isAuthenticated
      // or can be explicitly done here if preferred: navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      // console.error('Signup error:', err); // Already logged by service
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
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
            minLength="6"
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
