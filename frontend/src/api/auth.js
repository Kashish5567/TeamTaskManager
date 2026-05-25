import API from "./axios";

export async function getMe() {
  const res = await API.get("/auth/me");
  return res.data;
}

