import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiSliders, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { getAllShops } from "../services/api";
import ShopCard from "../components/ShopCard";
import Loader from "../components/Loader";

const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.city = search;
      const data = await getAllShops(params);
      setShops(Array.isArray(data) ? data : data?.shops || []);
    } catch (err) {
      toast.error("Failed to load shops.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setSelectedCity("All");
  };

  const handleCityFilter = (city) => {
    setSelectedCity(city);
    setSearch(city === "All" ? "" : city);
    setSearchInput(city === "All" ? "" : city);
  };

  const clearSearch = () => {
    setSearch(""); setSearchInput(""); setSelectedCity("All");
  };

  const approvedShops = shops.filter((s) => s.approval_status === "approved");

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Hero Search Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213e 60%, #0f3460 100%)",
        padding: "80px 24px 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative */}
        {[
          { s: 300, top: "-100px", right: "-80px", op: 0.05 },
          { s: 180, bottom: "-60px", left: "5%", op: 0.04 },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", width: o.s, height: o.s, borderRadius: "50%",
            background: "#FF6B35", opacity: o.op,
            top: o.top, right: o.right, bottom: o.bottom, left: o.left,
          }} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center", position: "relative" }}
        >
          <p style={{ color: "#FF6B35", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "12px" }}>
            🧺 LAUNDRY CONNECT
          </p>
          <h1 style={{
            color: "#fff", fontSize: "clamp(28px, 5vw, 46px)",
            fontWeight: 800, margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-1px",
          }}>
            Find Laundry Shops<br />
            <span style={{ color: "#FF6B35" }}>Near You</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginBottom: "32px" }}>
            Browse verified shops, compare services, and book with ease
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div style={{
              display: "flex", gap: "0", borderRadius: "16px", overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              background: "#fff",
            }}>
              <div style={{
                display: "flex", alignItems: "center", padding: "0 16px",
                borderRight: "1px solid #f3f4f6", flexShrink: 0,
              }}>
                <FiMapPin size={18} color="#FF6B35" />
              </div>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by city (e.g. Mumbai, Delhi)…"
                style={{
                  flex: 1, padding: "18px 16px", border: "none", outline: "none",
                  fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "#1A1A2E",
                  background: "transparent",
                }}
              />
              {searchInput && (
                <button type="button" onClick={clearSearch}
                  style={{ padding: "0 12px", border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <FiX size={16} />
                </button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "18px 28px", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #FF6B35, #FFB347)",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  fontFamily: "Poppins, sans-serif",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                <FiSearch size={16} /> Search
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* City Pills */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "16px 24px" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px",
        }}>
          {CITIES.map((city) => (
            <motion.button
              key={city}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCityFilter(city)}
              style={{
                padding: "8px 18px", borderRadius: "20px", border: "none",
                background: selectedCity === city
                  ? "linear-gradient(135deg, #FF6B35, #FFB347)"
                  : "#f3f4f6",
                color: selectedCity === city ? "#fff" : "#6b7280",
                fontWeight: selectedCity === city ? 700 : 500,
                fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "Poppins, sans-serif",
                boxShadow: selectedCity === city ? "0 4px 14px rgba(255,107,53,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {city}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Results Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1A1A2E" }}>
              {search ? `Shops in "${search}"` : "All Verified Shops"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#9ca3af" }}>
              {loading ? "Loading…" : `${approvedShops.length} shop${approvedShops.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px",
            borderRadius: "10px", background: "#f9fafb", border: "1px solid #e5e7eb",
            color: "#6b7280", fontSize: "13px", cursor: "pointer",
          }}>
            <FiSliders size={14} /> Filters
          </div>
        </div>

        {/* Grid or States */}
        {loading ? (
          <Loader />
        ) : approvedShops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "80px 20px" }}
          >
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: "#1A1A2E", fontSize: "20px", fontWeight: 700 }}>No shops found</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Try a different city name or{" "}
              <span style={{ color: "#FF6B35", cursor: "pointer", fontWeight: 600 }} onClick={clearSearch}>
                browse all shops
              </span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <AnimatePresence>
              {approvedShops.map((shop, i) => (
                <ShopCard key={shop.id} shop={shop} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shops; 
