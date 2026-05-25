import API from "./axios";

export async function getProjectTasks(projectId) {
  const res = await API.get(`/tasks/project/${projectId}`);
  return res.data;
}

export async function createTask(payload) {
  const res = await API.post("/tasks", payload);
  return res.data.task;
}

export async function updateTask(taskId, payload) {
  const res = await API.put(`/tasks/${taskId}`, payload);
  return res.data.task;
}

export async function updateTaskStatus(taskId, status) {
  const res = await API.put(`/tasks/${taskId}/status`, { status });
  return res.data.task;
}

export async function deleteTask(taskId) {
  const res = await API.delete(`/tasks/${taskId}`);
  return res.data;
}

