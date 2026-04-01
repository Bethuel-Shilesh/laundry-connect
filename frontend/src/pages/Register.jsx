import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiUser, FiMail, FiLock, FiPhone, FiMapPin,
  FiEye, FiEyeOff, FiArrowRight, FiLoader,
} from "react-icons/fi";
import { registerUser } from "../services/api";

const ROLES = [
  {
    id: "customer",
    label: "Customer",
    desc: "Find & book laundry services",
    icon: "🧺",
  },
  {
    id: "owner",
    label: "Shop Owner",
    desc: "List & manage your laundry shop",
    icon: "🏪",
  },
];

const InputField = ({ icon, label, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em" }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 16px", borderRadius: "12px",
        border: `1.5px solid ${error ? "#ef4444" : focused ? "#FF6B35" : "#e5e7eb"}`,
        background: focused ? "#fff7f5" : "#fafafa",
        transition: "all 0.2s",
      }}>
        <span style={{ color: focused ? "#FF6B35" : "#9ca3af", flexShrink: 0 }}>{icon}</span>
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "#1A1A2E",
          }}
        />
      </div>
      {error && <span style={{ fontSize: "11px", color: "#ef4444" }}>{error}</span>}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", phone: "", city: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ ...form, role });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "Poppins, sans-serif", background: "#f9fafb",
    }}>
      {/* LEFT PANEL */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "42%", minHeight: "100vh",
          background: "linear-gradient(160deg, #1A1A2E 0%, #16213e 50%, #0f3460 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 48px", position: "relative", overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        {[
          { w: 220, h: 220, top: "-60px", left: "-60px", opacity: 0.07 },
          { w: 160, h: 160, bottom: "60px", right: "-40px", opacity: 0.06 },
          { w: 100, h: 100, top: "50%", left: "60%", opacity: 0.05 },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s.w, height: s.h, borderRadius: "50%",
            background: "#FF6B35", opacity: s.opacity,
            top: s.top, left: s.left, bottom: s.bottom, right: s.right,
          }} />
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: "48px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "12px",
              background: "linear-gradient(135deg, #FF6B35, #FFB347)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
            }}>🧺</div>
            <span style={{ color: "#fff", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Laundry Connect
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            Your Laundry, Our Priority
          </p>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 style={{
            color: "#fff", fontSize: "36px", fontWeight: 800, margin: "0 0 16px",
            lineHeight: 1.2, letterSpacing: "-1px",
          }}>
            Join Our<br />
            <span style={{ color: "#FF6B35" }}>Community</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
            Thousands of customers trust Laundry Connect for clean, fresh clothes delivered right to their door.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: "flex", gap: "32px", marginTop: "48px" }}
        >
          {[["500+", "Shops"], ["10K+", "Orders"], ["4.8★", "Rating"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ color: "#FF6B35", fontSize: "22px", fontWeight: 800 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{lbl}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 24px", overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1A1A2E", margin: "0 0 6px" }}>
              Create Account
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            {ROLES.map((r) => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRole(r.id)}
                style={{
                    padding: "16px 14px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    background: role === r.id
                        ? "linear-gradient(135deg, #FF6B35, #FFB347)"
                        : "#f9fafb",
                    boxShadow: role === r.id ? "0 8px 24px rgba(255,107,53,0.3)" : "none",
                    border: role === r.id ? "none" : "1.5px solid #e5e7eb",
                    transition: "all 0.25s",
                    textAlign: "left",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{r.icon}</div>
                <div style={{
                  fontWeight: 700, fontSize: "13px",
                  color: role === r.id ? "#fff" : "#1A1A2E", fontFamily: "Poppins, sans-serif",
                }}>{r.label}</div>
                <div style={{
                  fontSize: "11px", marginTop: "2px",
                  color: role === r.id ? "rgba(255,255,255,0.75)" : "#9ca3af",
                  fontFamily: "Poppins, sans-serif",
                }}>{r.desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputField
              icon={<FiUser size={16} />} label="FULL NAME"
              type="text" name="full_name" placeholder="John Doe"
              value={form.full_name} onChange={handleChange}
              error={errors.full_name}
            />
            <InputField
              icon={<FiMail size={16} />} label="EMAIL ADDRESS"
              type="email" name="email" placeholder="john@example.com"
              value={form.email} onChange={handleChange}
              error={errors.email}
            />
            <div style={{ position: "relative" }}>
              <InputField
                icon={<FiLock size={16} />} label="PASSWORD"
                type={showPass ? "text" : "password"} name="password"
                placeholder="Min 6 characters"
                value={form.password} onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "14px", top: "34px",
                  background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                  padding: 0,
                }}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <InputField
                icon={<FiPhone size={16} />} label="PHONE (OPTIONAL)"
                type="tel" name="phone" placeholder="+91 9876543210"
                value={form.phone} onChange={handleChange}
              />
              <InputField
                icon={<FiMapPin size={16} />} label="CITY (OPTIONAL)"
                type="text" name="city" placeholder="Mumbai"
                value={form.city} onChange={handleChange}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                marginTop: "8px",
                padding: "15px", borderRadius: "12px",
                background: loading ? "#e5e7eb" : "linear-gradient(135deg, #FF6B35, #FFB347)",
                color: loading ? "#9ca3af" : "#fff",
                fontWeight: 700, fontSize: "15px", fontFamily: "Poppins, sans-serif",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: loading ? "none" : "0 8px 24px rgba(255,107,53,0.35)",
                transition: "all 0.25s",
              }}
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                    <FiLoader size={18} />
                  </motion.span>
                  Creating account...
                </>
              ) : (
                <>Create Account <FiArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "20px" }}>
            By signing up you agree to our{" "}
            <span style={{ color: "#FF6B35", cursor: "pointer" }}>Terms of Service</span>{" "}
            and{" "}
            <span style={{ color: "#FF6B35", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
