import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div>
        <h3>Dashboard</h3>
      </div>

      <div
        style={{
          display: "flex",
          gap: 15,
          alignItems: "center",
        }}
      >
        <Search />

        {/* Notification Button */}
        <button
          onClick={() => navigate("/notifications")}
          style={{
            position: "relative",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <Bell />

          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#7c3aed",
              color: "#fff",
              fontSize: "10px",
              fontWeight: "700",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            4
          </span>
        </button>
      </div>
    </div>
  );
}