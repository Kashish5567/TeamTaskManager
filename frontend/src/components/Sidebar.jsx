import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Users,
} from "lucide-react";
import { useRole } from "../context/Rolecontext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Projects", icon: Folder, path: "/projects" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Members", icon: Users, path: "/members" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setCurrentRole } = useRole();

  return (
    <div
      style={{
        width: 220,
        background: "white",
        borderRight: "1px solid #E5E7EB",
        padding: 20,
        minHeight: "100vh",
      }}
    >
      <h2>TaskFlow</h2>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 11, color: "#6B7280", display: "block", marginBottom: 6 }}>
          Role (UI)
        </label>
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "7px 10px",
            fontSize: 13,
            background: "#fff",
            color: "#111827",
          }}
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      <div style={{ marginTop: 30 }}>
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <div
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 4,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "#4F6EF7" : "#6B7280",
                background: isActive ? "#EEF2FF" : "transparent",
              }}
            >
              <Icon size={18} />
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
