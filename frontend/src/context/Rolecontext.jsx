import { createContext, useContext, useState } from "react";

const PERMISSIONS = {
  admin: {
    createProject: true,
    assignTasks:   true,
    deleteTasks:   true,
    addMember:     true,
    removeMember:  true,
    viewProject:   true,
  },
  member: {
    createProject: false,
    assignTasks:   true,
    deleteTasks:   false,
    addMember:     false,
    removeMember:  false,
    viewProject:   true,
  },
  viewer: {
    createProject: false,
    assignTasks:   false,
    deleteTasks:   false,
    addMember:     false,
    removeMember:  false,
    viewProject:   true,
  },
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem("ttm_role") || "admin";
  });

  const setRole = (role) => {
    setCurrentRole(role);
    localStorage.setItem("ttm_role", role);
  };

  const can = (permission) => {
    return PERMISSIONS[currentRole]?.[permission] ?? false;
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole: setRole, can, PERMISSIONS }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

export { PERMISSIONS };
