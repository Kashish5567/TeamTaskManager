import API from "./axios";

export async function getDashboard() {
  const res = await API.get("/dashboard");
  return res.data;
}

