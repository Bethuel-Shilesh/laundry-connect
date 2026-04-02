import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiPlus, FiEdit2, FiPackage, FiDollarSign, FiStar,
  FiCheck, FiX, FiRefreshCw, FiShoppingBag, FiAlertCircle,
  FiTrendingUp, FiList, FiSettings,
} from "react-icons/fi";
import {
  getMyShop, updateOrderStatus, createService, getServicesByShop,
  createShop, updateShop,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// Safely import what's available — adapt based on your api.js exports
// We'll use fallbacks gracefully

const STAT_CARDS = (shop, orders, services) => [
  { label: "Total Orders",   value: orders.length,           icon: FiPackage,      color: "#FF6B35" },
  { label: "Services",       value: services.length,         icon: FiList,         color: "#8b5cf6" },
  { label: "Rating",         value: shop?.average_rating ? parseFloat(shop.average_rating).toFixed(1) + "★" : "—",
                                                             icon: FiStar,         color: "#f59e0b" },
  { label: "Revenue",
    value: "₹" + orders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0).toFixed(0),
    icon: FiDollarSign, color: "#22c55e" },
];

const STATUS_NEXT = {
  pending: "confirmed", confirmed: "picked_up", picked_up: "processing",
  processing: "ready", ready: "delivered",
};
const STATUS_LABELS = {
  pending: "Pending", confirmed: "Confirmed", picked_up: "Picked Up",
  processing: "Processing", ready: "Ready", delivered: "Delivered", cancelled: "Cancelled",
};
const STATUS_COLORS = {
  pending:"#f59e0b", confirmed:"#3b82f6", picked_up:"#8b5cf6",
  processing:"#FF6B35", ready:"#0ea5e9", delivered:"#22c55e", cancelled:"#ef4444",
};

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Shop form
  const [shopForm, setShopForm] = useState({ name: "", city: "", address: "", phone: "", description: "" });
  const [shopSaving, setShopSaving] = useState(false);
  const [shopMode, setShopMode] = useState("view"); // view | edit | create

  // Service form
  const [svcForm, setSvcForm] = useState({ name: "", price: "", unit: "", description: "" });
  const [svcSaving, setSvcSaving] = useState(false);
  const [showSvcForm, setShowSvcForm] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get owner's shop — api may vary; gracefully handle
      let shopData = null, ordersData = [], servicesData = [];
      try {
        // Use getAllShops filtered by owner or getMyShop if available
        const { getAllShops, getMyOrders } = await import("../services/api");
        const allShops = await getAllShops();
        // Find shops belonging to this owner
        shopData = Array.isArray(allShops)
          ? allShops.find((s) => s.owner_id === user?.id) || allShops[0]
          : null;
        if (shopData) {
          const { getServicesByShop } = await import("../services/api");
          servicesData = await getServicesByShop(shopData.id);
        }
        ordersData = await getMyOrders();
      } catch (e) {
        console.warn("API load error:", e);
      }
      setShop(shopData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      if (shopData) setShopForm({
        name: shopData.name || "", city: shopData.city || "",
        address: shopData.address || "", phone: shopData.phone || "", description: shopData.description || "",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleAdvanceOrder = async (orderId, currentStatus) => {
    const next = STATUS_NEXT[currentStatus];
    if (!next) return;
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, next);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: next } : o));
      toast.success(`Order moved to ${STATUS_LABELS[next]}!`);
    } catch { toast.error("Failed to update order."); }
    finally { setUpdatingOrder(null); }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, "cancelled");
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
      toast.success("Order cancelled.");
    } catch { toast.error("Failed to cancel."); }
    finally { setUpdatingOrder(null); }
  };

  const handleSaveShop = async () => {
    if (!shopForm.name.trim() || !shopForm.city.trim()) { toast.warning("Name and city are required."); return; }
    setShopSaving(true);
    try {
      if (shop) { await updateShop(shop.id, shopForm); toast.success("Shop updated!"); }
      else { await createShop(shopForm); toast.success("Shop created! Awaiting approval."); }
      await loadAll();
      setShopMode("view");
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to save shop."); }
    finally { setShopSaving(false); }
  };

  const handleAddService = async () => {
    if (!svcForm.name.trim() || !svcForm.price) { toast.warning("Name and price are required."); return; }
    if (!shop) { toast.error("Create a shop first."); return; }
    setSvcSaving(true);
    try {
      await createService({ ...svcForm, price: parseFloat(svcForm.price), shop_id: shop.id });
      toast.success("Service added!");
      setSvcForm({ name: "", price: "", unit: "", description: "" });
      setShowSvcForm(false);
      const fresh = await getServicesByShop(shop.id);
      setServices(Array.isArray(fresh) ? fresh : []);
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add service."); }
    finally { setSvcSaving(false); }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiTrendingUp },
    { id: "orders", label: "Orders", icon: FiPackage },
    { id: "services", label: "Services", icon: FiList },
    { id: "shop", label: "Shop Settings", icon: FiSettings },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 60%, #0f3460 100%)",
        padding: "60px 24px 32px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "#FF6B35", opacity: 0.06 }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ color: "#FF6B35", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", margin: "0 0 6px" }}>
            🏪 OWNER DASHBOARD
          </p>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, margin: "0 0 4px" }}>
            Welcome back, {user?.full_name?.split(" ")[0] || "Owner"}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: 0 }}>
            {shop ? shop.name : "Set up your shop to get started"}
          </p>
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
                  whiteSpace: "nowrap", transition: "all 0.2s",
                }}
              >
                <Icon size={15} /> {t.label}
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
                {/* Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                  {STAT_CARDS(shop, orders, services).map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div key={stat.label}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        style={{
                          background: "#fff", borderRadius: "16px", padding: "20px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.04em" }}>
                              {stat.label.toUpperCase()}
                            </p>
                            <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#1A1A2E" }}>
                              {stat.value}
                            </p>
                          </div>
                          <div style={{ width: 40, height: 40, borderRadius: "12px", background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={18} color={stat.color} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Orders Preview */}
                <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1A1A2E" }}>Recent Orders</h3>
                    <button onClick={() => setTab("orders")} style={{ color: "#FF6B35", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                      View all →
                    </button>
                  </div>
                  {orders.slice(0, 4).map((order, i) => (
                    <div key={order.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 0", borderBottom: i < 3 ? "1px solid #f9fafb" : "none",
                    }}>
                      <span style={{ fontSize: "13px", color: "#1A1A2E", fontWeight: 600 }}>Order #{order.id?.toString().padStart(4, "0")}</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                        color: STATUS_COLORS[order.status] || "#9ca3af",
                        background: `${STATUS_COLORS[order.status]}18`,
                      }}>{STATUS_LABELS[order.status] || order.status}</span>
                    </div>
                  ))}
                  {orders.length === 0 && <p style={{ color: "#9ca3af", fontSize: "13px", textAlign: "center", padding: "20px" }}>No orders yet.</p>}
                </div>
              </motion.div>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
                      <p>No orders yet.</p>
                    </div>
                  ) : orders.map((order, i) => (
                    <motion.div key={order.id}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      style={{
                        background: "#fff", borderRadius: "14px", padding: "18px 20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6",
                        display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <span style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A2E" }}>
                          Order #{order.id?.toString().padStart(4, "0")}
                        </span>
                        <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                        color: STATUS_COLORS[order.status] || "#9ca3af",
                        background: `${STATUS_COLORS[order.status]}18`,
                        whiteSpace: "nowrap",
                      }}>{STATUS_LABELS[order.status] || order.status}</span>
                      {order.total_price && (
                        <span style={{ fontWeight: 700, color: "#22c55e", fontSize: "14px" }}>
                          ₹{parseFloat(order.total_price).toFixed(2)}
                        </span>
                      )}
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAdvanceOrder(order.id, order.status)}
                            disabled={updatingOrder === order.id}
                            style={{
                              display: "flex", alignItems: "center", gap: "5px",
                              padding: "7px 14px", borderRadius: "10px", border: "none", cursor: "pointer",
                              background: "linear-gradient(135deg, #FF6B35, #FFB347)",
                              color: "#fff", fontSize: "12px", fontWeight: 600, fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            <FiCheck size={13} /> {STATUS_LABELS[STATUS_NEXT[order.status]] || "Advance"}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={updatingOrder === order.id}
                            style={{
                              padding: "7px 12px", borderRadius: "10px", border: "1px solid #fca5a5",
                              background: "#fef2f2", color: "#ef4444", cursor: "pointer",
                              fontSize: "12px", fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            <FiX size={14} />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SERVICES */}
            {tab === "services" && (
              <motion.div key="services" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>Services</h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSvcForm(!showSvcForm)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "10px 18px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, #FF6B35, #FFB347)",
                      color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "Poppins, sans-serif",
                      boxShadow: "0 6px 18px rgba(255,107,53,0.3)",
                    }}
                  >
                    <FiPlus size={15} /> Add Service
                  </motion.button>
                </div>

                {/* Add Service Form */}
                <AnimatePresence>
                  {showSvcForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: "20px", overflow: "hidden" }}
                    >
                      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1.5px solid rgba(255,107,53,0.2)", boxShadow: "0 4px 20px rgba(255,107,53,0.08)" }}>
                        <h4 style={{ margin: "0 0 20px", color: "#1A1A2E", fontWeight: 700 }}>New Service</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          {[
                            { key: "name", label: "Service Name *", placeholder: "e.g. Wash & Fold" },
                            { key: "price", label: "Price (₹) *", placeholder: "e.g. 50", type: "number" },
                            { key: "unit", label: "Unit", placeholder: "e.g. per kg" },
                            { key: "description", label: "Description", placeholder: "Brief description" },
                          ].map((f) => (
                            <div key={f.key} style={f.key === "description" ? { gridColumn: "1 / -1" } : {}}>
                              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>{f.label}</label>
                              <input
                                type={f.type || "text"}
                                placeholder={f.placeholder}
                                value={svcForm[f.key]}
                                onChange={(e) => setSvcForm((p) => ({ ...p, [f.key]: e.target.value }))}
                                style={{
                                  width: "100%", padding: "11px 14px", borderRadius: "10px",
                                  border: "1.5px solid #e5e7eb", outline: "none", fontSize: "13px",
                                  fontFamily: "Poppins, sans-serif", color: "#1A1A2E", boxSizing: "border-box",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddService} disabled={svcSaving}
                            style={{ padding: "11px 24px", borderRadius: "10px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #FF6B35, #FFB347)", color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>
                            {svcSaving ? "Saving…" : "Add Service"}
                          </motion.button>
                          <button onClick={() => setShowSvcForm(false)} style={{ padding: "11px 20px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "none", cursor: "pointer", color: "#6b7280", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Services List */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
                  {services.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px", color: "#9ca3af" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧺</div>
                      <p>No services yet. Add your first!</p>
                    </div>
                  ) : services.map((svc, i) => (
                    <motion.div key={svc.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      style={{
                        background: "#fff", borderRadius: "14px", padding: "18px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A2E", marginBottom: "4px" }}>{svc.name}</div>
                      {svc.description && <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>{svc.description}</div>}
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "#FF6B35" }}>
                        ₹{parseFloat(svc.price).toFixed(2)}
                        <span style={{ fontSize: "12px", fontWeight: 400, color: "#9ca3af" }}>{svc.unit ? ` / ${svc.unit}` : ""}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SHOP SETTINGS */}
            {tab === "shop" && (
              <motion.div key="shop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ background: "#fff", borderRadius: "18px", padding: "28px", maxWidth: "580px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>
                      {shop ? "Shop Details" : "Register Your Shop"}
                    </h3>
                    {shop && shopMode === "view" && (
                      <button onClick={() => setShopMode("edit")}
                        style={{ display: "flex", alignItems: "center", gap: "5px", color: "#FF6B35", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  {shop && shopMode === "view" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {[["Shop Name", shop.name], ["City", shop.city], ["Address", shop.address], ["Phone", shop.phone], ["Description", shop.description], ["Status", shop.approval_status?.toUpperCase()]].map(([k, v]) => (
                        v ? (
                          <div key={k} style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                            <span style={{ color: "#9ca3af", minWidth: "100px" }}>{k}</span>
                            <span style={{ color: "#1A1A2E", fontWeight: 500 }}>{v}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {[
                        { key: "name", label: "Shop Name *", placeholder: "My Laundry Shop" },
                        { key: "city", label: "City *", placeholder: "Mumbai" },
                        { key: "address", label: "Address", placeholder: "Street, Area, Pincode" },
                        { key: "phone", label: "Phone", placeholder: "+91 9876543210" },
                        { key: "description", label: "Description", placeholder: "About your shop…", multiline: true },
                      ].map((f) => (
                        <div key={f.key}>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>{f.label}</label>
                          {f.multiline ? (
                            <textarea rows={3}
                              value={shopForm[f.key]} placeholder={f.placeholder}
                              onChange={(e) => setShopForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "13px", fontFamily: "Poppins, sans-serif", resize: "none", boxSizing: "border-box" }}
                            />
                          ) : (
                            <input type="text" value={shopForm[f.key]} placeholder={f.placeholder}
                              onChange={(e) => setShopForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", outline: "none", fontSize: "13px", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" }}
                            />
                          )}
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSaveShop} disabled={shopSaving}
                          style={{ padding: "12px 28px", borderRadius: "12px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #FF6B35, #FFB347)", color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "Poppins, sans-serif", boxShadow: "0 6px 18px rgba(255,107,53,0.3)" }}>
                          {shopSaving ? "Saving…" : shop ? "Update Shop" : "Create Shop"}
                        </motion.button>
                        {shop && (
                          <button onClick={() => setShopMode("view")} style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid #e5e7eb", background: "none", cursor: "pointer", color: "#6b7280", fontSize: "14px", fontFamily: "Poppins, sans-serif" }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;