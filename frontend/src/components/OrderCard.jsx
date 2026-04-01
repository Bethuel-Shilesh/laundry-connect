import { motion } from "framer-motion";
import { FiPackage, FiMapPin, FiCalendar, FiChevronRight, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  pending:    { label: "Pending",     color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
  confirmed:  { label: "Confirmed",   color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd" },
  picked_up:  { label: "Picked Up",   color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd" },
  processing: { label: "Processing",  color: "#FF6B35", bg: "#fff7ed", border: "#FFB347" },
  ready:      { label: "Ready",       color: "#0ea5e9", bg: "#f0f9ff", border: "#7dd3fc" },
  delivered:  { label: "Delivered",   color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
  cancelled:  { label: "Cancelled",   color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
};

const OrderCard = ({ order, index = 0 }) => {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ x: 4, boxShadow: "0 8px 30px rgba(255,107,53,0.12)" }}
      onClick={() => navigate(`/orders`)}
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px 24px",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: "14px", flexShrink: 0,
        background: "linear-gradient(135deg, #FF6B3520, #FFB34720)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,107,53,0.15)",
      }}>
        <FiPackage size={22} color="#FF6B35" />
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A2E" }}>
            Order #{order.id?.toString().padStart(4, "0") || "0000"}
          </span>
          {/* Status Badge */}
          <span style={{
            padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
            color: status.color, background: status.bg, border: `1px solid ${status.border}`,
            whiteSpace: "nowrap",
          }}>
            {status.label}
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          {order.shop_name && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", fontSize: "12px" }}>
              <FiMapPin size={11} color="#FF6B35" />
              <span>{order.shop_name}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", fontSize: "12px" }}>
            <FiCalendar size={11} color="#FF6B35" />
            <span>{formatDate(order.created_at)}</span>
          </div>
          {order.total_price && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", fontSize: "12px" }}>
              <FiDollarSign size={11} color="#22c55e" />
              <span style={{ color: "#22c55e", fontWeight: 600 }}>₹{parseFloat(order.total_price).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {(() => {
          const steps = ["pending","confirmed","picked_up","processing","ready","delivered"];
          const stepIdx = steps.indexOf(order.status);
          const pct = order.status === "cancelled" ? 0 : stepIdx >= 0 ? ((stepIdx + 1) / steps.length) * 100 : 0;
          return (
            <div style={{ marginTop: "10px", height: "3px", borderRadius: "4px", background: "#f3f4f6", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: index * 0.06 + 0.2 }}
                style={{
                  height: "100%", borderRadius: "4px",
                  background: order.status === "delivered"
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : "linear-gradient(90deg, #FF6B35, #FFB347)",
                }}
              />
            </div>
          );
        })()}
      </div>

      <FiChevronRight size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
    </motion.div>
  );
};

export default OrderCard;