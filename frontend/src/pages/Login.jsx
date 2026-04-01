import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdLocalLaundryService } from 'react-icons/md';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      login({ email: payload.sub, role: payload.role, full_name: payload.sub.split('@')[0] }, token);
      toast.success('Welcome back!');
      if (payload.role === 'admin') navigate('/admin/dashboard');
      else if (payload.role === 'owner') navigate('/owner/dashboard');
      else navigate('/shops');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftOverlay} />
        <div style={styles.leftContent}>
          <MdLocalLaundryService size={48} color="#FF6B35" />
          <h1 style={styles.leftTitle}>LaundryConnect</h1>
          <p style={styles.leftTagline}>Your Laundry, Our Priority</p>
          <div style={styles.leftFeatures}>
            {['500+ Verified Shops', 'Real-time Order Tracking', 'Doorstep Pickup & Delivery', 'Secure Payments'].map((f, i) => (
              <div key={i} style={styles.leftFeatureItem}>✓ {f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.formBox}
        >
          <h2 style={styles.formTitle}>Welcome Back 👋</h2>
          <p style={styles.formSubtitle}>Login to your LaundryConnect account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FiMail size={18} color="#999" style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FiLock size={18} color="#999" style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <FiEyeOff size={18} color="#999" /> : <FiEye size={18} color="#999" />}
                </button>
              </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account? <Link to="/register" style={styles.switchLink}>Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', paddingTop: '70px' },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80) center/cover',
    opacity: 0.1,
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    color: '#FFFFFF',
  },
  leftTitle: { fontSize: '36px', fontWeight: '800', marginTop: '16px', marginBottom: '8px' },
  leftTagline: { fontSize: '16px', color: '#FF6B35', fontStyle: 'italic', marginBottom: '40px' },
  leftFeatures: { display: 'flex', flexDirection: 'column', gap: '16px' },
  leftFeatureItem: { fontSize: '16px', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '8px' },
  rightPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#FAFAFA' },
  formBox: { width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 8px 48px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: '28px', fontWeight: '700', color: '#1A1A2E', marginBottom: '8px' },
  formSubtitle: { fontSize: '15px', color: '#777777', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#2D2D2D' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px' },
  input: { width: '100%', padding: '14px 14px 14px 42px', border: '1.5px solid #E8E8E8', borderRadius: '12px', fontSize: '15px', color: '#2D2D2D', background: '#FAFAFA', fontFamily: 'Poppins' },
  eyeBtn: { position: 'absolute', right: '14px', background: 'transparent', border: 'none', cursor: 'pointer' },
  submitBtn: { padding: '16px', background: '#FF6B35', color: '#FFFFFF', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '8px' },
  switchText: { textAlign: 'center', fontSize: '14px', color: '#777777', marginTop: '24px' },
  switchLink: { color: '#FF6B35', fontWeight: '600', textDecoration: 'none' },
};

export default Login; 
