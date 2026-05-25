import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { UserPlus, ArrowLeft, X } from "lucide-react";
import { getProjects, addProjectMember, removeProjectMember } from "../api/projects";
import { getProjectTasks } from "../api/tasks";
import { colorForId, getInitials, mapTaskStatusFromApi } from "../api/utils";
import { useRole } from "../context/Rolecontext";

/* const projectsData = {
  1: {
    id: 1,
    name: "Auth Module",
    description: "Login, register & JWT token management system",
    role: "Admin",
    progress: 65,
    icon: "💻",
    iconBg: "#E6F1FB",
    completedTasks: 13,
    totalTasks: 20,
    members: [
      { id: 1, initials: "KA", name: "Kashish Agrawal", email: "kashish@email.com", role: "Admin", bg: "#E6F1FB", color: "#185FA5" },
      { id: 2, initials: "MR", name: "Mohit Rawat", email: "mohit@email.com", role: "Member", bg: "#EAF3DE", color: "#3B6D11" },
      { id: 3, initials: "SR", name: "Sana Raza", email: "sana@email.com", role: "Member", bg: "#FAEEDA", color: "#854F0B" },
      { id: 4, initials: "AK", name: "Arjun Kapoor", email: "arjun@email.com", role: "Member", bg: "#EEEDFE", color: "#534AB7" },
      { id: 5, initials: "PR", name: "Priya Sharma", email: "priya@email.com", role: "Member", bg: "#FBEAF0", color: "#993556" },
    ],
  },
  2: {
    id: 2,
    name: "Dashboard UI",
    description: "Analytics dashboard with charts and stats cards",
    role: "Admin",
    progress: 80,
    icon: "📊",
    iconBg: "#EAF3DE",
    completedTasks: 8,
    totalTasks: 10,
    members: [
      { id: 1, initials: "KA", name: "Kashish Agrawal", email: "kashish@email.com", role: "Admin", bg: "#E6F1FB", color: "#185FA5" },
      { id: 2, initials: "PR", name: "Priya Sharma", email: "priya@email.com", role: "Member", bg: "#FBEAF0", color: "#993556" },
    ],
  },
  3: {
    id: 3,
    name: "Mobile App",
    description: "React Native mobile application for task management",
    role: "Member",
    progress: 30,
    icon: "📱",
    iconBg: "#FAEEDA",
    completedTasks: 6,
    totalTasks: 20,
    members: [
      { id: 1, initials: "MR", name: "Mohit Rawat", email: "mohit@email.com", role: "Admin", bg: "#EAF3DE", color: "#3B6D11" },
      { id: 2, initials: "SR", name: "Sana Raza", email: "sana@email.com", role: "Member", bg: "#FAEEDA", color: "#854F0B" },
      { id: 3, initials: "AK", name: "Arjun Kapoor", email: "arjun@email.com", role: "Member", bg: "#EEEDFE", color: "#534AB7" },
    ],
  },
  4: {
    id: 4,
    name: "Backend API",
    description: "Node.js REST API with MongoDB integration",
    role: "Member",
    progress: 50,
    icon: "🖥️",
    iconBg: "#EEEDFE",
    completedTasks: 10,
    totalTasks: 20,
    members: [
      { id: 1, initials: "KA", name: "Kashish Agrawal", email: "kashish@email.com", role: "Admin", bg: "#E6F1FB", color: "#185FA5" },
      { id: 2, initials: "AK", name: "Arjun Kapoor", email: "arjun@email.com", role: "Member", bg: "#EEEDFE", color: "#534AB7" },
      { id: 3, initials: "SR", name: "Sana Raza", email: "sana@email.com", role: "Member", bg: "#FAEEDA", color: "#854F0B" },
      { id: 4, initials: "MR", name: "Mohit Rawat", email: "mohit@email.com", role: "Member", bg: "#EAF3DE", color: "#3B6D11" },
    ],
  },
}; */

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = useRole();
  const [projectRaw, setProjectRaw] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getProjects();
        if (!alive) return;
        const found = list.find((p) => p._id === id) || null;
        setProjectRaw(found);
        setMembers(found?.members || []);

        if (found?._id) {
          try {
            const t = await getProjectTasks(found._id);
            if (!alive) return;
            setTasks(t);
          } catch {
            if (!alive) return;
            setTasks([]);
          }
        }
      } catch {
        if (!alive) return;
        setProjectRaw(null);
        setTasks([]);
        setMembers([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const project = useMemo(() => {
    if (!projectRaw) return null;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => mapTaskStatusFromApi(t.status) === "completed"
    ).length;
    const progress = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    const iconBg = "#E6F1FB";
    const icon = "📁";

    return {
      id: projectRaw._id,
      name: projectRaw.title,
      description: projectRaw.description || "",
      role: "Member",
      progress,
      icon,
      iconBg,
      completedTasks,
      totalTasks,
    };
  }, [projectRaw, tasks]);

  if (!project) {
    return (
      <div style={{ display: "flex", background: "#F9FAFB", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#6B7280" }}>Project not found.</p>
        </div>
      </div>
    );
  }

  const membersView = members.map((m) => {
    const colors = colorForId(m._id || m.email || m.name);
    return {
      id: m._id,
      initials: getInitials(m.name || m.email),
      name: m.name || m.email,
      email: m.email,
      role: "Member",
      bg: colors.bg,
      color: colors.color,
    };
  });

  const handleRemove = async (memberId) => {
    if (!can("removeMember")) return;
    try {
      const updated = await removeProjectMember(project.id, memberId);
      setMembers(updated.members || []);
    } catch {
      // silent
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    if (!can("addMember")) return;
    try {
      const updated = await addProjectMember(project.id, inviteEmail);
      setMembers(updated.members || []);
      setInviteEmail("");
      setShowInvite(false);
    } catch {
      // silent
    }
  };

  return (
    <div style={{ display: "flex", background: "#F9FAFB", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Navbar />

        {/* Breadcrumb */}
        <div
          style={{
            background: "white",
            borderBottom: "1px solid #E5E7EB",
            padding: "0 20px",
            height: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            onClick={() => navigate("/projects")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6B7280",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ArrowLeft size={14} /> Projects
          </button>
          <span style={{ color: "#D1D5DB", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
            {project.name}
          </span>
        </div>

        <div style={{ padding: 24 }}>

          {/* Project Header */}
          <div
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: project.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {project.icon}
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 3 }}>
                    {project.name}
                  </p>
                  <p style={{ fontSize: 13, color: "#6B7280" }}>
                    {project.description}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: project.role === "Admin" ? "#E6F1FB" : "#EAF3DE",
                  color: project.role === "Admin" ? "#185FA5" : "#3B6D11",
                }}
              >
                {project.role}
              </span>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Total tasks</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{project.totalTasks}</p>
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Completed</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{project.completedTasks}</p>
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Progress</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{project.progress}%</p>
                <div style={{ height: 4, background: "#E5E7EB", borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
                  <div style={{ width: `${project.progress}%`, height: "100%", background: "#4F6EF7", borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600 }}>
                Team members ({membersView.length})
              </p>
              <button
                onClick={() => setShowInvite(true)}
                style={{
                  background: "#4F6EF7",
                  color: "white",
                  border: "none",
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <UserPlus size={14} /> Invite member
              </button>
            </div>

            {membersView.map((member, index) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: index === membersView.length - 1 ? "none" : "1px solid #F3F4F6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: member.bg,
                      color: member.color,
                      fontSize: 12,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{member.name}</p>
                    <p style={{ fontSize: 11, color: "#6B7280" }}>{member.email}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 8px",
                      borderRadius: 20,
                      background: member.role === "Admin" ? "#E6F1FB" : "#EAF3DE",
                      color: member.role === "Admin" ? "#185FA5" : "#3B6D11",
                    }}
                  >
                    {member.role}
                  </span>
                  {member.role !== "Admin" && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      style={{
                        background: "none",
                        border: "1px solid #E5E7EB",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        color: "#A32D2D",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              width: 380,
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 600 }}>Invite member</p>
              <button
                onClick={() => setShowInvite(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18} color="#6B7280" />
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6B7280",
                  marginBottom: 5,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="teammate@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowInvite(false)}
                style={{
                  background: "none",
                  border: "1px solid #E5E7EB",
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  color: "#6B7280",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                style={{
                  background: "#4F6EF7",
                  color: "white",
                  border: "none",
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
