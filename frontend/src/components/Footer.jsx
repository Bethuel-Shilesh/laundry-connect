import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocalLaundryService } from 'react-icons/md';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div style={styles.brand}>
          <div style={styles.logo}>
            <MdLocalLaundryService size={28} color="#FF6B35" />
            <span style={styles.logoText}>Laundry<span style={styles.logoAccent}>Connect</span></span>
          </div>
          <p style={styles.tagline}>Your Laundry, Our Priority</p>
          <p style={styles.description}>
            Connecting customers with the best laundry services in their neighborhood. Fresh clothes, happy life.
          </p>
          <div style={styles.socials}>
            <a href="#" style={styles.socialIcon}><FiInstagram size={18} /></a>
            <a href="#" style={styles.socialIcon}><FiTwitter size={18} /></a>
            <a href="#" style={styles.socialIcon}><FiFacebook size={18} /></a>
          </div>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Quick Links</h4>
          <Link to="/" style={styles.columnLink}>Home</Link>
          <Link to="/shops" style={styles.columnLink}>Find Shops</Link>
          <Link to="/register" style={styles.columnLink}>Join as Owner</Link>
          <Link to="/login" style={styles.columnLink}>Login</Link>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Services</h4>
          <span style={styles.columnLink}>Wash & Fold</span>
          <span style={styles.columnLink}>Dry Cleaning</span>
          <span style={styles.columnLink}>Ironing</span>
          <span style={styles.columnLink}>Express Service</span>
        </div>

        <div style={styles.column}>
          <h4 style={styles.columnTitle}>Contact</h4>
          <span style={styles.contactItem}><FiMail size={14} /> support@laundryconnect.in</span>
          <span style={styles.contactItem}><FiPhone size={14} /> +91 98765 43210</span>
          <span style={styles.contactItem}><FiMapPin size={14} /> Mumbai, India</span>
        </div>

      </div>

      <div style={styles.bottom}>
        <p style={styles.bottomText}>© 2024 LaundryConnect. All rights reserved.</p>
        <p style={styles.bottomText}>Built with ❤️ by Bethuel Shilesh</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#1A1A2E',
    color: '#FFFFFF',
    marginTop: '80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoAccent: {
    color: '#FF6B35',
  },
  tagline: {
    fontSize: '14px',
    color: '#FF6B35',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  description: {
    fontSize: '14px',
    color: '#999999',
    lineHeight: '1.6',
    maxWidth: '280px',
  },
  socials: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  columnTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  columnLink: {
    fontSize: '14px',
    color: '#999999',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#999999',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '20px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: '13px',
    color: '#666666',
  },
};

export default Footer;

