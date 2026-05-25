import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft, Mail, MapPin, Calendar, Pencil, X, Upload } from "lucide-react";
import { getMe } from "../api/auth";
import { getMyProfile } from "../api/profile";
import { colorForId, getInitials } from "../api/utils";

const usersData = {
  1: {
    id: 1,
    initials: "KA",
    firstName: "Kashish",
    lastName: "Agrawal",
    name: "Kashish Agrawal",
    role: "Frontend Developer",
    badge: "Admin",
    email: "kashish@email.com",
    phone: "+91 98765 43210",
    joined: "Jan 2025",
    location: "Bhopal, India",
    bio: "Passionate frontend developer with 3+ years of experience building scalable React applications. Love clean UI and great UX.",
    skills: [
      { label: "React", bg: "#E6F1FB", color: "#185FA5" },
      { label: "JavaScript", bg: "#EAF3DE", color: "#3B6D11" },
      { label: "TypeScript", bg: "#EEEDFE", color: "#534AB7" },
      { label: "Tailwind", bg: "#FAEEDA", color: "#854F0B" },
      { label: "Figma", bg: "#FBEAF0", color: "#993556" },
      { label: "Node.js", bg: "#E1F5EE", color: "#0F6E56" },
    ],
    stats: {
      assigned: 12,
      completed: 8,
      inProgress: 3,
      overdue: 1,
      completionRate: 67,
      onTimeRate: 85,
      monthlyRate: 83,
      tasksDone: 8,
      streak: 12,
      points: 1240,
    },
    tasks: [
      { id: 1, name: "Design login UI screens", project: "Auth Module", priority: "High", status: "In Progress", due: "May 25", overdue: false },
      { id: 2, name: "Setup JWT middleware", project: "Auth Module", priority: "High", status: "Completed", due: "May 20", overdue: false },
      { id: 3, name: "Build dashboard charts", project: "Dashboard UI", priority: "Medium", status: "Completed", due: "May 18", overdue: false },
      { id: 4, name: "Write API documentation", project: "Backend API", priority: "Low", status: "Pending", due: "May 28", overdue: false },
      { id: 5, name: "Fix mobile responsive bug", project: "Mobile App", priority: "High", status: "Overdue", due: "May 15", overdue: true },
    ],
  },
  2: {
    id: 2,
    initials: "MR",
    firstName: "Mohit",
    lastName: "Rawat",
    name: "Mohit Rawat",
    role: "Backend Developer",
    badge: "Member",
    email: "mohit@email.com",
    phone: "+91 91234 56789",
    joined: "Feb 2025",
    location: "Delhi, India",
    bio: "Backend developer specializing in Node.js and MongoDB. Passionate about building robust APIs.",
    skills: [
      { label: "Node.js", bg: "#E1F5EE", color: "#0F6E56" },
      { label: "MongoDB", bg: "#EAF3DE", color: "#3B6D11" },
      { label: "Express", bg: "#E6F1FB", color: "#185FA5" },
      { label: "Docker", bg: "#EEEDFE", color: "#534AB7" },
    ],
    stats: {
      assigned: 9,
      completed: 5,
      inProgress: 3,
      overdue: 1,
      completionRate: 55,
      onTimeRate: 78,
      monthlyRate: 70,
      tasksDone: 5,
      streak: 7,
      points: 890,
    },
    tasks: [
      { id: 1, name: "Build REST API endpoints", project: "Backend API", priority: "High", status: "In Progress", due: "May 26", overdue: false },
      { id: 2, name: "Database schema design", project: "Backend API", priority: "High", status: "Completed", due: "May 19", overdue: false },
      { id: 3, name: "Setup Docker container", project: "Mobile App", priority: "Medium", status: "Pending", due: "May 30", overdue: false },
    ],
  },
};

const priorityStyle = {
  High: { bg: "#FCEBEB", color: "#A32D2D" },
  Medium: { bg: "#FAEEDA", color: "#854F0B" },
  Low: { bg: "#EAF3DE", color: "#3B6D11" },
};

const statusStyle = {
  "In Progress": { bg: "#E6F1FB", color: "#185FA5" },
  Completed: { bg: "#EAF3DE", color: "#3B6D11" },
  Pending: { bg: "#FAEEDA", color: "#854F0B" },
  Overdue: { bg: "#FCEBEB", color: "#A32D2D" },
};

const skillColors = [
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#EAF3DE", color: "#3B6D11" },
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#FBEAF0", color: "#993556" },
  { bg: "#E1F5EE", color: "#0F6E56" },
];

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUser = usersData[id];

  const [user, setUser] = useState(baseUser || usersData[1]);
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fallbackUser = useMemo(() => baseUser || usersData[1], [baseUser]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [me, profile] = await Promise.all([getMe(), getMyProfile()]);
        if (!alive) return;

        const fullName = me?.name || fallbackUser?.name || "User";
        const parts = String(fullName).trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ");
        const colors = colorForId(me?._id || me?.email || fullName);

        const skills = Array.isArray(profile?.skills) ? profile.skills : [];
        const skillBadges = skills.map((label, idx) => {
          const c = skillColors[idx % skillColors.length];
          return { label, bg: c.bg, color: c.color };
        });

        setUser((prev) => ({
          ...(prev || fallbackUser),
          id: me?._id || prev?.id,
          initials: getInitials(fullName),
          firstName,
          lastName,
          name: fullName,
          email: me?.email || prev?.email,
          badge: prev?.badge || "Member",
          role: prev?.role || "Team Member",
          location: prev?.location || "",
          bio: profile?.bio ?? prev?.bio ?? "",
          skills: skillBadges.length ? skillBadges : prev?.skills,
          color: colors.color,
        }));
      } catch {
        // keep mock data
      }
    })();

    return () => {
      alive = false;
    };
  }, [fallbackUser]);


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    newSkill: "",
  });

  const openEdit = () => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      skills: [...user.skills],
      newSkill: "",
    });
    setShowEdit(true);
  };

  const handleSave = () => {
    setUser({
      ...user,
      firstName: form.firstName,
      lastName: form.lastName,
      name: `${form.firstName} ${form.lastName}`,
      initials: `${form.firstName[0]}${form.lastName[0]}`.toUpperCase(),
      role: form.role,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      skills: form.skills,
    });
    setShowEdit(false);
  };

  const removeSkill = (index) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && form.newSkill.trim()) {
      const colorIndex = form.skills.length % skillColors.length;
      setForm({
        ...form,
        skills: [...form.skills, { label: form.newSkill.trim(), ...skillColors[colorIndex] }],
        newSkill: "",
      });
    }
  };

  if (!user) {
    return (
      <div style={{ display: "flex", background: "#F9FAFB", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#6B7280" }}>User not found.</p>
        </div>
      </div>
    );
  }

  const tabs = ["Overview", "Tasks", "Stats"];

  return (
    <div style={{ display: "flex", background: "#F9FAFB", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Navbar />

        {/* Breadcrumb */}
        <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0 20px", height: 48, display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
          >
            <ArrowLeft size={14} /> Members
          </button>
          <span style={{ color: "#D1D5DB", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{user.name}</span>
        </div>

        <div style={{ padding: 24 }}>

          {/* Profile Header */}
          <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E6F1FB", color: "#185FA5", fontSize: 24, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {user.initials}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{user.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: user.badge === "Admin" ? "#E6F1FB" : "#EAF3DE", color: user.badge === "Admin" ? "#185FA5" : "#3B6D11" }}>
                    {user.badge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>{user.role}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={13} /> {user.email}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {user.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> Joined {user.joined}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, maxWidth: 480 }}>{user.bio}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, flexShrink: 0 }}>
              <button
                onClick={openEdit}
                style={{ background: "#4F6EF7", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Pencil size={14} /> Edit Profile
              </button>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#3B6D11" }}>{user.stats.tasksDone}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Tasks Done</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#854F0B" }}>{user.stats.streak} days</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Streak</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#185FA5" }}>{user.stats.points.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>Points</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "white", border: "1px solid #E5E7EB", borderRadius: 8, padding: 4, width: "fit-content" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  background: activeTab === tab.toLowerCase() ? "#4F6EF7" : "none",
                  color: activeTab === tab.toLowerCase() ? "white" : "#6B7280",
                  border: "none",
                  padding: "7px 18px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: activeTab === tab.toLowerCase() ? 500 : 400,
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Skills</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(user.skills || []).map((skill, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20, background: skill.bg, color: skill.color }}>{skill.label}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Contact Details</p>
                {[
                  { label: "Email", value: user.email, icon: <Mail size={15} /> },
                  { label: "Phone", value: user.phone, icon: <span style={{ fontSize: 15 }}>📞</span> },
                  { label: "Location", value: user.location, icon: <MapPin size={15} /> },
                  { label: "Member Since", value: user.joined, icon: <Calendar size={15} /> },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9CA3AF" }}>{item.label}</p>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Assigned tasks</p>
              {(user.tasks || []).map((task, index) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: index === (user.tasks || []).length - 1 ? "none" : "1px solid #F3F4F6" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{task.name}</p>
                    <p style={{ fontSize: 11, color: "#6B7280" }}>{task.project}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: priorityStyle[task.priority].bg, color: priorityStyle[task.priority].color }}>{task.priority}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: statusStyle[task.status].bg, color: statusStyle[task.status].color }}>{task.status}</span>
                    <span style={{ fontSize: 11, color: task.overdue ? "#A32D2D" : "#6B7280" }}>{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { label: "Assigned tasks", value: user.stats.assigned, sub: "Total" },
                  { label: "Completed", value: user.stats.completed, sub: `${user.stats.completionRate}% done` },
                  { label: "In progress", value: user.stats.inProgress, sub: "Active" },
                  { label: "Overdue", value: user.stats.overdue, sub: "Need attention" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#F9FAFB", borderRadius: 8, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 600 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Productivity</p>
                {[
                  { label: "Task completion rate", value: user.stats.completionRate, color: "#4F6EF7" },
                  { label: "On-time delivery", value: user.stats.onTimeRate, color: "#10B981" },
                  { label: "This month tasks", value: user.stats.monthlyRate, color: "#A78BFA" },
                ].map((bar, i, arr) => (
                  <div key={i} style={{ marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginBottom: 5 }}>
                      <span>{bar.label}</span><span>{bar.value}%</span>
                    </div>
                    <div style={{ height: 4, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${bar.value}%`, height: "100%", background: bar.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 24, width: 500, border: "1px solid #E5E7EB", maxHeight: "90vh", overflowY: "auto" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Edit Profile</p>
              <button onClick={() => setShowEdit(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#6B7280" /></button>
            </div>

            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#E6F1FB", color: "#185FA5", fontSize: 18, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.firstName?.[0]}{form.lastName?.[0]}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Profile photo</p>
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>JPG, PNG up to 2MB</p>
                <button style={{ background: "none", border: "1px solid #E5E7EB", padding: "6px 12px", borderRadius: 6, fontSize: 12, color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Upload size={12} /> Change photo
                </button>
              </div>
            </div>

            {/* Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>First name</label>
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Last name</label>
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
              </div>
            </div>

            {/* Role + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Role / Title</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13, height: 80, resize: "none" }} />
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B7280", marginBottom: 5 }}>Skills <span style={{ fontWeight: 400 }}>(press Enter to add)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", minHeight: 44 }}>
                {form.skills.map((skill, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: skill.bg, color: skill.color }}>
                    {skill.label}
                    <button onClick={() => removeSkill(i)} style={{ background: "none", border: "none", cursor: "pointer", color: skill.color, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
                <input
                  value={form.newSkill}
                  onChange={(e) => setForm({ ...form, newSkill: e.target.value })}
                  onKeyDown={addSkill}
                  placeholder="Add skill..."
                  style={{ border: "none", background: "none", outline: "none", fontSize: 12, color: "#6B7280", minWidth: 80 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
              <button onClick={() => setShowEdit(false)} style={{ background: "none", border: "1px solid #E5E7EB", padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#6B7280" }}>Cancel</button>
              <button onClick={handleSave} style={{ background: "#4F6EF7", color: "white", border: "none", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
