import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiTruck, FiStar, FiCheckCircle } from 'react-icons/fi';
import { MdLocalLaundryService } from 'react-icons/md';

const Landing = () => {
  return (
    <div style={styles.page}>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={styles.heroBadge}>🧺 #1 Laundry Platform in India</span>
            <h1 style={styles.heroTitle}>
              Your Laundry,<br />
              <span style={styles.heroAccent}>Our Priority</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Discover trusted laundry services near you. Book in minutes, track in real-time, and get fresh clothes delivered to your door.
            </p>
            <div style={styles.heroButtons}>
              <Link to="/shops" style={styles.primaryBtn}>
                Find Laundry Shops
              </Link>
              <Link to="/register" style={styles.secondaryBtn}>
                Register Your Shop
              </Link>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>500+</span>
                <span style={styles.statLabel}>Shops</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>10K+</span>
                <span style={styles.statLabel}>Orders</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>4.8★</span>
                <span style={styles.statLabel}>Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sectionHeader}
          >
            <span style={styles.sectionBadge}>Simple Process</span>
            <h2 style={styles.sectionTitle}>How Laundry Connect Works</h2>
            <p style={styles.sectionSubtitle}>Get your laundry done in 3 easy steps</p>
          </motion.div>

          <div style={styles.stepsGrid}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={styles.stepCard}
              >
                <div style={styles.stepNumber}>{step.number}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ ...styles.section, background: '#FFF5F0' }}>
        <div style={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sectionHeader}
          >
            <span style={styles.sectionBadge}>What We Offer</span>
            <h2 style={styles.sectionTitle}>Our Laundry Services</h2>
            <p style={styles.sectionSubtitle}>Professional care for every fabric</p>
          </motion.div>

          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(255,107,53,0.15)' }}
                style={styles.serviceCard}
              >
                <div style={{ ...styles.serviceIconBox, background: service.color }}>
                  {service.icon}
                </div>
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceDesc}>{service.desc}</p>
                <span style={styles.servicePrice}>Starting from {service.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.sectionHeader}
          >
            <span style={styles.sectionBadge}>Why Us</span>
            <h2 style={styles.sectionTitle}>Why Choose Laundry Connect?</h2>
          </motion.div>

          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={styles.featureItem}
              >
                <FiCheckCircle size={20} color="#FF6B35" />
                <div>
                  <h4 style={styles.featureTitle}>{feature.title}</h4>
                  <p style={styles.featureDesc}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaOverlay} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.ctaContent}
        >
          <h2 style={styles.ctaTitle}>Ready for Fresh, Clean Clothes?</h2>
          <p style={styles.ctaSubtitle}>Join thousands of happy customers today</p>
          <div style={styles.ctaButtons}>
            <Link to="/shops" style={styles.ctaPrimaryBtn}>Find Shops Near You</Link>
            <Link to="/register" style={styles.ctaSecondaryBtn}>List Your Laundry</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

const steps = [
  { number: '01', icon: <FiSearch size={28} color="#FF6B35" />, title: 'Find a Shop', desc: 'Search and browse verified laundry shops near your location' },
  { number: '02', icon: <FiShoppingBag size={28} color="#FF6B35" />, title: 'Book a Service', desc: 'Choose your service, schedule pickup and delivery at your convenience' },
  { number: '03', icon: <FiTruck size={28} color="#FF6B35" />, title: 'Get it Delivered', desc: 'Track your order in real-time and receive fresh clothes at your door' },
];

const services = [
  { icon: <MdLocalLaundryService size={32} color="#FFFFFF" />, title: 'Wash & Fold', desc: 'Complete washing and folding service for everyday clothes', price: '₹49/kg', color: '#FF6B35' },
  { icon: <FiStar size={32} color="#FFFFFF" />, title: 'Dry Cleaning', desc: 'Professional dry cleaning for delicate and premium garments', price: '₹99/item', color: '#1A1A2E' },
  { icon: <FiCheckCircle size={32} color="#FFFFFF" />, title: 'Ironing', desc: 'Crisp and wrinkle-free ironing for all types of clothing', price: '₹15/item', color: '#FFB347' },
  { icon: <FiTruck size={32} color="#FFFFFF" />, title: 'Express Service', desc: 'Same day delivery for urgent laundry needs', price: '₹149/kg', color: '#FF6B35' },
];

const features = [
  { title: 'Verified Shops Only', desc: 'Every shop is reviewed and approved by our admin team' },
  { title: 'Real-time Tracking', desc: 'Track your order from pickup to delivery at every step' },
  { title: 'Secure Payments', desc: 'Multiple payment options with complete transaction security' },
  { title: 'Ratings & Reviews', desc: 'Make informed decisions with genuine customer reviews' },
  { title: 'Doorstep Pickup', desc: 'Schedule pickup from the comfort of your home' },
  { title: '24/7 Support', desc: 'Our support team is always available to help you' },
];

const styles = {
  page: { paddingTop: '70px' },
  hero: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1400&q=80) center/cover',
    opacity: 0.15,
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 24px',
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(255,107,53,0.2)',
    border: '1px solid rgba(255,107,53,0.4)',
    borderRadius: '50px',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '72px',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: '1.1',
    marginBottom: '24px',
  },
  heroAccent: { color: '#FF6B35' },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '520px',
    lineHeight: '1.7',
    marginBottom: '40px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '60px',
  },
  primaryBtn: {
    padding: '16px 32px',
    background: '#FF6B35',
    color: '#FFFFFF',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
  },
  secondaryBtn: {
    padding: '16px 32px',
    background: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1.5px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)',
  },
  section: {
    padding: '80px 0',
    background: '#FAFAFA',
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '56px',
  },
  sectionBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(255,107,53,0.1)',
    borderRadius: '50px',
    color: '#FF6B35',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#777777',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  stepCard: {
    padding: '40px 32px',
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  stepNumber: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'rgba(255,107,53,0.1)',
    marginBottom: '16px',
  },
  stepIcon: {
    marginBottom: '16px',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '15px',
    color: '#777777',
    lineHeight: '1.6',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  serviceCard: {
    padding: '32px 24px',
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  serviceIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: '8px',
  },
  serviceDesc: {
    fontSize: '14px',
    color: '#777777',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  servicePrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#FF6B35',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#777777',
    lineHeight: '1.6',
  },
  ctaSection: {
    minHeight: '400px',
    background: 'linear-gradient(135deg, #FF6B35, #E85520)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'url(https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=1400&q=80) center/cover',
    opacity: 0.1,
  },
  ctaContent: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    padding: '0 24px',
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '40px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    padding: '16px 32px',
    background: '#FFFFFF',
    color: '#FF6B35',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    textDecoration: 'none',
  },
  ctaSecondaryBtn: {
    padding: '16px 32px',
    background: 'transparent',
    color: '#FFFFFF',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '2px solid rgba(255,255,255,0.6)',
  },
};

export default Landing;