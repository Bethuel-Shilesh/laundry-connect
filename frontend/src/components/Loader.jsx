import { motion } from "framer-motion";

const Loader = ({ size = 48, fullScreen = false }) => {
  const spinner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `4px solid rgba(255, 107, 53, 0.15)`,
          borderTopColor: "#FF6B35",
          borderRightColor: "#FFB347",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "13px",
          color: "#FF6B35",
          fontWeight: 500,
          letterSpacing: "0.05em",
          margin: 0,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
      {spinner}
    </div>
  );
};

export default Loader;
