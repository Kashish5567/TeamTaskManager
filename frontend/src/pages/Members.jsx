import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Plus,
  UserPlus,
  Shield,
  ShieldCheck,
  Mail,
  MapPin,
  X,
  CheckCircle,
  FolderPlus,
  ClipboardList,
  Users,
  Search,
} from "lucide-react";
import { getMembers, createMember, updateMember } from "../api/members";
import { colorForId, getInitials } from "../api/utils";
import { useRole } from "../context/Rolecontext";

// ── Mock Data ─────────────────────────────────────────────────────────────────
/* const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Kashish Agrawal",
    role: "Admin",
    jobTitle: "Frontend Developer",
    email: "kashish@email.com",
    location: "Bhopal, India",
    skills: ["React", "TypeScript", "Tailwind"],
    tasksTotal: 12,
    tasksDone: 8,
    avatar: "KA",
    color: "#6c7fe8",
  },
  {
    id: 2,
    name: "Mohit Rawat",
    role: "Member",
    jobTitle: "Backend Developer",
    email: "mohit@email.com",
    location: "Delhi, India",
    skills: ["Node.js", "MongoDB", "Express"],
    tasksTotal: 9,
    tasksDone: 5,
    avatar: "MR",
    color: "#48bb78",
  },
  {
    id: 3,
    name: "Sana Raza",
    role: "Member",
    jobTitle: "UI/UX Designer",
    email: "sana@email.com",
    location: "Mumbai, India",
    skills: ["Figma", "Adobe XD", "CSS"],
    tasksTotal: 7,
    tasksDone: 6,
    avatar: "SR",
    color: "#ed8936",
  },
  {
    id: 4,
    name: "Arjun Kapoor",
    role: "Member",
    jobTitle: "Full Stack Developer",
    email: "arjun@email.com",
    location: "Pune, India",
    skills: ["React", "Node.js", "Docker"],
    tasksTotal: 11,
    tasksDone: 7,
    avatar: "AK",
    color: "#9f7aea",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Member",
    jobTitle: "QA Engineer",
    email: "priya@email.com",
    location: "Bangalore, India",
    skills: ["Testing", "Selenium", "Jira"],
    tasksTotal: 8,
    tasksDone: 8,
    avatar: "PR",
    color: "#f687b3",
  },
];

*/

const INITIAL_PROJECTS = [
  { id: 1, name: "TaskFlow Web App", assignedTo: [1, 2] },
  { id: 2, name: "Mobile Dashboard", assignedTo: [3, 4] },
];

// const CURRENT_USER_ID = 1;

// ── Components ───────────────────────────────────────────────────────────────
function Avatar({ member, size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `${member.color}20`,
        border: `2px solid ${member.color}50`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: member.color,
        flexShrink: 0,
      }}
    >
      {member.avatar}
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "Admin";

  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: isAdmin ? "#EEF2FF" : "#ECFDF5",
        color: isAdmin ? "#4F46E5" : "#059669",
      }}
    >
      {isAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
      {role}
    </span>
  );
}

function ProgressBar({ done, total, color }) {
  const percentage = total === 0 ? 0 : (done / total) * 100;

  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "#E5E7EB",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: color,
        }}
      />
    </div>
  );
}

function Modal({ title, icon, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          padding: 24,
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {icon}
            <h3 style={{ margin: 0 }}>{title}</h3>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#111827",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 9999,
      }}
    >
      <CheckCircle size={16} />
      {msg}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Members() {
  const navigate = useNavigate();
  const { can } = useRole();

  const [members, setMembers] = useState([]);

  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null);

  const [toast, setToast] = useState("");

  const [newProjectName, setNewProjectName] = useState("");

  const [assignTaskForm, setAssignTaskForm] = useState({
    title: "",
    memberId: "",
  });

  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    location: "",
    skill: "",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getMembers();
        if (!alive) return;

        const mapped = (list || []).map((m) => {
          const colors = colorForId(m._id || m.email || m.name);
          return {
            id: m._id,
            name: m.name,
            role: m.role || "Member",
            jobTitle: m.jobTitle || "",
            email: m.email,
            location: m.location || "",
            skills: Array.isArray(m.skills) ? m.skills : [],
            tasksTotal: m.tasksTotal || 0,
            tasksDone: m.tasksDone || 0,
            avatar: m.avatar || getInitials(m.name || m.email),
            color: m.color || colors.color,
          };
        });

        setMembers(mapped);
      } catch {
        if (!alive) return;
        setMembers([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setModal(null);
  };

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // ── Add Member ───────────────────────────────────────────────────────────
  const handleAddMember = () => {
    if (!can("addMember")) return;
    if (!newMemberForm.name || !newMemberForm.email) return;

    const skills = newMemberForm.skill ? newMemberForm.skill.split(",") : [];

    (async () => {
      try {
        const created = await createMember({
          name: newMemberForm.name,
          email: newMemberForm.email,
          jobTitle: newMemberForm.jobTitle,
          location: newMemberForm.location,
          skills: skills.map((s) => s.trim()).filter(Boolean),
          role: "Member",
          avatar: getInitials(newMemberForm.name),
          color: colorForId(newMemberForm.email).color,
        });

        const colors = colorForId(created._id || created.email || created.name);
        setMembers((prev) => [
          ...prev,
          {
            id: created._id,
            name: created.name,
            role: created.role || "Member",
            jobTitle: created.jobTitle || "",
            email: created.email,
            location: created.location || "",
            skills: Array.isArray(created.skills) ? created.skills : [],
            tasksTotal: created.tasksTotal || 0,
            tasksDone: created.tasksDone || 0,
            avatar: created.avatar || getInitials(created.name || created.email),
            color: created.color || colors.color,
          },
        ]);
      } catch {
        // silent
      }
    })();

    setNewMemberForm({
      name: "",
      email: "",
      jobTitle: "",
      location: "",
      skill: "",
    });

    closeModal();

    showToast("Member Added Successfully");
  };

  // ── Create Project ───────────────────────────────────────────────────────
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      assignedTo: [],
    };

    setProjects([...projects, newProject]);

    setNewProjectName("");

    closeModal();

    showToast("Project Created Successfully");
  };

  // ── Assign Task ──────────────────────────────────────────────────────────
  const handleAssignTask = () => {
    if (!can("assignTasks")) return;
    if (!assignTaskForm.title || !assignTaskForm.memberId) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === assignTaskForm.memberId
          ? { ...member, tasksTotal: member.tasksTotal + 1 }
          : member
      )
    );

    (async () => {
      try {
        const target = members.find((m) => m.id === assignTaskForm.memberId);
        if (!target) return;
        const updated = await updateMember(assignTaskForm.memberId, {
          tasksTotal: (target.tasksTotal || 0) + 1,
        });
        setMembers((prev) =>
          prev.map((m) =>
            m.id === assignTaskForm.memberId
              ? {
                  ...m,
                  tasksTotal: updated.tasksTotal ?? m.tasksTotal,
                  tasksDone: updated.tasksDone ?? m.tasksDone,
                }
              : m
          )
        );
      } catch {
        // silent
      }
    })();

    setAssignTaskForm({
      title: "",
      memberId: "",
    });

    closeModal();

    showToast("Task Assigned Successfully");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #D1D5DB",
    marginBottom: 12,
    fontSize: 14,
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Navbar />

        <div style={{ padding: 24 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Members
              </h1>

              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                {members.length} team members
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 10,
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                />

                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "10px 12px 10px 34px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    outline: "none",
                  }}
                />
              </div>

              {can("createProject") && (
                <button
                  onClick={() => setModal("newProject")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FolderPlus size={15} />
                  New Project
                </button>
              )}

              {can("assignTasks") && (
                <button
                  onClick={() => setModal("assignTask")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <ClipboardList size={15} />
                  Assign Task
                </button>
              )}

              {can("addMember") && (
                <button
                  onClick={() => setModal("addMember")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#4F46E5",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <UserPlus size={15} />
                  Add Member
                </button>
              )}
            </div>
          </div>

          {/* Members Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => navigate(`/profile/${member.id}`)}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: 20,
                  cursor: "pointer",
                }}
              >
                {/* Top */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Avatar member={member} />

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 15,
                        }}
                      >
                        {member.name}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#6B7280",
                        }}
                      >
                        {member.jobTitle}
                      </p>
                    </div>
                  </div>

                  <RoleBadge role={member.role} />
                </div>

                {/* Info */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 14,
                    fontSize: 12,
                    color: "#6B7280",
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <Mail size={14} />
                    {member.email}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <MapPin size={14} />
                    {member.location}
                  </div>
                </div>

                {/* Skills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 16,
                  }}
                >
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#F3F4F6",
                        padding: "4px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                        color: "#4B5563",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    <span>
                      <strong>{member.tasksDone}</strong>/
                      {member.tasksTotal} tasks done
                    </span>

                    <span>
                      {member.tasksTotal === 0
                        ? 0
                        : Math.round(
                            (member.tasksDone /
                              member.tasksTotal) *
                              100
                          )}
                      %
                    </span>
                  </div>

                  <ProgressBar
                    done={member.tasksDone}
                    total={member.tasksTotal}
                    color={member.color}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div
            style={{
              marginTop: 28,
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FolderPlus size={16} />
                Active Projects
              </h3>

              <button
                onClick={() => setModal("newProject")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#4F46E5",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Plus size={14} />
                New
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    background: "#F3F4F6",
                    borderRadius: 10,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#4F46E5",
                    }}
                  />

                  <span style={{ fontSize: 13 }}>
                    {project.name}
                  </span>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#6B7280",
                    }}
                  >
                    <Users size={12} />
                    {project.assignedTo.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {modal === "addMember" && (
        <Modal
          title="Add Team Member"
          icon={<UserPlus size={18} color="#4F46E5" />}
          onClose={closeModal}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={newMemberForm.name}
            onChange={(e) =>
              setNewMemberForm({
                ...newMemberForm,
                name: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={newMemberForm.email}
            onChange={(e) =>
              setNewMemberForm({
                ...newMemberForm,
                email: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Job Title"
            value={newMemberForm.jobTitle}
            onChange={(e) =>
              setNewMemberForm({
                ...newMemberForm,
                jobTitle: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Location"
            value={newMemberForm.location}
            onChange={(e) =>
              setNewMemberForm({
                ...newMemberForm,
                location: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={newMemberForm.skill}
            onChange={(e) =>
              setNewMemberForm({
                ...newMemberForm,
                skill: e.target.value,
              })
            }
            style={inputStyle}
          />

          <button
            onClick={handleAddMember}
            style={{
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 10,
              background: "#4F46E5",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Add Member
          </button>
        </Modal>
      )}

      {/* New Project Modal */}
      {modal === "newProject" && (
        <Modal
          title="Create Project"
          icon={<FolderPlus size={18} color="#4F46E5" />}
          onClose={closeModal}
        >
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={handleCreateProject}
            style={{
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 10,
              background: "#4F46E5",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Create Project
          </button>
        </Modal>
      )}

      {/* Assign Task Modal */}
      {modal === "assignTask" && (
        <Modal
          title="Assign Task"
          icon={<ClipboardList size={18} color="#4F46E5" />}
          onClose={closeModal}
        >
          <input
            type="text"
            placeholder="Task Title"
            value={assignTaskForm.title}
            onChange={(e) =>
              setAssignTaskForm({
                ...assignTaskForm,
                title: e.target.value,
              })
            }
            style={inputStyle}
          />

          <select
            value={assignTaskForm.memberId}
            onChange={(e) =>
              setAssignTaskForm({
                ...assignTaskForm,
                memberId: e.target.value,
              })
            }
            style={inputStyle}
          >
            <option value="">Select Member</option>

            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignTask}
            style={{
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 10,
              background: "#4F46E5",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Assign Task
          </button>
        </Modal>
      )}

      <Toast msg={toast} />
    </div>
  );
}
