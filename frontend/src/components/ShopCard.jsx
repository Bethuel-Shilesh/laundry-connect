import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiCheckCircle, FiClock, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ShopCard = ({ shop, index = 0 }) => {
  const navigate = useNavigate();

  const statusConfig = {
    approved: { label: "Verified", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: <FiCheckCircle size={12} /> },
    pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <FiClock size={12} /> },
    rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: null },
  };

  const status = statusConfig[shop.approval_status] || statusConfig.pending;
  const rating = shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : null;

  const avatarColors = ["#FF6B35", "#FFB347", "#1A1A2E", "#e11d48", "#7c3aed"];
  const avatarBg = avatarColors[index % avatarColors.length];
  const initials = shop.name ? shop.name.slice(0, 2).toUpperCase() : "LC";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(255,107,53,0.15)" }}
      onClick={() => navigate(`/shops/${shop.id}`)}
      style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,107,53,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          height: "120px",
          background: `linear-gradient(135deg, ${avatarBg}22 0%, #FFB34722 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderBottom: "1px solid rgba(255,107,53,0.06)",
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: `${avatarBg}18`,
        }} />
        <div style={{
          position: "absolute", bottom: -10, left: -10,
          width: 60, height: 60, borderRadius: "50%",
          background: "#FFB34720",
        }} />

        {/* Avatar */}
        <div style={{
          width: 64, height: 64, borderRadius: "18px",
          background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", fontWeight: 700, color: "#fff",
          boxShadow: `0 8px 24px ${avatarBg}44`,
          zIndex: 1,
        }}>
          {initials}
        </div>

        {/* Status Badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          display: "flex", alignItems: "center", gap: "4px",
          padding: "4px 10px", borderRadius: "20px",
          background: status.bg, color: status.color,
          fontSize: "11px", fontWeight: 600,
          border: `1px solid ${status.color}33`,
        }}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px" }}>
        <h3 style={{
          margin: "0 0 6px", fontSize: "16px", fontWeight: 700,
          color: "#1A1A2E", lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {shop.name || "Laundry Shop"}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6b7280", marginBottom: "14px" }}>
          <FiMapPin size={13} color="#FF6B35" />
          <span style={{ fontSize: "13px" }}>{shop.city || "City"}</span>
          {shop.address && (
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              · {shop.address.length > 20 ? shop.address.slice(0, 20) + "…" : shop.address}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: rating ? "#fff7ed" : "#f3f4f6",
              padding: "4px 10px", borderRadius: "20px",
              border: rating ? "1px solid #FFB34744" : "1px solid #e5e7eb",
            }}>
              <FiStar size={12} color={rating ? "#FF6B35" : "#9ca3af"} fill={rating ? "#FF6B35" : "none"} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: rating ? "#FF6B35" : "#9ca3af" }}>
                {rating || "New"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ x: 3 }}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              color: "#FF6B35", fontSize: "13px", fontWeight: 600,
            }}
          >
            View <FiArrowRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;
