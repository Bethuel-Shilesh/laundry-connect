import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiUsers, FiShoppingBag, FiCheckCircle, FiClock, FiAlertCircle,
  FiTrendingUp, FiList, FiCheck, FiX, FiRefreshCw, FiMail,
  FiMapPin, FiShield,
} from "react-icons/fi";
import { getAdminStats, getPendingShops, approveShop, getAllUsers } from "../services/api";
import Loader from "../components/Loader";

const StatCard = ({ label, value, icon: Icon, color, sub, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
    style={{
      background: "#fff", borderRadius: "16px", padding: "22px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em" }}>
          {label.toUpperCase()}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: "30px", fontWeight: 800, color: "#1A1A2E", lineHeight: 1 }}>
          {value ?? "—"}
        </p>
        {sub && <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{sub}</p>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: "13px",
        background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} color={color} />
      </div>
    </div>
    <div style={{ marginTop: "16px", height: "3px", borderRadius: "4px", background: "#f3f4f6", overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (value / 500) * 100)}%` }} transition={{ duration: 1, delay: index * 0.07 + 0.3 }}
        style={{ height: "100%", borderRadius: "4px", background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
    </div>
  </motion.div>
);

const ROLE_CONFIG = {
  admin:    { label: "Admin",    color: "#ef4444", bg: "#fef2f2" },
  owner:    { label: "Owner",    color: "#FF6B35", bg: "#fff7ed" },
  customer: { label: "Customer", color: "#3b82f6", bg: "#eff6ff" },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pendingShops, setPendingShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingShop, setApprovingShop] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [statsData, pendingData, usersData] = await Promise.allSettled([
        getAdminStats(),
        getPendingShops(),
        getAllUsers(),
      ]);
      if (statsData.status === "fulfilled") setStats(statsData.value);
      if (pendingData.status === "fulfilled") setPendingShops(Array.isArray(pendingData.value) ? pendingData.value : []);
      if (usersData.status === "fulfilled") setUsers(Array.isArray(usersData.value) ? usersData.value : []);
    } catch { toast.error("Failed to load admin data."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleApprove = async (shopId, action) => {
    setApprovingShop(shopId);
    try {
      await approveShop(shopId, action); // action: "approved" | "rejected"
      toast.success(`Shop ${action === "approved" ? "approved" : "rejected"}!`);
      setPendingShops((prev) => prev.filter((s) => s.id !== shopId));
      if (stats) setStats((s) => ({ ...s, pending_shops: (s.pending_shops || 1) - 1 }));
    } catch { toast.error("Failed to update shop status."); }
    finally { setApprovingShop(null); }
  };

  const tabs = [
    { id: "overview",  label: "Overview",       icon: FiTrendingUp },
    { id: "pending",   label: "Pending Shops",   icon: FiClock, badge: pendingShops.length },
    { id: "users",     label: "Users",           icon: FiUsers },
  ];

  const statCards = stats ? [
    { label: "Total Users",    value: stats.total_users,    icon: FiUsers,       color: "#3b82f6", sub: "Registered accounts" },
    { label: "Total Shops",    value: stats.total_shops,    icon: FiShoppingBag, color: "#FF6B35", sub: "All listed shops" },
    { label: "Active Orders",  value: stats.total_orders,   icon: FiList,        color: "#8b5cf6", sub: "All time" },
    { label: "Pending Shops",  value: stats.pending_shops,  icon: FiClock,       color: "#f59e0b", sub: "Awaiting approval" },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 60%, #0f3460 100%)",
        padding: "60px 24px 32px", position: "relative", overflow: "hidden",
      }}>
        {[
          { s: 260, top: "-80px", right: "-80px", op: 0.06 },
          { s: 140, bottom: "-40px", left: "10%", op: 0.04 },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: "#FF6B35", opacity: o.op, top: o.top, right: o.right, bottom: o.bottom, left: o.left }} />
        ))}
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <FiShield size={14} color="#FF6B35" />
                <p style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", margin: 0 }}>
                  ADMIN DASHBOARD
                </p>
              </div>
              <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, margin: "0 0 4px" }}>
                Control Tower
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: 0 }}>
                Manage shops, users, and platform health
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => loadAll(true)}
              disabled={refreshing}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", padding: "10px 18px", borderRadius: "12px",
                cursor: "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif",
              }}
            >
              <motion.span animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}>
                <FiRefreshCw size={14} />
              </motion.span>
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "4px", overflowX: "auto" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "16px 18px", border: "none", background: "none",
                  color: tab === t.id ? "#FF6B35" : "#6b7280",
                  fontWeight: tab === t.id ? 700 : 500, fontSize: "13px",
                  fontFamily: "Poppins, sans-serif", cursor: "pointer",
                  borderBottom: tab === t.id ? "2.5px solid #FF6B35" : "2.5px solid transparent",
                  whiteSpace: "nowrap", position: "relative", transition: "all 0.2s",
                }}
              >
                <Icon size={15} /> {t.label}
                {t.badge > 0 && (
                  <span style={{
                    background: "#ef4444", color: "#fff", fontSize: "10px",
                    fontWeight: 700, padding: "1px 6px", borderRadius: "20px", marginLeft: "2px",
                  }}>{t.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        {loading ? <Loader /> : (
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                  {statCards.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
                </div>

                {/* Alert: pending shops */}
                {pendingShops.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "#fffbeb", borderRadius: "14px", padding: "18px 20px",
                      border: "1.5px solid #fcd34d", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
                    }}
                  >
                    <FiAlertCircle size={20} color="#f59e0b" />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, color: "#92400e", fontSize: "14px" }}>
                        {pendingShops.length} shop{pendingShops.length > 1 ? "s" : ""} awaiting approval
                      </span>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#b45309" }}>
                        Review and approve shops to allow them to appear in listings.
                      </p>
                    </div>
                    <button onClick={() => setTab("pending")}
                      style={{ padding: "8px 16px", borderRadius: "10px", background: "#f59e0b", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "12px", fontFamily: "Poppins, sans-serif" }}>
                      Review
                    </button>
                  </motion.div>
                )}

                {/* Summary table */}
                {stats && (
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
                    <h3 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 700, color: "#1A1A2E" }}>Platform Summary</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {Object.entries(stats).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
                          <span style={{ fontSize: "13px", color: "#6b7280", textTransform: "capitalize" }}>
                            {k.replace(/_/g, " ")}
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A2E" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* PENDING SHOPS */}
            {tab === "pending" && (
              <motion.div key="pending" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>Pending Approvals</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                    {pendingShops.length} shop{pendingShops.length !== 1 ? "s" : ""} waiting for review
                  </p>
                </div>

                {pendingShops.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px", color: "#9ca3af" }}>
                    <FiCheckCircle size={48} color="#22c55e" style={{ marginBottom: "16px" }} />
                    <h3 style={{ color: "#1A1A2E", fontWeight: 700 }}>All caught up!</h3>
                    <p style={{ fontSize: "14px" }}>No shops pending approval.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {pendingShops.map((shop, i) => (
                      <motion.div
                        key={shop.id}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                          background: "#fff", borderRadius: "16px", padding: "20px 24px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6",
                          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                        }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: 52, height: 52, borderRadius: "15px", flexShrink: 0,
                          background: "linear-gradient(135deg, #FF6B3530, #FFB34730)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "18px", fontWeight: 800, color: "#FF6B35",
                          border: "1px solid rgba(255,107,53,0.15)",
                        }}>
                          {shop.name?.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: "160px" }}>
                          <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#1A1A2E" }}>
                            {shop.name}
                          </h4>
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b7280" }}>
                              <FiMapPin size={11} color="#FF6B35" /> {shop.city}
                            </span>
                            {shop.phone && (
                              <span style={{ fontSize: "12px", color: "#6b7280" }}>📞 {shop.phone}</span>
                            )}
                            {shop.owner_email && (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b7280" }}>
                                <FiMail size={11} /> {shop.owner_email}
                              </span>
                            )}
                          </div>
                          {shop.description && (
                            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#9ca3af" }}>
                              {shop.description.slice(0, 80)}{shop.description.length > 80 ? "…" : ""}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(shop.id, "approved")}
                            disabled={approvingShop === shop.id}
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer",
                              background: "linear-gradient(135deg, #22c55e, #16a34a)",
                              color: "#fff", fontWeight: 700, fontSize: "13px",
                              fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                            }}
                          >
                            <FiCheck size={14} /> Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(shop.id, "rejected")}
                            disabled={approvingShop === shop.id}
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              padding: "10px 18px", borderRadius: "10px", cursor: "pointer",
                              background: "#fef2f2", color: "#ef4444",
                              border: "1.5px solid #fca5a5", fontWeight: 700, fontSize: "13px",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            <FiX size={14} /> Reject
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* USERS */}
            {tab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>All Users</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>{users.length} registered users</p>
                </div>

                {users.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                    <FiUsers size={48} color="#e5e7eb" style={{ marginBottom: "12px" }} />
                    <p>No users found.</p>
                  </div>
                ) : (
                  <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
                    {/* Table Header */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                      padding: "12px 20px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6",
                      fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em",
                    }}>
                      <span>NAME</span><span>EMAIL</span><span>ROLE</span><span>CITY</span>
                    </div>

                    {users.map((u, i) => {
                      const role = ROLE_CONFIG[u.role] || ROLE_CONFIG.customer;
                      return (
                        <motion.div key={u.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                          style={{
                            display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                            padding: "14px 20px", borderBottom: i < users.length - 1 ? "1px solid #f9fafb" : "none",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E" }}>
                            {u.full_name || "—"}
                          </span>
                          <span style={{ fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {u.email}
                          </span>
                          <span style={{
                            display: "inline-flex", padding: "3px 10px", borderRadius: "20px", width: "fit-content",
                            fontSize: "11px", fontWeight: 700, color: role.color, background: role.bg,
                          }}>
                            {role.label}
                          </span>
                          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{u.city || "—"}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
