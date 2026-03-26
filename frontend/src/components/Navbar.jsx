import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { MdLocalLaundryService } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <MdLocalLaundryService size={28} color="#FF6B35" />
          <span style={styles.logoText}>Laundry<span style={styles.logoAccent}>Connect</span></span>
        </Link>

        <div style={styles.links}>
          <Link to="/shops" style={styles.link}>Find Shops</Link>
          {user && <Link to="/orders" style={styles.link}>My Orders</Link>}
          {user?.role === 'owner' && <Link to="/owner/dashboard" style={styles.link}>Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin/dashboard" style={styles.link}>Admin</Link>}
        </div>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userSection}>
              <span style={styles.userName}>
                <FiUser size={16} /> {user.full_name}
              </span>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Get Started</Link>
            </div>
          )}
        </div>

        <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/shops" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Find Shops</Link>
          {user && <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user?.role === 'owner' && <Link to="/owner/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <button style={styles.mobileLogout} onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1A1A2E',
  },
  logoAccent: {
    color: '#FF6B35',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    border: '1.5px solid #FF6B35',
    borderRadius: '8px',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loginBtn: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    textDecoration: 'none',
  },
  registerBtn: {
    padding: '10px 24px',
    background: '#FF6B35',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  menuBtn: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#2D2D2D',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 24px',
    gap: '16px',
    background: '#FFFFFF',
    borderTop: '1px solid #f0f0f0',
  },
  mobileLink: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    textDecoration: 'none',
  },
  mobileLogout: {
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#FF6B35',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
  },
};

export default Navbar;
