import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn } from '../components/UI';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'student', roomNumber: '', contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.role === 'student' && !form.roomNumber) {
      setError('Room number is required for students.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const labelStyle = {
    fontSize: 13,
    color: '#475569',
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
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
        maxWidth: 440,
        animation: 'fadeIn 0.4s ease',
      }}>

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
          }}>
            Create your account
          </p>
        </div>

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
          }}>Register</h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name</label>
              <input value={form.name} onChange={set('name')} required placeholder="Your full name" style={{ width: '100%' }} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" style={{ width: '100%' }} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Min. 6 characters" style={{ width: '100%' }} />
            </div>

            {/* Role */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Role</label>
              <select value={form.role} onChange={set('role')} style={{ width: '100%' }}>
                <option value="student">Student</option>
                <option value="warden">Warden</option>
                <option value="maintenance_staff">Maintenance Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Student-only fields */}
            {form.role === 'student' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Room Number</label>
                  <input value={form.roomNumber} onChange={set('roomNumber')} placeholder="e.g. 101" style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Contact Number</label>
                  <input value={form.contact} onChange={set('contact')} placeholder="Mobile number" style={{ width: '100%' }} />
                </div>
              </>
            )}

            {error && <p className="error" style={{ marginBottom: 14 }}>{error}</p>}

            <Btn type="submit" disabled={loading} style={{ width: '100%', padding: '12px 22px', fontSize: 15 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Btn>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13,
            color: '#64748b',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1B4F72', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
