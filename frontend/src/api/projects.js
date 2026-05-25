import API from "./axios";

export async function getProjects() {
  const res = await API.get("/projects");
  return res.data;
}

export async function createProject({ title, description }) {
  const res = await API.post("/projects", { title, description });
  return res.data.project;
}

export async function addProjectMember(projectId, email) {
  const res = await API.put(`/projects/${projectId}/add-member`, { email });
  return res.data.project;
}

export async function removeProjectMember(projectId, userId) {
  const res = await API.put(`/projects/${projectId}/remove-member`, { userId });
  return res.data.project;
}

