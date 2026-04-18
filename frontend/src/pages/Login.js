import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn } from '../components/UI';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Route to role-based dashboard
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f8fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        animation: 'fadeIn 0.4s ease',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #1B4F72, #2471a3)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 26,
            boxShadow: '0 4px 12px rgba(27, 79, 114, 0.25)',
          }}>🏠</div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            margin: '0 0 6px',
            color: '#1e293b',
            letterSpacing: '-0.02em',
          }}>
            Smart Hostel Management
          </h1>
          <p style={{
            fontSize: 14,
            color: '#64748b',
            margin: 0,
            fontWeight: 400,
          }}>
            Complaint Automation System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9',
        }}>
          <h2 style={{
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 24,
            color: '#1e293b',
          }}>Welcome back</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{
                fontSize: 13,
                color: '#475569',
                display: 'block',
                marginBottom: 6,
                fontWeight: 500,
              }}>
                Email Address
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize: 13,
                color: '#475569',
                display: 'block',
                marginBottom: 6,
                fontWeight: 500,
              }}>
                Password
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                style={{ width: '100%' }}
              />
            </div>

            {error && <p className="error" style={{ marginBottom: 14 }}>{error}</p>}

            <Btn type="submit" disabled={loading} style={{ width: '100%', padding: '12px 22px', fontSize: 15 }}>
              {loading ? 'Logging in...' : 'Login'}
            </Btn>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13,
            color: '#64748b',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1B4F72', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
