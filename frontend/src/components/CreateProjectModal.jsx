import { X } from "lucide-react";

export default function CreateProjectModal({ onClose, onCreate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onCreate({
      name: formData.get("name"),
      description: formData.get("description"),
      email: formData.get("email"),
    });
    onClose();
  };

  return (
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
          width: 400,
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
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Create new project</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={18} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#6B7280",
                marginBottom: 5,
              }}
            >
              Project name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Auth Module"
              style={{
                width: "100%",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "#6B7280",
                marginBottom: 5,
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="What is this project about?"
              style={{
                width: "100%",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 13,
                height: 70,
                resize: "none",
              }}
            />
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
              Invite members (email)
            </label>
            <input
              name="email"
              type="email"
              placeholder="teammate@email.com"
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
              type="button"
              onClick={onClose}
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
              type="submit"
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
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}